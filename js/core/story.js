import { fillName, sanitizeName } from "./phrases.js";

/**
 * Get the chapter for a given stage number (1..9).
 */
export function getChapter(storyData, stage) {
  return storyData.chapters.find((c) => c.stage === stage) || storyData.chapters[0];
}

/**
 * Render a story line for a given lesson, replacing {name}, {animal}, {object}.
 */
export function formatStoryLine(template, chapter, settings) {
  const lang = settings.lang === "ja" ? "ja" : "vi";
  const dispName = sanitizeName(lang === "ja" ? settings.nameJa : settings.nameVi, lang);
  const spkName = (lang === "ja" ? settings.speakJa : settings.speakVi)?.trim() || dispName;

  const replaceVars = (str, name) =>
    fillName(str, name)
      .replaceAll("{animal}", chapter.animal[lang])
      .replaceAll("{object}", chapter.object[lang]);

  return {
    text: replaceVars(template[lang], dispName),
    speak: replaceVars(template[lang], spkName),
    lang
  };
}

/**
 * Pick a non-repeating random beat from beats.mid or beats.close.
 */
export function pickStoryBeat(storyData, kind, lastIndex = -1, rng = Math.random) {
  const list = storyData.beats?.[kind] || [];
  if (list.length === 0) return { item: null, index: -1 };
  const indices = list.map((_, i) => i);
  const pool = indices.length > 1 ? indices.filter((i) => i !== lastIndex) : indices;
  const index = pool[Math.floor(rng() * pool.length)];
  return { item: list[index], index };
}
