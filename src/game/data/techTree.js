/**
 * Global Tech Tree — node definitions.
 * All progress is shared across planets.
 * Cost is deducted from the focused planet's energy silo.
 */

export const TECH_NODES = [
  // ─── ROBOTS branch ───────────────────────────────────────────────────────
  {
    id: 'energy_bot',
    name: 'ENERGY BOT',
    icon: '🔋',
    desc: 'Harvests energy from the planet.',
    cost: 0,
    free: true,
    requires: [],
    tier: 0,
    branch: 'robots',
  },
  {
    id: 'miner_bot',
    name: 'MINER BOT',
    icon: '⛏',
    desc: 'Mines ore from planetary deposits.',
    cost: 500,
    free: false,
    requires: ['energy_bot'],
    tier: 1,
    branch: 'robots',
  },
  {
    id: 'builder_bot',
    name: 'BUILDER BOT',
    icon: '🔧',
    desc: 'Repairs damaged station hull between attacks.',
    cost: 800,
    free: false,
    requires: ['energy_bot'],
    tier: 1,
    branch: 'robots',
  },
  {
    id: 'scout_bot',
    name: 'SCOUT BOT',
    icon: '📡',
    desc: 'Surveys terrain to unlock new resource deposits.',
    cost: 1500,
    free: false,
    requires: ['miner_bot'],
    tier: 2,
    branch: 'robots',
  },
  {
    id: 'energy_upgrades',
    name: 'ENERGY OPT.',
    icon: '⚡',
    desc: 'Unlocks speed and cargo upgrades for Energy Bots.',
    cost: 800,
    free: false,
    requires: ['energy_bot'],
    tier: 1,
    branch: 'robots',
  },
  {
    id: 'miner_upgrades',
    name: 'MINING SPEC.',
    icon: '🪨',
    desc: 'Unlocks speed and cargo upgrades for Miner Bots.',
    cost: 1000,
    free: false,
    requires: ['miner_bot'],
    tier: 2,
    branch: 'robots',
  },
  {
    id: 'builder_upgrades',
    name: 'CONSTRUCTION',
    icon: '🔩',
    desc: 'Unlocks speed and toolkit upgrades for Builder Bots.',
    cost: 1500,
    free: false,
    requires: ['builder_bot'],
    tier: 2,
    branch: 'robots',
  },
  {
    id: 'scout_upgrades',
    name: 'SCOUT ARRAY',
    icon: '🔭',
    desc: 'Unlocks speed and sensor upgrades for Scout Bots.',
    cost: 2000,
    free: false,
    requires: ['scout_bot'],
    tier: 3,
    branch: 'robots',
  },

  // ─── DEFENSE branch ───────────────────────────────────────────────────────
  {
    id: 'cannon',
    name: 'STATION CANNON',
    icon: '🔫',
    desc: 'Turret mounted on the station.',
    cost: 0,
    free: true,
    requires: [],
    tier: 0,
    branch: 'defense',
  },
  {
    id: 'satellite',
    name: 'DEF. SATELLITE',
    icon: '🛰',
    desc: 'Orbiting defense satellite with fast fire rate.',
    cost: 1000,
    free: false,
    requires: ['cannon'],
    tier: 1,
    branch: 'defense',
  },
  {
    id: 'patrol_craft',
    name: 'PATROL CRAFT',
    icon: '🛡',
    desc: 'Armed patrol vessel that can clear hyperlane threats.',
    cost: 2000,
    free: false,
    requires: ['cannon'],
    tier: 1,
    branch: 'defense',
  },
  {
    id: 'shield',
    name: 'PLANETARY SHIELD',
    icon: '🔵',
    desc: 'Energy shield that absorbs damage before the station hull.',
    cost: 3000,
    free: false,
    requires: ['satellite'],
    tier: 2,
    branch: 'defense',
  },
  {
    id: 'cannon_upgrades',
    name: 'CANNON PROTOCOLS',
    icon: '💥',
    desc: 'Unlocks damage and fire rate upgrades for Station Cannons.',
    cost: 1500,
    free: false,
    requires: ['satellite'],
    tier: 2,
    branch: 'defense',
  },
  {
    id: 'satellite_upgrades',
    name: 'SATELLITE SYS.',
    icon: '🎯',
    desc: 'Unlocks damage and targeting upgrades for Defense Satellites.',
    cost: 2500,
    free: false,
    requires: ['satellite'],
    tier: 2,
    branch: 'defense',
  },
  {
    id: 'patrol_upgrades',
    name: 'FLEET TACTICS',
    icon: '⚔',
    desc: 'Unlocks weapon and armor upgrades for Patrol Craft.',
    cost: 3000,
    free: false,
    requires: ['patrol_craft'],
    tier: 2,
    branch: 'defense',
  },
  {
    id: 'shield_upgrades',
    name: 'SHIELD MATRIX',
    icon: '🛡',
    desc: 'Unlocks capacity and regen upgrades for Planetary Shields.',
    cost: 5000,
    free: false,
    requires: ['shield'],
    tier: 3,
    branch: 'defense',
  },

  // ─── BASE / INFRASTRUCTURE branch ─────────────────────────────────────────
  {
    id: 'base_shipspeed',
    name: 'THRUSTER ARRAY',
    icon: '💨',
    desc: 'Unlocks Thruster upgrades — increase ship travel speed.',
    cost: 1000,
    free: false,
    requires: [],
    tier: 0,
    branch: 'base',
  },
  {
    id: 'base_passive',
    name: 'FUSION CELL',
    icon: '🔥',
    desc: 'Unlocks Fusion Cell upgrades — passive energy generation.',
    cost: 2500,
    free: false,
    requires: [],
    tier: 0,
    branch: 'base',
  },
  {
    id: 'base_shipslots',
    name: 'DOCKING BAY',
    icon: '🚀',
    desc: 'Unlocks Docking Bay upgrades — more simultaneous ship routes.',
    cost: 2000,
    free: false,
    requires: ['base_shipspeed'],
    tier: 1,
    branch: 'base',
  },

  // ─── COLONIZATION branch ──────────────────────────────────────────────────
  {
    id: 'colony_ship',
    name: 'COLONY SHIP',
    icon: '🌍',
    desc: 'Unlocks the ability to build Colony Ships and colonize new planets.',
    cost: 2000,
    free: false,
    requires: [],
    tier: 0,
    branch: 'colonization',
  },
  {
    id: 'colony_scanner',
    name: 'HYPERLANE SCANNER',
    icon: '🗺',
    desc: 'Advanced scanners — colony ships travel 25% faster.',
    cost: 4000,
    free: false,
    requires: ['colony_ship'],
    tier: 1,
    branch: 'colonization',
  },
  {
    id: 'colony_speed',
    name: 'RAPID COLONIZATION',
    icon: '⚡',
    desc: 'Optimized colony protocols — colony ships travel 50% faster total.',
    cost: 6000,
    free: false,
    requires: ['colony_scanner'],
    tier: 2,
    branch: 'colonization',
  },
];

/** Fast lookup by node ID */
export const TECH_BY_ID = Object.fromEntries(TECH_NODES.map(n => [n.id, n]));

/** IDs of nodes that are free (auto-unlocked at game start) */
export const FREE_TECH_IDS = TECH_NODES.filter(n => n.free).map(n => n.id);

/**
 * Get colony ship speed multiplier based on tech unlocks.
 * Used by colony travel duration calculation.
 */
export function getColonySpeedMult(unlockedTech) {
  let mult = 1.0;
  if (unlockedTech instanceof Set ? unlockedTech.has('colony_scanner') : unlockedTech.includes('colony_scanner')) mult *= 1.25;
  if (unlockedTech instanceof Set ? unlockedTech.has('colony_speed') : unlockedTech.includes('colony_speed')) mult *= (1.5 / 1.25);
  return mult;
}
