import Phaser from 'phaser';
import { PLANETS } from '../data/planets.js';
import { generatePlanetTexture } from '../objects/PlanetRenderer.js';
import { gameState } from '../GameState.js';
import { loadFromLocal, startAutoSave } from '../../storage.js';
import { initFirebase, isFirebaseConfigured } from '../../firebase.js';
import { onAuthReady, signInAnon } from '../../auth.js';
import { loadFromFirestore, startCloudSync, resolveSaveConflict } from '../../db.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    // Pre-generate planet textures
    const size = Math.min(this.scale.width, this.scale.height) * 0.36;
    for (const planet of PLANETS) {
      generatePlanetTexture(this, planet, size);
    }

    // Initialize Firebase (will warn if not configured)
    initFirebase();

    // Load local save immediately
    const localSave = loadFromLocal();

    // Start auth flow
    if (isFirebaseConfigured()) {
      onAuthReady(async (user) => {
        if (!user) {
          user = await signInAnon();
        }

        let bestSave = localSave;

        if (user) {
          const cloudSave = await loadFromFirestore(user.uid);
          bestSave = resolveSaveConflict(localSave, cloudSave);
          startCloudSync(user.uid);
        }

        this.applySaveAndStart(bestSave);
      });
    } else {
      // Offline-only mode
      this.applySaveAndStart(localSave);
    }
  }

  applySaveAndStart(saveData) {
    if (saveData) {
      gameState.deserialize(saveData);
      const offline = gameState.applyOfflineEarnings();
      if (offline && offline.earned > 0) {
        // Toast will be shown by HUD scene
        gameState._offlineEarnings = offline;
      }
    }

    startAutoSave();

    this.scene.start('Planet');
    this.scene.launch('HUD');
  }
}
