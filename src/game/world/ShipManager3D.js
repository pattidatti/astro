import { gameState } from '../GameState.js';
import { Ship3D } from './Ship3D.js';
import { ColonyShip3D } from '../objects/ColonyShip3D.js';

const MAX_SHIPS = 20;
const MAX_COLONY_SHIPS = 3;

/**
 * Manages a pool of Ship3D instances that travel between planets.
 * Driven by RouteSystem via shipLaunched/shipArrived GameState events.
 */
export class ShipManager3D {
  constructor(scene, animationLoop, galaxy, inputManager = null) {
    this._scene        = scene;
    this._galaxy       = galaxy;
    this._inputManager = inputManager;
    this._pool   = [];
    this._active = new Map(); // shipId → { ship3d, routeData }

    // Pre-allocate pool
    for (let i = 0; i < MAX_SHIPS; i++) {
      const ship = new Ship3D();
      scene.add(ship.group);
      this._pool.push(ship);
    }

    // Colony ship pool
    this._colonyPool = [];
    for (let i = 0; i < MAX_COLONY_SHIPS; i++) {
      const cs = new ColonyShip3D();
      scene.add(cs.group);
      this._colonyPool.push(cs);
    }

    // Listen for ship events
    gameState.on('shipLaunched',       (data) => this._onShipLaunched(data));
    gameState.on('shipArrived',        (data) => this._onShipArrived(data));
    gameState.on('colonyShipLaunched', (data) => this._onShipLaunched(data));
    gameState.on('colonyShipArrived',  (data) => this._onColonyShipArrived(data));
    gameState.on('stateLoaded',        ()     => this._reconstructArrivingShips());

    // Per-frame update
    animationLoop.onUpdate((dt) => this._update(dt));

    // Reconstruct colony ships that were in arrival orbit when game was last saved
    this._reconstructArrivingShips();
  }

  _onShipLaunched(data) {
    if (this._active.has(data.id)) return;

    let ship3d;
    if (data.isColony) {
      if (this._colonyPool.length === 0) return;
      ship3d = this._colonyPool.pop();
    } else {
      if (this._pool.length === 0) return;
      ship3d = this._pool.pop();
    }
    const fromPos = this._galaxy.getPlanetWorldPosition(data.fromPlanet);
    const toPos   = this._galaxy.getPlanetWorldPosition(data.toPlanet);

    if (fromPos && toPos) {
      ship3d.activate(fromPos, toPos, data.resource);
    }

    this._active.set(data.id, { ship3d, data });

    // Register cargo ships as clickable
    if (!data.isColony && this._inputManager) {
      const shipId = data.id;
      this._inputManager.addClickable(ship3d._fuselage, () => {
        gameState.emit('cargoShipClicked', { shipId });
      });
      ship3d._fuselage.userData.shipId = shipId;
    }

    // Register colony ships in flight as clickable
    if (data.isColony && this._inputManager && ship3d.hitbox) {
      const shipId = data.id;
      this._inputManager.addClickable(ship3d.hitbox, () => {
        gameState.emit('colonyShipInFlightClicked', { shipId });
      });
      ship3d.hitbox.userData.shipId = shipId;
    }
  }

  _onShipArrived(data) {
    const entry = this._active.get(data.id);
    if (!entry) return;

    // Unregister clickable before deactivating
    if (!data.isColony && this._inputManager) {
      this._inputManager.removeClickable(entry.ship3d._fuselage);
      entry.ship3d._fuselage.userData.shipId = null;
    }

    entry.ship3d.deactivate();
    if (entry.data.isColony) {
      this._colonyPool.push(entry.ship3d);
    } else {
      this._pool.push(entry.ship3d);
    }
    this._active.delete(data.id);
  }

  _onColonyShipArrived(data) {
    // Find the colony ship that was orbiting the destination planet
    for (const [shipId, entry] of this._active) {
      if (entry.data.isColony && entry.data.toPlanet === data.toPlanetId) {
        if (this._inputManager && entry.ship3d.hitbox) {
          this._inputManager.removeClickable(entry.ship3d.hitbox);
          entry.ship3d.hitbox.userData.shipId = null;
        }
        entry.ship3d.deactivate();
        this._colonyPool.push(entry.ship3d);
        this._active.delete(shipId);
        break;
      }
    }
  }

  _reconstructArrivingShips() {
    for (const ship of gameState.colonyShipsArriving) {
      if (this._active.has(ship.id)) continue; // already tracked
      if (this._colonyPool.length === 0) break;
      const ship3d = this._colonyPool.pop();
      ship3d.group.visible = true;
      this._active.set(ship.id, {
        ship3d,
        data: {
          id: ship.id,
          fromPlanet: ship.fromPlanetId,
          toPlanet: ship.toPlanetId,
          isColony: true,
          duration: 1,
          t: 1,
          orbitPhase: true,
          orbitTime: 0,
        },
      });
      // Register arriving colony ships as clickable
      if (this._inputManager && ship3d.hitbox) {
        const shipId = ship.id;
        ship3d.hitbox.userData.shipId = shipId;
        this._inputManager.addClickable(ship3d.hitbox, () => {
          gameState.emit('colonyShipInFlightClicked', { shipId });
        });
      }
    }
  }

  _update(_dt) {
    for (const [shipId, entry] of this._active) {
      // Colony ships self-manage their t (not tracked in gameState.activeShips)
      if (entry.data.isColony) {
        if (entry.data.orbitPhase) {
          // Orbiting destination planet — wait for baseBuilt to trigger colonyShipArrived
          entry.data.orbitTime = (entry.data.orbitTime || 0) + _dt;
          const toPos = this._galaxy.getPlanetWorldPosition(entry.data.toPlanet);
          if (toPos) {
            const radius = 20;
            const angle = entry.data.orbitTime * 0.08 + Math.PI;
            entry.ship3d.group.position.set(
              toPos.x + Math.cos(angle) * radius,
              toPos.y + Math.sin(angle * 0.3) * 2,
              toPos.z + Math.sin(angle) * radius
            );
            entry.ship3d.group.rotation.y = -angle + Math.PI / 2;
          }
          continue;
        }

        entry.data.t += _dt / entry.data.duration;
        if (entry.data.t >= 1) {
          entry.data.t = 1;
          entry.data.orbitPhase = true;
          entry.data.orbitTime = 0;
          continue;
        }
        const fromPos = this._galaxy.getPlanetWorldPosition(entry.data.fromPlanet);
        const toPos   = this._galaxy.getPlanetWorldPosition(entry.data.toPlanet);
        if (fromPos && toPos) entry.ship3d.update(entry.data.t, fromPos, toPos);
        continue;
      }

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

  /** Get world position of an active colony ship (for camera tracking) */
  getColonyShipPosition(shipId) {
    const entry = this._active.get(shipId);
    return entry?.ship3d?.group?.position ?? null;
  }

  /** Get world position of an active cargo ship (for camera tracking) */
  getShipPosition(shipId) {
    const entry = this._active.get(shipId);
    return entry?.ship3d?.group?.position ?? null;
  }

  dispose() {
    for (const ship of this._pool) ship.dispose();
    for (const ship of this._colonyPool) ship.dispose();
    for (const { ship3d } of this._active.values()) ship3d.dispose();
  }
}
