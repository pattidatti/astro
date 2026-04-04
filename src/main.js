import { gameState } from './game/GameState.js';
import { AudioManager } from './game/audio/AudioManager.js';
import { MusicManager } from './game/audio/MusicManager.js';
import { loadFromLocal, startAutoSave, setCurrentSaveSlot, getCurrentSaveSlot } from './storage.js';
import { initFirebase, isFirebaseConfigured } from './firebase.js';
import { onAuthReady, signInAnon, getCurrentUser } from './auth.js';
import { loadFromFirestore, startCloudSync, resolveSaveConflict } from './db.js';
import { createGame } from './game/Game.js';
import { HUDBridge } from './game/HUDBridge.js';
import { LandingScreen } from './ui/LandingScreen.js';
import { ProductionSystem } from './game/systems/ProductionSystem.js';
import { RouteSystem } from './game/systems/RouteSystem.js';
import { ThreatSystem } from './game/systems/ThreatSystem.js';
import { CombatSystem } from './game/systems/CombatSystem.js';
import { RoamingFleetSystem } from './game/systems/RoamingFleetSystem.js';
import { FleetMovementSystem } from './game/systems/FleetMovementSystem.js';
import { FleetCombatSystem } from './game/systems/FleetCombatSystem.js';
import { SupplySystem } from './game/systems/SupplySystem.js';
import { Tutorial } from './game/tutorial/Tutorial.js';

async function openPauseMenu() {
  const landing = new LandingScreen({ inGame: true });
  await landing.init();
  landing.show();
  const choice = await landing.waitForChoice();

  if (choice.action === 'resume') {
    return;
  } else if (choice.action === 'load') {
    sessionStorage.setItem('astro_active_slot', choice.slot);
    location.reload();
  } else if (choice.action === 'newgame') {
    sessionStorage.setItem('astro_force_newgame', '1');
    sessionStorage.setItem('astro_active_slot', choice.slot);
    location.reload();
  }
}

async function boot() {
  // ── Session State ───────────────────────────────────────────────
  const activeSlot = sessionStorage.getItem('astro_active_slot') || 'slot_1';
  setCurrentSaveSlot(activeSlot);

  // ── Phase 1: Infrastructure + 3D rendering ────────────────────
  AudioManager.init()
    .then(() => MusicManager.init(AudioManager._ctx, AudioManager.getMusicGainNode()))
    .catch(e => console.warn('[AudioManager] init failed:', e));
  initFirebase();

  if (isFirebaseConfigured()) {
    onAuthReady(async (u) => {
      if (!u) await signInAnon();
    });
  }

  // Launch Three.js immediately — galaxy renders behind landing screen
  const game = createGame();

  // Check if we're returning from a pause-menu "New Game" reload
  let choice;
  const forceNew = sessionStorage.getItem('astro_force_newgame');
  if (forceNew) {
    sessionStorage.removeItem('astro_force_newgame');
    choice = { action: 'newgame', slot: activeSlot };
  } else {
    const landing = new LandingScreen();
    await landing.init();
    landing.show();
    choice = await landing.waitForChoice();
    if (choice.slot) {
      setCurrentSaveSlot(choice.slot);
      sessionStorage.setItem('astro_active_slot', choice.slot);
    }
  }

  // ── Phase 2: Apply chosen action ──────────────────────────────
  let bestSave = null;

  if (choice.action === 'continue' || choice.action === 'load') {
    bestSave = loadFromLocal();
  } else if (choice.action === 'newgame') {
    localStorage.removeItem(`astro_save_${choice.slot || activeSlot}`);
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

  AudioManager.unlock();
  MusicManager.start();

  // ── Phase 3: Game systems ──────────────────────────────────────
  new ProductionSystem(game.animationLoop);

  const threatSystem = new ThreatSystem(game.animationLoop);
  const combatSystem = new CombatSystem(game.animationLoop, threatSystem);
  combatSystem.reconstructAttacks();

  const roamingFleetSystem = new RoamingFleetSystem(game.animationLoop, threatSystem);
  roamingFleetSystem.reconstructFleets();

  const routeSystem = new RouteSystem(game.animationLoop, roamingFleetSystem);
  routeSystem.reconstructActiveShips();

  new FleetMovementSystem(game.animationLoop);

  const supplySystem = new SupplySystem(game.animationLoop);

  const fleetCombatSystem = new FleetCombatSystem(
    game.animationLoop,
    (fleetId) => game.galaxy?.roamingFleetManager?.getFleetWorldPosition(fleetId) ?? null,
    supplySystem
  );
  fleetCombatSystem.reconstructEngagements();

  // Track play time
  game.animationLoop.onUpdate((dt) => { gameState.stats.playTimeSeconds += dt; });

  // Tab-bytte: stopp/start loop (visibilitychange er pålitelig)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      game.animationLoop.stop();
    } else if (!menuOpen) {
      game.animationLoop.start();
    }
  });

  // CSS-animasjoner: poll fokus-tilstand hvert 200ms
  // (blur/focus-events er upålitelige ved app-bytte — in-frame hasFocus()-sjekk håndterer GPU)
  setInterval(() => {
    const inactive = document.hidden || !document.hasFocus();
    if (inactive) {
      document.body.classList.add('game-paused');
    } else if (!menuOpen) {
      document.body.classList.remove('game-paused');
    }
  }, 200);

  // ── Pause menu setup (defined before UI so onMenu callback is valid) ──
  let menuOpen = false;
  const openMenu = async () => {
    if (menuOpen) return;
    menuOpen = true;
    game.animationLoop.stop();
    document.body.classList.add('game-paused');
    await openPauseMenu();
    document.body.classList.remove('game-paused');
    game.animationLoop.start();
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
