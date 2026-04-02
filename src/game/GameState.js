import { PLANETS } from './data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from './data/upgrades.js';

const SAVE_VERSION = 2;

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
    this.colonyShipsInOrbit = []; // [{ id, fromPlanetId }]
    this.colonyShipsInFlight = []; // [{ id, fromPlanetId, toPlanetId, duration, elapsed }]
    this.tutorialStep = 0;
    this.lastSaved = Date.now();

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
        this._finalizeColonization(ship.fromPlanetId, ship.toPlanetId);
        this.emit('colonyShipArrived', {
          id: ship.id,
          fromPlanetId: ship.fromPlanetId,
          toPlanetId: ship.toPlanetId,
        });
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
      colonyShipsInOrbit: JSON.parse(JSON.stringify(this.colonyShipsInOrbit)),
      colonyShipsInFlight: JSON.parse(JSON.stringify(this.colonyShipsInFlight)),
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

    this.planetState         = data.planetState ?? {};
    this.ownedPlanets        = data.ownedPlanets ?? ['xerion'];
    this.focusedPlanet       = data.focusedPlanet ?? 'xerion';
    this.routes              = data.routes ?? [];
    this.activeShips         = []; // reconstructed by RouteSystem
    this.colonyShipsInOrbit  = data.colonyShipsInOrbit ?? [];
    this.colonyShipsInFlight = data.colonyShipsInFlight ?? [];
    this.tutorialStep   = data.tutorialStep ?? -1; // assume tutorial complete for existing saves
    this.lastSaved      = data.lastSaved ?? Date.now();

    // Ensure Xerion always has a state entry
    if (!this.planetState['xerion']) {
      const ps = makePlanetState(PLANETS.find(p => p.id === 'xerion'));
      ps.hasBase = true;
      this.planetState['xerion'] = ps;
    }

    // Backwards compat: ensure colonyShipBuildQueue exists on all planet states
    for (const ps of Object.values(this.planetState)) {
      if (!ps.colonyShipBuildQueue) ps.colonyShipBuildQueue = [];
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
