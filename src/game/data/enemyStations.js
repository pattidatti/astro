/**
 * Enemy Station definitions for the Enemy Expansion.
 * 7 total stations: 4 planet-anchored + 3 free-floating.
 */

export const ENEMY_STATION_DEFS = [
  // Planet-anchored (4)
  { id: 'station_drakon',   type: 'lava',       anchorPlanet: 'drakon',   maxHP: 800,  shieldMaxHP: 200, orbitRadius: 50 },
  { id: 'station_glacius',  type: 'ice',        anchorPlanet: 'glacius',  maxHP: 600,  shieldMaxHP: 600, orbitRadius: 50 },
  { id: 'station_crystara', type: 'industrial', anchorPlanet: 'crystara', maxHP: 700,  shieldMaxHP: 400, orbitRadius: 50 },
  { id: 'station_voidex',   type: 'void',       anchorPlanet: 'voidex',   maxHP: 1200, shieldMaxHP: 300, orbitRadius: 50 },
  // Free-floating (3)
  { id: 'outpost_alpha',    type: 'generic',    anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
  { id: 'outpost_beta',     type: 'generic',    anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
  { id: 'outpost_gamma',    type: 'generic',    anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
];

/**
 * Build default enemy station state objects from definitions.
 * Called on new game and during v5→v6 migration.
 */
export function buildDefaultEnemyStations() {
  return ENEMY_STATION_DEFS.map(def => ({
    id: def.id,
    type: def.type,
    anchorPlanet: def.anchorPlanet,
    hp: def.maxHP,
    maxHP: def.maxHP,
    shieldHP: def.shieldMaxHP,
    shieldMaxHP: def.shieldMaxHP,
    phase: 'dormant',
    lastSpawnTime: 0,
    scoutIds: [],
    cleared: false,
    distressFlareFired: false,
  }));
}
