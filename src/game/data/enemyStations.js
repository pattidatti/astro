/**
 * Enemy Station definitions for the Enemy Expansion.
 * 7 total stations: 4 planet-anchored + 3 free-floating.
 */

export const ENEMY_STATION_DEFS = [
  // Planet-anchored (4)
  { id: 'station_nebulox',  type: 'lava',       stationClass: 'orbital',   anchorPlanet: 'nebulox',  maxHP: 800,  shieldMaxHP: 200, orbitRadius: 50 },
  { id: 'station_glacius',  type: 'ice',        stationClass: 'orbital',   anchorPlanet: 'glacius',  maxHP: 600,  shieldMaxHP: 600, orbitRadius: 50 },
  { id: 'station_solaris',  type: 'industrial', stationClass: 'orbital',   anchorPlanet: 'solaris',  maxHP: 700,  shieldMaxHP: 400, orbitRadius: 50 },
  { id: 'station_voidex',   type: 'void',       stationClass: 'flagship',  anchorPlanet: 'voidex',   maxHP: 1200, shieldMaxHP: 300, orbitRadius: 50 },
  // Free-floating (3)
  { id: 'outpost_alpha',    type: 'generic',    stationClass: 'outpost',   anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
  { id: 'outpost_beta',     type: 'generic',    stationClass: 'outpost',   anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
  { id: 'outpost_gamma',    type: 'generic',    stationClass: 'outpost',   anchorPlanet: null,       maxHP: 800,  shieldMaxHP: 300, orbitRadius: null },
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
