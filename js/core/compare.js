import { numberToWords } from "./number-words.js";
import { mulberry32, randInt, shuffleWithRng } from "./problem-gen.js";

/**
 * Return the comparison sign between two numbers.
 */
export function signAnswer(a, b) {
  if (a > b) return ">";
  if (a < b) return "<";
  return "=";
}

/**
 * Return the full spoken comparison sentence in Vietnamese or Japanese.
 */
export function compareSentence(a, b, lang = "vi", mode = "number") {
  const A = numberToWords(a, lang);
  const B = numberToWords(b, lang);
  if (mode === "group") {
    if (lang === "ja") {
      if (a > b) return `${A}は ${B}より おおい`;
      if (a < b) return `${A}は ${B}より すくない`;
      return "ふたつは おなじ";
    }
    if (a > b) return `${A} nhiều hơn ${B}`;
    if (a < b) return `${A} ít hơn ${B}`;
    return "hai nhóm bằng nhau";
  }

  if (lang === "ja") {
    if (a > b) return `${A}は ${B}より おおきい`;
    if (a < b) return `${A}は ${B}より ちいさい`;
    return `${A}と ${B}は おなじ`;
  }
  if (a > b) return `${A} lớn hơn ${B}`;
  if (a < b) return `${A} bé hơn ${B}`;
  return `${A} bằng ${B}`;
}

function buildSignSequence(count, allowEqual, rng, focusSign = null) {
  let pool;
  if (focusSign === ">" || focusSign === "<") {
    if (allowEqual && count >= 3) {
      const eqCount = Math.max(1, Math.round(count * 0.25));
      pool = Array.from({ length: count }, (_, i) => (i < eqCount ? "=" : focusSign));
    } else {
      pool = Array.from({ length: count }, () => focusSign);
    }
    return shuffleWithRng(pool, rng);
  }
  if (count === 10) {
    pool = allowEqual
      ? [">", ">", ">", ">", "<", "<", "<", "<", "=", "="]
      : [">", ">", ">", ">", ">", "<", "<", "<", "<", "<"];
  } else {
    const signs = allowEqual ? [">", "<", "="] : [">", "<"];
    pool = Array.from({ length: count }, (_, i) => signs[i % signs.length]);
  }
  for (let attempt = 0; attempt < 100; attempt++) {
    const seq = shuffleWithRng(pool, rng);
    let ok = true;
    for (let i = 2; i < seq.length; i++) {
      if (seq[i] === seq[i - 1] && seq[i] === seq[i - 2]) {
        ok = false;
        break;
      }
    }
    if (ok) return seq;
  }
  return pool;
}

function pickPairForSign(sign, max, rng, prevKey) {
  const cap = Math.max(1, max);
  for (let attempt = 0; attempt < 60; attempt++) {
    let a = randInt(rng, 0, cap);
    let b = randInt(rng, 0, cap);
    if (sign === "=") {
      b = a;
    } else if (sign === ">") {
      if (a <= b) {
        a = randInt(rng, 1, cap);
        b = randInt(rng, 0, a - 1);
      }
    } else if (a >= b) {
      b = randInt(rng, 1, cap);
      a = randInt(rng, 0, b - 1);
    }
    const key = `${a}:${b}`;
    if (key !== prevKey) return { a, b, key };
  }
  return sign === ">" ? { a: cap, b: 0, key: `${cap}:0` }
    : sign === "<" ? { a: 0, b: cap, key: `0:${cap}` }
    : { a: 1, b: 1, key: "1:1" };
}

/**
 * Generate a balanced set of comparison sign problems (A10a / A10b).
 */
export function generateSignSet({ count = 10, max = 10, allowEqual = false, focusSign = null, seed = 1 }) {
  const rng = mulberry32(seed);
  const seq = buildSignSequence(count, allowEqual, rng, focusSign);
  let prevKey = "";
  return seq.map((targetSign) => {
    const { a, b, key } = pickPairForSign(targetSign, max, rng, prevKey);
    prevKey = key;
    return {
      a,
      b,
      answer: signAnswer(a, b),
      choices: shuffleWithRng([">", "<", "="], rng)
    };
  });
}

function makeSideForValue(val, max, makeExpr, rng) {
  if (!makeExpr) return val;
  if (val >= 2 && (val === max || rng() < 0.55)) {
    const x = randInt(rng, 1, val - 1);
    return { x, op: "+", y: val - x };
  }
  const yMax = Math.max(1, max - val);
  const y = randInt(rng, 1, yMax);
  return { x: val + y, op: "-", y };
}

export function evalSide(side) {
  if (typeof side === "number") return side;
  return side.op === "+" ? side.x + side.y : side.x - side.y;
}

/**
 * Generate a balanced set of expression comparison problems (A10c).
 */
export function generateSignExprSet({ count = 10, max = 10, seed = 1 }) {
  const rng = mulberry32(seed);
  const seq = buildSignSequence(count, true, rng);
  let prevKey = "";
  return seq.map((targetSign, idx) => {
    const { a, b, key } = pickPairForSign(targetSign, max, rng, prevKey);
    prevKey = key;
    const leftExpr = idx % 2 === 0 || rng() < 0.7;
    const rightExpr = !leftExpr || rng() < 0.5;
    const left = makeSideForValue(a, max, leftExpr, rng);
    const right = makeSideForValue(b, max, rightExpr, rng);
    return {
      a: left,
      b: right,
      answer: signAnswer(evalSide(left), evalSide(right)),
      choices: shuffleWithRng([">", "<", "="], rng)
    };
  });
}
