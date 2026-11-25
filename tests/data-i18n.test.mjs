import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateAll } from "../tools/validate-data.mjs";

const KANJI_RE = /[一-龯]/;

function flattenKeys(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flattenKeys(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

test("T9: i18n parity and no kanji in child-facing Japanese", () => {
  const vi = flattenKeys(JSON.parse(fs.readFileSync("i18n/vi.json", "utf8")));
  const ja = flattenKeys(JSON.parse(fs.readFileSync("i18n/ja.json", "utf8")));
  assert.deepEqual(Object.keys(vi).sort(), Object.keys(ja).sort());

  for (const [k, v] of Object.entries(vi)) {
    assert.ok(typeof v === "string" && v.trim().length > 0, `Empty vi key: ${k}`);
  }
  for (const [k, v] of Object.entries(ja)) {
    assert.ok(typeof v === "string" && v.trim().length > 0, `Empty ja key: ${k}`);
    if (!k.startsWith("parent.")) {
      assert.ok(!KANJI_RE.test(v), `Kanji found in child-facing ja key ${k}: ${v}`);
    }
  }

  const story = JSON.parse(fs.readFileSync("data/story.json", "utf8"));
  for (const ch of story.chapters) {
    for (const field of ["zone", "animal", "object", "intro", "outro", "sticker"]) {
      assert.ok(!KANJI_RE.test(ch[field].ja), `Kanji in story chapter ${ch.stage}.${field}`);
    }
  }
  for (const b of [...story.beats.mid, ...story.beats.close, story.finale]) {
    assert.ok(!KANJI_RE.test(b.ja), `Kanji in story beat: ${b.ja}`);
  }

  const phrases = JSON.parse(fs.readFileSync("data/phrases.json", "utf8"));
  for (const [tier, list] of Object.entries(phrases)) {
    for (const item of list) {
      assert.ok(!KANJI_RE.test(item.ja), `Kanji in phrase ${tier}: ${item.ja}`);
    }
  }
});

test("T10: data validation passes with zero errors", () => {
  const errs = validateAll();
  assert.deepEqual(errs, []);
});

test("T13: phrases data counts and placeholders", () => {
  const phrases = JSON.parse(fs.readFileSync("data/phrases.json", "utf8"));
  const minCounts = {
    praise: 8, streak: 3, wrong1: 6, wrong2: 5,
    wrong3: 3, wrong3cmp: 3, finish: 6, greet: 2, idle: 3
  };
  for (const [tier, min] of Object.entries(minCounts)) {
    const list = phrases[tier];
    assert.ok(Array.isArray(list) && list.length >= min, `${tier} needs >= ${min}`);
    for (const item of list) {
      assert.ok(item.vi && item.ja, `Both vi and ja required in ${tier}`);
      if (["praise", "streak", "finish", "greet"].includes(tier)) {
        assert.ok(item.vi.includes("{name}") && item.ja.includes("{name}"), `{name} missing in ${tier}`);
      }
      if (tier === "wrong3" || tier === "wrong3cmp") {
        assert.ok(item.vi.includes("{answer}") && item.ja.includes("{answer}"), `{answer} missing in ${tier}`);
      }
      if (tier === "wrong1") {
        assert.ok(/(Sai|Chưa đúng|Nhầm|Không phải)/i.test(item.vi), `Clear wrong word missing in vi wrong1: ${item.vi}`);
        assert.ok(/(ちがう|おしい|まちが|ざんねん)/.test(item.ja), `Clear wrong word missing in ja wrong1: ${item.ja}`);
      }
    }
  }
});

test("T16: story data structure", () => {
  const story = JSON.parse(fs.readFileSync("data/story.json", "utf8"));
  assert.equal(story.chapters.length, 9);
  story.chapters.forEach((ch, idx) => {
    assert.equal(ch.stage, idx + 1);
    if (ch.stage === 9) assert.equal(ch.optional, true);
    else assert.equal(ch.optional, undefined);
    for (const f of ["zone", "animal", "object", "intro", "outro", "sticker"]) {
      assert.ok(ch[f]?.vi && ch[f]?.ja);
    }
    assert.ok(ch.intro.vi.includes("{name}") && ch.intro.ja.includes("{name}"));
    assert.ok(ch.outro.vi.includes("{name}") && ch.outro.ja.includes("{name}"));
  });
  assert.ok(story.beats.mid.length >= 3);
  assert.ok(story.beats.close.length >= 3);
});
