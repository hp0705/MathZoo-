import { hashTtsKey } from "./tts-hash.js";

let activeToken = 0;
let cachedVoices = [];
let speechVolume = 0.9;
let activeAudio = null;
let manifestPromise = null;
let manifestSets = null;
let localTtsAvailable = null; // null = unknown, true = ok, false = unavailable
const blobUrlCache = new Map();

export function setSpeechVolume(vol) {
  const n = Number(vol);
  if (!Number.isNaN(n)) {
    speechVolume = Math.max(0, Math.min(1, n));
    if (activeAudio) activeAudio.volume = speechVolume;
  }
}

function loadManifest() {
  if (manifestPromise) return manifestPromise;
  if (typeof fetch !== "function" || typeof window === "undefined") {
    manifestPromise = Promise.resolve(null);
    return manifestPromise;
  }
  manifestPromise = fetch("assets/audio/manifest.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && (Array.isArray(data.vi) || Array.isArray(data.ja))) {
        manifestSets = {
          vi: new Set(data.vi || []),
          ja: new Set(data.ja || [])
        };
      }
      return manifestSets;
    })
    .catch(() => null);
  return manifestPromise;
}

function refreshVoices() {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) cachedVoices = list;
    }
  } catch {
    // ignore
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  if ("onvoiceschanged" in window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  }
  loadManifest();
}

export async function waitForVoices(timeoutMs = 500) {
  await loadManifest();
  const existing = refreshVoices();
  if (existing.length > 0) return existing;
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve([]);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(refreshVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
    setTimeout(finish, timeoutMs);
  });
}

export function hasViVoice() {
  if (manifestSets?.vi?.size > 0 || localTtsAvailable === true) return true;
  const voices = refreshVoices();
  return voices.some((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith("vi"));
}

function stopActiveAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.src = "";
    } catch {
      // ignore
    }
    activeAudio = null;
  }
}

export function cancelSpeech() {
  activeToken++;
  stopActiveAudio();
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

function pickVoice(langCode) {
  const prefix = langCode === "ja" ? "ja" : "vi";
  const voices = refreshVoices().filter(
    (v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(prefix)
  );
  if (voices.length === 0) return null;
  if (prefix === "vi") {
    return (
      voices.find((v) => /Online.*Natural|Natural.*Online/i.test(v.name)) ||
      voices.find((v) => /HoaiMy|Linh|Natural|Google/i.test(v.name)) ||
      voices[0]
    );
  }
  return (
    voices.find((v) => /Online.*Natural|Natural.*Online/i.test(v.name)) ||
    voices.find((v) => /Nanami|Aoi|Mayu|Kyoko|O-Ren|Google/i.test(v.name)) ||
    voices[0]
  );
}

function playAudioUrl(url, token) {
  return new Promise((resolve) => {
    if (token !== activeToken || typeof Audio === "undefined") {
      resolve(false);
      return;
    }
    stopActiveAudio();
    const audio = new Audio(url);
    audio.volume = speechVolume;
    activeAudio = audio;

    let settled = false;
    let timer = null;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (activeAudio === audio) activeAudio = null;
      resolve(ok);
    };

    audio.addEventListener("ended", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    timer = setTimeout(() => finish(true), 12000);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => finish(false));
    }
  });
}

async function tryNeuralAudio(text, lang, token) {
  if (typeof window === "undefined" || typeof Audio === "undefined") return false;
  const clean = String(text || "").normalize("NFC").trim();
  if (!clean) return true;

  const langCode = lang === "ja" ? "ja" : "vi";
  const hash = hashTtsKey(langCode, clean);
  const sets = await loadManifest();
  if (token !== activeToken) return true;

  if (sets && sets[langCode]?.has(hash)) {
    const ok = await playAudioUrl(`assets/audio/${langCode}/${hash}.mp3`, token);
    if (ok) return true;
  }

  if (localTtsAvailable === false || typeof fetch !== "function") return false;

  const cacheKey = `${langCode}|${hash}`;
  if (blobUrlCache.has(cacheKey)) {
    return playAudioUrl(blobUrlCache.get(cacheKey), token);
  }

  try {
    const res = await fetch(
      `/api/tts?lang=${langCode}&text=${encodeURIComponent(clean)}`
    );
    if (token !== activeToken) return true;
    if (!res.ok) {
      if (res.status === 404) localTtsAvailable = false;
      return false;
    }
    localTtsAvailable = true;
    const blob = await res.blob();
    if (!blob || blob.size === 0) return false;
    const url = URL.createObjectURL(blob);
    if (blobUrlCache.size >= 100) {
      const oldestKey = blobUrlCache.keys().next().value;
      URL.revokeObjectURL(blobUrlCache.get(oldestKey));
      blobUrlCache.delete(oldestKey);
    }
    blobUrlCache.set(cacheKey, url);
    return playAudioUrl(url, token);
  } catch {
    return false;
  }
}

function speakBrowser(text, lang, token) {
  return new Promise((resolve) => {
    if (!text || token !== activeToken) return resolve();
    try {
      const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
      if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
        setTimeout(resolve, 250);
        return;
      }
      const voice = pickVoice(lang);
      if (!voice) {
        // Never fall back to another language's voice (e.g. Japanese reading Vietnamese)
        setTimeout(resolve, 250);
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === "ja" ? "ja-JP" : "vi-VN";
      utter.rate = 0.95;
      utter.pitch = 1.02;
      utter.volume = speechVolume;
      utter.voice = voice;

      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      utter.onend = done;
      utter.onerror = done;
      setTimeout(done, Math.min(5000, Math.max(900, text.length * 120)));
      synth.speak(utter);
    } catch {
      setTimeout(resolve, 250);
    }
  });
}

async function speakSingle(text, lang, token) {
  if (!text || token !== activeToken) return;
  const played = await tryNeuralAudio(text, lang, token);
  if (!played && token === activeToken) {
    await speakBrowser(text, lang, token);
  }
}

function splitSentences(text) {
  const clean = String(text || "").normalize("NFC").trim();
  if (!clean) return [];
  const parts = clean.match(/[^.!?。！？]+[.!?。！？]*/g);
  if (!parts || parts.length <= 1) return [clean];
  return parts.map((p) => p.trim()).filter(Boolean);
}

export async function speakSegments(segments) {
  cancelSpeech();
  const token = activeToken;
  await waitForVoices(400);
  await new Promise((r) => setTimeout(r, 40));
  const sets = await loadManifest();
  const expanded = [];
  for (const seg of segments) {
    const raw = String(seg.speak || seg.text || "").normalize("NFC").trim();
    if (!raw) continue;
    const langCode = seg.lang === "ja" ? "ja" : "vi";
    const fullHash = hashTtsKey(langCode, raw);
    if (sets && sets[langCode]?.has(fullHash)) {
      expanded.push({ text: raw, lang: langCode });
      continue;
    }
    const parts = splitSentences(raw);
    if (parts.length > 1 && sets && parts.every((p) => sets[langCode]?.has(hashTtsKey(langCode, p)))) {
      for (const part of parts) {
        expanded.push({ text: part, lang: langCode });
      }
    } else if (raw.length > 120 && parts.length > 1) {
      for (const part of parts) {
        expanded.push({ text: part, lang: langCode });
      }
    } else {
      expanded.push({ text: raw, lang: langCode });
    }
  }
  for (let i = 0; i < expanded.length; i++) {
    if (token !== activeToken) return;
    const seg = expanded[i];
    await speakSingle(seg.text, seg.lang, token);
    if (i < expanded.length - 1 && token === activeToken) {
      await new Promise((r) => setTimeout(r, 80));
    }
  }
}

export function speakOne(text, lang) {
  return speakSegments([{ text, speak: text, lang }]);
}
