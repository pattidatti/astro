import { PLANETS } from './planets.js';

/** Valid resource types that can be shipped */
export const SHIPPABLE_RESOURCES = ['ore', 'energy', 'crystal'];

/**
 * Calculate ship travel duration in seconds between two planets.
 * Based on orbital radius difference as a stable proxy for distance.
 * @param {string} fromPlanetId
 * @param {string} toPlanetId
 * @param {number} shipSpeedLevel - base speed upgrade level (0-5)
 */
export function calcTravelDuration(fromPlanetId, toPlanetId, shipSpeedLevel = 0) {
  const from = PLANETS.find(p => p.id === fromPlanetId);
  const to   = PLANETS.find(p => p.id === toPlanetId);
  if (!from || !to) return 60;

  const orbitDist = Math.abs(from.orbit.radius - to.orbit.radius) + Math.min(from.orbit.radius, to.orbit.radius) * 0.25;
  // Base: ~60s per 100 orbit units. Speed level reduces by 20% per level.
  const speedFactor = Math.pow(0.8, shipSpeedLevel);
  return Math.max(10, (orbitDist / 100) * 60 * speedFactor);
}

/**
 * Create a new route definition.
 * @param {string} fromPlanet
 * @param {string} toPlanet
 * @param {string} resource
 * @param {number} amount
 * @param {number} intervalMinutes
 */
export function createRoute(fromPlanet, toPlanet, resource, amount) {
  return {
    id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    fromPlanet,
    toPlanet,
    resource,
    amount,
    active: true,
    lastDispatchTime: 0,
  };
}

/**
 * Validate a route definition. Returns null if valid, error string if invalid.
 */
export function validateRoute(route, ownedPlanets) {
  if (!ownedPlanets.includes(route.fromPlanet)) return 'Source planet not owned';
  if (!ownedPlanets.includes(route.toPlanet))   return 'Destination planet not owned';
  if (route.fromPlanet === route.toPlanet)       return 'Source and destination must differ';
  if (!SHIPPABLE_RESOURCES.includes(route.resource)) return 'Invalid resource type';
  if (route.amount <= 0)                         return 'Amount must be positive';
  return null;
}
