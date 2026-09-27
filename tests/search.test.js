import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchTools, normalize } from '../src/lib/search.js';
import { tools } from '../src/data/tools.js';

test('normalize : minuscules et accents', () => {
  assert.equal(normalize('Élève À Québec'), 'eleve a quebec');
});

test('recherche "image" trouve les outils image', () => {
  const r = searchTools('image', tools);
  assert.ok(r.length >= 3);
  assert.ok(r.some((t) => t.slug === 'compresser-image'));
});

test('recherche "pdf" trouve fusion + image en pdf', () => {
  const r = searchTools('pdf', tools);
  const slugs = r.map((t) => t.slug);
  assert.ok(slugs.includes('fusionner-pdf'));
  assert.ok(slugs.includes('image-en-pdf'));
});

test('recherche insensible aux accents : "sécurité"', () => {
  const r = searchTools('securite', tools);
  assert.ok(r.some((t) => t.slug === 'generateur-mot-de-passe'));
});

test('recherche "qr" trouve le générateur', () => {
  const r = searchTools('qr', tools);
  assert.equal(r[0].slug, 'generer-qr-code');
});

test('recherche par mot exact : "pourcentage"', () => {
  const r = searchTools('pourcentage', tools);
  assert.equal(r[0].slug, 'calculateur-pourcentage');
});

test('recherche vide → aucun résultat', () => {
  assert.deepEqual(searchTools('', tools), []);
  assert.deepEqual(searchTools('   ', tools), []);
});

test('recherche sans correspondance → []', () => {
  assert.deepEqual(searchTools('zzzzintrouvable', tools), []);
});

test('multi-tokens : "fusion pdf"', () => {
  const r = searchTools('fusion pdf', tools);
  assert.equal(r[0].slug, 'fusionner-pdf');
});
