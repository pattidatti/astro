import { gameState } from '../GameState.js';
import { HYPERLANES } from '../data/galaxyLayout.js';
import { ENEMY_TYPES, scaleThreat } from '../data/enemies.js';
import { DEFENSE_TYPES } from '../data/defenses.js';

let _nextPatrolId = 0;

/** Probability per second that a patrol spawns on any hyperlane. */
const PATROL_SPAWN_CHANCE = 0.002;

/** Maximum concurrent patrols in the galaxy. */
const MAX_PATROLS = 4;

/** Patrol movement speed (0→1 per second along lane). */
const PATROL_SPEED = 0.02;

/** Distance threshold for cargo interception (in t-space along lane). */
const INTERCEPT_THRESHOLD = 0.08;

/**
 * HyperlanePatrolSystem — spawns enemy patrols along hyperlanes.
 *
 * Patrols can:
 * - Block cargo ships from dispatching on the lane
 * - Intercept in-flight cargo ships (destroy cargo)
 * - Be cleared by player defense ships assigned to the lane
 */
export class HyperlanePatrolSystem {
  constructor(animationLoop) {
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const clampedDt = Math.min(dt, 1);

    this._tickPatrolMovement(clampedDt);
    this._tickCargoInterception(clampedDt);
    this._tickDefenseShipCombat(clampedDt);
    this._tickPatrolSpawning(clampedDt);
  }

  /**
   * Move existing patrols along their hyperlanes.
   */
  _tickPatrolMovement(dt) {
    for (let i = gameState.hyperlanePatrols.length - 1; i >= 0; i--) {
      const patrol = gameState.hyperlanePatrols[i];
      patrol.position += patrol.direction * PATROL_SPEED * dt;

      // Bounce at endpoints
      if (patrol.position >= 1) {
        patrol.position = 1;
        patrol.direction = -1;
      } else if (patrol.position <= 0) {
        patrol.position = 0;
        patrol.direction = 1;
      }

      // Remove patrol if all enemies dead
      const alive = patrol.enemies.filter(e => e.hp > 0);
      if (alive.length === 0) {
        gameState.hyperlanePatrols.splice(i, 1);
        gameState.emit('patrolCleared', { patrolId: patrol.id, lane: patrol.lane });
      }
    }
  }

  /**
   * Check if any in-flight cargo ships are near a patrol.
   */
  _tickCargoInterception(dt) {
    for (const patrol of gameState.hyperlanePatrols) {
      const [laneA, laneB] = patrol.lane;
      const aliveEnemies = patrol.enemies.filter(e => e.hp > 0);
      if (aliveEnemies.length === 0) continue;

      for (let i = gameState.activeShips.length - 1; i >= 0; i--) {
        const ship = gameState.activeShips[i];
        if (ship.isColony) continue; // Don't intercept colony ships

        // Check if ship is on this lane
        const onLane = (ship.fromPlanet === laneA && ship.toPlanet === laneB) ||
                       (ship.fromPlanet === laneB && ship.toPlanet === laneA);
        if (!onLane) continue;

        // Check proximity (both ship.t and patrol.position are 0-1 along lane)
        const shipPos = ship.fromPlanet === laneA ? ship.t : (1 - ship.t);
        if (Math.abs(shipPos - patrol.position) < INTERCEPT_THRESHOLD) {
          // Cargo destroyed
          gameState.activeShips.splice(i, 1);
          gameState.emit('cargoIntercepted', {
            patrolId: patrol.id,
            ship,
            lane: patrol.lane,
          });
        }
      }
    }
  }

  /**
   * Player defense ships on patrolled lanes fight patrols.
   */
  _tickDefenseShipCombat(dt) {
    for (const patrol of gameState.hyperlanePatrols) {
      const [laneA, laneB] = patrol.lane;

      // Check if either connected planet has defense ships
      for (const planetId of [laneA, laneB]) {
        const ps = gameState.getPlanetState(planetId);
        if (!ps || !ps.hasBase) continue;

        const shipLevel = ps.combat.defenses.defenseShip;
        if (shipLevel <= 0) continue;

        const defType = DEFENSE_TYPES.defenseShip;
        const damage = defType.damage[shipLevel - 1];
        const fireRate = defType.fireRate[shipLevel - 1];
        const totalDamage = damage * fireRate * dt;

        // Distribute damage across patrol enemies
        const alive = patrol.enemies.filter(e => e.hp > 0);
        if (alive.length === 0) continue;

        const dmgPer = totalDamage / alive.length;
        for (const enemy of alive) {
          enemy.hp -= dmgPer;
          if (enemy.hp <= 0) {
            enemy.hp = 0;
            gameState.emit('patrolEnemyDestroyed', { patrolId: patrol.id, enemy });
          }
        }
      }
    }
  }

  /**
   * Spawn new patrols on hyperlanes based on threat level.
   */
  _tickPatrolSpawning(dt) {
    if (gameState.hyperlanePatrols.length >= MAX_PATROLS) return;
    if (gameState.ownedPlanets.length < 2) return; // Need routes to matter

    // Only spawn on lanes connecting to owned planets
    const eligibleLanes = HYPERLANES.filter(([a, b]) => {
      // At least one end should be owned (and not xerion)
      const aOwned = gameState.ownedPlanets.includes(a);
      const bOwned = gameState.ownedPlanets.includes(b);
      if (!aOwned && !bOwned) return false;
      // Don't patrol lanes already patrolled
      if (this.isLanePatrolled(a, b)) return false;
      // Need some threat
      const threatA = aOwned ? scaleThreat(gameState.ownedPlanets.length, a) : 0;
      const threatB = bOwned ? scaleThreat(gameState.ownedPlanets.length, b) : 0;
      return Math.max(threatA, threatB) >= 2;
    });

    if (eligibleLanes.length === 0) return;

    const spawnChance = PATROL_SPAWN_CHANCE * dt;
    if (Math.random() >= spawnChance) return;

    const lane = eligibleLanes[Math.floor(Math.random() * eligibleLanes.length)];
    this._spawnPatrol(lane);
  }

  _spawnPatrol(lane) {
    const [a, b] = lane;
    const threatA = scaleThreat(gameState.ownedPlanets.length, a);
    const threatB = scaleThreat(gameState.ownedPlanets.length, b);
    const maxThreat = Math.max(threatA, threatB, 1);
    const hpScale = 1 + (maxThreat - 1) * 0.15;

    // 1-2 interceptors as patrol
    const count = maxThreat >= 5 ? 2 : 1;
    const enemies = [];
    const def = ENEMY_TYPES.interceptor;
    for (let i = 0; i < count; i++) {
      enemies.push({
        id: `patrol_e_${_nextPatrolId}_${i}`,
        type: 'interceptor',
        hp: Math.floor(def.hp * hpScale),
        maxHP: Math.floor(def.hp * hpScale),
        damage: def.damage,
        speed: def.speed,
        target: def.target,
      });
    }

    const patrol = {
      id: `patrol_${_nextPatrolId++}`,
      lane: [a, b],
      position: Math.random(), // 0-1 along lane
      direction: Math.random() > 0.5 ? 1 : -1,
      enemies,
    };

    gameState.hyperlanePatrols.push(patrol);
    gameState.emit('patrolSpawned', { patrol });
  }

  /**
   * Check if a hyperlane between two planets is blocked by a patrol.
   */
  isLaneBlocked(fromPlanet, toPlanet) {
    return gameState.hyperlanePatrols.some(p => {
      const [a, b] = p.lane;
      const match = (a === fromPlanet && b === toPlanet) || (a === toPlanet && b === fromPlanet);
      return match && p.enemies.some(e => e.hp > 0);
    });
  }

  /**
   * Check if a lane already has a patrol.
   */
  isLanePatrolled(a, b) {
    return gameState.hyperlanePatrols.some(p => {
      const [pa, pb] = p.lane;
      return (pa === a && pb === b) || (pa === b && pb === a);
    });
  }
}
