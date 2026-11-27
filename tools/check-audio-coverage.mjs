import fs from "node:fs";
import path from "node:path";
import { hashTtsKey } from "../js/audio/tts-hash.js";
import { numberToWords, countWords } from "../js/core/number-words.js";
import { ordinalWords, clockWords } from "../js/core/ordinal-time.js";
import { compareSentence } from "../js/core/compare.js";
import { DEFAULT_SETTINGS, fillName } from "../js/core/phrases.js";

const ROOT = process.cwd();
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const manifest = readJson("assets/audio/manifest.json");
const sets = { vi: new Set(manifest.vi), ja: new Set(manifest.ja) };

const story = readJson("data/story.json");
const phrases = readJson("data/phrases.json");
const viI18n = readJson("i18n/vi.json");
const jaI18n = readJson("i18n/ja.json");

const missing = [];

function splitSentences(text) {
  const clean = String(text || "").normalize("NFC").trim();
  const parts = clean.match(/[^.!?。！？]+[.!?。！？]*/g);
  return !parts || parts.length <= 1 ? [clean] : parts.map((p) => p.trim()).filter(Boolean);
}

function check(where, lang, text) {
  const clean = String(text || "").normalize("NFC").trim();
  if (!clean) return;
  if (sets[lang].has(hashTtsKey(lang, clean))) return;
  const parts = splitSentences(clean);
  if (parts.length > 1 && parts.every((p) => sets[lang].has(hashTtsKey(lang, p)))) return;
  missing.push({ where, lang, text: clean });
}

// 1. A1, A2, A3, A5, A6, A7 answerSpeech (1..20 for stages 1..8)
for (const ch of story.chapters) {
  const max = ch.stage === 6 || ch.stage === 8 ? 20 : 10;
  for (let n = 1; n <= max; n++) {
    check(`ansSpeech:ch${ch.stage}:${n}`, "vi", `${countWords(n, ch.object.classifier, "vi")} ${ch.object.vi} đó!`);
    check(`ansSpeech:ch${ch.stage}:${n}`, "ja", `${countWords(n, ch.object.counter, "ja")} ${ch.object.ja} ですね！`);
  }
}

// 2. A4 story lines (1..10)
for (const ch of story.chapters.slice(0, 8)) {
  const counter = ch.object.counter === "hiki" ? "hiki" : "ko";
  const cls = ch.object.classifier;
  for (let a = 2; a <= 10; a++) {
    for (let b = 1; b < a; b++) {
      const wA = numberToWords(a, "vi");
      const wB = numberToWords(b, "vi");
      check(`A4:take:ch${ch.stage}`, "vi", `${ch.animal.vi} có ${wA} ${cls} ${ch.object.vi}. ${ch.animal.vi} cho bé ${DEFAULT_SETTINGS.nameVi} ${wB} ${cls}. Còn mấy ${cls}?`);
      check(`A4:add:ch${ch.stage}`, "vi", `${ch.animal.vi} có ${wA} ${cls} ${ch.object.vi}. Bé ${DEFAULT_SETTINGS.nameVi} cho ${ch.animal.vi} thêm ${wB} ${cls}. Tất cả có mấy ${cls}?`);
      check(`A4:missing:ch${ch.stage}`, "vi", `${ch.animal.vi} có tất cả ${wA} ${cls} ${ch.object.vi}. Bé ${DEFAULT_SETTINGS.nameVi} thấy ${wB} ${cls}. Còn thiếu mấy ${cls}?`);
      check(`A4:compare:ch${ch.stage}`, "vi", `${ch.animal.vi} có ${wA} ${cls} ${ch.object.vi}. Bé ${DEFAULT_SETTINGS.nameVi} có ${wB} ${cls}. ${ch.animal.vi} nhiều hơn mấy ${cls}?`);

      const jA = countWords(a, counter, "ja");
      const jB = countWords(b, counter, "ja");
      check(`A4:take:ch${ch.stage}`, "ja", `${ch.animal.ja}は ${ch.object.ja}を ${jA} もっています。${DEFAULT_SETTINGS.nameJa}ちゃんに ${jB} あげました。のこりは いくつ？`);
      check(`A4:add:ch${ch.stage}`, "ja", `${ch.animal.ja}は ${ch.object.ja}を ${jA} もっています。${DEFAULT_SETTINGS.nameJa}ちゃんが ${ch.animal.ja}に ${jB} あげました。ぜんぶで いくつ？`);
      check(`A4:missing:ch${ch.stage}`, "ja", `${ch.object.ja}が ぜんぶで ${jA} あります。${DEFAULT_SETTINGS.nameJa}ちゃんに みえているのは ${jB}。かくれているのは いくつ？`);
      check(`A4:compare:ch${ch.stage}`, "ja", `${ch.animal.ja}は ${jA}。${DEFAULT_SETTINGS.nameJa}ちゃんは ${jB}。ちがいは いくつ？`);
    }
  }
}

// 3. A10 compareSentence (0..10)
for (let a = 0; a <= 10; a++) {
  for (let b = 0; b <= 10; b++) {
    check(`A10:${a}:${b}`, "vi", compareSentence(a, b, "vi", "number"));
    check(`A10:${a}:${b}`, "ja", compareSentence(a, b, "ja", "number"));
  }
}

// 4. A14 clock & clockHalf (1..12)
for (let h = 1; h <= 12; h++) {
  check(`A14:clock:${h}`, "vi", clockWords(h, "vi", false));
  check(`A14:clock:${h}`, "ja", clockWords(h, "ja", false));
  check(`A14:clockHalf:${h}`, "vi", clockWords(h, "vi", true));
  check(`A14:clockHalf:${h}`, "ja", clockWords(h, "ja", true));
}

// 5. All phrases (with sample answers)
for (const [tier, list] of Object.entries(phrases)) {
  for (const item of list) {
    if (!item.vi.includes("{answer}")) check(`phrase:${tier}`, "vi", fillName(item.vi, DEFAULT_SETTINGS.nameVi));
    if (!item.ja.includes("{answer}")) check(`phrase:${tier}`, "ja", fillName(item.ja, DEFAULT_SETTINGS.nameJa));
  }
}

console.log(`Missing audio items: ${missing.length}`);
const byWhere = {};
for (const m of missing) {
  const key = `${m.lang}:${m.where.split(":")[0]}:${m.where.split(":")[1] || ""}`;
  byWhere[key] = (byWhere[key] || 0) + 1;
}
console.log(JSON.stringify(byWhere, null, 2));
if (missing.length > 0) {
  console.log("Sample missing:", missing.slice(0, 10));
}
