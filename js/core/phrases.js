export const DEFAULT_SETTINGS = {
  nameVi: "Mây",
  nameJa: "マイ",
  speakVi: "",
  speakJa: "",
  gender: "f",
  lang: "vi",
  volume: 0.9,
  dailyLimit: 0,
  showSignEyes: true
};

/**
 * Sanitize child's name: NFC normalize, strip unsafe chars, enforce max length, fallback to default.
 */
export function sanitizeName(value, lang = "vi") {
  const fallback = lang === "ja" ? DEFAULT_SETTINGS.nameJa : DEFAULT_SETTINGS.nameVi;
  const maxLen = lang === "ja" ? 8 : 12;
  if (typeof value !== "string") return fallback;
  let cleaned = value.normalize("NFC").replace(/[<>&"]/g, "").trim();
  if (lang === "ja") {
    cleaned = cleaned.replace(/[^\u3040-\u309F\u30A0-\u30FFー]/g, "");
  }
  cleaned = cleaned.slice(0, maxLen).trim();
  return cleaned || fallback;
}

export function fillName(template, name) {
  return String(template).replaceAll("{name}", name);
}

/**
 * Pick a phrase index from a list, filtering "f" lines unless gender is "f",
 * and avoiding repeating lastIndex when more than one candidate remains.
 */
export function pickPhrase(list, lastIndex = -1, gender = "f", rng = Math.random) {
  if (!Array.isArray(list) || list.length === 0) {
    return { item: null, index: -1 };
  }
  const candidates = [];
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    if (entry.for === "f" && gender !== "f") continue;
    candidates.push(i);
  }
  const pool = candidates.length > 0 ? candidates : list.map((_, i) => i);
  const filtered = pool.length > 1 ? pool.filter((i) => i !== lastIndex) : pool;
  const chosenIndex = filtered[Math.floor(rng() * filtered.length)];
  return { item: list[chosenIndex], index: chosenIndex };
}

/**
 * Choose feedback tier based on lesson state.
 */
export function chooseTier(state = {}) {
  if (state.finished) return "finish";
  if (state.correct) {
    return (Number(state.streak) || 0) >= 3 ? "streak" : "praise";
  }
  const wc = Math.max(1, Number(state.wrongCount) || 1);
  if (wc === 1) return "wrong1";
  if (wc === 2) return "wrong2";
  return state.activityType === "A10" ? "wrong3cmp" : "wrong3";
}

/**
 * Compose bilingual feedback segments (current app language first).
 */
export function composeFeedback({ phrases, tier, settings = DEFAULT_SETTINGS, last = {}, answer = "" }) {
  const list = phrases?.[tier] || [];
  const gender = settings.gender || "f";
  const viPick = pickPhrase(list, last.vi ?? -1, gender);
  const jaPick = pickPhrase(list, last.ja ?? -1, gender);

  const dispVi = sanitizeName(settings.nameVi, "vi");
  const dispJa = sanitizeName(settings.nameJa, "ja");
  const spkVi = settings.speakVi ? settings.speakVi.normalize("NFC").trim() : dispVi;
  const spkJa = settings.speakJa ? settings.speakJa.normalize("NFC").trim() : dispJa;

  const ansVi = typeof answer === "object" && answer !== null ? (answer.vi ?? "") : String(answer ?? "");
  const ansJa = typeof answer === "object" && answer !== null ? (answer.ja ?? "") : String(answer ?? "");

  const formatLine = (tpl, name, ans) =>
    fillName(tpl, name).replaceAll("{answer}", ans);

  const segVi = {
    lang: "vi",
    text: formatLine(viPick.item?.vi || "", dispVi, ansVi),
    speak: formatLine(viPick.item?.vi || "", spkVi, ansVi)
  };
  const segJa = {
    lang: "ja",
    text: formatLine(jaPick.item?.ja || "", dispJa, ansJa),
    speak: formatLine(jaPick.item?.ja || "", spkJa, ansJa)
  };

  const segments = [settings.lang === "ja" ? segJa : segVi];
  return {
    segments,
    idx: { vi: viPick.index, ja: jaPick.index }
  };
}
