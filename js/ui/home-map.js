import { renderAnimal, renderMascotStar } from "./artwork.js";
import { getChapter } from "../core/story.js";

const STAGE_COLORS = [
  "",
  ["#FFE08A", "#946A00"],
  ["#BFEFDD", "#2E8B6E"],
  ["#CFE8FF", "#2F7FC4"],
  ["#E3D7FF", "#7A5BD0"],
  ["#FFD0E0", "#C2456F"],
  ["#FFD9B3", "#B8610A"],
  ["#D5F2B5", "#4E8F1F"],
  ["#BDEBF2", "#1B7F93"],
  ["#E8EAF0", "#5B6477"]
];

export function findSuggestedLesson(lessons, stars) {
  const core = lessons.filter((l) => !l.optional);
  const nextCore = core.find((l) => !stars[l.id]);
  if (nextCore) return nextCore.id;
  const nextOpt = lessons.find((l) => l.optional && !stars[l.id]);
  return nextOpt ? nextOpt.id : lessons[0]?.id;
}

export function renderHomeMap(container, { lessons, storyData, progress, t, lang, onSelectLesson, onOpenTracing }) {
  const nextId = findSuggestedLesson(lessons, progress.stars || {});
  const wrap = document.createElement("div");
  wrap.style.cssText = "width:100%;height:100%;display:flex;flex-direction:column;gap:12px;";

  if (onOpenTracing) {
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex;justify-content:center;flex-shrink:0;";
    const traceBtn = document.createElement("button");
    traceBtn.id = "btn-open-tracing";
    traceBtn.className = "btn-pill btn-primary";
    traceBtn.style.cssText = "min-height:56px;font-size:22px;padding:8px 24px;";
    traceBtn.textContent = t("ui.traceBtn");
    traceBtn.addEventListener("click", onOpenTracing);
    bar.appendChild(traceBtn);
    wrap.appendChild(bar);
  }

  const grid = document.createElement("div");
  grid.className = "map-grid";
  grid.style.flex = "1";
  grid.style.minHeight = "0";

  // Arrange stages 1..8 and put stage 9 (Festival Plaza) in the middle (index 4)
  const order = [1, 2, 3, 4, 9, 5, 6, 7, 8];

  for (const stageNum of order) {
    const ch = getChapter(storyData, stageNum);
    const stageLessons = lessons.filter((l) => l.stage === stageNum);
    const [fill, border] = STAGE_COLORS[stageNum];
    const card = document.createElement("section");
    card.className = "stage-card";
    card.style.setProperty("--sf", fill);
    card.style.setProperty("--sb", border);

    const hasNext = stageLessons.some((l) => l.id === nextId);
    if (hasNext) card.classList.add("is-next");

    const badgeText = ch.optional ? t("ui.optional") : `${t("ui.stage")} ${stageNum}`;
    card.innerHTML = `
      <span class="stage-badge">${badgeText}</span>
      <div class="stage-head">
        <div class="stage-avatar">${renderAnimal(stageNum, 68)}</div>
        <div>
          <div class="stage-name">${ch.zone[lang]}</div>
          <div style="font-size:16px;opacity:0.85">${ch.animal[lang]}</div>
        </div>
      </div>
      <div class="lesson-pills"></div>
    `;

    const pills = card.querySelector(".lesson-pills");
    for (const lesson of stageLessons) {
      const btn = document.createElement("button");
      btn.className = "lesson-dot";
      const earned = progress.stars?.[lesson.id] || 0;
      const starStr = earned > 0 ? "★".repeat(earned) : "";
      const mascot = lesson.id === nextId ? renderMascotStar(26) : "";
      btn.innerHTML = `${mascot}<span>${lesson.order}</span>${starStr ? `<span style="font-size:13px;color:#946A00">${starStr}</span>` : ""}`;
      btn.addEventListener("click", () => onSelectLesson(lesson));
      pills.appendChild(btn);
    }
    grid.appendChild(card);
  }

  wrap.appendChild(grid);
  container.innerHTML = "";
  container.appendChild(wrap);
}
