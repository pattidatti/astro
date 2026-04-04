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
