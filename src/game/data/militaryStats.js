/**
 * militaryStats.js — Balance constants for the military fleet supply system
 * and Titan Ultimate ability (Fase 6).
 *
 * Combat engagement constants remain in fleetCombatStats.js.
 */

// ── Supply capacity per ship ──────────────────────────────────────────────────
export const SUPPLY_ENERGY_PER_SHIP_BASE = 200; // energy capacity per ship in fleet
export const SUPPLY_ORE_PER_SHIP_BASE    = 150; // ore capacity per ship in fleet

// ── Consumption rates ─────────────────────────────────────────────────────────
export const FUEL_BURN_RATE     = 5;  // energy/s per alive ship while fleet.state === 'moving'
export const AMMO_BURN_RATE     = 8;  // ore/s per alive ship while fleet.state === 'engaged'

// ── Resupply rates ────────────────────────────────────────────────────────────
export const RESUPPLY_RATE          = 20; // resource/s base rate while orbiting near allied base
export const RESUPPLY_DIST          = 20; // world units — max distance from base to receive resupply
export const CARRIER_RESUPPLY_MULT  = 2.0; // orbit resupply multiplier when fleet has Carrier
export const CARRIER_COMBAT_RESUPPLY = 5;  // ore/s Carrier restores to fleet while engaged

// ── DPS penalty when out of ammo ─────────────────────────────────────────────
export const DPS_PENALTY_THRESHOLD = 0.2; // ore below this fraction of max triggers penalty
export const DPS_PENALTY_MULT      = 0.3; // DPS multiplier when penalised (30% of normal)

// ── Tech bonuses ──────────────────────────────────────────────────────────────
export const QUANTUM_FUEL_ENERGY_MULT = 1.5; // energy max multiplier with quantum_fuel tech

// ── Titan Ultimate ────────────────────────────────────────────────────────────
export const TITAN_ULTIMATE_COOLDOWN             = 120; // seconds
export const TITAN_ULTIMATE_RADIUS               = 15;  // world units AoE radius
export const TITAN_ULTIMATE_COST_ORE             = 50;  // ore deducted on use
export const TITAN_ULTIMATE_LIGHT_HP_THRESHOLD   = 90;  // enemies with maxHP ≤ this are instantly killed
export const TITAN_ULTIMATE_HEAVY_DAMAGE         = 200; // damage dealt to heavier enemies

// ── Emergency Jump ────────────────────────────────────────────────────────────
export const EMERGENCY_JUMP_COOLDOWN         = 300;  // seconds between jumps
export const EMERGENCY_JUMP_ENERGY_COST_PCT  = 0.4;  // fraction of current energy consumed
