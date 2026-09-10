import { describe, it, expect } from 'vitest';
import { PLANETS } from '../src/game/data/planets.js';
import { ROBOT_ACTIONS, ROBOT_HIRE_COST_SCALE, getSpeedMult, getLoadMult } from '../src/game/data/upgrades.js';
import { getColonyShipBuildCost, colonyLaunchEnergyCost } from '../src/game/GameState.js';
import { scaleThreat, raidSpawnChance, invasionSpawnChance, COLONIZATION_GRACE_PERIOD } from '../src/game/data/enemies.js';
import { createRoute, validateRoute, routeCargoAmount, clampPct } from '../src/game/data/routes.js';
import { DEFENSE_UPGRADES } from '../src/game/data/defenses.js';
import { TECH_NODES } from '../src/game/data/techTree.js';
import { MILITARY_SHIPS } from '../src/game/data/militaryShips.js';

/**
 * Balance formulas. These are the numbers a player feels but never sees, and
 * the ones most likely to be broken by a well-meaning edit somewhere else —
 * a renamed field, a curve nudged the wrong way, a crystal price dropped.
 *
 * Where an exact figure is a design choice rather than a law, the test pins the
 * *shape* (monotonic, bounded, ordered) instead, so tuning stays possible.
 */

function robotState(counts = {}) {
  return {
    robots: {
      miner:     { count: counts.miner ?? 0 },
      energyBot: { count: counts.energyBot ?? 0 },
      builder:   { count: counts.builder ?? 0 },
      scout:     { count: counts.scout ?? 0 },
    },
    baseLevels: { storage: counts.storage ?? 0 },
    militaryBase: { built: counts.militaryBase ?? false },
  };
}

describe('robot hire cost', () => {
  const miner = ROBOT_ACTIONS.find(a => a.id === 'miner' || a.robotType === 'miner') || ROBOT_ACTIONS[0];

  it('compounds at the documented scale per robot', () => {
    const at0 = miner.energyCostFn(robotState({ miner: 0 }));
    const at1 = miner.energyCostFn(robotState({ miner: 1 }));
    expect(at1).toBe(Math.floor(at0 * ROBOT_HIRE_COST_SCALE));
  });

  it('never falls as robots are hired, and climbs over any few hires', () => {
    // Flooring an exponential can repeat a value at the low end — the first two
    // miners both cost 10 — so the guarantee is monotonic, not strict.
    const cost = (n) => miner.energyCostFn(robotState({ miner: n }));
    for (let n = 1; n <= 50; n++) {
      expect(cost(n)).toBeGreaterThanOrEqual(cost(n - 1));
    }
    for (let n = 3; n <= 50; n++) {
      expect(cost(n)).toBeGreaterThan(cost(n - 3));
    }
  });

  it('keeps the 50th robot within reach of a mid-game economy', () => {
    // Output is linear in count while cost is exponential, so this scale alone
    // decides where robots stop paying off. Guard against a silent regression
    // to the old 1.15 curve, where #50 cost ~10,800 energy.
    expect(miner.energyCostFn(robotState({ miner: 50 }))).toBeLessThan(1000);
  });
});

describe('robot tech multipliers', () => {
  it('are linear and start at 1', () => {
    expect(getSpeedMult(0)).toBe(1);
    expect(getLoadMult(0)).toBe(1);
    expect(getSpeedMult(3)).toBeCloseTo(1.6, 10);
    expect(getLoadMult(3)).toBeCloseTo(1.9, 10);
  });
});

describe('colony ship cost', () => {
  it('starts at the documented base and compounds per colony', () => {
    expect(getColonyShipBuildCost(0).ore).toBe(5000);
    const one = getColonyShipBuildCost(1).ore;
    const two = getColonyShipBuildCost(2).ore;
    // Flooring introduces a little drift, so compare the ratios loosely.
    expect(two / one).toBeCloseTo(one / getColonyShipBuildCost(0).ore, 3);
  });

  it('leaves the eighth planet affordable rather than decorative', () => {
    // Seven colonisations is the whole game. If the curve outruns storage the
    // last planets become unreachable no matter how long the player idles.
    expect(getColonyShipBuildCost(7).ore).toBeLessThan(60_000);
  });

  it('charges launch energy proportional to distance', () => {
    expect(colonyLaunchEnergyCost(0)).toBe(50);
    expect(colonyLaunchEnergyCost(1000)).toBeGreaterThan(colonyLaunchEnergyCost(100));
  });
});

describe('scaleThreat', () => {
  it('never threatens the home world', () => {
    expect(scaleThreat(8, 'xerion', robotState({ miner: 200, militaryBase: true }))).toBe(0);
  });

  it('returns zero for an unknown planet', () => {
    expect(scaleThreat(4, 'not-a-planet', robotState())).toBe(0);
  });

  it('rises with how developed the planet is', () => {
    const target = PLANETS.find(p => p.id !== 'xerion');
    const bare    = scaleThreat(2, target.id, robotState());
    const busy    = scaleThreat(2, target.id, robotState({ miner: 40 }));
    const fortified = scaleThreat(2, target.id, robotState({ miner: 40, storage: 3, militaryBase: true }));

    expect(busy).toBeGreaterThan(bare);
    expect(fortified).toBeGreaterThan(busy);
  });

  it('weights the planet itself more than the size of the empire', () => {
    // Expansion used to dominate, which punished colonising anything at all.
    const target = PLANETS.find(p => p.id !== 'xerion');
    const wideEmpireEmptyColony = scaleThreat(8, target.id, robotState());
    const smallEmpireBusyColony = scaleThreat(2, target.id, robotState({ miner: 40, storage: 3 }));
    expect(smallEmpireBusyColony).toBeGreaterThan(wideEmpireEmptyColony);
  });

  it('is bounded to the 0–10 band the templates are written for', () => {
    for (const planet of PLANETS) {
      const level = scaleThreat(8, planet.id, robotState({ miner: 999, storage: 99, militaryBase: true }));
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(10);
      expect(Number.isInteger(level)).toBe(true);
    }
  });

  it('gives a fresh colony a grace period before anything can spawn', () => {
    expect(COLONIZATION_GRACE_PERIOD).toBeGreaterThan(0);
  });
});

describe('attack spawn chance', () => {
  it('is zero at no threat and rises with it', () => {
    expect(raidSpawnChance(0)).toBe(0);
    expect(raidSpawnChance(10)).toBeGreaterThan(raidSpawnChance(1));
  });

  it('holds invasions back until the mid game', () => {
    expect(invasionSpawnChance(3)).toBe(0);
    expect(invasionSpawnChance(4)).toBeGreaterThan(0);
    expect(invasionSpawnChance(10)).toBeGreaterThan(invasionSpawnChance(4));
  });

  it('stays rarer than raids at every threat level', () => {
    for (let t = 1; t <= 10; t++) {
      expect(invasionSpawnChance(t)).toBeLessThan(raidSpawnChance(t));
    }
  });
});

describe('route cargo', () => {
  const siloState = (capacity) => ({ silos: { ore: { amount: capacity, capacity } } });

  it('clamps a percentage into the 1–100 band', () => {
    expect(clampPct(0)).toBe(1);
    expect(clampPct(-40)).toBe(1);
    expect(clampPct(250)).toBe(100);
    expect(clampPct(33.4)).toBe(33);
  });

  it('resolves against the silo capacity at dispatch time', () => {
    const route = createRoute('xerion', 'crystara', 'ore', 25);
    expect(routeCargoAmount(route, siloState(1000))).toBe(250);
    // The point of storing a share: a storage upgrade reaches old routes.
    expect(routeCargoAmount(route, siloState(4000))).toBe(1000);
  });

  it('never dispatches an empty ship, and never more than the silo holds', () => {
    const tiny = createRoute('xerion', 'crystara', 'ore', 1);
    expect(routeCargoAmount(tiny, siloState(10))).toBe(1);

    const full = createRoute('xerion', 'crystara', 'ore', 100);
    expect(routeCargoAmount(full, siloState(750))).toBe(750);
  });

  it('carries nothing from a silo that does not exist yet', () => {
    const route = createRoute('xerion', 'crystara', 'ore', 50);
    expect(routeCargoAmount(route, siloState(0))).toBe(0);
    expect(routeCargoAmount(route, undefined)).toBe(0);
  });

  it('rejects a route with no share set, and accepts one that has it', () => {
    const owned = ['xerion', 'crystara'];
    const route = createRoute('xerion', 'crystara', 'ore', 50);
    expect(validateRoute(route, owned)).toBeNull();
    expect(validateRoute({ ...route, pct: 0 }, owned)).toMatch(/share/i);
    expect(validateRoute({ ...route, toPlanet: 'xerion' }, owned)).toMatch(/differ/i);
    expect(validateRoute(route, ['xerion'])).toMatch(/not owned/i);
  });
});

describe('crystal sinks', () => {
  it('prices the last two levels of every primary defence upgrade in crystal', () => {
    const primary = ['cannon_damage', 'sat_damage', 'ship_damage', 'shield_capacity'];
    for (const id of primary) {
      const upg = DEFENSE_UPGRADES.find(u => u.id === id);
      expect(upg, id).toBeDefined();
      expect(upg.crystalCost, id).toBeDefined();
      // Early levels stay free of crystal so it never gates the opening.
      expect(upg.crystalCost[0]).toBe(0);
      expect(upg.crystalCost.at(-1)).toBeGreaterThan(0);
    }
  });

  it('prices the capstone tech nodes in crystal', () => {
    for (const id of ['crystal_cores', 'pure_crystal_lasers', 'quantum_fuel', 'fortress_protocol']) {
      const node = TECH_NODES.find(n => n.id === id);
      expect(node, id).toBeDefined();
      expect(node.crystalCost, id).toBeGreaterThan(0);
    }
  });

  it('prices the two heaviest hulls in crystal and nothing lighter', () => {
    expect(MILITARY_SHIPS.battleship.cost.crystal).toBeGreaterThan(0);
    expect(MILITARY_SHIPS.titan.cost.crystal).toBeGreaterThan(MILITARY_SHIPS.battleship.cost.crystal);
    for (const type of ['fighter', 'bomber', 'carrier', 'scavenger']) {
      expect(MILITARY_SHIPS[type].cost.crystal ?? 0, type).toBe(0);
    }
  });

  it('only lets crystal-bearing worlds produce it', () => {
    const crystalWorlds = PLANETS.filter(p => p.resourceTypes.includes('crystal'));
    expect(crystalWorlds.length).toBeGreaterThan(0);
    for (const planet of crystalWorlds) {
      expect(planet.deposits.crystal.zones).toBeGreaterThan(0);
    }
  });
});
