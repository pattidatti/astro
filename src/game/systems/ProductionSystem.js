import { gameState } from '../GameState.js';
import { BASE_UPGRADES } from '../data/upgrades.js';
import {
  planetProductionRates,
  scoutProgressRate,
  SCOUT_UNLOCK_TIME,
} from '../data/productionRates.js';

/** Resources per second, per type, lifted from planet silo to military base silo. */
const ELEVATOR_PUMP_RATE = 2.0;

const _storageUpg = BASE_UPGRADES.find(u => u.effect === 'storage') || { capacityBonus: [] };
function _calcCrystalCapacity(storageLevel) {
  let cap = 500;
  for (let i = 0; i < storageLevel; i++) cap += (_storageUpg.capacityBonus[i] || 0);
  return cap;
}

/**
 * Advance a planet's deposit survey by `dt` seconds and unlock any zone that
 * crosses the threshold.
 *
 * Shared with the offline catch-up (see systems/OfflineProgress.js), which needs
 * the same unlock semantics — including opening the crystal silo — but must not
 * emit events into a HUD that hasn't been built yet. Returns the unlocks instead
 * of announcing them, and lets the caller decide.
 *
 * @returns {Array<{planetId:string, resource:string, zones:number}>}
 */
export function applyScouting(dt, planetId, ps, gs = gameState) {
  const unlocks = [];
  const rate = scoutProgressRate(ps, gs);
  if (rate <= 0) return unlocks;

  for (const resource of ['ore', 'crystal', 'energy']) {
    const dep = ps.deposits?.[resource];
    if (!dep || dep.unlocked >= dep.zones) continue;

    ps.depositProgress[resource] = (ps.depositProgress[resource] || 0) + rate * dt;

    // A long offline stretch can cross the threshold several times over.
    while (ps.depositProgress[resource] >= SCOUT_UNLOCK_TIME && dep.unlocked < dep.zones) {
      ps.depositProgress[resource] -= SCOUT_UNLOCK_TIME;
      dep.unlocked++;

      // Unlock crystal silo if it was locked — match current storage level
      if (resource === 'crystal' && ps.silos.crystal.capacity === 0) {
        ps.silos.crystal.capacity = _calcCrystalCapacity(ps.baseLevels.storage);
      }
      unlocks.push({ planetId, resource, zones: dep.unlocked });
    }
    // Surveying stops once every zone is open — don't bank progress forever.
    if (dep.unlocked >= dep.zones) ps.depositProgress[resource] = 0;
  }
  return unlocks;
}

/**
 * Move `dt` seconds' worth of ore and energy up the space elevator, from the
 * planet silo into the military base's own silo.
 *
 * Shared with the offline catch-up, which needs the transfer but not the events.
 *
 * @returns {boolean} true when this planet has a base to pump into
 */
export function pumpSpaceElevator(dt, ps) {
  const mb = ps.militaryBase;
  if (!mb || !mb.built) return false;

  for (const res of ['ore', 'energy']) {
    const planetSilo = ps.silos[res];
    const baseSilo   = mb.silo[res];
    if (!planetSilo || !baseSilo) continue;
    if (planetSilo.amount <= 0) continue;
    if (baseSilo.amount >= baseSilo.capacity) continue;

    const pump = Math.min(
      ELEVATOR_PUMP_RATE * dt,
      planetSilo.amount,
      baseSilo.capacity - baseSilo.amount,
    );
    if (pump <= 0) continue;

    planetSilo.amount -= pump;
    baseSilo.amount   += pump;
  }
  return true;
}

export class ProductionSystem {
  constructor(animationLoop) {
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const delta = {};

    for (const planetId of gameState.ownedPlanets) {
      const ps = gameState.getPlanetState(planetId);
      if (!ps || !ps.hasBase) continue;

      delta[planetId] = this._tickPlanet(dt, planetId, ps);
      this._tickSpaceElevator(dt, planetId, ps);
    }

    gameState.tickColonyShipBuilds(dt);
    gameState.tickColonyShipFlights(dt);
    gameState.tickShipBuildQueues(dt);

    gameState.emit('productionTick', delta);
  }

  /**
   * Space Elevator: passively pumps resources from planet silo into the
   * military base's own silos at a flat rate. Completely decoupled from RouteSystem.
   */
  _tickSpaceElevator(dt, planetId, ps) {
    if (!pumpSpaceElevator(dt, ps)) return;

    // Throttle elevator silo events — emit at most every 10 frames
    // (PlanetPanel already rate-limits silo display to 0.1s, so no visual difference)
    this._elevatorEmitCounter = (this._elevatorEmitCounter || 0) + 1;
    if (this._elevatorEmitCounter >= 10) {
      this._elevatorEmitCounter = 0;
      // Emit per-resource so GameState listener can check energy for tech availability
      for (const res of ['ore', 'energy']) {
        gameState.emit('siloChanged', { planetId, resource: res, amount: ps.silos[res].amount });
      }
      gameState.emit('militaryBaseSiloChanged', { planetId });
    }
  }

  _tickPlanet(dt, planetId, ps) {
    const result = { ore: 0, energy: 0, crystal: 0 };

    const rates = planetProductionRates(planetId, ps, gameState);
    for (const resource of ['ore', 'energy', 'crystal']) {
      if (rates[resource] <= 0) continue;
      if (!gameState.siloHasRoom(planetId, resource)) continue;
      result[resource] = gameState.addToSilo(planetId, resource, rates[resource] * dt);
    }

    for (const unlock of applyScouting(dt, planetId, ps, gameState)) {
      gameState.emit('depositUnlocked', unlock);
    }

    return result;
  }
}
