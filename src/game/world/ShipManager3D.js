import { gameState } from '../GameState.js';
import { Ship3D } from './Ship3D.js';

const MAX_SHIPS = 20;

/**
 * Manages a pool of Ship3D instances that travel between planets.
 * Driven by RouteSystem via shipLaunched/shipArrived GameState events.
 */
export class ShipManager3D {
  constructor(scene, animationLoop, galaxy) {
    this._scene  = scene;
    this._galaxy = galaxy;
    this._pool   = [];
    this._active = new Map(); // shipId → { ship3d, routeData }

    // Pre-allocate pool
    for (let i = 0; i < MAX_SHIPS; i++) {
      const ship = new Ship3D();
      scene.add(ship.group);
      this._pool.push(ship);
    }

    // Listen for ship events
    gameState.on('shipLaunched', (data) => this._onShipLaunched(data));
    gameState.on('shipArrived',  (data) => this._onShipArrived(data));

    // Per-frame update
    animationLoop.onUpdate((dt) => this._update(dt));
  }

  _onShipLaunched(data) {
    if (this._active.has(data.id)) return;
    if (this._pool.length === 0) return; // pool exhausted

    const ship3d = this._pool.pop();
    const fromPos = this._galaxy.getPlanetWorldPosition(data.fromPlanet);
    const toPos   = this._galaxy.getPlanetWorldPosition(data.toPlanet);

    if (fromPos && toPos) {
      ship3d.activate(fromPos, toPos);
    }

    this._active.set(data.id, { ship3d, data });
  }

  _onShipArrived(data) {
    const entry = this._active.get(data.id);
    if (!entry) return;

    entry.ship3d.deactivate();
    this._pool.push(entry.ship3d);
    this._active.delete(data.id);
  }

  _update(_dt) {
    for (const [shipId, entry] of this._active) {
      // Find corresponding active ship data from gameState
      const shipData = gameState.activeShips.find(s => s.id === shipId);
      if (!shipData) {
        // Ship already delivered
        entry.ship3d.deactivate();
        this._pool.push(entry.ship3d);
        this._active.delete(shipId);
        continue;
      }

      const fromPos = this._galaxy.getPlanetWorldPosition(shipData.fromPlanet);
      const toPos   = this._galaxy.getPlanetWorldPosition(shipData.toPlanet);

      if (fromPos && toPos) {
        entry.ship3d.update(shipData.t, fromPos, toPos);
      }
    }
  }

  dispose() {
    for (const ship of this._pool) ship.dispose();
    for (const { ship3d } of this._active.values()) ship3d.dispose();
  }
}
