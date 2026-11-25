export function renderMascotStar(size = 64) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true">
    <polygon points="40,6 49,27 72,29 54,44 60,67 40,54 20,67 26,44 8,29 31,27"
      fill="#FFC83D" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="33" cy="38" r="3" fill="#2B2A4C"/>
    <circle cx="47" cy="38" r="3" fill="#2B2A4C"/>
    <path d="M34 46 Q40 52 46 46" fill="none" stroke="#2B2A4C" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

export function renderAnimal(stage, size = 72) {
  const colors = [
    "", "#FFE08A", "#BFEFDD", "#CFE8FF", "#E3D7FF",
    "#FFD0E0", "#FFD9B3", "#D5F2B5", "#BDEBF2", "#E8EAF0"
  ];
  const bg = colors[stage] || "#FFE08A";
  const ears = stage === 1
    ? `<ellipse cx="26" cy="18" rx="7" ry="16" fill="#fff" stroke="#2B2A4C" stroke-width="4"/><ellipse cx="54" cy="18" rx="7" ry="16" fill="#fff" stroke="#2B2A4C" stroke-width="4"/>`
    : stage === 3 || stage === 4
    ? `<polygon points="18,32 24,10 36,26" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/><polygon points="62,32 56,10 44,26" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/>`
    : `<circle cx="22" cy="24" r="10" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/><circle cx="58" cy="24" r="10" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true">
    ${ears}
    <circle cx="40" cy="46" r="24" fill="${bg}" stroke="#2B2A4C" stroke-width="4"/>
    <circle cx="32" cy="42" r="3.5" fill="#2B2A4C"/>
    <circle cx="48" cy="42" r="3.5" fill="#2B2A4C"/>
    <ellipse cx="40" cy="50" rx="5" ry="3.5" fill="#2B2A4C"/>
    <path d="M33 56 Q40 62 47 56" fill="none" stroke="#2B2A4C" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

export function renderObject(stage, size = 56) {
  if (stage === 7) {
    return `<span style="font-size:${Math.round(size * 0.85)}px;line-height:1;display:inline-flex;align-items:center;justify-content:center" aria-hidden="true">🍌</span>`;
  }
  const shapes = {
    1: `<path d="M40 16 C48 16 52 28 40 60 C28 28 32 16 40 16Z" fill="#FF8C42" stroke="#2B2A4C" stroke-width="4"/><path d="M35 16 L32 8 M40 16 L40 6 M45 16 L48 8" stroke="#18835F" stroke-width="4" stroke-linecap="round"/>`,
    2: `<circle cx="40" cy="42" r="20" fill="#E85D4A" stroke="#2B2A4C" stroke-width="4"/><path d="M40 22 L42 12" stroke="#2B2A4C" stroke-width="4" stroke-linecap="round"/><ellipse cx="48" cy="16" rx="7" ry="4" fill="#18835F" stroke="#2B2A4C" stroke-width="3"/>`,
    3: `<ellipse cx="38" cy="40" rx="20" ry="13" fill="#4DA8DA" stroke="#2B2A4C" stroke-width="4"/><polygon points="56,40 70,28 70,52" fill="#4DA8DA" stroke="#2B2A4C" stroke-width="4"/><circle cx="28" cy="37" r="3" fill="#2B2A4C"/>`,
    4: `<circle cx="40" cy="40" r="22" fill="#FF9F43" stroke="#2B2A4C" stroke-width="4"/><path d="M22 30 Q40 42 58 30 M22 50 Q40 38 58 50" fill="none" stroke="#2B2A4C" stroke-width="3"/>`,
    5: `<ellipse cx="40" cy="34" rx="18" ry="22" fill="#FF7EB6" stroke="#2B2A4C" stroke-width="4"/><path d="M40 56 Q36 66 42 74" fill="none" stroke="#2B2A4C" stroke-width="3" stroke-linecap="round"/>`,
    6: `<circle cx="40" cy="42" r="14" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4"/><ellipse cx="26" cy="32" rx="10" ry="6" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="3"/><ellipse cx="54" cy="32" rx="10" ry="6" fill="#CFE8FF" stroke="#2B2A4C" stroke-width="3"/>`,
    7: `<path d="M22 50 Q38 64 58 24 Q44 42 22 50Z" fill="#FFC83D" stroke="#2B2A4C" stroke-width="4" stroke-linejoin="round"/>`,
    8: `<rect x="20" y="26" width="40" height="28" rx="14" fill="#6B4BC8" stroke="#2B2A4C" stroke-width="4"/><path d="M12 32 L20 40 L12 48 Z M68 32 L60 40 L68 48 Z" fill="#FFD0E0" stroke="#2B2A4C" stroke-width="3"/>`,
    9: `<rect x="24" y="20" width="32" height="38" rx="12" fill="#FF8C42" stroke="#2B2A4C" stroke-width="4"/><line x1="24" y1="34" x2="56" y2="34" stroke="#2B2A4C" stroke-width="3"/><line x1="24" y1="46" x2="56" y2="46" stroke="#2B2A4C" stroke-width="3"/>`
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true">${shapes[stage] || shapes[1]}</svg>`;
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
