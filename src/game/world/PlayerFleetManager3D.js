import { gameState } from '../GameState.js';
import { PlayerFleet3D } from './PlayerFleet3D.js';

const POOL_SIZE = 8;

/**
 * PlayerFleetManager3D — pool manager for PlayerFleet3D visuals.
 *
 * Mirrors the pattern of RoamingFleetManager3D.
 * Listens to player fleet events and keeps the 3D pool in sync.
 * Called each frame via update(isRTSMode) from the animation loop.
 */
export class PlayerFleetManager3D {
  constructor(scene) {
    this._pool   = [];
    this._active = new Map(); // fleetId → PlayerFleet3D

    // Pre-allocate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      this._pool.push(new PlayerFleet3D(scene));
    }

    // Bind events
    gameState.on('playerFleetSpawned',  (fleet)           => this._onSpawned(fleet));
    gameState.on('playerFleetDestroyed',({ fleetId })     => this._onRemoved(fleetId));
    gameState.on('playerFleetChanged',  ({ fleetId })     => this._onFleetChanged(fleetId));

    // Restore existing fleets after save load
    gameState.on('stateLoaded', () => {
      for (const fleet of gameState.playerFleets) {
        if (!this._active.has(fleet.id)) this._onSpawned(fleet);
      }
    });
  }

  // ─── Per-frame ────────────────────────────────────────────────────────────

  /** Called each frame. isRTSMode controls visibility of RTS overlays. */
  update(isRTSMode) {
    for (const [fleetId, fleet3D] of this._active) {
      const fleet = gameState.playerFleets.find(f => f.id === fleetId);
      if (!fleet) {
        this._onRemoved(fleetId);
        continue;
      }
      fleet3D.update(fleet, isRTSMode);
    }
  }

  // ─── Public helpers ───────────────────────────────────────────────────────

  /** Returns click-target descriptors for InputManager registration. */
  getClickTargets() {
    const targets = [];
    for (const [fleetId, fleet3D] of this._active) {
      targets.push({ mesh: fleet3D.clickMesh, fleetId });
    }
    return targets;
  }

  /** Returns all selectable meshes for RTS box-selection. */
  getSelectableMeshes() {
    return Array.from(this._active.values()).map(f => f.selectMesh);
  }

  /** Get a specific fleet's 3D object (for camera tracking etc.). */
  getFleet3D(fleetId) {
    return this._active.get(fleetId) ?? null;
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  _onSpawned(fleet) {
    if (this._active.has(fleet.id)) return;

    const fleet3D = this._pool.find(f => !f.group.visible);
    if (!fleet3D) {
      console.warn('[PlayerFleetManager3D] Pool exhausted — cannot spawn fleet', fleet.id);
      return;
    }

    fleet3D.activate(fleet);
    this._active.set(fleet.id, fleet3D);
  }

  _onRemoved(fleetId) {
    const fleet3D = this._active.get(fleetId);
    if (!fleet3D) return;
    fleet3D.deactivate();
    this._active.delete(fleetId);
  }

  /**
   * Called when a ship is added to an existing fleet.
   * Adds only the last ship to the fleet's 3D visual (avoids full rebuild).
   */
  _onFleetChanged(fleetId) {
    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;

    const fleet3D = this._active.get(fleetId);
    if (!fleet3D) {
      // Fleet was just spawned — full activation is handled by _onSpawned
      return;
    }

    // Add the most recently pushed ship (last element)
    const lastShip = fleet.ships[fleet.ships.length - 1];
    if (lastShip) fleet3D.addShip(lastShip);
  }
}
