import { PLANETS } from './planets.js';
import { BASE_UPGRADES, countTechLevels, getSpeedMult, getLoadMult } from './upgrades.js';

/**
 * Per-second production rates for a planet.
 *
 * Pulled out of ProductionSystem so the same numbers serve three callers that
 * used to have no way to agree: the live tick, the offline catch-up, and the
 * unit tests. The functions here are pure — they read state, never write it,
 * and never touch a silo — so capacity clamping stays with whoever is applying
 * the result.
 *
 * `gs` is the game state (the singleton in the game, a stub in tests). Only
 * `unlockedTech` and the `getTech*Mult` accessors are used.
 */

export const BASE_ORE_RATE     = 0.5;  // ore/s per miner at speed=1, load=1, 1 zone
export const BASE_ENERGY_RATE  = 0.4;  // energy/s per energy bot, same conditions
export const BASE_CRYSTAL_RATE = 0.2;  // crystal/s per miner on a crystal world
export const SCOUT_UNLOCK_TIME = 120;  // seconds of scouting per deposit zone

const PASSIVE_RATES = (BASE_UPGRADES.find(u => u.id === 'base_passive') || {}).passiveRate || [2, 8, 30];

/**
 * Resource output per second for one planet.
 * @returns {{ore:number, energy:number, crystal:number}} — all >= 0
 */
export function planetProductionRates(planetId, ps, gs) {
  const out = { ore: 0, energy: 0, crystal: 0 };
  const def = PLANETS.find(p => p.id === planetId);
  if (!def || !ps || !ps.hasBase) return out;

  const oreZones     = ps.deposits?.ore?.unlocked ?? 0;
  const energyZones  = ps.deposits?.energy?.unlocked ?? 0;
  const crystalZones = ps.deposits?.crystal?.unlocked ?? 0;

  const miners = ps.robots?.miner?.count ?? 0;
  if (miners > 0) {
    const speed = getSpeedMult(countTechLevels(gs.unlockedTech, 'miner_speed'));
    const load  = getLoadMult(countTechLevels(gs.unlockedTech, 'miner_load'));
    out.ore = miners * BASE_ORE_RATE * speed * load
            * def.planetMult.ore * Math.max(1, oreZones) * gs.getTechOreMult();

    // Crystal needs an actually surveyed crystal zone — no `Math.max(1, …)` here.
    if (crystalZones > 0) {
      out.crystal = miners * BASE_CRYSTAL_RATE * speed * load
                  * def.planetMult.crystal * crystalZones * gs.getTechCrystalMult();
    }
  }

  const energyBots = ps.robots?.energyBot?.count ?? 0;
  if (energyBots > 0) {
    const speed = getSpeedMult(countTechLevels(gs.unlockedTech, 'energy_speed'));
    const load  = getLoadMult(countTechLevels(gs.unlockedTech, 'energy_load'));
    out.energy = energyBots * BASE_ENERGY_RATE * speed * load
               * def.planetMult.energy * Math.max(1, energyZones) * gs.getTechEnergyMult();
  }

  const passiveLv = ps.baseLevels?.passiveEnergy ?? 0;
  if (passiveLv > 0) {
    out.energy += PASSIVE_RATES[passiveLv - 1] + gs.getTechPassiveBonus();
  }

  return out;
}

/**
 * Deposit-survey progress per second, in the same units as `depositProgress`
 * (which unlocks a zone at SCOUT_UNLOCK_TIME).
 */
export function scoutProgressRate(ps, gs) {
  const scouts = ps?.robots?.scout?.count ?? 0;
  if (scouts <= 0) return 0;
  return scouts * getSpeedMult(countTechLevels(gs.unlockedTech, 'scout_speed')) * gs.getTechScoutMult();
}
