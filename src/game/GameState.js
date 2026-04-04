import { PLANETS } from './data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from './data/upgrades.js';
import { DEFENSE_TYPES, DEFENSE_UPGRADES, ACTIVE_ABILITIES, BASE_STATION_HP,
         BUILDER_REPAIR_RATE, RECOLONIZE_COST_MULT, FALL_ROBOT_SURVIVAL } from './data/defenses.js';
import { ENEMY_TYPES } from './data/enemies.js';
import { TECH_NODES, TECH_BY_ID, FREE_TECH_IDS, getMaxColonyShipsInFlight } from './data/techTree.js';
import { MILITARY_SHIPS } from './data/militaryShips.js';
import { MILITARY_BASE_HP, MILITARY_BASE_MAX_HP, CRYSTAL_LASER_AMMO_MULT } from './data/fleetCombatStats.js';
import {
  SUPPLY_ENERGY_PER_SHIP_BASE, SUPPLY_ORE_PER_SHIP_BASE,
  QUANTUM_FUEL_ENERGY_MULT,
  TITAN_ULTIMATE_COOLDOWN, TITAN_ULTIMATE_COST_ORE,
} from './data/militaryStats.js';

const SAVE_VERSION = 5;

/**
 * Compute max energy and ore supply capacity for a fleet based on ship count and tech.
 * Called both on fleet creation and during v5 save migration.
 */
function computeFleetSupplyMax(ships, unlockedTech) {
  const count = Math.max(1, ships.length);
  const hasQuantumFuel   = unlockedTech?.has('quantum_fuel') ?? false;
  const hasCrystalLasers = unlockedTech?.has('pure_crystal_lasers') ?? false;
  const energyMax = Math.round(count * SUPPLY_ENERGY_PER_SHIP_BASE * (hasQuantumFuel ? QUANTUM_FUEL_ENERGY_MULT : 1.0));
  const oreMax    = Math.round(count * SUPPLY_ORE_PER_SHIP_BASE    * (hasCrystalLasers ? CRYSTAL_LASER_AMMO_MULT : 1.0));
  return { energyMax, oreMax };
}

const COLONY_SHIP_BASE_BUILD_COST = 5000;  // ore
const COLONY_SHIP_COST_SCALE = 1.5;        // exponential multiplier per planet colonized
const COLONY_SHIP_BUILD_TIME = 20;          // seconds
const COLONY_LAUNCH_BASE_COST = 50;         // base energy cost for launch
const COLONY_LAUNCH_DIST_MULT = 0.3;        // energy per orbit-radius unit

const MILITARY_BASE_ORE_COST    = 2000;
const MILITARY_BASE_ENERGY_COST = 1500;
const HANGAR_BASE_ENERGY_COST   = 1000; // + 500 per hangar already built
const HANGAR_MAX                = 5;
const HANGAR_FLEET_CAP          = 10;   // fleet cap per hangar (base)
const HANGAR_FLEET_CAP_UPG      = 15;  // fleet cap per hangar with fleet_formations tech

/** Ore cost to build a colony ship, scales exponentially with planetsColonized */
export function getColonyShipBuildCost(planetsColonized = 0) {
  return { ore: Math.round(COLONY_SHIP_BASE_BUILD_COST * Math.pow(COLONY_SHIP_COST_SCALE, planetsColonized)) };
}

/** Energy cost to launch a colony ship based on orbit-radius distance */
export function colonyLaunchEnergyCost(distance) {
  return Math.ceil(COLONY_LAUNCH_BASE_COST + distance * COLONY_LAUNCH_DIST_MULT);
}

/** Travel duration in seconds based on orbit-radius distance */
export function colonyTravelDuration(distance) {
  return distance * 0.15;
}

class EventEmitter {
  constructor() { this._listeners = {}; }
  on(evt, fn) { (this._listeners[evt] ||= []).push(fn); }
  off(evt, fn) { const a = this._listeners[evt]; if (a) this._listeners[evt] = a.filter(f => f !== fn); }
  emit(evt, data) { (this._listeners[evt] || []).forEach(fn => fn(data)); }
}

/** Create a fresh per-planet state record for a given planet definition */
function makePlanetState(planetDef) {
  const baseCapacity = 500;
  return {
    hasBase: false,
    baseLevels: { storage: 0, shipSpeed: 0, shipSlots: 0, passiveEnergy: 0 },
    silos: {
      ore:     { amount: 0, capacity: baseCapacity },
      energy:  { amount: 0, capacity: baseCapacity },
      crystal: { amount: 0, capacity: planetDef.resourceTypes.includes('crystal') ? baseCapacity : 0 },
    },
    robots: {
      miner:     { count: 0, speedLevel: 0, loadLevel: 0 },
      energyBot: { count: 0, speedLevel: 0, loadLevel: 0 },
      builder:   { count: 0, speedLevel: 0, loadLevel: 0 },
      scout:     { count: 0, speedLevel: 0, loadLevel: 0 },
    },
    deposits: JSON.parse(JSON.stringify(planetDef.deposits)),
    upgradeLevels: {},
    buildQueue: [],
    colonyShipBuildQueue: [], // [{ progress: 0 }] — builds one at a time
    militaryBase: { built: false, hangars: 0, fleetCap: 0, hp: MILITARY_BASE_HP, maxHP: MILITARY_BASE_MAX_HP, silo: { ore: { amount: 0, capacity: 5000 }, energy: { amount: 0, capacity: 5000 } }, queue: [] },
    // Scout deposit unlock progress (seconds needed to unlock one zone)
    depositProgress: { ore: 0, crystal: 0, energy: 0 },
    // Combat & defense state
    combat: {
      stationHP: BASE_STATION_HP,
      stationMaxHP: BASE_STATION_HP,
      shieldHP: 0,
      shieldMaxHP: 0,
      defenses: { cannon: 0, satellite: 0, defenseShip: 0, shield: 0 },
      defenseLevels: {},       // upgradeId → level
      abilityCooldowns: { emp: 0, shieldBoost: 0, orbitalStrike: 0 },
      activeEffects: [],       // [{ type, remaining }]
      fallen: false,
    },
  };
}

class GameState extends EventEmitter {
  constructor() {
    super();
    this._initFresh();
    // Re-check tech availability when state changes that could unlock new nodes
    this.on('siloChanged', ({ resource }) => {
      if (resource === 'energy') this._checkNewTechAvailable();
    });
    this.on('focusedPlanet', () => this._checkNewTechAvailable());
    this.on('baseBuilt',     () => this._checkNewTechAvailable());
    this.on('techUnlocked',  () => this._checkNewTechAvailable());

    // When base is built on a planet, remove any waiting arrival colony ship
    this.on('baseBuilt', (planetId) => {
      const idx = this.colonyShipsArriving.findIndex(s => s.toPlanetId === planetId);
      if (idx !== -1) {
        const ship = this.colonyShipsArriving.splice(idx, 1)[0];
        this.emit('colonyShipArrived', ship);
      }
    });
    this._setupStatsTracking();
  }

  _setupStatsTracking() {
    this.on('productionTick', (delta) => {
      for (const planetId in delta) {
        const d = delta[planetId];
        this.stats.totalOreProduced += d.ore || 0;
        this.stats.totalEnergyProduced += d.energy || 0;
        this.stats.totalCrystalProduced += d.crystal || 0;
      }
    });
    this.on('shipArrived', (ship) => {
      this.stats.totalShipDeliveries++;
      this.stats.totalResourcesShipped += ship.amount || 0;
    });
    this.on('robotHired', () => {
      this.stats.totalRobotsHired++;
    });
    this.on('planetColonized', () => {
      this.stats.planetsColonized++;
    });
  }

  _initFresh() {
    this.saveVersion = SAVE_VERSION;
    this.planetState = {};
    this.ownedPlanets = ['xerion'];
    this.focusedPlanet = 'xerion';
    this.routes = [];
    this.activeShips = []; // NOT serialized — runtime only
    this.colonyShipsInOrbit = []; // [{ id, fromPlanetId }]
    this.colonyShipsInFlight = []; // [{ id, fromPlanetId, toPlanetId, duration, elapsed }]
    this.colonyShipsArriving = []; // [{ id, fromPlanetId, toPlanetId }] — in orbit at destination, waiting for base
    this.playerFleets = []; // [{ id, planetId, position, waypoint, state, ships, speed }]
    this.fleetEngagements = []; // [{ id, playerFleetId, roamingFleetId, elapsed }]
    this._militaryBasePosFns = {}; // planetId → () => THREE.Vector3 (runtime, not serialized)
    this.tutorialStep = 0;
    this.lastSaved = Date.now();

    // Global tech tree
    this.unlockedTech = new Set(FREE_TECH_IDS);
    this._newTechAvailable = false; // drives HUD pulse

    // Combat runtime state
    this.activeAttacks = [];      // [{ id, type, planetId, enemies, wave, elapsed, ... }]
    this.roamingFleets = [];      // [{ id, type, fromPlanet, toPlanet, position, speed, enemies, mothership, notified, threatLevel }]
    this.lastAttackTime = {};     // planetId → timestamp of last attack end
    this.colonizationTime = {};   // planetId → timestamp of colonization (for grace period)

    // Lifetime statistics
    this.stats = {
      totalOreProduced: 0,
      totalEnergyProduced: 0,
      totalCrystalProduced: 0,
      totalShipDeliveries: 0,
      totalResourcesShipped: 0,
      totalRobotsHired: 0,
      planetsColonized: 0,
      playTimeSeconds: 0,
    };

    // Bootstrap Xerion with starter energy (player must build base manually)
    const xerionDef = PLANETS.find(p => p.id === 'xerion');
    const ps = makePlanetState(xerionDef);
    ps.silos.energy.amount = 50;
    this.planetState['xerion'] = ps;
  }

  reset() {
    this._initFresh();
    this.emit('stateLoaded');
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  /** Current focused planet definition (for 3D/skybox use) */
  get activePlanetDef() {
    return PLANETS.find(p => p.id === this.focusedPlanet) || PLANETS[0];
  }

  /** Alias for backward compatibility */
  get activePlanet() { return this.focusedPlanet; }

  getPlanetState(planetId) {
    return this.planetState[planetId] || null;
  }

  getPlanetDef(planetId) {
    return PLANETS.find(p => p.id === planetId) || null;
  }

  /** Get the available ship slots for a planet (base level + tech bonus). */
  getShipSlots(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;
    return 1 + ps.baseLevels.shipSlots + this.getTechShipSlotBonus();
  }

  /** Count of active ship routes from a planet */
  getActiveRouteCount(fromPlanetId) {
    return this.routes.filter(r => r.fromPlanet === fromPlanetId && r.active).length;
  }

  // ─── Silo management ──────────────────────────────────────────────────────

  /**
   * Add amount to a silo. Returns actual amount added (capped by capacity).
   */
  addToSilo(planetId, resource, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;
    const silo = ps.silos[resource];
    if (!silo || silo.capacity === 0) return 0;
    const wasFull = silo.amount >= silo.capacity * 0.995;
    const space = silo.capacity - silo.amount;
    const added = Math.min(amount, space);
    if (added > 0) {
      silo.amount += added;
      this.emit('siloChanged', { planetId, resource, amount: silo.amount });
    }
    // Emit siloFull once when transitioning to full
    const isFull = silo.amount >= silo.capacity * 0.995;
    if (isFull && !wasFull) {
      this.emit('siloFull', { planetId, resource });
    }
    return added;
  }

  /**
   * Deduct amount from a silo. Returns actual amount deducted.
   */
  deductFromSilo(planetId, resource, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;
    const silo = ps.silos[resource];
    if (!silo) return 0;
    const deducted = Math.min(amount, silo.amount);
    if (deducted > 0) {
      silo.amount -= deducted;
      this.emit('siloChanged', { planetId, resource, amount: silo.amount });
    }
    return deducted;
  }

  /** Check if a silo has at least `amount` of a resource */
  siloHas(planetId, resource, amount) {
    const ps = this.getPlanetState(planetId);
    return ps ? (ps.silos[resource]?.amount ?? 0) >= amount : false;
  }

  /** Check if a silo has room for more */
  siloHasRoom(planetId, resource) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return false;
    const silo = ps.silos[resource];
    return silo && silo.capacity > 0 && silo.amount < silo.capacity;
  }

  // ─── Tech tree ────────────────────────────────────────────────────────────

  /** Returns true if the given tech node is unlocked. */
  isTechUnlocked(nodeId) {
    return this.unlockedTech.has(nodeId);
  }

  /**
   * Returns true if the node can be unlocked right now:
   *   - all prerequisites are unlocked
   *   - focused planet's energy silo has enough
   */
  canUnlockTech(nodeId) {
    const node = TECH_BY_ID[nodeId];
    if (!node || node.free || this.isTechUnlocked(nodeId)) return false;
    if (node.requires.some(r => !this.isTechUnlocked(r))) return false;
    return this.siloHas(this.focusedPlanet, 'energy', node.cost);
  }

  /**
   * Unlock a tech node. Deducts energy from focused planet.
   * Returns true on success.
   */
  unlockTech(nodeId) {
    if (!this.canUnlockTech(nodeId)) return false;
    const node = TECH_BY_ID[nodeId];
    this.deductFromSilo(this.focusedPlanet, 'energy', node.cost);
    this.unlockedTech.add(nodeId);
    this._applyTechEffects(nodeId);
    this._newTechAvailable = false;
    this._checkNewTechAvailable();
    this.emit('techUnlocked', nodeId);
    return true;
  }

  // ─── Tech bonus helpers ───────────────────────────────────────────────────

  /** Apply immediate side-effects when a node is unlocked (HP, silo capacity). */
  _applyTechEffects(nodeId) {
    const HP_DELTAS = {
      station_armor:    30,
      station_armor_2:  70,  // cumulative: +30+70 = +100
      station_armor_3:  150, // cumulative: +250
      fortress_protocol: 300, // cumulative: +550
    };
    const SILO_DELTAS = {
      ore_storage_1:    { ore: 1000 },
      ore_storage_2:    { ore: 2000 },
      ore_storage_3:    { ore: 5000 },
      energy_storage_1: { energy: 1000 },
      energy_storage_2: { energy: 2000 },
      energy_storage_3: { energy: 5000 },
      crystal_storage_1:{ crystal: 500 },
      crystal_storage_2:{ crystal: 1500 },
      mega_storage:     { ore: 5000, energy: 5000, crystal: 5000 },
    };

    if (HP_DELTAS[nodeId] !== undefined) {
      const delta = HP_DELTAS[nodeId];
      for (const pid of this.ownedPlanets) {
        const ps = this.getPlanetState(pid);
        if (!ps) continue;
        ps.combat.stationMaxHP += delta;
        // Also raise current HP proportionally if not at max
        ps.combat.stationHP = Math.min(ps.combat.stationMaxHP, ps.combat.stationHP + delta);
      }
    }

    if (SILO_DELTAS[nodeId]) {
      const deltas = SILO_DELTAS[nodeId];
      for (const pid of this.ownedPlanets) {
        const ps = this.getPlanetState(pid);
        if (!ps) continue;
        for (const [res, bonus] of Object.entries(deltas)) {
          if (ps.silos[res] && (res !== 'crystal' || ps.silos.crystal.capacity > 0)) {
            ps.silos[res].capacity += bonus;
          }
        }
      }
    }
  }

  /** Apply all currently-unlocked silo tech bonuses to a single (newly colonized) planet. */
  _applySiloBonusesToPlanet(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return;
    const SILO_NODES = [
      ['ore_storage_1',    { ore: 1000 }],
      ['ore_storage_2',    { ore: 2000 }],
      ['ore_storage_3',    { ore: 5000 }],
      ['energy_storage_1', { energy: 1000 }],
      ['energy_storage_2', { energy: 2000 }],
      ['energy_storage_3', { energy: 5000 }],
      ['crystal_storage_1',{ crystal: 500 }],
      ['crystal_storage_2',{ crystal: 1500 }],
      ['mega_storage',     { ore: 5000, energy: 5000, crystal: 5000 }],
    ];
    for (const [id, deltas] of SILO_NODES) {
      if (!this.isTechUnlocked(id)) continue;
      for (const [res, bonus] of Object.entries(deltas)) {
        if (ps.silos[res] && (res !== 'crystal' || ps.silos.crystal.capacity > 0)) {
          ps.silos[res].capacity += bonus;
        }
      }
    }
    // Also apply HP bonuses
    const hpBonus = this.getTechHPBonus();
    if (hpBonus > 0) {
      ps.combat.stationMaxHP += hpBonus;
      ps.combat.stationHP = Math.min(ps.combat.stationMaxHP, ps.combat.stationHP + hpBonus);
    }
  }

  /** Total station HP bonus from unlocked armor tech. */
  getTechHPBonus() {
    let bonus = 0;
    if (this.isTechUnlocked('station_armor'))    bonus += 30;
    if (this.isTechUnlocked('station_armor_2'))  bonus += 70;
    if (this.isTechUnlocked('station_armor_3'))  bonus += 150;
    if (this.isTechUnlocked('fortress_protocol'))bonus += 300;
    return bonus;
  }

  /** Cooldown multiplier for an ability (< 1 = shorter cooldown). */
  getTechCooldownMult(abilityId) {
    let mult = 1.0;
    if (abilityId === 'emp' && this.isTechUnlocked('emp_cooldown')) mult *= 0.75;
    if (this.isTechUnlocked('rapid_response')) mult *= 0.80;
    return mult;
  }

  /** Colony ship build time multiplier (< 1 = faster). */
  getTechColonyBuildMult() {
    let mult = 1.0;
    if (this.isTechUnlocked('colony_engineering'))  return 0.30; // -70%
    if (this.isTechUnlocked('colony_build_speed_2')) return 0.50; // -50%
    if (this.isTechUnlocked('colony_build_speed'))   return 0.70; // -30%
    return mult;
  }

  /** Colony base construction cost multiplier (< 1 = cheaper). */
  getTechColonyCostMult() {
    if (this.isTechUnlocked('colony_cost_reduction_2')) return 0.60;
    if (this.isTechUnlocked('colony_cost_reduction'))   return 0.80;
    return 1.0;
  }

  /** Recolonization cost multiplier (< 1 = cheaper). */
  getTechRecolonizeCostMult() {
    if (this.isTechUnlocked('recolonization_discount_2')) return 0.50;
    if (this.isTechUnlocked('recolonization_discount'))   return 0.70;
    return 1.0;
  }

  /** Bonus passive energy/s added globally by tech (all planets). */
  getTechPassiveBonus() {
    let bonus = 0;
    if (this.isTechUnlocked('passive_energy_2')) bonus += 2;
    if (this.isTechUnlocked('passive_energy_3')) bonus += 4; // +4 more = +6 total
    return bonus;
  }

  /** Bonus ship slots from tech (logistics_ai). */
  getTechShipSlotBonus() {
    return this.isTechUnlocked('logistics_ai') ? 1 : 0;
  }

  /** Cargo ship speed multiplier from warp_drive tech. */
  getTechShipSpeedMult() {
    return this.isTechUnlocked('warp_drive') ? 0.70 : 1.0; // 30% faster
  }

  /** Ore production multiplier from mining tech. */
  getTechOreMult() {
    if (this.isTechUnlocked('deep_mining'))         return 1.60;
    if (this.isTechUnlocked('mining_efficiency_2')) return 1.40;
    if (this.isTechUnlocked('mining_efficiency'))   return 1.20;
    return 1.0;
  }

  /** Energy production multiplier from energy tech. */
  getTechEnergyMult() {
    if (this.isTechUnlocked('neural_sync'))          return 1.60;
    if (this.isTechUnlocked('energy_efficiency_2')) return 1.40;
    if (this.isTechUnlocked('energy_efficiency'))   return 1.20;
    return 1.0;
  }

  /** Crystal production multiplier from crystal tech. */
  getTechCrystalMult() {
    return this.isTechUnlocked('crystal_focus') ? 1.30 : 1.0;
  }

  /** Scout deposit-unlock speed multiplier from deep_scan tech. */
  getTechScoutMult() {
    return this.isTechUnlocked('scout_speed') ? 1.40 : 1.0;
  }

  /**
   * Check if any not-yet-unlocked node has all prerequisites met.
   * Emits 'newTechAvailable' once when the flag transitions false → true.
   * Intentionally does NOT check affordability — pulses when a research path
   * opens up, letting the player plan even before they can afford it.
   */
  _checkNewTechAvailable() {
    const prev = this._newTechAvailable;
    this._newTechAvailable = TECH_NODES.some(n =>
      !n.free &&
      !this.isTechUnlocked(n.id) &&
      n.requires.every(r => this.isTechUnlocked(r))
    );
    if (this._newTechAvailable && !prev) {
      this.emit('newTechAvailable');
    }
  }

  // ─── Colony ship system ───────────────────────────────────────────────────

  /** Queue a colony ship build on the given planet. Cost scales with planets colonized. */
  queueColonyShipBuild(planetId) {
    if (!this.ownedPlanets.includes(planetId)) return false;
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return false;
    // Max 1 colony ship per planet (building or in orbit)
    if (ps.colonyShipBuildQueue.length > 0) return false;
    if (this.colonyShipsInOrbit.some(s => s.fromPlanetId === planetId)) return false;
    const { ore = 0, energy = 0 } = getColonyShipBuildCost(this.stats.planetsColonized);
    if (ore > 0 && !this.siloHas(planetId, 'ore', ore)) return false;
    if (energy > 0 && !this.siloHas(planetId, 'energy', energy)) return false;
    if (ore > 0) this.deductFromSilo(planetId, 'ore', ore);
    if (energy > 0) this.deductFromSilo(planetId, 'energy', energy);
    ps.colonyShipBuildQueue.push({ progress: 0 });
    this.emit('colonyShipQueued', planetId);
    return true;
  }

  /** Advance colony ship build queues. Called each frame by ProductionSystem. */
  tickColonyShipBuilds(dt) {
    for (const planetId of this.ownedPlanets) {
      const ps = this.getPlanetState(planetId);
      if (!ps?.colonyShipBuildQueue?.length) continue;
      const item = ps.colonyShipBuildQueue[0];
      item.progress += dt / this.getTechColonyBuildMult();
      if (item.progress >= COLONY_SHIP_BUILD_TIME) {
        ps.colonyShipBuildQueue.shift();
        const id = `cs-${planetId}-${Date.now()}`;
        this.colonyShipsInOrbit.push({ id, fromPlanetId: planetId });
        this.emit('colonyShipBuilt', { id, fromPlanetId: planetId });
      }
    }
  }

  /** Launch a colony ship in orbit toward a target planet. Deducts energy launch cost. */
  launchColonyShip(shipId, targetPlanetId, distance) {
    const shipIdx = this.colonyShipsInOrbit.findIndex(s => s.id === shipId);
    if (shipIdx < 0) return false;
    if (this.ownedPlanets.includes(targetPlanetId)) return false;

    const toDef = PLANETS.find(p => p.id === targetPlanetId);
    if (!toDef) return false;

    // Check max in-flight limit
    const inFlight = this.colonyShipsInFlight.length + this.colonyShipsArriving.length;
    const maxInFlight = getMaxColonyShipsInFlight(this.unlockedTech);
    if (inFlight >= maxInFlight) return false;

    const { fromPlanetId } = this.colonyShipsInOrbit[shipIdx];
    const energyCost = colonyLaunchEnergyCost(distance);
    if (!this.siloHas(fromPlanetId, 'energy', energyCost)) return false;
    this.deductFromSilo(fromPlanetId, 'energy', energyCost);

    const duration = colonyTravelDuration(distance);
    this.colonyShipsInOrbit.splice(shipIdx, 1);

    // Deferred colonization — ship must arrive first
    this.colonyShipsInFlight.push({
      id: shipId, fromPlanetId, toPlanetId: targetPlanetId,
      duration, elapsed: 0,
    });

    this.emit('colonyShipLaunched', {
      id: shipId,
      fromPlanet: fromPlanetId,
      toPlanet: targetPlanetId,
      duration,
      t: 0,
      isColony: true,
    });
    return true;
  }

  /** Advance in-flight colony ships. Called each frame by ProductionSystem. */
  tickColonyShipFlights(dt) {
    for (let i = this.colonyShipsInFlight.length - 1; i >= 0; i--) {
      const ship = this.colonyShipsInFlight[i];
      ship.elapsed += dt;
      if (ship.elapsed >= ship.duration) {
        this.colonyShipsInFlight.splice(i, 1);
        const arrived = { id: ship.id, fromPlanetId: ship.fromPlanetId, toPlanetId: ship.toPlanetId };
        this.colonyShipsArriving.push(arrived);
        this._finalizeColonization(ship.fromPlanetId, ship.toPlanetId);
        this.emit('colonyShipArriving', arrived);
      }
    }
  }

  /** Internal: initialize new planet as owned (no base — player must build manually). */
  _finalizeColonization(fromPlanetId, toPlanetId) {
    const toDef = PLANETS.find(p => p.id === toPlanetId);
    if (!toDef) return;
    const ps = makePlanetState(toDef);
    ps.hasBase = false;
    this.planetState[toPlanetId] = ps;
    this.ownedPlanets.push(toPlanetId);
    // Apply all currently-unlocked silo and HP tech bonuses to new planet
    this._applySiloBonusesToPlanet(toPlanetId);
    this.focusedPlanet = toPlanetId;
    this.emit('planetColonized', toPlanetId);
    this.emit('focusedPlanet', toPlanetId);
  }

  /** Switch focused planet (must be owned) */
  switchPlanet(planetId) {
    if (!this.ownedPlanets.includes(planetId)) return false;
    this.focusedPlanet = planetId;
    this.emit('focusedPlanet', planetId);
    this.emit('planetChanged', planetId); // backward compat for Skybox/Game.js
    return true;
  }

  // ─── Build base ───────────────────────────────────────────────────────────

  buildBase(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps || ps.hasBase) return false;
    const def = PLANETS.find(p => p.id === planetId);
    if (!def) return false;
    const costMult = this.getTechColonyCostMult();
    const oreCost    = Math.floor((def.baseCost.ore    || 0) * costMult);
    const energyCost = Math.floor((def.baseCost.energy || 0) * costMult);
    if (oreCost > 0 && !this.siloHas(planetId, 'ore', oreCost)) return false;
    if (energyCost > 0 && !this.siloHas(planetId, 'energy', energyCost)) return false;
    if (oreCost > 0) this.deductFromSilo(planetId, 'ore', oreCost);
    if (energyCost > 0) this.deductFromSilo(planetId, 'energy', energyCost);
    ps.hasBase = true;
    this.emit('baseBuilt', planetId);
    return true;
  }

  // ─── Base upgrades ────────────────────────────────────────────────────────

  baseUpgradeCost(planetId, upgradeId) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return null;
    const upg = BASE_UPGRADES.find(u => u.id === upgradeId);
    if (!upg) return null;
    const lv = ps.baseLevels[upg.effect] ?? 0;
    if (lv >= upg.maxLevel) return null;
    return { energy: upg.energyCost[lv] };
  }

  buyBaseUpgrade(planetId, upgradeId) {
    const cost = this.baseUpgradeCost(planetId, upgradeId);
    if (!cost) return false;
    if (!this.siloHas(planetId, 'energy', cost.energy)) return false;

    const ps = this.getPlanetState(planetId);
    const upg = BASE_UPGRADES.find(u => u.id === upgradeId);
    const lv = ps.baseLevels[upg.effect];

    this.deductFromSilo(planetId, 'energy', cost.energy);
    ps.baseLevels[upg.effect] = lv + 1;

    // Apply storage capacity increase
    if (upg.effect === 'storage') {
      const bonus = upg.capacityBonus[lv];
      ps.silos.ore.capacity    += bonus;
      ps.silos.energy.capacity += bonus;
      if (ps.silos.crystal.capacity > 0) ps.silos.crystal.capacity += bonus;
    }

    this.emit('baseUpgraded', { planetId, upgradeId });
    return true;
  }

  // ─── Robot management ─────────────────────────────────────────────────────

  robotHireCost(planetId, robotType) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return null;
    const action = ROBOT_ACTIONS.find(a => a.type === robotType);
    if (!action) return null;
    return { energy: action.energyCostFn(ps) };
  }

  hireRobot(planetId, robotType) {
    const cost = this.robotHireCost(planetId, robotType);
    if (!cost) return false;
    if (!this.siloHas(planetId, 'energy', cost.energy)) return false;

    this.deductFromSilo(planetId, 'energy', cost.energy);
    this.getPlanetState(planetId).robots[robotType].count++;
    this.emit('robotHired', { planetId, robotType });
    return true;
  }

  robotUpgradeCost(planetId, upgradeId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return null;
    const upg = ROBOT_UPGRADES.find(u => u.id === upgradeId);
    if (!upg) return null;
    const robot = ps.robots[upg.robotType];
    const lv = robot[upg.effect] ?? 0;
    if (lv >= upg.maxLevel) return null;
    return { energy: upg.energyCost[lv] };
  }

  buyRobotUpgrade(planetId, upgradeId) {
    const cost = this.robotUpgradeCost(planetId, upgradeId);
    if (!cost) return false;
    if (!this.siloHas(planetId, 'energy', cost.energy)) return false;

    const ps = this.getPlanetState(planetId);
    const upg = ROBOT_UPGRADES.find(u => u.id === upgradeId);
    this.deductFromSilo(planetId, 'energy', cost.energy);
    ps.robots[upg.robotType][upg.effect]++;
    this.emit('robotUpgraded', { planetId, upgradeId });
    return true;
  }

  // ─── Military Base management ──────────────────────────────────────────────

  /**
   * Build the military base on a planet.
   * Requires: tech 'military_base' unlocked, planet has a civilian base, no base already built.
   */
  buildMilitaryBase(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return false;
    if (!this.isTechUnlocked('military_base')) return false;
    if (ps.militaryBase?.built) return false;
    if (!this.siloHas(planetId, 'ore',    MILITARY_BASE_ORE_COST))    return false;
    if (!this.siloHas(planetId, 'energy', MILITARY_BASE_ENERGY_COST)) return false;

    this.deductFromSilo(planetId, 'ore',    MILITARY_BASE_ORE_COST);
    this.deductFromSilo(planetId, 'energy', MILITARY_BASE_ENERGY_COST);
    ps.militaryBase.built = true;
    this.emit('militaryBaseBuilt', planetId);
    return true;
  }

  /** Cost to build the next hangar level (scales with hangars already built). */
  militaryHangarCost(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps?.militaryBase?.built) return null;
    const hangars = ps.militaryBase.hangars || 0;
    if (hangars >= HANGAR_MAX) return null;
    return { energy: HANGAR_BASE_ENERGY_COST + 500 * hangars };
  }

  /**
   * Build a new hangar on the military base.
   * Requires: military base built, energy in planet silo.
   */
  buildHangar(planetId) {
    const cost = this.militaryHangarCost(planetId);
    if (!cost) return false;
    if (!this.siloHas(planetId, 'energy', cost.energy)) return false;

    const ps = this.getPlanetState(planetId);
    this.deductFromSilo(planetId, 'energy', cost.energy);
    ps.militaryBase.hangars++;
    // Recalculate fleet cap
    const capPerHangar = this.isTechUnlocked('fleet_formations') ? HANGAR_FLEET_CAP_UPG : HANGAR_FLEET_CAP;
    ps.militaryBase.fleetCap = ps.militaryBase.hangars * capPerHangar;
    this.emit('militaryBaseUpgraded', planetId);
    return true;
  }

  // ─── Military ship production queue ───────────────────────────────────────

  /**
   * Register a live world-position getter for a planet's military base.
   * Called by SolarSystem when the base is built or restored.
   * Used by _rallyPosition() to know where to spawn new fleets.
   */
  registerMilitaryBasePosFn(planetId, fn) {
    this._militaryBasePosFns[planetId] = fn;
  }

  unregisterMilitaryBasePosFn(planetId) {
    delete this._militaryBasePosFns[planetId];
  }

  /**
   * Queue one ship of the given type for production on a planet's military base.
   * Costs are deducted immediately from the base silo (or planet silo for crystal).
   */
  queueShipBuild(planetId, shipType) {
    const ps  = this.getPlanetState(planetId);
    const mb  = ps?.militaryBase;
    if (!mb?.built || mb.hangars === 0) return false;

    const shipDef = MILITARY_SHIPS[shipType];
    if (!shipDef) return false;
    if (!this.isTechUnlocked(shipDef.tech)) return false;

    // Check fleet cap: active + queued + new must not exceed cap
    const queuedCap = mb.queue.reduce((s, q) => s + (MILITARY_SHIPS[q.type]?.fleetCapCost ?? 0), 0);
    const activeCap = this.getUsedFleetCap(planetId);
    if (activeCap + queuedCap + shipDef.fleetCapCost > mb.fleetCap) return false;

    // Check resources
    const cost = shipDef.cost;
    if (cost.ore    && mb.silo.ore.amount    < cost.ore)    return false;
    if (cost.energy && mb.silo.energy.amount < cost.energy) return false;
    if (cost.crystal && !this.siloHas(planetId, 'crystal', cost.crystal)) return false;

    // Deduct from base silo (ore + energy), planet silo (crystal)
    if (cost.ore)    mb.silo.ore.amount    -= cost.ore;
    if (cost.energy) mb.silo.energy.amount -= cost.energy;
    if (cost.crystal) this.deductFromSilo(planetId, 'crystal', cost.crystal);

    mb.queue.push({ type: shipType, progress: 0, buildTime: shipDef.buildTime });
    this.emit('militaryShipQueued', { planetId, shipType });
    return true;
  }

  /**
   * Advance all military ship build queues by dt seconds.
   * Called by ProductionSystem each frame.
   */
  tickShipBuildQueues(dt) {
    for (const planetId of this.ownedPlanets) {
      const mb = this.getPlanetState(planetId)?.militaryBase;
      if (!mb?.built || !mb.queue.length) continue;

      const item = mb.queue[0];
      item.progress += dt;

      if (item.progress >= item.buildTime) {
        mb.queue.shift();
        this._spawnShipIntoFleet(planetId, item.type);
        this.emit('playerShipBuilt', { planetId, shipType: item.type });
      }
    }
  }

  /**
   * Spawn a completed ship into the player fleet at this planet's rally point.
   * Finds an existing orbiting fleet or creates a new one.
   */
  _spawnShipIntoFleet(planetId, shipType) {
    const shipDef = MILITARY_SHIPS[shipType];
    if (!shipDef) return;

    let fleet = this.playerFleets.find(f => f.planetId === planetId && f.state === 'orbiting');

    if (!fleet) {
      const pos = this._rallyPosition(planetId);
      fleet = {
        id:       `pf_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        planetId,
        position: pos,
        waypoint: null,
        state:    'orbiting',
        ships:    [],
        speed:    shipDef.speed,
      };
      this.playerFleets.push(fleet);
      this.emit('playerFleetSpawned', fleet);
    }

    fleet.ships.push({
      type:         shipType,
      hp:           shipDef.hp,
      maxHP:        shipDef.hp,
      fleetCapCost: shipDef.fleetCapCost,
      localPos:     { x: 0, y: 0, z: 0 }, // runtime — scattered by PlayerFleet3D on activate
      vel:          { x: 0, z: 0 },        // runtime — Boids velocity
    });
    fleet.speed = Math.min(...fleet.ships.map(s => MILITARY_SHIPS[s.type]?.speed ?? 10));

    // Update supply max when fleet composition changes
    const { energyMax, oreMax } = computeFleetSupplyMax(fleet.ships, this.unlockedTech);
    if (!fleet.supply) {
      fleet.supply = {
        ore:    { amount: oreMax,    max: oreMax    },
        energy: { amount: energyMax, max: energyMax },
      };
    } else {
      fleet.supply.ore.max    = oreMax;
      fleet.supply.energy.max = energyMax;
    }
    if (fleet.titanCooldown === undefined) fleet.titanCooldown = 0;

    this.emit('playerFleetChanged', { fleetId: fleet.id });
  }

  /**
   * World-space rally point for new fleets near a planet's military base.
   * Uses live position from registered SolarSystem getter if available.
   */
  _rallyPosition(planetId) {
    const posFn = this._militaryBasePosFns?.[planetId];
    if (posFn) {
      const p = posFn();
      if (p) return { x: p.x + 10, y: 0, z: p.z + 10 };
    }
    return { x: 10 + Math.random() * 5, y: 0, z: 10 + Math.random() * 5 };
  }

  /** Total fleet cap consumed by active fleets belonging to a planet's base. */
  getUsedFleetCap(planetId) {
    return this.playerFleets
      .filter(f => f.planetId === planetId)
      .reduce((sum, f) => sum + f.ships.reduce((s, sh) => s + (sh.fleetCapCost ?? 1), 0), 0);
  }

  /** Dispatch a fleet to a new waypoint. Sets state → 'moving'. */
  dispatchFleetWaypoint(fleetId, waypoint) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet || !fleet.ships.length) return false;
    fleet.waypoint = { x: waypoint.x, y: 0, z: waypoint.z };
    fleet.state    = 'moving';
    this.emit('playerFleetDispatched', { fleetId, waypoint: fleet.waypoint });
    return true;
  }

  /**
   * Add delta (positive = gain, negative = spend) to a fleet supply resource.
   * Clamps to [0, max]. Emits 'fleetSupplyChanged'.
   * @param {string} fleetId
   * @param {'ore'|'energy'} resource
   * @param {number} delta
   * @returns {number} new amount
   */
  updateFleetSupply(fleetId, resource, delta) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet?.supply?.[resource]) return 0;
    const s = fleet.supply[resource];
    s.amount = Math.max(0, Math.min(s.max, s.amount + delta));
    this.emit('fleetSupplyChanged', { fleetId, resource, amount: s.amount, max: s.max });
    return s.amount;
  }

  /**
   * Activate the Titan AoE Ultimate for a fleet.
   * Requires: alive Titan ship, titanCooldown === 0, sufficient ore supply.
   * @param {string} fleetId
   * @returns {boolean} true if activated
   */
  useTitanUltimate(fleetId) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return false;
    if (fleet.titanCooldown > 0) return false;
    if (!fleet.ships.some(s => s.hp > 0 && s.type === 'titan')) return false;
    if (!fleet.supply || fleet.supply.ore.amount < TITAN_ULTIMATE_COST_ORE) return false;

    fleet.supply.ore.amount -= TITAN_ULTIMATE_COST_ORE;
    fleet.titanCooldown = TITAN_ULTIMATE_COOLDOWN;
    this.emit('fleetTitanUltimate', { fleetId, position: { ...fleet.position } });
    this.emit('fleetSupplyChanged', { fleetId, resource: 'ore', amount: fleet.supply.ore.amount, max: fleet.supply.ore.max });
    return true;
  }

  // ─── Fleet engagement management ────────────────────────────────────────────

  /** Start an engagement between a player fleet and a roaming enemy fleet. */
  startFleetEngagement(playerFleetId, roamingFleetId) {
    // Prevent duplicate engagements
    if (this.getEngagementForFleet(playerFleetId)) return null;
    if (this.getEngagementForFleet(roamingFleetId)) return null;

    const fleet = this.playerFleets.find(f => f.id === playerFleetId);
    if (!fleet) return null;

    const engagement = {
      id: `eng_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      playerFleetId,
      roamingFleetId,
      elapsed: 0,
    };

    fleet.state = 'engaged';
    this.fleetEngagements.push(engagement);
    this.emit('fleetEngaged', { engagementId: engagement.id, playerFleetId, roamingFleetId });
    return engagement;
  }

  /** End an engagement and restore fleet states. */
  endFleetEngagement(engagementId, reason) {
    const idx = this.fleetEngagements.findIndex(e => e.id === engagementId);
    if (idx === -1) return;

    const engagement = this.fleetEngagements[idx];
    this.fleetEngagements.splice(idx, 1);

    // Restore player fleet state (if it still exists and has ships)
    const fleet = this.playerFleets.find(f => f.id === engagement.playerFleetId);
    if (fleet && fleet.state === 'engaged') {
      fleet.state = 'orbiting';
      fleet.waypoint = null;
    }

    // If player fleet has no ships left, remove it entirely
    if (fleet && fleet.ships.length === 0) {
      const fi = this.playerFleets.indexOf(fleet);
      if (fi !== -1) this.playerFleets.splice(fi, 1);
      this.emit('playerFleetDestroyed', { fleetId: fleet.id });
    }

    this.emit('fleetDisengaged', { engagementId, reason, playerFleetId: engagement.playerFleetId, roamingFleetId: engagement.roamingFleetId });
  }

  /** Find an active engagement for a given fleet ID (player or roaming). */
  getEngagementForFleet(fleetId) {
    return this.fleetEngagements.find(
      e => e.playerFleetId === fleetId || e.roamingFleetId === fleetId
    ) || null;
  }

  /** Apply damage to a specific ship in a player fleet. Returns remaining HP. */
  damagePlayerShip(fleetId, shipIndex, damage) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet || !fleet.ships[shipIndex]) return 0;

    const ship = fleet.ships[shipIndex];
    ship.hp = Math.max(0, ship.hp - damage);

    if (ship.hp <= 0) {
      const engagement = this.getEngagementForFleet(fleetId);
      this.emit('playerShipDestroyed', { fleetId, ship, engagementId: engagement?.id });
    } else {
      this.emit('playerShipDamaged', { fleetId, shipIndex, damage });
    }
    return ship.hp;
  }

  /** Remove dead ships from a fleet and emit change event. */
  removeDeadShips(fleetId) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;

    const before = fleet.ships.length;
    fleet.ships = fleet.ships.filter(s => s.hp > 0);
    if (fleet.ships.length !== before) {
      // Recalculate fleet speed
      if (fleet.ships.length > 0) {
        fleet.speed = Math.min(...fleet.ships.map(s => MILITARY_SHIPS[s.type]?.speed ?? 10));
      }
      this.emit('playerFleetChanged', { fleetId: fleet.id });
    }
  }

  /** Heal a player ship in a fleet. */
  healPlayerShip(fleetId, shipIndex, amount) {
    const fleet = this.playerFleets.find(f => f.id === fleetId);
    if (!fleet || !fleet.ships[shipIndex]) return;
    const ship = fleet.ships[shipIndex];
    const before = ship.hp;
    ship.hp = Math.min(ship.maxHP, ship.hp + amount);
    if (ship.hp !== before) {
      this.emit('fleetHeal', { fleetId, shipIndex, amount: ship.hp - before });
    }
  }

  /** Damage a planet's military base HP. Returns remaining HP. */
  damageMilitaryBase(planetId, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps?.militaryBase?.built) return 0;
    ps.militaryBase.hp = Math.max(0, ps.militaryBase.hp - amount);
    this.emit('militaryBaseDamaged', { planetId, damage: amount, hp: ps.militaryBase.hp });
    if (ps.militaryBase.hp <= 0) {
      this.emit('militaryBaseDestroyed', { planetId });
    }
    return ps.militaryBase.hp;
  }

  /** Repair a planet's military base HP. */
  repairMilitaryBase(planetId, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps?.militaryBase?.built) return;
    ps.militaryBase.hp = Math.min(ps.militaryBase.maxHP, ps.militaryBase.hp + amount);
  }

  // ─── Route management ─────────────────────────────────────────────────────

  addRoute(route) {
    this.routes.push(route);
    this.emit('routeAdded', route);
    return true;
  }

  removeRoute(routeId) {
    const idx = this.routes.findIndex(r => r.id === routeId);
    if (idx < 0) return false;
    // Cancel active ships for this route
    this.activeShips = this.activeShips.filter(s => s.routeId !== routeId);
    this.routes.splice(idx, 1);
    this.emit('routeRemoved', routeId);
    return true;
  }

  toggleRoute(routeId) {
    const r = this.routes.find(r => r.id === routeId);
    if (!r) return false;
    r.active = !r.active;
    this.emit('routeToggled', routeId);
    return true;
  }

  updateRoute(routeId, { resource, amount, active } = {}) {
    const route = this.routes.find(r => r.id === routeId);
    if (!route) return false;
    const resourceChanged = resource !== undefined && resource !== route.resource;
    if (resource !== undefined) route.resource = resource;
    if (amount !== undefined) route.amount = amount;
    if (active !== undefined) route.active = active;
    if (resourceChanged) {
      this.activeShips = this.activeShips.filter(s => s.routeId !== routeId);
    }
    this.emit('routeUpdated');
    this.emit('routeAdded');
    return true;
  }

  // ─── Defense management ────────────────────────────────────────────────────

  /**
   * Purchase or upgrade a defense on a planet.
   * Returns false if conditions not met.
   */
  buyDefense(planetId, defenseId) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return false;
    const defType = DEFENSE_TYPES[defenseId];
    if (!defType) return false;

    const currentLevel = ps.combat.defenses[defenseId] || 0;
    if (currentLevel >= defType.maxLevel) return false;

    const cost = defType.energyCost[currentLevel];
    if (!this.siloHas(planetId, 'energy', cost)) return false;

    this.deductFromSilo(planetId, 'energy', cost);
    ps.combat.defenses[defenseId] = currentLevel + 1;

    // Shield: update max HP and current HP
    if (defenseId === 'shield') {
      const newLevel = currentLevel + 1;
      ps.combat.shieldMaxHP = defType.shieldHP[newLevel - 1];
      ps.combat.shieldHP = ps.combat.shieldMaxHP;
    }

    this.emit('defenseBuilt', { planetId, defenseId, level: currentLevel + 1 });
    return true;
  }

  /**
   * Purchase a defense upgrade (from the defense upgrade tree).
   */
  buyDefenseUpgrade(planetId, upgradeId) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return false;
    const upg = DEFENSE_UPGRADES.find(u => u.id === upgradeId);
    if (!upg) return false;

    // Must have the defense type built first
    const defLevel = ps.combat.defenses[upg.defenseType] || 0;
    if (defLevel <= 0) return false;

    const currentLevel = ps.combat.defenseLevels[upgradeId] || 0;
    if (currentLevel >= upg.maxLevel) return false;

    const cost = upg.energyCost[currentLevel];
    if (!this.siloHas(planetId, 'energy', cost)) return false;

    this.deductFromSilo(planetId, 'energy', cost);
    ps.combat.defenseLevels[upgradeId] = currentLevel + 1;

    this.emit('defenseUpgraded', { planetId, upgradeId, level: currentLevel + 1 });
    return true;
  }

  /**
   * Activate an active ability on a planet during combat.
   */
  activateAbility(planetId, abilityId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return false;
    const ability = ACTIVE_ABILITIES[abilityId];
    if (!ability) return false;

    // Check cooldown
    if ((ps.combat.abilityCooldowns[abilityId] || 0) > 0) return false;

    // Check energy cost
    if (!this.siloHas(planetId, 'energy', ability.energyCost)) return false;

    this.deductFromSilo(planetId, 'energy', ability.energyCost);
    ps.combat.abilityCooldowns[abilityId] = ability.cooldown * this.getTechCooldownMult(abilityId);

    // Add active effect
    ps.combat.activeEffects.push({
      type: abilityId,
      remaining: ability.duration || 0,
    });

    this.emit('abilityActivated', { planetId, abilityId });
    return true;
  }

  /**
   * Apply damage to station shield first, then hull.
   * Returns remaining damage that pierced through.
   */
  damageStation(planetId, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;

    let remaining = amount;

    // Shield absorbs first
    if (ps.combat.shieldHP > 0) {
      const absorbed = Math.min(remaining, ps.combat.shieldHP);
      ps.combat.shieldHP -= absorbed;
      remaining -= absorbed;
      if (absorbed > 0) {
        this.emit('shieldDamaged', { planetId, absorbed, shieldHP: ps.combat.shieldHP });
      }
    }

    // Remaining hits hull
    if (remaining > 0) {
      ps.combat.stationHP = Math.max(0, ps.combat.stationHP - remaining);
      this.emit('stationDamaged', { planetId, damage: remaining, stationHP: ps.combat.stationHP });

      // Check for planet fall
      if (ps.combat.stationHP <= 0) {
        this.planetFall(planetId);
      }
    }

    return remaining;
  }

  /**
   * Steal resources from a planet's silo (raider attack).
   */
  stealFromSilo(planetId, resource, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;
    const stolen = this.deductFromSilo(planetId, resource, amount);
    if (stolen > 0) {
      this.emit('resourceStolen', { planetId, resource, amount: stolen });
    }
    return stolen;
  }

  /**
   * Handle planet fall — station destroyed, partial reset.
   */
  planetFall(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return;

    ps.combat.fallen = true;
    ps.hasBase = false;
    ps.combat.stationHP = 0;
    ps.combat.shieldHP = 0;

    // Robots: keep fraction alive (rounded down)
    for (const type of Object.keys(ps.robots)) {
      ps.robots[type].count = Math.floor(ps.robots[type].count * FALL_ROBOT_SURVIVAL);
    }

    // Silos: emptied
    for (const resource of Object.keys(ps.silos)) {
      ps.silos[resource].amount = 0;
    }

    // Defenses: reset to 0
    for (const key of Object.keys(ps.combat.defenses)) {
      ps.combat.defenses[key] = 0;
    }
    ps.combat.defenseLevels = {};
    ps.combat.shieldMaxHP = 0;
    ps.combat.activeEffects = [];

    // Reset military base if present
    if (ps.militaryBase) {
      ps.militaryBase.built = false;
      ps.militaryBase.silo.ore.amount = 0;
      ps.militaryBase.silo.energy.amount = 0;
      ps.militaryBase.queue = [];
      // We preserve .hangars just like we preserve regular baseLevels
    }

    // baseLevels: PRESERVED (key decision — not punitive)
    // deposits/depositProgress: PRESERVED
    // upgradeLevels (robot upgrades): PRESERVED

    // Remove routes from/to this planet
    this.routes = this.routes.filter(r => r.fromPlanet !== planetId && r.toPlanet !== planetId);
    this.activeShips = this.activeShips.filter(s => s.fromPlanet !== planetId && s.toPlanet !== planetId);

    // Clear active attacks on this planet
    this.activeAttacks = this.activeAttacks.filter(a => a.planetId !== planetId);

    this.emit('planetFell', planetId);
  }

  /**
   * Recolonize a fallen planet at reduced cost.
   * Pays from a source planet's silos.
   */
  recolonize(sourcePlanetId, targetPlanetId) {
    const targetPs = this.getPlanetState(targetPlanetId);
    if (!targetPs || !targetPs.combat.fallen) return false;

    const def = PLANETS.find(p => p.id === targetPlanetId);
    if (!def) return false;

    // Reduced cost (recolonize base mult × tech discount)
    const recolMult = RECOLONIZE_COST_MULT * this.getTechRecolonizeCostMult();
    const oreCost    = Math.floor((def.baseCost.ore    || 0) * recolMult);
    const energyCost = Math.floor((def.baseCost.energy || 0) * recolMult);

    if (oreCost > 0 && !this.siloHas(sourcePlanetId, 'ore', oreCost)) return false;
    if (energyCost > 0 && !this.siloHas(sourcePlanetId, 'energy', energyCost)) return false;

    if (oreCost > 0) this.deductFromSilo(sourcePlanetId, 'ore', oreCost);
    if (energyCost > 0) this.deductFromSilo(sourcePlanetId, 'energy', energyCost);

    targetPs.combat.fallen = false;
    targetPs.hasBase = true;
    targetPs.combat.stationHP = BASE_STATION_HP;

    this.colonizationTime[targetPlanetId] = Date.now();
    this.emit('planetRecolonized', { planetId: targetPlanetId, sourcePlanetId });
    return true;
  }

  /**
   * Repair station HP (called by builder robots via CombatSystem).
   */
  repairStation(planetId, amount) {
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return 0;
    const repairAmount = Math.min(amount, ps.combat.stationMaxHP - ps.combat.stationHP);
    if (repairAmount <= 0) return 0;
    ps.combat.stationHP += repairAmount;
    this.emit('repairTick', { planetId, amount: repairAmount, stationHP: ps.combat.stationHP });
    return repairAmount;
  }

  /**
   * Tick ability cooldowns for a planet.
   */
  tickAbilityCooldowns(planetId, dt) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return;

    // Tick cooldowns
    for (const id of Object.keys(ps.combat.abilityCooldowns)) {
      if (ps.combat.abilityCooldowns[id] > 0) {
        ps.combat.abilityCooldowns[id] = Math.max(0, ps.combat.abilityCooldowns[id] - dt);
        if (ps.combat.abilityCooldowns[id] <= 0) {
          this.emit('abilityReady', { planetId, abilityId: id });
        }
      }
    }

    // Tick active effects
    for (let i = ps.combat.activeEffects.length - 1; i >= 0; i--) {
      const eff = ps.combat.activeEffects[i];
      eff.remaining -= dt;
      if (eff.remaining <= 0) {
        ps.combat.activeEffects.splice(i, 1);
        this.emit('effectExpired', { planetId, type: eff.type });
      }
    }
  }

  /**
   * Check if a planet has an active effect of the given type.
   */
  hasActiveEffect(planetId, effectType) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return false;
    return ps.combat.activeEffects.some(e => e.type === effectType);
  }

  /**
   * Check if a planet is currently under attack.
   */
  isUnderAttack(planetId) {
    return this.activeAttacks.some(a => a.planetId === planetId);
  }

  // ─── Stub tick (production handled by ProductionSystem) ───────────────────

  tick(_dt) {
    // No-op — ProductionSystem and RouteSystem register their own onUpdate callbacks
  }

  // ─── Serialization ────────────────────────────────────────────────────────

  serialize() {
    // Serialize active attacks (strip runtime-only fields, keep essentials)
    const attacks = this.activeAttacks.map(a => ({
      id: a.id,
      type: a.type,
      planetId: a.planetId,
      wave: a.wave,
      elapsed: a.elapsed,
      enemies: a.enemies.map(e => ({ type: e.type, hp: e.hp, damage: e.damage, target: e.target, stealRate: e.stealRate || 0 })),
      mothership: a.mothership ? { hp: a.mothership.hp, maxHP: a.mothership.maxHP } : null,
      template: a.template,
    }));

    return {
      saveVersion: SAVE_VERSION,
      planetState: JSON.parse(JSON.stringify(this.planetState)),
      ownedPlanets: this.ownedPlanets.slice(),
      focusedPlanet: this.focusedPlanet,
      routes: JSON.parse(JSON.stringify(this.routes)),
      colonyShipsInOrbit: JSON.parse(JSON.stringify(this.colonyShipsInOrbit)),
      colonyShipsInFlight: JSON.parse(JSON.stringify(this.colonyShipsInFlight)),
      colonyShipsArriving: JSON.parse(JSON.stringify(this.colonyShipsArriving)),
      playerFleets: this.playerFleets.map(f => ({
        ...f,
        supply: f.supply ? JSON.parse(JSON.stringify(f.supply)) : null,
        titanCooldown: f.titanCooldown ?? 0,
        ships: f.ships.map(s => ({
          type: s.type, hp: s.hp, maxHP: s.maxHP, fleetCapCost: s.fleetCapCost,
          // localPos and vel are runtime-only — not saved
        })),
      })),
      fleetEngagements: JSON.parse(JSON.stringify(this.fleetEngagements)),
      activeAttacks: attacks,
      roamingFleets: JSON.parse(JSON.stringify(this.roamingFleets)),
      lastAttackTime: { ...this.lastAttackTime },
      colonizationTime: { ...this.colonizationTime },
      tutorialStep: this.tutorialStep,
      stats: { ...this.stats },
      unlockedTech: Array.from(this.unlockedTech),
      lastSaved: Date.now(),
    };
  }

  deserialize(data) {
    if (!data) return;

    // Migrate v1 saves (flat global counters) → v2
    if (!data.saveVersion || data.saveVersion < 2) {
      this._migratev1(data);
      return;
    }

    this.planetState         = data.planetState ?? {};
    this.ownedPlanets        = data.ownedPlanets ?? ['xerion'];
    this.focusedPlanet       = data.focusedPlanet ?? 'xerion';
    this.routes              = data.routes ?? [];
    this.activeShips         = []; // reconstructed by RouteSystem
    this.colonyShipsInOrbit  = data.colonyShipsInOrbit ?? [];
    this.colonyShipsInFlight = data.colonyShipsInFlight ?? [];
    this.colonyShipsArriving = data.colonyShipsArriving ?? [];
    this.playerFleets        = data.playerFleets ?? [];
    this.fleetEngagements    = data.fleetEngagements ?? [];
    // Re-init runtime-only per-ship fields stripped during serialization
    for (const fleet of this.playerFleets) {
      for (const ship of fleet.ships) {
        if (!ship.localPos) ship.localPos = { x: 0, y: 0, z: 0 };
        if (!ship.vel)      ship.vel      = { x: 0, z: 0 };
      }
    }
    this._militaryBasePosFns = {}; // always reset on load
    this.activeAttacks       = data.activeAttacks ?? [];
    this.roamingFleets       = data.roamingFleets ?? [];
    this.lastAttackTime      = data.lastAttackTime ?? {};
    this.colonizationTime    = data.colonizationTime ?? {};
    this.tutorialStep   = data.tutorialStep ?? -1; // assume tutorial complete for existing saves
    this.stats = data.stats ?? {
      totalOreProduced: 0, totalEnergyProduced: 0, totalCrystalProduced: 0,
      totalShipDeliveries: 0, totalResourcesShipped: 0, totalRobotsHired: 0,
      planetsColonized: 0, playTimeSeconds: 0,
    };
    this.lastSaved      = data.lastSaved ?? Date.now();

    // Ensure Xerion always has a state entry
    if (!this.planetState['xerion']) {
      const ps = makePlanetState(PLANETS.find(p => p.id === 'xerion'));
      ps.hasBase = true;
      this.planetState['xerion'] = ps;
    }

    // Backwards compat: ensure colonyShipBuildQueue exists on all planet states
    // v2→v3 migration: ensure combat fields exist on all planet states
    // v3→v4 migration: ensure militaryBase exists on all planet states
    for (const ps of Object.values(this.planetState)) {
      if (!ps.colonyShipBuildQueue) ps.colonyShipBuildQueue = [];
      if (!ps.militaryBase) {
        ps.militaryBase = { built: false, hangars: 0, fleetCap: 0, hp: MILITARY_BASE_HP, maxHP: MILITARY_BASE_MAX_HP, silo: { ore: { amount: 0, capacity: 5000 }, energy: { amount: 0, capacity: 5000 } }, queue: [] };
      }
      // Ensure military base has HP fields (v4 migration)
      if (ps.militaryBase && ps.militaryBase.hp === undefined) {
        ps.militaryBase.hp = MILITARY_BASE_HP;
        ps.militaryBase.maxHP = MILITARY_BASE_MAX_HP;
      }
      if (!ps.combat) {
        ps.combat = {
          stationHP: BASE_STATION_HP,
          stationMaxHP: BASE_STATION_HP,
          shieldHP: 0,
          shieldMaxHP: 0,
          defenses: { cannon: 0, satellite: 0, defenseShip: 0, shield: 0 },
          defenseLevels: {},
          abilityCooldowns: { emp: 0, shieldBoost: 0, orbitalStrike: 0 },
          activeEffects: [],
          fallen: false,
        };
      }
    }

    // Tech tree — load saved unlocks + always include free nodes
    const savedTech = data.unlockedTech ?? null;
    this.unlockedTech = new Set([...FREE_TECH_IDS, ...(savedTech ?? [])]);

    // Retroactive grants for saves that predate the tech tree
    if (!savedTech) {
      for (const pid of this.ownedPlanets) {
        const ps = this.planetState[pid];
        if (!ps) continue;
        if ((ps.robots.energyBot.speedLevel || 0) > 0 || (ps.robots.energyBot.loadLevel || 0) > 0)
          this.unlockedTech.add('energy_upgrades');
        if ((ps.baseLevels.shipSpeed || 0) > 0)    this.unlockedTech.add('base_shipspeed');
        if ((ps.baseLevels.shipSlots || 0) > 0)    { this.unlockedTech.add('base_shipspeed'); this.unlockedTech.add('base_shipslots'); }
        if ((ps.baseLevels.passiveEnergy || 0) > 0) this.unlockedTech.add('base_passive');
        if ((ps.combat?.defenses?.satellite || 0) > 0)   { this.unlockedTech.add('satellite'); }
        if ((ps.combat?.defenses?.defenseShip || 0) > 0) this.unlockedTech.add('patrol_craft');
        if ((ps.combat?.defenses?.shield || 0) > 0)      { this.unlockedTech.add('satellite'); this.unlockedTech.add('shield'); }
        // Defense upgrade tech grants — based on actually purchased upgrade levels
        const dl = ps.combat?.defenseLevels || {};
        if ((dl.cannon_damage || 0) > 0 || (dl.cannon_firerate || 0) > 0)
          { this.unlockedTech.add('satellite'); this.unlockedTech.add('cannon_upgrades'); }
        if ((dl.sat_damage || 0) > 0 || (dl.sat_firerate || 0) > 0)
          { this.unlockedTech.add('satellite'); this.unlockedTech.add('satellite_upgrades'); }
        if ((dl.ship_damage || 0) > 0 || (dl.ship_armor || 0) > 0)
          { this.unlockedTech.add('patrol_craft'); this.unlockedTech.add('patrol_upgrades'); }
        if ((dl.shield_capacity || 0) > 0 || (dl.shield_regen || 0) > 0)
          { this.unlockedTech.add('satellite'); this.unlockedTech.add('shield'); this.unlockedTech.add('shield_upgrades'); }
      }
      if (this.colonyShipsInOrbit.length > 0 || this.colonyShipsInFlight.length > 0 ||
          this.colonyShipsArriving.length > 0 || this.ownedPlanets.length > 1) {
        this.unlockedTech.add('colony_ship');
      }
      // Grant cargo_ships if any routes exist or multiple planets owned
      if (this.routes.length > 0 || this.ownedPlanets.length > 1) {
        this.unlockedTech.add('cargo_ships');
      }
    }

    // v4→v5 migration: initialize supply and titanCooldown on all fleets.
    // Must be placed after unlockedTech is populated above so computeFleetSupplyMax
    // can apply tech bonuses (quantum_fuel, pure_crystal_lasers) correctly.
    for (const fleet of this.playerFleets) {
      if (!fleet.supply) {
        const { energyMax, oreMax } = computeFleetSupplyMax(fleet.ships, this.unlockedTech);
        fleet.supply = {
          ore:    { amount: oreMax,    max: oreMax    },
          energy: { amount: energyMax, max: energyMax },
        };
      }
      if (fleet.titanCooldown === undefined) fleet.titanCooldown = 0;
    }

    this.emit('stateLoaded');
    this.emit('robotHired', { planetId: this.focusedPlanet });
    this.emit('focusedPlanet', this.focusedPlanet);
    this.emit('planetChanged', this.focusedPlanet);
  }

  _migratev1(v1) {
    // Old save had: ore, crystal, energy, robots, ownedPlanets, activePlanet
    this._initFresh();
    this.tutorialStep = -1; // skip tutorial for returning players

    const ownedPlanets = v1.ownedPlanets || ['xerion'];
    const activePlanet = v1.activePlanet || 'xerion';

    this.ownedPlanets = ownedPlanets;
    this.focusedPlanet = activePlanet;

    // Give each owned planet a base and seed the active planet with some ore
    for (const pid of ownedPlanets) {
      const def = PLANETS.find(p => p.id === pid);
      if (!def) continue;
      const ps = makePlanetState(def);
      ps.hasBase = true;
      // Seed ore from old global ore (distributed to focused planet only)
      if (pid === activePlanet) {
        const oreAmt = Math.min(v1.ore || 0, ps.silos.ore.capacity);
        ps.silos.ore.amount = oreAmt;
        const energyAmt = Math.min(v1.energy || 0, ps.silos.energy.capacity);
        ps.silos.energy.amount = energyAmt;
      }
      this.planetState[pid] = ps;
    }

    this.emit('stateLoaded');
    this.emit('focusedPlanet', this.focusedPlanet);
    this.emit('planetChanged', this.focusedPlanet);
    console.info('[GameState] Migrated v1 save to v2');
  }

  applyOfflineEarnings() {
    // Offline earnings now handled by ProductionSystem on load
    // Return null here — kept for boot sequence compatibility
    return null;
  }
}

export const gameState = new GameState();
export { getSpeedMult, getLoadMult };
