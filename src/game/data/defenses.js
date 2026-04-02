/**
 * Defense types that can be built per planet.
 * Each type has independent levels, costs, and combat stats.
 */
export const DEFENSE_TYPES = {
  cannon: {
    id: 'cannon',
    name: 'STATION CANNON',
    icon: '🔫',
    desc: 'Turret mounted on the station. High damage, moderate fire rate.',
    maxLevel: 5,
    // Stats per level (index = level - 1)
    damage:   [10, 14, 19, 25, 33],
    fireRate: [1.5, 1.6, 1.8, 2.0, 2.3],  // shots per second
    range: 'planet',  // fires at any enemy near the planet
    energyCost: [50, 150, 500, 2000, 8000],
  },
  satellite: {
    id: 'satellite',
    name: 'DEFENSE SATELLITE',
    icon: '🛰',
    desc: 'Orbiting satellite. Lower damage but fast fire rate.',
    maxLevel: 5,
    damage:   [6, 9, 12, 16, 22],
    fireRate: [2.0, 2.3, 2.6, 3.0, 3.5],
    range: 'orbit',
    energyCost: [80, 250, 800, 3000, 12000],
  },
  defenseShip: {
    id: 'defenseShip',
    name: 'PATROL CRAFT',
    icon: '🛡',
    desc: 'Armed patrol vessel. Can clear hyperlane threats.',
    maxLevel: 3,
    damage:   [8, 13, 20],
    fireRate: [1.0, 1.2, 1.5],
    range: 'hyperlane',  // can also patrol hyperlanes
    energyCost: [200, 1000, 5000],
  },
  shield: {
    id: 'shield',
    name: 'PLANETARY SHIELD',
    icon: '🔵',
    desc: 'Energy shield absorbing damage before station hull. Drains energy.',
    maxLevel: 5,
    // Shield provides HP pool, not damage
    shieldHP:    [100, 200, 350, 550, 800],
    regenRate:   [2, 4, 7, 11, 16],       // shield HP regenerated per second
    energyDrain: [1, 2, 3, 5, 8],         // energy consumed per second while active
    energyCost:  [150, 500, 2000, 8000, 30000],
  },
};

/**
 * Defense upgrade tree — separate from base upgrades.
 * Each upgrade enhances a specific defense type's stats.
 */
export const DEFENSE_UPGRADES = [
  // Cannon upgrades
  {
    id: 'cannon_damage',
    defenseType: 'cannon',
    effect: 'damageMult',
    name: 'CANNON CALIBER',
    icon: '💥',
    desc: '+20% cannon damage per level',
    maxLevel: 5,
    mult: 0.2,  // +20% per level
    energyCost: [100, 400, 1500, 5000, 20000],
  },
  {
    id: 'cannon_firerate',
    defenseType: 'cannon',
    effect: 'fireRateMult',
    name: 'RAPID LOADER',
    icon: '⚡',
    desc: '+15% cannon fire rate per level',
    maxLevel: 5,
    mult: 0.15,
    energyCost: [120, 450, 1800, 6000, 24000],
  },
  // Satellite upgrades
  {
    id: 'sat_damage',
    defenseType: 'satellite',
    effect: 'damageMult',
    name: 'SAT BEAM FOCUS',
    icon: '💥',
    desc: '+20% satellite damage per level',
    maxLevel: 5,
    mult: 0.2,
    energyCost: [150, 600, 2200, 7000, 28000],
  },
  {
    id: 'sat_firerate',
    defenseType: 'satellite',
    effect: 'fireRateMult',
    name: 'SAT TARGETING',
    icon: '🎯',
    desc: '+15% satellite fire rate per level',
    maxLevel: 5,
    mult: 0.15,
    energyCost: [180, 700, 2500, 8000, 32000],
  },
  // Defense ship upgrades
  {
    id: 'ship_damage',
    defenseType: 'defenseShip',
    effect: 'damageMult',
    name: 'SHIP WEAPONS',
    icon: '💥',
    desc: '+25% patrol craft damage per level',
    maxLevel: 3,
    mult: 0.25,
    energyCost: [300, 2000, 10000],
  },
  {
    id: 'ship_armor',
    defenseType: 'defenseShip',
    effect: 'armorMult',
    name: 'SHIP ARMOR',
    icon: '🛡',
    desc: '+20% patrol craft durability per level',
    maxLevel: 3,
    mult: 0.2,
    energyCost: [350, 2500, 12000],
  },
  // Shield upgrades
  {
    id: 'shield_capacity',
    defenseType: 'shield',
    effect: 'capacityMult',
    name: 'SHIELD CAPACITOR',
    icon: '🔋',
    desc: '+25% shield max HP per level',
    maxLevel: 5,
    mult: 0.25,
    energyCost: [200, 800, 3000, 10000, 40000],
  },
  {
    id: 'shield_regen',
    defenseType: 'shield',
    effect: 'regenMult',
    name: 'SHIELD REGENERATOR',
    icon: '♻',
    desc: '+20% shield regen rate per level',
    maxLevel: 5,
    mult: 0.2,
    energyCost: [250, 1000, 4000, 12000, 48000],
  },
];

/**
 * Active abilities the player can trigger during combat.
 * Each has a cooldown and energy cost.
 */
export const ACTIVE_ABILITIES = {
  emp: {
    id: 'emp',
    name: 'EMP BURST',
    icon: '⚡',
    desc: 'Disables all enemies for 5 seconds',
    duration: 5,
    cooldown: 120,
    energyCost: 50,
  },
  shieldBoost: {
    id: 'shieldBoost',
    name: 'SHIELD BOOST',
    icon: '🔵',
    desc: 'Doubles shield HP for 10 seconds',
    duration: 10,
    cooldown: 90,
    energyCost: 30,
  },
  orbitalStrike: {
    id: 'orbitalStrike',
    name: 'ORBITAL STRIKE',
    icon: '☄',
    desc: 'Massive AoE damage to all enemies',
    damage: 200,
    cooldown: 60,
    energyCost: 100,
  },
};

/** Base station HP for all planets. */
export const BASE_STATION_HP = 100;

/** Builder robot repair rate per bot per second (base). */
export const BUILDER_REPAIR_RATE = 2;

/** Recolonization cost multiplier (applied to original baseCost). */
export const RECOLONIZE_COST_MULT = 0.5;

/** Fraction of robots that survive planet fall. */
export const FALL_ROBOT_SURVIVAL = 0.5;

/**
 * Calculate total DPS output for a planet's defenses.
 * Used for simplified off-screen combat simulation.
 */
export function calcDefenseDPS(combat) {
  let dps = 0;
  for (const [typeId, level] of Object.entries(combat.defenses)) {
    if (level <= 0) continue;
    const def = DEFENSE_TYPES[typeId];
    if (!def || !def.damage) continue;
    const baseDmg = def.damage[level - 1];
    const baseRate = def.fireRate ? def.fireRate[level - 1] : 1;

    // Apply upgrade multipliers
    const dmgUpgrade = DEFENSE_UPGRADES.find(u => u.defenseType === typeId && u.effect === 'damageMult');
    const rateUpgrade = DEFENSE_UPGRADES.find(u => u.defenseType === typeId && u.effect === 'fireRateMult');
    const dmgLevel = dmgUpgrade ? (combat.defenseLevels[dmgUpgrade.id] || 0) : 0;
    const rateLevel = rateUpgrade ? (combat.defenseLevels[rateUpgrade.id] || 0) : 0;
    const dmgMult = 1 + dmgLevel * (dmgUpgrade?.mult || 0);
    const rateMult = 1 + rateLevel * (rateUpgrade?.mult || 0);

    dps += baseDmg * baseRate * dmgMult * rateMult;
  }
  return dps;
}

/**
 * Calculate total enemy DPS for a list of enemies.
 */
export function calcEnemyDPS(enemies) {
  let dps = 0;
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue;
    dps += enemy.damage;
  }
  return dps;
}
