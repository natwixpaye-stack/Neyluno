/** Calculs de pourcentage — fonctions pures, testables sans DOM. */

const isNum = (v) => Number.isFinite(v);

/** Nettoie le bruit flottant (ex. 220.00000000000003 → 220). */
const clean = (v) => Math.round(v * 1e10) / 1e10;

/** Mode 1 : "Quel est X % de Y ?" → value */
export function percentOf(x, y) {
  if (!isNum(x) || !isNum(y)) return null;
  return { result: clean((y * x) / 100), formula: `${fmt(y)} × ${fmt(x)} ÷ 100` };
}

/** Mode 2 : "X représente quel pourcentage de Y ?" → % */
export function proportion(x, y) {
  if (!isNum(x) || !isNum(y) || y === 0) return null;
  return { result: clean((x / y) * 100), formula: `${fmt(x)} ÷ ${fmt(y)} × 100`, unit: '%' };
}

/** Mode 3 : "De combien de % est passée de X à Y ?" → évolution en % */
export function evolution(from, to) {
  if (!isNum(from) || !isNum(to) || from === 0) return null;
  const result = clean(((to - from) / Math.abs(from)) * 100);
  return { result, formula: `(${fmt(to)} − ${fmt(from)}) ÷ ${fmt(Math.abs(from))} × 100`, unit: '%' };
}

/** Mode 4 : "Appliquer une réduction de X % à Y" → nouveau prix + économie */
export function discount(amount, pct) {
  if (!isNum(amount) || !isNum(pct)) return null;
  const result = clean(amount * (1 - pct / 100));
  return { result, saved: clean(amount - result), formula: `${fmt(amount)} × (1 − ${fmt(pct)} ÷ 100)` };
}

/** Mode 5 : "Ajouter X % à Y" (TVA, augmentation…) → nouvelle valeur + ajout */
export function addPercent(amount, pct) {
  if (!isNum(amount) || !isNum(pct)) return null;
  const result = clean(amount * (1 + pct / 100));
  return { result, added: clean(result - amount), formula: `${fmt(amount)} × (1 + ${fmt(pct)} ÷ 100)` };
}

function fmt(v) {
  return String(Math.round(v * 10000) / 10000);
}
