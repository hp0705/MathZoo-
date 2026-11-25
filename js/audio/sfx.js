import { noteForCount } from "../core/counting-notes.js";

let ctx = null;
let masterGain = null;
let volume = 0.9;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function unlockAudio() {
  ensureCtx();
}

export function setMasterVolume(v) {
  volume = Math.max(0, Math.min(1, Number(v) || 0));
  if (masterGain && ctx) {
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  }
}

function playTone(freq, duration = 0.25, type = "sine", gainVal = 0.28, delay = 0) {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const now = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(gainVal, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playCountNote(n) {
  const { freq, bell } = noteForCount(n);
  playTone(freq, 0.25, "sine", 0.28, 0);
  if (bell) {
    playTone(freq * 2, 0.35, "triangle", 0.14, 0.03);
  }
}

export function playReceiveTing() {
  playTone(523.25, 0.14, "sine", 0.22, 0);
  playTone(783.99, 0.22, "sine", 0.24, 0.09);
}

export function playGiveWhoosh() {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);
  g.gain.setValueAtTime(0.18, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.26);
}

export function playTotalChime() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    playTone(f, 0.28, "triangle", 0.2, i * 0.08);
  });
}

export function playWrongBoing() {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.linearRampToValueAtTime(175, now + 0.35);
  g.gain.setValueAtTime(0.22, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.4);
}

export function playRewardFanfare() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
    playTone(f, 0.35, "triangle", 0.22, i * 0.1);
  });
}

export function playPairBlip(index = 1) {
  const { freq } = noteForCount(index);
  playTone(freq, 0.15, "sine", 0.22, 0);
}

export function playSeesawTilt() {
  playTone(392, 0.16, "sine", 0.2, 0);
  playTone(523.25, 0.22, "sine", 0.22, 0.1);
}
