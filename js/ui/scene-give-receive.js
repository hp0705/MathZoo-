import { renderObject } from "./artwork.js";
import { generateProblem } from "../core/problem-gen.js";
import { numberToWords, countWords } from "../core/number-words.js";
import { playCountNote, playReceiveTing, playGiveWhoosh } from "../audio/sfx.js";

function buildStoryText({ kind, a, b }, chapter, lang) {
  const animal = chapter.animal[lang];
  const obj = chapter.object[lang];
  const cls = chapter.object.classifier;
  if (lang === "ja") {
    const counter = chapter.object.counter === "hiki" ? "hiki" : "ko";
    const wA = countWords(a, counter, "ja");
    const wB = countWords(b, counter, "ja");
    let line;
    if (kind === "take") {
      line = `${animal}は ${obj}を ${wA} もっています。ともだちに ${wB} あげました。のこりは いくつ？`;
    } else if (kind === "missing") {
      line = `${obj}が ぜんぶで ${wA} あります。みえているのは ${wB}。かくれているのは いくつ？`;
    } else if (kind === "compare") {
      line = `${wA}と ${wB}、ちがいは いくつ？`;
    } else {
      line = `${animal}は ${obj}を ${wA} もっています。${wB} もらいました。ぜんぶで いくつ？`;
    }
    return { text: line, speak: line };
  }
  const wA = numberToWords(a, "vi");
  const wB = numberToWords(b, "vi");
  if (kind === "take") {
    return {
      text: `${animal} có ${a} ${cls} ${obj}. Cho bạn ${b} ${cls}. Còn mấy ${cls}?`,
      speak: `${animal} có ${wA} ${cls} ${obj}. Cho bạn ${wB} ${cls}. Còn mấy ${cls}?`
    };
  }
  if (kind === "missing") {
    return {
      text: `Có tất cả ${a} ${cls} ${obj}, thấy ${b} ${cls}. Còn thiếu mấy ${cls}?`,
      speak: `Có tất cả ${wA} ${cls} ${obj}, thấy ${wB} ${cls}. Còn thiếu mấy ${cls}?`
    };
  }
  if (kind === "compare") {
    return {
      text: `Một bên ${a} ${cls} ${obj}, một bên ${b} ${cls}. Nhiều hơn mấy ${cls}?`,
      speak: `Một bên ${wA} ${cls} ${obj}, một bên ${wB} ${cls}. Nhiều hơn mấy ${cls}?`
    };
  }
  return {
    text: `${animal} có ${a} ${cls} ${obj}. Bạn cho thêm ${b} ${cls}. Tất cả có mấy ${cls}?`,
    speak: `${animal} có ${wA} ${cls} ${obj}. Bạn cho thêm ${wB} ${cls}. Tất cả có mấy ${cls}?`
  };
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
      <p class="prompt-text" style="font-size:24px;max-width:820px;">${storyLine.text}</p>
      <div class="big-numeral" style="font-size:56px">${prob.a} ${opSym} ${prob.b} = ?</div>
      <div class="objects-tray" id="a4-tray"></div>
      <div class="choices-row" id="a4-choices"></div>
    </div>
  `;

  const tray = container.querySelector("#a4-tray");
  if (kind === "compare") {
    tray.style.flexDirection = "column";
    tray.style.alignItems = "flex-start";
    tray.style.gap = "10px";
    const makeRow = (count, isTop) => {
      const rowEl = document.createElement("div");
      rowEl.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;";
      for (let i = 0; i < Math.min(20, count); i++) {
        const item = document.createElement("button");
        item.className = "obj-item";
        item.style.cssText = "width:54px;height:54px;";
        if (isTop && i >= prob.b) {
          item.style.borderColor = "var(--total)";
          item.style.background = "var(--amber-bg)";
        }
        item.innerHTML = renderObject(stage, 42);
        item.addEventListener("click", () => {
          item.classList.add("lit");
          playCountNote(i + 1);
        });
        rowEl.appendChild(item);
      }
      return rowEl;
    };
    tray.append(makeRow(prob.a, true), makeRow(prob.b, false));
  } else if (kind === "missing") {
    for (let i = 0; i < Math.min(20, prob.a); i++) {
      const item = document.createElement("button");
      item.className = "obj-item";
      if (i < prob.b) {
        item.innerHTML = renderObject(stage, 50);
        item.addEventListener("click", () => {
          item.classList.add("lit");
          playCountNote(i + 1);
        });
      } else {
        item.style.border = "3px dashed var(--accent)";
        item.style.background = "#F4F0FF";
        item.style.cursor = "default";
        item.innerHTML = `<span style="font-size:28px;font-weight:900;color:var(--accent)">?</span>`;
      }
      tray.appendChild(item);
    }
  } else {
    const countToShow = kind === "add" || kind === "combine" ? prob.a + prob.b : prob.a;
    for (let i = 0; i < Math.min(20, countToShow); i++) {
      const item = document.createElement("button");
      item.className = "obj-item";
      item.innerHTML = renderObject(stage, 50);
      if (isTake && i >= prob.answer) {
        item.style.opacity = "0.55";
        item.style.border = "3px dashed var(--give)";
        item.style.background = "#FFF5F4";
        item.style.cursor = "default";
      } else if (!isTake && i >= prob.a) {
        item.style.borderColor = "var(--receive)";
      }
      item.addEventListener("click", () => {
        if (isTake && i >= prob.answer) return;
        item.classList.add("lit");
        if (!isTake && i >= prob.a) playReceiveTing();
        else playCountNote(i + 1);
      });
      tray.appendChild(item);
    }
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

  if (onSpeakText) onSpeakText(storyLine.speak);
}
