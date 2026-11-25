import test from "node:test";
import assert from "node:assert/strict";
import { numberToWords, countWords } from "../js/core/number-words.js";
import { noteForCount } from "../js/core/counting-notes.js";
import { generateProblem } from "../js/core/problem-gen.js";
import { gradeLesson, isMastered, nextMode, onWrong } from "../js/core/mastery.js";

test("T1: numberToWords vi", () => {
  const cases = [
    [0, "không"], [1, "một"], [5, "năm"], [10, "mười"], [11, "mười một"],
    [14, "mười bốn"], [15, "mười lăm"], [20, "hai mươi"], [21, "hai mươi mốt"],
    [24, "hai mươi tư"], [25, "hai mươi lăm"], [40, "bốn mươi"],
    [45, "bốn mươi lăm"], [55, "năm mươi lăm"], [91, "chín mươi mốt"],
    [100, "một trăm"]
  ];
  for (const [n, expected] of cases) {
    assert.equal(numberToWords(n, "vi"), expected);
  }
});

test("T2: numberToWords ja", () => {
  const cases = [
    [0, "ぜろ"], [4, "よん"], [7, "なな"], [9, "きゅう"], [10, "じゅう"],
    [11, "じゅういち"], [14, "じゅうよん"], [19, "じゅうきゅう"], [20, "にじゅう"],
    [30, "さんじゅう"], [47, "よんじゅうなな"], [74, "ななじゅうよん"],
    [90, "きゅうじゅう"], [100, "ひゃく"]
  ];
  for (const [n, expected] of cases) {
    assert.equal(numberToWords(n, "ja"), expected);
  }
});

test("T3: ja counters", () => {
  const ko = ["いっこ", "にこ", "さんこ", "よんこ", "ごこ", "ろっこ", "ななこ", "はっこ", "きゅうこ", "じゅっこ"];
  const hiki = ["いっぴき", "にひき", "さんびき", "よんひき", "ごひき", "ろっぴき", "ななひき", "はっぴき", "きゅうひき", "じゅっぴき"];
  const tsu = ["ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ", "むっつ", "ななつ", "やっつ", "ここのつ", "とお"];
  for (let i = 1; i <= 10; i++) {
    assert.equal(countWords(i, "ko", "ja"), ko[i - 1]);
    assert.equal(countWords(i, "hiki", "ja"), hiki[i - 1]);
    assert.equal(countWords(i, "tsu", "ja"), tsu[i - 1]);
  }
});

test("T4: noteForCount", () => {
  const close = (a, b) => assert.ok(Math.abs(a - b) < 0.01);
  const n1 = noteForCount(1);
  close(n1.freq, 261.63);
  assert.equal(n1.bell, false);

  close(noteForCount(6).freq, 523.25);

  const n10 = noteForCount(10);
  close(n10.freq, 880.00);
  assert.equal(n10.bell, true);

  const n11 = noteForCount(11);
  close(n11.freq, 261.63);
  assert.equal(n11.bell, false);

  assert.equal(noteForCount(20).bell, true);
});

test("T5: generateProblem deterministic, ranges, choices, recent guard", () => {
  const p1 = generateProblem({ kind: "add", max: 10, seed: 42 });
  const p2 = generateProblem({ kind: "add", max: 10, seed: 42 });
  assert.deepEqual(p1, p2);

  for (const kind of ["add", "take", "combine", "compare", "missing"]) {
    for (let seed = 1; seed <= 1000; seed++) {
      const p = generateProblem({ kind, max: 10, seed });
      assert.equal(p.choices.length, 3);
      assert.equal(new Set(p.choices).size, 3);
      assert.ok(p.choices.includes(p.answer));
      for (const c of p.choices) {
        assert.ok(Number.isInteger(c) && c >= 0 && c <= 10);
      }
      if (kind === "add" || kind === "combine") {
        assert.ok(p.a >= 1 && p.b >= 1 && p.a + p.b <= 10);
      } else if (kind === "take") {
        assert.ok(p.a >= 2 && p.a <= 10 && p.b >= 1 && p.b <= p.a && p.answer === p.a - p.b);
      } else if (kind === "compare") {
        assert.ok(p.a > p.b);
        assert.equal(p.answer, p.a - p.b);
      } else if (kind === "missing") {
        assert.ok(p.a >= 2 && p.b >= 1 && p.b < p.a && p.answer === p.a - p.b);
      }
    }
  }

  for (let seed = 1; seed <= 50; seed++) {
    const p = generateProblem({ kind: "add", max: 5, seed, recent: [[2, 3], [2, 3]] });
    assert.ok(!(p.a === 2 && p.b === 3));
  }
});

test("T6: gradeLesson", () => {
  assert.equal(gradeLesson(Array(10).fill(true)), 3);
  assert.equal(gradeLesson([...Array(9).fill(true), false]), 3);
  assert.equal(gradeLesson([...Array(8).fill(true), false, false]), 2);
  assert.equal(gradeLesson([...Array(7).fill(true), false, false, false]), 2);
  assert.equal(gradeLesson([...Array(6).fill(true), ...Array(4).fill(false)]), 1);
  assert.equal(gradeLesson(Array(10).fill(false)), 1);
});

test("T7: isMastered", () => {
  assert.equal(isMastered([{ date: "2026-11-20", correct: 9, total: 10 }]), false);
  assert.equal(isMastered([
    { date: "2026-11-20", correct: 9, total: 10 },
    { date: "2026-11-20", correct: 8, total: 10 }
  ]), false);
  assert.equal(isMastered([
    { date: "2026-11-20", correct: 9, total: 10 },
    { date: "2026-11-21", correct: 7, total: 10 }
  ]), false);
  assert.equal(isMastered([
    { date: "2026-11-20", correct: 8, total: 10 },
    { date: "2026-11-21", correct: 9, total: 10 }
  ]), true);
});

test("T8: nextMode", () => {
  assert.equal(nextMode([false, false]), "concrete");
  assert.equal(nextMode([true, false]), "normal");
  assert.equal(nextMode([false, true, false]), "normal");
  assert.equal(nextMode([true, false, false]), "concrete");
});

test("T12: onWrong", () => {
  assert.deepEqual(onWrong({ wrongCount: 1 }), { tier: "wrong1", hintKey: "hint.recount", mode: "normal" });
  assert.deepEqual(onWrong({ wrongCount: 2 }), { tier: "wrong2", hintKey: "hint.recount", mode: "concrete" });
  assert.deepEqual(onWrong({ wrongCount: 3 }), { tier: "wrong3", hintKey: "hint.recount", mode: "concrete" });
  assert.deepEqual(onWrong({ wrongCount: 4 }), { tier: "wrong3", hintKey: "hint.recount", mode: "concrete" });
  assert.deepEqual(onWrong({ wrongCount: 3, activityType: "A10" }), { tier: "wrong3cmp", hintKey: "hint.pair", mode: "concrete" });
});
