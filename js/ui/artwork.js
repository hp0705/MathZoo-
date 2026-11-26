const ANIMAL_FILES = [
  "",
  "assets/img/animals/rabbit.webp",
  "assets/img/animals/bear.webp",
  "assets/img/animals/cat.webp",
  "assets/img/animals/fox.webp",
  "assets/img/animals/elephant.webp",
  "assets/img/animals/owl.webp",
  "assets/img/animals/monkey.webp",
  "assets/img/animals/penguin.webp",
  "assets/img/animals/lion.webp"
];

const OBJECT_FILES = [
  "",
  "assets/img/objects/carrot.webp",
  "assets/img/objects/apple.webp",
  "assets/img/objects/fish.webp",
  "assets/img/objects/ball.webp",
  "assets/img/objects/balloon.webp",
  "assets/img/objects/firefly.webp",
  "assets/img/objects/banana.webp",
  "assets/img/objects/candy.webp",
  "assets/img/objects/lantern.webp"
];

const STAR_FILE = "assets/img/objects/star.webp";

let preloaded = false;
export function preloadArtwork() {
  if (preloaded || typeof Image === "undefined") return;
  preloaded = true;
  const urls = [...ANIMAL_FILES.slice(1), ...OBJECT_FILES.slice(1), STAR_FILE];
  for (const url of urls) {
    const img = new Image();
    img.src = url;
  }
}

function fallbackSvg(kind, stage, size) {
  if (kind === "star") {
    return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true"><polygon points="40,6 49,27 72,29 54,44 60,67 40,54 20,67 26,44 8,29 31,27" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/></svg>`;
  }
  const colors = ["", "#FFE08A", "#BFEFDD", "#CFE8FF", "#E3D7FF", "#FFD0E0", "#FFD9B3", "#D5F2B5", "#BDEBF2", "#E8EAF0"];
  const bg = colors[stage] || "#FFE08A";
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="28" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/></svg>`;
}

if (typeof window !== "undefined") {
  window.__mzImgFallback = (imgEl, kind, stage, size) => {
    console.warn("[artwork] Missing image, using SVG fallback:", imgEl.getAttribute("src"));
    const wrap = document.createElement("span");
    wrap.innerHTML = fallbackSvg(kind, stage, size);
    imgEl.replaceWith(wrap.firstElementChild);
  };
}

function renderImg(src, kind, stage, size) {
  return `<img src="${src}" width="${size}" height="${size}" alt="" aria-hidden="true" draggable="false" style="width:${size}px;height:${size}px;object-fit:contain;display:block;pointer-events:none;" onerror="window.__mzImgFallback && window.__mzImgFallback(this,'${kind}',${stage},${size})">`;
}

export function renderMascotStar(size = 64) {
  return renderImg(STAR_FILE, "star", 0, size);
}

export function renderAnimal(stage, size = 72) {
  const src = ANIMAL_FILES[stage] || ANIMAL_FILES[1];
  return renderImg(src, "animal", stage, size);
}

export function renderObject(stage, size = 56) {
  const src = OBJECT_FILES[stage] || OBJECT_FILES[1];
  return renderImg(src, "object", stage, size);
}

export function renderComparisonSign(sign, eyes = false, size = 96) {
  const path = sign === ">"
    ? `<path d="M22 20 L74 48 L22 76" fill="none" stroke="#6B4BC8" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`
    : sign === "<"
    ? `<path d="M74 20 L22 48 L74 76" fill="none" stroke="#6B4BC8" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<line x1="20" y1="36" x2="76" y2="36" stroke="#6B4BC8" stroke-width="14" stroke-linecap="round"/><line x1="20" y1="60" x2="76" y2="60" stroke="#6B4BC8" stroke-width="14" stroke-linecap="round"/>`;
  const eyeDots = eyes && (sign === ">" || sign === "<")
    ? `<circle cx="48" cy="24" r="5" fill="#2B2A4C"/><circle cx="48" cy="72" r="5" fill="#2B2A4C"/>`
    : "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" aria-hidden="true">${path}${eyeDots}</svg>`;
}
