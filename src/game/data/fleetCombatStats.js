/**
 * Fleet combat balance constants for Phase 5.
 *
 * These govern open-space engagement between player fleets and enemy roaming fleets.
 */

// ─── Engagement ────────��────────────────────────────────────────────────────
export const ENGAGE_RADIUS        = 30;   // world units — triggers engagement
export const DISENGAGE_RADIUS     = 50;   // flee beyond this to break combat

// ─── Combat behavior distances ────────────��─────────────────────────────────
export const FIGHTER_ORBIT_RADIUS = 3;    // fighters circle at this distance from enemy center
export const BOMBER_STANDOFF      = 22;   // bombers hold at this range
export const CARRIER_REAR_OFFSET  = 15;   // carriers stay behind fleet center
export const ARTILLERY_OFFSET     = 16;   // battleships hold at medium-long range
export const DREADNOUGHT_OFFSET   = 18;   // titans hold steady at range

// ─── Timing ──────��─────────────────────────────���────────────────────────────
export const AGGRO_CHECK_INTERVAL = 0.5;  // seconds between proximity scans
export const FIRE_VISUAL_INTERVAL = 0.3;  // min seconds between VFX fire events per ship

// ─── Tech multipliers ─────────────��─────────────────────────────────────────
export const CRYSTAL_LASER_DPS_MULT  = 1.15; // tech: pure_crystal_lasers → +15% DPS
export const CRYSTAL_LASER_AMMO_MULT = 1.20; // tech: pure_crystal_lasers → +20% ammo (future)

// ─── Military base combat ───────────────────────────────────────────���───────
export const MILITARY_BASE_HP     = 500;
export const MILITARY_BASE_MAX_HP = 500;

// ─── Station combat ──────────────────────────────────────────────────────────
export const STATION_ENGAGE_RANGE     = 20;   // world units — siege starts when fleet within this distance
export const STATION_DISENGAGE_RANGE  = 60;   // siege ends if fleet moves beyond this
export const STATION_FIRE_INTERVAL    = 0.5;  // seconds between station VFX fire events per siege
export const STATION_DPS = {
  alert:    3,
  skirmish: 8,
  war:      15,
};
