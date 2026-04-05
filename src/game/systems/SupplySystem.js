import { gameState } from '../GameState.js';
import { MILITARY_SHIPS } from '../data/militaryShips.js';
import {
  FUEL_BURN_RATE,
  AMMO_BURN_RATE,
  RESUPPLY_RATE,
  RESUPPLY_DIST,
  CARRIER_RESUPPLY_MULT,
  CARRIER_COMBAT_RESUPPLY,
  DPS_PENALTY_THRESHOLD,
  DPS_PENALTY_MULT,
} from '../data/militaryStats.js';

/**
 * SupplySystem — per-frame fleet resource economy (Fase 6).
 *
 * Manages two supply bars per fleet:
 *   - energy (fuel): burned while moving
 *   - ore   (ammo):  burned while engaged in combat
 *
 * Resupply happens when a fleet is orbiting within RESUPPLY_DIST world units
 * of an owned planet's military base (using gameState._militaryBasePosFns).
 * A Carrier in the fleet doubles the restore rate and also partially restores
 * ore supply even during combat.
 *
 * Registered with animationLoop.onUpdate() — completely decoupled from
 * FleetCombatSystem and FleetMovementSystem (event-driven only).
 */
export class SupplySystem {
  /**
   * @param {object} animationLoop - Game animation loop.
   */
  constructor(animationLoop) {
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  // ─── Main tick ──────────────────────────────────────────────────────────────

  _tick(dt) {
    const clamped = Math.min(dt, 1);
    for (const fleet of gameState.playerFleets) {
      if (!fleet.supply) continue;
      this._tickCooldown(fleet, clamped);
      this._tickFuelBurn(fleet, clamped);
      this._tickAmmoBurn(fleet, clamped);
      this._tickCombatCarrierResupply(fleet, clamped);
      this._tickResupply(fleet, clamped);
      this._tickFriendlyStationResupply(fleet, clamped);
    }
  }

  // ─── Cooldown tick ─────────────────────────────────────────────────────────

  _tickCooldown(fleet, dt) {
    if (fleet.titanCooldown > 0) {
      fleet.titanCooldown = Math.max(0, fleet.titanCooldown - dt);
    }
  }

  // ─── Fuel burn (energy while moving) ──────────────────────────────────────

  _tickFuelBurn(fleet, dt) {
    if (fleet.state !== 'moving') return;
    const aliveCount = fleet.ships.filter(s => s.hp > 0).length;
    if (aliveCount === 0) return;

    const burn = FUEL_BURN_RATE * aliveCount * dt;
    gameState.updateFleetSupply(fleet.id, 'energy', -burn);

    // Halt fleet if energy depleted
    if (fleet.supply.energy.amount <= 0 && fleet.state === 'moving') {
      fleet.state   = 'orbiting';
      fleet.waypoint = null;
      gameState.emit('playerFleetStalled', { fleetId: fleet.id });
    }
  }

  // ─── Ammo burn (ore while engaged) ────────────────────────────────────────

  _tickAmmoBurn(fleet, dt) {
    if (fleet.state !== 'engaged') return;
    const aliveCount = fleet.ships.filter(s => s.hp > 0).length;
    if (aliveCount === 0) return;

    const burn = AMMO_BURN_RATE * aliveCount * dt;
    gameState.updateFleetSupply(fleet.id, 'ore', -burn);
  }

  // ─── Carrier combat resupply (ore restoration while engaged) ───────────────

  _tickCombatCarrierResupply(fleet, dt) {
    if (fleet.state !== 'engaged') return;
    if (!this._fleetHasCarrier(fleet)) return;

    const restore = CARRIER_COMBAT_RESUPPLY * dt;
    gameState.updateFleetSupply(fleet.id, 'ore', restore);

    // Amber supply beam visual — throttled by caller via event
    if (fleet.supply.ore.amount < fleet.supply.ore.max) {
      gameState.emit('carrierSupplyBeam', { fleetId: fleet.id, type: 'combat' });
    }
  }

  // ─── Orbit resupply ────────────────────────────────────────────────────────

  _tickResupply(fleet, dt) {
    if (fleet.state !== 'orbiting') return;
    if (!this._isNearOwnBase(fleet)) return;

    const hasCarrier = this._fleetHasCarrier(fleet);
    let mult = hasCarrier ? CARRIER_RESUPPLY_MULT : 1.0;
    // Apply supply regen debuff from void-type stations (fix M7)
    if (fleet.supplyRegenDebuff) mult *= fleet.supplyRegenDebuff;
    const rate = RESUPPLY_RATE * mult * dt;

    const oreNotFull    = fleet.supply.ore.amount    < fleet.supply.ore.max;
    const energyNotFull = fleet.supply.energy.amount < fleet.supply.energy.max;

    if (oreNotFull)    gameState.updateFleetSupply(fleet.id, 'ore',    rate);
    if (energyNotFull) gameState.updateFleetSupply(fleet.id, 'energy', rate);

    // Green/amber supply beam visual when Carrier is actively filling up
    if (hasCarrier && (oreNotFull || energyNotFull)) {
      gameState.emit('carrierSupplyBeam', { fleetId: fleet.id, type: 'orbit' });
    }
  }

  // ─── Friendly station resupply ─────────────────────────────────────────────

  /**
   * Resupply fleet when orbiting within range of a friendly orbital station
   * (planet-anchored Station3D, distinct from military base).
   * Uses the same RESUPPLY_RATE as military-base resupply.
   */
  _tickFriendlyStationResupply(fleet, dt) {
    if (fleet.state !== 'orbiting') return;

    // Don't double-resupply if already near own military base (BUG-K: check early, before loop)
    if (this._isNearOwnBase(fleet)) return;

    const STATION_RESUPPLY_DIST = 25; // station orbits at ~15u; use generous radius
    const r2 = STATION_RESUPPLY_DIST * STATION_RESUPPLY_DIST;

    for (const planetId of gameState.ownedPlanets) {
      const posFn = gameState._stationPosFns?.[planetId];
      if (!posFn) continue;
      const p = posFn();
      if (!p) continue;
      const dx = fleet.position.x - p.x;
      const dz = fleet.position.z - p.z;
      if (dx * dx + dz * dz >= r2) continue;

      // Apply supply regen debuff from void-type stations (fix M7)
      let rateMult = 1.0;
      if (fleet.supplyRegenDebuff) rateMult *= fleet.supplyRegenDebuff;
      const rate = RESUPPLY_RATE * rateMult * dt;
      const oreNotFull    = fleet.supply.ore.amount    < fleet.supply.ore.max;
      const energyNotFull = fleet.supply.energy.amount < fleet.supply.energy.max;

      if (oreNotFull)    gameState.updateFleetSupply(fleet.id, 'ore',    rate);
      if (energyNotFull) gameState.updateFleetSupply(fleet.id, 'energy', rate);

      if (oreNotFull || energyNotFull) {
        gameState.emit('fleetResupplied', { fleetId: fleet.id, planetId });
      }
      return;
    }
  }

  // ─── Public helper for FleetCombatSystem ──────────────────────────────────

  /**
   * Returns DPS multiplier based on current ore supply.
   * 1.0 normally; DPS_PENALTY_MULT when ore < DPS_PENALTY_THRESHOLD.
   * @param {string} fleetId
   * @returns {number}
   */
  getDPSMultiplier(fleetId) {
    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet?.supply?.ore) return 1.0;
    const { amount, max } = fleet.supply.ore;
    if (max > 0 && amount / max < DPS_PENALTY_THRESHOLD) return DPS_PENALTY_MULT;
    return 1.0;
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  _fleetHasCarrier(fleet) {
    return fleet.ships.some(s => s.hp > 0 && MILITARY_SHIPS[s.type]?.combatBehavior === 'support');
  }

  /**
   * Returns true if the fleet's position is within RESUPPLY_DIST world units
   * of any owned planet's military base (using registered position functions).
   */
  _isNearOwnBase(fleet) {
    const r2 = RESUPPLY_DIST * RESUPPLY_DIST;
    for (const planetId of gameState.ownedPlanets) {
      const posFn = gameState._militaryBasePosFns?.[planetId];
      if (!posFn) continue;
      const p = posFn();
      if (!p) continue;
      const dx = fleet.position.x - p.x;
      const dz = fleet.position.z - p.z;
      if (dx * dx + dz * dz < r2) return true;
    }
    return false;
  }
}
