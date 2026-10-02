/** Batch output naming patterns: {name}, {n}, {width}, {height}, {ext}. */

/**
 * @param {string} pattern e.g. "{name}-compressed" or "image-{n}"
 * @param {{name: string, n?: number, width?: number, height?: number, ext: string}} ctx
 * @returns {string} safe filename WITH extension
 */
export function applyPattern(pattern, ctx) {
  const base = String(pattern || '{name}').replace(/[\\/:*?"<>|]/g, '-');
  const stem = (ctx.name || 'file').replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]/g, '-');
  let out = base
    .replaceAll('{name}', stem)
    .replaceAll('{n}', String(ctx.n ?? 1))
    .replaceAll('{width}', String(ctx.width ?? 0))
    .replaceAll('{height}', String(ctx.height ?? 0))
    .replaceAll('{ext}', String(ctx.ext || '').replace(/^\./, ''));
  out = out.trim().replace(/\.+$/, '') || `file-${ctx.n ?? 1}`;
  const ext = String(ctx.ext || '').replace(/^\./, '');
  return ext ? `${out}.${ext}` : out;
}

/** Validate a pattern: non-empty after cleaning, sane length. */
export function validPattern(pattern) {
  const p = String(pattern || '').trim();
  return p.length > 0 && p.length <= 80;
}
