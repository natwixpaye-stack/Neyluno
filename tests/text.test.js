import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countText } from '../src/lib/text.js';

test('texte vide → tout à zéro', () => {
  const r = countText('');
  assert.deepEqual(r, {
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTimeMin: 0,
  });
});

test('cas simple : une phrase', () => {
  const r = countText('Bonjour le monde.');
  assert.equal(r.words, 3);
  assert.equal(r.chars, 17);
  assert.equal(r.charsNoSpaces, 15);
  assert.equal(r.sentences, 1);
  assert.equal(r.paragraphs, 1);
  assert.equal(r.lines, 1);
});

test("don't counts as one word (documented EN convention)", () => {
  assert.equal(countText("don't").words, 1);
  assert.equal(countText('don’t').words, 1); // curly apostrophe
  assert.equal(countText('well-known').words, 1); // hyphenated
});

test('paragraphes séparés par ligne vide', () => {
  const r = countText('Premier paragraphe.\n\nDeuxième paragraphe.\n\n\nTroisième.');
  assert.equal(r.paragraphs, 3);
  assert.equal(r.sentences, 3);
});

test('lignes multiples', () => {
  const r = countText('a\nb\nc');
  assert.equal(r.lines, 3);
});

test('ponctuation multiple compte une seule phrase', () => {
  assert.equal(countText('Vraiment ?!').sentences, 1);
  assert.equal(countText('Oh…').sentences, 1);
});

test('pas de phrase sans ponctuation finale', () => {
  assert.equal(countText('texte sans ponctuation').sentences, 0);
});

test('temps de lecture : 400 mots ≈ 2 min', () => {
  const text = Array(400).fill('mot').join(' ');
  assert.equal(countText(text).readingTimeMin, 2);
});

test('entrées non-string gérées sans erreur', () => {
  assert.equal(countText(null).words, 0);
  assert.equal(countText(undefined).chars, 0);
  assert.equal(countText(42).words, 0);
});

test('caractères accentués et emoji comptés comme caractères', () => {
  const r = countText('éàü 🙂');
  assert.equal(r.chars, 5); // é à ü espace 🙂
  assert.ok(r.words >= 1);
});
