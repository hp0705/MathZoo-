import { renderAnimal } from "./artwork.js";
import { getChapter, formatStoryLine, pickStoryBeat } from "../core/story.js";

export function renderStoryIntro(container, { lesson, storyData, settings, t, onStart, onSpeak }) {
  const ch = getChapter(storyData, lesson.stage);
  const lang = settings.lang === "ja" ? "ja" : "vi";
  let template;
  if (lesson.storyBeat === "open") {
    template = ch.intro;
  } else {
    const picked = pickStoryBeat(storyData, "mid", -1);
    template = picked.item || ch.intro;
  }
  const line = formatStoryLine(template, ch, settings);

  container.innerHTML = `
    <div class="lesson-layout" style="justify-content:center;gap:24px;max-width:760px;">
      ${renderAnimal(lesson.stage, 140)}
      <h2 style="margin:0;font-size:32px;text-align:center">${ch.zone[lang]} — ${lesson.title[lang]}</h2>
      <p class="prompt-text" style="background:#fff;padding:20px 24px;border-radius:24px;border:4px solid var(--stage-border);font-size:26px;">
        ${line.text}
      </p>
      <div class="choices-row">
        <button id="btn-story-start" class="btn-pill btn-primary" style="min-width:200px">${t("ui.start")}</button>
      </div>
    </div>
  `;

  container.querySelector("#btn-story-start").addEventListener("click", onStart);
  onSpeak(line);
  return line;
}
