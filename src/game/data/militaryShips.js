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
    desc:         'Colossus-class dreadnought with AoE ultimate.',
  },
};

export const SHIP_TYPES = Object.keys(MILITARY_SHIPS);
