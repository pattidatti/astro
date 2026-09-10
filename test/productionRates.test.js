import { describe, it, expect } from 'vitest';
import {
  planetProductionRates,
  scoutProgressRate,
  BASE_ORE_RATE,
  BASE_ENERGY_RATE,
  BASE_CRYSTAL_RATE,
} from '../src/game/data/productionRates.js';
import { PLANETS } from '../src/game/data/planets.js';

/**
 * A game state stub carrying only what the rate functions read. Keeping it here
 * rather than importing the singleton makes each expectation depend on exactly
 * one thing: no tech unless the test asks for it.
 */
function stubState({ tech = [] } = {}) {
  const unlockedTech = new Set(tech);
  const has = (id) => unlockedTech.has(id);
  return {
    unlockedTech,
    isTechUnlocked: has,
    getTechOreMult:     () => (has('deep_mining') ? 1.6 : has('mining_efficiency_2') ? 1.4 : has('mining_efficiency') ? 1.2 : 1),
    getTechEnergyMult:  () => (has('neural_sync') ? 1.6 : has('energy_efficiency_2') ? 1.4 : has('energy_efficiency') ? 1.2 : 1),
    getTechCrystalMult: () => (has('crystal_focus') ? 1.3 : 1),
    getTechScoutMult:   () => (has('scout_speed') ? 1.4 : 1),
    getTechPassiveBonus: () => (has('passive_energy_3') ? 6 : has('passive_energy_2') ? 2 : 0),
  };
}

function planetStateFor(planetId, overrides = {}) {
  const def = PLANETS.find(p => p.id === planetId);
  return {
    hasBase: true,
    baseLevels: { storage: 0, shipSpeed: 0, shipSlots: 0, passiveEnergy: 0 },
    robots: { miner: { count: 0 }, energyBot: { count: 0 }, builder: { count: 0 }, scout: { count: 0 } },
    deposits: JSON.parse(JSON.stringify(def.deposits)),
    depositProgress: { ore: 0, crystal: 0, energy: 0 },
    silos: { ore: { amount: 0, capacity: 500 }, energy: { amount: 0, capacity: 500 }, crystal: { amount: 0, capacity: 0 } },
    ...overrides,
  };
}

describe('planetProductionRates', () => {
  it('produces nothing without a base', () => {
    const ps = planetStateFor('xerion', { hasBase: false });
    ps.robots.miner.count = 10;
    expect(planetProductionRates('xerion', ps, stubState())).toEqual({ ore: 0, energy: 0, crystal: 0 });
  });

  it('produces nothing for an unknown planet id', () => {
    const ps = planetStateFor('xerion');
    ps.robots.miner.count = 10;
    expect(planetProductionRates('not-a-planet', ps, stubState())).toEqual({ ore: 0, energy: 0, crystal: 0 });
  });

  it('scales ore linearly with miner count', () => {
    const def = PLANETS.find(p => p.id === 'xerion');
    const ps = planetStateFor('xerion');
    ps.deposits.ore.unlocked = 1;

    ps.robots.miner.count = 1;
    const one = planetProductionRates('xerion', ps, stubState()).ore;
    ps.robots.miner.count = 7;
    const seven = planetProductionRates('xerion', ps, stubState()).ore;

    expect(one).toBeCloseTo(BASE_ORE_RATE * def.planetMult.ore, 10);
    expect(seven).toBeCloseTo(one * 7, 10);
  });

  it('treats zero unlocked ore zones as one, so a fresh base still mines', () => {
    const ps = planetStateFor('xerion');
    ps.robots.miner.count = 1;
    ps.deposits.ore.unlocked = 0;
    const zero = planetProductionRates('xerion', ps, stubState()).ore;
    ps.deposits.ore.unlocked = 1;
    const one = planetProductionRates('xerion', ps, stubState()).ore;
    expect(zero).toBeGreaterThan(0);
    expect(zero).toBeCloseTo(one, 10);
  });

  it('multiplies ore by every unlocked zone beyond the first', () => {
    const ps = planetStateFor('xerion');
    ps.robots.miner.count = 1;
    ps.deposits.ore.unlocked = 1;
    const one = planetProductionRates('xerion', ps, stubState()).ore;
    ps.deposits.ore.unlocked = 3;
    expect(planetProductionRates('xerion', ps, stubState()).ore).toBeCloseTo(one * 3, 10);
  });

  it('gates crystal on a surveyed crystal zone, unlike ore', () => {
    const crystalPlanet = PLANETS.find(p => p.resourceTypes.includes('crystal'));
    const ps = planetStateFor(crystalPlanet.id);
    ps.robots.miner.count = 4;
    ps.deposits.crystal.unlocked = 0;
    expect(planetProductionRates(crystalPlanet.id, ps, stubState()).crystal).toBe(0);

    ps.deposits.crystal.unlocked = 1;
    expect(planetProductionRates(crystalPlanet.id, ps, stubState()).crystal)
      .toBeCloseTo(4 * BASE_CRYSTAL_RATE * crystalPlanet.planetMult.crystal, 10);
  });

  it('adds passive energy on top of energy bots, and tech on top of that', () => {
    const def = PLANETS.find(p => p.id === 'xerion');
    const ps = planetStateFor('xerion');
    ps.robots.energyBot.count = 2;
    ps.deposits.energy.unlocked = 1;

    const bots = 2 * BASE_ENERGY_RATE * def.planetMult.energy;
    expect(planetProductionRates('xerion', ps, stubState()).energy).toBeCloseTo(bots, 10);

    ps.baseLevels.passiveEnergy = 1;
    const withPassive = planetProductionRates('xerion', ps, stubState()).energy;
    expect(withPassive).toBeGreaterThan(bots);

    const withTech = planetProductionRates('xerion', ps, stubState({ tech: ['passive_energy_2'] })).energy;
    expect(withTech).toBeCloseTo(withPassive + 2, 10);
  });

  it('applies production tech multipliers', () => {
    const ps = planetStateFor('xerion');
    ps.robots.miner.count = 3;
    ps.deposits.ore.unlocked = 1;
    const base = planetProductionRates('xerion', ps, stubState()).ore;
    const boosted = planetProductionRates('xerion', ps, stubState({ tech: ['deep_mining'] })).ore;
    expect(boosted).toBeCloseTo(base * 1.6, 10);
  });

  it('compounds miner speed and load tech multiplicatively', () => {
    const ps = planetStateFor('xerion');
    ps.robots.miner.count = 1;
    ps.deposits.ore.unlocked = 1;
    const base = planetProductionRates('xerion', ps, stubState()).ore;
    // Levels come from the numbered nodes: getSpeedMult(1) = 1.2, getLoadMult(1) = 1.3
    const both = planetProductionRates('xerion', ps, stubState({ tech: ['miner_speed_1', 'miner_load_1'] })).ore;
    expect(both).toBeCloseTo(base * 1.2 * 1.3, 10);
  });
});

describe('scoutProgressRate', () => {
  it('is zero without scouts', () => {
    expect(scoutProgressRate(planetStateFor('xerion'), stubState())).toBe(0);
  });

  it('scales with scout count', () => {
    const ps = planetStateFor('xerion');
    ps.robots.scout.count = 3;
    expect(scoutProgressRate(ps, stubState())).toBeCloseTo(3, 10);
  });

  it('is boosted by scout tech', () => {
    const ps = planetStateFor('xerion');
    ps.robots.scout.count = 1;
    // Two independent sources: the numbered speed nodes (×1.2 per level) and
    // the deep-scan node, whose id is the bare 'scout_speed' (×1.4).
    expect(scoutProgressRate(ps, stubState({ tech: ['scout_speed_1'] }))).toBeCloseTo(1.2, 10);
    expect(scoutProgressRate(ps, stubState({ tech: ['scout_speed'] }))).toBeCloseTo(1.4, 10);
    expect(scoutProgressRate(ps, stubState({ tech: ['scout_speed_1', 'scout_speed'] }))).toBeCloseTo(1.2 * 1.4, 10);
  });
});
