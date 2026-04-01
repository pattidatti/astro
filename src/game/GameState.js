import { PLANETS } from './data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from './data/upgrades.js';

const SAVE_VERSION = 2;

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
    // Scout deposit unlock progress (seconds needed to unlock one zone)
    depositProgress: { ore: 0, crystal: 0, energy: 0 },
  };
}

class GameState extends EventEmitter {
  constructor() {
    super();
    this._initFresh();
  }

  _initFresh() {
    this.saveVersion = SAVE_VERSION;
    this.planetState = {};
    this.ownedPlanets = ['xerion'];
    this.focusedPlanet = 'xerion';
    this.routes = [];
    this.activeShips = []; // NOT serialized — runtime only
    this.tutorialStep = 0;
    this.lastSaved = Date.now();

    // Bootstrap Xerion with a free base
    const xerionDef = PLANETS.find(p => p.id === 'xerion');
    const ps = makePlanetState(xerionDef);
    ps.hasBase = true;
    this.planetState['xerion'] = ps;
  }

  reset() {
    this._initFresh();
    this.emit('stateLoaded');
    this.emit('robotHired', { planetId: 'xerion' });
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
    const space = silo.capacity - silo.amount;
    const added = Math.min(amount, space);
    if (added > 0) {
      silo.amount += added;
      this.emit('siloChanged', { planetId, resource, amount: silo.amount });
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

  // ─── Planet management ────────────────────────────────────────────────────

  /**
   * Colonize a new planet by sending a colony ship from fromPlanet.
   * Deducts baseCost from fromPlanet's silos.
   */
  colonizePlanet(fromPlanetId, toPlanetId) {
    if (this.ownedPlanets.includes(toPlanetId)) return false;
    if (!this.ownedPlanets.includes(fromPlanetId)) return false;

    const toDef = PLANETS.find(p => p.id === toPlanetId);
    if (!toDef) return false;

    const { ore: oreCost, energy: energyCost } = toDef.baseCost;

    // Check affordability
    if (oreCost > 0 && !this.siloHas(fromPlanetId, 'ore', oreCost)) return false;
    if (energyCost > 0 && !this.siloHas(fromPlanetId, 'energy', energyCost)) return false;

    // Deduct costs
    if (oreCost > 0) this.deductFromSilo(fromPlanetId, 'ore', oreCost);
    if (energyCost > 0) this.deductFromSilo(fromPlanetId, 'energy', energyCost);

    // Initialize planet state
    const ps = makePlanetState(toDef);
    ps.hasBase = true;
    this.planetState[toPlanetId] = ps;
    this.ownedPlanets.push(toPlanetId);

    this.focusedPlanet = toPlanetId;
    this.emit('planetColonized', toPlanetId);
    this.emit('focusedPlanet', toPlanetId);
    return true;
  }

  /** Switch focused planet (must be owned) */
  switchPlanet(planetId) {
    if (!this.ownedPlanets.includes(planetId)) return false;
    this.focusedPlanet = planetId;
    this.emit('focusedPlanet', planetId);
    this.emit('planetChanged', planetId); // backward compat for Skybox/Game.js
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

  // ─── Stub tick (production handled by ProductionSystem) ───────────────────

  tick(_dt) {
    // No-op — ProductionSystem and RouteSystem register their own onUpdate callbacks
  }

  // ─── Serialization ────────────────────────────────────────────────────────

  serialize() {
    return {
      saveVersion: SAVE_VERSION,
      planetState: JSON.parse(JSON.stringify(this.planetState)),
      ownedPlanets: this.ownedPlanets.slice(),
      focusedPlanet: this.focusedPlanet,
      routes: JSON.parse(JSON.stringify(this.routes)),
      tutorialStep: this.tutorialStep,
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

    this.planetState    = data.planetState ?? {};
    this.ownedPlanets   = data.ownedPlanets ?? ['xerion'];
    this.focusedPlanet  = data.focusedPlanet ?? 'xerion';
    this.routes         = data.routes ?? [];
    this.activeShips    = []; // reconstructed by RouteSystem
    this.tutorialStep   = data.tutorialStep ?? -1; // assume tutorial complete for existing saves
    this.lastSaved      = data.lastSaved ?? Date.now();

    // Ensure Xerion always has a state entry
    if (!this.planetState['xerion']) {
      const ps = makePlanetState(PLANETS.find(p => p.id === 'xerion'));
      ps.hasBase = true;
      this.planetState['xerion'] = ps;
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
