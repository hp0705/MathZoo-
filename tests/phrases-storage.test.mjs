import test from "node:test";
import assert from "node:assert/strict";
import { pickPhrase, composeFeedback, chooseTier } from "../js/core/phrases.js";
import { saveProgress, loadProgress, createInitialProgress } from "../js/core/storage.js";

test("T11: storage fallback when localStorage.setItem throws", () => {
  const brokenStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("QuotaExceeded"); }
  };
  const state = createInitialProgress();
  state.stars["s1-l01"] = 3;
  assert.doesNotThrow(() => saveProgress(state, brokenStorage));
  const loaded = loadProgress(brokenStorage);
  assert.equal(loaded.stars["s1-l01"], 3);
});

test("T14: pickPhrase never repeats lastIndex and respects gender", () => {
  const list = [
    { vi: "f1", ja: "f1", for: "f" },
    { vi: "a1", ja: "a1", for: "any" },
    { vi: "a2", ja: "a2", for: "any" },
    { vi: "a3", ja: "a3", for: "any" },
    { vi: "a4", ja: "a4", for: "any" },
    { vi: "f2", ja: "f2", for: "f" }
  ];
  let last = -1;
  for (let i = 0; i < 10000; i++) {
    const { index } = pickPhrase(list, last, "f");
    assert.notEqual(index, last);
    last = index;
  }

  last = -1;
  for (let i = 0; i < 500; i++) {
    const { item, index } = pickPhrase(list, last, "m");
    assert.notEqual(item.for, "f");
    assert.notEqual(index, last);
    last = index;
  }
});

test("T15: composeFeedback single active language, name and speak override", () => {
  const samplePhrases = {
    praise: [
      { vi: "Đúng rồi, bé {name}!", ja: "{name}ちゃん、せいかい！", for: "any" }
    ]
  };
  const resVi = composeFeedback({
    phrases: samplePhrases,
    tier: "praise",
    settings: { nameVi: "Mây", nameJa: "マイ", speakVi: "May", speakJa: "", gender: "f", lang: "vi" }
  });
  assert.equal(resVi.segments.length, 1);
  assert.equal(resVi.segments[0].lang, "vi");
  assert.ok(resVi.segments[0].text.includes("Mây"));
  assert.ok(resVi.segments[0].speak.includes("May"));
  assert.ok(!resVi.segments[0].text.includes("{"));

  const resJa = composeFeedback({
    phrases: samplePhrases,
    tier: "praise",
    settings: { nameVi: "Mây", nameJa: "マイ", speakVi: "", speakJa: "", gender: "f", lang: "ja" }
  });
  assert.equal(resJa.segments.length, 1);
  assert.equal(resJa.segments[0].lang, "ja");
  assert.ok(resJa.segments[0].text.includes("マイ"));
  assert.ok(!resJa.segments[0].text.includes("{"));
});

test("T17: chooseTier", () => {
  assert.equal(chooseTier({ correct: true, streak: 2 }), "praise");
  assert.equal(chooseTier({ correct: true, streak: 3 }), "streak");
  assert.equal(chooseTier({ correct: false, wrongCount: 1 }), "wrong1");
  assert.equal(chooseTier({ correct: false, wrongCount: 2 }), "wrong2");
  assert.equal(chooseTier({ correct: false, wrongCount: 3 }), "wrong3");
  assert.equal(chooseTier({ correct: false, wrongCount: 3, activityType: "A10" }), "wrong3cmp");
  assert.equal(chooseTier({ finished: true }), "finish");
});
