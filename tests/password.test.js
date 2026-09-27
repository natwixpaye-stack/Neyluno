import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generatePassword, passwordStrength, buildCharset, AMBIGUOUS, CHARSETS } from '../src/lib/password.js';

// Générateur déterministe pour les tests (rejet de bytes > limite simulé correctement)
function makeRng(seed = 42) {
  let s = seed;
  return (arr) => {
    for (let i = 0; i < arr.length; i++) {
      s = (s * 1103515245 + 12345) % 2 ** 31;
      arr[i] = s % 256;
    }
    return arr;
  };
}

const ALL = { upper: true, lower: true, digits: true, symbols: true, noAmbiguous: false };

test('longueur demandée respectée', () => {
  for (const len of [4, 8, 16, 32, 48]) {
    const pw = generatePassword(len, ALL, makeRng(len));
    assert.equal(pw.length, len);
  }
});

test('bornes de longueur appliquées (trop court / trop long)', () => {
  assert.equal(generatePassword(1, ALL, makeRng()).length, 4);
  assert.equal(generatePassword(500, ALL, makeRng()).length, 64);
});

test('chaque famille sélectionnée est représentée', () => {
  const pw = generatePassword(16, ALL, makeRng(7));
  assert.match(pw, /[A-Z]/);
  assert.match(pw, /[a-z]/);
  assert.match(pw, /[0-9]/);
  assert.match(pw, /[!@#$%^&*()\-_=+\[\]{};:,.<>?]/);
});

test('seulement des minuscules → aucun autre jeu', () => {
  const pw = generatePassword(20, { upper: false, lower: true, digits: false, symbols: false }, makeRng());
  assert.match(pw, /^[a-z]+$/);
});

test('exclusion des caractères ambigus', () => {
  const pw = generatePassword(48, { ...ALL, noAmbiguous: true }, makeRng(3));
  for (const c of pw) assert.equal(AMBIGUOUS.has(c), false, `caractère ambigu trouvé : ${c}`);
});

test('aucune famille sélectionnée → null', () => {
  assert.equal(generatePassword(16, { upper: false, lower: false, digits: false, symbols: false }, makeRng()), null);
});

test('exclus ambigus mais famille vidée (ex. symboles seuls) → géré', () => {
  const cs = buildCharset({ upper: false, lower: false, digits: false, symbols: true, noAmbiguous: true });
  assert.ok(cs.pool.length > 0);
});

test('entropie : plus long = plus fort', () => {
  const short = passwordStrength(8, ALL);
  const long = passwordStrength(24, ALL);
  assert.ok(long.bits > short.bits);
  assert.equal(long.level >= short.level, true);
});

test('entropie : 16 caractères tous jeux ≥ 90 bits', () => {
  const s = passwordStrength(16, ALL);
  assert.ok(s.bits >= 90, `bits=${s.bits}`);
  assert.equal(s.level, 4);
});

test('caractères générés appartiennent tous au pool', () => {
  const { pool } = buildCharset(ALL);
  const pw = generatePassword(64, ALL, makeRng(99));
  for (const c of pw) assert.ok(pool.includes(c), `caractère hors pool : ${c}`);
});

test('deux tirages successifs diffèrent (quasi-certitude)', () => {
  const a = generatePassword(24, ALL, (arr) => {
    // aléa "vrai" via Math.random pour ce test de non-collision
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  });
  const b = generatePassword(24, ALL, (arr) => {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  });
  assert.notEqual(a, b);
});

test('CHARSETS complets', () => {
  assert.equal(CHARSETS.lower.length, 26);
  assert.equal(CHARSETS.upper.length, 26);
  assert.equal(CHARSETS.digits.length, 10);
  assert.ok(CHARSETS.symbols.length >= 20);
});
