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
  const splitSentences = (text) => {
    const clean = String(text || "").normalize("NFC").trim();
    if (!clean) return [];
    const parts = clean.match(/[^.!?。！？]+[.!?。！？]*/g);
    if (!parts || parts.length <= 1) return [clean];
    return parts.map((p) => p.trim()).filter(Boolean);
  };
  const add = (lang, text) => {
    const clean = String(text || "").normalize("NFC").trim();
    if (!clean) return;
    items[lang].add(clean);
    for (const part of splitSentences(clean)) {
      items[lang].add(part);
    }
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
        add(lang, i18n[lang].ui.tracePrompt.replace("{n}", numberToWords(d, lang)));
      }
    }
    for (const v of Object.values(i18n[lang].hint || {})) {
      add(lang, v);
    }
  }

  // 8. A2 choosePrompt (all 9 chapters), A11 ordinalPrompt (1..10), A13 / A14 / A15 / A16 prompts
  for (const ch of story.chapters) {
    const objLabelVi = ch.object.classifier ? `${ch.object.classifier} ${ch.object.vi}` : ch.object.vi;
    add("vi", i18n.vi.ui.choosePrompt.replace("{object}", objLabelVi));
    add("ja", i18n.ja.ui.choosePrompt.replace("{object}", ch.object.ja));
  }
  for (let n = 1; n <= 10; n++) {
    add("vi", i18n.vi.ui.ordinalPrompt.replace("{ord}", ordinalWords(n, "vi")));
    add("ja", i18n.ja.ui.ordinalPrompt.replace("{ord}", ordinalWords(n, "ja")));
  }
  for (let c = 2; c <= 20; c++) {
    const wVi = numberToWords(c, "vi");
    const wJa = numberToWords(c, "ja");
    add("vi", `Số liền trước của số ${wVi} là số nào?`);
    add("vi", `Số liền sau của số ${wVi} là số nào?`);
    add("ja", `${wJa}の ひとつまえの すうじは いくつ？`);
    add("ja", `${wJa}の ひとつあとの すうじは いくつ？`);
  }
  for (let tot = 2; tot <= 10; tot++) {
    const tVi = numberToWords(tot, "vi");
    const tJa = numberToWords(tot, "ja");
    for (let p = 1; p < tot; p++) {
      add("vi", `${tVi} gồm ${numberToWords(p, "vi")} và mấy?`);
      add("ja", `${tJa}は ${numberToWords(p, "ja")}と いくつ？`);
    }
  }
  for (const s of ["hình tròn", "hình vuông", "hình tam giác", "hình chữ nhật", "khối cầu", "khối trụ", "khối vuông", "khối chữ nhật"]) {
    add("vi", i18n.vi.ui.shapePrompt.replace("{shape}", s));
  }
  for (const s of ["まる", "ましかく", "さんかく", "ながしかく", "たまの かたち", "つつの かたち", "さいころの かたち", "はこの かたち"]) {
    add("ja", i18n.ja.ui.shapePrompt.replace("{shape}", s));
  }
  for (const p of ["trái", "phải", "trên", "dưới", "trước", "sau"]) {
    add("vi", i18n.vi.ui.positionPrompt.replace("{pos}", p));
  }
  for (const p of ["ひだり", "みぎ", "うえ", "した", "まえ", "うしろ"]) {
    add("ja", i18n.ja.ui.positionPrompt.replace("{pos}", p));
  }
  for (const p of [
    "Nhầm rồi! Bên này nhiều hơn, giữ bên ít hơn nhé!",
    "Chọn băng giấy dài hơn nhé!", "Chọn băng giấy ngắn hơn nhé!",
    "Chọn tháp cao hơn nhé!", "Chọn tháp thấp hơn nhé!",
    "Chọn quả nặng hơn nhé!", "Chọn quả nhẹ hơn nhé!",
    "Đo chiều dài quyển sách bằng gì tiện nhất?",
    "Đo chiều dài sân chơi bằng gì tiện nhất?",
    "Đo xem cái cốc đựng được nhiều nước không bằng gì?",
    "Mùa nào hoa nở rực rỡ và ấm áp?", "Mùa nào nắng ấm rực rỡ nhất?",
    "Mùa nào lá vàng lá đỏ rơi nhiều?", "Mùa nào trời lạnh và có tuyết rơi?"
  ]) add("vi", p);
  for (const p of [
    "こっちは おおいよ、すくない ほうを ながおししてね！",
    "ながい ほうを えらぼう！", "みじかい ほうを えらぼう！",
    "たかい ほうを えらぼう！", "ひくい ほうを えらぼう！",
    "おもい ほうを えらぼう！", "かるい ほうを えらぼう！",
    "ほんの ながさを はかるのに どれがいいかな？",
    "ひろばの ながさを はかるのに どれがいいかな？",
    "みずの かさを はかるのに どれがいいかな？",
    "おはなが さいて あたたかい きせつは どれ？", "おひさまが ぴかぴか あつい きせつは どれ？",
    "あかい はっぱが おちる きせつは どれ？", "さむくて ゆきが ふる きせつは どれ？"
  ]) add("ja", p);
  for (const d of DAYS_OF_WEEK) {
    add("vi", `Sau ${d.vi} là thứ mấy nhỉ?`);
    add("ja", `${d.ja}の つぎは なにようびかな？`);
  }

  // 9. A4 finite sentence segments (chapters 1..8, counts 1..10, default name Mây / マイ)
  for (const ch of story.chapters.slice(0, 8)) {
    const counter = ch.object.counter === "hiki" ? "hiki" : "ko";
    const cls = ch.object.classifier;
    const nameVi = DEFAULT_SETTINGS.nameVi;
    const nameJa = DEFAULT_SETTINGS.nameJa;
    for (let n = 1; n <= 10; n++) {
      const wVi = numberToWords(n, "vi");
      const wJa = countWords(n, counter, "ja");
      add("vi", `${ch.animal.vi} có ${wVi} ${cls} ${ch.object.vi}.`);
      add("vi", `${ch.animal.vi} cho bé ${nameVi} ${wVi} ${cls}.`);
      add("vi", `Bé ${nameVi} cho ${ch.animal.vi} thêm ${wVi} ${cls}.`);
      add("vi", `${ch.animal.vi} có tất cả ${wVi} ${cls} ${ch.object.vi}, bé ${nameVi} thấy ${wVi} ${cls}.`);
      add("vi", `Còn mấy ${cls}?`);
      add("vi", `Tất cả có mấy ${cls}?`);
      add("vi", `Còn thiếu mấy ${cls}?`);
      add("vi", `${ch.animal.vi} nhiều hơn mấy ${cls}?`);

      add("ja", `${ch.animal.ja}は ${ch.object.ja}を ${wJa} もっています。`);
      add("ja", `${nameJa}ちゃんに ${wJa} あげました。`);
      add("ja", `${nameJa}ちゃんが ${ch.animal.ja}に ${wJa} あげました。`);
      add("ja", `${ch.object.ja}が ぜんぶで ${wJa} あります。`);
      add("ja", `${nameJa}ちゃんに みえているのは ${wJa}。`);
      add("ja", `のこりは いくつ？`);
      add("ja", `ぜんぶで いくつ？`);
      add("ja", `かくれているのは いくつ？`);
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
