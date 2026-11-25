/**
 * Compute star rating (1..3) from first-try correctness results. Never uses time.
 */
export function gradeLesson(results) {
  const correctCount = results.filter(Boolean).length;
  if (correctCount >= 9) return 3;
  if (correctCount >= 7) return 2;
  return 1;
}

/**
 * True when two sessions on different dates each have >= 80% accuracy.
 */
export function isMastered(sessions) {
  if (!Array.isArray(sessions) || sessions.length < 2) return false;
  const qualifyingDates = new Set();
  for (const s of sessions) {
    if (!s || !s.date || !s.total) continue;
    if (s.correct / s.total >= 0.8) {
      qualifyingDates.add(s.date);
    }
  }
  return qualifyingDates.size >= 2;
}

/**
 * Switch to concrete real-object mode if the last two answers were wrong.
 */
export function nextMode(history) {
  if (!Array.isArray(history) || history.length < 2) return "normal";
  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  return last === false && prev === false ? "concrete" : "normal";
}

/**
 * Handle a wrong answer without decreasing stars/score or ending the lesson.
 */
export function onWrong(state = {}) {
  const wrongCount = Math.max(1, Number(state.wrongCount) || 1);
  const isA10 = state.activityType === "A10";
  let tier = "wrong1";
  if (wrongCount === 2) tier = "wrong2";
  else if (wrongCount >= 3) tier = isA10 ? "wrong3cmp" : "wrong3";

  return {
    tier,
    hintKey: isA10 ? "hint.pair" : "hint.recount",
    mode: wrongCount >= 2 ? "concrete" : "normal"
  };
}
