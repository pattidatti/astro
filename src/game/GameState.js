import { PLANETS } from './data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from './data/upgrades.js';
import { DEFENSE_TYPES, DEFENSE_UPGRADES, ACTIVE_ABILITIES, BASE_STATION_HP,
         BUILDER_REPAIR_RATE, RECOLONIZE_COST_MULT, FALL_ROBOT_SURVIVAL } from './data/defenses.js';
import { ENEMY_TYPES } from './data/enemies.js';

const SAVE_VERSION = 3;

const COLONY_SHIP_BUILD_COST = { ore: 300 };
const COLONY_SHIP_BUILD_TIME = 20;   // seconds
const COLONY_LAUNCH_BASE_COST = 50;  // base energy cost for launch
const COLONY_LAUNCH_DIST_MULT = 0.3; // energy per orbit-radius unit

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
    this.tutorialStep = 0;
    this.lastSaved = Date.now();

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

  /** Get the available ship slots for a planet (base level drives this) */
  getShipSlots(planetId) {
    const ps = this.getPlanetState(planetId);
    if (!ps) return 0;
    return 1 + ps.baseLevels.shipSlots; // starts at 1, +1 per level
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

  // ─── Colony ship system ───────────────────────────────────────────────────

  /** Queue a colony ship build on the given planet. Costs COLONY_SHIP_BUILD_COST. */
  queueColonyShipBuild(planetId) {
    if (!this.ownedPlanets.includes(planetId)) return false;
    const ps = this.getPlanetState(planetId);
    if (!ps || !ps.hasBase) return false;
    // Max 1 colony ship per planet (building or in orbit)
    if (ps.colonyShipBuildQueue.length > 0) return false;
    if (this.colonyShipsInOrbit.some(s => s.fromPlanetId === planetId)) return false;
    const { ore = 0, energy = 0 } = COLONY_SHIP_BUILD_COST;
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
      item.progress += dt;
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
    const { ore: oreCost = 0, energy: energyCost = 0 } = def.baseCost;
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
    ps.combat.abilityCooldowns[abilityId] = ability.cooldown;

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

    // Reduced cost
    const oreCost = Math.floor((def.baseCost.ore || 0) * RECOLONIZE_COST_MULT);
    const energyCost = Math.floor((def.baseCost.energy || 0) * RECOLONIZE_COST_MULT);

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
      activeAttacks: attacks,
      roamingFleets: JSON.parse(JSON.stringify(this.roamingFleets)),
      lastAttackTime: { ...this.lastAttackTime },
      colonizationTime: { ...this.colonizationTime },
      tutorialStep: this.tutorialStep,
      stats: { ...this.stats },
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
    for (const ps of Object.values(this.planetState)) {
      if (!ps.colonyShipBuildQueue) ps.colonyShipBuildQueue = [];
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
