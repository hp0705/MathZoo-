import { DEFAULT_SETTINGS } from "./phrases.js";

export const STORAGE_KEY = "mathzoo.v1";

export function createInitialProgress() {
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS },
    stars: {},
    stickers: [],
    sessions: {},
    medal: false,
    playToday: { date: "", minutes: 0 }
  };
}

let memoryFallback = createInitialProgress();

function getDefaultStorage() {
  try {
    return typeof globalThis !== "undefined" && globalThis.localStorage
      ? globalThis.localStorage
      : null;
  } catch {
    return null;
  }
}

/**
 * Load progress safely from localStorage, falling back to in-memory state on error.
 */
export function loadProgress(storage = getDefaultStorage()) {
  try {
    if (!storage) return structuredClone(memoryFallback);
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(memoryFallback);
    const parsed = JSON.parse(raw);
    const base = createInitialProgress();
    memoryFallback = {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) }
    };
    return structuredClone(memoryFallback);
  } catch {
    return structuredClone(memoryFallback);
  }
}

/**
 * Save progress safely to localStorage, keeping in-memory state if storage throws.
 */
export function saveProgress(state, storage = getDefaultStorage()) {
  memoryFallback = structuredClone(state);
  try {
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(memoryFallback));
    }
    return true;
  } catch {
    return false;
  }
}

export function resetProgress(storage = getDefaultStorage()) {
  const fresh = createInitialProgress();
  saveProgress(fresh, storage);
  return fresh;
}
