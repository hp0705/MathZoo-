import { renderObject, renderComparisonSign } from "./artwork.js";
import { compareSentence, evalSide, generateSignSet, generateSignExprSet } from "../core/compare.js";
import { playCountNote, playPairBlip, playSeesawTilt } from "../audio/sfx.js";

function formatSideText(side) {
  if (typeof side === "number") return String(side);
  return `${side.x} ${side.op === "+" ? "+" : "−"} ${side.y}`;
}

export function renderCompareScene(container, { stage, activity, settings, lang, t, onResult, onSpeakText }) {
  const variant = activity.variant || "a";
  const eyes = Boolean(activity.eyes && settings.showSignEyes !== false);
  const seed = (Date.now() & 0xffff) + stage * 31;

  const prob = variant === "c"
    ? generateSignExprSet({ count: 10, max: Math.min(10, activity.max || 10), seed })[0]
    : generateSignSet({ count: 10, max: activity.max || 10, allowEqual: activity.allowEqual !== false, focusSign: activity.focusSign || null, seed })[0];

  const valA = evalSide(prob.a);
  const valB = evalSide(prob.b);
  let showObj = variant === "a";

  const prompt = t("ui.compareSignPrompt");
  const leftText = formatSideText(prob.a);
  const rightText = formatSideText(prob.b);

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral" id="cmp-expr" style="font-size:56px">${leftText} <span style="color:var(--accent)">?</span> ${rightText}</div>
      <div class="compare-arena" id="cmp-arena">
        <div class="compare-side" id="cmp-left"></div>
        <div class="compare-slot" id="cmp-slot"><span style="font-size:48px;font-weight:900;color:var(--accent)">?</span></div>
        <div class="compare-side" id="cmp-right"></div>
        <svg class="pair-svg" id="pair-svg"></svg>
      </div>
      <div style="font-size:20px;font-weight:700;opacity:0.85">${t("hint.pair")}</div>
      <div class="choices-row" id="cmp-choices"></div>
      ${variant === "b" ? `<button id="cmp-toggle-obj" class="btn-pill" style="font-size:20px;min-height:56px">${t("ui.showObjects")}</button>` : ""}
    </div>
  `;
  if (onSpeakText) onSpeakText(prompt);

  const leftEl = container.querySelector("#cmp-left");
  const rightEl = container.querySelector("#cmp-right");
  const slotEl = container.querySelector("#cmp-slot");
  const pairSvg = container.querySelector("#pair-svg");

  const renderSide = (el, side, val) => {
    el.innerHTML = "";
    if (showObj && val <= 20) {
      const wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;justify-content:center";
      for (let i = 0; i < val; i++) {
        const obj = document.createElement("span");
        obj.className = "obj-item";
        obj.style.cssText = "width:48px;height:48px";
        obj.innerHTML = renderObject(stage, 42);
        obj.addEventListener("click", () => {
          obj.classList.add("lit");
          playCountNote(i + 1);
        });
        wrap.appendChild(obj);
      }
      const num = document.createElement("div");
      num.style.cssText = "font-size:34px;font-weight:900";
      num.textContent = String(val);
      el.append(wrap, num);
    } else {
      const num = document.createElement("div");
      num.className = "big-numeral";
      num.style.fontSize = variant === "c" ? "54px" : "84px";
      num.textContent = formatSideText(side);
      el.appendChild(num);
    }
  };

  const renderBothSides = () => {
    renderSide(leftEl, prob.a, valA);
    renderSide(rightEl, prob.b, valB);
  };
  renderBothSides();

  const toggleBtn = container.querySelector("#cmp-toggle-obj");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      showObj = !showObj;
      renderBothSides();
    });
  }

  const runPairingAnimation = () => {
    showObj = true;
    renderBothSides();
    const lItems = [...leftEl.querySelectorAll(".obj-item")];
    const rItems = [...rightEl.querySelectorAll(".obj-item")];
    const minLen = Math.min(lItems.length, rItems.length);
    const arenaRect = container.querySelector("#cmp-arena").getBoundingClientRect();
    pairSvg.innerHTML = "";
    for (let i = 0; i < minLen; i++) {
      const lr = lItems[i].getBoundingClientRect();
      const rr = rItems[i].getBoundingClientRect();
      const x1 = lr.left + lr.width / 2 - arenaRect.left;
      const y1 = lr.top + lr.height / 2 - arenaRect.top;
      const x2 = rr.left + rr.width / 2 - arenaRect.left;
      const y2 = rr.top + rr.height / 2 - arenaRect.top;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("stroke", "#6B4BC8");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("stroke-linecap", "round");
      pairSvg.appendChild(line);
      setTimeout(() => playPairBlip(i + 1), i * 120);
    }
    const extra = lItems.length > rItems.length ? lItems.slice(minLen) : rItems.slice(minLen);
    extra.forEach((el) => el.classList.add("halo"));
  };

  const ansSentence = {
    vi: compareSentence(valA, valB, "vi", "number"),
    ja: compareSentence(valA, valB, "ja", "number")
  };

  const row = container.querySelector("#cmp-choices");
  prob.choices.forEach((sign) => {
    const btn = document.createElement("button");
    btn.className = "sign-card";
    btn.setAttribute("aria-label", sign);
    btn.innerHTML = renderComparisonSign(sign, eyes, 88);
    btn.addEventListener("click", () => {
      slotEl.innerHTML = renderComparisonSign(sign, eyes, 88);
      const exprEl = container.querySelector("#cmp-expr");
      if (exprEl) exprEl.innerHTML = `${leftText} <span style="color:var(--accent)">${sign === "<" ? "&lt;" : sign === ">" ? "&gt;" : "="}</span> ${rightText}`;
      if (sign === prob.answer) {
        btn.classList.add("is-correct");
        playSeesawTilt();
        const arena = container.querySelector("#cmp-arena");
        if (valA > valB) arena.style.transform = "rotate(-2deg)";
        else if (valB > valA) arena.style.transform = "rotate(2deg)";
        onResult(true, btn, ansSentence);
      } else {
        btn.classList.add("is-wrong");
        runPairingAnimation();
        onResult(false, btn, ansSentence, () => {
          btn.classList.remove("is-wrong");
          slotEl.innerHTML = `<span style="font-size:48px;font-weight:900;color:var(--accent)">?</span>`;
          if (exprEl) exprEl.innerHTML = `${leftText} <span style="color:var(--accent)">?</span> ${rightText}`;
        });
      }
    });
    row.appendChild(btn);
  });
}
