import * as THREE from 'three';
import { PLANETS } from '../data/planets.js';
import { CENTRAL_STAR } from '../data/galaxyLayout.js';
import { getAllWorldPositions } from '../utils/CoordinateMapper.js';
import { SolarSystem } from './SolarSystem.js';
import { Star3D } from '../objects/Star3D.js';

/**
 * Galaxy — one solar system: a central star with 8 orbiting planets.
 * Handles LOD updates and provides access to individual planet systems.
 */
export class Galaxy {
  constructor() {
    this.group = new THREE.Group();
    this.systems = {};
    this.worldPositions = getAllWorldPositions();

    // Central star — the sun of our solar system
    this.centralStar = new Star3D(CENTRAL_STAR);
    // Place at the shared center position (all planets share the same origin)
    const centerPos = this.worldPositions[PLANETS[0].id];
    this.centralStar.group.position.copy(centerPos);
    this.group.add(this.centralStar.group);

    this._createSystems();
  }

  _createSystems() {
    for (const def of PLANETS) {
      const pos = this.worldPositions[def.id]; // all the same center
      const system = new SolarSystem(def, pos);
      this.systems[def.id] = system;
      this.group.add(system.group);
    }
  }

  /** Get a SolarSystem by planet ID */
  getSystem(planetId) {
    return this.systems[planetId];
  }

  /** Get the static system center position (sun) */
  getPosition(planetId) {
    return this.worldPositions[planetId];
  }

  /** Get the live world position of the orbiting planet */
  getPlanetWorldPosition(planetId) {
    return this.systems[planetId]?.planetWorldPosition;
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
   * Update all planet systems.
   * @param {THREE.Camera} camera
   * @param {number} dt - Delta time
   * @param {number} time - Elapsed time
   */
  update(camera, dt, time) {
    const cameraPos = camera.position;

    // Update central star
    this.centralStar.update(time);

    // Update each planet system's LOD — distance measured to planet, not center
    for (const id in this.systems) {
      const system = this.systems[id];
      const distance = cameraPos.distanceTo(system.planetWorldPosition);

      // Distant planets: always update orbit (smooth motion), throttle visuals
      if (distance > 430) {
        system.group.visible = true;
        system._updateOrbit(time);
        if (Math.random() < 0.1) {
          system.updateLOD(distance, time, dt, camera);
        }
      } else {
        system.updateLOD(distance, time, dt, camera);
      }
    }
  }

  dispose() {
    this.centralStar.dispose();
    for (const id in this.systems) {
      this.systems[id].dispose();
    }
  }
}
