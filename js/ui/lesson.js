import { composeFeedback, chooseTier } from "../core/phrases.js";
import { onWrong, gradeLesson } from "../core/mastery.js";
import { getChapter } from "../core/story.js";
import { speakSegments, speakOne } from "../audio/speak.js";
import { playTotalChime, playWrongBoing, playRewardFanfare } from "../audio/sfx.js";
import { renderA1, renderA2, renderA3 } from "./lesson-a123.js";
import { renderGiveReceive } from "./scene-give-receive.js";
import { renderCompareScene } from "./scene-compare.js";
import { renderA5Split, renderA6TenFrame, renderA7Match, renderA9Board, renderA11Ordinal } from "./activities-extra.js";
import { renderTracing } from "./tracing.js";
import { renderA12Pattern, renderA13ShapeOrPos, renderA14MeasureTime } from "./activities-plaza.js";

export function startLessonRunner(container, {
  lesson, storyData, phrasesData, settings, t, topProgress, bannerEl, onSpeakPrompt, onFinish
}) {
  const chapter = getChapter(storyData, lesson.stage);
  const getLang = () => (settings.lang === "ja" ? "ja" : "vi");
  let actIdx = 0;
  let streak = 0;
  const firstTryResults = [];
  const lastIdx = { vi: -1, ja: -1 };
  let locked = false;

  const showBanner = () => {
    // Keep banner hidden during activities so it never covers answers; ✓/✕ animations show on cards
    bannerEl.hidden = true;
  };

  const renderDots = () => {
    topProgress.hidden = false;
    topProgress.innerHTML = lesson.activities.map((_, i) => {
      const cls = i < actIdx ? "done" : i === actIdx ? "active" : "";
      return `<span class="progress-dot ${cls}"></span>`;
    }).join("");
  };

  const advance = () => {
    locked = false;
    bannerEl.hidden = true;
    actIdx++;
    if (actIdx >= lesson.activities.length) {
      topProgress.hidden = true;
      const padded = [...firstTryResults];
      while (padded.length < 10) padded.push(true);
      const stars = gradeLesson(padded.slice(0, 10));
      playRewardFanfare();
      const fb = composeFeedback({ phrases: phrasesData, tier: "finish", settings, last: lastIdx });
      showBanner(fb.segments[0].text);
      speakSegments(fb.segments);
      onFinish(stars);
      return;
    }
    renderCurrent();
  };

  const renderCurrent = () => {
    renderDots();
    const act = lesson.activities[actIdx];
    let wrongCount = 0;

    const handleComplete = (firstTry = true, answerSpeech = "") => {
      if (locked) return;
      locked = true;
      firstTryResults.push(firstTry);
      streak++;
      playTotalChime();
      const tier = chooseTier({ correct: true, streak });
      const fb = composeFeedback({ phrases: phrasesData, tier, settings, last: lastIdx });
      lastIdx.vi = fb.idx.vi;
      lastIdx.ja = fb.idx.ja;
      showBanner(fb.segments[0].text);
      const ansText = typeof answerSpeech === "object" && answerSpeech !== null
        ? (answerSpeech[lang] || "")
        : String(answerSpeech || "");
      const segments = ansText
        ? [{ text: ansText, speak: ansText, lang }, ...fb.segments]
        : fb.segments;
      speakSegments(segments).then(() => setTimeout(advance, 350));
    };

    const handleResult = (isCorrect, _btn, answerText, onRetry, answerSpeech = answerText) => {
      if (locked) return;
      if (isCorrect) {
        handleComplete(wrongCount === 0, answerSpeech);
        return;
      }
      wrongCount++;
      streak = 0;
      playWrongBoing();
      const info = onWrong({ wrongCount, activityType: act.type });
      const fb = composeFeedback({
        phrases: phrasesData,
        tier: info.tier,
        settings,
        last: lastIdx,
        answer: answerText
      });
      lastIdx.vi = fb.idx.vi;
      lastIdx.ja = fb.idx.ja;
      showBanner(fb.segments[0].text);
      if (wrongCount >= 3) {
        locked = true;
        firstTryResults.push(false);
        speakSegments(fb.segments).then(() => setTimeout(advance, 500));
      } else {
        speakSegments(fb.segments);
        if (onRetry) setTimeout(onRetry, 500);
      }
    };

    const lang = getLang();
    const ctx = {
      stage: lesson.stage,
      activity: act,
      max: act.max,
      chapter,
      settings,
      lang,
      t,
      onComplete: handleComplete,
      onResult: handleResult,
      onSpeakText: (txt) => {
        if (onSpeakPrompt) onSpeakPrompt(txt);
        else speakOne(txt, lang);
      }
    };

    if (act.type === "A1") renderA1(container, ctx);
    else if (act.type === "A2") renderA2(container, ctx);
    else if (act.type === "A3") renderA3(container, ctx);
    else if (act.type === "A4") renderGiveReceive(container, ctx);
    else if (act.type === "A5") renderA5Split(container, ctx);
    else if (act.type === "A6") renderA6TenFrame(container, ctx);
    else if (act.type === "A7") renderA7Match(container, ctx);
    else if (act.type === "A8") renderTracing(container, { digit: act.digit ?? 1, t, onComplete: handleComplete, onSpeakText: ctx.onSpeakText });
    else if (act.type === "A9") renderA9Board(container, ctx);
    else if (act.type === "A10") renderCompareScene(container, ctx);
    else if (act.type === "A11") renderA11Ordinal(container, ctx);
    else if (act.type === "A12") renderA12Pattern(container, ctx);
    else if (act.type === "A13") renderA13ShapeOrPos(container, { topic: act.topic, lang: getLang(), t, onResult: handleResult, onSpeakText: ctx.onSpeakText });
    else if (act.type === "A14") renderA14MeasureTime(container, { topic: act.topic, lang: getLang(), t, onResult: handleResult, onSpeakText: ctx.onSpeakText });
    else renderA2(container, ctx);
  };

  renderCurrent();
}
