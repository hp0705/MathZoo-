import fs from "node:fs";
import path from "node:path";

const EXPECTED_COUNTS = [6, 10, 9, 10, 10, 10, 10, 9, 8];
const STAGE_LIMITS = { 1: 5, 2: 10, 3: 5, 4: 10, 5: 20, 6: 100, 7: 10, 8: 100, 9: 10 };

export function validateAll(rootDir = process.cwd()) {
  const errors = [];
  const lessonsData = JSON.parse(fs.readFileSync(path.join(rootDir, "data/lessons.json"), "utf8"));
  const voiceData = JSON.parse(fs.readFileSync(path.join(rootDir, "data/voice-manifest.json"), "utf8"));

  const lessons = lessonsData.lessons || [];
  if (lessons.length !== 82) {
    errors.push(`Expected 82 lessons, got ${lessons.length}`);
  }

  const byStage = new Map();
  for (const l of lessons) {
    if (!byStage.has(l.stage)) byStage.set(l.stage, []);
    byStage.get(l.stage).push(l);
  }

  for (let s = 1; s <= 9; s++) {
    const arr = byStage.get(s) || [];
    if (arr.length !== EXPECTED_COUNTS[s - 1]) {
      errors.push(`Stage ${s}: expected ${EXPECTED_COUNTS[s - 1]} lessons, got ${arr.length}`);
    }
    arr.sort((a, b) => a.order - b.order);
    arr.forEach((l, idx) => {
      const expectedBeat = idx === 0 ? "open" : idx === arr.length - 1 ? "close" : "mid";
      if (l.storyBeat !== expectedBeat) {
        errors.push(`${l.id}: expected storyBeat ${expectedBeat}, got ${l.storyBeat}`);
      }
      if (s === 9 && l.optional !== true) {
        errors.push(`${l.id}: stage 9 lesson must have optional:true`);
      }
      if (s !== 9 && "optional" in l) {
        errors.push(`${l.id}: non-stage-9 lesson must not have optional`);
      }
      if (!Array.isArray(l.activities) || l.activities.length !== 6) {
        errors.push(`${l.id}: must have exactly 6 activities`);
      }
      for (const act of l.activities || []) {
        if (act.max > STAGE_LIMITS[s]) {
          errors.push(`${l.id}: activity max ${act.max} exceeds stage ${s} limit ${STAGE_LIMITS[s]}`);
        }
        if (s <= 3 && act.showSymbols) {
          errors.push(`${l.id}: stages 1-3 must have showSymbols false`);
        }
        if ((s <= 4 || s >= 8) && act.type === "A10") {
          errors.push(`${l.id}: A10 not allowed in stage ${s}`);
        }
        if (act.type === "A10" && act.eyes && l.id !== "s5-l08" && l.id !== "s5-l09") {
          errors.push(`${l.id}: eyes:true only allowed in s5-l08 and s5-l09`);
        }
        for (const vid of act.voiceIds || []) {
          const entry = voiceData[vid];
          if (!entry || !entry.vi || !entry.ja) {
            errors.push(`${l.id}: missing or incomplete voiceId "${vid}"`);
          }
        }
      }
      if ((s === 6 || s === 7) && l.order % 3 === 0) {
        const last = l.activities[5];
        if (!last || last.type !== "A10") {
          errors.push(`${l.id}: every 3rd lesson in stages 6-7 must review A10 in last activity`);
        }
      }
    });
  }

  const mustHaveA10 = ["s5-l08", "s5-l09", "s5-l10", "s6-l09", "s6-l10", "s7-l09"];
  for (const id of mustHaveA10) {
    const l = lessons.find((x) => x.id === id);
    if (!l || !l.activities.some((a) => a.type === "A10")) {
      errors.push(`${id}: must contain at least one A10 activity`);
    }
  }
  const s5l08 = lessons.find((x) => x.id === "s5-l08");
  if (s5l08 && s5l08.activities.some((a) => a.type === "A10" && a.allowEqual !== false)) {
    errors.push(`s5-l08: A10 must have allowEqual:false`);
  }
  const s2l10 = lessons.find((x) => x.id === "s2-l10");
  if (!s2l10 || !s2l10.activities.some((a) => a.type === "A11")) {
    errors.push(`s2-l10: must contain an A11 activity`);
  }

  return errors;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("validate-data.mjs")) {
  const errs = validateAll();
  if (errs.length > 0) {
    console.error("Validation failed:\n" + errs.join("\n"));
    process.exit(1);
  }
  console.log("All 82 lessons and voice manifest validated successfully.");
}
