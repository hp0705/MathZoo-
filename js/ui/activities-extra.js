import { renderObject, renderAnimal } from "./artwork.js";
import { generateProblem } from "../core/problem-gen.js";
import { ordinalWords } from "../core/ordinal-time.js";
import { numberToWords, countWords } from "../core/number-words.js";
import { playCountNote } from "../audio/sfx.js";

export function renderA5Split(container, { stage, max, chapter, lang, t, onComplete, onSpeakText }) {
  const total = Math.max(2, Math.min(10, 2 + Math.floor(Math.random() * (max - 1))));
  let left = 0;
  let right = 0;
  const prompt = t("ui.splitPrompt");
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral" id="s-eq" style="font-size:52px">0 + 0 = ${total}</div>
      <div class="objects-tray" id="s-pool" style="min-height:84px;padding:10px;"></div>
      <div class="compare-arena" style="justify-content:center;gap:32px;">
        <button class="plate-round" id="s-left"></button>
        <button class="plate-round" id="s-right"></button>
      </div>
    </div>
  `;
  const render = () => {
    const rem = total - left - right;
    container.querySelector("#s-eq").textContent = `${left} + ${right} = ${total}`;
    container.querySelector("#s-pool").innerHTML = rem > 0
      ? Array.from({ length: rem }, () => renderObject(stage, 48)).join("")
      : `<span style="font-size:24px;font-weight:800;color:var(--receive)">✓</span>`;
    container.querySelector("#s-left").innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${Array.from({ length: left }, () => renderObject(stage, 36)).join("")}</div><div style="font-size:28px;font-weight:900">${left}</div>`;
    container.querySelector("#s-right").innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center">${Array.from({ length: right }, () => renderObject(stage, 36)).join("")}</div><div style="font-size:28px;font-weight:900">${right}</div>`;
    if (rem === 0) {
      const ansSpeech = lang === "ja"
        ? `${countWords(total, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
        : `${countWords(total, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
      setTimeout(() => onComplete(true, ansSpeech), 400);
    }
  };
  container.querySelector("#s-left").addEventListener("click", () => {
    if (left + right < total) { left++; playCountNote(left); render(); }
  });
  container.querySelector("#s-right").addEventListener("click", () => {
    if (left + right < total) { right++; playCountNote(right); render(); }
  });
  render();
  if (onSpeakText) onSpeakText(prompt);
}

export function renderA6TenFrame(container, { stage, max, chapter, lang, t, onComplete, onSpeakText }) {
  const target = Math.max(1, Math.min(10, 1 + Math.floor(Math.random() * Math.min(10, max))));
  const filled = new Set();
  const prompt = t("ui.tenFramePrompt");
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt} (${target})</p>
      <div class="ten-frame" id="tf-grid"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);
  const grid = container.querySelector("#tf-grid");
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement("button");
    cell.className = "ten-cell";
    cell.addEventListener("click", () => {
      if (filled.has(i)) return;
      filled.add(i);
      cell.innerHTML = renderObject(stage, 52);
      playCountNote(filled.size);
      if (filled.size === target) {
        const ansSpeech = lang === "ja"
          ? `${countWords(target, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
          : `${countWords(target, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
        setTimeout(() => onComplete(true, ansSpeech), 450);
      }
    });
    grid.appendChild(cell);
  }
}

export function renderA7Match(container, { stage, max, chapter, lang, t, onResult, onSpeakText }) {
  const target = 1 + Math.floor(Math.random() * Math.min(10, max));
  const counts = Array.from(new Set([target, Math.max(1, target - 1), Math.min(10, target + 1)]));
  while (counts.length < 3) {
    const c = 1 + Math.floor(Math.random() * Math.min(10, max));
    if (!counts.includes(c)) counts.push(c);
  }
  const shuffledCounts = shuffleChoices(counts);
  const prompt = t("ui.matchPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral">${target}</div>
      <div class="choices-row" id="a7-groups"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);
  const row = container.querySelector("#a7-groups");
  shuffledCounts.forEach((cnt) => {
    const card = document.createElement("button");
    card.className = "choice-card";
    card.style.cssText = "min-width:180px;flex-wrap:wrap;padding:14px;gap:6px";
    card.innerHTML = Array.from({ length: cnt }, () => renderObject(stage, 38)).join("");
    card.addEventListener("click", () => {
      const ansWord = numberToWords(target, lang);
      const ansSpeech = lang === "ja"
        ? `${countWords(target, chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
        : `${countWords(target, chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
      if (cnt === target) {
        card.classList.add("is-correct");
        onResult(true, card, ansWord, null, ansSpeech);
      } else {
        card.classList.add("is-wrong");
        onResult(false, card, ansWord, () => card.classList.remove("is-wrong"));
      }
    });
    row.appendChild(card);
  });
}

export function renderA9Board(container, { max, lang, t, onResult, onSpeakText }) {
  const cap = Math.max(3, max);
  const start = cap <= 20 ? 1 : (Math.floor(Math.random() * Math.max(1, Math.floor((cap - 11) / 10))) * 10) + 1;
  const maxOffset = Math.min(18, cap - start);
  const missingOffset = Math.min(maxOffset, 1 + Math.floor(Math.random() * Math.max(1, Math.min(8, maxOffset))));
  const answer = Math.min(cap, start + missingOffset);
  const choiceSet = new Set([answer]);
  if (answer - 1 >= 1) choiceSet.add(answer - 1);
  if (answer + 1 <= cap) choiceSet.add(answer + 1);
  for (let delta = 2; choiceSet.size < 3 && delta <= cap; delta++) {
    if (answer - delta >= 1) choiceSet.add(answer - delta);
    if (choiceSet.size < 3 && answer + delta <= cap) choiceSet.add(answer + delta);
  }
  const choices = shuffleChoices([...choiceSet]);
  const prompt = t("ui.boardPrompt");

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="board-100" id="a9-grid"></div>
      <div class="choices-row" id="a9-choices"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);
  const grid = container.querySelector("#a9-grid");
  for (let i = 0; i < 20; i++) {
    const num = start + i;
    if (num > 100) break;
    const cell = document.createElement("div");
    cell.className = "board-cell" + (num === answer ? " missing" : "");
    cell.textContent = num === answer ? "?" : String(num);
    grid.appendChild(cell);
  }
  const row = container.querySelector("#a9-choices");
  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      const ansWord = numberToWords(answer, lang);
      if (val === answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
}

export function renderA11Ordinal(container, { lang, t, onResult, onSpeakText }) {
  const prob = generateProblem({ kind: "ordinal", max: 8, seed: Date.now() & 0xffff });
  const ordWord = ordinalWords(prob.answer, lang);
  const prompt = t("ui.ordinalPrompt").replace("{ord}", ordWord);
  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="objects-tray" id="a11-row"></div>
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);
  const row = container.querySelector("#a11-row");
  for (let pos = 1; pos <= prob.a; pos++) {
    const btn = document.createElement("button");
    btn.className = "obj-item";
    btn.style.cssText = "width:84px;height:84px;flex-direction:column";
    btn.innerHTML = `${renderAnimal(((pos - 1) % 8) + 1, 52)}<span style="font-size:16px;font-weight:800">${pos}</span>`;
    btn.addEventListener("click", () => {
      if (pos === prob.answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ordWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ordWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  }
}

function shuffleChoices(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderA15Neighbor(container, { max = 10, lang, onResult, onSpeakText }) {
  const cap = Math.max(4, max);
  const askBefore = Math.random() < 0.5;
  const center = askBefore
    ? 2 + Math.floor(Math.random() * (cap - 1))
    : 1 + Math.floor(Math.random() * (cap - 1));
  const answer = askBefore ? center - 1 : center + 1;

  const set = new Set([answer]);
  for (const cand of [center, answer - 1, answer + 1, answer - 2, answer + 2]) {
    if (set.size >= 3) break;
    if (cand >= 0 && cand <= cap && cand !== answer) set.add(cand);
  }
  for (let v = 0; set.size < 3 && v <= cap; v++) set.add(v);
  const choices = shuffleChoices([...set]);

  const numWord = numberToWords(center, lang);
  const ansWord = numberToWords(answer, lang);
  const prompt = lang === "ja"
    ? (askBefore ? `${numWord}の ひとつまえの すうじは いくつ？` : `${numWord}の ひとつあとの すうじは いくつ？`)
    : (askBefore ? `Số liền trước của số ${center} là số nào?` : `Số liền sau của số ${center} là số nào?`);
  const promptSpeak = lang === "ja"
    ? prompt
    : (askBefore ? `Số liền trước của số ${numWord} là số nào?` : `Số liền sau của số ${numWord} là số nào?`);

  const leftBox = askBefore ? "?" : String(center - 1);
  const rightBox = askBefore ? String(center + 1) : "?";

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="choices-row" style="gap:14px;">
        <div class="board-cell ${askBefore ? "missing" : ""}" style="min-width:72px;min-height:72px;font-size:32px;">${leftBox}</div>
        <div class="board-cell" style="min-width:72px;min-height:72px;font-size:32px;background:var(--ok-bg);">${center}</div>
        <div class="board-cell ${!askBefore ? "missing" : ""}" style="min-width:72px;min-height:72px;font-size:32px;">${rightBox}</div>
      </div>
      <div class="choices-row" id="a15-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a15-choices");
  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      if (val === answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
  if (onSpeakText) onSpeakText(promptSpeak);
}

export function renderA16Bond(container, { stage = 9, max = 10, lang, onResult, onSpeakText }) {
  const cap = Math.max(3, Math.min(10, max));
  const total = 2 + Math.floor(Math.random() * (cap - 1));
  const partA = 1 + Math.floor(Math.random() * (total - 1));
  const answer = total - partA;

  const set = new Set([answer]);
  for (let d = 1; set.size < 3 && d <= cap; d++) {
    if (answer - d >= 1) set.add(answer - d);
    if (set.size < 3 && answer + d <= cap) set.add(answer + d);
  }
  const choices = shuffleChoices([...set]);

  const totalWord = numberToWords(total, lang);
  const partWord = numberToWords(partA, lang);
  const ansWord = numberToWords(answer, lang);

  const prompt = lang === "ja"
    ? `${totalWord}は ${partWord}と いくつ？`
    : `${total} gồm ${partA} và mấy?`;
  const promptSpeak = lang === "ja"
    ? prompt
    : `${totalWord} gồm ${partWord} và mấy?`;

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral" style="font-size:52px">${total} = ${partA} + ?</div>
      <div class="compare-arena" style="justify-content:center;gap:24px;">
        <div class="compare-side" style="min-height:110px;">
          <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">
            ${Array.from({ length: partA }, () => renderObject(stage, 40)).join("")}
          </div>
          <div style="font-size:24px;font-weight:900">${partA}</div>
        </div>
        <div class="compare-side" style="min-height:110px;border-style:dashed;border-color:var(--accent);">
          <span style="font-size:44px;font-weight:900;color:var(--accent)">?</span>
        </div>
      </div>
      <div class="choices-row" id="a16-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a16-choices");
  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      if (val === answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });
  if (onSpeakText) onSpeakText(promptSpeak);
}
