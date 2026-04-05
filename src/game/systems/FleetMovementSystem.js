import { gameState } from '../GameState.js';

/**
 * FleetMovementSystem — moves player fleets toward waypoints using Boids.
 *
 * Per-frame:
 *   1. Fleet center moves toward waypoint at fleet.speed (world units/sec),
 *      blended with sun-avoidance repulsion from the central star at origin.
 *   2. Each ship applies Boids rules (separation, cohesion, alignment) to
 *      update its localPos (offset from fleet center). localPos is runtime-only
 *      and is NOT serialized.
 *
 * Register with animationLoop.onUpdate in main.js after RouteSystem.
 */

const SUN_AVOID_RADIUS   = 35;   // units around origin (central star) — push fleet away
const SUN_AVOID_STRENGTH = 60;   // strength multiplier for avoidance
const ARRIVAL_RADIUS     = 3;    // fleet "arrives" when center is within this radius of waypoint

// Boids parameters for individual ships within the fleet
const SEP_RADIUS      = 7;    // separation trigger radius (world units in local space)
const SEP_STRENGTH    = 22;   // push-away force per unit of overlap
const COHESION_STR    = 6;    // pull toward fleet center (0,0,0 local)
const ALIGN_STR       = 10;   // align velocity with fleet heading
const VEL_DAMPING     = 0.88; // per-frame velocity decay (0–1)
const MAX_LOCAL_VEL   = 8;    // cap on local-space ship speed
const MAX_SPREAD      = 18;   // maximum localPos distance from center

export class FleetMovementSystem {
  constructor(animationLoop) {
    this._galaxy = null;
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  /** Set the Galaxy reference for position lookups. */
  setGalaxy(galaxy) {
    this._galaxy = galaxy;
  }

  /** Execute an emergency jump to the given planet's station. */
  _execEmergencyJump(fleet, targetPlanetId) {
    const owned = this._galaxy?.getOwnedStationPositions();
    const dest = owned?.find(s => s.planetId === targetPlanetId);
    if (!dest?.worldPos) return;
    fleet.position = { x: dest.worldPos.x, y: 0, z: dest.worldPos.z };
    fleet.waypoint = null;
    fleet.state = 'orbiting';
    gameState.emit('emergencyJumpExecuted', { fleetId: fleet.id, targetPlanetId });
  }

  _tick(dt) {
    for (const fleet of gameState.playerFleets) {
      // Tick down emergency jump cooldown
      if (fleet.emergencyJumpCooldown > 0) {
        fleet.emergencyJumpCooldown = Math.max(0, fleet.emergencyJumpCooldown - dt);
      }

      // Execute a pending jump (set by GameState.dispatchEmergencyJump)
      if (fleet.pendingEmergencyJump) {
        const targetId = fleet.pendingEmergencyJump;
        fleet.pendingEmergencyJump = null;
        this._execEmergencyJump(fleet, targetId);
        continue; // skip normal movement this tick
      }

      if (fleet.state !== 'moving' || !fleet.waypoint) continue;
      this._moveFleet(dt, fleet);
    }
  }

  // ─── Fleet-level movement ─────────────────────────────────────────────────

  _moveFleet(dt, fleet) {
    const cx = fleet.position.x;
    const cz = fleet.position.z;
    const wx = fleet.waypoint.x;
    const wz = fleet.waypoint.z;

    const dx = wx - cx;
    const dz = wz - cz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Arrived?
    if (dist < ARRIVAL_RADIUS) {
      fleet.state    = 'orbiting';
      fleet.waypoint = null;
      gameState.emit('playerFleetArrived', { fleetId: fleet.id });

      // Scavenger hold delivery
      if (fleet.deliverHold && fleet.hold) {
        const { planetId } = fleet.deliverHold;
        const ps = gameState.getPlanetState(planetId);
        if (ps) {
          const oreTransfer   = Math.max(0, Math.min(fleet.hold.ore,     ps.silos.ore.capacity     - ps.silos.ore.amount));
          const crystTransfer = Math.max(0, Math.min(fleet.hold.crystal, ps.silos.crystal.capacity - ps.silos.crystal.amount));
          ps.silos.ore.amount     = Math.min(ps.silos.ore.capacity,     ps.silos.ore.amount     + oreTransfer);
          ps.silos.crystal.amount = Math.min(ps.silos.crystal.capacity, ps.silos.crystal.amount + crystTransfer);
          gameState.emit('siloChanged', { planetId });
          gameState.emit('scavengerDelivered', { fleetId: fleet.id, planetId, hold: { ...fleet.hold } });
          fleet.hold        = { ore: 0, crystal: 0 };
          fleet.deliverHold = null;
        } else {
          // BUG-C: planet no longer exists — keep hold intact, just clear delivery
          fleet.deliverHold = null;
        }
      }

      return;
    }

    // Direction toward waypoint
    let dirX = dx / dist;
    let dirZ = dz / dist;

    // Sun avoidance — push away from origin
    const sunDist = Math.sqrt(cx * cx + cz * cz);
    if (sunDist < SUN_AVOID_RADIUS && sunDist > 0.001) {
      const strength = ((SUN_AVOID_RADIUS - sunDist) / SUN_AVOID_RADIUS) * SUN_AVOID_STRENGTH;
      const ax = (cx / sunDist) * strength;
      const az = (cz / sunDist) * strength;
      dirX += ax;
      dirZ += az;
      const len = Math.sqrt(dirX * dirX + dirZ * dirZ);
      if (len > 0.001) { dirX /= len; dirZ /= len; }
    }

    // Advance fleet center (apply speed debuff if present)
    const effectiveSpeed = fleet.speed * (fleet.speedDebuff ?? 1.0);
    const step = Math.min(effectiveSpeed * dt, dist);
    fleet.position.x += dirX * step;
    fleet.position.z += dirZ * step;
    fleet.position.y  = 0;

    // Boids for individual ships
    this._boidsStep(dt, fleet, dirX, dirZ);

    gameState.emit('playerFleetMoved', { fleetId: fleet.id });
  }

  // ─── Per-ship Boids ───────────────────────────────────────────────────────

  _boidsStep(dt, fleet, fleetDirX, fleetDirZ) {
    const ships = fleet.ships;
    if (!ships.length) return;

    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];

      // Init runtime state if missing (e.g. after load)
      if (!ship.vel)      ship.vel      = { x: 0, z: 0 };
      if (!ship.localPos) ship.localPos = { x: 0, y: 0, z: 0 };

      let fx = 0;
      let fz = 0;

      // Separation — push away from nearby fleet-mates
      for (let j = 0; j < ships.length; j++) {
        if (i === j) continue;
        const other = ships[j];
        if (!other.localPos) continue;
        const sdx = ship.localPos.x - other.localPos.x;
        const sdz = ship.localPos.z - other.localPos.z;
        const sd  = Math.sqrt(sdx * sdx + sdz * sdz);
        if (sd < SEP_RADIUS && sd > 0.001) {
          const str = SEP_STRENGTH * (1 - sd / SEP_RADIUS);
          fx += (sdx / sd) * str;
          fz += (sdz / sd) * str;
        }
      }

      // Cohesion — pull toward fleet center (local origin)
      fx -= ship.localPos.x * COHESION_STR;
      fz -= ship.localPos.z * COHESION_STR;

      // Alignment — align velocity with fleet heading
      fx += fleetDirX * ALIGN_STR;
      fz += fleetDirZ * ALIGN_STR;

      // Integrate velocity with damping
      ship.vel.x = (ship.vel.x + fx * dt) * VEL_DAMPING;
      ship.vel.z = (ship.vel.z + fz * dt) * VEL_DAMPING;

      // Clamp velocity magnitude
      const vLen = Math.sqrt(ship.vel.x * ship.vel.x + ship.vel.z * ship.vel.z);
      if (vLen > MAX_LOCAL_VEL) {
        ship.vel.x = (ship.vel.x / vLen) * MAX_LOCAL_VEL;
        ship.vel.z = (ship.vel.z / vLen) * MAX_LOCAL_VEL;
      }

      // Update local position
      ship.localPos.x += ship.vel.x * dt;
      ship.localPos.z += ship.vel.z * dt;

      // Clamp spread so ships don't drift too far from fleet center
      const lLen = Math.sqrt(ship.localPos.x * ship.localPos.x + ship.localPos.z * ship.localPos.z);
      if (lLen > MAX_SPREAD) {
        ship.localPos.x = (ship.localPos.x / lLen) * MAX_SPREAD;
        ship.localPos.z = (ship.localPos.z / lLen) * MAX_SPREAD;
      }
    }
  }
}
