import { gameState } from '../GameState.js';
import { HYPERLANES } from '../data/galaxyLayout.js';
import { ENEMY_TYPES, scaleThreat } from '../data/enemies.js';
import { DEFENSE_TYPES } from '../data/defenses.js';

let _nextFleetId = 0;
let _nextEnemyId = 0;

const MAX_ROAMING_FLEETS = 4;
const SCOUT_SPEED = 0.04;      // t/s along hyperlane
const INVASION_SPEED = 0.025;  // t/s between planets (free path)
const SCOUT_SPAWN_CHANCE = 0.003;    // per second
const INVASION_SPAWN_CHANCE = 0.001; // per second
const INTERCEPT_THRESHOLD = 0.08;
const SNITCH_DETECT_RADIUS = 30;   // matches ENGAGE_RADIUS from fleetCombatStats.js
const SNITCH_SPEED = 0.03;         // slower than SCOUT_SPEED (0.04) — creates catchable window

const ALL_PLANETS = ['xerion', 'drakon', 'crystara', 'voltara', 'glacius', 'nebulox', 'solaris', 'voidex'];

/**
 * RoamingFleetSystem — replaces HyperlanePatrolSystem.
 *
 * Manages enemy fleets that roam the galaxy:
 *  - Scout fleets (fighters only) follow hyperlanes
 *  - Invasion fleets (mothership + fighters) move freely planet-to-planet
 *
 * Fleets convert to ThreatSystem attacks on reaching a player planet.
 */
export class RoamingFleetSystem {
  constructor(animationLoop, threatSystem, getFleetWorldPosFn = null, getStationWorldPosFn = null) {
    this._threatSystem = threatSystem;
    this._getFleetWorldPos = getFleetWorldPosFn;
    this._getStationWorldPos = getStationWorldPosFn;
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const clampedDt = Math.min(dt, 1);
    this._tickMovement(clampedDt);
    this._tickInterception(clampedDt);
    this._tickDefenseShipCombat(clampedDt);
    this._tickSpawning(clampedDt);
    this._tickSnitchBehavior(clampedDt);
  }

  // ─── Movement ─────────────────────────────────────────────────────────────

  _tickMovement(dt) {
    for (let i = gameState.roamingFleets.length - 1; i >= 0; i--) {
      const fleet = gameState.roamingFleets[i];

      // Remove fully destroyed fleets
      const alive = fleet.enemies.filter(e => e.hp > 0);
      const mothershipAlive = fleet.mothership ? fleet.mothership.hp > 0 : false;
      if (alive.length === 0 && !mothershipAlive) {
        // Phase 3: Clean up station scout tracking
        const originStation = gameState.enemyStations?.find(s => s.scoutIds?.includes(fleet.id));
        if (originStation) originStation.scoutIds = originStation.scoutIds.filter(id => id !== fleet.id);

        // Clear snitch state (no stationAlerted emitted if killed mid-snitch)
        if (fleet.isSnitching) this._clearSnitchState(fleet);

        gameState.roamingFleets.splice(i, 1);
        gameState.emit('fleetDestroyed', { fleetId: fleet.id });
        continue;
      }

      // Pause movement if engaged in fleet combat
      if (gameState.getEngagementForFleet(fleet.id)) continue;

      // Phase 3: Snitch fleets are driven by _tickSnitchBehavior, not _tickMovement
      if (fleet.isSnitching) continue;

      fleet.position = Math.min(1, fleet.position + fleet.speed * dt);
      gameState.emit('fleetMoved', { fleetId: fleet.id, position: fleet.position });

      if (fleet.position >= 1) {
        this._onArrival(fleet);
        // Fleet may have been removed by _convertToAttack
        if (!gameState.roamingFleets[i] || gameState.roamingFleets[i].id !== fleet.id) continue;
      }
    }
  }

  _onArrival(fleet) {
    const { toPlanet } = fleet;
    if (
      gameState.ownedPlanets.includes(toPlanet) &&
      toPlanet !== 'xerion'
    ) {
      const ps = gameState.getPlanetState(toPlanet);
      if (ps && ps.hasBase && !ps.combat.fallen) {
        this._convertToAttack(fleet);
        return;
      }
    }
    this._pickNextDestination(fleet);
  }

  _convertToAttack(fleet) {
    const idx = gameState.roamingFleets.indexOf(fleet);
    if (idx !== -1) gameState.roamingFleets.splice(idx, 1);

    this._threatSystem.spawnFleetAttack(fleet, fleet.toPlanet);
    gameState.emit('fleetArrived', { fleetId: fleet.id, planetId: fleet.toPlanet });
  }

  _pickNextDestination(fleet) {
    if (fleet.type === 'scout') {
      // Follow hyperlane network — prefer continuing forward
      const neighbors = HYPERLANES
        .filter(([a, b]) => a === fleet.toPlanet || b === fleet.toPlanet)
        .map(([a, b]) => (a === fleet.toPlanet ? b : a));

      const forward = neighbors.filter(p => p !== fleet.fromPlanet);
      const candidates = forward.length > 0 ? forward : neighbors;

      if (candidates.length === 0) {
        // Dead end: reverse
        [fleet.fromPlanet, fleet.toPlanet] = [fleet.toPlanet, fleet.fromPlanet];
      } else {
        fleet.fromPlanet = fleet.toPlanet;
        fleet.toPlanet = candidates[Math.floor(Math.random() * candidates.length)];
      }
      fleet.position = 0;
      fleet.notified = false;
    } else {
      // Invasion: choose any planet (bias toward player planets at high threat)
      const playerTargets = gameState.ownedPlanets.filter(p => p !== 'xerion' && p !== fleet.toPlanet);
      const otherPlanets  = ALL_PLANETS.filter(p => p !== fleet.toPlanet);

      let candidates;
      if (playerTargets.length > 0 && fleet.threatLevel >= 4 && Math.random() < 0.6) {
        candidates = playerTargets;
      } else {
        candidates = otherPlanets;
      }

      fleet.fromPlanet = fleet.toPlanet;
      fleet.toPlanet   = candidates[Math.floor(Math.random() * candidates.length)];
      fleet.position   = 0;
      fleet.notified   = false;
    }

    this._checkAndNotify(fleet);
  }

  _checkAndNotify(fleet) {
    if (
      !fleet.notified &&
      gameState.ownedPlanets.includes(fleet.toPlanet) &&
      fleet.toPlanet !== 'xerion'
    ) {
      fleet.notified = true;
      gameState.emit('fleetTargetingPlayer', { fleetId: fleet.id, planetId: fleet.toPlanet });
    }
  }

  // ─── Interception ─────────────────────────────────────────────────────────

  _tickInterception(dt) {
    for (const fleet of gameState.roamingFleets) {
      if (fleet.type !== 'scout') continue;
      if (!fleet.enemies.some(e => e.hp > 0)) continue;

      const laneA = fleet.fromPlanet;
      const laneB = fleet.toPlanet;

      for (let i = gameState.activeShips.length - 1; i >= 0; i--) {
        const ship = gameState.activeShips[i];
        if (ship.isColony) continue;

        const onLane =
          (ship.fromPlanet === laneA && ship.toPlanet === laneB) ||
          (ship.fromPlanet === laneB && ship.toPlanet === laneA);
        if (!onLane) continue;

        const shipPos = ship.fromPlanet === laneA ? ship.t : (1 - ship.t);
        if (Math.abs(shipPos - fleet.position) < INTERCEPT_THRESHOLD) {
          gameState.activeShips.splice(i, 1);
          gameState.emit('cargoIntercepted', { patrolId: fleet.id, ship, lane: [laneA, laneB] });
        }
      }
    }
  }

  // ─── Defense ship combat ──────────────────────────────────────────────────

  _tickDefenseShipCombat(dt) {
    for (const fleet of gameState.roamingFleets) {
      if (fleet.type !== 'scout') continue;

      for (const planetId of [fleet.fromPlanet, fleet.toPlanet]) {
        const ps = gameState.getPlanetState(planetId);
        if (!ps || !ps.hasBase) continue;

        const shipLevel = ps.combat.defenses.defenseShip;
        if (shipLevel <= 0) continue;

        const defType = DEFENSE_TYPES.defenseShip;
        const damage    = defType.damage[shipLevel - 1];
        const fireRate  = defType.fireRate[shipLevel - 1];
        const totalDmg  = damage * fireRate * dt;

        const alive = fleet.enemies.filter(e => e.hp > 0);
        if (alive.length === 0) continue;

        const dmgPer = totalDmg / alive.length;
        for (const enemy of alive) {
          enemy.hp = Math.max(0, enemy.hp - dmgPer);
          if (enemy.hp === 0) {
            gameState.emit('fleetEnemyDestroyed', { fleetId: fleet.id, enemy });
          }
        }
      }
    }
  }

  // ─── Spawning ─────────────────────────────────────────────────────────────

  _tickSpawning(dt) {
    if (gameState.roamingFleets.length >= MAX_ROAMING_FLEETS) return;
    if (gameState.ownedPlanets.length < 2) return;

    const threatLevel = this._getMaxThreat();
    if (threatLevel <= 0) return;

    if (Math.random() < SCOUT_SPAWN_CHANCE * dt) {
      this._trySpawnScout(threatLevel);
    }

    if (threatLevel >= 3 && Math.random() < INVASION_SPAWN_CHANCE * dt) {
      this._trySpawnInvasion(threatLevel);
    }
  }

  _getMaxThreat() {
    let max = 0;
    for (const pid of gameState.ownedPlanets) {
      max = Math.max(max, scaleThreat(gameState.ownedPlanets.length, pid));
    }
    return max;
  }

  _trySpawnScout(threatLevel) {
    const eligible = HYPERLANES.filter(([a, b]) => {
      const aOwned = gameState.ownedPlanets.includes(a);
      const bOwned = gameState.ownedPlanets.includes(b);
      if (!aOwned && !bOwned) return false;
      if (this._isLaneOccupiedByScout(a, b)) return false;
      return true;
    });
    if (eligible.length === 0) return;

    const [a, b] = eligible[Math.floor(Math.random() * eligible.length)];
    const hpScale = 1 + (threatLevel - 1) * 0.15;
    const count = threatLevel >= 5 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);

    const enemies = [];
    for (let i = 0; i < count; i++) {
      const type = Math.random() < 0.65 ? 'interceptor' : 'bomber';
      const def = ENEMY_TYPES[type];
      enemies.push({
        id: `fleet_e_${_nextEnemyId++}`,
        type,
        hp: Math.floor(def.hp * hpScale),
        maxHP: Math.floor(def.hp * hpScale),
        damage: def.damage,
        speed: def.speed,
        target: def.target,
        stealRate: def.stealRate || 0,
      });
    }

    const fleet = {
      id: `fleet_${_nextFleetId++}`,
      type: 'scout',
      fromPlanet: a,
      toPlanet: b,
      position: 0,
      speed: SCOUT_SPEED,
      enemies,
      mothership: null,
      notified: false,
      threatLevel,
      // Phase 3: snitch fields
      isSnitching: false,
      snitchTarget: null,
      snitchMode: null,
      _stationOriginId: null,
    };

    gameState.roamingFleets.push(fleet);
    gameState.emit('fleetSpawned', { fleet });
    this._checkAndNotify(fleet);
  }

  _trySpawnInvasion(threatLevel) {
    // Only one invasion fleet at a time
    if (gameState.roamingFleets.some(f => f.type === 'invasion')) return;

    const nonPlayerPlanets = ALL_PLANETS.filter(p => !gameState.ownedPlanets.includes(p));
    if (nonPlayerPlanets.length === 0) return;

    const fromPlanet = nonPlayerPlanets[Math.floor(Math.random() * nonPlayerPlanets.length)];

    // Bias destination toward player planets
    const playerTargets = gameState.ownedPlanets.filter(p => p !== 'xerion');
    const allTargets    = ALL_PLANETS.filter(p => p !== fromPlanet);

    const toPlanet = (playerTargets.length > 0 && Math.random() < 0.7)
      ? playerTargets[Math.floor(Math.random() * playerTargets.length)]
      : allTargets[Math.floor(Math.random() * allTargets.length)];

    const hpScale = 1 + (threatLevel - 1) * 0.15;
    const msDef = ENEMY_TYPES.mothership;

    const mothership = {
      hp: Math.floor(msDef.hp * hpScale),
      maxHP: Math.floor(msDef.hp * hpScale),
      damage: msDef.damage,
    };

    const fighterCount = Math.min(2 + Math.floor(threatLevel / 2), 4);
    const enemies = [];
    for (let i = 0; i < fighterCount; i++) {
      const type = i === 0 ? 'bomber' : 'interceptor';
      const def = ENEMY_TYPES[type];
      enemies.push({
        id: `fleet_e_${_nextEnemyId++}`,
        type,
        hp: Math.floor(def.hp * hpScale),
        maxHP: Math.floor(def.hp * hpScale),
        damage: def.damage,
        speed: def.speed,
        target: def.target,
        stealRate: def.stealRate || 0,
      });
    }

    const fleet = {
      id: `fleet_${_nextFleetId++}`,
      type: 'invasion',
      fromPlanet,
      toPlanet,
      position: 0,
      speed: INVASION_SPEED,
      enemies,
      mothership,
      notified: false,
      threatLevel,
      // Phase 3: snitch fields (invasions don't snitch, but keep shape uniform)
      isSnitching: false,
      snitchTarget: null,
      snitchMode: null,
      _stationOriginId: null,
    };

    gameState.roamingFleets.push(fleet);
    gameState.emit('fleetSpawned', { fleet });
    this._checkAndNotify(fleet);
  }

  _isLaneOccupiedByScout(a, b) {
    return gameState.roamingFleets.some(f => {
      if (f.type !== 'scout') return false;
      return (f.fromPlanet === a && f.toPlanet === b) || (f.fromPlanet === b && f.toPlanet === a);
    });
  }

  // ─── Phase 3: Snitch behavior ─────────────────────────────────────────────

  _tickSnitchBehavior(dt) {
    for (const fleet of gameState.roamingFleets) {
      if (fleet.type !== 'scout') continue;
      if (!fleet.enemies.some(e => e.hp > 0)) continue;

      if (!fleet.isSnitching) {
        // Detection scan: is any player fleet within SNITCH_DETECT_RADIUS?
        const ePos = this._getFleetWorldPos ? this._getFleetWorldPos(fleet.id) : null;
        if (!ePos) continue;

        for (const pFleet of gameState.playerFleets) {
          if (!pFleet.ships.some(s => s.hp > 0)) continue;
          if (!pFleet.position) continue; // fleet position not yet initialized
          const dx = pFleet.position.x - ePos.x;
          const dz = pFleet.position.z - ePos.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < SNITCH_DETECT_RADIUS) {
            // Activate snitching: find nearest non-cleared, non-dormant station
            const target = this._findNearestStation(ePos);
            if (target) {
              fleet.isSnitching = true;
              fleet.snitchTarget = target.stationId;
              fleet.snitchMode = target.viaHyperlane ? 'hyperlane' : 'freespace';
              gameState.emit('fleetSnitching', { fleetId: fleet.id, stationId: target.stationId });
              gameState.emit('snitchDetected', { fleetId: fleet.id }); // BUG-B: emit so HUDBridge can show "SCOUT FLEEING"
            }
            break;
          }
        }
      } else {
        // Already snitching: move at SNITCH_SPEED toward snitchTarget's planet
        const targetStation = gameState.enemyStations?.find(s => s.id === fleet.snitchTarget);
        if (!targetStation || targetStation.cleared) {
          // Target gone — abort
          this._clearSnitchState(fleet);
          continue;
        }

        // Advance position
        fleet.position = Math.min(1, fleet.position + SNITCH_SPEED * dt);

        if (fleet.position >= 1) {
          // Arrived at snitchTarget — alert the station
          gameState.emit('stationAlerted', { stationId: fleet.snitchTarget });
          this._clearSnitchState(fleet);
          // Scout continues normally (picks next destination)
          if (gameState.roamingFleets.includes(fleet)) {
            this._pickNextDestination(fleet);
          }
        }
      }
    }
  }

  _clearSnitchState(fleet) {
    fleet.isSnitching = false;
    fleet.snitchTarget = null;
    fleet.snitchMode = null;
  }

  _findNearestStation(fromPos) {
    // fromPos is a THREE.Vector3
    // Returns { stationId, viaHyperlane } or null
    if (!this._getStationWorldPos) return null;

    let best = null;
    let bestDist = Infinity;

    for (const st of (gameState.enemyStations || [])) {
      if (st.cleared || st.phase === 'dormant') continue; // only alert active stations
      const pos = this._getStationWorldPos(st.id);
      if (!pos) continue;
      const dx = fromPos.x - pos.x;
      const dz = fromPos.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < bestDist) {
        bestDist = dist;
        best = { stationId: st.id, viaHyperlane: false };
      }
    }
    return best;
  }

  // ─── Public interface (mirrors HyperlanePatrolSystem) ─────────────────────

  /**
   * Returns true if a scout fleet with alive enemies occupies this lane,
   * blocking cargo dispatch.
   */
  isLaneBlocked(fromPlanet, toPlanet) {
    return gameState.roamingFleets.some(f => {
      if (f.type !== 'scout') return false;
      const match =
        (f.fromPlanet === fromPlanet && f.toPlanet === toPlanet) ||
        (f.fromPlanet === toPlanet   && f.toPlanet === fromPlanet);
      return match && f.enemies.some(e => e.hp > 0);
    });
  }

  /**
   * Spawn a scout fleet originating from an enemy station, targeting a player planet.
   * Called by EnemyStationSystem._tickScoutSpawning().
   * @param {string} stationId - The enemy station's state id (e.g. 'station_drakon')
   * @param {string} targetPlanetId - A player-owned planet id
   * @param {string|null} fromPlanetOverride - Explicit from-planet for free-floating stations
   * @returns {string|null} - fleet.id on success, null on failure
   */
  spawnStationScout(stationId, targetPlanetId, fromPlanetOverride = null) {
    if (gameState.roamingFleets.length >= MAX_ROAMING_FLEETS) return null;

    const stState = gameState.enemyStations?.find(s => s.id === stationId);
    if (!stState) return null;

    const fromPlanet = fromPlanetOverride ?? stState.anchorPlanet;
    if (!fromPlanet) return null;
    if (fromPlanet === targetPlanetId) return null; // can't spawn fleet with same source/dest

    const threatLevel = this._getMaxThreat();
    const hpScale = 1 + Math.max(0, (threatLevel - 1)) * 0.15;

    // Single interceptor scout — deliberately lightweight
    const def = ENEMY_TYPES.interceptor;
    const enemies = [{
      id: `fleet_e_${_nextEnemyId++}`,
      type: 'interceptor',
      hp: Math.floor(def.hp * hpScale),
      maxHP: Math.floor(def.hp * hpScale),
      damage: def.damage,
      speed: def.speed,
      target: def.target,
      stealRate: def.stealRate || 0,
    }];

    const fleet = {
      id: `fleet_${_nextFleetId++}`,
      type: 'scout',
      fromPlanet,
      toPlanet: targetPlanetId,
      position: 0,
      speed: SCOUT_SPEED,
      enemies,
      mothership: null,
      notified: false,
      threatLevel,
      isSnitching: false,
      snitchTarget: null,
      snitchMode: null,
      _stationOriginId: stationId,
    };

    gameState.roamingFleets.push(fleet);
    gameState.emit('fleetSpawned', { fleet });
    this._checkAndNotify(fleet);

    // Register this scout's id with the station state so EnemyStationSystem
    // can clean up on fleet destruction
    (stState.scoutIds ??= []).push(fleet.id);

    return fleet.id;
  }

  /**
   * Re-emit fleetSpawned for all persisted fleets so 3D visuals can be
   * reconstructed after a save/load.
   */
  reconstructFleets() {
    for (const fleet of gameState.roamingFleets) {
      gameState.emit('fleetSpawned', { fleet });
      // Re-check notification state (don't re-toast on load)
    }
  }
}
