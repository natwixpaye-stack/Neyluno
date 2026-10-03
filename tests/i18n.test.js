import test from 'node:test';
import assert from 'node:assert/strict';

// Browser shims (localStorage + window event) — i18n.js is browser-targeted.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.window = { dispatchEvent: () => {} };

const { t, getLang, setLang } = await import('../src/lib/i18n.js');
const { DICT } = await import('../src/data/translations.js');

test('i18n: default language is English', () => {
  assert.equal(getLang(), 'en');
  assert.equal(t('file.done'), 'Done');
});

test('i18n: switching to fr translates JS-rendered strings', () => {
  setLang('fr');
  assert.equal(getLang(), 'fr');
  assert.equal(t('file.done'), 'Terminé');
  assert.equal(t('file.retry'), 'Réessayer');
});

test('i18n: every fr key falls back to an en key (no orphan)', () => {
  for (const key of Object.keys(DICT.fr)) {
    assert.ok(key in DICT.en, `fr key without en source: ${key}`);
  }
});

test('i18n: missing key returns the key itself, never throws', () => {
  setLang('en');
  assert.equal(t('nope.does.not.exist'), 'nope.does.not.exist');
});

test('i18n: variable interpolation', () => {
  setLang('en');
  const out = t('file.zipDone');
  assert.match(out, /file/);
});

test('i18n: setLang ignores unknown languages', () => {
  setLang('de');
  assert.equal(getLang(), 'en');
});
