/** Recherche instantanée des outils — fonctions pures, testables. */

export function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

/**
 * Recherche dans le registre d'outils.
 * @param {string} query
 * @param {Array<{slug,name,shortDesc,keywords,category}>} tools
 * @returns résultats triés par pertinence [{tool, score}]
 */
export function searchTools(query, tools) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const results = [];

  for (const tool of tools) {
    const name = normalize(tool.name);
    const desc = normalize(tool.shortDesc || '');
    const keywords = (tool.keywords || []).map(normalize);

    // Chaque token doit matcher quelque part
    const matchesAll = tokens.every(
      (t) => name.includes(t) || desc.includes(t) || keywords.some((k) => k.includes(t) || t.includes(k))
    );
    if (!matchesAll) continue;

    let score = 0;
    const joined = normalize(q);
    if (name === joined) score += 100;
    else if (name.startsWith(joined)) score += 60;
    else if (name.includes(joined)) score += 40;
    if (keywords.some((k) => k === joined)) score += 30;
    if (keywords.some((k) => k.startsWith(joined))) score += 15;
    if (desc.includes(joined)) score += 8;

    results.push({ tool, score });
  }
  return results.sort((a, b) => b.score - a.score).map((r) => r.tool);
}
