import fs from "node:fs";
import path from "node:path";
import { generateProblem } from "../js/core/problem-gen.js";
import { generateSignSet, generateSignExprSet, evalSide, signAnswer, compareSentence } from "../js/core/compare.js";
import { numberToWords, countWords } from "../js/core/number-words.js";
import { ordinalWords, clockWords } from "../js/core/ordinal-time.js";
import { composeFeedback } from "../js/core/phrases.js";

const ROOT = process.cwd();
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const lessonsData = readJson("data/lessons.json");
const storyData = readJson("data/story.json");
const phrasesData = readJson("data/phrases.json");
const viI18n = readJson("i18n/vi.json");
const jaI18n = readJson("i18n/ja.json");

const dump = [];
const issues = [];
const answerPosCounts = { 0: 0, 1: 0, 2: 0 };
const kindCounts = {};

// Audit all 82 lessons
for (const lesson of lessonsData.lessons) {
  const ch = storyData.chapters.find((c) => c.stage === lesson.stage);
  const actTypes = [...new Set(lesson.activities.map((a) => a.type))];
  const actKinds = [...new Set(lesson.activities.map((a) => a.kind || a.topic || a.variant || ""))].filter(Boolean);
  const maxRange = [
    Math.min(...lesson.activities.map((a) => a.max || 10)),
    Math.max(...lesson.activities.map((a) => a.max || 10))
  ];

  for (const a of lesson.activities) {
    kindCounts[a.type] = (kindCounts[a.type] || 0) + 1;
  }

  const plazaSrc = fs.readFileSync(path.join(ROOT, "js/ui/activities-plaza.js"), "utf8");
  // Check if any topic in A13/A14 is unhandled
  for (let i = 0; i < lesson.activities.length; i++) {
    const a = lesson.activities[i];
    if (a.type === "A14" && !plazaSrc.includes(`topic === "${a.topic}"`)) {
      issues.push({
        zone: lesson.stage,
        level: lesson.id,
        activityIndex: i,
        type: a.type,
        topic: a.topic,
        issue: `A14 topic "${a.topic}" is not handled in renderA14MeasureTime`
      });
    }
    if (a.type === "A13" && a.topic !== "plane" && !plazaSrc.includes(`topic === "${a.topic}"`)) {
      issues.push({
        zone: lesson.stage,
        level: lesson.id,
        activityIndex: i,
        type: a.type,
        topic: a.topic,
        issue: `A13 topic "${a.topic}" is not handled in renderA13ShapeOrPos`
      });
    }
  }

  dump.push({
    zone: lesson.stage,
    zoneNameVi: ch?.zone?.vi || "",
    zoneNameJa: ch?.zone?.ja || "",
    level: lesson.id,
    order: lesson.order,
    optional: Boolean(lesson.optional),
    skill: `${actTypes.join("+")}${actKinds.length ? ` (${actKinds.join(",")})` : ""}`,
    activityTypes: actTypes,
    numberRange: maxRange,
    visualObject: ch?.object || null,
    questionCount: lesson.activities.length,
    unlockCondition: lesson.optional ? "Mở sẵn (Tùy chọn)" : "Mở sẵn trên bản đồ (gợi ý tuần tự)",
    starCondition: "Đạt 1–3 sao dựa trên số câu đúng lần đầu (gradeLesson)",
    samplePromptVi: viI18n.ui.choosePrompt.replace("{object}", ch?.object?.vi || ""),
    samplePromptJa: jaI18n.ui.choosePrompt.replace("{object}", ch?.object?.ja || ""),
    activities: lesson.activities
  });
}

// Statistical & mathematical audit on generated problems (A4, A10, A11)
let mathChecked = 0;
let mathErrors = 0;
let choiceErrors = 0;
const seenPairs = new Map();

for (const kind of ["add", "combine", "take", "compare", "missing", "ordinal"]) {
  for (const max of [5, 10, 20]) {
    if (kind === "ordinal" && max !== 10) continue;
    for (let seed = 1; seed <= 30; seed++) {
      const p = generateProblem({ kind, max, seed });
      mathChecked++;
      let expected;
      if (kind === "add" || kind === "combine") expected = p.a + p.b;
      else if (kind === "take" || kind === "compare" || kind === "missing") expected = p.a - p.b;
      else if (kind === "ordinal") expected = p.b;

      if (p.answer !== expected) {
        mathErrors++;
        issues.push({ zone: "gen", level: `${kind}-${max}-${seed}`, issue: `Math mismatch: got ${p.answer}, expected ${expected}` });
      }
      const uniqueChoices = new Set(p.choices);
      const ansOccurrences = p.choices.filter((c) => c === p.answer).length;
      const hasNeg = p.choices.some((c) => c < 0);
      if (uniqueChoices.size !== p.choices.length || ansOccurrences !== 1 || hasNeg) {
        choiceErrors++;
        issues.push({ zone: "gen", level: `${kind}-${max}-${seed}`, issue: `Invalid choices: ${JSON.stringify(p.choices)} for answer ${p.answer}` });
      }
      const pos = p.choices.indexOf(p.answer);
      if (pos >= 0 && pos <= 2) answerPosCounts[pos]++;

      const key = `${kind}:${p.a}:${p.b}`;
      seenPairs.set(key, (seenPairs.get(key) || 0) + 1);
    }
  }
}

// Audit A10 compare signs & expressions
for (let seed = 1; seed <= 20; seed++) {
  const setA = generateSignSet({ count: 10, max: 10, allowEqual: true, seed });
  const setC = generateSignExprSet({ count: 10, max: 10, seed });
  for (const item of [...setA, ...setC]) {
    mathChecked++;
    const va = evalSide(item.a);
    const vb = evalSide(item.b);
    const exp = signAnswer(va, vb);
    if (item.answer !== exp) {
      mathErrors++;
      issues.push({ zone: 5, level: `A10-${seed}`, issue: `Sign mismatch: ${va} vs ${vb} got ${item.answer}` });
    }
    if (new Set(item.choices).size !== 3 || item.choices.filter((c) => c === item.answer).length !== 1) {
      choiceErrors++;
    }
    const pos = item.choices.indexOf(item.answer);
    if (pos >= 0 && pos <= 2) answerPosCounts[pos]++;
  }
}

// Check VI/JA kanji in child-facing strings
const kanjiRegex = /[\u4E00-\u9FAF]/g;
const jaKanjiFindings = [];
const scanKanji = (loc, str) => {
  const m = String(str || "").match(kanjiRegex);
  if (m) jaKanjiFindings.push({ loc, str, kanji: [...new Set(m)] });
};
for (const [k, v] of Object.entries(jaI18n.ui || {})) scanKanji(`i18n.ja.ui.${k}`, v);
for (const [k, v] of Object.entries(jaI18n.hint || {})) scanKanji(`i18n.ja.hint.${k}`, v);
for (const ch of storyData.chapters) {
  scanKanji(`story.ch${ch.stage}.zone`, ch.zone.ja);
  scanKanji(`story.ch${ch.stage}.intro`, ch.intro.ja);
}

const totalPairs = [...seenPairs.values()].reduce((a, b) => a + b, 0);
const uniquePairs = seenPairs.size;
const repeatRate = totalPairs ? (((totalPairs - uniquePairs) / totalPairs) * 100).toFixed(1) + "%" : "0%";

fs.writeFileSync(path.join(ROOT, "qa", "03_content_dump.json"), JSON.stringify({
  summary: {
    totalLessons: lessonsData.lessons.length,
    totalActivities: lessonsData.lessons.reduce((s, l) => s + l.activities.length, 0),
    activityTypeCounts: kindCounts,
    mathChecked,
    mathErrors,
    choiceErrors,
    answerPosCounts,
    sampleRepeatRate: repeatRate,
    jaKanjiInChildUI: jaKanjiFindings,
    staticIssuesFound: issues
  },
  lessons: dump
}, null, 2));

console.log(JSON.stringify({
  totalLessons: lessonsData.lessons.length,
  mathChecked,
  mathErrors,
  choiceErrors,
  answerPosCounts,
  repeatRate,
  jaKanjiCount: jaKanjiFindings.length,
  staticIssuesCount: issues.length,
  staticIssues: issues
}, null, 2));
