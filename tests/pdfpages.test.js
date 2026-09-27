import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePageRanges } from '../src/lib/pdfpages.js';

test('single page', () => {
  assert.deepEqual(parsePageRanges('3', 10), { ok: true, pages: [3] });
});

test('ranges and singles, sorted + deduplicated', () => {
  const r = parsePageRanges('1-3, 5, 2, 8-10', 12);
  assert.deepEqual(r, { ok: true, pages: [1, 2, 3, 5, 8, 9, 10] });
});

test('empty input rejected', () => {
  assert.equal(parsePageRanges('', 10).ok, false);
  assert.equal(parsePageRanges('   ', 10).ok, false);
});

test('out-of-range rejected with page count in message', () => {
  const r = parsePageRanges('1-15', 12);
  assert.equal(r.ok, false);
  assert.match(r.error, /12/);
});

test('zero and negatives rejected', () => {
  assert.equal(parsePageRanges('0', 10).ok, false);
});

test('inverted range rejected with helpful hint', () => {
  const r = parsePageRanges('5-2', 10);
  assert.equal(r.ok, false);
  assert.match(r.error, /2-5/);
});

test('garbage rejected', () => {
  assert.equal(parsePageRanges('abc', 10).ok, false);
  assert.equal(parsePageRanges('1..3', 10).ok, false);
});

test('spaces and semicolons tolerated', () => {
  const r = parsePageRanges(' 1 - 3 ; 5 ', 10);
  assert.deepEqual(r.pages, [1, 2, 3, 5]);
});
