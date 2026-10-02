/** Text operations — pure functions: cleaning, line diff, extraction. */

/**
 * Clean a text according to options.
 * @param {string} text
 * @param {{trimLines?: boolean, collapseSpaces?: boolean, normalizeBreaks?: boolean, removeEmptyLines?: boolean, dedupeLines?: boolean, trimEnd?: boolean}} opts
 */
export function cleanText(text, opts = {}) {
  let out = String(text ?? '');
  if (opts.normalizeBreaks) out = out.replace(/\r\n?/g, '\n');
  if (opts.trimLines) out = out.split('\n').map((l) => l.trim()).join('\n');
  if (opts.collapseSpaces) out = out.split('\n').map((l) => l.replace(/[ \t]+/g, ' ')).join('\n');
  if (opts.removeEmptyLines) out = out.split('\n').filter((l) => l.trim() !== '').join('\n');
  if (opts.dedupeLines) {
    const seen = new Set();
    out = out
      .split('\n')
      .filter((l) => {
        const k = l.trim();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .join('\n');
  }
  if (opts.trimEnd) out = out.trim();
  return out;
}

/**
 * Line-based diff (LCS). Capped for safety on huge inputs.
 * @returns {Array<{type: 'same'|'add'|'del', text: string}>}
 */
export function diffLines(aText, bText, cap = 1500) {
  const a = String(aText ?? '').split('\n').slice(0, cap);
  const b = String(bText ?? '').split('\n').slice(0, cap);
  const n = a.length;
  const m = b.length;
  // LCS table (ints) — fine up to 1500×1500
  const dp = new Uint32Array((n + 1) * (m + 1));
  const W = m + 1;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * W + j] = a[i] === b[j] ? dp[(i + 1) * W + j + 1] + 1 : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'same', text: a[i] });
      i++;
      j++;
    } else if (dp[(i + 1) * W + j] >= dp[i * W + j + 1]) {
      ops.push({ type: 'del', text: a[i] });
      i++;
    } else {
      ops.push({ type: 'add', text: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: 'del', text: a[i++] });
  while (j < m) ops.push({ type: 'add', text: b[j++] });
  return ops;
}

const EXTRACTORS = {
  emails: (t) => t.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [],
  urls: (t) => t.match(/https?:\/\/[^\s<>")]+/g) || [],
  numbers: (t) => t.match(/-?\d+(?:[.,]\d+)?/g) || [],
  hashtags: (t) => t.match(/#[\p{L}\p{N}_-]+/gu) || [],
  mentions: (t) => t.match(/@[\p{L}\p{N}_-]+/gu) || [],
};

/** Extract items of a kind; de-duplicated, order preserved. */
export function extract(text, kind) {
  const fn = EXTRACTORS[kind];
  if (!fn) return [];
  const seen = new Set();
  const out = [];
  for (const m of fn(String(text ?? ''))) {
    if (!seen.has(m)) {
      seen.add(m);
      out.push(m);
    }
  }
  return out;
}
