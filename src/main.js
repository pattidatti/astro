import { gameState } from './game/GameState.js';
import { loadFromLocal, startAutoSave } from './storage.js';
import { initFirebase, isFirebaseConfigured } from './firebase.js';
import { onAuthReady, signInAnon } from './auth.js';
import { loadFromFirestore, startCloudSync, resolveSaveConflict } from './db.js';
import { createGame } from './game/Game.js';
import { HUDBridge } from './game/HUDBridge.js';

async function boot() {
  // Initialize Firebase
  initFirebase();

  // Load local save
  const localSave = loadFromLocal();

  // Resolve saves (local vs cloud)
  let bestSave = localSave;

  if (isFirebaseConfigured()) {
    try {
      const user = await new Promise((resolve) => {
        onAuthReady(async (u) => {
          if (!u) u = await signInAnon();
          resolve(u);
        });
      });

      if (user) {
        const cloudSave = await loadFromFirestore(user.uid);
        bestSave = resolveSaveConflict(localSave, cloudSave);
        startCloudSync(user.uid);
      }
    } catch (e) {
      console.warn('Cloud sync failed, using local save:', e);
    }
  }

  // Apply save
  if (bestSave) {
    gameState.deserialize(bestSave);
    const offline = gameState.applyOfflineEarnings();
    if (offline && offline.earned > 0) {
      gameState._offlineEarnings = offline;
    }
  }

  startAutoSave();

  // Launch Three.js game
  const game = createGame();

  // Start HUD bridge (updates existing HTML DOM elements)
  const hud = new HUDBridge(game);
}

boot();
