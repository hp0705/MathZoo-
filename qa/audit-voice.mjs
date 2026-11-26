import fs from "node:fs";
import path from "node:path";
import { hashTtsKey } from "../js/audio/tts-hash.js";
import { numberToWords, countWords } from "../js/core/number-words.js";
import { ordinalWords, clockWords } from "../js/core/ordinal-time.js";
import { compareSentence } from "../js/core/compare.js";
import { DEFAULT_SETTINGS, fillName } from "../js/core/phrases.js";

const ROOT = process.cwd();
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const story = readJson("data/story.json");
const phrases = readJson("data/phrases.json");
const viI18n = readJson("i18n/vi.json");
const jaI18n = readJson("i18n/ja.json");
const audioManifest = readJson("assets/audio/manifest.json");

const manifestSets = {
  vi: new Set(audioManifest.vi || []),
  ja: new Set(audioManifest.ja || [])
};

const logs = [];
function record(screen, lang, text) {
  const clean = String(text || "").normalize("NFC").trim();
  const hash = hashTtsKey(lang, clean);
  const inStaticMp3 = manifestSets[lang].has(hash);
  const wordCount = lang === "vi" ? clean.split(/\s+/).filter(Boolean).length : clean.length;
  const hasRawDigits = /\d/.test(clean);
  const hasKanji = lang === "ja" && /[\u4E00-\u9FAF]/.test(clean);
  logs.push({
    screen,
    lang,
    text: clean,
    source: inStaticMp3 ? `assets/audio/${lang}/${hash}.mp3` : `/api/tts?lang=${lang}&text=... (or speechSynthesis fallback)`,
    inStaticMp3,
    voice: lang === "ja" ? "ja-JP-NanamiNeural (fallback: speechSynthesis ja-JP)" : "vi-VN-HoaiMyNeural (fallback: speechSynthesis vi-VN)",
    rate: lang === "ja" ? "-8% (fallback 0.95)" : "0% (fallback 0.95)",
    pitch: lang === "ja" ? "+3Hz (fallback 1.02)" : "0Hz (fallback 1.02)",
    wordOrCharCount: wordCount,
    hasRawDigits,
    hasKanji
  });
}

// Sample story intros
for (const ch of story.chapters) {
  for (const lang of ["vi", "ja"]) {
    const name = lang === "ja" ? DEFAULT_SETTINGS.nameJa : DEFAULT_SETTINGS.nameVi;
    const line = fillName(ch.intro[lang], name)
      .replaceAll("{animal}", ch.animal[lang])
      .replaceAll("{object}", ch.object[lang]);
    record(`story-intro:ch${ch.stage}`, lang, line);
  }
}

// Sample A4 give-receive dynamic story texts (exposing raw digits + counter issue in JA)
for (const n of [1, 3, 4, 6, 7, 8, 9, 10]) {
  const chHiki = story.chapters[2]; // stage 3: cá (hiki)
  const chKo = story.chapters[1];   // stage 2: táo (ko)
  record("A4:give-receive(hiki)", "ja", `${chHiki.animal.ja}は ${chHiki.object.ja}を ${n}ひき もっています。ともだちに 1ひき あげました。のこりは いくつ？`);
  record("A4:give-receive(ko)", "ja", `${chKo.animal.ja}は ${chKo.object.ja}を ${n}こ もっています。1こ もらいました。ぜんぶで いくつ？`);
  record("A4:give-receive", "vi", `${chKo.animal.vi} có ${n} ${chKo.object.classifier} ${chKo.object.vi}. Cho bạn 1 ${chKo.object.classifier}. Còn mấy ${chKo.object.classifier}?`);
}

// Numbers 4, 7, 9, 10, 15, 21, 24, 25
for (const n of [0, 4, 7, 9, 10, 15, 21, 24, 25]) {
  record(`number:${n}`, "vi", numberToWords(n, "vi"));
  record(`number:${n}`, "ja", numberToWords(n, "ja"));
}

// Clocks 4, 7, 9
for (const h of [4, 7, 9]) {
  record(`A14:clock:${h}`, "vi", clockWords(h, "vi"));
  record(`A14:clock:${h}`, "ja", clockWords(h, "ja"));
}

// Compare sentences
record("A10:compare(3>2)", "vi", compareSentence(3, 2, "vi", "number"));
record("A10:compare(3>2)", "ja", compareSentence(3, 2, "ja", "number"));
record("A10:compare(5=5)", "vi", compareSentence(5, 5, "vi", "number"));
record("A10:compare(5=5)", "ja", compareSentence(5, 5, "ja", "number"));

// Phrases (praise, wrong1, wrong2, wrong3, wrong3cmp, finish)
for (const [tier, list] of Object.entries(phrases)) {
  for (const item of list.slice(0, 2)) {
    record(`feedback:${tier}`, "vi", fillName(item.vi, DEFAULT_SETTINGS.nameVi).replaceAll("{answer}", "năm"));
    record(`feedback:${tier}`, "ja", fillName(item.ja, DEFAULT_SETTINGS.nameJa).replaceAll("{answer}", "ご"));
  }
}

// UI Prompts
for (const k of ["countPrompt", "dragEqualPrompt", "splitPrompt", "tenFramePrompt", "matchPrompt", "boardPrompt", "compareSignPrompt", "patternPrompt", "measurePrompt", "clockPrompt"]) {
  record(`prompt:${k}`, "vi", viI18n.ui[k]);
  record(`prompt:${k}`, "ja", jaI18n.ui[k]);
}
record("prompt:tracePrompt(5)", "vi", viI18n.ui.tracePrompt.replace("{n}", "5"));
record("prompt:tracePrompt(5)", "ja", jaI18n.ui.tracePrompt.replace("{n}", "5"));

fs.writeFileSync(path.join(ROOT, "qa", "04_voice_log.json"), JSON.stringify(logs, null, 2));

const longVi = logs.filter((l) => l.lang === "vi" && l.wordOrCharCount > 12);
const rawDigitLogs = logs.filter((l) => l.hasRawDigits);
console.log(JSON.stringify({
  totalVoiceSamples: logs.length,
  staticMp3Covered: logs.filter((l) => l.inStaticMp3).length,
  dynamicOrFallback: logs.filter((l) => !l.inStaticMp3).length,
  viOver12Words: longVi.length,
  rawDigitSamples: rawDigitLogs.length,
  kanjiSamples: logs.filter((l) => l.hasKanji).length
}, null, 2));
