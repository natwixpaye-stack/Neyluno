/** Intent-based tool search — pure functions, testable. */

export function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

/** Weak tokens ignored when stronger ones remain. */
const STOPWORDS = new Set([
  'i', 'my', 'me', 'a', 'an', 'the', 'to', 'into', 'in', 'of', 'for', 'and',
  'do', 'does', 'need', 'want', 'would', 'like', 'please', 'can', 'you',
  'make', 'get', 'this', 'that', 'these', 'those', 'it', 'is', 'how', 'what',
]);

function tokensOf(q) {
  const raw = q.split(/\s+/).filter(Boolean);
  const strong = raw.filter((t) => !STOPWORDS.has(t));
  return strong.length ? strong : raw;
}

/**
 * Search the tools registry with intent matching.
 * Signals, strongest first:
 *  1. query matches a curated intent phrase (exact / containment / token coverage)
 *  2. name / keyword / description matching (every token must hit)
 */
export function searchTools(query, tools) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = tokensOf(q);
  const results = [];

  for (const tool of tools) {
    const name = normalize(tool.name);
    const desc = normalize(tool.shortDesc || '');
    const keywords = (tool.keywords || []).map(normalize);
    const intents = (tool.intents || []).map(normalize);

    let score = 0;

    // --- 1. Intent phrases ---
    for (const phrase of intents) {
      if (q === phrase) score += 140;
      else if (phrase.includes(q) && q.length >= 3) score += 100;
      else if (q.includes(phrase)) score += 100;
      const phraseTokens = phrase.split(' ').filter((t) => !STOPWORDS.has(t));
      if (tokens.length >= 2 && phraseTokens.length) {
        const covered = tokens.filter((t) => phraseTokens.some((p) => p.includes(t) || t.includes(p))).length;
        if (covered === tokens.length) score += 70;
        else if (covered / tokens.length >= 0.66) score += 25;
      }
    }

    // --- 2. Name / keywords / description ---
    const matchesAll = tokens.every(
      (t) =>
        name.includes(t) ||
        desc.includes(t) ||
        keywords.some((k) => k.includes(t) || t.includes(k)) ||
        intents.some((p) => p.includes(t))
    );

    if (matchesAll) {
      score += 20;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 60;
      else if (name.includes(q)) score += 40;
      if (keywords.some((k) => k === q)) score += 30;
      if (keywords.some((k) => k.startsWith(q))) score += 15;
      if (desc.includes(q)) score += 8;
    }

    if (score > 0) results.push({ tool, score });
  }

  return results.sort((a, b) => b.score - a.score).map((r) => r.tool);
}
