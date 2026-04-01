import { gameState } from './game/GameState.js';

const SAVE_KEY = 'astro_save';

export function saveToLocal() {
  try {
    const data = gameState.serialize();
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function loadFromLocal() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
  return null;
}

export function hasLocalSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

let autoSaveInterval = null;

export function startAutoSave(intervalMs = 10000) {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  autoSaveInterval = setInterval(saveToLocal, intervalMs);

  // Save on significant actions
  gameState.on('baseUpgraded',  saveToLocal);
  gameState.on('robotHired',    saveToLocal);
  gameState.on('robotUpgraded', saveToLocal);
  gameState.on('planetColonized', saveToLocal);
  gameState.on('routeAdded',    saveToLocal);
  gameState.on('routeRemoved',  saveToLocal);

  // Save on tab close / visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveToLocal();
  });
}
