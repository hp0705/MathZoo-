import { clockWords } from "../core/ordinal-time.js";
import { numberToWords } from "../core/number-words.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHAPE_SVGS = {
  circle: `<circle cx="40" cy="40" r="28" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/>`,
  square: `<rect x="14" y="14" width="52" height="52" rx="6" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="4"/>`,
  triangle: `<polygon points="40,12 68,66 12,66" fill="#FFD0E0" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>`,
  rectangle: `<rect x="8" y="22" width="64" height="36" rx="6" fill="#BFEFDD" stroke="#2B2A4C" stroke-width="4"/>`
};

const SOLID_SVGS = {
  sphere: `
    <circle cx="40" cy="40" r="28" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/>
    <ellipse cx="40" cy="40" rx="28" ry="10" fill="none" stroke="#2B2A4C" stroke-width="2.5" stroke-dasharray="4 4"/>
    <circle cx="30" cy="28" r="6" fill="#FFF7D6" opacity="0.85"/>`,
  cylinder: `
    <path d="M18,22 L18,58 A22,9 0 0,0 62,58 L62,22 Z" fill="#BFEFDD" stroke="#2B2A4C" stroke-width="4"/>
    <ellipse cx="40" cy="22" rx="22" ry="9" fill="#E4F9F0" stroke="#2B2A4C" stroke-width="4"/>`,
  cube: `
    <polygon points="16,28 44,28 44,58 16,58" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="16,28 30,16 58,16 44,28" fill="#EAF4FF" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="44,28 58,16 58,46 44,58" fill="#9BC8F5" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>`,
  cuboid: `
    <polygon points="10,34 48,34 48,58 10,58" fill="#FFD0E0" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="10,34 24,20 62,20 48,34" fill="#FFEBF1" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="48,34 62,20 62,44 48,58" fill="#F29EB8" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>`
};

const SHAPE_NAMES = {
  circle: { vi: "hình tròn", ja: "まる" },
  square: { vi: "hình vuông", ja: "ましかく" },
  triangle: { vi: "hình tam giác", ja: "さんかく" },
  rectangle: { vi: "hình chữ nhật", ja: "ながしかく" }
};

const SOLID_NAMES = {
  sphere: { vi: "khối cầu", ja: "たまの かたち" },
  cylinder: { vi: "khối trụ", ja: "つつの かたち" },
  cube: { vi: "khối vuông", ja: "さいころの かたち" },
  cuboid: { vi: "khối chữ nhật", ja: "はこの かたち" }
};

const DAYS_OF_WEEK = [
  { vi: "Thứ Hai", ja: "げつようび" },
  { vi: "Thứ Ba", ja: "かようび" },
  { vi: "Thứ Tư", ja: "すいようび" },
  { vi: "Thứ Năm", ja: "もくようび" },
  { vi: "Thứ Sáu", ja: "きんようび" },
  { vi: "Thứ Bảy", ja: "どようび" },
  { vi: "Chủ nhật", ja: "にちようび" }
];

const SEASONS_DATA = [
  {
    key: "spring",
    vi: "mùa xuân",
    ja: "はる",
    clueVi: "Mùa nào hoa nở rực rỡ và ấm áp?",
    clueJa: "おはなが さいて あたたかい きせつは どれ？",
    svg: `<circle cx="40" cy="40" r="10" fill="#FFC83D"/><circle cx="40" cy="20" r="10" fill="#FFB7D5"/><circle cx="58" cy="34" r="10" fill="#FFB7D5"/><circle cx="52" cy="54" r="10" fill="#FFB7D5"/><circle cx="28" cy="54" r="10" fill="#FFB7D5"/><circle cx="22" cy="34" r="10" fill="#FFB7D5"/>`
  },
  {
    key: "summer",
    vi: "mùa hạ",
    ja: "なつ",
    clueVi: "Mùa nào nắng ấm rực rỡ nhất?",
    clueJa: "おひさまが ぴかぴか あつい きせつは どれ？",
    svg: `<circle cx="40" cy="40" r="18" fill="#FFC83D" stroke="#F08A00" stroke-width="4"/><line x1="40" y1="8" x2="40" y2="18" stroke="#F08A00" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="62" x2="40" y2="72" stroke="#F08A00" stroke-width="4" stroke-linecap="round"/><line x1="8" y1="40" x2="18" y2="40" stroke="#F08A00" stroke-width="4" stroke-linecap="round"/><line x1="62" y1="40" x2="72" y2="40" stroke="#F08A00" stroke-width="4" stroke-linecap="round"/>`
  },
  {
    key: "autumn",
    vi: "mùa thu",
    ja: "あき",
    clueVi: "Mùa nào lá vàng lá đỏ rơi nhiều?",
    clueJa: "あかい はっぱが おちる きせつは どれ？",
    svg: `<path d="M40,12 L48,30 L66,28 L52,42 L58,60 L40,50 L22,60 L28,42 L14,28 L32,30 Z" fill="#F06A24" stroke="#2B2A4C" stroke-width="3"/><line x1="40" y1="50" x2="40" y2="70" stroke="#7A4918" stroke-width="4" stroke-linecap="round"/>`
  },
  {
    key: "winter",
    vi: "mùa đông",
    ja: "ふゆ",
    clueVi: "Mùa nào trời lạnh và có tuyết rơi?",
    clueJa: "さむくて ゆきが ふる きせつは どれ？",
    svg: `<line x1="40" y1="12" x2="40" y2="68" stroke="#4DA6FF" stroke-width="5" stroke-linecap="round"/><line x1="15" y1="26" x2="65" y2="54" stroke="#4DA6FF" stroke-width="5" stroke-linecap="round"/><line x1="65" y1="26" x2="15" y2="54" stroke="#4DA6FF" stroke-width="5" stroke-linecap="round"/>`
  }
];

export function renderA12Pattern(container, { lang, t, onResult, onSpeakText }) {
  const keys = ["circle", "square", "triangle"];
  const a = keys[Math.floor(Math.random() * keys.length)];
  const b = keys.find((k) => k !== a);
  const modes = [
    { seq: [a, b, a, b, a], answer: b },
    { seq: [a, a, b, a, a], answer: b },
    { seq: [a, b, b, a, b], answer: b }
  ];
  const picked = modes[Math.floor(Math.random() * modes.length)];
  const seq = picked.seq;
  const answer = picked.answer;
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
  shuffle(keys).forEach((k) => {
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
    const axes = [
      {
        dir: "flex-direction:row",
        a: { vi: "trái", ja: "ひだり", shape: "circle" },
        b: { vi: "phải", ja: "みぎ", shape: "triangle" }
      },
      {
        dir: "flex-direction:column;max-width:340px",
        a: { vi: "trên", ja: "うえ", shape: "square" },
        b: { vi: "dưới", ja: "した", shape: "circle" }
      },
      {
        dir: "flex-direction:row;gap:28px",
        a: { vi: "trước", ja: "まえ", shape: "triangle" },
        b: { vi: "sau", ja: "うしろ", shape: "rectangle" },
        frontBack: true
      }
    ];
    const ax = axes[Math.floor(Math.random() * axes.length)];
    const pickFirst = Math.random() < 0.5;
    const targetObj = pickFirst ? ax.a : ax.b;
    const posWord = targetObj[lang];
    const prompt = t("ui.positionPrompt").replace("{pos}", posWord);

    container.innerHTML = `
      <div class="lesson-layout">
        <p class="prompt-text">${prompt}</p>
        <div class="compare-arena" style="${ax.dir}">
          <button id="pos-a" class="compare-side" style="cursor:pointer;min-height:130px;${ax.frontBack ? "z-index:2;transform:scale(1.06);" : ""}">
            <svg width="80" height="80" viewBox="0 0 80 80">${SHAPE_SVGS[ax.a.shape]}</svg>
          </button>
          <button id="pos-b" class="compare-side" style="cursor:pointer;min-height:130px;${ax.frontBack ? "opacity:0.85;transform:scale(0.92);" : ""}">
            <svg width="80" height="80" viewBox="0 0 80 80">${SHAPE_SVGS[ax.b.shape]}</svg>
          </button>
        </div>
      </div>
    `;
    const check = (pickedA, btn) => {
      if (pickedA === pickFirst) {
        btn.classList.add("is-correct");
        onResult(true, btn, posWord);
      } else {
        btn.classList.add("is-wrong");
        onResult(false, btn, posWord, () => btn.classList.remove("is-wrong"));
      }
    };
    container.querySelector("#pos-a").addEventListener("click", (e) => check(true, e.currentTarget));
    container.querySelector("#pos-b").addEventListener("click", (e) => check(false, e.currentTarget));
    if (onSpeakText) onSpeakText(prompt);
    return;
  }

  if (topic === "solid") {
    const keys = ["sphere", "cylinder", "cube", "cuboid"];
    const target = keys[Math.floor(Math.random() * keys.length)];
    const others = shuffle(keys.filter((k) => k !== target)).slice(0, 2);
    const opts = shuffle([target, ...others]);
    const solidWord = SOLID_NAMES[target][lang];
    const prompt = t("ui.shapePrompt").replace("{shape}", solidWord);

    container.innerHTML = `
      <div class="lesson-layout">
        <p class="prompt-text">${prompt}</p>
        <div class="choices-row" id="a13-solid-choices"></div>
      </div>
    `;
    const row = container.querySelector("#a13-solid-choices");
    opts.forEach((k) => {
      const btn = document.createElement("button");
      btn.className = "choice-card";
      btn.setAttribute("aria-label", SOLID_NAMES[k][lang]);
      btn.innerHTML = `<svg width="76" height="76" viewBox="0 0 80 80">${SOLID_SVGS[k]}</svg>`;
      btn.addEventListener("click", () => {
        if (k === target) {
          btn.classList.add("is-correct");
          onResult(true, btn, solidWord);
        } else {
          btn.classList.add("is-wrong");
          onResult(false, btn, solidWord, () => btn.classList.remove("is-wrong"));
        }
      });
      row.appendChild(btn);
    });
    if (onSpeakText) onSpeakText(prompt);
    return;
  }

  const keys = ["circle", "square", "triangle", "rectangle"];
  const target = keys[Math.floor(Math.random() * keys.length)];
  const others = shuffle(keys.filter((k) => k !== target)).slice(0, 2);
  const opts = shuffle([target, ...others]);
  const shapeWord = SHAPE_NAMES[target][lang];
  const prompt = t("ui.shapePrompt").replace("{shape}", shapeWord);

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="choices-row" id="a13-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a13-choices");
  opts.forEach((k) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.setAttribute("aria-label", SHAPE_NAMES[k][lang]);
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

function renderCompareMeasure(container, { lang, onResult, onSpeakText }) {
  const modes = [
    {
      kind: "length",
      askLong: Math.random() < 0.5,
      promptVi: (ask) => (ask ? "Chọn băng giấy dài hơn nhé!" : "Chọn băng giấy ngắn hơn nhé!"),
      promptJa: (ask) => (ask ? "ながい ほうを えらぼう！" : "みじかい ほうを えらぼう！"),
      ansVi: (ask) => (ask ? "dài hơn" : "ngắn hơn"),
      ansJa: (ask) => (ask ? "ながい ほう" : "みじかい ほう"),
      renderA: () => `<svg width="160" height="60" viewBox="0 0 160 60"><rect x="10" y="16" width="140" height="28" rx="8" fill="#FF7EB6" stroke="#2B2A4C" stroke-width="4"/></svg>`,
      renderB: () => `<svg width="160" height="60" viewBox="0 0 160 60"><rect x="10" y="16" width="68" height="28" rx="8" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="4"/></svg>`
    },
    {
      kind: "height",
      askLong: Math.random() < 0.5,
      promptVi: (ask) => (ask ? "Chọn tháp cao hơn nhé!" : "Chọn tháp thấp hơn nhé!"),
      promptJa: (ask) => (ask ? "たかい ほうを えらぼう！" : "ひくい ほうを えらぼう！"),
      ansVi: (ask) => (ask ? "cao hơn" : "thấp hơn"),
      ansJa: (ask) => (ask ? "たかい ほう" : "ひくい ほう"),
      renderA: () => `<svg width="90" height="120" viewBox="0 0 90 120"><rect x="22" y="10" width="46" height="102" rx="8" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/></svg>`,
      renderB: () => `<svg width="90" height="120" viewBox="0 0 90 120"><rect x="22" y="64" width="46" height="48" rx="8" fill="#BFEFDD" stroke="#2B2A4C" stroke-width="4"/></svg>`
    },
    {
      kind: "weight",
      askLong: Math.random() < 0.5,
      promptVi: (ask) => (ask ? "Chọn quả nặng hơn nhé!" : "Chọn quả nhẹ hơn nhé!"),
      promptJa: (ask) => (ask ? "おもい ほうを えらぼう！" : "かるい ほうを えらぼう！"),
      ansVi: (ask) => (ask ? "nặng hơn" : "nhẹ hơn"),
      ansJa: (ask) => (ask ? "おもい ほう" : "かるい ほう"),
      renderA: () => `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="54" r="36" fill="#4E8F1F" stroke="#2B2A4C" stroke-width="4"/><path d="M50,18 Q56,8 64,14" fill="none" stroke="#2B2A4C" stroke-width="4" stroke-linecap="round"/></svg>`,
      renderB: () => `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="58" r="18" fill="#FF7B54" stroke="#2B2A4C" stroke-width="4"/><path d="M50,40 Q54,32 60,36" fill="none" stroke="#2B2A4C" stroke-width="3" stroke-linecap="round"/></svg>`
    }
  ];
  const m = modes[Math.floor(Math.random() * modes.length)];
  const prompt = lang === "ja" ? m.promptJa(m.askLong) : m.promptVi(m.askLong);
  const ansWord = lang === "ja" ? m.ansJa(m.askLong) : m.ansVi(m.askLong);

  const items = shuffle([
    { isTarget: m.askLong, html: m.renderA() },
    { isTarget: !m.askLong, html: m.renderB() }
  ]);

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="choices-row" id="a14-cmp-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a14-cmp-choices");
  items.forEach((it) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.style.cssText = "min-width:170px;min-height:130px;";
    btn.innerHTML = it.html;
    btn.addEventListener("click", () => {
      if (it.isTarget) {
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

function renderMeasureUnits(container, { lang, onResult, onSpeakText }) {
  const scenarios = [
    {
      promptVi: "Đo chiều dài quyển sách bằng gì tiện nhất?",
      promptJa: "ほんの ながさを はかるのに どれがいいかな？",
      answer: "hand",
      opts: [
        { id: "hand", vi: "gang tay", ja: "てのひら", svg: `<path d="M24,48 L24,24 A4,4 0 0,1 32,24 L32,40 L34,18 A4,4 0 0,1 42,18 L42,40 L44,20 A4,4 0 0,1 52,20 L52,42 L55,28 A4,4 0 0,1 62,30 L58,56 C56,64 48,68 38,68 C28,68 24,60 24,48 Z" fill="#FFD9B3" stroke="#2B2A4C" stroke-width="3.5" stroke-linejoin="round"/>` },
        { id: "foot", vi: "bước chân", ja: "あしあと", svg: `<ellipse cx="40" cy="44" rx="14" ry="22" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="3.5"/><circle cx="30" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="40" cy="15" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="50" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/>` },
        { id: "cup", vi: "cái cốc", ja: "コップ", svg: `<polygon points="24,18 56,18 50,64 30,64" fill="#BDEBF2" stroke="#2B2A4C" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="40" cy="18" rx="16" ry="5" fill="#E6FAFC" stroke="#2B2A4C" stroke-width="3.5"/>` }
      ]
    },
    {
      promptVi: "Đo chiều dài sân chơi bằng gì tiện nhất?",
      promptJa: "ひろばの ながさを はかるのに どれがいいかな？",
      answer: "foot",
      opts: [
        { id: "foot", vi: "bước chân", ja: "あしあと", svg: `<ellipse cx="40" cy="44" rx="14" ry="22" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="3.5"/><circle cx="30" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="40" cy="15" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="50" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/>` },
        { id: "hand", vi: "gang tay", ja: "てのひら", svg: `<path d="M24,48 L24,24 A4,4 0 0,1 32,24 L32,40 L34,18 A4,4 0 0,1 42,18 L42,40 L44,20 A4,4 0 0,1 52,20 L52,42 L55,28 A4,4 0 0,1 62,30 L58,56 C56,64 48,68 38,68 C28,68 24,60 24,48 Z" fill="#FFD9B3" stroke="#2B2A4C" stroke-width="3.5" stroke-linejoin="round"/>` },
        { id: "spoon", vi: "cái thìa", ja: "スプーン", svg: `<ellipse cx="40" cy="24" rx="11" ry="15" fill="#E8EAF0" stroke="#2B2A4C" stroke-width="3.5"/><rect x="37" y="39" width="6" height="28" rx="3" fill="#E8EAF0" stroke="#2B2A4C" stroke-width="3"/>` }
      ]
    },
    {
      promptVi: "Đo xem cái cốc đựng được nhiều nước không bằng gì?",
      promptJa: "みずの かさを はかるのに どれがいいかな？",
      answer: "cup",
      opts: [
        { id: "cup", vi: "cái cốc", ja: "コップ", svg: `<polygon points="24,18 56,18 50,64 30,64" fill="#BDEBF2" stroke="#2B2A4C" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="40" cy="18" rx="16" ry="5" fill="#E6FAFC" stroke="#2B2A4C" stroke-width="3.5"/>` },
        { id: "foot", vi: "bước chân", ja: "あしあと", svg: `<ellipse cx="40" cy="44" rx="14" ry="22" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="3.5"/><circle cx="30" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="40" cy="15" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/><circle cx="50" cy="18" r="4" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="2.5"/>` },
        { id: "block", vi: "khối gỗ", ja: "ブロック", svg: `<rect x="18" y="22" width="44" height="36" rx="8" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/>` }
      ]
    }
  ];
  const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
  const prompt = lang === "ja" ? sc.promptJa : sc.promptVi;
  const ansObj = sc.opts.find((o) => o.id === sc.answer);
  const ansWord = ansObj[lang];

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="choices-row" id="a14-unit-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a14-unit-choices");
  shuffle(sc.opts).forEach((o) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.style.cssText = "flex-direction:column;font-size:22px;padding:12px 18px;gap:6px;";
    btn.innerHTML = `<svg width="64" height="64" viewBox="0 0 80 80">${o.svg}</svg><span>${o[lang]}</span>`;
    btn.addEventListener("click", () => {
      if (o.id === sc.answer) {
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

function renderDaysSeasons(container, { lang, onResult, onSpeakText }) {
  const isSeason = Math.random() < 0.5;
  if (isSeason) {
    const target = SEASONS_DATA[Math.floor(Math.random() * SEASONS_DATA.length)];
    const others = shuffle(SEASONS_DATA.filter((s) => s.key !== target.key)).slice(0, 2);
    const opts = shuffle([target, ...others]);
    const prompt = lang === "ja" ? target.clueJa : target.clueVi;
    const ansWord = target[lang];

    container.innerHTML = `
      <div class="lesson-layout">
        <p class="prompt-text">${prompt}</p>
        <div class="choices-row" id="a14-ds-choices"></div>
      </div>
    `;
    const row = container.querySelector("#a14-ds-choices");
    opts.forEach((s) => {
      const btn = document.createElement("button");
      btn.className = "choice-card";
      btn.style.cssText = "flex-direction:column;font-size:22px;padding:12px 18px;gap:6px;";
      btn.innerHTML = `<svg width="68" height="68" viewBox="0 0 80 80">${s.svg}</svg><span>${s[lang]}</span>`;
      btn.addEventListener("click", () => {
        if (s.key === target.key) {
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

  const idx = Math.floor(Math.random() * DAYS_OF_WEEK.length);
  const nextIdx = (idx + 1) % DAYS_OF_WEEK.length;
  const curDay = DAYS_OF_WEEK[idx];
  const nextDay = DAYS_OF_WEEK[nextIdx];
  const wrongDays = shuffle(DAYS_OF_WEEK.filter((_, i) => i !== nextIdx && i !== idx)).slice(0, 2);
  const opts = shuffle([nextDay, ...wrongDays]);
  const prompt = lang === "ja"
    ? `${curDay.ja}の つぎは なにようびかな？`
    : `Sau ${curDay.vi} là thứ mấy nhỉ?`;
  const ansWord = nextDay[lang];

  container.innerHTML = `
    <div class="lesson-layout">
      <p class="prompt-text">${prompt}</p>
      <div class="big-numeral" style="font-size:44px;color:var(--primary)">${curDay[lang]} → ?</div>
      <div class="choices-row" id="a14-ds-choices"></div>
    </div>
  `;
  const row = container.querySelector("#a14-ds-choices");
  opts.forEach((d) => {
    const btn = document.createElement("button");
    btn.className = "choice-card";
    btn.style.fontSize = "24px";
    btn.textContent = d[lang];
    btn.addEventListener("click", () => {
      if (d[lang] === nextDay[lang]) {
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

export function renderA14MeasureTime(container, { topic, lang, t, onResult, onSpeakText }) {
  if (topic === "compareMeasure") {
    return renderCompareMeasure(container, { lang, onResult, onSpeakText });
  }
  if (topic === "measureUnits") {
    if (Math.random() < 0.5) {
      return renderMeasureUnits(container, { lang, onResult, onSpeakText });
    }
  }
  if (topic === "daysSeasons") {
    return renderDaysSeasons(container, { lang, onResult, onSpeakText });
  }

  if (topic === "clock" || topic === "clockHalf") {
    const isHalf = topic === "clockHalf";
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const wrong1 = hour === 12 ? 1 : hour + 1;
    const wrong2 = hour === 1 ? 12 : hour - 1;
    const opts = shuffle([hour, wrong1, wrong2]);
    const hourAngle = (hour % 12) * 30 + (isHalf ? 15 : 0);
    const minAngle = isHalf ? 180 : 0;
    const ansWord = clockWords(hour, lang, isHalf);
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
          <line x1="100" y1="100" x2="100" y2="32" stroke="#1F78C8" stroke-width="5" stroke-linecap="round" transform="rotate(${minAngle} 100 100)"/>
          <line x1="100" y1="100" x2="100" y2="50" stroke="#C93A34" stroke-width="8" stroke-linecap="round" transform="rotate(${hourAngle} 100 100)"/>
          <circle cx="100" cy="100" r="7" fill="#2B2A4C"/>
        </svg>
        <div class="choices-row" id="a14-choices"></div>
      </div>
    `;
    const row = container.querySelector("#a14-choices");
    opts.forEach((h) => {
      const label = clockWords(h, lang, isHalf);
      const wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-flex;align-items:center;gap:6px;";
      const btn = document.createElement("button");
      btn.className = "choice-card";
      btn.style.fontSize = "24px";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        if (h === hour) {
          btn.classList.add("is-correct");
          onResult(true, btn, ansWord);
        } else {
          btn.classList.add("is-wrong");
          onResult(false, btn, ansWord, () => btn.classList.remove("is-wrong"));
        }
      });
      const spkBtn = document.createElement("button");
      spkBtn.className = "btn-pill";
      spkBtn.style.cssText = "min-width:48px;min-height:48px;padding:8px 12px;font-size:20px;";
      spkBtn.setAttribute("aria-label", label);
      spkBtn.textContent = "🔊";
      spkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onSpeakText) onSpeakText(label);
      });
      wrap.append(btn, spkBtn);
      row.appendChild(wrap);
    });
    if (onSpeakText) onSpeakText(prompt);
    return;
  }

  // Measure with blocks (shuffled choices)
  const len = 2 + Math.floor(Math.random() * 5);
  const opts = shuffle([len, len - 1, len + 1]);
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
