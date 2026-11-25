import { renderAnimal, renderMascotStar } from "./artwork.js";
import { formatStoryLine } from "../core/story.js";

export function renderReward(container, { lesson, stars, newSticker, finale, chapter, settings, t, onReplay, onMap }) {
  const lang = settings.lang === "ja" ? "ja" : "vi";
  const line = finale
    ? formatStoryLine(finale, chapter, settings)
    : lesson.storyBeat === "close"
    ? formatStoryLine(chapter.outro, chapter, settings)
    : null;

  container.innerHTML = `
    <div class="lesson-layout" style="justify-content:center;gap:20px;max-width:760px;">
      <div style="display:flex;gap:12px;align-items:center;">
        ${Array.from({ length: stars }, () => renderMascotStar(72)).join("")}
      </div>
      ${renderAnimal(lesson.stage, 120)}
      ${line ? `<p class="prompt-text" style="font-size:26px;">${line.text}</p>` : ""}
      ${newSticker ? `<div class="btn-pill" style="background:var(--ok-bg);border-color:var(--receive);">★ ${chapter.sticker[lang]}</div>` : ""}
      ${finale ? `<div class="btn-pill" style="background:var(--total);">${t("ui.medal")}</div>` : ""}
      <div class="choices-row">
        <button id="rew-replay" class="btn-pill">${t("ui.playAgain")}</button>
        <button id="rew-map" class="btn-pill btn-primary">${t("ui.goMap")}</button>
      </div>
    </div>
  `;
  container.querySelector("#rew-replay").addEventListener("click", onReplay);
  container.querySelector("#rew-map").addEventListener("click", onMap);
}
