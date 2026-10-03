import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectFlow, describeFlowPlan } from '../src/lib/flow.js';
import { evaluate, formatResult } from '../src/lib/calc.js';
import { cleanText, diffLines, extract } from '../src/lib/textops.js';
import { applyPattern, validPattern } from '../src/lib/naming.js';

/* ---------- Flow ---------- */
test('flow: 40 photos by email → optimize workflow with ZIP', () => {
  const f = detectFlow('I need to send 40 photos by email');
  assert.equal(f.cta.type, 'workflow');
  assert.match(f.title, /40/);
  assert.equal(f.cta.zip, true);
  assert.match(describeFlowPlan(f), /Resize → Compress → ZIP/);
});

test('flow: mon pdf est trop gros → compress-pdf', () => {
  const f = detectFlow('mon pdf est trop gros');
  assert.equal(f.cta.slug, 'compress-pdf');
});

test('flow: convert webp to jpg → image-converter with target', () => {
  const f = detectFlow('convert these webp to jpg');
  assert.equal(f.cta.slug, 'image-converter');
  assert.equal(f.cta.params.to, 'image/jpeg');
});

test('flow: fusionner pdf → merge-pdf', () => {
  assert.equal(detectFlow('fusionner deux pdf').cta.slug, 'merge-pdf');
});

test('flow: compare two texts → text-diff', () => {
  assert.equal(detectFlow('compare these two texts').cta.slug, 'text-diff');
});

test('flow: json beau → json-formatter', () => {
  assert.equal(detectFlow('rendre ce json beau').cta.slug, 'json-formatter');
});

test('flow: calcul moyenne → calculator', () => {
  assert.equal(detectFlow('calculer ma moyenne').cta.slug, 'calculator');
});

/* ---------- Flow — V4.1 additions ---------- */
test('flow: calculer une remise de 20% → calculator', () => {
  assert.equal(detectFlow('calculer une remise de 20%').cta.slug, 'calculator');
});

test('flow: supprimer la page 3 de mon pdf → pdf-organizer', () => {
  assert.equal(detectFlow('supprimer la page 3 de mon pdf').cta.slug, 'pdf-organizer');
});

test('flow: réorganiser les pages pdf → pdf-organizer', () => {
  assert.equal(detectFlow('je veux réorganiser les pages de ce pdf').cta.slug, 'pdf-organizer');
});

test('flow: extraire le texte dun pdf → pdf-to-text', () => {
  assert.equal(detectFlow('extraire le texte de ce pdf').cta.slug, 'pdf-to-text');
});

test('flow: extraire des pages reste un split, pas du texte', () => {
  assert.equal(detectFlow('extraire les pages 2-5 de ce pdf').cta.slug, 'split-pdf');
});

test('flow: convertir mes png en webp → image-converter webp', () => {
  const f = detectFlow('convertir mes png en webp');
  assert.equal(f.cta.slug, 'image-converter');
  assert.equal(f.cta.params.to, 'image/webp');
});

test('flow: réduire mes photos → optimize workflow', () => {
  const f = detectFlow('réduire mes photos');
  assert.equal(f.cta.type, 'workflow');
});

test('flow: compter les mots → word-counter', () => {
  assert.equal(detectFlow('compter les mots de ce texte').cta.slug, 'word-counter');
});

test('flow: nonsense → null', () => {
  assert.equal(detectFlow('zzz qqq'), null);
  assert.equal(detectFlow(''), null);
});

/* ---------- Calc ---------- */
test('calc: basics and precedence', () => {
  assert.equal(evaluate('2+3*4'), 14);
  assert.equal(evaluate('(2+3)*4'), 20);
  assert.equal(evaluate('10%3'), 1);
  assert.equal(evaluate('2^10'), 1024);
  assert.equal(evaluate('-4+2'), -2);
});

test('calc: functions and constants', () => {
  assert.equal(evaluate('sqrt(16)'), 4);
  assert.ok(Math.abs(evaluate('sin(30)') - 0.5) < 1e-9);
  assert.equal(Math.round(evaluate('pi') * 100) / 100, 3.14);
  assert.equal(evaluate('max(3, 7, 2)'), 7);
});

test('calc: friendly failures', () => {
  assert.throws(() => evaluate('1/0'), /Division by zero/);
  assert.throws(() => evaluate('(1+2'), /parenthesis/);
  assert.throws(() => evaluate('foo(1)'), /Unknown name/);
  assert.throws(() => evaluate(''), /Empty/);
});

test('calc: formatResult', () => {
  assert.equal(formatResult(30), '30');
  assert.equal(formatResult(0.1 + 0.2), '0.3');
});

/* ---------- Textops ---------- */
test('cleanText: full pipeline', () => {
  const dirty = '  a  \r\n\r\n  a \r\n  b  \r\n';
  const out = cleanText(dirty, {
    normalizeBreaks: true,
    trimLines: true,
    collapseSpaces: true,
    removeEmptyLines: true,
    dedupeLines: true,
  });
  assert.equal(out, 'a\nb');
});

test('diffLines: add/del/same', () => {
  const ops = diffLines('a\nb\nc', 'a\nc\nd');
  assert.deepEqual(
    ops.map((o) => o.type),
    ['same', 'del', 'same', 'add']
  );
});

test('extract: emails, urls, hashtags', () => {
  const t = 'mail a@b.co and a@b.co again, see https://x.dev/a #Tag @bob';
  assert.deepEqual(extract(t, 'emails'), ['a@b.co']);
  assert.deepEqual(extract(t, 'urls'), ['https://x.dev/a']);
  assert.deepEqual(extract(t, 'hashtags'), ['#Tag']);
  assert.equal(extract(t, 'nope').length, 0);
});

/* ---------- Naming ---------- */
test('naming: tokens and safety', () => {
  assert.equal(applyPattern('{name}-compressed', { name: 'photo.jpg', ext: 'webp' }), 'photo-compressed.webp');
  assert.equal(applyPattern('image-{n}', { name: 'x.png', n: 3, ext: 'png' }), 'image-3.png');
  assert.equal(applyPattern('{name}-{width}x{height}', { name: 'a/b.png', n: 1, width: 100, height: 50, ext: 'png' }), 'a-b-100x50.png');
  assert.equal(validPattern(''), false);
  assert.equal(validPattern('{name}'), true);
});
