/**
 * Cross-tool file handoff via IndexedDB: after a result, the next tool can
 * offer “Continue with <file>”. Local only, 10-minute TTL, one file at a time.
 */
const DB_NAME = 'qt-handoff';
const STORE = 'files';
const TTL_MS = 10 * 60 * 1000;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveHandoff({ fromTool, name, type, blob }) {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ fromTool, name, type, blob, ts: Date.now() }, 'latest');
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* handoff is a nicety — never break the main flow */
  }
}

export async function getHandoff(acceptMimePrefix = 'image/') {
  try {
    const db = await openDb();
    const entry = await new Promise((resolve, reject) => {
      const req = db.transaction(STORE).objectStore(STORE).get('latest');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (!entry || Date.now() - entry.ts > TTL_MS) return null;
    if (acceptMimePrefix && !entry.type.startsWith(acceptMimePrefix)) return null;
    return new File([entry.blob], entry.name, { type: entry.type });
  } catch {
    return null;
  }
}

/**
 * Wire an optional “Continue with <file>” chip into a file tool.
 * Call once after mountFileTool; hidden when no compatible recent file exists.
 */
export async function mountHandoffChip(root, api, acceptPrefix = 'image/') {
  const chip = root.querySelector('[data-handoff]');
  if (!chip) return;
  const file = await getHandoff(acceptPrefix);
  if (!file) {
    chip.hidden = true;
    return;
  }
  chip.hidden = false;
  chip.querySelector('[data-handoff-name]').textContent = file.name;
  chip.querySelector('[data-handoff-use]').addEventListener('click', () => {
    api.addFiles([file]);
    chip.hidden = true;
    clearHandoff();
  });
  chip.querySelector('[data-handoff-dismiss]')?.addEventListener('click', () => {
    chip.hidden = true;
  });
}

export async function clearHandoff() {
  try {
    const db = await openDb();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete('latest');
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
    db.close();
  } catch {
    /* ignore */
  }
}
