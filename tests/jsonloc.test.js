import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locateJsonError, positionToLineCol } from '../src/lib/jsonloc.js';

test('valid JSON → null', () => {
  assert.equal(locateJsonError('{"a": 1, "b": [true, null, "x"]}'), null);
  assert.equal(locateJsonError('  [1, 2.5, -3e2]  '), null);
  assert.equal(locateJsonError('"hello"'), null);
});

test('unquoted property name located', () => {
  const r = locateJsonError('{a: 1}');
  assert.equal(r.pos, 1);
  assert.match(r.message, /double quotes/);
});

test('trailing comma caught at the right place', () => {
  const r = locateJsonError('[1, 2, ]');
  assert.equal(r.pos, 7); // position of "]"
});

test('missing value after colon', () => {
  const r = locateJsonError('{"a": }');
  assert.match(r.message, /Unexpected token '\}'/);
  assert.equal(r.pos, 6);
});

test('multi-line: position maps to line and column', () => {
  const text = '{\n  "a": \n}';
  const r = locateJsonError(text);
  const { line, column } = positionToLineCol(text, r.pos);
  assert.equal(line, 3);
  assert.equal(column, 1);
});

test('unterminated string', () => {
  const r = locateJsonError('{"a": "oops}');
  assert.match(r.message, /Unterminated string/);
});

test('garbage after value', () => {
  const r = locateJsonError('123 456');
  assert.match(r.message, /after the JSON value/);
});

test('empty input', () => {
  const r = locateJsonError('');
  assert.match(r.message, /end of input/);
});
