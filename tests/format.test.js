import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatBytes, formatNumber, formatPercent } from '../src/lib/format.js';

test('formatBytes : cas de base', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(500), '500 B');
  assert.equal(formatBytes(1024), '1.0 KB');
  assert.equal(formatBytes(740 * 1024), '740 KB');
  assert.equal(formatBytes(2.4 * 1024 * 1024), '2.4 MB');
});

test('formatBytes : entrées invalides', () => {
  assert.equal(formatBytes(-5), '—');
  assert.equal(formatBytes(NaN), '—');
  assert.equal(formatBytes(undefined), '—');
});

test('formatNumber : décimales inutiles supprimées', () => {
  assert.equal(formatNumber(30), '30');
  assert.equal(formatNumber(33.33333333), '33.3333');
  assert.equal(formatNumber(1e9), '1,000,000,000');
});

test('formatNumber : infini → —', () => {
  assert.equal(formatNumber(Infinity), '—');
});

test('formatPercent', () => {
  assert.equal(formatPercent(69), '69 %');
  assert.equal(formatPercent(33.333333), '33.33 %');
});
