import { playCountNote } from "../audio/sfx.js";
import { numberToWords } from "../core/number-words.js";

export function renderTracing(container, { digit = 1, lang = "vi", t, onComplete, onSpeakText }) {
  const prompt = t("ui.tracePrompt").replace("{n}", String(digit));
  const promptSpeak = t("ui.tracePrompt").replace("{n}", numberToWords(digit, lang));
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div style="position:relative;width:240px;height:240px;background:#fff;border:4px solid var(--stage-border);border-radius:24px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:160px;font-weight:900;color:var(--disabled);pointer-events:none">${digit}</span>
        <canvas id="trace-canvas" width="240" height="240" style="position:absolute;inset:0;touch-action:none;"></canvas>
      </div>
      <div class="choices-row">
        <button id="trace-clear" class="btn-pill">${t("ui.clear")}</button>
        <button id="trace-done" class="btn-pill btn-primary">${t("ui.done")}</button>
      </div>
    </div>
  `;

  const canvas = container.querySelector("#trace-canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#6B4BC8";
  let drawing = false;
  let strokes = 0;

  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    strokes++;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    playCountNote(strokes);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
  canvas.addEventListener("pointerup", () => { drawing = false; });
  canvas.addEventListener("pointercancel", () => { drawing = false; });

  container.querySelector("#trace-clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, 240, 240);
    strokes = 0;
  });
  container.querySelector("#trace-done").addEventListener("click", () => {
    onComplete(true);
  });
  if (onSpeakText) onSpeakText(promptSpeak);
}
