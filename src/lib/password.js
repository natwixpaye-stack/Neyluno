/**
 * Génération de mots de passe — fonctions pures (l'aléa est injectable pour les tests).
 * En production, l'appelant passe crypto.getRandomValues.
 */

export const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
};

/** Caractères visuellement ambigus (exclus sur demande). */
export const AMBIGUOUS = new Set('Il1O0o|`\'"{}[]();:.,'.split(''));

export function buildCharset({ lower = true, upper = true, digits = true, symbols = true, noAmbiguous = false } = {}) {
  const sets = [];
  if (lower) sets.push(CHARSETS.lower);
  if (upper) sets.push(CHARSETS.upper);
  if (digits) sets.push(CHARSETS.digits);
  if (symbols) sets.push(CHARSETS.symbols);
  let pool = sets.join('');
  if (noAmbiguous) {
    pool = [...pool].filter((c) => !AMBIGUOUS.has(c)).join('');
    // Ré-appliquer le filtre par set pour la garantie "un caractère de chaque famille"
  }
  return {
    pool,
    sets: sets
      .map((s) => (noAmbiguous ? [...s].filter((c) => !AMBIGUOUS.has(c)).join('') : s))
      .filter((s) => s.length > 0),
  };
}

/** Entier aléatoire uniforme dans [0, max), sans biais modulo. */
export function randomInt(max, fillBytes) {
  if (max <= 0) throw new Error('randomInt: max doit être > 0');
  const limit = 256 - (256 % max);
  const buf = new Uint8Array(1);
  let x;
  do {
    fillBytes(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

/**
 * Génère un mot de passe. Garantit au moins un caractère de chaque famille sélectionnée.
 * @param {number} length longueur (bornée 4..64 par l'appelant)
 * @param {object} options idem buildCharset
 * @param {(arr: Uint8Array) => Uint8Array} fillBytes générateur aléatoire injecté
 */
export function generatePassword(length, options, fillBytes) {
  const len = Math.max(4, Math.min(64, Math.trunc(length) || 16));
  const { pool, sets } = buildCharset(options);
  if (pool.length === 0) return null;

  const chars = [];
  // 1 caractère garanti par famille sélectionnée (si la longueur le permet)
  for (const set of sets) {
    if (chars.length < len) chars.push(set[randomInt(set.length, fillBytes)]);
  }
  while (chars.length < len) {
    chars.push(pool[randomInt(pool.length, fillBytes)]);
  }
  // Mélange de Fisher-Yates
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, fillBytes);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** Entropie en bits + verdict de robustesse. */
export function passwordStrength(length, options) {
  const { pool } = buildCharset(options);
  const bits = pool.length > 0 ? length * Math.log2(pool.length) : 0;
  let label, level;
  if (bits < 40) [label, level] = ['Weak', 1];
  else if (bits < 60) [label, level] = ['Medium', 2];
  else if (bits < 90) [label, level] = ['Strong', 3];
  else [label, level] = ['Very strong', 4];
  return { bits: Math.round(bits), label, level };
}
