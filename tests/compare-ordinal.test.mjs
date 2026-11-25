import test from "node:test";
import assert from "node:assert/strict";
import { ordinalWords, clockWords } from "../js/core/ordinal-time.js";
import {
  signAnswer,
  compareSentence,
  generateSignSet,
  generateSignExprSet,
  evalSide
} from "../js/core/compare.js";
import { generateProblem } from "../js/core/problem-gen.js";

test("T18: ordinalWords and clockWords", () => {
  const viOrd = [
    "thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm",
    "thứ sáu", "thứ bảy", "thứ tám", "thứ chín", "thứ mười"
  ];
  const jaOrd = [
    "いちばんめ", "にばんめ", "さんばんめ", "よんばんめ", "ごばんめ",
    "ろくばんめ", "ななばんめ", "はちばんめ", "きゅうばんめ", "じゅうばんめ"
  ];
  for (let i = 1; i <= 10; i++) {
    assert.equal(ordinalWords(i, "vi"), viOrd[i - 1]);
    assert.equal(ordinalWords(i, "ja"), jaOrd[i - 1]);
  }
  assert.equal(clockWords(1, "ja"), "いちじ");
  assert.equal(clockWords(4, "ja"), "よじ");
  assert.equal(clockWords(7, "ja"), "しちじ");
  assert.equal(clockWords(9, "ja"), "くじ");
  assert.equal(clockWords(10, "ja"), "じゅうじ");
  assert.equal(clockWords(11, "ja"), "じゅういちじ");
  assert.equal(clockWords(12, "ja"), "じゅうにじ");

  assert.equal(clockWords(4, "vi"), "bốn giờ");
  assert.equal(clockWords(5, "vi"), "năm giờ");
  assert.equal(clockWords(12, "vi"), "mười hai giờ");
});

test("T19: compareSentence and signAnswer", () => {
  assert.equal(compareSentence(3, 2, "vi", "number"), "ba lớn hơn hai");
  assert.equal(compareSentence(2, 3, "vi", "number"), "hai bé hơn ba");
  assert.equal(compareSentence(3, 3, "vi", "number"), "ba bằng ba");

  assert.equal(compareSentence(3, 2, "ja", "number"), "さんは により おおきい");
  assert.equal(compareSentence(2, 3, "ja", "number"), "には さんより ちいさい");
  assert.equal(compareSentence(3, 3, "ja", "number"), "さんと さんは おなじ");

  assert.equal(compareSentence(5, 3, "vi", "group"), "năm nhiều hơn ba");
  assert.equal(compareSentence(3, 5, "vi", "group"), "ba ít hơn năm");
  assert.equal(compareSentence(5, 3, "ja", "group"), "ごは さんより おおい");
  assert.equal(compareSentence(3, 5, "ja", "group"), "さんは ごより すくない");

  assert.equal(signAnswer(3, 2), ">");
  assert.equal(signAnswer(2, 3), "<");
  assert.equal(signAnswer(4, 4), "=");
});

test("T20: generateSignSet", () => {
  const s1 = generateSignSet({ count: 10, max: 10, allowEqual: false, seed: 123 });
  const s2 = generateSignSet({ count: 10, max: 10, allowEqual: false, seed: 123 });
  assert.deepEqual(s1, s2);

  for (let seed = 1; seed <= 500; seed++) {
    const setNoEq = generateSignSet({ count: 10, max: 10, allowEqual: false, seed });
    const counts = { ">": 0, "<": 0, "=": 0 };
    for (let i = 0; i < setNoEq.length; i++) {
      const q = setNoEq[i];
      counts[q.answer]++;
      assert.equal(q.answer, signAnswer(q.a, q.b));
      assert.ok(q.a >= 0 && q.a <= 10 && q.b >= 0 && q.b <= 10);
      assert.deepEqual(new Set(q.choices), new Set([">", "<", "="]));
      if (i >= 2) {
        assert.ok(!(q.answer === setNoEq[i - 1].answer && q.answer === setNoEq[i - 2].answer));
      }
      if (i >= 1) {
        assert.ok(!(q.a === setNoEq[i - 1].a && q.b === setNoEq[i - 1].b));
      }
    }
    assert.equal(counts[">"], 5);
    assert.equal(counts["<"], 5);
    assert.equal(counts["="], 0);

    const setEq = generateSignSet({ count: 10, max: 20, allowEqual: true, seed });
    const countsEq = { ">": 0, "<": 0, "=": 0 };
    for (const q of setEq) countsEq[q.answer]++;
    assert.equal(countsEq["="], 2);
    assert.equal(countsEq[">"], 4);
    assert.equal(countsEq["<"], 4);
  }
});

test("T21: generateSignExprSet and ordinal problems", () => {
  for (let seed = 1; seed <= 500; seed++) {
    const set = generateSignExprSet({ count: 10, max: 10, seed });
    const counts = { ">": 0, "<": 0, "=": 0 };
    for (let i = 0; i < set.length; i++) {
      const q = set[i];
      const va = evalSide(q.a);
      const vb = evalSide(q.b);
      assert.ok(va >= 0 && va <= 10 && vb >= 0 && vb <= 10);
      if (typeof q.a === "object" && q.a.op === "-") assert.ok(q.a.x - q.a.y >= 0);
      if (typeof q.b === "object" && q.b.op === "-") assert.ok(q.b.x - q.b.y >= 0);
      assert.equal(q.answer, signAnswer(va, vb));
      counts[q.answer]++;
      if (i >= 2) {
        assert.ok(!(q.answer === set[i - 1].answer && q.answer === set[i - 2].answer));
      }
    }
    assert.equal(counts["="], 2);
    assert.equal(counts[">"], 4);
    assert.equal(counts["<"], 4);
  }

  for (let seed = 1; seed <= 100; seed++) {
    const p = generateProblem({ kind: "ordinal", max: 10, seed });
    assert.ok(p.a >= 3 && p.a <= 10);
    assert.ok(p.b >= 1 && p.b <= p.a);
    assert.equal(p.answer, p.b);
    assert.equal(p.choices.length, 3);
    assert.equal(new Set(p.choices).size, 3);
    assert.ok(p.choices.includes(p.answer));
    for (const c of p.choices) assert.ok(c >= 1 && c <= p.a);
  }
});
