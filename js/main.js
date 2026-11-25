import { loadProgress, saveProgress, resetProgress } from "./core/storage.js";
import { getChapter } from "./core/story.js";
import { unlockAudio, setMasterVolume } from "./audio/sfx.js";
import { speakOne, cancelSpeech, waitForVoices, hasViVoice, setSpeechVolume } from "./audio/speak.js";
import { renderHomeMap } from "./ui/home-map.js";
import { renderStoryIntro } from "./ui/story-intro.js";
import { startLessonRunner } from "./ui/lesson.js";
import { renderReward } from "./ui/reward.js";
import { openStickerBook } from "./ui/sticker-book.js";
import { openParentModal } from "./ui/parent.js";

async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

async function boot() {
  const [lessonsData, storyData, phrasesData, viI18n, jaI18n] = await Promise.all([
    loadJson("data/lessons.json"),
    loadJson("data/story.json"),
    loadJson("data/phrases.json"),
    loadJson("i18n/vi.json"),
    loadJson("i18n/ja.json")
  ]);

  const i18n = { vi: viI18n, ja: jaI18n };
  let progress = loadProgress();
  setMasterVolume(progress.settings.volume ?? 0.9);
  setSpeechVolume(progress.settings.volume ?? 0.9);

  const appEl = document.getElementById("app");
  const screenEl = document.getElementById("screen");
  const modalRoot = document.getElementById("modal-root");
  const btnBack = document.getElementById("btn-back");
  const btnReplay = document.getElementById("btn-replay");
  const btnLang = document.getElementById("btn-lang");
  const btnStickers = document.getElementById("btn-stickers");
  const btnParent = document.getElementById("btn-parent");
  const brandTitle = document.getElementById("brand-title");
  const stickerCountEl = document.getElementById("sticker-count");
  const topProgress = document.getElementById("top-progress");
  const bannerEl = document.getElementById("feedback-banner");

  let lastSpoken = null;

  const t = (key) => {
    const lang = progress.settings.lang === "ja" ? "ja" : "vi";
    const parts = key.split(".");
    let cur = i18n[lang];
    for (const p of parts) cur = cur?.[p];
    return typeof cur === "string" ? cur : key;
  };

  const syncHeader = () => {
    brandTitle.textContent = t("ui.appTitle");
    stickerCountEl.textContent = String((progress.stickers || []).length);
    btnLang.textContent = progress.settings.lang === "ja" ? "日本語 → VI" : "VI → 日本語";
    document.documentElement.lang = progress.settings.lang;
  };

  const showMap = () => {
    cancelSpeech();
    appEl.dataset.stage = "1";
    btnBack.hidden = true;
    btnReplay.hidden = true;
    btnLang.hidden = false;
    topProgress.hidden = true;
    bannerEl.hidden = true;
    syncHeader();
    renderHomeMap(screenEl, {
      lessons: lessonsData.lessons,
      storyData,
      progress,
      t,
      lang: progress.settings.lang,
      onSelectLesson: openLessonIntro
    });
  };

  const openLessonIntro = (lesson) => {
    appEl.dataset.stage = String(lesson.stage);
    btnBack.hidden = false;
    btnReplay.hidden = false;
    btnLang.hidden = true;
    btnBack.onclick = showMap;
    const line = renderStoryIntro(screenEl, {
      lesson,
      storyData,
      settings: progress.settings,
      t,
      onSpeak: (l) => {
        lastSpoken = l;
        speakOne(l.speak, l.lang);
      },
      onStart: () => runLesson(lesson)
    });
    lastSpoken = line;
  };

  const runLesson = (lesson) => {
    btnBack.onclick = showMap;
    btnLang.hidden = true;
    startLessonRunner(screenEl, {
      lesson,
      storyData,
      phrasesData,
      settings: progress.settings,
      t,
      topProgress,
      bannerEl,
      onSpeakPrompt: (text) => {
        const lang = progress.settings.lang === "ja" ? "ja" : "vi";
        lastSpoken = { speak: text, text, lang };
        speakOne(text, lang);
      },
      onFinish: (stars) => {
        const prev = progress.stars[lesson.id] || 0;
        progress.stars[lesson.id] = Math.max(prev, stars);
        let newSticker = false;
        let finale = null;
        if (lesson.storyBeat === "close") {
          if (!progress.stickers.includes(lesson.stage)) {
            progress.stickers.push(lesson.stage);
            newSticker = true;
          }
          if (lesson.stage === 8 && !progress.medal) {
            progress.medal = true;
            finale = storyData.finale;
          }
        }
        saveProgress(progress);
        syncHeader();
        const ch = getChapter(storyData, lesson.stage);
        renderReward(screenEl, {
          lesson,
          stars,
          newSticker,
          finale,
          chapter: ch,
          settings: progress.settings,
          t,
          onReplay: () => runLesson(lesson),
          onMap: showMap
        });
      }
    });
  };

  window.addEventListener("pointerdown", unlockAudio, { once: true });

  btnReplay.addEventListener("click", () => {
    if (lastSpoken) speakOne(lastSpoken.speak, lastSpoken.lang);
  });

  btnLang.addEventListener("click", () => {
    progress.settings.lang = progress.settings.lang === "ja" ? "vi" : "ja";
    saveProgress(progress);
    showMap();
  });

  btnStickers.addEventListener("click", () => {
    openStickerBook(modalRoot, { storyData, progress, lang: progress.settings.lang, t });
  });

  // 3-second hold for Parent Area
  let holdTimer = null;
  let holdStart = 0;
  const ring = btnParent.querySelector(".hold-ring");
  const startHold = () => {
    holdStart = Date.now();
    ring.style.transition = "transform 3s linear";
    ring.style.transform = "scaleX(1)";
    holdTimer = setTimeout(() => {
      holdTimer = null;
      ring.style.transition = "none";
      ring.style.transform = "scaleX(0)";
      openParentModal(modalRoot, {
        progress,
        t,
        onUpdate: (nextSettings) => {
          progress.settings = { ...progress.settings, ...nextSettings };
          setMasterVolume(progress.settings.volume ?? 0.9);
          setSpeechVolume(progress.settings.volume ?? 0.9);
          saveProgress(progress);
          showMap();
        },
        onReset: () => {
          progress = resetProgress();
          showMap();
        }
      });
    }, 3000);
  };
  const cancelHold = (e) => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
      if (e?.type === "pointerup" && Date.now() - holdStart < 2800) {
        bannerEl.textContent = progress.settings.lang === "ja"
          ? "ほごしゃコーナーは ⚙ を 3びょう おしつづけてね"
          : "Giữ nút ⚙ trong 3 giây để mở Góc Phụ Huynh";
        bannerEl.hidden = false;
        setTimeout(() => { bannerEl.hidden = true; }, 2500);
      }
    }
    ring.style.transition = "none";
    ring.style.transform = "scaleX(0)";
  };
  btnParent.addEventListener("pointerdown", startHold);
  btnParent.addEventListener("pointerup", cancelHold);
  btnParent.addEventListener("pointerleave", cancelHold);
  btnParent.addEventListener("pointercancel", cancelHold);

  showMap();

  waitForVoices(800).then(() => {
    if (progress.settings.lang === "vi" && !hasViVoice()) {
      bannerEl.textContent = "Trình duyệt này chưa có giọng đọc tiếng Việt (vi-VN). Hãy mở bằng Microsoft Edge hoặc iPad Safari để nghe giọng Việt nhé!";
      bannerEl.hidden = false;
      setTimeout(() => { bannerEl.hidden = true; }, 6000);
    }
  });
}

boot();
