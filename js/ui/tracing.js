import { playCountNote, playTotalChime } from "../audio/sfx.js";
import { numberToWords } from "../core/number-words.js";

export function renderTracing(container, { digit = 1, lang = "vi", t, onComplete, onSpeakText }) {
  const isTwoDigit = Number(digit) >= 10;
  const w = isTwoDigit ? 300 : 240;
  const h = 240;
  const fontSize = isTwoDigit ? 128 : 160;
  const prompt = t("ui.tracePrompt").replace("{n}", String(digit));
  const promptSpeak = t("ui.tracePrompt").replace("{n}", numberToWords(digit, lang));
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div style="position:relative;width:${w}px;height:${h}px;background:#fff;border:4px solid var(--stage-border);border-radius:24px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:${fontSize}px;font-weight:900;color:var(--disabled);pointer-events:none;letter-spacing:-4px;">${digit}</span>
        <canvas id="trace-canvas" width="${w}" height="${h}" style="position:absolute;inset:0;touch-action:none;"></canvas>
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
    ctx.clearRect(0, 0, w, h);
    strokes = 0;
  });
  container.querySelector("#trace-done").addEventListener("click", () => {
    onComplete(true);
  });
  if (onSpeakText) onSpeakText(promptSpeak);
}

export function renderTracingStudio(container, { lang = "vi", t, onSpeakText }) {
  let current = 1;
  const doneSet = new Set();

  const render = () => {
    const title = t("ui.traceStudioTitle");
    container.innerHTML = `
      <div class="lesson-layout" style="gap:10px;justify-content:flex-start;overflow-y:auto;padding:4px 0;">
        <h2 style="margin:0;font-size:24px;text-align:center;">${title}</h2>
        <div id="trace-num-grid" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:760px;"></div>
        <div id="trace-host" style="width:100%;display:flex;justify-content:center;"></div>
      </div>
    `;

    const grid = container.querySelector("#trace-num-grid");
    for (let n = 1; n <= 20; n++) {
      const btn = document.createElement("button");
      btn.className = "btn-pill";
      btn.style.cssText = `min-width:54px;min-height:52px;padding:6px 12px;font-size:22px;border-radius:16px;${
        n === current ? "background:var(--primary);color:#fff;border-color:#145694;" :
        doneSet.has(n) ? "background:var(--ok-bg);border-color:var(--receive);" : ""
      }`;
      btn.textContent = doneSet.has(n) && n !== current ? `${n} ✓` : String(n);
      btn.addEventListener("click", () => {
        current = n;
        render();
      });
      grid.appendChild(btn);
    }

    const host = container.querySelector("#trace-host");
    renderTracing(host, {
      digit: current,
      lang,
      t,
      onSpeakText,
      onComplete: () => {
        doneSet.add(current);
        playTotalChime();
        current = current < 20 ? current + 1 : 1;
        render();
      }
    });
  };

  render();
}
