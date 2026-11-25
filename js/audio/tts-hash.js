/**
 * Deterministic 64-bit FNV-1a hex hash for (lang, text).
 * Shared between browser (js/audio/speak.js) and build/server scripts.
 */
export function hashTtsKey(lang, text) {
  const input = `${lang === "ja" ? "ja" : "vi"}|${String(text || "").normalize("NFC").trim()}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c & 0xff;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= (c >> 8) & 0xff;
    h2 = Math.imul(h2, 0x01000193);
  }
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}
