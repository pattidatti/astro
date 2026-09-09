import { gameState } from './game/GameState.js';
import { AudioManager } from './game/audio/AudioManager.js';
import { MusicManager } from './game/audio/MusicManager.js';
import { loadFromLocal, startAutoSave, setCurrentSaveSlot, getCurrentSaveSlot } from './storage.js';
import { initFirebase, isFirebaseConfigured } from './firebase.js';
import { onAuthReady, getCurrentUser, handleAuthRedirect, isRedirectInProgress } from './auth.js';
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
import { EnemyStationSystem } from './game/systems/EnemyStationSystem.js';
import { Tutorial } from './game/tutorial/Tutorial.js';
import { keybindings, PRIORITY } from './game/input/Keybindings.js';
import { showFatalError, isWebGLAvailable } from './ui/FatalError.js';

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
  // No in-game shortcut should fire while the landing screen is up.
  keybindings.suspend();

  // ── Session State ───────────────────────────────────────────────
  const activeSlot = sessionStorage.getItem('astro_active_slot') || 'slot_1';
  setCurrentSaveSlot(activeSlot);

  // ── Phase 1: Infrastructure + 3D rendering ────────────────────
  AudioManager.init()
    .then(() => MusicManager.init(AudioManager._ctx, AudioManager.getMusicGainNode()))
    .catch(e => console.warn('[AudioManager] init failed:', e));
  initFirebase();

  if (isFirebaseConfigured()) {
    console.log('[Boot] Initializing Auth sequence...');
    // Check if we just returned from an auth redirect
    await handleAuthRedirect();

    onAuthReady(async (u) => {
      if (u) {
        console.log('[Boot] Auth ready. User:', u.email || 'Anonymous', `(${u.uid})`);
      } else {
        console.log('[Boot] Auth ready. No user logged in (Offline Mode).');
      }
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

  const roamingFleetSystem = new RoamingFleetSystem(
    game.animationLoop,
    threatSystem,
    (fleetId) => game.galaxy?.roamingFleetManager?.getFleetWorldPosition(fleetId) ?? null,
    (stationId) => {
      // Support both planet-anchored and free-floating stations
      const st = gameState.enemyStations?.find(s => s.id === stationId);
      if (!st) return null;
      if (st.anchorPlanet) return game.galaxy?.getPlanetWorldPosition(st.anchorPlanet) ?? null;
      return game.galaxy?.enemyStationManager?.getStationWorldPosition(stationId) ?? null;
    }
  );
  roamingFleetSystem.reconstructFleets();

  // Phase 3: EnemyStationSystem — state machine, awakening, snitch mechanic, distress flare
  const enemyStationSystem = new EnemyStationSystem(
    game.animationLoop,
    roamingFleetSystem,
    threatSystem,
    game.galaxy
  );
  enemyStationSystem.reconstructStations();

  const routeSystem = new RouteSystem(game.animationLoop, roamingFleetSystem);
  routeSystem.reconstructActiveShips();

  const fleetMovementSystem = new FleetMovementSystem(game.animationLoop);
  fleetMovementSystem.setGalaxy(game.galaxy);

  // Wire RoamingFleetSystem into Galaxy so route lanes can show blocked state
  game.galaxy.setRoamingFleetSystem(roamingFleetSystem);

  const supplySystem = new SupplySystem(game.animationLoop);

  const fleetCombatSystem = new FleetCombatSystem(
    game.animationLoop,
    (fleetId) => game.galaxy?.roamingFleetManager?.getFleetWorldPosition(fleetId) ?? null,
    supplySystem,
    (stationId) => game.galaxy?.enemyStationManager?.getStationWorldPosition(stationId) ?? null
  );
  fleetCombatSystem.reconstructEngagements();
  fleetCombatSystem.reconstructSieges();

  // Track play time
  game.animationLoop.onUpdate((dt) => { gameState.stats.playTimeSeconds += dt; });

  // Tab-bytte: stopp/start loop (visibilitychange er pålitelig)
  document.addEventListener('visibilitychange', () => {
    const pauseOnSwitch = localStorage.getItem('astro_pause_on_tab_switch') === 'true';
    if (document.visibilityState === 'hidden') {
      if (pauseOnSwitch) game.animationLoop.stop();
    } else if (!menuOpen) {
      game.animationLoop.start();
    }
  });

  // CSS-animasjoner: poll fokus-tilstand hvert 200ms
  // (blur/focus-events er upålitelige ved app-bytte — in-frame hasFocus()-sjekk håndterer GPU)
  setInterval(() => {
    const pauseOnSwitch = localStorage.getItem('astro_pause_on_tab_switch') === 'true';
    const inactive = pauseOnSwitch && (document.hidden || !document.hasFocus());
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
    keybindings.suspend();
    game.animationLoop.stop();
    document.body.classList.add('game-paused');
    try {
      await openPauseMenu();
    } finally {
      document.body.classList.remove('game-paused');
      game.animationLoop.start();
      keybindings.resume();
      menuOpen = false;
    }
  };

  // Escape reaches this only when no modal is open — the router closes the
  // topmost overlay first (see game/input/Keybindings.js).
  keybindings.bind('Escape', () => openMenu(), { priority: PRIORITY.UI });

  // ── Phase 4: UI ───────────────────────────────────────────────
  new HUDBridge(game, { onMenu: openMenu });

  // Always constructed: the tutorial is chaptered now, and the military chapter
  // can trigger long after the economy one finished — including for saves that
  // completed the tutorial before that chapter existed.
  new Tutorial(game);

  keybindings.resume();
}

/**
 * Boot with a visible failure mode.
 *
 * `boot()` is one long await chain across audio, auth, WebGL, save migration and
 * nine game systems. Any throw in there used to reject silently and leave a black
 * page, so every failure looked identical to the player. Now it names itself.
 */
async function main() {
  if (!isWebGLAvailable()) {
    showFatalError({
      title: 'GRAPHICS UNAVAILABLE',
      message: 'Astro Harvest needs WebGL, and this browser could not provide it. '
             + 'Try a different browser, or enable hardware acceleration in your browser settings.',
      canReload: true,
    });
    return;
  }

  try {
    await boot();
  } catch (err) {
    console.error('[Boot] Fatal error during startup:', err);
    showFatalError({
      title: 'STARTUP FAILED',
      message: 'The galaxy could not be initialised. If this keeps happening, the save '
             + 'in this slot may be corrupt — starting a fresh slot will clear it.',
      detail: err,
      canReload: true,
      canResetSave: true,
      slot: sessionStorage.getItem('astro_active_slot') || 'slot_1',
    });
  }
}

main();
