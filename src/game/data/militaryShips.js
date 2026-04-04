/**
 * Military ship type definitions for Phase 4 fleet production.
 *
 * Each entry defines the ship's game stats, build requirements, and role.
 * Costs are paid from the Military Base silo (ore + energy, sometimes crystal).
 */
export const MILITARY_SHIPS = {
  fighter: {
    name:         'Fighter',
    icon:         '✈',
    tech:         'fighter_chassis',
    cost:         { ore: 150, energy: 80 },
    buildTime:    15,       // seconds to build one
    hp:           60,
    speed:        14,       // world units per second (fastest)
    fleetCapCost: 1,
    // Combat stats
    dps:            8,        // high DPS swarmer
    range:          4,        // short range — circles close
    fireRate:       3.0,      // shots per second (visual cadence)
    combatBehavior: 'circle', // orbits target at short radius
    desc:         'Fast interceptor. High DPS, low HP.',
  },
  bomber: {
    name:         'Bomber',
    icon:         '💣',
    tech:         'bomber_chassis',
    cost:         { ore: 300, energy: 200 },
    buildTime:    25,
    hp:           90,
    speed:        8,
    fleetCapCost: 2,
    // Combat stats
    dps:            15,         // burst damage, anti-heavy
    range:          25,         // long range — stands off
    fireRate:       0.5,        // slow but heavy hits
    combatBehavior: 'standoff', // holds position at range
    desc:         'Long-range burst damage. Slow but deadly.',
  },
  carrier: {
    name:         'Carrier',
    icon:         '🛸',
    tech:         'carrier_vessels',
    cost:         { ore: 800, energy: 500 },
    buildTime:    40,
    hp:           200,
    speed:        6,
    fleetCapCost: 4,
    // Combat stats
    dps:            2,          // minimal offense
    range:          15,         // medium range
    fireRate:       1.0,
    combatBehavior: 'support',  // stays behind, heals allies
    healRate:       5,          // HP/sec healed to nearest damaged ally
    healRange:      20,         // range for healing beam
    desc:         'Support ship. Heals fleet, enables resupply.',
  },
  battleship: {
    name:         'Battleship',
    icon:         '⚔',
    tech:         'battleship_chassis',
    cost:         { ore: 1500, energy: 800 },
    buildTime:    60,
    hp:           300,
    speed:        5,
    fleetCapCost: 5,
    // Combat stats
    dps:            12,           // sustained artillery
    range:          18,           // medium-long range
    fireRate:       1.5,          // multi-target
    combatBehavior: 'artillery',  // steady position, multi-target
    splashCount:    3,            // hits up to 3 enemies per volley
    desc:         'Heavy armor and sustained artillery fire.',
  },
  titan: {
    name:         'Titan',
    icon:         '🌑',
    tech:         'crystal_cores',
    cost:         { ore: 5000, energy: 2000, crystal: 100 },
    buildTime:    120,
    hp:           800,
    speed:        3,        // slowest — dictates fleet pace
    fleetCapCost: 10,
    // Combat stats
    dps:            20,             // massive single-target
    range:          20,
    fireRate:       0.8,
    combatBehavior: 'dreadnought', // heavy hitter, holds position
    desc:         'Colossus-class dreadnought with AoE ultimate.',
  },
  scavenger: {
    name:         'Scavenger',
    icon:         '♻',
    tech:         'scavenger_vessels',
    cost:         { ore: 400, energy: 600 },
    buildTime:    30,
    hp:           150,
    speed:        10,
    fleetCapCost: 1,
    // Combat stats
    dps:            1,
    range:          0,
    fireRate:       0,
    combatBehavior: 'none',
    tractorRange:   15,
    holdCapacity:   { ore: 200, crystal: 100 },
    desc:         'Solo scavenger that collects wreckage from destroyed enemy stations.',
  },
};

export const SHIP_TYPES = Object.keys(MILITARY_SHIPS);
