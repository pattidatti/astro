import * as THREE from 'three';
import { PLANETS } from '../data/planets.js';
import { CENTRAL_STAR } from '../data/galaxyLayout.js';
import { getAllWorldPositions } from '../utils/CoordinateMapper.js';
import { SolarSystem } from './SolarSystem.js';
import { Star3D } from '../objects/Star3D.js';
import { NebulaVolume } from '../effects/NebulaVolume.js';
import { PatrolDot3D } from '../objects/PatrolDot3D.js';
import { RouteLane3D } from './RouteLane3D.js';
import { gameState } from '../GameState.js';

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
    this._createCosmicNebulas();
    this._createPatrolDots();
    this._createThreatIndicators();
    this._initRouteLanes();
  }

  _createCosmicNebulas() {
    const configs = [
      { pos: [ 280,  60, -150], size: 380, c: ['#05011a', '#2211bb', '#004466'] },  // electric blue-purple
      { pos: [-320, -80,  200], size: 320, c: ['#1a0005', '#881133', '#001833'] },  // deep crimson
      { pos: [ 180, 120,  380], size: 420, c: ['#040010', '#331199', '#002244'] },  // royal blue
      { pos: [-250,  30, -400], size: 350, c: ['#080010', '#220077', '#441188'] },  // violet
      { pos: [ 500, -60,  100], size: 300, c: ['#100004', '#662211', '#001122'] },  // dark ember
      { pos: [-180, 100, -280], size: 260, c: ['#000a18', '#113377', '#003322'] },  // navy teal
    ];

    this._cosmicNebulas = configs.map(({ pos, size, c }) => {
      const neb = new NebulaVolume(c[0], c[1], c[2], size);
      neb.mesh.position.set(...pos);
      neb.material.uniforms.uOpacity.value = 1.0;
      this.group.add(neb.mesh);
      return neb;
    });
  }

  _createSystems() {
    for (const def of PLANETS) {
      const pos = this.worldPositions[def.id]; // all the same center
      const system = new SolarSystem(def, pos);
      this.systems[def.id] = system;
      this.group.add(system.group);
    }
  }

  /**
   * Wire a delivery burst callback on all systems.
   * Called from Game.js after clickFeedback is constructed.
   * @param {(worldPos: THREE.Vector3, amount: number) => void} fn
   */
  setDeliveryCallback(fn) {
    for (const id in this.systems) {
      this.systems[id].setDeliveryCallback(fn);
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

  /** Get all station click targets for InputManager registration */
  getStationClickTargets() {
    return Object.entries(this.systems).map(([id, sys]) => ({
      mesh: sys.stationClickTarget,
      planetId: id,
      system: sys,
    }));
  }

  _createPatrolDots() {
    this._patrolDots = [];
    for (let i = 0; i < 8; i++) {
      const dot = new PatrolDot3D();
      this.group.add(dot.mesh);
      this._patrolDots.push(dot);
    }
    this._activePatrolDots = new Map(); // patrolId → PatrolDot3D
  }

  _initRouteLanes() {
    this._routeLanes = new Map(); // routeId → RouteLane3D

    // Create lanes for any routes already in state (loaded save)
    for (const route of gameState.routes) {
      this._routeLanes.set(route.id, new RouteLane3D(route, this.group));
    }

    gameState.on('routeAdded', (route) => {
      if (!this._routeLanes.has(route.id)) {
        this._routeLanes.set(route.id, new RouteLane3D(route, this.group));
      }
    });

    gameState.on('routeRemoved', (routeId) => {
      const lane = this._routeLanes.get(routeId);
      if (lane) {
        lane.dispose();
        this._routeLanes.delete(routeId);
      }
    });
  }

  _createThreatIndicators() {
    this._threatRings = {};
    for (const def of PLANETS) {
      if (def.id === 'xerion') continue;
      const geo = new THREE.RingGeometry(12, 13, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff3333,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      this._threatRings[def.id] = { mesh: ring, mat };
      this.group.add(ring);
    }
  }

  _updatePatrolDots(time) {
    const patrols = gameState.hyperlanePatrols;

    // Deactivate dots for removed patrols
    for (const [pid, dot] of this._activePatrolDots) {
      if (!patrols.some(p => p.id === pid)) {
        dot.deactivate();
        this._activePatrolDots.delete(pid);
      }
    }

    // Activate/update dots for active patrols
    for (const patrol of patrols) {
      let dot = this._activePatrolDots.get(patrol.id);
      if (!dot) {
        // Find a free dot
        dot = this._patrolDots.find(d => !d.mesh.visible);
        if (!dot) continue;
        this._activePatrolDots.set(patrol.id, dot);
      }

      // Interpolate position along the hyperlane
      const [a, b] = patrol.lane;
      const posA = this.getPlanetWorldPosition(a);
      const posB = this.getPlanetWorldPosition(b);
      if (posA && posB) {
        const pos = new THREE.Vector3().lerpVectors(posA, posB, patrol.position);
        pos.y += 3; // Slightly above the lane
        dot.update(time, pos);
        if (!dot.mesh.visible) dot.activate(pos);
      }
    }
  }

  _updateThreatIndicators(time) {
    for (const [planetId, indicator] of Object.entries(this._threatRings)) {
      const isUnderAttack = gameState.isUnderAttack(planetId);
      const pos = this.getPlanetWorldPosition(planetId);

      if (pos) {
        indicator.mesh.position.copy(pos);
        indicator.mesh.position.y += 0.5;
      }

      if (isUnderAttack) {
        // Pulsing red ring
        const pulse = 0.3 + Math.sin(time * 4) * 0.2;
        indicator.mat.opacity = pulse;
      } else {
        indicator.mat.opacity = Math.max(0, indicator.mat.opacity - 0.02);
      }
    }
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

    // Update cosmic background nebulas
    for (const neb of this._cosmicNebulas) {
      neb.update(time, camera);
    }

    // Update patrol dots and threat indicators
    this._updatePatrolDots(time);
    this._updateThreatIndicators(time);

    // Update route lanes
    for (const [routeId, lane] of this._routeLanes) {
      const route = gameState.routes.find(r => r.id === routeId);
      if (!route) continue;
      const fromPos = this.getPlanetWorldPosition(route.fromPlanet);
      const toPos   = this.getPlanetWorldPosition(route.toPlanet);
      const hasShip = gameState.activeShips.some(s => s.routeId === routeId);
      lane.update(dt, fromPos, toPos, route.active, hasShip);
    }

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
    for (const neb of this._cosmicNebulas) {
      neb.dispose();
    }
  }
}
