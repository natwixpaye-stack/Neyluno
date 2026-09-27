/** Pinpoint the location of a JSON syntax error — pure function, testable. */

/**
 * Scan the text and locate the first structural problem.
 * @param {string} text
 * @returns {null | {pos: number, message: string}}
 */
export function locateJsonError(text) {
  const src = String(text);
  const n = src.length;
  let i = 0;

  const fail = (message) => {
    throw { pos: Math.min(i, n), message };
  };

  function ws() {
    while (i < n && /[\s]/.test(src[i])) i++;
  }

  function str() {
    i++; // opening quote
    while (i < n) {
      const c = src[i];
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        return;
      }
      if (c === '\n') fail('Unterminated string — strings cannot span lines');
      i++;
    }
    fail('Unterminated string — missing closing quote');
  }

  function num() {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(src.slice(i));
    if (!m || m[0].length === 0 || m[0] === '-') fail('Invalid number');
    i += m[0].length;
  }

  function value() {
    ws();
    if (i >= n) fail('Unexpected end of input');
    const c = src[i];
    if (c === '{') {
      i++;
      ws();
      if (src[i] === '}') {
        i++;
        return;
      }
      for (;;) {
        ws();
        if (i >= n) fail('Unexpected end of input inside object');
        if (src[i] !== '"') fail('Property names must be wrapped in double quotes');
        str();
        ws();
        if (src[i] !== ':') fail('Expected ":" after property name');
        i++;
        value();
        ws();
        if (src[i] === ',') {
          i++;
          continue;
        }
        if (src[i] === '}') {
          i++;
          return;
        }
        fail(i >= n ? 'Unexpected end of input — missing "}"' : 'Expected "," or "}" in object');
      }
    } else if (c === '[') {
      i++;
      ws();
      if (src[i] === ']') {
        i++;
        return;
      }
      for (;;) {
        value();
        ws();
        if (src[i] === ',') {
          i++;
          continue;
        }
        if (src[i] === ']') {
          i++;
          return;
        }
        fail(i >= n ? 'Unexpected end of input — missing "]"' : 'Expected "," or "]" in array');
      }
    } else if (c === '"') {
      str();
    } else if (c === '-' || /[0-9]/.test(c)) {
      num();
    } else if (src.startsWith('true', i)) i += 4;
    else if (src.startsWith('false', i)) i += 5;
    else if (src.startsWith('null', i)) i += 4;
    else fail(`Unexpected token '${c}'`);
  }

  try {
    value();
    ws();
    if (i < n) fail('Unexpected content after the JSON value');
    return null;
  } catch (e) {
    if (e && typeof e === 'object' && typeof e.pos === 'number') return e;
    return { pos: 0, message: 'Invalid JSON' };
  }
}

/** Convert an absolute position into 1-based line/column. */
export function positionToLineCol(text, pos) {
  const before = String(text).slice(0, Math.max(0, pos));
  const line = before.split('\n').length;
  const col = pos - before.lastIndexOf('\n');
  return { line, column: col };
}
