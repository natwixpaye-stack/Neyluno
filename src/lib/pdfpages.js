/** Page-range parsing for PDF splitting — pure function, testable. */

/**
 * Parse a page-selection string like "1-3, 5, 8-10".
 * @param {string} input
 * @param {number} maxPages total pages of the document (>= 1)
 * @returns {{ok: true, pages: number[]} | {ok: false, error: string}}
 * pages is sorted, deduplicated, 1-based.
 */
export function parsePageRanges(input, maxPages) {
  const raw = String(input || '').trim();
  if (!raw) return { ok: false, error: 'Enter the pages to extract, e.g. “1-3, 5, 8-10”.' };

  const parts = raw.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return { ok: false, error: 'Enter the pages to extract, e.g. “1-3, 5, 8-10”.' };

  const pages = new Set();

  for (const part of parts) {
    const m = part.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
    if (!m) {
      return { ok: false, error: `Cannot understand “${part}”. Use numbers and ranges, e.g. “1-3, 5”.` };
    }
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;

    if (start < 1 || end < 1) {
      return { ok: false, error: 'Page numbers start at 1.' };
    }
    if (start > end) {
      return { ok: false, error: `Range “${part}” is inverted — write it as ${end}-${start}.` };
    }
    if (end > maxPages) {
      return { ok: false, error: `This document has ${maxPages} page${maxPages > 1 ? 's' : ''} — “${part}” goes too far.` };
    }
    for (let p = start; p <= end; p++) pages.add(p);
  }

  return { ok: true, pages: [...pages].sort((a, b) => a - b) };
}
