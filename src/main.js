import { gameState } from './game/GameState.js';
import { loadFromLocal, startAutoSave } from './storage.js';
import { initFirebase, isFirebaseConfigured } from './firebase.js';
import { onAuthReady, signInAnon, getCurrentUser } from './auth.js';
import { loadFromFirestore, startCloudSync, resolveSaveConflict } from './db.js';
import { createGame } from './game/Game.js';
import { HUDBridge } from './game/HUDBridge.js';
import { LandingScreen } from './ui/LandingScreen.js';

async function openPauseMenu() {
  const landing = new LandingScreen({ inGame: true });
  await landing.init();
  landing.show();
  const choice = await landing.waitForChoice();

  if (choice.action === 'resume') {
    return; // back to game
  } else if (choice.action === 'newgame') {
    localStorage.removeItem('astro_save');
    location.reload();
  } else if (choice.action === 'cloud' && choice.saveData) {
    // Store cloud save to local, reload to apply cleanly
    localStorage.setItem('astro_save', JSON.stringify(choice.saveData));
    location.reload();
  }
}

async function boot() {
  // ── Phase 1: Infrastructure + 3D rendering ────────────────────
  initFirebase();

  // Start auth in background — don't block Three.js from launching
  if (isFirebaseConfigured()) {
    onAuthReady(async (u) => {
      if (!u) await signInAnon();
    });
  }

  // Launch Three.js — galaxy renders immediately behind landing screen
  const game = createGame();

  // Show initial landing screen
  const landing = new LandingScreen();
  await landing.init();
  landing.show();
  const choice = await landing.waitForChoice();

  // ── Phase 2: Apply chosen action ──────────────────────────────
  let bestSave = null;

  if (choice.action === 'continue') {
    bestSave = loadFromLocal();
  } else if (choice.action === 'cloud') {
    bestSave = choice.saveData;
  } else if (choice.action === 'newgame') {
    localStorage.removeItem('astro_save');
    gameState.reset();
  }

  // Attempt cloud sync for continue/cloud paths
  if (choice.action !== 'newgame' && isFirebaseConfigured()) {
    try {
      const user = getCurrentUser();
      if (user) {
        const cloudSave = await loadFromFirestore(user.uid);
        bestSave = resolveSaveConflict(bestSave, cloudSave);
        startCloudSync(user.uid);
      }
    } catch (e) {
      console.warn('Cloud sync failed, using local save:', e);
    }
  }

  if (bestSave) {
    gameState.deserialize(bestSave);
    const offline = gameState.applyOfflineEarnings();
    if (offline && offline.earned > 0) {
      gameState._offlineEarnings = offline;
    }
  }

  startAutoSave();

  // Start HUD bridge (updates existing HTML DOM elements)
  const hud = new HUDBridge(game);

  // ── Pause menu: ESC key + menu button ─────────────────────────
  let menuOpen = false;
  const openMenu = async () => {
    if (menuOpen) return;
    menuOpen = true;
    await openPauseMenu();
    menuOpen = false;
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') openMenu();
  });

  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', openMenu);
}

boot();
