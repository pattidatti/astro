import { gameState } from '../GameState.js';
import { DefenseSatellite3D } from '../objects/DefenseSatellite3D.js';
import { PatrolShip3D, PATROL_ORBIT_SPEED } from '../objects/PatrolShip3D.js';

const MAX_SATELLITES  = 5;
const MAX_PATROLS     = 3;
const SAT_ORBIT_RADIUS    = 19.5;
const PATROL_ORBIT_RADIUS = 24.0;
const SAT_ORBIT_SPEED     = 0.07;   // rad/s
const ORBIT_INCLINATION   = 0.18;   // radians — slight tilt for both types

/** V-formation offsets: [ { angleOffset, lateralOffset, yOffset } ] */
const PATROL_FORMATION = [
  { angleOffset:  0.00, lateralOffset:  0.0, yOffset:  0.0 },  // lead
  { angleOffset: -0.20, lateralOffset:  2.5, yOffset:  1.8 },  // right wing
  { angleOffset: -0.20, lateralOffset: -2.5, yOffset: -1.8 },  // left wing
];

/**
 * Manages 3D defense objects (satellites + patrol ships) for one planet.
 * Added to SolarSystem.orbitGroup — positions are planet-local.
 *
 * Drives satellite/patrol orbits with shared master angles so formations
 * stay coherent regardless of when units are added/removed.
 */
export class DefenseManager3D {
  constructor(planetId, orbitGroup, station) {
    this._planetId  = planetId;
    this._station   = station;

    // Derive a per-planet seed from the id string for unique phase offsets
    this._seed = [...planetId].reduce((a, c) => a + c.charCodeAt(0), 0);

    // Master orbit angles (advanced each frame)
    this._satMasterAngle    = (this._seed * 0.13) % (Math.PI * 2);
    this._patrolLeadAngle   = (this._seed * 0.17) % (Math.PI * 2);

    // Satellite pool
    this._satPool   = [];
    this._activeSats = [];      // DefenseSatellite3D[]
    for (let i = 0; i < MAX_SATELLITES; i++) {
      const sat = new DefenseSatellite3D();
      orbitGroup.add(sat.group);
      this._satPool.push(sat);
    }

    // Patrol ship pool
    this._patrolPool    = [];
    this._activePatrols = [];   // PatrolShip3D[]
    for (let i = 0; i < MAX_PATROLS; i++) {
      const ship = new PatrolShip3D();
      orbitGroup.add(ship.group);
      this._patrolPool.push(ship);
    }

    // Per-planet inclination (slight variation)
    this._inclination = ORBIT_INCLINATION + ((this._seed * 0.031) % 0.12) - 0.06;

    // Event listeners
    this._onStateLoaded   = () => this.syncDefenses();
    this._onDefenseBuilt  = ({ planetId }) => { if (planetId === this._planetId) this.syncDefenses(); };
    this._onBaseBuilt     = ({ planetId }) => { if (planetId === this._planetId) this.syncDefenses(); };
    gameState.on('stateLoaded',  this._onStateLoaded);
    gameState.on('defenseBuilt', this._onDefenseBuilt);
    gameState.on('baseBuilt',    this._onBaseBuilt);

    this.syncDefenses();
  }

  // ── Sync defense count to 3D objects ──────────────────────────────────────

  syncDefenses() {
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps || !ps.hasBase) {
      this._despawnAll();
      return;
    }

    const defenses = ps.combat.defenses;
    this._syncCount(
      this._activeSats, this._satPool,
      defenses.satellite || 0,
      (obj) => obj.activate(),
    );
    this._syncCount(
      this._activePatrols, this._patrolPool,
      defenses.defenseShip || 0,
      (obj) => obj.activate(),
    );

    // Sync cannon turrets on station
    if (this._station?.syncCannonTurrets) {
      this._station.syncCannonTurrets(defenses.cannon || 0);
    }
  }

  _syncCount(active, pool, targetCount, activateFn) {
    // Remove excess (return to pool)
    while (active.length > targetCount) {
      const obj = active.pop();
      obj.deactivate();
      pool.push(obj);
    }
    // Activate from pool
    while (active.length < targetCount && pool.length > 0) {
      const obj = pool.pop();
      activateFn(obj);
      active.push(obj);
    }
  }

  _despawnAll() {
    while (this._activeSats.length > 0) {
      const obj = this._activeSats.pop();
      obj.deactivate();
      this._satPool.push(obj);
    }
    while (this._activePatrols.length > 0) {
      const obj = this._activePatrols.pop();
      obj.deactivate();
      this._patrolPool.push(obj);
    }
    this._station?.syncCannonTurrets?.(0);
  }

  // ── Per-frame update ───────────────────────────────────────────────────────

  update(dt, time) {
    this._satMasterAngle  += dt * SAT_ORBIT_SPEED;
    this._patrolLeadAngle += dt * PATROL_ORBIT_SPEED;

    const n = this._activeSats.length;
    for (let i = 0; i < n; i++) {
      const sat = this._activeSats[i];
      const angle = this._satMasterAngle + (i / n) * Math.PI * 2;
      sat.setOrbitState(angle, SAT_ORBIT_RADIUS, this._inclination);
      sat.update(dt, time);
    }

    for (let i = 0; i < this._activePatrols.length; i++) {
      const ship = this._activePatrols[i];
      const f = PATROL_FORMATION[i] || PATROL_FORMATION[0];
      ship.setOrbitState(
        this._patrolLeadAngle + f.angleOffset,
        PATROL_ORBIT_RADIUS,
        this._inclination,
        f.lateralOffset,
        f.yOffset,
      );
      ship.update(dt, time);
    }

    // Aim cannon turrets toward nearest enemy during combat
    if (this._station?.aimTurretsAtNearest) {
      this._station.aimTurretsAtNearest(this._planetId);
    }
  }

  setVisible(visible) {
    for (const sat  of this._activeSats)    sat.group.visible  = visible;
    for (const ship of this._activePatrols) ship.group.visible = visible;
  }

  // ── Lock-on target access (for Game.js registration) ──────────────────────

  /**
   * Returns ALL hitboxes (active + pooled) so Game.js can register them once.
   * Each entry exposes isActive() so the click handler can bail early.
   */
  getLockOnTargets() {
    const targets = [];
    const ps = gameState.getPlanetState(this._planetId);

    const allSats = [...this._activeSats, ...this._satPool];
    allSats.forEach((sat, i) => {
      targets.push({
        mesh: sat.hitbox,
        getWorldPosition: () => sat.getWorldPosition(),
        isActive: () => sat.group.visible,
        info: () => {
          const level = gameState.getPlanetState(this._planetId)?.combat?.defenses?.satellite || 0;
          return { type: 'Satellite', level, index: i };
        },
      });
    });

    const allShips = [...this._activePatrols, ...this._patrolPool];
    allShips.forEach((ship, i) => {
      targets.push({
        mesh: ship.hitbox,
        getWorldPosition: () => ship.getWorldPosition(),
        isActive: () => ship.group.visible,
        info: () => {
          const level = gameState.getPlanetState(this._planetId)?.combat?.defenses?.defenseShip || 0;
          return { type: 'Patrol Ship', level, index: i };
        },
      });
    });

    return targets;
  }

  // ── Fire position (for defenseFired event in Game.js) ─────────────────────

  /**
   * Returns world position of a defense object of the given type.
   * Returns null if no active object of that type.
   */
  getFirePosition(defenseType) {
    if (defenseType === 'satellite' && this._activeSats.length > 0) {
      const idx = Math.floor(Math.random() * this._activeSats.length);
      return this._activeSats[idx].getWorldPosition();
    }
    if (defenseType === 'defenseShip' && this._activePatrols.length > 0) {
      const idx = Math.floor(Math.random() * this._activePatrols.length);
      return this._activePatrols[idx].getWorldPosition();
    }
    if (defenseType === 'cannon' && this._station) {
      return this._station.getRandomTurretWorldPosition?.() ?? this._station.stationWorldPosition;
    }
    return null;
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  dispose() {
    gameState.off('stateLoaded',  this._onStateLoaded);
    gameState.off('defenseBuilt', this._onDefenseBuilt);
    gameState.off('baseBuilt',    this._onBaseBuilt);
    for (const obj of [...this._activeSats,    ...this._satPool])    obj.dispose();
    for (const obj of [...this._activePatrols, ...this._patrolPool]) obj.dispose();
  }
}
