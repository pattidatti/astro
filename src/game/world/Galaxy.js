import * as THREE from 'three';
import { PLANETS } from '../data/planets.js';
import { HYPERLANES } from '../data/galaxyLayout.js';
import { getAllWorldPositions } from '../utils/CoordinateMapper.js';
import { SolarSystem } from './SolarSystem.js';
import { Hyperlane } from './Hyperlane.js';
import { gameState } from '../GameState.js';

/**
 * Galaxy manages all SolarSystems and Hyperlanes in the 3D scene.
 * Handles LOD updates and provides access to individual systems.
 */
export class Galaxy {
  constructor() {
    this.group = new THREE.Group();
    this.systems = {};
    this.hyperlanes = [];
    this.worldPositions = getAllWorldPositions();

    this._createSystems();
    this._createHyperlanes();
  }

  _createSystems() {
    for (const def of PLANETS) {
      const pos = this.worldPositions[def.id];
      const system = new SolarSystem(def, pos);
      this.systems[def.id] = system;
      this.group.add(system.group);
    }
  }

  _createHyperlanes() {
    for (const [fromId, toId] of HYPERLANES) {
      const fromPos = this.worldPositions[fromId];
      const toPos = this.worldPositions[toId];
      if (fromPos && toPos) {
        const lane = new Hyperlane(fromPos, toPos, fromId, toId);
        this.hyperlanes.push(lane);
        this.group.add(lane.group);
      }
    }
  }

  /** Get a SolarSystem by planet ID */
  getSystem(planetId) {
    return this.systems[planetId];
  }

  /** Get the world position of a planet */
  getPosition(planetId) {
    return this.worldPositions[planetId];
  }

  /** Get all planet click targets for InputManager registration */
  getClickTargets() {
    const targets = [];
    for (const id in this.systems) {
      targets.push({
        mesh: this.systems[id].clickTarget,
        planetId: id,
        system: this.systems[id],
      });
    }
    return targets;
  }

  /**
   * Update all systems and hyperlanes.
   * @param {THREE.Camera} camera
   * @param {number} dt - Delta time
   * @param {number} time - Elapsed time
   */
  update(camera, dt, time) {
    const cameraPos = camera.position;

    // Update each solar system's LOD
    for (const id in this.systems) {
      const system = this.systems[id];
      const distance = cameraPos.distanceTo(system.worldPosition);

      // Skip full updates for very distant systems (performance)
      if (distance > 300) {
        system.group.visible = true; // still visible as a dot
        // Only update at reduced frequency (every ~10 frames)
        if (Math.random() < 0.1) {
          system.updateLOD(distance, time, dt, camera);
        }
      } else {
        system.updateLOD(distance, time, dt, camera);
      }
    }

    // Update hyperlanes
    const owned = gameState.ownedPlanets;
    for (const lane of this.hyperlanes) {
      // Approximate distance check using one endpoint
      const laneDist = cameraPos.distanceTo(lane.fromPos);
      if (laneDist < 250) {
        const bothOwned = owned.includes(lane.fromId) && owned.includes(lane.toId);
        lane.update(dt, bothOwned);
      }
    }
  }

  dispose() {
    for (const id in this.systems) {
      this.systems[id].dispose();
    }
    for (const lane of this.hyperlanes) {
      lane.dispose();
    }
  }
}
