import fs from "node:fs";
import path from "node:path";

const STAGE_COUNTS = [6, 10, 9, 10, 10, 10, 10, 9, 8];
const STAGE_LIMITS = { 1: 5, 2: 10, 3: 5, 4: 10, 5: 20, 6: 100, 7: 10, 8: 100, 9: 10 };

const STAGE_TITLES = {
  1: { vi: "Đếm 1 đến 5", ja: "1から5まで かぞえよう" },
  2: { vi: "Số đến 10", ja: "10までの すうじ" },
  3: { vi: "Thêm bớt trong 5", ja: "5までの たしざん・ひきざん" },
  4: { vi: "Cộng trừ trong 10", ja: "10までの けいさん" },
  5: { vi: "Đếm đến 20 và dấu", ja: "20までと くらべる しるし" },
  6: { vi: "Đếm đến 100", ja: "100までの すうじ" },
  7: { vi: "Thành thạo trong 10", ja: "10までの ぶんしょうだい" },
  8: { vi: "Mở rộng tròn chục & qua 10", ja: "おおきい すうじの けいさん" },
  9: { vi: "Quảng trường Lễ hội", ja: "おまつりひろばの おたのしみ" }
};

function makeActivities(stage, order) {
  const max = STAGE_LIMITS[stage];
  const showSymbols = stage >= 4;
  const id = `s${stage}-l${String(order).padStart(2, "0")}`;

  if (stage === 1) {
    const cap = Math.min(5, order <= 2 ? 3 : 5);
    return [
      { type: "A1", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A2", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A7", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A3", max: cap, showSymbols: false, voiceIds: ["story-cmp-01"] },
      { type: "A8", digit: Math.min(5, order), max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A2", max: cap, showSymbols: false, review: true, count: 2, voiceIds: ["story-count-01"] }
    ];
  }

  if (stage === 2) {
    if (order === 10) {
      return [
        { type: "A11", kind: "ordinal", max: 10, showSymbols: false, voiceIds: ["story-count-01"] },
        { type: "A1", max: 10, showSymbols: false, voiceIds: ["story-count-01"] },
        { type: "A11", kind: "ordinal", max: 10, showSymbols: false, voiceIds: ["story-count-01"] },
        { type: "A2", max: 10, showSymbols: false, voiceIds: ["story-count-01"] },
        { type: "A7", max: 10, showSymbols: false, voiceIds: ["story-count-01"] },
        { type: "A11", kind: "ordinal", max: 10, showSymbols: false, review: true, count: 2, voiceIds: ["story-count-01"] }
      ];
    }
    const cap = order <= 4 ? 7 : 10;
    return [
      { type: "A1", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A2", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A7", max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A3", max: cap, showSymbols: false, voiceIds: ["story-cmp-01"] },
      { type: "A8", digit: order % 10, max: cap, showSymbols: false, voiceIds: ["story-count-01"] },
      { type: "A2", max: cap, showSymbols: false, review: true, count: 2, voiceIds: ["story-count-01"] }
    ];
  }

  if (stage === 3) {
    return [
      { type: "A4", kind: "add", max: 5, showSymbols: false, voiceIds: ["story-add-01"] },
      { type: "A5", max: 5, showSymbols: false, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "take", max: 5, showSymbols: false, voiceIds: ["story-take-01"] },
      { type: "A3", max: 5, showSymbols: false, voiceIds: ["story-cmp-01"] },
      { type: "A4", kind: order % 2 === 0 ? "take" : "add", max: 5, showSymbols: false, voiceIds: ["story-add-01"] },
      { type: "A2", max: 5, showSymbols: false, review: true, count: 2, voiceIds: ["story-count-01"] }
    ];
  }

  if (stage === 4) {
    return [
      { type: "A6", max: 10, showSymbols: true, voiceIds: ["story-ten-01"] },
      { type: "A4", kind: "add", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A5", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "take", max: 10, showSymbols: true, voiceIds: ["story-take-01"] },
      { type: "A4", kind: "missing", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A2", max: 10, showSymbols: true, review: true, count: 2, voiceIds: ["story-add-01"] }
    ];
  }

  if (stage === 5) {
    if (order === 8) {
      return [
        { type: "A10", variant: "a", max: 10, allowEqual: false, eyes: true, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A10", variant: "b", max: 10, allowEqual: false, eyes: true, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A6", max: 10, showSymbols: true, voiceIds: ["story-ten-01"] },
        { type: "A10", variant: "a", max: 10, allowEqual: false, eyes: true, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A10", variant: "b", max: 10, allowEqual: false, eyes: true, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A2", max: 20, showSymbols: true, review: true, count: 2, voiceIds: ["story-count-01"] }
      ];
    }
    if (order === 9 || order === 10) {
      const eyes = order === 9;
      const cmpMax = order === 9 ? 10 : 20;
      return [
        { type: "A10", variant: "a", max: cmpMax, allowEqual: true, eyes, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A10", variant: "b", max: cmpMax, allowEqual: true, eyes, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A1", max: 20, showSymbols: true, voiceIds: ["story-count-01"] },
        { type: "A10", variant: "b", max: cmpMax, allowEqual: true, eyes, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A4", kind: "add", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
        { type: "A10", variant: "b", max: cmpMax, allowEqual: true, eyes, showSymbols: true, review: true, count: 2, voiceIds: ["story-cmp-01"] }
      ];
    }
    return [
      { type: "A1", max: 20, showSymbols: true, voiceIds: ["story-count-01"] },
      { type: "A6", max: 20, showSymbols: true, voiceIds: ["story-ten-01"] },
      { type: "A2", max: 20, showSymbols: true, voiceIds: ["story-count-01"] },
      { type: "A7", max: 20, showSymbols: true, voiceIds: ["story-count-01"] },
      { type: "A4", kind: "add", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A2", max: 20, showSymbols: true, review: true, count: 2, voiceIds: ["story-count-01"] }
    ];
  }

  if (stage === 6) {
    const isThird = order % 3 === 0;
    const reviewAct = isThird
      ? { type: "A10", variant: "b", max: 20, allowEqual: true, eyes: false, showSymbols: true, review: true, count: 2, voiceIds: ["story-cmp-01"] }
      : { type: "A9", max: 100, showSymbols: true, review: true, count: 2, voiceIds: ["story-board-01"] };

    if (order === 9 || order === 10) {
      return [
        { type: "A10", variant: "b", max: order === 9 ? 20 : 100, allowEqual: true, eyes: false, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A9", max: 100, showSymbols: true, voiceIds: ["story-board-01"] },
        { type: "A11", kind: "ordinal", max: 10, showSymbols: true, voiceIds: ["story-count-01"] },
        { type: "A10", variant: "b", max: order === 9 ? 20 : 100, allowEqual: true, eyes: false, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A2", max: 100, showSymbols: true, voiceIds: ["story-count-01"] },
        reviewAct
      ];
    }
    return [
      { type: "A9", max: 100, showSymbols: true, voiceIds: ["story-board-01"] },
      { type: "A2", max: 100, showSymbols: true, voiceIds: ["story-count-01"] },
      { type: "A9", max: 100, showSymbols: true, voiceIds: ["story-board-01"] },
      { type: "A11", kind: "ordinal", max: 10, showSymbols: true, voiceIds: ["story-count-01"] },
      { type: "A2", max: 100, showSymbols: true, voiceIds: ["story-count-01"] },
      reviewAct
    ];
  }

  if (stage === 7) {
    const isThird = order % 3 === 0;
    const reviewAct = isThird
      ? { type: "A10", variant: "c", max: 10, allowEqual: true, eyes: false, showSymbols: true, review: true, count: 2, voiceIds: ["story-cmp-01"] }
      : { type: "A4", kind: "add", max: 10, showSymbols: true, review: true, count: 2, voiceIds: ["story-add-01"] };

    if (order === 9) {
      return [
        { type: "A10", variant: "c", max: 10, allowEqual: true, eyes: false, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A4", kind: "combine", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
        { type: "A10", variant: "c", max: 10, allowEqual: true, eyes: false, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A4", kind: "compare", max: 10, showSymbols: true, voiceIds: ["story-cmp-01"] },
        { type: "A4", kind: "missing", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
        reviewAct
      ];
    }
    const kinds = ["add", "combine", "take", "compare", "missing"];
    const k = kinds[(order - 1) % kinds.length];
    return [
      { type: "A4", kind: k, max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "take", max: 10, showSymbols: true, voiceIds: ["story-take-01"] },
      { type: "A5", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "missing", max: 10, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "compare", max: 10, showSymbols: true, voiceIds: ["story-cmp-01"] },
      reviewAct
    ];
  }

  if (stage === 8) {
    const cap = order <= 4 ? 100 : 20;
    return [
      { type: "A4", kind: "add", max: cap, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "take", max: cap, showSymbols: true, voiceIds: ["story-take-01"] },
      { type: "A9", max: cap, showSymbols: true, voiceIds: ["story-board-01"] },
      { type: "A4", kind: "combine", max: cap, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A4", kind: "missing", max: cap, showSymbols: true, voiceIds: ["story-add-01"] },
      { type: "A2", max: cap, showSymbols: true, review: true, count: 2, voiceIds: ["story-count-01"] }
    ];
  }

  // Stage 9: Festival Plaza (optional)
  const topics = ["plane", "solid", "position", "pattern", "compareMeasure", "measureUnits", "daysSeasons", "clock"];
  const topic = topics[order - 1];
  const primaryType = topic === "pattern" ? "A12" : (topic === "plane" || topic === "solid" || topic === "position") ? "A13" : "A14";
  return [
    { type: primaryType, topic, max: 10, showSymbols: false, voiceIds: ["story-plaza-01"] },
    { type: "A1", max: 10, showSymbols: false, voiceIds: ["story-plaza-01"] },
    { type: primaryType, topic, max: 10, showSymbols: false, voiceIds: ["story-plaza-01"] },
    { type: "A11", kind: "ordinal", max: 10, showSymbols: false, voiceIds: ["story-plaza-01"] },
    { type: primaryType, topic, max: 10, showSymbols: false, voiceIds: ["story-plaza-01"] },
    { type: primaryType, topic, max: 10, showSymbols: false, review: true, count: 2, voiceIds: ["story-plaza-01"] }
  ];
}

const lessons = [];
for (let s = 1; s <= 9; s++) {
  const count = STAGE_COUNTS[s - 1];
  for (let o = 1; o <= count; o++) {
    const id = `s${s}-l${String(o).padStart(2, "0")}`;
    const storyBeat = o === 1 ? "open" : o === count ? "close" : "mid";
    const lesson = {
      id,
      stage: s,
      order: o,
      title: {
        vi: `${STAGE_TITLES[s].vi} (${o})`,
        ja: `${STAGE_TITLES[s].ja} (${o})`
      },
      storyBeat,
      activities: makeActivities(s, o)
    };
    if (s === 9) lesson.optional = true;
    lessons.push(lesson);
  }
}

const outPath = path.resolve("data/lessons.json");
fs.writeFileSync(outPath, JSON.stringify({ version: 1, lessons }, null, 2) + "\n", "utf8");
console.log(`Generated ${lessons.length} lessons at ${outPath}`);
