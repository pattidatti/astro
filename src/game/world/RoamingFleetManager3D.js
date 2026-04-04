import { gameState } from '../GameState.js';
import { RoamingFleet3D } from './RoamingFleet3D.js';

const POOL_SIZE = 6;

/**
 * RoamingFleetManager3D — pool manager for RoamingFleet3D visuals.
 *
 * Listens to fleet events and keeps a pool of RoamingFleet3D objects in sync
 * with gameState.roamingFleets.
 */
export class RoamingFleetManager3D {
  constructor(scene, galaxy) {
    this._galaxy  = galaxy;
    this._pool    = [];
    this._active  = new Map(); // fleetId → RoamingFleet3D

    // Pre-allocate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      this._pool.push(new RoamingFleet3D(scene));
    }

    gameState.on('fleetSpawned',        ({ fleet })          => this._onSpawned(fleet));
    gameState.on('fleetArrived',        ({ fleetId })        => this._onRemoved(fleetId));
    gameState.on('fleetDestroyed',      ({ fleetId })        => this._onRemoved(fleetId));
    gameState.on('fleetEnemyDestroyed', ({ fleetId, enemy }) => this._onEnemyDestroyed(fleetId, enemy));
  }

  // ─── Public ───────────────────────────────────────────────────────────────

  /** Returns click-target descriptors for InputManager registration. */
  getClickTargets() {
    const targets = [];
    for (const [fleetId, fleet3D] of this._active) {
      targets.push({ mesh: fleet3D.clickMesh, fleetId });
    }
    return targets;
  }

  /** Called by Galaxy.update() each frame. */
  update(dt, time) {
    // Gather all live planet positions once per frame for avoidance computation
    const allPlanetIds = Object.keys(this._galaxy.systems);

    for (const [fleetId, fleet3D] of this._active) {
      const fleet = gameState.roamingFleets.find(f => f.id === fleetId);
      if (!fleet) {
        this._onRemoved(fleetId);
        continue;
      }
      const fromPos = this._galaxy.getPlanetWorldPosition(fleet.fromPlanet);
      const toPos   = this._galaxy.getPlanetWorldPosition(fleet.toPlanet);

      // Bystander planet positions (exclude source and destination)
      const avoidPositions = allPlanetIds
        .filter(id => id !== fleet.fromPlanet && id !== fleet.toPlanet)
        .map(id => this._galaxy.getPlanetWorldPosition(id))
        .filter(Boolean);

      fleet3D.update(fromPos, toPos, fleet, avoidPositions);
    }
  }

  /** Get the 3D object for a fleet (used for camera tracking). */
  getFleet3D(fleetId) {
    return this._active.get(fleetId) ?? null;
  }

  /** Get the world position of a roaming fleet (used by FleetCombatSystem for proximity checks). */
  getFleetWorldPosition(fleetId) {
    const fleet3D = this._active.get(fleetId);
    return fleet3D ? fleet3D.worldPosition : null;
  }

  /** Get all active fleet world positions keyed by fleet ID. */
  getAllFleetWorldPositions() {
    const result = {};
    for (const [id, fleet3D] of this._active) {
      result[id] = fleet3D.worldPosition;
    }
    return result;
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  _onSpawned(fleet) {
    if (this._active.has(fleet.id)) return; // already spawned (e.g. reconstructFleets)

    const fleet3D = this._pool.find(f => !f.group.visible);
    if (!fleet3D) return; // pool exhausted

    const fromPos = this._galaxy.getPlanetWorldPosition(fleet.fromPlanet);
    const toPos   = this._galaxy.getPlanetWorldPosition(fleet.toPlanet);
    fleet3D.activate(fleet, fromPos, toPos);
    this._active.set(fleet.id, fleet3D);
  }

  _onRemoved(fleetId) {
    const fleet3D = this._active.get(fleetId);
    if (!fleet3D) return;
    fleet3D.deactivate();
    this._active.delete(fleetId);
  }

  _onEnemyDestroyed(fleetId, enemy) {
    // HP bars update in fleet3D.update() — no extra work needed here.
    // Could trigger a small explosion in the future.
  }
}
