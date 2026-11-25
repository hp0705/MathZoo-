import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { hashTtsKey } from "../js/audio/tts-hash.js";
import { numberToWords, countWords } from "../js/core/number-words.js";
import { ordinalWords, clockWords } from "../js/core/ordinal-time.js";

const DAYS_OF_WEEK = [
  { vi: "Thứ Hai", ja: "げつようび" },
  { vi: "Thứ Ba", ja: "かようび" },
  { vi: "Thứ Tư", ja: "すいようび" },
  { vi: "Thứ Năm", ja: "もくようび" },
  { vi: "Thứ Sáu", ja: "きんようび" },
  { vi: "Thứ Bảy", ja: "どようび" },
  { vi: "Chủ nhật", ja: "にちようび" }
];

const SEASONS = [
  { vi: "mùa xuân", ja: "はる" },
  { vi: "mùa hạ", ja: "なつ" },
  { vi: "mùa thu", ja: "あき" },
  { vi: "mùa đông", ja: "ふゆ" }
];
import { DEFAULT_SETTINGS, fillName } from "../js/core/phrases.js";

const ROOT = process.cwd();
const OUT_ROOT = path.join(ROOT, "assets", "audio");
const PYTHON_BIN = process.env.PYTHON || "python";
const TTS_HELPER = path.join(ROOT, "tools", "tts_helper.py");
const CONCURRENCY = 4;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function collectTexts() {
  const items = { vi: new Set(), ja: new Set() };
  const add = (lang, text) => {
    const clean = String(text || "").normalize("NFC").trim();
    if (clean) items[lang].add(clean);
  };

  // 1. Numbers 0..20 and tens 30..100
  for (let n = 0; n <= 20; n++) {
    add("vi", numberToWords(n, "vi"));
    add("ja", numberToWords(n, "ja"));
  }
  for (let n = 30; n <= 100; n += 10) {
    add("vi", numberToWords(n, "vi"));
    add("ja", numberToWords(n, "ja"));
  }

  // 2. Japanese counters 1..10
  for (let n = 1; n <= 10; n++) {
    for (const unit of ["tsu", "ko", "hiki"]) {
      add("ja", countWords(n, unit, "ja"));
    }
  }

  // 3. Ordinals, days, seasons, clocks
  for (let n = 1; n <= 10; n++) {
    add("vi", ordinalWords(n, "vi"));
    add("ja", ordinalWords(n, "ja"));
  }
  for (const d of DAYS_OF_WEEK) {
    add("vi", d.vi);
    add("ja", d.ja);
  }
  for (const s of SEASONS) {
    add("vi", s.vi);
    add("ja", s.ja);
  }
  for (let h = 1; h <= 12; h++) {
    add("vi", clockWords(h, "vi"));
    add("ja", clockWords(h, "ja"));
  }

  // 4. Voice manifest
  const manifest = readJson("data/voice-manifest.json");
  for (const entry of Object.values(manifest)) {
    add("vi", entry.vi);
    add("ja", entry.ja);
  }

  // 5. Story lines (default name Mây / マイ)
  const story = readJson("data/story.json");
  for (const ch of story.chapters) {
    const replaceVars = (tpl, lang, name) =>
      fillName(tpl, name)
        .replaceAll("{animal}", ch.animal[lang])
        .replaceAll("{object}", ch.object[lang]);
    add("vi", replaceVars(ch.intro.vi, "vi", DEFAULT_SETTINGS.nameVi));
    add("ja", replaceVars(ch.intro.ja, "ja", DEFAULT_SETTINGS.nameJa));
    for (const kind of ["mid", "close"]) {
      for (const beat of story.beats[kind] || []) {
        add("vi", replaceVars(beat.vi, "vi", DEFAULT_SETTINGS.nameVi));
        add("ja", replaceVars(beat.ja, "ja", DEFAULT_SETTINGS.nameJa));
      }
    }
  }
  if (story.finale) {
    add("vi", fillName(story.finale.vi, DEFAULT_SETTINGS.nameVi));
    add("ja", fillName(story.finale.ja, DEFAULT_SETTINGS.nameJa));
  }

  // 6. Phrases without {answer} (default name Mây / マイ)
  const phrases = readJson("data/phrases.json");
  for (const list of Object.values(phrases)) {
    for (const entry of list) {
      if (!String(entry.vi).includes("{answer}")) {
        add("vi", fillName(entry.vi, DEFAULT_SETTINGS.nameVi));
      }
      if (!String(entry.ja).includes("{answer}")) {
        add("ja", fillName(entry.ja, DEFAULT_SETTINGS.nameJa));
      }
    }
  }

  // 7. Static UI prompts & hints
  const i18n = { vi: readJson("i18n/vi.json"), ja: readJson("i18n/ja.json") };
  for (const lang of ["vi", "ja"]) {
    for (const [k, v] of Object.entries(i18n[lang].ui || {})) {
      if (k.endsWith("Prompt") && !v.includes("{")) {
        add(lang, v);
      }
    }
    if (i18n[lang].ui?.tracePrompt) {
      for (let d = 0; d <= 9; d++) {
        add(lang, i18n[lang].ui.tracePrompt.replace("{n}", String(d)));
      }
    }
    for (const v of Object.values(i18n[lang].hint || {})) {
      add(lang, v);
    }
  }

  return items;
}

function synthesizeBatch(tasks) {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [TTS_HELPER, "--batch"], { stdio: ["pipe", "inherit", "inherit"] });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`tts_helper batch exited with code ${code}`));
    });
    child.stdin.end(JSON.stringify(tasks), "utf8");
  });
}

async function main() {
  const items = collectTexts();
  const tasks = [];
  const manifest = { vi: [], ja: [] };

  for (const lang of ["vi", "ja"]) {
    const dir = path.join(OUT_ROOT, lang);
    fs.mkdirSync(dir, { recursive: true });
    for (const text of items[lang]) {
      const hash = hashTtsKey(lang, text);
      manifest[lang].push(hash);
      const outFile = path.join(dir, `${hash}.mp3`);
      if (fs.existsSync(outFile) && fs.statSync(outFile).size === 0) {
        fs.unlinkSync(outFile);
      }
      if (!fs.existsSync(outFile)) {
        tasks.push({ lang, text, out: outFile });
      }
    }
  }

  console.log(`Total phrases: vi=${manifest.vi.length}, ja=${manifest.ja.length}. Generating ${tasks.length} missing MP3 files...`);

  if (tasks.length > 0) {
    await synthesizeBatch(tasks);
  }

  // Only include hashes whose MP3 file actually exists and is non-empty
  for (const lang of ["vi", "ja"]) {
    manifest[lang] = manifest[lang].filter((hash) => {
      const f = path.join(OUT_ROOT, lang, `${hash}.mp3`);
      return fs.existsSync(f) && fs.statSync(f).size > 0;
    });
  }

  fs.writeFileSync(path.join(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done! Manifest saved (vi=${manifest.vi.length}, ja=${manifest.ja.length}).`);
}

main();
