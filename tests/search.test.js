import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchTools, normalize } from '../src/lib/search.js';
import { tools } from '../src/data/tools.js';

test('normalize: lowercases and strips accents', () => {
  assert.equal(normalize('Élève À Québec'), 'eleve a quebec');
});

test('search "image" finds image tools', () => {
  const r = searchTools('image', tools);
  assert.ok(r.length >= 3);
  assert.ok(r.some((t) => t.slug === 'image-compressor'));
});

test('search "pdf" finds merge + image-to-pdf', () => {
  const r = searchTools('pdf', tools);
  const slugs = r.map((t) => t.slug);
  assert.ok(slugs.includes('merge-pdf'));
  assert.ok(slugs.includes('image-to-pdf'));
});

test('search "qr" finds the generator first', () => {
  const r = searchTools('qr', tools);
  assert.equal(r[0].slug, 'qr-code-generator');
});

test('exact-word search: "percentage"', () => {
  const r = searchTools('percentage', tools);
  assert.equal(r[0].slug, 'percentage-calculator');
});

test('empty search → no results', () => {
  assert.deepEqual(searchTools('', tools), []);
  assert.deepEqual(searchTools('   ', tools), []);
});

test('no match → []', () => {
  assert.deepEqual(searchTools('zzzznotfound', tools), []);
});

test('multi-token: "merge pdf"', () => {
  const r = searchTools('merge pdf', tools);
  assert.equal(r[0].slug, 'merge-pdf');
});

/* ---------- Intent-based matching (V2) ---------- */

test('intent: "make my photo smaller" → image compressor', () => {
  const r = searchTools('make my photo smaller', tools);
  assert.equal(r[0].slug, 'image-compressor');
});

test('intent: "reduce jpg size" → image compressor', () => {
  const r = searchTools('reduce jpg size', tools);
  assert.ok(['image-compressor', 'jpg-to-webp'].includes(r[0].slug));
});

test('intent: "convert webp to jpg" → webp-to-jpg', () => {
  const r = searchTools('convert webp to jpg', tools);
  assert.equal(r[0].slug, 'webp-to-jpg');
});

test('intent: "turn image into pdf" → image-to-pdf', () => {
  const r = searchTools('turn image into pdf', tools);
  assert.equal(r[0].slug, 'image-to-pdf');
});

test('intent: "put pdfs together" → merge-pdf', () => {
  const r = searchTools('put pdfs together', tools);
  assert.equal(r[0].slug, 'merge-pdf');
});

test('intent: "remove duplicate lines" → dedupe tool', () => {
  const r = searchTools('remove duplicate lines', tools);
  assert.equal(r[0].slug, 'remove-duplicate-lines');
});

test('intent with filler words: "I need to generate a strong password"', () => {
  const r = searchTools('I need to generate a strong password', tools);
  assert.equal(r[0].slug, 'password-generator');
});
