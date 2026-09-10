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
 *
 * The cargo size is stored as a percentage of the source silo, not as an
 * absolute amount: the player picks "ship 40% of my ore", and that intent
 * should survive a silo upgrade. Resolve it with routeCargoAmount() at the
 * moment of dispatch.
 *
 * @param {string} fromPlanet
 * @param {string} toPlanet
 * @param {string} resource
 * @param {number} pct  share of the source silo's capacity, 1–100
 */
export function createRoute(fromPlanet, toPlanet, resource, pct) {
  return {
    id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    fromPlanet,
    toPlanet,
    resource,
    pct: clampPct(pct),
    active: true,
    lastDispatchTime: 0,
  };
}

/** Constrain a route share to the range the UI slider offers. */
export function clampPct(pct) {
  return Math.min(100, Math.max(1, Math.round(pct)));
}

/**
 * Resolve a route's percentage against the source planet's current silo
 * capacity. Returns 0 when the silo doesn't exist or holds nothing (a locked
 * crystal silo has capacity 0), which callers read as "cannot dispatch".
 */
export function routeCargoAmount(route, sourcePlanetState) {
  const capacity = sourcePlanetState?.silos?.[route.resource]?.capacity ?? 0;
  if (capacity <= 0) return 0;
  return Math.max(1, Math.round(clampPct(route.pct) / 100 * capacity));
}

/**
 * Validate a route definition. Returns null if valid, error string if invalid.
 */
export function validateRoute(route, ownedPlanets) {
  if (!ownedPlanets.includes(route.fromPlanet)) return 'Source planet not owned';
  if (!ownedPlanets.includes(route.toPlanet))   return 'Destination planet not owned';
  if (route.fromPlanet === route.toPlanet)       return 'Source and destination must differ';
  if (!SHIPPABLE_RESOURCES.includes(route.resource)) return 'Invalid resource type';
  if (!(route.pct > 0))                          return 'Cargo share must be positive';
  return null;
}
