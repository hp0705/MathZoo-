/**
 * Deterministic PRNG (Mulberry32) for reproducible problem generation.
 */
export function mulberry32(seed) {
  let a = (Number(seed) >>> 0) || 1;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

export function shuffleWithRng(items, rng) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeChoices(answer, min, max, rng) {
  const set = new Set([answer]);
  let guard = 0;
  while (set.size < 3 && guard < 200) {
    guard++;
    const delta = randInt(rng, -3, 3);
    const candidate = Math.min(max, Math.max(min, answer + delta));
    if (candidate !== answer) set.add(candidate);
  }
  for (let v = min; set.size < 3 && v <= max; v++) {
    set.add(v);
  }
  return shuffleWithRng([...set], rng);
}

function isRepeatedTwice(recent, a, b) {
  if (!Array.isArray(recent) || recent.length < 2) return false;
  const p1 = recent[recent.length - 1];
  const p2 = recent[recent.length - 2];
  return p1 && p2 && p1[0] === a && p1[1] === b && p2[0] === a && p2[1] === b;
}

function samplePair(kind, max, rng, recent) {
  for (let attempt = 0; attempt < 50; attempt++) {
    let a = 1;
    let b = 1;
    let answer = 0;

    if (kind === "add" || kind === "combine") {
      const cap = Math.max(2, max);
      a = randInt(rng, 1, cap - 1);
      b = randInt(rng, 1, cap - a);
      answer = a + b;
    } else if (kind === "take") {
      const cap = Math.max(2, max);
      a = randInt(rng, 2, cap);
      b = randInt(rng, 1, a);
      answer = a - b;
    } else if (kind === "compare") {
      const cap = Math.max(2, max);
      a = randInt(rng, 1, cap);
      b = randInt(rng, 1, cap);
      if (a === b) {
        b = a < cap ? a + 1 : a - 1;
      }
      if (a < b) [a, b] = [b, a];
      answer = a - b;
    } else if (kind === "missing") {
      const cap = Math.max(2, max);
      a = randInt(rng, 2, cap); // total t
      b = randInt(rng, 1, a - 1); // known part p
      answer = a - b;
    } else if (kind === "ordinal") {
      const n = randInt(rng, 3, Math.min(10, Math.max(3, max)));
      const p = randInt(rng, 1, n);
      a = n;
      b = p;
      answer = p;
    } else {
      throw new Error(`Unsupported problem kind: ${kind}`);
    }

    if (!isRepeatedTwice(recent, a, b)) {
      return { a, b, answer };
    }
  }
  return { a: 1, b: 1, answer: kind === "take" ? 0 : 2 };
}

/**
 * Generate a deterministic math problem for the given kind and max.
 */
export function generateProblem({ kind, max = 10, seed = 1, recent = [] }) {
  const rng = mulberry32(seed);
  const { a, b, answer } = samplePair(kind, max, rng, recent);
  const minChoice = kind === "ordinal" ? 1 : 0;
  const maxChoice = kind === "ordinal" ? a : max;
  const choices = makeChoices(answer, minChoice, maxChoice, rng);
  return { kind, a, b, answer, choices };
}
