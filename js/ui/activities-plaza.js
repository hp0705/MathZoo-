import { clockWords } from "../core/ordinal-time.js";
import { numberToWords } from "../core/number-words.js";

const SHAPE_SVGS = {
  circle: `<circle cx="40" cy="40" r="28" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/>`,
  square: `<rect x="14" y="14" width="52" height="52" rx="6" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="4"/>`,
  triangle: `<polygon points="40,12 68,66 12,66" fill="#FFD0E0" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>`,
  rectangle: `<rect x="8" y="22" width="64" height="36" rx="6" fill="#BFEFDD" stroke="#2B2A4C" stroke-width="4"/>`
};

const SHAPE_NAMES = {
  circle: { vi: "hình tròn", ja: "まる" },
  square: { vi: "hình vuông", ja: "しかく" },
  triangle: { vi: "hình tam giác", ja: "さんかく" },
  rectangle: { vi: "hình chữ nhật", ja: "ながしかく" }
};

export function renderA12Pattern(container, { lang, t, onResult, onSpeakText }) {
  const keys = ["circle", "square", "triangle"];
  const a = keys[Math.floor(Math.random() * keys.length)];
  const b = keys.find((k) => k !== a);
  const seq = [a, b, a, b, a];
  const answer = b;
  const prompt = t("ui.patternPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="objects-tray">
        ${seq.map((k) => `<svg width="64" height="64" viewBox="0 0 80 80">${SHAPE_SVGS[k]}</svg>`).join("")}
        <div class="compare-slot" style="width:64px;height:64px;font-size:32px;font-weight:900">?</div>
      </div>
      <div class="choices-row" id="a12-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a12-choices");
  keys.forEach((k) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.innerHTML = `<svg width="64" height="64" viewBox="0 0 80 80">${SHAPE_SVGS[k]}</svg>`;
    btn.addEventListener("click", () => {
      const ansWord = SHAPE_NAMES[answer][lang];
      if (k === answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
  if (onSpeakText) onSpeakText(prompt);
}

export function renderA13ShapeOrPos(container, { topic, lang, t, onResult, onSpeakText }) {
  if (topic === "position") {
    const isLeft = Math.random() < 0.5;
    const posWord = isLeft ? (lang === "ja" ? "ひだり" : "trái") : (lang === "ja" ? "みぎ" : "phải");
    const prompt = t("ui.positionPrompt").replace("{pos}", posWord);
    container.innerHTML = `
      <div class="lesson-layout">
        <p class="prompt-text">${prompt}</p>
        <div class="compare-arena">
          <button id="pos-left" class="compare-side" style="cursor:pointer"><svg width="80" height="80" viewBox="0 0 80 80">${SHAPE_SVGS.circle}</svg></button>
          <button id="pos-right" class="compare-side" style="cursor:pointer"><svg width="80" height="80" viewBox="0 0 80 80">${SHAPE_SVGS.triangle}</svg></button>
        </div>
      </div>
    `;
    const check = (pickedLeft, btn) => {
      if (pickedLeft === isLeft) {
        btn.classList.add("is-correct");
        onResult(true, btn, posWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, posWord, () => btn.classList.remove("is-wrong"));
      }
    };
    container.querySelector("#pos-left").addEventListener("click", (e) => check(true, e.currentTarget));
    container.querySelector("#pos-right").addEventListener("click", (e) => check(false, e.currentTarget));
    if (onSpeakText) onSpeakText(prompt);
    return;
  }

  const keys = ["circle", "square", "triangle", "rectangle"];
  const target = keys[Math.floor(Math.random() * keys.length)];
  const opts = [target, ...keys.filter((k) => k !== target).slice(0, 2)].sort(() => Math.random() - 0.5);
  const shapeWord = SHAPE_NAMES[target][lang];
  const prompt = t("ui.shapePrompt").replace("{shape}", shapeWord);

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="choices-row" id="a13-choices"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);
  const row = container.querySelector("#a13-choices");
  opts.forEach((k) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.innerHTML = `<svg width="72" height="72" viewBox="0 0 80 80">${SHAPE_SVGS[k]}</svg>`;
    btn.addEventListener("click", () => {
      if (k === target) {
        btn.classList.add("is-correct");
        onResult(true, btn, shapeWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, shapeWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
  if (onSpeakText) onSpeakText(prompt);
}

export function renderA14MeasureTime(container, { topic, lang, t, onResult, onSpeakText }) {
  if (topic === "clock") {
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const wrong1 = hour === 12 ? 1 : hour + 1;
    const wrong2 = hour === 1 ? 12 : hour - 1;
    const opts = [hour, wrong1, wrong2].sort((a, b) => a - b);
    const angle = (hour % 12) * 30;
    const ansWord = clockWords(hour, lang);
    const prompt = t("ui.clockPrompt");

    container.innerHTML = `
      <div class="lesson-layout">
        <p class="prompt-text">${prompt}</p>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="#fff" stroke="#2B2A4C" stroke-width="6"/>
          ${Array.from({ length: 12 }, (_, i) => {
            const a = ((i + 1) * 30 - 90) * Math.PI / 180;
            const x = 100 + Math.cos(a) * 68;
            const y = 100 + Math.sin(a) * 68 + 6;
            return `<text x="${x}" y="${y}" text-anchor="middle" font-size="18" font-weight="800" fill="#2B2A4C">${i + 1}</text>`;
          }).join("")}
          <line x1="100" y1="100" x2="100" y2="32" stroke="#1F78C8" stroke-width="5" stroke-linecap="round"/>
          <line x1="100" y1="100" x2="100" y2="50" stroke="#C93A34" stroke-width="8" stroke-linecap="round" transform="rotate(${angle} 100 100)"/>
          <circle cx="100" cy="100" r="7" fill="#2B2A4C"/>
        </svg>
        <div class="choices-row" id="a14-choices"></div>
      </div>
    `;
    const row = container.querySelector("#a14-choices");
    opts.forEach((h) => {
      const btn = document.createElement("button");
      btn.className = "choice-card";
      btn.style.fontSize = "26px";
      btn.textContent = clockWords(h, lang);
      btn.addEventListener("click", () => {
        if (h === hour) {
          btn.classList.add("is-correct");
          onResult(true, btn, ansWord);
        } else {
          btn.classList.add("is-wrong");
          onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
        }
      });
      row.appendChild(btn);
    });
    if (onSpeakText) onSpeakText(prompt);
    return;
  }

  // Measure with blocks
  const len = 2 + Math.floor(Math.random() * 5);
  const opts = [len, len - 1, len + 1];
  const ansWord = numberToWords(len, lang);
  const prompt = t("ui.measurePrompt");
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="objects-tray" style="flex-direction:column;align-items:flex-start;max-width:520px;">
        <div style="width:${len * 64}px;height:36px;background:#FF7EB6;border:4px solid #2B2A4C;border-radius:12px;"></div>
        <div style="display:flex;gap:4px;">
          ${Array.from({ length: len }, () => `<div style="width:60px;height:36px;background:#FFC83D;border:3px solid #2B2A4C;border-radius:8px;"></div>`).join("")}
        </div>
      </div>
      <div class="choices-row" id="a14-m-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a14-m-choices");
  opts.forEach((v) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(v);
    btn.addEventListener("click", () => {
      if (v === len) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
  if (onSpeakText) onSpeakText(prompt);
}
