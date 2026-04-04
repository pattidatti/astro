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
    cost: 0, free: true, requires: [], tier: 0, branch: 'robots',
  },
  {
    id: 'miner_bot',
    name: 'MINER BOT',
    icon: '⛏',
    desc: 'Mines ore from planetary deposits.',
    cost: 150, free: false, requires: ['energy_bot'], tier: 1, branch: 'robots',
  },
  {
    id: 'builder_bot',
    name: 'BUILDER BOT',
    icon: '🔧',
    desc: 'Repairs damaged station hull between attacks.',
    cost: 800, free: false, requires: ['energy_bot'], tier: 1, branch: 'robots',
  },
  {
    id: 'energy_upgrades',
    name: 'ENERGY OPT.',
    icon: '⚡',
    desc: 'Unlocks speed and cargo upgrades for Energy Bots.',
    cost: 800, free: false, requires: ['energy_bot'], tier: 1, branch: 'robots',
  },
  {
    id: 'scout_bot',
    name: 'SCOUT BOT',
    icon: '📡',
    desc: 'Surveys terrain to unlock new resource deposits.',
    cost: 1500, free: false, requires: ['miner_bot'], tier: 2, branch: 'robots',
  },
  {
    id: 'miner_upgrades',
    name: 'MINING SPEC.',
    icon: '🪨',
    desc: 'Unlocks speed and cargo upgrades for Miner Bots.',
    cost: 1000, free: false, requires: ['miner_bot'], tier: 2, branch: 'robots',
  },
  {
    id: 'builder_upgrades',
    name: 'CONSTRUCTION',
    icon: '🔩',
    desc: 'Unlocks speed and toolkit upgrades for Builder Bots.',
    cost: 1500, free: false, requires: ['builder_bot'], tier: 2, branch: 'robots',
  },
  {
    id: 'energy_efficiency',
    name: 'ENERGY EFFICIENCY',
    icon: '⚡',
    desc: 'Energy Bots produce 20% more energy.',
    cost: 1500, free: false, requires: ['energy_upgrades'], tier: 2, branch: 'robots',
  },
  {
    id: 'mining_efficiency',
    name: 'MINING EFFICIENCY',
    icon: '📈',
    desc: 'Miner Bots produce 20% more ore.',
    cost: 1500, free: false, requires: ['miner_bot'], tier: 2, branch: 'robots',
  },
  {
    id: 'scout_upgrades',
    name: 'SCOUT ARRAY',
    icon: '🔭',
    desc: 'Unlocks speed and sensor upgrades for Scout Bots.',
    cost: 2000, free: false, requires: ['scout_bot'], tier: 3, branch: 'robots',
  },
  {
    id: 'builder_efficiency',
    name: 'REPAIR PROTOCOLS',
    icon: '🛠',
    desc: 'Builder Bots repair station hull 60% faster.',
    cost: 3000, free: false, requires: ['builder_upgrades'], tier: 3, branch: 'robots',
  },
  {
    id: 'crystal_focus',
    name: 'CRYSTAL FOCUS',
    icon: '💎',
    desc: 'Miners extract 30% more crystal.',
    cost: 3000, free: false, requires: ['scout_bot'], tier: 3, branch: 'robots',
  },
  {
    id: 'energy_efficiency_2',
    name: 'POWER SURGE',
    icon: '🌩',
    desc: 'Energy production increased to +40% total.',
    cost: 4000, free: false, requires: ['energy_efficiency'], tier: 3, branch: 'robots',
  },
  {
    id: 'mining_efficiency_2',
    name: 'DEEP EXTRACTION',
    icon: '⛏',
    desc: 'Ore production increased to +40% total.',
    cost: 4000, free: false, requires: ['mining_efficiency'], tier: 3, branch: 'robots',
  },
  {
    id: 'scout_speed',
    name: 'DEEP SCAN',
    icon: '🔍',
    desc: 'Scouts unlock deposit zones 40% faster.',
    cost: 2500, free: false, requires: ['scout_upgrades'], tier: 3, branch: 'robots',
  },
  {
    id: 'neural_sync',
    name: 'NEURAL SYNC',
    icon: '🧠',
    desc: 'Energy production increased to +60% total.',
    cost: 8000, free: false, requires: ['energy_efficiency_2'], tier: 4, branch: 'robots',
  },
  {
    id: 'deep_mining',
    name: 'CORE DRILL',
    icon: '🌋',
    desc: 'Ore production increased to +60% total.',
    cost: 8000, free: false, requires: ['mining_efficiency_2'], tier: 4, branch: 'robots',
  },

  // ─── DEFENSE branch ───────────────────────────────────────────────────────
  {
    id: 'cannon',
    name: 'STATION CANNON',
    icon: '🔫',
    desc: 'Turret mounted on the station.',
    cost: 0, free: true, requires: [], tier: 0, branch: 'defense',
  },
  {
    id: 'station_armor',
    name: 'STATION ARMOR I',
    icon: '🛡',
    desc: 'Reinforced hull plating. Station max HP +30.',
    cost: 800, free: false, requires: ['cannon'], tier: 1, branch: 'defense',
  },
  {
    id: 'satellite',
    name: 'DEF. SATELLITE',
    icon: '🛰',
    desc: 'Orbiting defense satellite with fast fire rate.',
    cost: 1000, free: false, requires: ['cannon'], tier: 1, branch: 'defense',
  },
  {
    id: 'patrol_craft',
    name: 'PATROL CRAFT',
    icon: '✈',
    desc: 'Armed patrol vessel that can clear hyperlane threats.',
    cost: 2000, free: false, requires: ['cannon'], tier: 1, branch: 'defense',
  },
  {
    id: 'station_armor_2',
    name: 'STATION ARMOR II',
    icon: '🛡',
    desc: 'Heavy armor plating. Station max HP +100 total.',
    cost: 2500, free: false, requires: ['station_armor'], tier: 2, branch: 'defense',
  },
  {
    id: 'shield',
    name: 'PLANETARY SHIELD',
    icon: '🔵',
    desc: 'Energy shield that absorbs damage before the station hull.',
    cost: 3000, free: false, requires: ['satellite'], tier: 2, branch: 'defense',
  },
  {
    id: 'cannon_upgrades',
    name: 'CANNON PROTOCOLS',
    icon: '💥',
    desc: 'Unlocks damage and fire rate upgrades for Station Cannons.',
    cost: 1500, free: false, requires: ['satellite'], tier: 2, branch: 'defense',
  },
  {
    id: 'satellite_upgrades',
    name: 'SATELLITE SYS.',
    icon: '🎯',
    desc: 'Unlocks damage and targeting upgrades for Defense Satellites.',
    cost: 2500, free: false, requires: ['satellite'], tier: 2, branch: 'defense',
  },
  {
    id: 'patrol_upgrades',
    name: 'FLEET TACTICS',
    icon: '⚔',
    desc: 'Unlocks weapon and armor upgrades for Patrol Craft.',
    cost: 3000, free: false, requires: ['patrol_craft'], tier: 2, branch: 'defense',
  },
  {
    id: 'orbital_damage',
    name: 'ORBITAL PAYLOAD',
    icon: '☄',
    desc: 'Orbital Strike deals 50% more damage.',
    cost: 3000, free: false, requires: ['patrol_craft'], tier: 2, branch: 'defense',
  },
  {
    id: 'emp_cooldown',
    name: 'EMP CAPACITORS',
    icon: '⚡',
    desc: 'EMP cooldown reduced by 25%.',
    cost: 2000, free: false, requires: ['satellite'], tier: 2, branch: 'defense',
  },
  {
    id: 'shield_boost_power',
    name: 'SHIELD OVERCHARGE',
    icon: '💙',
    desc: 'Shield Boost max HP doubled (×3 instead of ×2).',
    cost: 3000, free: false, requires: ['shield'], tier: 2, branch: 'defense',
  },
  {
    id: 'station_armor_3',
    name: 'STATION ARMOR III',
    icon: '🛡',
    desc: 'Fortress-grade plating. Station max HP +250 total.',
    cost: 6000, free: false, requires: ['station_armor_2'], tier: 3, branch: 'defense',
  },
  {
    id: 'shield_upgrades',
    name: 'SHIELD MATRIX',
    icon: '🌀',
    desc: 'Unlocks capacity and regen upgrades for Planetary Shields.',
    cost: 5000, free: false, requires: ['shield'], tier: 3, branch: 'defense',
  },
  {
    id: 'rapid_response',
    name: 'RAPID RESPONSE',
    icon: '⏱',
    desc: 'All ability cooldowns reduced by 20%.',
    cost: 5000, free: false, requires: ['emp_cooldown'], tier: 3, branch: 'defense',
  },
  {
    id: 'counter_measures',
    name: 'COUNTERMEASURES',
    icon: '💣',
    desc: 'Orbital Strike fires twice per activation.',
    cost: 6000, free: false, requires: ['orbital_damage'], tier: 3, branch: 'defense',
  },
  {
    id: 'fortress_protocol',
    name: 'FORTRESS PROTOCOL',
    icon: '🏰',
    desc: 'Maximum station armor. Station max HP +550 total.',
    cost: 10000, free: false, requires: ['station_armor_3'], tier: 4, branch: 'defense',
  },

  // ─── BASE / INFRASTRUCTURE branch ─────────────────────────────────────────
  {
    id: 'cargo_ships',
    name: 'CARGO SHIPS',
    icon: '🚢',
    desc: 'Enables trade routes and cargo ship dispatching between planets.',
    cost: 800, free: false, requires: [], tier: 0, branch: 'base',
  },
  {
    id: 'base_shipspeed',
    name: 'THRUSTER ARRAY',
    icon: '💨',
    desc: 'Unlocks Thruster upgrades — increase ship travel speed.',
    cost: 1000, free: false, requires: [], tier: 0, branch: 'base',
  },
  {
    id: 'base_passive',
    name: 'FUSION CELL',
    icon: '🔥',
    desc: 'Unlocks Fusion Cell upgrades — passive energy generation.',
    cost: 2500, free: false, requires: [], tier: 0, branch: 'base',
  },
  {
    id: 'ore_storage_1',
    name: 'ORE SILO I',
    icon: '📦',
    desc: 'Expands ore storage capacity by 1 000 on all owned planets.',
    cost: 600, free: false, requires: [], tier: 0, branch: 'base',
  },
  {
    id: 'energy_storage_1',
    name: 'ENERGY SILO I',
    icon: '🔋',
    desc: 'Expands energy storage capacity by 1 000 on all owned planets.',
    cost: 600, free: false, requires: [], tier: 0, branch: 'base',
  },
  {
    id: 'base_shipslots',
    name: 'DOCKING BAY',
    icon: '🚀',
    desc: 'Unlocks Docking Bay upgrades — more simultaneous ship routes.',
    cost: 2000, free: false, requires: ['base_shipspeed'], tier: 1, branch: 'base',
  },
  {
    id: 'ore_storage_2',
    name: 'ORE SILO II',
    icon: '📦',
    desc: 'Expands ore storage capacity by 2 000 on all owned planets.',
    cost: 1500, free: false, requires: ['ore_storage_1'], tier: 1, branch: 'base',
  },
  {
    id: 'energy_storage_2',
    name: 'ENERGY SILO II',
    icon: '🔋',
    desc: 'Expands energy storage capacity by 2 000 on all owned planets.',
    cost: 1500, free: false, requires: ['energy_storage_1'], tier: 1, branch: 'base',
  },
  {
    id: 'crystal_storage_1',
    name: 'CRYSTAL SILO I',
    icon: '💠',
    desc: 'Expands crystal storage capacity by 500 on all owned planets.',
    cost: 1000, free: false, requires: [], tier: 1, branch: 'base',
  },
  {
    id: 'passive_energy_2',
    name: 'FUSION CELL II',
    icon: '🔥',
    desc: 'Fusion Cells generate +2 energy/s globally (all planets).',
    cost: 2500, free: false, requires: ['base_passive'], tier: 1, branch: 'base',
  },
  {
    id: 'warp_drive',
    name: 'WARP DRIVE',
    icon: '🌀',
    desc: 'All cargo ships travel 30% faster.',
    cost: 3000, free: false, requires: ['base_shipspeed'], tier: 2, branch: 'base',
  },
  {
    id: 'ore_storage_3',
    name: 'ORE SILO III',
    icon: '📦',
    desc: 'Expands ore storage capacity by 5 000 on all owned planets.',
    cost: 4000, free: false, requires: ['ore_storage_2'], tier: 2, branch: 'base',
  },
  {
    id: 'energy_storage_3',
    name: 'ENERGY SILO III',
    icon: '🔋',
    desc: 'Expands energy storage capacity by 5 000 on all owned planets.',
    cost: 4000, free: false, requires: ['energy_storage_2'], tier: 2, branch: 'base',
  },
  {
    id: 'crystal_storage_2',
    name: 'CRYSTAL SILO II',
    icon: '💠',
    desc: 'Expands crystal storage capacity by 1 500 on all owned planets.',
    cost: 3000, free: false, requires: ['crystal_storage_1'], tier: 2, branch: 'base',
  },
  {
    id: 'passive_energy_3',
    name: 'FUSION CORE',
    icon: '☢',
    desc: 'Fusion Cells generate +6 energy/s total globally.',
    cost: 5000, free: false, requires: ['passive_energy_2'], tier: 2, branch: 'base',
  },
  {
    id: 'logistics_ai',
    name: 'LOGISTICS AI',
    icon: '🤖',
    desc: '+1 ship slot on every planet (stacks with Docking Bay upgrades).',
    cost: 4000, free: false, requires: ['base_shipslots'], tier: 2, branch: 'base',
  },
  {
    id: 'mega_storage',
    name: 'MEGA STORAGE',
    icon: '🏗',
    desc: 'All silo types gain +5 000 capacity on every owned planet.',
    cost: 8000, free: false, requires: ['ore_storage_3'], tier: 3, branch: 'base',
  },

  // ─── COLONIZATION branch ──────────────────────────────────────────────────
  {
    id: 'colony_ship',
    name: 'COLONY SHIP',
    icon: '🌍',
    desc: 'Unlocks the ability to build Colony Ships and colonize new planets.',
    cost: 2000, free: false, requires: [], tier: 0, branch: 'colonization',
  },
  {
    id: 'colony_build_speed',
    name: 'RAPID ASSEMBLY',
    icon: '⚙',
    desc: 'Colony ship build time reduced by 30%.',
    cost: 1500, free: false, requires: ['colony_ship'], tier: 1, branch: 'colonization',
  },
  {
    id: 'colony_cost_reduction',
    name: 'COLONIAL SUBSIDY',
    icon: '💰',
    desc: 'Colony base construction cost reduced by 20%.',
    cost: 2000, free: false, requires: ['colony_ship'], tier: 1, branch: 'colonization',
  },
  {
    id: 'colony_scanner',
    name: 'HYPERLANE SCANNER',
    icon: '🗺',
    desc: 'Advanced scanners — colony ships travel 25% faster.',
    cost: 4000, free: false, requires: ['colony_ship'], tier: 1, branch: 'colonization',
  },
  {
    id: 'colony_build_speed_2',
    name: 'MODULAR DESIGN',
    icon: '🏭',
    desc: 'Colony ship build time reduced by 50% total.',
    cost: 4000, free: false, requires: ['colony_build_speed'], tier: 2, branch: 'colonization',
  },
  {
    id: 'colony_cost_reduction_2',
    name: 'MASS PRODUCTION',
    icon: '💰',
    desc: 'Colony base construction cost reduced by 40% total.',
    cost: 5000, free: false, requires: ['colony_cost_reduction'], tier: 2, branch: 'colonization',
  },
  {
    id: 'colony_fleet',
    name: 'COLONY FLEET',
    icon: '🛸',
    desc: 'Up to 2 colony ships can be in transit simultaneously.',
    cost: 5000, free: false, requires: ['colony_build_speed'], tier: 2, branch: 'colonization',
  },
  {
    id: 'recolonization_discount',
    name: 'RECOVERY PROTOCOL',
    icon: '♻',
    desc: 'Recolonizing fallen planets costs 30% less.',
    cost: 3000, free: false, requires: ['colony_cost_reduction'], tier: 2, branch: 'colonization',
  },
  {
    id: 'hyperspace_drive',
    name: 'HYPERSPACE DRIVE',
    icon: '⭐',
    desc: 'Colony ships travel 30% faster (stacks with scanner).',
    cost: 4000, free: false, requires: ['colony_scanner'], tier: 2, branch: 'colonization',
  },
  {
    id: 'colony_speed',
    name: 'RAPID COLONIZATION',
    icon: '⚡',
    desc: 'Optimized colony protocols — colony ships travel 50% faster total.',
    cost: 6000, free: false, requires: ['colony_scanner'], tier: 2, branch: 'colonization',
  },
  {
    id: 'advanced_beacons',
    name: 'ADVANCED BEACONS',
    icon: '📡',
    desc: 'Up to 3 colony ships can be in transit simultaneously.',
    cost: 6000, free: false, requires: ['colony_fleet'], tier: 3, branch: 'colonization',
  },
  {
    id: 'colony_engineering',
    name: 'COLONIAL ENGINEERING',
    icon: '🏗',
    desc: 'Colony ship build time reduced by 70% total.',
    cost: 7000, free: false, requires: ['colony_build_speed_2'], tier: 3, branch: 'colonization',
  },
  {
    id: 'recolonization_discount_2',
    name: 'SALVAGE PROTOCOLS',
    icon: '♻',
    desc: 'Recolonizing fallen planets costs 50% less total.',
    cost: 6000, free: false, requires: ['recolonization_discount'], tier: 3, branch: 'colonization',
  },
  {
    id: 'rapid_colonization_2',
    name: 'WARP COLONIZATION',
    icon: '🚀',
    desc: 'Colony ships travel 70% faster total.',
    cost: 8000, free: false, requires: ['colony_speed'], tier: 3, branch: 'colonization',
  },
  {
    id: 'hyperlane_mastery',
    name: 'HYPERLANE MASTERY',
    icon: '🌌',
    desc: 'Colony ships travel at double speed total.',
    cost: 15000, free: false, requires: ['rapid_colonization_2'], tier: 4, branch: 'colonization',
  },
  {
    id: 'mass_migration',
    name: 'MASS MIGRATION',
    icon: '🌐',
    desc: 'Up to 5 colony ships can be in transit simultaneously.',
    cost: 12000, free: false, requires: ['advanced_beacons'], tier: 4, branch: 'colonization',
  },

  // ─── MILITARY branch ──────────────────────────────────────────────────────
  {
    id: 'military_base',
    name: 'ORBITAL SHIPYARDS',
    icon: '🎖️',
    desc: 'Unlocks construction of a Military Base in outer orbit to produce and manage fleets.',
    cost: 2000, free: false, requires: [], tier: 0, branch: 'military',
  },
  {
    id: 'fighter_chassis',
    name: 'FIGHTER CHASSIS',
    icon: '🚀',
    desc: 'Unlocks light, fast Fighter craft. High DPS, low durability.',
    cost: 2500, free: false, requires: ['military_base'], tier: 1, branch: 'military',
  },
  {
    id: 'supply_lines',
    name: 'SUPPLY LINES',
    icon: '📡',
    desc: 'Allows fleets to construct logistics relays to resupply at allied planets.',
    cost: 3000, free: false, requires: ['military_base'], tier: 1, branch: 'military',
  },
  {
    id: 'bomber_chassis',
    name: 'BOMBER CHASSIS',
    icon: '🛸',
    desc: 'Unlocks long-range Bomber craft. Massive burst damage, fragile.',
    cost: 4000, free: false, requires: ['fighter_chassis'], tier: 2, branch: 'military',
  },
  {
    id: 'fleet_formations',
    name: 'FLEET FORMATIONS',
    icon: '📐',
    desc: 'Increases Fleet Capacity per hangar built, allowing larger swarms.',
    cost: 3500, free: false, requires: ['military_base'], tier: 2, branch: 'military',
  },
  {
    id: 'carrier_vessels',
    name: 'CARRIER VESSELS',
    icon: '🚢',
    desc: 'Unlocks massive Carrier support ships that resupply and repair the fleet in combat.',
    cost: 5000, free: false, requires: ['supply_lines'], tier: 2, branch: 'military',
  },
  {
    id: 'battleship_chassis',
    name: 'BATTLESHIP CHASSIS',
    icon: '🛳️',
    desc: 'Unlocks heavy Battleships. High durability, steady multi-target artillery.',
    cost: 8000, free: false, requires: ['bomber_chassis'], tier: 3, branch: 'military',
  },
  {
    id: 'crystal_cores',
    name: 'CRYSTAL CORES',
    icon: '💎',
    desc: 'Unlocks Crystal usage for ultimate titan-class warships and global upgrades.',
    cost: 10000, free: false, requires: ['carrier_vessels'], tier: 3, branch: 'military',
  },
  {
    id: 'pure_crystal_lasers',
    name: 'PURE CRYSTAL LASERS',
    icon: '✨',
    desc: 'Permanent +20% Ammo capacity and +15% DPS for all ships across the galaxy.',
    cost: 50000, free: false, requires: ['crystal_cores'], tier: 4, branch: 'military',
  },
  {
    id: 'quantum_fuel',
    name: 'QUANTUM FUEL',
    icon: '🌌',
    desc: 'Permanent +50% Fuel capacity, reducing the need for fleet resupply stops.',
    cost: 50000, free: false, requires: ['crystal_cores'], tier: 4, branch: 'military',
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
  const has = id => unlockedTech instanceof Set ? unlockedTech.has(id) : unlockedTech.includes(id);
  // Cumulative speed bonuses — each node adds on top
  let mult = 1.0;
  if (has('colony_scanner'))       mult = 1.25;
  if (has('colony_speed'))         mult = 1.50;
  if (has('hyperspace_drive'))     mult *= 1.30;
  if (has('rapid_colonization_2')) mult = Math.max(mult, 1.70);
  if (has('hyperlane_mastery'))    mult = Math.max(mult, 2.00);
  return mult;
}

/**
 * Get the maximum number of colony ships allowed in transit simultaneously.
 */
export function getMaxColonyShipsInFlight(unlockedTech) {
  const has = id => unlockedTech instanceof Set ? unlockedTech.has(id) : unlockedTech.includes(id);
  if (has('mass_migration'))    return 5;
  if (has('advanced_beacons')) return 3;
  if (has('colony_fleet'))     return 2;
  return 1;
}
