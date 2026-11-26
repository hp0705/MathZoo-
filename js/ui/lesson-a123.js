import { renderObject } from "./artwork.js";
import { generateProblem } from "../core/problem-gen.js";
import { numberToWords, countWords } from "../core/number-words.js";
import { playCountNote } from "../audio/sfx.js";

export function renderA1(container, { stage, max, chapter, lang, t, onComplete, onSpeakText }) {
  const count = 1 + (Math.floor(Math.random() * max));
  let tapped = 0;
  const items = Array.from({ length: count }, (_, i) => i);
  const prompt = t("ui.countPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral" id="a1-num">0</div>
      <div class="objects-tray" id="a1-tray"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);

  const tray = container.querySelector("#a1-tray");
  const numEl = container.querySelector("#a1-num");
  const doneSet = new Set();

  items.forEach((i) => {
    const btn = document.createElement("button");
    btn.className = "obj-item";
    btn.innerHTML = renderObject(stage, 60);
    btn.addEventListener("click", () => {
      if (doneSet.has(i)) return;
      doneSet.add(i);
      btn.classList.add("lit");
      tapped++;
      numEl.textContent = String(tapped);
      playCountNote(tapped);
      if (tapped === count) {
        const ansSpeech = lang === "ja"
          ? `${countWords(count, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
          : `${countWords(count, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
        setTimeout(() => onComplete(true, ansSpeech), 450);
      }
    });
    tray.appendChild(btn);
  });
}

let lastA2Target = -1;

export function renderA2(container, { stage, max, chapter, lang, t, onResult, onSpeakText }) {
  const cap = Math.max(1, max);
  let target = 1 + Math.floor(Math.random() * cap);
  if (cap > 1 && target === lastA2Target) {
    target = (target % cap) + 1;
  }
  lastA2Target = target;
  const choices = Array.from(new Set([target, Math.max(1, target - 1), Math.min(cap, target + 1)]));
  while (choices.length < 3) {
    const cand = 1 + Math.floor(Math.random() * Math.max(3, cap));
    if (!choices.includes(cand)) choices.push(cand);
  }
  choices.sort((a, b) => a - b);

  const objLabel = lang === "vi" && chapter.object.classifier
    ? `${chapter.object.classifier} ${chapter.object.vi}`
    : chapter.object[lang];
  const prompt = t("ui.choosePrompt").replace("{object}", objLabel);
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="objects-tray" id="a2-tray"></div>
      <div class="choices-row" id="a2-choices"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);

  const tray = container.querySelector("#a2-tray");
  for (let i = 0; i < target; i++) {
    const el = document.createElement("button");
    el.className = "obj-item";
    el.innerHTML = renderObject(stage, 56);
    el.addEventListener("click", () => {
      el.classList.add("lit");
      playCountNote(i + 1);
    });
    tray.appendChild(el);
  }

  const row = container.querySelector("#a2-choices");
  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      const ansSpeech = lang === "ja"
        ? `${countWords(target, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
        : `${countWords(target, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
      if (val === target) {
        btn.classList.add("is-correct");
        onResult(true, btn, numberToWords(target, lang), null, ansSpeech);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, numberToWords(target, lang), () => {
          btn.classList.remove("is-wrong");
        });
      }
    });
    row.appendChild(btn);
  });
}

export function renderA3(container, { stage, max, chapter, lang, t, onComplete, onSpeakText }) {
  const leftCount = 1 + Math.floor(Math.random() * Math.max(1, Math.min(5, max)));
  let rightCount = Math.max(0, leftCount - (1 + Math.floor(Math.random() * Math.min(2, leftCount))));
  const prompt = t("ui.dragEqualPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="compare-arena">
        <div class="compare-side" id="a3-left"></div>
        <div class="compare-side" id="a3-right"></div>
      </div>
      <button id="a3-add" class="btn-pill btn-primary">+1</button>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);

  const renderSides = () => {
    const left = container.querySelector("#a3-left");
    const right = container.querySelector("#a3-right");
    left.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${Array.from({ length: leftCount }, () => renderObject(stage, 48)).join("")}</div>`;
    right.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${Array.from({ length: rightCount }, () => renderObject(stage, 48)).join("")}</div>`;
  };
  renderSides();

  const addBtn = container.querySelector("#a3-add");
  addBtn.addEventListener("click", () => {
    if (rightCount >= leftCount) return;
    rightCount++;
    playCountNote(rightCount);
    renderSides();
    if (rightCount === leftCount) {
      addBtn.disabled = true;
      addBtn.classList.add("is-disabled");
      const ansSpeech = lang === "ja"
        ? `${countWords(leftCount, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
        : `${countWords(leftCount, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
      setTimeout(() => onComplete(true, ansSpeech), 450);
    }
  });
}
