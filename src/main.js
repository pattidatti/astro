import { gameState } from './game/GameState.js';
import { AudioManager } from './game/audio/AudioManager.js';
import { loadFromLocal, startAutoSave } from './storage.js';
import { initFirebase, isFirebaseConfigured } from './firebase.js';
import { onAuthReady, signInAnon, getCurrentUser } from './auth.js';
import { loadFromFirestore, startCloudSync, resolveSaveConflict } from './db.js';
import { createGame } from './game/Game.js';
import { HUDBridge } from './game/HUDBridge.js';
import { LandingScreen } from './ui/LandingScreen.js';
import { ProductionSystem } from './game/systems/ProductionSystem.js';
import { RouteSystem } from './game/systems/RouteSystem.js';
import { Tutorial } from './game/tutorial/Tutorial.js';

async function openPauseMenu() {
  const landing = new LandingScreen({ inGame: true });
  await landing.init();
  landing.show();
  const choice = await landing.waitForChoice();

  if (choice.action === 'resume') {
    return;
  } else if (choice.action === 'newgame') {
    localStorage.removeItem('astro_save');
    location.reload();
  } else if (choice.action === 'cloud' && choice.saveData) {
    localStorage.setItem('astro_save', JSON.stringify(choice.saveData));
    location.reload();
  }
}

async function boot() {
  // ── Phase 1: Infrastructure + 3D rendering ────────────────────
  AudioManager.init().catch(e => console.warn('[AudioManager] init failed:', e));
  initFirebase();

  if (isFirebaseConfigured()) {
    onAuthReady(async (u) => {
      if (!u) await signInAnon();
    });
  }

  // Launch Three.js immediately — galaxy renders behind landing screen
  const game = createGame();

  // Show landing screen
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
  }

  startAutoSave();

  // ── Phase 3: Game systems ──────────────────────────────────────
  new ProductionSystem(game.animationLoop);

  const routeSystem = new RouteSystem(game.animationLoop);
  routeSystem.reconstructActiveShips();

  // ── Pause menu setup (defined before UI so onMenu callback is valid) ──
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

  // ── Phase 4: UI ───────────────────────────────────────────────
  new HUDBridge(game, { onMenu: openMenu });

  if (gameState.tutorialStep >= 0) {
    new Tutorial(game);
  }
}

boot();
