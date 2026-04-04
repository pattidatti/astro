import * as THREE from 'three';
import { PLANETS } from '../data/planets.js';
import { CENTRAL_STAR } from '../data/galaxyLayout.js';
import { getAllWorldPositions } from '../utils/CoordinateMapper.js';
import { SolarSystem } from './SolarSystem.js';
import { Star3D } from '../objects/Star3D.js';
import { NebulaVolume } from '../effects/NebulaVolume.js';
import { GalacticAsteroidBelt } from '../effects/GalacticAsteroidBelt.js';
import { DustCloud } from '../effects/DustCloud.js';
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
    this._createGalacticBelt();
    this._createAmbientDustClouds();
    this._createCosmicNebulas();
    this._createThreatIndicators();
    this._initRouteLanes();

    /** Set by Game.js after scene is available. */
    this.roamingFleetManager = null;
    this.enemyStationManager = null;  // Set by Game.js after scene is available
    this._frameCount = 0;
  }

  _createGalacticBelt() {
    this._galacticBelt = new GalacticAsteroidBelt({
      particleCount: 4000,
      innerRadius: 370,
      outerRadius: 450,
      heightVariation: 20,
    });
    this.group.add(this._galacticBelt.group);

    this._outerBelt = new GalacticAsteroidBelt({
      particleCount: 3000,
      innerRadius: 1500,
      outerRadius: 1700,
      heightVariation: 30,
      color: 0x887766,
      minScale: 0.10,
      maxScale: 0.45,
    });
    this.group.add(this._outerBelt.group);
  }

  _createAmbientDustClouds() {
    const configs = [
      { r: 200,  a: 0.8,  y:  12, scale: 5,  color: 0x4488ee },
      { r: 290,  a: 2.5,  y:  -8, scale: 6,  color: 0xff6633 },
      { r: 390,  a: 4.1,  y:  15, scale: 6,  color: 0xcc88ff },
      { r: 430,  a: 1.2,  y:  -5, scale: 5,  color: 0xffee66 },
      { r: 560,  a: 3.6,  y:  18, scale: 7,  color: 0xaaddff },
      { r: 610,  a: 5.2,  y: -12, scale: 6,  color: 0xff88cc },
      { r: 760,  a: 0.3,  y:   8, scale: 8,  color: 0x4488ee },
      { r: 900,  a: 2.9,  y: -20, scale: 8,  color: 0xff7744 },
      { r: 1020, a: 4.8,  y:  22, scale: 9,  color: 0xffaa33 },
      { r: 1200, a: 1.7,  y: -10, scale: 10, color: 0xbb44bb },
    ];

    this._ambientDustClouds = configs.map(({ r, a, y, scale, color }) => {
      const cloud = new DustCloud(color);
      cloud.group.position.set(
        Math.cos(a) * r,
        y,
        Math.sin(a) * r
      );
      cloud.group.scale.setScalar(scale);
      cloud.setOpacity(0.18);
      this.group.add(cloud.group);
      return cloud;
    });
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

  /** Get all roaming fleet click targets for InputManager registration */
  getFleetClickTargets() {
    return this.roamingFleetManager ? this.roamingFleetManager.getClickTargets() : [];
  }

  /** Get all station click targets for InputManager registration */
  getStationClickTargets() {
    return Object.entries(this.systems).map(([id, sys]) => ({
      mesh: sys.stationClickTarget,
      planetId: id,
      system: sys,
    }));
  }

  /** Get all defense lock-on targets from all systems */
  getDefenseLockOnTargets() {
    const targets = [];
    for (const id in this.systems) {
      for (const t of this.systems[id].getDefenseLockOnTargets()) {
        targets.push({ ...t, planetId: id, system: this.systems[id] });
      }
    }
    return targets;
  }

  /** Get the DefenseManager3D for a specific planet */
  getDefenseManager(planetId) {
    return this.systems[planetId]?.defenseManager ?? null;
  }

  /** Get all enemy station click targets (planet-anchored + free-floating) */
  getEnemyStationClickTargets() {
    const targets = [];
    // Planet-anchored stations
    for (const id in this.systems) {
      const sys = this.systems[id];
      if (sys.enemyStationClickTarget) {
        targets.push({
          mesh: sys.enemyStationClickTarget,
          stationId: sys.enemyStation?.stationId,
          planetId: id,
        });
      }
    }
    // Free-floating stations
    if (this.enemyStationManager) {
      targets.push(...this.enemyStationManager.getClickTargets());
    }
    return targets;
  }

  /** Get world positions of all owned planet stations for Emergency Jump etc. */
  getOwnedStationPositions() {
    return gameState.ownedPlanets.map(planetId => ({
      planetId,
      worldPos: this.systems[planetId]?.stationWorldPosition ?? null,
    }));
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
    this._frameCount++;
    const cameraPos = camera.position;

    // Update central star
    this.centralStar.update(time);

    // Update cosmic background nebulas — throttled to every other frame (uTime advances
    // ~0.010/frame; skipping one frame shifts by ~0.00017, imperceptible)
    const updateNebulas = this._frameCount % 2 === 0;
    for (const neb of this._cosmicNebulas) {
      neb.mesh.lookAt(camera.position); // billboard every frame
      if (updateNebulas) neb.material.uniforms.uTime.value = time;
    }

    // Update galactic asteroid belts
    this._galacticBelt.update(dt);
    this._outerBelt.update(dt);

    // Update ambient dust clouds — skip update when camera is far away
    // scale * 60 gives a conservative visibility radius per cloud size
    for (const cloud of this._ambientDustClouds) {
      if (cameraPos.distanceTo(cloud.group.position) < cloud.group.scale.x * 60) {
        cloud.update(dt);
      }
    }

    // Update fleet visuals and threat indicators
    if (this.roamingFleetManager) this.roamingFleetManager.update(dt, time);
    if (this.enemyStationManager) this.enemyStationManager.update(dt, time, camera);
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
    let _sysIdx = 0;
    for (const id in this.systems) {
      const system = this.systems[id];
      const distance = cameraPos.distanceTo(system.planetWorldPosition);

      // Distant planets: always update orbit (smooth motion), throttle visuals
      // Stagger across planets so not all 8 update on the same frame
      if (distance > 430) {
        system.group.visible = true;
        system._updateOrbit(time);
        if (this._frameCount % 10 === _sysIdx % 10) {
          system.updateLOD(distance, time, dt, camera);
        }
      } else {
        system.updateLOD(distance, time, dt, camera);
      }
      _sysIdx++;
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
    this._galacticBelt.dispose();
    this._outerBelt.dispose();
    for (const cloud of this._ambientDustClouds) {
      cloud.dispose();
    }
  }
}
