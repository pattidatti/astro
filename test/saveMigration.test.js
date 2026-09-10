import { describe, it, expect, beforeEach } from 'vitest';
import { gameState } from '../src/game/GameState.js';
import { FREE_TECH_IDS } from '../src/game/data/techTree.js';

/**
 * The migration chain is the one piece of this codebase that can silently
 * destroy a player's save, and it now spans nine versions of accumulated
 * reshaping. These tests pin each hop: what it converts, and what it leaves
 * alone when the save is already current.
 */

/** Minimal per-planet record as a v2-era save would have written it. */
function legacyPlanetState({ ore = 0, oreCapacity = 500 } = {}) {
  return {
    hasBase: true,
    baseLevels: { storage: 0, shipSpeed: 0, shipSlots: 0, passiveEnergy: 0 },
    silos: {
      ore:     { amount: ore, capacity: oreCapacity },
      energy:  { amount: 0, capacity: 500 },
      crystal: { amount: 0, capacity: 0 },
    },
    robots: {
      miner:     { count: 2, speedLevel: 3, loadLevel: 2 },
      energyBot: { count: 1, speedLevel: 1, loadLevel: 0 },
      builder:   { count: 0, speedLevel: 0, loadLevel: 0 },
      scout:     { count: 0, speedLevel: 0, loadLevel: 0 },
    },
    deposits: { ore: { zones: 3, unlocked: 1 }, energy: { zones: 2, unlocked: 1 }, crystal: { zones: 0, unlocked: 0 } },
    depositProgress: { ore: 0, crystal: 0, energy: 0 },
    upgradeLevels: {},
    buildQueue: [],
  };
}

function saveAt(version, extra = {}) {
  return {
    saveVersion: version,
    planetState: { xerion: legacyPlanetState() },
    ownedPlanets: ['xerion'],
    focusedPlanet: 'xerion',
    routes: [],
    unlockedTech: [...FREE_TECH_IDS],
    lastSaved: Date.now(),
    ...extra,
  };
}

describe('save migration', () => {
  beforeEach(() => gameState.reset());

  it('rebuilds a v1 save into per-planet state', () => {
    gameState.deserialize({ ore: 300, energy: 120, crystal: 5, ownedPlanets: ['xerion'], activePlanet: 'xerion' });

    const ps = gameState.getPlanetState('xerion');
    expect(ps.hasBase).toBe(true);
    expect(ps.silos.ore.amount).toBe(300);
    expect(ps.silos.energy.amount).toBe(120);
    // v1 players already know the game — the tutorial does not restart.
    expect(gameState.tutorialStep).toBe(-1);
  });

  it('clamps v1 balances that exceed the new silo capacities', () => {
    gameState.deserialize({ ore: 1e9, energy: 1e9, ownedPlanets: ['xerion'], activePlanet: 'xerion' });
    const ps = gameState.getPlanetState('xerion');
    expect(ps.silos.ore.amount).toBe(ps.silos.ore.capacity);
    expect(ps.silos.energy.amount).toBe(ps.silos.energy.capacity);
  });

  it('v2→v4: fills in combat and military-base records that never existed', () => {
    gameState.deserialize(saveAt(2));
    const ps = gameState.getPlanetState('xerion');

    expect(ps.combat).toBeDefined();
    expect(ps.combat.fallen).toBe(false);
    expect(ps.combat.defenses).toEqual({ cannon: 0, satellite: 0, defenseShip: 0, shield: 0 });
    expect(ps.militaryBase.built).toBe(false);
    expect(ps.militaryBase.hp).toBeGreaterThan(0);
    expect(ps.militaryBase.maxHP).toBeGreaterThan(0);
  });

  it('v4→v5: gives an existing fleet a full supply load and zeroed cooldowns', () => {
    gameState.deserialize(saveAt(4, {
      playerFleets: [{
        id: 'f1', planetId: 'xerion', position: { x: 0, y: 0, z: 0 }, waypoint: null, state: 'idle',
        ships: [{ type: 'fighter', hp: 60, maxHP: 60, fleetCapCost: 1 }], speed: 10,
      }],
    }));

    const fleet = gameState.playerFleets[0];
    expect(fleet.supply.ore.max).toBeGreaterThan(0);
    expect(fleet.supply.ore.amount).toBe(fleet.supply.ore.max);
    expect(fleet.supply.energy.amount).toBe(fleet.supply.energy.max);
    expect(fleet.titanCooldown).toBe(0);
    expect(fleet.emergencyJumpCooldown).toBe(0);
  });

  it('v5→v7: builds the enemy stations and gives them a distress flag', () => {
    gameState.deserialize(saveAt(5));
    expect(gameState.enemyStations.length).toBe(7);
    for (const st of gameState.enemyStations) {
      expect(st.distressFlareFired).toBe(false);
    }
  });

  it('v7→v8: renames the two relocated stations and their anchors', () => {
    gameState.deserialize(saveAt(7, {
      enemyStations: [
        { id: 'station_drakon',   anchorPlanet: 'drakon',   phase: 'dormant', distressFlareFired: false },
        { id: 'station_crystara', anchorPlanet: 'crystara', phase: 'alert',   distressFlareFired: true  },
        { id: 'station_alpha',    anchorPlanet: null,       phase: 'dormant', distressFlareFired: false },
      ],
    }));

    const ids = gameState.enemyStations.map(s => s.id);
    expect(ids).toEqual(['station_nebulox', 'station_solaris', 'station_alpha']);
    expect(gameState.enemyStations[0].anchorPlanet).toBe('nebulox');
    expect(gameState.enemyStations[1].anchorPlanet).toBe('solaris');
    // A rename must not reset the station's own progress.
    expect(gameState.enemyStations[1].phase).toBe('alert');
    expect(gameState.enemyStations[1].distressFlareFired).toBe(true);
  });

  it('v8→v9: drops per-planet robot speed/load levels now held as global tech', () => {
    gameState.deserialize(saveAt(8));
    const robots = gameState.getPlanetState('xerion').robots;

    expect(robots.miner.count).toBe(2); // counts survive
    for (const type of ['miner', 'energyBot', 'builder', 'scout']) {
      expect(robots[type].speedLevel).toBeUndefined();
      expect(robots[type].loadLevel).toBeUndefined();
    }
  });

  it('v9→v10: converts a frozen route amount to a share of current capacity', () => {
    const planetState = { xerion: legacyPlanetState({ oreCapacity: 4000 }) };
    gameState.deserialize(saveAt(9, {
      planetState,
      ownedPlanets: ['xerion', 'crystara'],
      routes: [{ id: 'r1', fromPlanet: 'xerion', toPlanet: 'crystara', resource: 'ore', amount: 1000, active: true }],
    }));

    const route = gameState.routes[0];
    expect(route.amount).toBeUndefined();
    expect(route.pct).toBe(25); // 1000 of a 4000 silo
  });

  it('v9→v10: falls back to half a silo when the source capacity is unknown', () => {
    gameState.deserialize(saveAt(9, {
      routes: [{ id: 'r1', fromPlanet: 'nowhere', toPlanet: 'crystara', resource: 'ore', amount: 250, active: true }],
    }));
    expect(gameState.routes[0].pct).toBe(50);
  });

  it('v9→v10: clamps a route that asked for more than the silo holds', () => {
    const planetState = { xerion: legacyPlanetState({ oreCapacity: 500 }) };
    gameState.deserialize(saveAt(9, {
      planetState,
      routes: [{ id: 'r1', fromPlanet: 'xerion', toPlanet: 'crystara', resource: 'ore', amount: 99999, active: true }],
    }));
    expect(gameState.routes[0].pct).toBe(100);
  });

  it('leaves a current v10 save untouched', () => {
    const route = { id: 'r1', fromPlanet: 'xerion', toPlanet: 'crystara', resource: 'ore', pct: 37, active: true };
    gameState.deserialize(saveAt(10, { routes: [structuredClone(route)] }));
    expect(gameState.routes[0]).toEqual(route);
  });

  it('always restores the free tech nodes, even from a save that lists none', () => {
    gameState.deserialize(saveAt(6, { unlockedTech: [] }));
    for (const id of FREE_TECH_IDS) {
      expect(gameState.isTechUnlocked(id)).toBe(true);
    }
  });

  it('grants tech retroactively to a save written before the tech tree existed', () => {
    const ps = legacyPlanetState();
    ps.baseLevels.shipSlots = 2;
    ps.combat = {
      stationHP: 100, stationMaxHP: 100, shieldHP: 0, shieldMaxHP: 0,
      defenses: { cannon: 1, satellite: 2, defenseShip: 0, shield: 0 },
      defenseLevels: {}, abilityCooldowns: {}, activeEffects: [], fallen: false,
    };
    const save = saveAt(3, { planetState: { xerion: ps }, routes: [{ id: 'r1' }] });
    delete save.unlockedTech;

    gameState.deserialize(save);

    expect(gameState.isTechUnlocked('base_shipslots')).toBe(true);
    expect(gameState.isTechUnlocked('base_shipspeed')).toBe(true); // implied prerequisite
    expect(gameState.isTechUnlocked('satellite')).toBe(true);
    expect(gameState.isTechUnlocked('cargo_ships')).toBe(true);    // implied by owning a route
  });

  it('starts the military tutorial chapter for saves written before it existed', () => {
    const save = saveAt(9);
    delete save.tutorialMilitaryStep;
    gameState.deserialize(save);

    expect(gameState.tutorialStep).toBe(-1);      // economy chapter assumed done
    expect(gameState.tutorialMilitaryStep).toBe(0); // military chapter still to come
  });

  it('round-trips a serialized state without drift', () => {
    gameState.reset();
    const ps = gameState.getPlanetState('xerion');
    ps.hasBase = true;
    ps.robots.miner.count = 12;
    ps.silos.ore.amount = 321;
    gameState.unlockedTech.add('miner_speed_1');

    const snapshot = JSON.parse(JSON.stringify(gameState.serialize()));
    gameState.reset();
    gameState.deserialize(snapshot);

    const after = gameState.getPlanetState('xerion');
    expect(after.robots.miner.count).toBe(12);
    expect(after.silos.ore.amount).toBe(321);
    expect(gameState.isTechUnlocked('miner_speed_1')).toBe(true);
  });
});
