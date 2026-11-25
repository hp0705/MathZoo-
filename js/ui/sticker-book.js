import { renderObject, renderMascotStar } from "./artwork.js";

export function openStickerBook(modalRoot, { storyData, progress, lang, t }) {
  const earned = new Set(progress.stickers || []);
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="margin:0">${t("ui.stickers")}</h2>
        <button id="stk-close" class="btn-pill" style="min-height:56px;font-size:20px">${t("parent.close")}</button>
      </div>
      ${progress.medal ? `<div class="btn-pill" style="background:var(--total);align-self:flex-start">${renderMascotStar(40)} ${t("ui.medal")}</div>` : ""}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
        ${storyData.chapters.map((ch) => {
          const has = earned.has(ch.stage);
          return `<div class="stage-card" style="opacity:${has ? 1 : 0.45};align-items:center;text-align:center;">
            ${renderObject(ch.stage, 64)}
            <div style="font-weight:800;font-size:18px">${ch.sticker[lang]}</div>
          </div>`;
        }).join("")}
      </div>
    </div>
  `;
  backdrop.querySelector("#stk-close").addEventListener("click", () => backdrop.remove());
  modalRoot.innerHTML = "";
  modalRoot.appendChild(backdrop);
}
