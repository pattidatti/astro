import { PLANETS } from './planets.js';

/**
 * Enemy fighter types that spawn during raids and invasions.
 * - interceptor: fast, targets robots/drones
 * - bomber: tanky, targets station
 * - raider: medium, steals resources from silos
 */
export const ENEMY_TYPES = {
  interceptor: {
    id: 'interceptor',
    name: 'INTERCEPTOR',
    hp: 400,
    damage: 1,        // DPS to target
    speed: 1.2,        // movement speed multiplier
    target: 'robots',  // what it attacks
    stealRate: 0,
    color: '#ff3333',
    desc: 'Fast fighter that targets robots and drones',
  },
  bomber: {
    id: 'bomber',
    name: 'BOMBER',
    hp: 750,
    damage: 2,
    speed: 0.8,
    target: 'station',
    stealRate: 0,
    color: '#ff6600',
    desc: 'Heavy attacker that targets the station',
  },
  raider: {
    id: 'raider',
    name: 'RAIDER',
    hp: 500,
    damage: 1,
    speed: 1.0,
    target: 'silo',
    stealRate: 5,      // resources stolen per second
    color: '#ffaa00',
    desc: 'Steals resources from planetary silos',
  },
  mothership: {
    id: 'mothership',
    name: 'MOTHERSHIP',
    hp: 5000,
    damage: 5,
    speed: 0.3,
    target: 'station',
    stealRate: 0,
    color: '#cc0000',
    spawnInterval: 30,        // seconds between waves
    waveSizes: [3, 4, 5, 6],  // fighters per wave (escalating)
    desc: 'Capital ship that warps in and spawns fighter waves',
  },
};

/**
 * Raid templates — quick attacks (1-2 min), fighters only.
 * Each tier corresponds to a threat level range.
 */
export const RAID_TEMPLATES = [
  // Tier 0: threat 1-2 — light probe
  { tier: 0, minThreat: 1, composition: [{ type: 'interceptor', count: 2 }] },
  { tier: 0, minThreat: 1, composition: [{ type: 'raider', count: 2 }] },
  // Tier 1: threat 3-4
  { tier: 1, minThreat: 3, composition: [{ type: 'interceptor', count: 2 }] },
  { tier: 1, minThreat: 3, composition: [{ type: 'interceptor', count: 1 }, { type: 'raider', count: 1 }] },
  { tier: 1, minThreat: 3, composition: [{ type: 'bomber', count: 1 }, { type: 'interceptor', count: 1 }] },
  // Tier 2: threat 5-6
  { tier: 2, minThreat: 5, composition: [{ type: 'interceptor', count: 2 }, { type: 'bomber', count: 1 }] },
  { tier: 2, minThreat: 5, composition: [{ type: 'raider', count: 2 }, { type: 'interceptor', count: 1 }] },
  // Tier 3: threat 7-8
  { tier: 3, minThreat: 7, composition: [{ type: 'bomber', count: 2 }, { type: 'interceptor', count: 2 }] },
  { tier: 3, minThreat: 7, composition: [{ type: 'raider', count: 2 }, { type: 'bomber', count: 1 }, { type: 'interceptor', count: 1 }] },
  // Tier 4: threat 9-10
  { tier: 4, minThreat: 9, composition: [{ type: 'bomber', count: 3 }, { type: 'interceptor', count: 3 }] },
  { tier: 4, minThreat: 9, composition: [{ type: 'raider', count: 3 }, { type: 'bomber', count: 2 }, { type: 'interceptor', count: 2 }] },
];

/**
 * Invasion templates — rare, mothership + multiple fighter waves.
 */
export const INVASION_TEMPLATES = [
  // Tier 1: first invasion (threat 4+)
  {
    tier: 1, minThreat: 4,
    mothership: { hpMult: 1.0 },
    waves: [
      [{ type: 'interceptor', count: 2 }, { type: 'bomber', count: 1 }],
      [{ type: 'interceptor', count: 2 }, { type: 'raider', count: 1 }],
    ],
  },
  // Tier 2: mid-game invasion (threat 6+)
  {
    tier: 2, minThreat: 6,
    mothership: { hpMult: 1.5 },
    waves: [
      [{ type: 'interceptor', count: 3 }, { type: 'bomber', count: 1 }],
      [{ type: 'bomber', count: 2 }, { type: 'raider', count: 2 }],
      [{ type: 'interceptor', count: 2 }, { type: 'bomber', count: 2 }],
    ],
  },
  // Tier 3: late-game boss invasion (threat 8+)
  {
    tier: 3, minThreat: 8,
    mothership: { hpMult: 2.5 },
    waves: [
      [{ type: 'interceptor', count: 4 }, { type: 'bomber', count: 2 }],
      [{ type: 'raider', count: 3 }, { type: 'bomber', count: 2 }],
      [{ type: 'interceptor', count: 3 }, { type: 'bomber', count: 3 }, { type: 'raider', count: 2 }],
      [{ type: 'bomber', count: 4 }, { type: 'interceptor', count: 4 }],
    ],
  },
];

/**
 * Calculate threat level (0-10) for a planet.
 *
 * Threat is dominated by what the player has actually built *on that planet*,
 * because that is what the player's defences are also scoped to. The previous
 * formula was driven by owned-planet count, which meant settling a fifth planet
 * raised the threat on all four existing ones at once, with no matching increase
 * in anyone's ability to defend — expansion was punished rather than escalated,
 * and a freshly landed colony with no robots faced the same waves as a developed
 * world. A small global term survives so that a sprawling empire is still a
 * bigger target than a single world.
 *
 * Xerion always returns 0 (peaceful home world).
 *
 * @param {number} ownedPlanetCount
 * @param {string} planetId
 * @param {object|null} planetState  the planet's own state record; omitting it
 *        scores the planet as undeveloped, which is the safe direction to err.
 */
export function scaleThreat(ownedPlanetCount, planetId, planetState = null) {
  if (planetId === 'xerion') return 0;
  const def = PLANETS.find(p => p.id === planetId);
  if (!def) return 0;

  // How juicy the planet is intrinsically — Drakon ~1.1, Voidex ~2.8.
  const valueThreat = def.threatValue > 0 ? Math.log10(def.threatValue) * 0.4 : 0;

  // How much there is to raid here. An empty colony scores 0.
  let developmentThreat = 0;
  if (planetState) {
    const robots = Object.values(planetState.robots || {})
      .reduce((sum, r) => sum + (r?.count || 0), 0);
    developmentThreat += Math.min(5, robots / 8);
    developmentThreat += (planetState.baseLevels?.storage || 0) * 0.4;
    if (planetState.militaryBase?.built) developmentThreat += 1;
  }

  // Empire-wide attention: present, but no longer the dominant term.
  const expansionThreat = Math.max(0, ownedPlanetCount - 1) * 0.25;

  return Math.min(10, Math.round(valueThreat + developmentThreat + expansionThreat));
}

/**
 * Get appropriate raid templates for a given threat level.
 */
export function getRaidTemplates(threatLevel) {
  return RAID_TEMPLATES.filter(t => t.minThreat <= threatLevel);
}

/**
 * Get appropriate invasion templates for a given threat level.
 */
export function getInvasionTemplates(threatLevel) {
  return INVASION_TEMPLATES.filter(t => t.minThreat <= threatLevel);
}

/**
 * Raid spawn probability per second at a given threat level.
 * Returns probability that a raid starts this second.
 */
export function raidSpawnChance(threatLevel) {
  if (threatLevel <= 0) return 0;
  // Base: ~1 raid per 5 minutes at threat 1, scaling to ~1 per minute at threat 10
  const baseInterval = 300 - (threatLevel - 1) * 25; // 300s → 75s
  return 1 / Math.max(30, baseInterval);
}

/**
 * Invasion spawn probability per second at a given threat level.
 * Much rarer than raids.
 */
export function invasionSpawnChance(threatLevel) {
  if (threatLevel < 4) return 0; // No invasions below threat 4
  // ~1 invasion per 20 minutes at threat 4, scaling to ~1 per 8 minutes at threat 10
  const baseInterval = 1200 - (threatLevel - 4) * 100; // 1200s → 600s
  return 1 / Math.max(300, baseInterval);
}

/** Minimum gap in seconds between attacks on the same planet. */
export const MIN_ATTACK_GAP = 60;

/**
 * Grace period in seconds after colonizing a planet before attacks can start.
 * A new colony lands with no robots, no defences and an empty silo; 60s was not
 * enough to build anything before the first raid arrived.
 */
export const COLONIZATION_GRACE_PERIOD = 180;

/** Maximum concurrent active attacks across all planets. */
export const MAX_CONCURRENT_ATTACKS = 3;
