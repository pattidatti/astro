import { gameState, getSpeedMult, getLoadMult } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { BASE_UPGRADES } from '../data/upgrades.js';

const _storageUpg = BASE_UPGRADES.find(u => u.effect === 'storage') || { capacityBonus: [] };
function _calcCrystalCapacity(storageLevel) {
  let cap = 500;
  for (let i = 0; i < storageLevel; i++) cap += (_storageUpg.capacityBonus[i] || 0);
  return cap;
}

const BASE_ORE_RATE    = 0.5;  // ore/s per miner at speed=1, load=1, 1 zone
const BASE_ENERGY_RATE = 0.4;  // energy/s per energy bot at speed=1, load=1, 1 zone
const BASE_CRYSTAL_RATE = 0.2; // crystal/s per miner on crystal planet, 1 zone
const SCOUT_UNLOCK_TIME = 120; // seconds for a scout to unlock one deposit zone

const passiveEnergyRates = (BASE_UPGRADES.find(u => u.id === 'base_passive') || {}).passiveRate || [2, 8, 30];

export class ProductionSystem {
  constructor(animationLoop) {
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const delta = {};

    for (const planetId of gameState.ownedPlanets) {
      const ps = gameState.getPlanetState(planetId);
      if (!ps || !ps.hasBase) continue;

      const def = PLANETS.find(p => p.id === planetId);
      if (!def) continue;

      delta[planetId] = this._tickPlanet(dt, planetId, ps, def);
    }

    gameState.emit('productionTick', delta);
  }

  _tickPlanet(dt, planetId, ps, def) {
    const result = { ore: 0, energy: 0, crystal: 0 };

    const oreZones     = ps.deposits.ore.unlocked;
    const energyZones  = ps.deposits.energy.unlocked;
    const crystalZones = ps.deposits.crystal.unlocked;

    // ── Ore production (miners) ───────────────────────────────────────────
    if (ps.robots.miner.count > 0 && gameState.siloHasRoom(planetId, 'ore')) {
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      const rate = count * BASE_ORE_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                   * def.planetMult.ore * Math.max(1, oreZones);
      const added = gameState.addToSilo(planetId, 'ore', rate * dt);
      result.ore = added;
    }

    // ── Energy production (energy bots + passive) ─────────────────────────
    {
      let energyRate = 0;

      if (ps.robots.energyBot.count > 0 && gameState.siloHasRoom(planetId, 'energy')) {
        const { count, speedLevel, loadLevel } = ps.robots.energyBot;
        energyRate += count * BASE_ENERGY_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                      * def.planetMult.energy * Math.max(1, energyZones);
      }

      // Passive energy from base upgrade
      const passiveLv = ps.baseLevels.passiveEnergy;
      if (passiveLv > 0) {
        energyRate += passiveEnergyRates[passiveLv - 1];
      }

      if (energyRate > 0 && gameState.siloHasRoom(planetId, 'energy')) {
        const added = gameState.addToSilo(planetId, 'energy', energyRate * dt);
        result.energy = added;
      }
    }

    // ── Crystal production (miners on crystal-capable planets) ────────────
    if (crystalZones > 0 && ps.robots.miner.count > 0 && gameState.siloHasRoom(planetId, 'crystal')) {
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      const rate = count * BASE_CRYSTAL_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                   * def.planetMult.crystal * crystalZones;
      const added = gameState.addToSilo(planetId, 'crystal', rate * dt);
      result.crystal = added;
    }

    // ── Scout deposit unlock progress ─────────────────────────────────────
    if (ps.robots.scout.count > 0) {
      this._tickScouts(dt, planetId, ps, def);
    }

    return result;
  }

  _tickScouts(dt, planetId, ps, def) {
    const { count, speedLevel } = ps.robots.scout;
    const progressRate = count * getSpeedMult(speedLevel);

    for (const resource of ['ore', 'crystal', 'energy']) {
      const dep = ps.deposits[resource];
      if (!dep || dep.unlocked >= dep.zones) continue;

      ps.depositProgress[resource] = (ps.depositProgress[resource] || 0) + progressRate * dt;

      if (ps.depositProgress[resource] >= SCOUT_UNLOCK_TIME) {
        ps.depositProgress[resource] = 0;
        dep.unlocked++;

        // Unlock crystal silo if it was locked — match current storage level
        if (resource === 'crystal' && ps.silos.crystal.capacity === 0) {
          ps.silos.crystal.capacity = _calcCrystalCapacity(ps.baseLevels.storage);
        }

        gameState.emit('depositUnlocked', { planetId, resource, zones: dep.unlocked });
      }
    }
  }
}
