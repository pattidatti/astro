/** Base upgrades — purchased per-planet using local energy */
export const BASE_UPGRADES = [
  {
    id: 'base_storage',
    name: 'SILO EXPANSION',
    icon: '🏗',
    desc: 'Increase storage capacity on this planet',
    effect: 'storage',
    maxLevel: 5,
    energyCost: [100, 300, 1000, 5000, 20000],
    capacityBonus: [500, 1500, 5000, 20000, 100000], // additional capacity per level
  },
  {
    id: 'base_shipspeed',
    name: 'THRUSTER MK.',
    icon: '⚡',
    desc: 'Increase ship travel speed for routes from this planet',
    effect: 'shipSpeed',
    maxLevel: 5,
    energyCost: [200, 600, 2000, 8000, 30000],
  },
  {
    id: 'base_shipslots',
    name: 'DOCKING BAY',
    icon: '🚀',
    desc: 'Allow more simultaneous ship routes from this planet',
    effect: 'shipSlots',
    maxLevel: 5,
    energyCost: [500, 1500, 5000, 15000, 50000],
  },
  {
    id: 'base_passive',
    name: 'FUSION CELL',
    icon: '🔥',
    desc: 'Generate energy passively without energy bots',
    effect: 'passiveEnergy',
    maxLevel: 3,
    energyCost: [1000, 5000, 20000],
    passiveRate: [2, 8, 30], // energy/s per level
  },
];

/** Robot hire actions — cost scales with existing robot count on the planet */
export const ROBOT_ACTIONS = [
  {
    id: 'hire_miner',
    type: 'miner',
    name: 'MINER BOT',
    icon: '⛏',
    desc: 'Mines ore from planetary deposits',
    energyCostFn: (ps) => Math.floor(10 * Math.pow(1.15, ps.robots.miner.count)),
  },
  {
    id: 'hire_energy',
    type: 'energyBot',
    name: 'ENERGY BOT',
    icon: '🔋',
    desc: 'Harvests energy from the planet',
    energyCostFn: (ps) => Math.floor(15 * Math.pow(1.15, ps.robots.energyBot.count)),
  },
  {
    id: 'hire_builder',
    type: 'builder',
    name: 'BUILDER BOT',
    icon: '🔧',
    desc: 'Repairs damaged station hull between attacks',
    energyCostFn: (ps) => Math.floor(20 * Math.pow(1.15, ps.robots.builder.count)),
  },
  {
    id: 'hire_scout',
    type: 'scout',
    name: 'SCOUT BOT',
    icon: '📡',
    desc: 'Surveys terrain to unlock new resource deposits',
    energyCostFn: (ps) => Math.floor(25 * Math.pow(1.15, ps.robots.scout.count)),
  },
];

/** Robot specialization upgrades — purchased per-planet using local energy */
export const ROBOT_UPGRADES = [
  { id: 'miner_speed', robotType: 'miner',     effect: 'speedLevel', name: 'MINER THRUSTERS', icon: '💨', maxLevel: 5, energyCost: [200, 800, 3000, 10000, 40000] },
  { id: 'miner_load',  robotType: 'miner',     effect: 'loadLevel',  name: 'MINER CARGO BAY',  icon: '📦', maxLevel: 5, energyCost: [300, 1000, 4000, 15000, 60000] },
  { id: 'enrg_speed',  robotType: 'energyBot', effect: 'speedLevel', name: 'ENERGY THRUSTERS', icon: '💨', maxLevel: 5, energyCost: [250, 900, 3500, 12000, 45000] },
  { id: 'enrg_load',   robotType: 'energyBot', effect: 'loadLevel',  name: 'ENERGY CAPACITOR', icon: '⚡', maxLevel: 5, energyCost: [350, 1100, 4500, 16000, 65000] },
  { id: 'bldr_speed',  robotType: 'builder',   effect: 'speedLevel', name: 'BUILDER THRUSTERS', icon: '💨', maxLevel: 5, energyCost: [300, 1000, 4000, 14000, 55000] },
  { id: 'bldr_load',   robotType: 'builder',   effect: 'loadLevel',  name: 'BUILDER TOOLKIT',  icon: '🔩', maxLevel: 5, energyCost: [400, 1200, 5000, 18000, 70000] },
  { id: 'scot_speed',  robotType: 'scout',     effect: 'speedLevel', name: 'SCOUT THRUSTERS',  icon: '💨', maxLevel: 5, energyCost: [350, 1100, 4500, 16000, 60000] },
  { id: 'scot_load',   robotType: 'scout',     effect: 'loadLevel',  name: 'SCOUT SENSORS',    icon: '🔭', maxLevel: 5, energyCost: [450, 1300, 5500, 20000, 80000] },
];

/** Speed/load level → multiplier mapping */
export function getSpeedMult(level) { return 1 + level * 0.2; }  // +20% per level
export function getLoadMult(level)  { return 1 + level * 0.3; }  // +30% per level
