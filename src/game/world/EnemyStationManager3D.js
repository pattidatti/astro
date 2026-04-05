import * as THREE from 'three';
import { gameState } from '../GameState.js';
import { EnemyStation3D } from '../objects/EnemyStation3D.js';
import { WreckageField3D } from './WreckageField3D.js';
import { FREE_FLOATING_BASES } from '../data/galaxyLayout.js';
import { ENEMY_STATION_DEFS } from '../data/enemyStations.js';

/**
 * Manages the 3 free-floating enemy station visuals.
 * Planet-anchored stations are managed by SolarSystem.
 *
 * Also owns all WreckageField3D instances that spawn when stations are destroyed.
 * Listens for 'scavengerCollecting' to trigger tractor-beam VFX on the right wreckage.
 */
export class EnemyStationManager3D {
  /**
   * @param {THREE.Scene} scene
   * @param {object|null} combatEffects - CombatEffects instance (passed from Game.js)
   */
  constructor(scene, combatEffects = null) {
    this._scene         = scene;
    this._combatEffects = combatEffects;
    this._group         = new THREE.Group();
    scene.add(this._group);

    this._activeStations = new Map(); // stationId → EnemyStation3D
    this._wreckageFields = new Map(); // wreckageId → WreckageField3D

    // Sprite spawn throttle: only spawn a resource sprite ~once per second per wreckage
    this._spriteTimers = new Map(); // wreckageId → secondsSinceLastSprite

    // Event listeners (arrow functions to preserve 'this')
    this._onStateLoaded  = () => this._restore();
    this._onDestroyed    = ({ stationId }) => this._removeStation(stationId);
    this._onScavenging   = (ev) => this._onScavengerCollecting(ev);

    gameState.on('stateLoaded',           this._onStateLoaded);
    gameState.on('enemyStationDestroyed', this._onDestroyed);
    gameState.on('scavengerCollecting',   this._onScavenging);

    this._restore();
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  /**
   * Restore free-floating stations from gameState.
   */
  _restore() {
    // Clear old stations
    for (const [, station3D] of this._activeStations) {
      this._group.remove(station3D.group);
      station3D.dispose();
    }
    this._activeStations.clear();

    // Create new for each free-floating base
    for (const base of FREE_FLOATING_BASES) {
      const stState = gameState.enemyStations?.find(s => s.id === base.id);
      if (!stState || stState.cleared) continue;

      const def = ENEMY_STATION_DEFS.find(d => d.id === base.id);
      if (!def) continue;

      const station3D = new EnemyStation3D(def, { isFreefloating: true });
      this._group.add(station3D.group);
      this._activeStations.set(base.id, station3D);

      station3D.setPhase(stState.phase);
    }
  }

  /**
   * Remove a station when destroyed and spawn a wreckage field visual.
   */
  _removeStation(stationId) {
    const station3D = this._activeStations.get(stationId);
    if (!station3D) return;

    // Capture world position before removing
    const worldPos = station3D.group.position.clone();

    this._group.remove(station3D.group);
    station3D.dispose();
    this._activeStations.delete(stationId);

    // Find the matching wreckage data entry (created by GameState.destroyEnemyStation)
    const wf = gameState.wreckageFields.find(w => w.stationId === stationId);
    if (wf) {
      if (!wf.resources) wf.resources = { ore: 500, crystal: 200 }; // initial scavengeable amounts
      wf.position = worldPos; // BUG-A: set position so scavenger can find wreckage
      const wreckage3D = new WreckageField3D(wf, this._scene, worldPos, this._combatEffects);
      this._wreckageFields.set(wf.id, wreckage3D);
      this._spriteTimers.set(wf.id, 0);
    }
  }

  /**
   * Handle a scavenging tick: fire amber tractor beam + occasional resource sprite.
   */
  _onScavengerCollecting({ wreckageId, oreGain, crystGain, fleetPos }) {
    const field = this._wreckageFields.get(wreckageId);
    if (!field) return;

    // Tractor beam VFX (every frame while collecting)
    if (fleetPos) {
      const fp = new THREE.Vector3(fleetPos.x, fleetPos.y, fleetPos.z);
      field.tractorBeam(fp);
    }

    // Floating resource sprite — throttled to ~1 per second per wreckage
    const elapsed = (this._spriteTimers.get(wreckageId) ?? 0);
    if (oreGain > 0 && elapsed >= 1.0) {
      field.spawnResourceSprite(Math.round(oreGain * 10) / 10, 'ore');
      this._spriteTimers.set(wreckageId, 0);
    } else if (crystGain > 0 && elapsed >= 1.0) {
      field.spawnResourceSprite(Math.round(crystGain * 10) / 10, 'crystal');
      this._spriteTimers.set(wreckageId, 0);
    }
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Update orbital positions and visuals for free-floating stations + wreckage fields.
   */
  update(dt, time, camera) {
    for (const base of FREE_FLOATING_BASES) {
      const station3D = this._activeStations.get(base.id);
      if (!station3D) continue;

      const angle = base.orbitAngle + base.orbitSpeed * time;
      const r     = base.orbitRadius;
      const incl  = base.inclination;
      station3D.group.position.set(
        Math.cos(angle) * r,
        Math.sin(incl) * Math.sin(angle) * r * 0.3,
        Math.sin(angle) * r
      );

      station3D.update(time, dt, camera);
    }

    // Tick sprite timers
    for (const [id, t] of this._spriteTimers) {
      this._spriteTimers.set(id, t + dt);
    }

    // Tick wreckage fields (animation + lifetime)
    for (const [id, field] of this._wreckageFields) {
      field.update(dt);
      if (field._disposed) this._wreckageFields.delete(id);
    }
  }

  /**
   * Return click targets for all active free-floating stations.
   */
  getClickTargets() {
    const targets = [];
    for (const [, station3D] of this._activeStations) {
      targets.push({
        mesh: station3D.hitboxMesh,
        stationId: station3D.stationId,
      });
    }
    return targets;
  }

  /**
   * Return current world position of a free-floating station (or null).
   */
  getStationWorldPosition(stationId) {
    const st3D = this._activeStations.get(stationId);
    return st3D ? st3D.group.position : null;
  }

  dispose() {
    gameState.off('stateLoaded',           this._onStateLoaded);
    gameState.off('enemyStationDestroyed', this._onDestroyed);
    gameState.off('scavengerCollecting',   this._onScavenging);
    for (const station3D of this._activeStations.values()) station3D.dispose();
    this._activeStations.clear();
    for (const field of this._wreckageFields.values()) field.dispose();
    this._wreckageFields.clear();
    this._scene.remove(this._group);
  }
}
