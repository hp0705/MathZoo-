let activeToken = 0;
let cachedVoices = [];

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
}

export function waitForVoices(timeoutMs = 500) {
  const existing = refreshVoices();
  if (existing.length > 0) return Promise.resolve(existing);
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
  const voices = refreshVoices();
  return voices.some((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith("vi"));
}

export function cancelSpeech() {
  activeToken++;
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
      voices.find((v) => /HoaiMy|Linh|Natural/i.test(v.name)) ||
      voices[0]
    );
  }
  return voices.find((v) => /Nanami|Haruka|Ayumi|Kyoko|O-Ren/i.test(v.name)) || voices[0];
}

function speakSingle(text, lang, token) {
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
      utter.rate = 0.85;
      utter.pitch = 1.05;
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

export async function speakSegments(segments) {
  cancelSpeech();
  const token = activeToken;
  await waitForVoices(400);
  await new Promise((r) => setTimeout(r, 50));
  for (let i = 0; i < segments.length; i++) {
    if (token !== activeToken) return;
    const seg = segments[i];
    await speakSingle(seg.speak || seg.text, seg.lang, token);
    if (i < segments.length - 1 && token === activeToken) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

export function speakOne(text, lang) {
  return speakSegments([{ text, speak: text, lang }]);
}
