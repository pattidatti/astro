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
    const mb = ps.militaryBase;
    if (!mb || !mb.built) return;

    const PUMP_RATE = 2.0; // resources/second per type (ore + energy)

    for (const res of ['ore', 'energy']) {
      const planetSilo = ps.silos[res];
      const baseSilo   = mb.silo[res];
      if (!planetSilo || !baseSilo) continue;
      if (planetSilo.amount <= 0) continue;
      if (baseSilo.amount >= baseSilo.capacity) continue;

      const pump = Math.min(
        PUMP_RATE * dt,
        planetSilo.amount,
        baseSilo.capacity - baseSilo.amount,
      );
      if (pump <= 0) continue;

      planetSilo.amount -= pump;
      baseSilo.amount   += pump;
    }

    // Throttle elevator silo events — emit at most every 10 frames
    // (PlanetPanel already rate-limits silo display to 0.1s, so no visual difference)
    this._elevatorEmitCounter = (this._elevatorEmitCounter || 0) + 1;
    if (this._elevatorEmitCounter >= 10) {
      this._elevatorEmitCounter = 0;
      gameState.emit('siloChanged', { planetId });
      gameState.emit('militaryBaseSiloChanged', { planetId });
    }
  }

  _tickPlanet(dt, planetId, ps, def) {
    const result = { ore: 0, energy: 0, crystal: 0 };

    const oreZones     = ps.deposits.ore.unlocked;
    const energyZones  = ps.deposits.energy.unlocked;
    const crystalZones = ps.deposits.crystal.unlocked;

    // ── Ore production (miners) ───────────────────────────────────────────
    if (ps.robots.miner.count > 0 && gameState.siloHasRoom(planetId, 'ore')) {
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      const techMult = gameState.getTechOreMult();
      const rate = count * BASE_ORE_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                   * def.planetMult.ore * Math.max(1, oreZones) * techMult;
      const added = gameState.addToSilo(planetId, 'ore', rate * dt);
      result.ore = added;
    }

    // ── Energy production (energy bots + passive) ─────────────────────────
    {
      let energyRate = 0;

      if (ps.robots.energyBot.count > 0 && gameState.siloHasRoom(planetId, 'energy')) {
        const { count, speedLevel, loadLevel } = ps.robots.energyBot;
        const techMult = gameState.getTechEnergyMult();
        energyRate += count * BASE_ENERGY_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                      * def.planetMult.energy * Math.max(1, energyZones) * techMult;
      }

      // Passive energy from base upgrade + tech bonus
      const passiveLv = ps.baseLevels.passiveEnergy;
      if (passiveLv > 0) {
        energyRate += passiveEnergyRates[passiveLv - 1] + gameState.getTechPassiveBonus();
      }

      if (energyRate > 0 && gameState.siloHasRoom(planetId, 'energy')) {
        const added = gameState.addToSilo(planetId, 'energy', energyRate * dt);
        result.energy = added;
      }
    }

    // ── Crystal production (miners on crystal-capable planets) ────────────
    if (crystalZones > 0 && ps.robots.miner.count > 0 && gameState.siloHasRoom(planetId, 'crystal')) {
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      const techMult = gameState.getTechCrystalMult();
      const rate = count * BASE_CRYSTAL_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                   * def.planetMult.crystal * crystalZones * techMult;
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
    const progressRate = count * getSpeedMult(speedLevel) * gameState.getTechScoutMult();

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
