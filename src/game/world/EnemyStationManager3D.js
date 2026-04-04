import * as THREE from 'three';
import { gameState } from '../GameState.js';
import { EnemyStation3D } from '../objects/EnemyStation3D.js';
import { FREE_FLOATING_BASES } from '../data/galaxyLayout.js';
import { ENEMY_STATION_DEFS } from '../data/enemyStations.js';

/**
 * Manages the 3 free-floating enemy station visuals.
 * Planet-anchored stations are managed by SolarSystem.
 */
export class EnemyStationManager3D {
  constructor(scene) {
    this._scene = scene;
    this._group = new THREE.Group();
    scene.add(this._group);

    this._activeStations = new Map(); // stationId → EnemyStation3D

    // Event listeners (arrow functions to preserve 'this')
    this._onStateLoaded = () => this._restore();
    this._onDestroyed = ({ stationId }) => this._removeStation(stationId);

    gameState.on('stateLoaded',            this._onStateLoaded);
    gameState.on('enemyStationDestroyed', this._onDestroyed);

    this._restore();
  }

  /**
   * Restore free-floating stations from gameState.
   */
  _restore() {
    // Clear old
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

      // Initialise phase
      station3D.setPhase(stState.phase);
    }
  }

  /**
   * Remove a station when it's destroyed.
   */
  _removeStation(stationId) {
    const station3D = this._activeStations.get(stationId);
    if (!station3D) return;
    this._group.remove(station3D.group);
    station3D.dispose();
    this._activeStations.delete(stationId);
  }

  /**
   * Update orbital positions and visuals for free-floating stations.
   */
  update(dt, time, camera) {
    for (const base of FREE_FLOATING_BASES) {
      const station3D = this._activeStations.get(base.id);
      if (!station3D) continue;

      // Orbit around central star (in world space)
      const angle = base.orbitAngle + base.orbitSpeed * time;
      const r = base.orbitRadius;
      const incl = base.inclination;
      station3D.group.position.set(
        Math.cos(angle) * r,
        Math.sin(incl) * Math.sin(angle) * r * 0.3,
        Math.sin(angle) * r
      );

      station3D.update(time, dt, camera);
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
    gameState.off('stateLoaded',            this._onStateLoaded);
    gameState.off('enemyStationDestroyed', this._onDestroyed);
    for (const station3D of this._activeStations.values()) {
      station3D.dispose();
    }
    this._activeStations.clear();
    this._scene.remove(this._group);
  }
}
