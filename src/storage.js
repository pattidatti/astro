import { gameState } from './game/GameState.js';

let currentSaveSlot = 'slot_1';

export function setCurrentSaveSlot(slot) {
  currentSaveSlot = slot;
}

export function getCurrentSaveSlot() {
  return currentSaveSlot;
}

function getSaveKey(slot) {
  return `astro_save_${slot}`;
}

export function migrateOldSaves() {
  const oldSave = localStorage.getItem('astro_save');
  if (oldSave && !localStorage.getItem('astro_save_slot_1')) {
    localStorage.setItem('astro_save_slot_1', oldSave);
  }
}

export function saveToLocal(slot = currentSaveSlot) {
  try {
    const data = gameState.serialize();
    localStorage.setItem(getSaveKey(slot), JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function loadFromLocal(slot = currentSaveSlot) {
  try {
    const raw = localStorage.getItem(getSaveKey(slot));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
  return null;
}

export function hasLocalSave(slot = currentSaveSlot) {
  return !!localStorage.getItem(getSaveKey(slot));
}

export function deleteLocalSave(slot) {
  localStorage.removeItem(getSaveKey(slot));
}

export function getAllLocalSaves() {
  migrateOldSaves();
  const saves = {};
  for (const slot of ['slot_1', 'slot_2', 'slot_3']) {
    try {
      const raw = localStorage.getItem(getSaveKey(slot));
      saves[slot] = raw ? JSON.parse(raw) : null;
    } catch (e) {
      saves[slot] = null;
    }
  }
  return saves;
}

let autoSaveInterval = null;

export function startAutoSave(intervalMs = 10000) {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  autoSaveInterval = setInterval(saveToLocal, intervalMs);

  // Save on significant actions
  gameState.on('baseUpgraded',    saveToLocal);
  gameState.on('robotHired',      saveToLocal);
  gameState.on('robotUpgraded',   saveToLocal);
  gameState.on('planetColonized', saveToLocal);
  gameState.on('routeAdded',      saveToLocal);
  gameState.on('routeRemoved',    saveToLocal);

  // Save on combat events
  gameState.on('attackStarted',     saveToLocal);
  gameState.on('attackEnded',       saveToLocal);
  gameState.on('planetFell',        saveToLocal);
  gameState.on('defenseBuilt',      saveToLocal);
  gameState.on('defenseUpgraded',   saveToLocal);
  gameState.on('planetRecolonized', saveToLocal);

  // Save on tab close / visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveToLocal();
  });
}
