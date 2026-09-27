/**
 * Shared engine for file-based tools:
 * accessible dropzone, validation, list, statuses, removal, reordering, ZIP.
 *
 * Usage: mountFileTool(rootEl, config)
 * config.process(file|item) → { blob, name, meta }  (or throws an Error with a user-facing message)
 * config.summary === true → the engine maintains a batch summary in [data-summary]
 */
import { validateFile, MAX_FILE_BYTES } from './files.js';
import { formatBytes } from './format.js';
import { toast, downloadBlob } from './ui.js';

let uid = 0;

export function mountFileTool(root, config = {}) {
  const {
    acceptTypes = [],
    acceptExts = [],
    multiple = true,
    maxFiles = 40,
    withThumb = true,
    reorderable = false,
    process = null,
    autoProcess = true,
    itemMeta = null, // fn(item) → extra meta html (e.g. page count)
    onListChange = () => {},
    summary = false,
    onHandoff = null, // fn(item) called when an item is done
  } = config;

  const input = root.querySelector('[data-file-input]');
  const dz = root.querySelector('[data-dropzone]');
  const listEl = root.querySelector('[data-file-list]');
  const noticeEl = root.querySelector('[data-notice]');
  const clearBtn = root.querySelector('[data-clear-all]');
  const zipBtn = root.querySelector('[data-download-all]');
  const countEl = root.querySelector('[data-count]');
  const summaryEl = summary ? root.querySelector('[data-summary]') : null;

  if (input && (acceptTypes.length || acceptExts.length)) {
    const accept = [...acceptTypes, ...acceptExts].join(',');
    if (accept) input.setAttribute('accept', accept);
  }

  const state = { items: [] };

  /* ---------- Inline notices ---------- */
  function showNotice(message, type = 'error') {
    if (!noticeEl) return;
    noticeEl.innerHTML = '';
    if (!message) {
      noticeEl.hidden = true;
      return;
    }
    noticeEl.hidden = false;
    const div = document.createElement('div');
    div.className = `notice notice-${type}`;
    div.setAttribute('role', type === 'error' ? 'alert' : 'status');
    div.textContent = message;
    noticeEl.appendChild(div);
  }

  /* ---------- Adding files ---------- */
  function addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const rejected = [];
    let added = 0;

    for (const file of files) {
      if (state.items.length >= maxFiles) {
        rejected.push(`Limit of ${maxFiles} files reached — “${file.name}” was not added.`);
        continue;
      }
      const check = validateFile(file, { acceptTypes, acceptExts, maxBytes: MAX_FILE_BYTES });
      if (!check.ok) {
        rejected.push(check.error);
        continue;
      }
      const item = createItem(file);
      state.items.push(item);
      renderItem(item);
      added++;
      if (autoProcess && process) processItem(item);
    }

    if (rejected.length) {
      showNotice(rejected[0] + (rejected.length > 1 ? ` (+${rejected.length - 1} more file(s) rejected)` : ''), 'error');
      toast(rejected[0], 'error');
    } else {
      showNotice('');
    }
    if (added) sync();
  }

  function createItem(file) {
    return {
      id: ++uid,
      file,
      status: 'pending', // pending | working | done | error
      error: null,
      result: null,
      el: null,
    };
  }

  /* ---------- Item rendering ---------- */
  function renderItem(item) {
    const el = document.createElement('li');
    el.className = 'file-item';
    el.dataset.id = item.id;
    if (reorderable) el.draggable = false; // reordering goes through the buttons

    const isImage = item.file.type.startsWith('image/');
    const thumbHtml = withThumb && isImage
      ? `<img class="thumb" alt="" />`
      : `<div class="thumb thumb-placeholder" aria-hidden="true">${extBadge(item.file.name)}</div>`;

    el.innerHTML = `
      ${thumbHtml}
      <div class="fi-body">
        <div class="fi-name"></div>
        <div class="fi-meta"></div>
      </div>
      <div class="fi-actions">
        <span class="fi-status" aria-live="polite"></span>
      </div>`;

    el.querySelector('.fi-name').textContent = item.file.name;
    updateMeta(item);

    if (withThumb && isImage) {
      const img = el.querySelector('.thumb');
      const url = URL.createObjectURL(item.file);
      img.src = url;
      img.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
      item._thumbUrl = url;
    }

    const actions = el.querySelector('.fi-actions');

    if (reorderable) {
      const mv = (dir) => {
        const i = state.items.indexOf(item);
        const j = i + dir;
        if (j < 0 || j >= state.items.length) return;
        [state.items[i], state.items[j]] = [state.items[j], state.items[i]];
        renderList();
        sync();
      };
      actions.insertAdjacentHTML('afterbegin', `
        <button type="button" class="icon-btn" data-mv-up aria-label="Move up" title="Move up">↑</button>
        <button type="button" class="icon-btn" data-mv-down aria-label="Move down" title="Move down">↓</button>`);
      el.querySelector('[data-mv-up]').addEventListener('click', () => mv(-1));
      el.querySelector('[data-mv-down]').addEventListener('click', () => mv(1));
    }

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'icon-btn';
    removeBtn.setAttribute('aria-label', `Remove ${item.file.name}`);
    removeBtn.title = 'Remove';
    removeBtn.innerHTML = '✕';
    removeBtn.addEventListener('click', () => removeItem(item));
    actions.appendChild(removeBtn);

    item.el = el;
    listEl.appendChild(el);
  }

  function extBadge(name) {
    const ext = (name.split('.').pop() || '?').toUpperCase().slice(0, 4);
    return `<span style="font-size:.62rem;font-weight:700;letter-spacing:.05em">${ext}</span>`;
  }

  function updateMeta(item) {
    const meta = item.el?.querySelector('.fi-meta');
    if (!meta) return;
    if (item.status === 'error' && item.error) {
      meta.textContent = item.error;
      return;
    }
    const parts = [formatBytes(item.file.size)];
    if (item.status === 'done' && item.result?.blob) {
      const saved = 1 - item.result.blob.size / item.file.size;
      parts.push(`→ ${formatBytes(item.result.blob.size)}`);
      if (Number.isFinite(saved)) parts.push(`(${saved >= 0 ? '−' : '+'}${Math.abs(Math.round(saved * 100))} %)`);
    }
    if (itemMeta) {
      const extra = itemMeta(item);
      if (extra) parts.push(extra);
    }
    meta.textContent = parts.join(' ');
  }

  function updateStatus(item) {
    const el = item.el;
    if (!el) return;
    el.classList.remove('is-error', 'is-done');
    const status = el.querySelector('.fi-status');
    const actions = el.querySelector('.fi-actions');
    actions.querySelector('[data-download]')?.remove();
    actions.querySelector('[data-retry]')?.remove();

    if (item.status === 'working') {
      status.textContent = 'Processing…';
      status.className = 'fi-status';
    } else if (item.status === 'done') {
      el.classList.add('is-done');
      status.textContent = 'Done';
      status.className = 'fi-status ok';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-ghost';
      btn.dataset.download = '';
      btn.textContent = 'Download';
      btn.addEventListener('click', () => {
        if (item.result?.blob) {
          downloadBlob(item.result.blob, item.result.name);
          btn.textContent = 'Downloaded ✓';
          setTimeout(() => (btn.textContent = 'Download'), 2200);
        }
      });
      actions.insertBefore(btn, actions.querySelector('.icon-btn'));
    } else if (item.status === 'error') {
      el.classList.add('is-error');
      status.textContent = 'Failed';
      status.className = 'fi-status err';
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-sm btn-ghost';
      retry.dataset.retry = '';
      retry.textContent = 'Retry';
      retry.addEventListener('click', () => processItem(item));
      actions.insertBefore(retry, actions.querySelector('.icon-btn'));
    } else {
      status.textContent = '';
      status.className = 'fi-status';
    }
    updateMeta(item);
  }

  /* ---------- Processing ---------- */
  async function processItem(item) {
    if (!process) return;
    item.status = 'working';
    item.error = null;
    updateStatus(item);
    try {
      const result = await process(item);
      if (!result?.blob) throw new Error('Processing produced no result.');
      item.result = result;
      item.status = 'done';
      if (onHandoff) {
        try { onHandoff(item); } catch { /* handoff must never break the flow */ }
      }
    } catch (err) {
      item.status = 'error';
      item.error = err?.message || 'Something unexpected happened while processing this file.';
    }
    updateStatus(item);
    sync();
  }

  /** Re-run processing for ALL files (needed when options change). */
  async function processAll() {
    await Promise.all(state.items.map((i) => processItem(i)));
  }

  /* ---------- Removal / reset ---------- */
  function removeItem(item) {
    const i = state.items.indexOf(item);
    if (i >= 0) state.items.splice(i, 1);
    if (item._thumbUrl) URL.revokeObjectURL(item._thumbUrl);
    item.el?.remove();
    sync();
  }

  function clear() {
    for (const item of state.items) {
      if (item._thumbUrl) URL.revokeObjectURL(item._thumbUrl);
      item.el?.remove();
    }
    state.items = [];
    showNotice('');
    sync();
  }

  function renderList() {
    listEl.innerHTML = '';
    for (const item of state.items) {
      listEl.appendChild(item.el);
      updateStatus(item);
    }
  }

  /* ---------- Batch summary ---------- */
  function refreshSummary() {
    if (!summaryEl) return;
    const items = state.items;
    const done = items.filter((i) => i.status === 'done' && i.result?.blob);
    const failed = items.filter((i) => i.status === 'error');
    const set = (sel, val) => {
      const el = summaryEl.querySelector(sel);
      if (el) el.textContent = val;
    };
    const show = done.length > 0;
    summaryEl.hidden = !show;
    if (!show) return;
    const before = items.reduce((s, i) => s + i.file.size, 0);
    const after = done.reduce((s, i) => s + i.result.blob.size, 0);
    const saved = before - after;
    set('[data-sum-count]', String(items.length));
    set('[data-sum-done]', String(done.length));
    set('[data-sum-failed]', String(failed.length));
    set('[data-sum-before]', formatBytes(before));
    set('[data-sum-after]', formatBytes(after));
    set('[data-sum-saved]', saved >= 0 ? `−${Math.round((saved / Math.max(1, before)) * 100)} %` : '—');
  }

  /* ---------- ZIP ---------- */
  async function downloadAllZip() {
    const done = state.items.filter((i) => i.status === 'done' && i.result?.blob);
    if (!done.length) {
      toast('No files ready to download yet.', 'error');
      return;
    }
    try {
      zipBtn.disabled = true;
      zipBtn.textContent = 'Preparing ZIP…';
      const { zipSync } = await import('fflate');
      const entries = {};
      const usedNames = new Set();
      for (const item of done) {
        let name = item.result.name;
        if (usedNames.has(name)) {
          const dot = name.lastIndexOf('.');
          name = dot > 0 ? `${name.slice(0, dot)}-${item.id}${name.slice(dot)}` : `${name}-${item.id}`;
        }
        usedNames.add(name);
        entries[name] = new Uint8Array(await item.result.blob.arrayBuffer());
      }
      const zipped = zipSync(entries);
      downloadBlob(new Blob([zipped], { type: 'application/zip' }), 'quicktools-export.zip');
      toast(`${done.length} file(s) downloaded as a ZIP.`, 'success');
    } catch {
      toast('Creating the ZIP failed — please download the files one by one.', 'error');
    } finally {
      zipBtn.disabled = false;
      zipBtn.textContent = zipBtn.dataset.label || 'Download all (ZIP)';
    }
  }

  function sync() {
    const n = state.items.length;
    if (countEl) countEl.textContent = n ? `${n} file${n > 1 ? 's' : ''}` : '';
    const hasDone = state.items.some((i) => i.status === 'done');
    if (clearBtn) clearBtn.hidden = n === 0;
    if (zipBtn) zipBtn.hidden = !hasDone || n < 1;
    if (dz) dz.hidden = n > 0 && !multiple;
    dz?.classList.toggle('compact', n > 0);
    refreshSummary();
    onListChange(state.items);
  }

  /* ---------- Dropzone / input wiring ---------- */
  if (dz && input) {
    dz.setAttribute('role', 'button');
    dz.setAttribute('tabindex', '0');
    dz.addEventListener('click', () => input.click());
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
    ['dragenter', 'dragover'].forEach((evt) =>
      dz.addEventListener(evt, (e) => {
        e.preventDefault();
        dz.classList.add('is-dragover');
      })
    );
    ['dragleave', 'drop'].forEach((evt) =>
      dz.addEventListener(evt, (e) => {
        e.preventDefault();
        dz.classList.remove('is-dragover');
      })
    );
    dz.addEventListener('drop', (e) => {
      addFiles(e.dataTransfer?.files);
    });
    input.addEventListener('change', () => {
      addFiles(input.files);
      input.value = ''; // allows re-selecting the same file
    });
  }

  // Prevent the browser from opening a file dropped outside the zone
  ['dragover', 'drop'].forEach((evt) =>
    window.addEventListener(evt, (e) => {
      if (e.target !== input) e.preventDefault();
    })
  );

  clearBtn?.addEventListener('click', clear);
  zipBtn?.addEventListener('click', downloadAllZip);
  if (zipBtn) zipBtn.dataset.label = zipBtn.textContent.trim();

  sync();

  return {
    addFiles,
    clear,
    processAll,
    processItem,
    refreshMeta: (item) => updateMeta(item),
    get items() {
      return state.items;
    },
    showNotice,
  };
}
