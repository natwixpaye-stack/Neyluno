import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentOf, proportion, evolution, discount, addPercent } from '../src/lib/percentage.js';

test('percentOf : 20 % de 150 = 30', () => {
  assert.equal(percentOf(20, 150).result, 30);
});

test('percentOf : valeurs négatives et décimales', () => {
  assert.equal(percentOf(12.5, 80).result, 10);
  assert.equal(percentOf(-10, 50).result, -5);
});

test('proportion : 30 sur 150 = 20 %', () => {
  assert.equal(proportion(30, 150).result, 20);
});

test('proportion : division par zéro → null', () => {
  assert.equal(proportion(10, 0), null);
});

test('evolution : 80 → 100 = +25 %', () => {
  assert.equal(evolution(80, 100).result, 25);
});

test('evolution : 100 → 80 = −20 %', () => {
  assert.equal(evolution(100, 80).result, -20);
});

test('evolution : départ négatif (perte qui se creuse)', () => {
  assert.equal(evolution(-50, -75).result, -50);
});

test('evolution : départ nul → null', () => {
  assert.equal(evolution(0, 10), null);
});

test('discount : 100 − 20 % = 80, économie 20', () => {
  const r = discount(100, 20);
  assert.equal(r.result, 80);
  assert.equal(r.saved, 20);
});

test('discount : 0 % ne change rien', () => {
  assert.equal(discount(49.9, 0).result, 49.9);
});

test('addPercent : 200 + 10 % = 220', () => {
  const r = addPercent(200, 10);
  assert.equal(r.result, 220);
  assert.equal(r.added, 20);
});

test('entrées invalides (NaN) → null partout', () => {
  assert.equal(percentOf(NaN, 10), null);
  assert.equal(proportion(undefined, 10), null);
  assert.equal(evolution('a', 10), null);
  assert.equal(discount(null, 10), null);
  assert.equal(addPercent(10, Infinity), null);
});
