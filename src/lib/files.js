/** File validation — clear user-facing messages (EN). */
import { site } from '../data/site.js';

export const MAX_FILE_BYTES = site.limits.maxFileMB * 1024 * 1024;

/**
 * @param {File} file
 * @param {{acceptTypes?: string[], acceptExts?: string[], maxBytes?: number}} rules
 * @returns {{ok: true} | {ok: false, error: string}}
 */
export function validateFile(file, { acceptTypes = [], acceptExts = [], maxBytes = MAX_FILE_BYTES } = {}) {
  if (!file) return { ok: false, error: 'No file selected.' };

  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';

  if (file.size === 0) {
    return { ok: false, error: `“${file.name}” is empty (0 bytes). Check the file and try again.` };
  }

  if (file.size > maxBytes) {
    return { ok: false, error: `“${file.name}” is larger than the ${Math.round(maxBytes / 1024 / 1024)} MB limit. Reduce or split the file first.` };
  }

  if (acceptTypes.length || acceptExts.length) {
    const typeOk = acceptTypes.includes(file.type) || (file.type === '' && acceptExts.includes(ext));
    const extOk = acceptExts.includes(ext);
    if (!typeOk && !extOk) {
      const expected = [...acceptExts].join(', ') || acceptTypes.join(', ');
      return { ok: false, error: `Unsupported format: “${file.name}”. Accepted formats: ${expected}.` };
    }
  }

  return { ok: true };
}

/** Strip anything unsafe from a file name before reuse (downloads, ZIP entries). */
export function sanitizeName(name, fallback = 'file') {
  const cleaned = String(name || '')
    .replace(/[\\/]/g, '-')
    .replace(/[\u0000-\u001f]/g, '')
    .slice(0, 180)
    .trim();
  return cleaned || fallback;
}

export { formatBytes } from './format.js';
