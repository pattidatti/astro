import { describe, it, expect, beforeEach } from 'vitest';
import { gameState } from '../src/game/GameState.js';
import {
  applyOfflineProgress,
  MAX_OFFLINE_SECONDS,
  MIN_OFFLINE_SECONDS,
} from '../src/game/systems/OfflineProgress.js';
import { planetProductionRates } from '../src/game/data/productionRates.js';

const NOW = 1_700_000_000_000;

/** A fresh single-planet economy: Xerion with a base and `miners` miners. */
function setup({ miners = 0, energyBots = 0, scouts = 0, oreCapacity = 500 } = {}) {
  gameState.reset();
  const ps = gameState.getPlanetState('xerion');
  ps.hasBase = true;
  ps.robots.miner.count = miners;
  ps.robots.energyBot.count = energyBots;
  ps.robots.scout.count = scouts;
  ps.silos.ore.capacity = oreCapacity;
  ps.silos.ore.amount = 0;
  ps.silos.energy.amount = 0;
  return ps;
}

/** Set the save clock so that `seconds` of absence have elapsed at NOW. */
function awayFor(seconds) {
  gameState.lastSaved = NOW - seconds * 1000;
}

describe('applyOfflineProgress', () => {
  beforeEach(() => setup());

  it('ignores a gap shorter than the reporting threshold', () => {
    setup({ miners: 5 });
    awayFor(MIN_OFFLINE_SECONDS - 1);
    expect(applyOfflineProgress(gameState, NOW)).toBeNull();
    expect(gameState.getPlanetState('xerion').silos.ore.amount).toBe(0);
  });

  it('ignores a clock that moved backwards instead of rewinding state', () => {
    const ps = setup({ miners: 5 });
    ps.silos.ore.amount = 100;
    gameState.lastSaved = NOW + 60_000; // save is "in the future"
    expect(applyOfflineProgress(gameState, NOW)).toBeNull();
    expect(ps.silos.ore.amount).toBe(100);
  });

  it('credits production at the same rate the live tick would', () => {
    const ps = setup({ miners: 4, oreCapacity: 1e9 });
    const rate = planetProductionRates('xerion', ps, gameState).ore;
    awayFor(600);

    const report = applyOfflineProgress(gameState, NOW);
    expect(report.gained.ore).toBeCloseTo(rate * 600, 6);
    expect(ps.silos.ore.amount).toBeCloseTo(rate * 600, 6);
  });

  it('caps the credited window and says so', () => {
    const ps = setup({ miners: 1, oreCapacity: 1e9 });
    const rate = planetProductionRates('xerion', ps, gameState).ore;
    awayFor(MAX_OFFLINE_SECONDS * 3);

    const report = applyOfflineProgress(gameState, NOW);
    expect(report.capped).toBe(true);
    expect(report.creditedSeconds).toBe(MAX_OFFLINE_SECONDS);
    expect(report.awaySeconds).toBe(MAX_OFFLINE_SECONDS * 3);
    expect(report.gained.ore).toBeCloseTo(rate * MAX_OFFLINE_SECONDS, 4);
  });

  it('stops at silo capacity and reports when it filled', () => {
    const ps = setup({ miners: 10, oreCapacity: 500 });
    const rate = planetProductionRates('xerion', ps, gameState).ore; // > 0
    awayFor(MAX_OFFLINE_SECONDS);

    const report = applyOfflineProgress(gameState, NOW);
    expect(ps.silos.ore.amount).toBe(500);
    expect(report.gained.ore).toBeCloseTo(500, 6);

    const filled = report.filled.find(f => f.planetId === 'xerion' && f.resource === 'ore');
    expect(filled).toBeDefined();
    // Filled within one simulation step of the true moment.
    expect(filled.afterSeconds).toBeGreaterThanOrEqual(500 / rate);
    expect(filled.afterSeconds).toBeLessThan(500 / rate + 31);
  });

  it('completes surveys mid-window and mines the new zone for the remainder', () => {
    const ps = setup({ miners: 1, scouts: 1, oreCapacity: 1e9 });
    ps.deposits.ore.unlocked = 1;
    const oneZoneRate = planetProductionRates('xerion', ps, gameState).ore;

    // One scout surveys a zone every 120s; 300s opens two.
    awayFor(300);
    const report = applyOfflineProgress(gameState, NOW);

    expect(ps.deposits.ore.unlocked).toBe(3);
    expect(report.unlocks).toHaveLength(3); // ore, energy and crystal zones all advance
    // Rate rose partway through, so more was mined than a flat 300s at one zone.
    expect(report.gained.ore).toBeGreaterThan(oneZoneRate * 300);
  });

  it('never surveys past the planet\'s zone count', () => {
    const ps = setup({ scouts: 20 });
    awayFor(MAX_OFFLINE_SECONDS);
    applyOfflineProgress(gameState, NOW);

    for (const resource of ['ore', 'energy', 'crystal']) {
      const dep = ps.deposits[resource];
      expect(dep.unlocked).toBeLessThanOrEqual(dep.zones);
      if (dep.unlocked >= dep.zones) expect(ps.depositProgress[resource]).toBe(0);
    }
  });

  it('feeds the military base through the space elevator', () => {
    const ps = setup({ miners: 6, oreCapacity: 1e9 });
    ps.militaryBase.built = true;
    ps.militaryBase.silo.ore.amount = 0;
    awayFor(600);

    applyOfflineProgress(gameState, NOW);
    expect(ps.militaryBase.silo.ore.amount).toBeGreaterThan(0);
  });

  it('adds to lifetime stats', () => {
    setup({ miners: 3, energyBots: 2, oreCapacity: 1e9 });
    gameState.stats.totalOreProduced = 0;
    gameState.stats.totalEnergyProduced = 0;
    awayFor(600);

    const report = applyOfflineProgress(gameState, NOW);
    expect(gameState.stats.totalOreProduced).toBeCloseTo(report.gained.ore, 6);
    expect(gameState.stats.totalEnergyProduced).toBeCloseTo(report.gained.energy, 6);
  });

  it('restarts the attack-gap clock so a returning player is not raided instantly', () => {
    setup({ miners: 1 });
    gameState.ownedPlanets = ['xerion', 'crystara'];
    gameState.lastAttackTime = { crystara: 0 };
    awayFor(3600);

    applyOfflineProgress(gameState, NOW);
    expect(gameState.lastAttackTime.crystara).toBe(NOW);
  });

  it('advances lastSaved so a second call credits nothing', () => {
    setup({ miners: 4, oreCapacity: 1e9 });
    awayFor(600);

    applyOfflineProgress(gameState, NOW);
    expect(gameState.lastSaved).toBe(NOW);
    expect(applyOfflineProgress(gameState, NOW)).toBeNull();
  });

  it('produces nothing on a planet without a base', () => {
    const ps = setup({ miners: 10, oreCapacity: 1e9 });
    ps.hasBase = false;
    awayFor(3600);

    // The window still elapsed — it just earned nothing. Suppressing the panel
    // is the UI's call (see ui/OfflineReport.js), not this function's.
    const report = applyOfflineProgress(gameState, NOW);
    expect(report.gained).toEqual({ ore: 0, energy: 0, crystal: 0 });
    expect(ps.silos.ore.amount).toBe(0);
  });
});
