import { gameState } from '../GameState.js';
import { calcTravelDuration } from '../data/routes.js';

export class RouteSystem {
  constructor(animationLoop, hyperlanePatrolSystem) {
    this._nextShipId = 0;
    this._hyperlanePatrolSystem = hyperlanePatrolSystem;
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const now = Date.now();

    // Advance in-flight ships
    for (let i = gameState.activeShips.length - 1; i >= 0; i--) {
      const ship = gameState.activeShips[i];
      ship.t += dt / ship.duration;

      if (ship.t >= 1) {
        this._deliverShip(ship);
        gameState.activeShips.splice(i, 1);
      }
    }

    // Dispatch new ships from active routes
    for (const route of gameState.routes) {
      if (!route.active) continue;
      if (!gameState.ownedPlanets.includes(route.fromPlanet)) continue;
      if (!gameState.ownedPlanets.includes(route.toPlanet)) continue;

      const ps = gameState.getPlanetState(route.fromPlanet);
      if (!ps || !ps.hasBase) continue;

      // Check if hyperlane is blocked by enemy patrol
      if (this._hyperlanePatrolSystem && this._hyperlanePatrolSystem.isLaneBlocked(route.fromPlanet, route.toPlanet)) continue;

      // Check ship slot availability
      const activeFromRoute = gameState.activeShips.filter(s => s.routeId === route.id).length;
      if (activeFromRoute > 0) continue; // one ship per route at a time

      const totalActiveFromPlanet = gameState.activeShips.filter(s => s.fromPlanet === route.fromPlanet).length;
      if (totalActiveFromPlanet >= gameState.getShipSlots(route.fromPlanet)) continue;

      // Check if source has enough resource
      if (!gameState.siloHas(route.fromPlanet, route.resource, route.amount)) continue;

      // Check if destination has room
      const destPs = gameState.getPlanetState(route.toPlanet);
      if (!destPs || !destPs.hasBase) continue;
      if (!gameState.siloHasRoom(route.toPlanet, route.resource)) continue;

      // Dispatch ship
      const shipSpeedLevel = ps.baseLevels.shipSpeed;
      const duration = Math.max(1, calcTravelDuration(route.fromPlanet, route.toPlanet, shipSpeedLevel));

      const deducted = gameState.deductFromSilo(route.fromPlanet, route.resource, route.amount);
      if (deducted <= 0) continue;

      route.lastDispatchTime = now;

      const shipData = {
        id: this._nextShipId++,
        routeId: route.id,
        fromPlanet: route.fromPlanet,
        toPlanet: route.toPlanet,
        resource: route.resource,
        amount: deducted,
        duration,
        t: 0,
      };

      gameState.activeShips.push(shipData);
      gameState.emit('shipLaunched', shipData);
    }
  }

  _deliverShip(ship) {
    gameState.addToSilo(ship.toPlanet, ship.resource, ship.amount);
    gameState.emit('shipArrived', ship);
  }

  /**
   * Reconstruct in-flight ships from routes on save load.
   * Called by main.js after deserialize.
   */
  reconstructActiveShips() {
    const now = Date.now();
    gameState.activeShips = [];

    for (const route of gameState.routes) {
      if (!route.active || !route.lastDispatchTime) continue;
      if (!gameState.ownedPlanets.includes(route.fromPlanet)) continue;
      if (!gameState.ownedPlanets.includes(route.toPlanet)) continue;

      const ps = gameState.getPlanetState(route.fromPlanet);
      if (!ps || !ps.hasBase) continue;

      const shipSpeedLevel = ps.baseLevels.shipSpeed;
      const duration = Math.max(1, calcTravelDuration(route.fromPlanet, route.toPlanet, shipSpeedLevel));
      const elapsed = Math.max(0, (now - route.lastDispatchTime) / 1000);

      if (elapsed < duration) {
        // Ship is still in flight
        const t = elapsed / duration;
        const shipData = {
          id: this._nextShipId++,
          routeId: route.id,
          fromPlanet: route.fromPlanet,
          toPlanet: route.toPlanet,
          resource: route.resource,
          amount: route.amount,
          duration,
          t,
        };
        gameState.activeShips.push(shipData);
        gameState.emit('shipLaunched', shipData);
      }
    }
  }
}
