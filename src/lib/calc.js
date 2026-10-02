/**
 * Safe math expression evaluator (no eval).
 * Supports + - * / % ^ ( ) , unary minus, functions and constants.
 * Pure, testable, fails with friendly messages.
 */

const FUNCS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  ln: Math.log,
  log: Math.log10,
  log10: Math.log10,
  log2: Math.log2,
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  min: Math.min,
  max: Math.max,
};

const CONSTS = { pi: Math.PI, e: Math.E, tau: Math.PI * 2 };

function tokenize(src) {
  const tokens = [];
  let i = 0;
  const s = String(src);
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = /^\d*\.?\d+(?:[eE][+-]?\d+)?/.exec(s.slice(i));
      if (!m) throw new Error(`Invalid number near “${s.slice(i, i + 6)}”`);
      tokens.push({ t: 'num', v: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      const m = /^[a-zA-Z_]+/.exec(s.slice(i));
      tokens.push({ t: 'name', v: m[0].toLowerCase() });
      i += m[0].length;
      continue;
    }
    if ('+-*/%^(),'.includes(c)) {
      tokens.push({ t: c });
      i++;
      continue;
    }
    if (c === '×') {
      tokens.push({ t: '*' });
      i++;
      continue;
    }
    if (c === '÷') {
      tokens.push({ t: '/' });
      i++;
      continue;
    }
    if (c === '−') {
      tokens.push({ t: '-' });
      i++;
      continue;
    }
    throw new Error(`Unexpected character “${c}”`);
  }
  return tokens;
}

/** Pratt parser → number. Throws Error with a human message on bad input. */
export function evaluate(expr) {
  const tokens = tokenize(expr);
  if (!tokens.length) throw new Error('Empty expression');
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr(minBp = 0) {
    let left = parseAtom();
    for (;;) {
      const tk = peek();
      if (!tk || tk.t === ')' || tk.t === ',') break;
      const bp = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 }[tk.t];
      if (bp === undefined) throw new Error(`Unexpected “${tk.t ?? tk.v}”`);
      if (bp < minBp) break;
      next();
      const right = parseExpr(tk.t === '^' ? bp : bp + 1);
      left = apply(tk.t, left, right);
    }
    return left;
  }

  function parseAtom() {
    const tk = next();
    if (!tk) throw new Error('Unexpected end of expression');
    if (tk.t === 'num') return tk.v;
    if (tk.t === '(') {
      const v = parseExpr(0);
      const close = next();
      if (!close || close.t !== ')') throw new Error('Missing closing parenthesis');
      return v;
    }
    if (tk.t === '-') return -parseAtom();
    if (tk.t === '+') return parseAtom();
    if (tk.t === 'name') {
      if (tk.v in CONSTS) return CONSTS[tk.v];
      if (tk.v in FUNCS) {
        const open = next();
        if (!open || open.t !== '(') throw new Error(`${tk.v}( … needs parentheses`);
        const args = [parseExpr(0)];
        while (peek() && peek().t === ',') {
          next();
          args.push(parseExpr(0));
        }
        const close = next();
        if (!close || close.t !== ')') throw new Error('Missing closing parenthesis');
        const out = FUNCS[tk.v](...args);
        if (!Number.isFinite(out)) throw new Error(`${tk.v}(${args.join(', ')}) has no finite result`);
        return out;
      }
      throw new Error(`Unknown name “${tk.v}”`);
    }
    throw new Error(`Unexpected “${tk.t}”`);
  }

  const result = parseExpr(0);
  if (pos < tokens.length) throw new Error(`Unexpected “${tokens[pos].t ?? tokens[pos].v}” at the end`);
  if (!Number.isFinite(result)) throw new Error('Result is not a finite number (division by zero?)');
  return result;
}

function apply(op, a, b) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    case '%':
      if (b === 0) throw new Error('Modulo by zero');
      return a % b;
    case '^':
      return a ** b;
    default:
      throw new Error(`Unknown operator ${op}`);
  }
}

/** Compact number formatting for calculator output. */
export function formatResult(n) {
  if (Number.isInteger(n)) return String(n);
  const r = Math.round(n * 1e10) / 1e10;
  return String(r);
}
