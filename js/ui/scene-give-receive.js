import { renderObject } from "./artwork.js";
import { generateProblem } from "../core/problem-gen.js";
import { numberToWords, countWords } from "../core/number-words.js";
import { playCountNote, playReceiveTing, playGiveWhoosh } from "../audio/sfx.js";

function buildStoryText({ kind, a, b }, chapter, lang) {
  const animal = chapter.animal[lang];
  const obj = chapter.object[lang];
  const cls = chapter.object.classifier;
  if (lang === "ja") {
    const unit = chapter.object.counter === "hiki" ? "ひき" : "こ";
    if (kind === "take") {
      return `${animal}は ${obj}を ${a}${unit} もっています。ともだちに ${b}${unit} あげました。のこりは いくつ？`;
    }
    if (kind === "missing") {
      return `${obj}が ぜんぶで ${a}${unit} あります。みえているのは ${b}${unit}。かくれているのは いくつ？`;
    }
    if (kind === "compare") {
      return `${a}${unit}と ${b}${unit}、ちがいは いくつ？`;
    }
    return `${animal}は ${obj}を ${a}${unit} もっています。${b}${unit} もらいました。ぜんぶで いくつ？`;
  }
  if (kind === "take") {
    return `${animal} có ${a} ${cls} ${obj}. Cho bạn ${b} ${cls}. Còn mấy ${cls}?`;
  }
  if (kind === "missing") {
    return `Có tất cả ${a} ${cls} ${obj}, thấy ${b} ${cls}. Còn thiếu mấy ${cls}?`;
  }
  if (kind === "compare") {
    return `Một bên ${a} ${cls} ${obj}, một bên ${b} ${cls}. Nhiều hơn mấy ${cls}?`;
  }
  return `${animal} có ${a} ${cls} ${obj}. Bạn cho thêm ${b} ${cls}. Tất cả có mấy ${cls}?`;
}

export function renderGiveReceive(container, { stage, activity, chapter, lang, onResult, onSpeakText }) {
  const kind = activity.kind || "add";
  const cap = Math.min(20, activity.max || 10);
  const prob = generateProblem({ kind, max: cap, seed: (Date.now() & 0xffff) + stage });
  const storyLine = buildStoryText(prob, chapter, lang);
  const isTake = kind === "take";
  const opSym = isTake || kind === "compare" || kind === "missing" ? "−" : "+";

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text" style="font-size:24px;max-width:820px;">${storyLine}</p>
      <div class="big-numeral" style="font-size:56px">${prob.a} ${opSym} ${prob.b} = ?</div>
      <div class="objects-tray" id="a4-tray"></div>
      <div class="choices-row" id="a4-choices"></div>
    </div>
  `;

  const tray = container.querySelector("#a4-tray");
  const isSub = isTake || kind === "missing" || kind === "compare";
  const countToShow = kind === "add" || kind === "combine" ? prob.a + prob.b : prob.a;
  for (let i = 0; i < Math.min(20, countToShow); i++) {
    const item = document.createElement("button");
    item.className = "obj-item";
    item.innerHTML = renderObject(stage, 50);
    if (isSub && i >= prob.answer) {
      item.style.opacity = "0.55";
      item.style.border = "3px dashed var(--give)";
      item.style.background = "#FFF5F4";
      item.style.cursor = "default";
    } else if (!isSub && i >= prob.a) {
      item.style.borderColor = "var(--receive)";
    }
    item.addEventListener("click", () => {
      if (isSub && i >= prob.answer) return;
      item.classList.add("lit");
      if (!isSub && i >= prob.a) playReceiveTing();
      else playCountNote(i + 1);
    });
    tray.appendChild(item);
  }

  const row = container.querySelector("#a4-choices");
  prob.choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      const ansWord = numberToWords(Math.min(100, prob.answer), lang);
      const ansSpeech = lang === "ja"
        ? `${countWords(Math.min(100, prob.answer), chapter.object.counter, "ja")} ${chapter.object.ja} ですね！`
        : `${countWords(Math.min(100, prob.answer), chapter.object.classifier, "vi")} ${chapter.object.vi} đó!`;
      if (val === prob.answer) {
        btn.classList.add("is-correct");
        onResult(true, btn, ansWord, null, ansSpeech);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
      }
    });
    row.appendChild(btn);
  });

  if (onSpeakText) onSpeakText(storyLine);
}
