import { numberToWords } from "./number-words.js";

const VI_ORDINALS = [
  "", "thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm",
  "thứ sáu", "thứ bảy", "thứ tám", "thứ chín", "thứ mười"
];

const JA_ORDINALS = [
  "", "いちばんめ", "にばんめ", "さんばんめ", "よんばんめ", "ごばんめ",
  "ろくばんめ", "ななばんめ", "はちばんめ", "きゅうばんめ", "じゅうばんめ"
];

const JA_HOURS = [
  "", "いちじ", "にじ", "さんじ", "よじ", "ごじ", "ろくじ",
  "しちじ", "はちじ", "くじ", "じゅうじ", "じゅういちじ", "じゅうにじ"
];

/**
 * Convert an ordinal position 1..10 to spoken words.
 */
export function ordinalWords(n, lang = "vi") {
  const num = Math.trunc(Number(n));
  if (num < 1 || num > 10) {
    throw new RangeError(`ordinalWords supports 1..10, got ${n}`);
  }
  return lang === "ja" ? JA_ORDINALS[num] : VI_ORDINALS[num];
}

/**
 * Convert a whole hour 1..12 to spoken words.
 * Japanese uses exceptions よじ (4), しちじ (7), くじ (9).
 */
export function clockWords(hour, lang = "vi", half = false) {
  const h = Math.trunc(Number(hour));
  if (h < 1 || h > 12) {
    throw new RangeError(`clockWords supports 1..12, got ${hour}`);
  }
  if (lang === "ja") return half ? `${JA_HOURS[h]}はん` : JA_HOURS[h];
  const base = `${numberToWords(h, "vi")} giờ`;
  return half ? `${base} rưỡi` : base;
}
