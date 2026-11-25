const VI_UNITS = [
  "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"
];

const JA_DIGITS = [
  "ぜろ", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"
];

const JA_TSU = [
  "", "ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ",
  "むっつ", "ななつ", "やっつ", "ここのつ", "とお"
];

const JA_KO = [
  "", "いっこ", "にこ", "さんこ", "よんこ", "ごこ",
  "ろっこ", "ななこ", "はっこ", "きゅうこ", "じゅっこ"
];

const JA_HIKI = [
  "", "いっぴき", "にひき", "さんびき", "よんひき", "ごひき",
  "ろっぴき", "ななひき", "はっぴき", "きゅうひき", "じゅっぴき"
];

/**
 * Convert an integer 0..100 to spoken words in Vietnamese or Japanese (hiragana).
 */
export function numberToWords(n, lang = "vi") {
  const num = Math.trunc(Number(n));
  if (Number.isNaN(num) || num < 0 || num > 100) {
    throw new RangeError(`numberToWords supports 0..100, got ${n}`);
  }
  if (lang === "ja") {
    if (num === 0) return JA_DIGITS[0];
    if (num === 100) return "ひゃく";
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const tensPart = tens === 0 ? "" : (tens === 1 ? "じゅう" : `${JA_DIGITS[tens]}じゅう`);
    const onesPart = ones === 0 ? "" : JA_DIGITS[ones];
    return `${tensPart}${onesPart}`;
  }

  // Vietnamese
  if (num < 10) return VI_UNITS[num];
  if (num === 100) return "một trăm";
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  if (tens === 1) {
    if (ones === 0) return "mười";
    if (ones === 5) return "mười lăm";
    return `mười ${VI_UNITS[ones]}`;
  }
  const base = `${VI_UNITS[tens]} mươi`;
  if (ones === 0) return base;
  if (ones === 1) return `${base} mốt`;
  if (ones === 4 && tens === 2) return `${base} tư`;
  if (ones === 5) return `${base} lăm`;
  return `${base} ${VI_UNITS[ones]}`;
}

/**
 * Convert a count 0..100 with a classifier (vi) or counter (ja: tsu, ko, hiki).
 */
export function countWords(n, counter = "", lang = "vi") {
  const num = Math.trunc(Number(n));
  if (lang === "ja") {
    if (num === 0) return "ぜろ";
    if (counter === "tsu") {
      return num <= 10 ? JA_TSU[num] : numberToWords(num, "ja");
    }
    if (counter === "ko") {
      if (num <= 10) return JA_KO[num];
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return `${numberToWords(tens * 10, "ja").slice(0, -4)}じゅっこ`;
      return `${numberToWords(tens * 10, "ja")}${JA_KO[ones]}`;
    }
    if (counter === "hiki") {
      if (num <= 10) return JA_HIKI[num];
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      if (ones === 0) return `${numberToWords(tens * 10, "ja").slice(0, -4)}じゅっぴき`;
      return `${numberToWords(tens * 10, "ja")}${JA_HIKI[ones]}`;
    }
    return numberToWords(num, "ja");
  }

  const word = numberToWords(num, "vi");
  return counter ? `${word} ${counter}` : word;
}
