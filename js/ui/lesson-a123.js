import { renderObject } from "./artwork.js";
import { generateProblem } from "../core/problem-gen.js";
import { numberToWords, countWords } from "../core/number-words.js";
import { playCountNote, playWrongBoing } from "../audio/sfx.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
  const shuffledChoices = shuffle(choices);

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
  shuffledChoices.forEach((val) => {
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
  const bigCount = 1 + Math.floor(Math.random() * Math.max(1, Math.min(5, max)));
  const smallCount = Math.max(0, bigCount - (1 + Math.floor(Math.random() * Math.min(2, bigCount))));
  const fewerOnLeft = Math.random() < 0.5;
  let leftCount = fewerOnLeft ? smallCount : bigCount;
  let rightCount = fewerOnLeft ? bigCount : smallCount;
  const prompt = t("ui.dragEqualPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="compare-arena">
        <button class="compare-side" id="a3-left" style="cursor:pointer"></button>
        <button class="compare-side" id="a3-right" style="cursor:pointer"></button>
      </div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);

  const leftEl = container.querySelector("#a3-left");
  const rightEl = container.querySelector("#a3-right");

  const renderSides = () => {
    leftEl.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${Array.from({ length: leftCount }, () => renderObject(stage, 48)).join("")}</div>`;
    rightEl.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${Array.from({ length: rightCount }, () => renderObject(stage, 48)).join("")}</div>`;
  };
  renderSides();

  let done = false;
  const setupSide = (el, isLeft) => {
    let holdTimer = null;
    const clear = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      el.classList.remove("is-holding");
    };
    el.addEventListener("pointerdown", () => {
      if (done || leftCount === rightCount) return;
      const isFewer = isLeft ? leftCount < rightCount : rightCount < leftCount;
      if (!isFewer) {
        playWrongBoing();
        el.classList.add("is-wrong");
        setTimeout(() => el.classList.remove("is-wrong"), 450);
        if (onSpeakText) {
          onSpeakText(lang === "ja" ? "こっちは おおいよ、すくない ほうを ながおししてね！" : "Nhầm rồi! Bên này nhiều hơn, giữ bên ít hơn nhé!");
        }
        return;
      }
      clear();
      void el.offsetWidth;
      el.classList.add("is-holding");
      holdTimer = setTimeout(() => {
        clear();
        if (done || leftCount === rightCount) return;
        if (isLeft) leftCount++;
        else rightCount++;
        playCountNote(Math.max(leftCount, rightCount));
        renderSides();
        if (leftCount === rightCount) {
          done = true;
          leftEl.disabled = true;
          rightEl.disabled = true;
          const ansSpeech = lang === "ja"
            ? `${countWords(leftCount, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
            : `${countWords(leftCount, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
          setTimeout(() => onComplete(true, ansSpeech), 450);
        }
      }, 1000);
    });
    el.addEventListener("pointerup", clear);
    el.addEventListener("pointerleave", clear);
    el.addEventListener("pointercancel", clear);
  };

  setupSide(leftEl, true);
  setupSide(rightEl, false);
}
