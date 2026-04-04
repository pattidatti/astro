import { gameState } from '../GameState.js';

const SNITCH_SCOUT_COOLDOWN = 60_000;    // ms between scout spawns per station
const INVASION_COOLDOWN = 180_000;       // ms station-triggered invasion cooldown
const MAX_STATION_INVASIONS = 2;         // per station — separate from ThreatSystem max 3
const DISTRESS_HP_THRESHOLD = 0.15;      // 15% HP triggers flare
const AWAKEN_COLONY_COUNT = 3;           // owned planets needed to trigger proximity awakening
const AWAKEN_FLEET_RADIUS = 50;          // world units — wake dormant station near player fleet

const ALL_PLANETS = ['xerion', 'drakon', 'crystara', 'voltara', 'glacius', 'nebulox', 'solaris', 'voidex'];

/**
 * EnemyStationSystem — Phase 3 Enemy Expansion: state machine + escalation.
 *
 * Manages the 4-phase station state machine (Dormant → Alert → Skirmish → War),
 * awakening triggers, scout spawning, invasion pool tracking, and distress flare mechanic.
 *
 * Registers with animationLoop.onUpdate().
 */
export class EnemyStationSystem {
  /**
   * @param {AnimationLoop} animationLoop
   * @param {RoamingFleetSystem} roamingFleetSystem
   * @param {ThreatSystem} threatSystem
   * @param {Galaxy} galaxy
   */
  constructor(animationLoop, roamingFleetSystem, threatSystem, galaxy) {
    this._roamingFleetSystem = roamingFleetSystem;
    this._threatSystem = threatSystem;
    this._galaxy = galaxy;

    // Per-station invasion counters (separate from ThreatSystem pool)
    // Map<stationId, { count: number, lastSpawnTime: number }>
    this._invasionTrackers = new Map();

    // Track which stations have already triggered a chain distress flare
    // (prevents chain > 1 link). Set of stationIds that received a flare alert.
    this._flareReceivers = new Set();

    animationLoop.onUpdate((dt) => this._tick(dt));

    // Listen for direct hull damage → escalate to War
    gameState.on('enemyStationDamaged', ({ stationId, hullDamage }) => {
      if (hullDamage > 0) this._onHullDamaged(stationId);
    });

    // Listen for fleet-destroyed to clean up invasion trackers
    gameState.on('enemyStationDestroyed', ({ stationId }) => {
      this._invasionTrackers.delete(stationId);
      this._flareReceivers.delete(stationId);
    });

    // Decrement invasion counter when an attack ends
    gameState.on('attackEnded', ({ attack }) => {
      if (!attack?.fromStationId) return;
      const tracker = this._invasionTrackers.get(attack.fromStationId);
      if (tracker && tracker.count > 0) tracker.count--;
    });
  }

  _tick(dt) {
    if (!gameState.enemyStations?.length) return;
    this._tickAwakeningChecks();
    this._tickPhaseTransitions();
    this._tickScoutSpawning(dt);
    this._tickInvasionSpawning(dt);
    this._tickDistressFlare();
  }

  // ─── Awakening ────────────────────────────────────────────────────────────

  _tickAwakeningChecks() {
    const dormantStations = gameState.enemyStations.filter(
      s => s.phase === 'dormant' && !s.cleared
    );
    if (dormantStations.length === 0) return;

    // Condition 1: Player has colonized ≥ AWAKEN_COLONY_COUNT planets
    if (gameState.ownedPlanets.length >= AWAKEN_COLONY_COUNT) {
      this._awakenNearestN(dormantStations, 2);
    }

    // Condition 2: Any player fleet within AWAKEN_FLEET_RADIUS of a dormant station
    for (const st of dormantStations) {
      const stPos = this._getStationWorldPos(st);
      if (!stPos) continue;
      for (const pFleet of gameState.playerFleets) {
        if (!pFleet.ships.some(s => s.hp > 0)) continue;
        const dx = pFleet.position.x - stPos.x;
        const dz = pFleet.position.z - stPos.z;
        if (Math.sqrt(dx * dx + dz * dz) < AWAKEN_FLEET_RADIUS) {
          this._awakenStation(st);
          break;
        }
      }
    }
  }

  _awakenNearestN(dormantStations, n) {
    // Find distance from each dormant station to the nearest owned planet.
    const candidates = [];
    for (const st of dormantStations) {
      const stPos = this._getStationWorldPos(st);
      if (!stPos) continue;
      let minDist = Infinity;
      for (const pid of gameState.ownedPlanets) {
        const pPos = this._galaxy.getPlanetWorldPosition(pid);
        if (!pPos) continue;
        const dx = stPos.x - pPos.x;
        const dz = stPos.z - pPos.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < minDist) minDist = d;
      }
      candidates.push({ st, minDist });
    }

    candidates.sort((a, b) => a.minDist - b.minDist);
    for (let i = 0; i < Math.min(n, candidates.length); i++) {
      this._awakenStation(candidates[i].st);
    }
  }

  _awakenStation(st) {
    if (st.phase !== 'dormant') return; // already awakened — idempotent
    st.phase = 'alert';
    gameState.emit('stationAwakened', { stationId: st.id });
    gameState.emit('stationPhaseChanged', { stationId: st.id, phase: 'alert' });
  }

  _getStationWorldPos(st) {
    if (st.anchorPlanet) {
      // Planet-anchored: use live orbiting planet position
      return this._galaxy.getPlanetWorldPosition(st.anchorPlanet);
    } else {
      // Free-floating: read from EnemyStationManager3D
      return this._galaxy.enemyStationManager?.getStationWorldPosition(st.id) ?? null;
    }
  }

  // ─── Phase transitions ─────────────────────────────────────────────────────

  _tickPhaseTransitions() {
    for (const st of gameState.enemyStations) {
      if (st.cleared || st.phase === 'dormant') continue;

      const prev = st.phase;

      // Alert → Skirmish: player owns ≥ 4 planets
      if (st.phase === 'alert' && gameState.ownedPlanets.length >= 4) {
        st.phase = 'skirmish';
      }

      // Skirmish → War: station HP < 50% (hull damage received)
      if (st.phase === 'skirmish' && st.hp < st.maxHP * 0.5) {
        st.phase = 'war';
      }

      if (st.phase !== prev) {
        gameState.emit('stationPhaseChanged', { stationId: st.id, phase: st.phase });
      }
    }
  }

  _onHullDamaged(stationId) {
    const st = gameState.enemyStations?.find(s => s.id === stationId);
    if (!st || st.cleared) return;
    if (st.phase === 'dormant') this._awakenStation(st); // wake before escalating
    if (st.phase !== 'war') {
      st.phase = 'war';
      gameState.emit('stationPhaseChanged', { stationId: st.id, phase: 'war' });
    }
  }

  // ─── Scout spawning ───────────────────────────────────────────────────────

  _tickScoutSpawning(dt) {
    if (gameState.roamingFleets.length >= 4 /* MAX_ROAMING_FLEETS */) return;

    const now = Date.now();
    for (const st of gameState.enemyStations) {
      if (st.cleared) continue;
      if (st.phase !== 'alert' && st.phase !== 'skirmish' && st.phase !== 'war') continue;
      if (gameState.roamingFleets.length >= 4) break;

      const elapsed = now - (st.lastSpawnTime || 0);
      if (elapsed < SNITCH_SCOUT_COOLDOWN) continue;

      // Target: random player-owned planet (excluding xerion)
      const targets = gameState.ownedPlanets.filter(p => p !== 'xerion');
      if (targets.length === 0) continue;
      const targetPlanet = targets[Math.floor(Math.random() * targets.length)];

      // Resolve fromPlanet for free-floating stations
      let fromPlanetOverride = null;
      if (!st.anchorPlanet) {
        fromPlanetOverride = this._nearestOwnedOrAnyPlanet(this._getStationWorldPos(st));
      }

      const fleetId = this._roamingFleetSystem.spawnStationScout(
        st.id, targetPlanet, fromPlanetOverride
      );
      if (fleetId) {
        st.lastSpawnTime = now;
      }
    }
  }

  _nearestOwnedOrAnyPlanet(stPos) {
    if (!stPos) return 'drakon'; // fallback
    let bestId = null;
    let bestDist = Infinity;
    for (const pid of ALL_PLANETS) {
      const pPos = this._galaxy.getPlanetWorldPosition(pid);
      if (!pPos) continue;
      const dx = stPos.x - pPos.x;
      const dz = stPos.z - pPos.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < bestDist) {
        bestDist = d;
        bestId = pid;
      }
    }
    return bestId;
  }

  // ─── Invasion spawning ────────────────────────────────────────────────────

  _tickInvasionSpawning(dt) {
    const now = Date.now();
    for (const st of gameState.enemyStations) {
      if (st.cleared || st.phase !== 'war') continue;

      if (!this._invasionTrackers.has(st.id)) {
        this._invasionTrackers.set(st.id, { count: 0, lastSpawnTime: 0 });
      }
      const tracker = this._invasionTrackers.get(st.id);

      if (tracker.count >= MAX_STATION_INVASIONS) continue;
      if ((now - tracker.lastSpawnTime) < INVASION_COOLDOWN) continue;

      // Target: random player planet
      const targets = gameState.ownedPlanets.filter(p => p !== 'xerion');
      if (targets.length === 0) continue;
      const planetId = targets[Math.floor(Math.random() * targets.length)];

      const spawned = this._threatSystem.spawnStationInvasion(planetId, st.id);
      if (spawned) {
        tracker.count++;
        tracker.lastSpawnTime = now;
      }
    }
  }

  // ─── Distress flare ───────────────────────────────────────────────────────

  _tickDistressFlare() {
    for (const st of gameState.enemyStations) {
      if (st.cleared || st.distressFlareFired) continue;
      if (st.phase === 'dormant') continue;
      if (st.hp / st.maxHP > DISTRESS_HP_THRESHOLD) continue;

      // Prevent flare from a station that was itself alerted by a flare
      if (this._flareReceivers.has(st.id)) continue;

      st.distressFlareFired = true;
      gameState.emit('distressFlare', { stationId: st.id, hp: st.hp, maxHP: st.maxHP });

      // Find nearest non-cleared neighbor station
      const stPos = this._getStationWorldPos(st);
      if (!stPos) continue;

      let nearestNeighbor = null;
      let nearestDist = Infinity;
      for (const other of gameState.enemyStations) {
        if (other.id === st.id || other.cleared) continue;
        const oPos = this._getStationWorldPos(other);
        if (!oPos) continue;
        const dx = stPos.x - oPos.x;
        const dz = stPos.z - oPos.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < nearestDist) {
          nearestDist = d;
          nearestNeighbor = other;
        }
      }

      if (nearestNeighbor) {
        // Mark neighbor as a flare receiver (chain cap = 1)
        this._flareReceivers.add(nearestNeighbor.id);

        // Directly alert the neighbor (immediate effect)
        this._awakenStation(nearestNeighbor);
        if (nearestNeighbor.phase !== 'war') {
          nearestNeighbor.phase = 'alert';
          gameState.emit('stationAlerted', { stationId: nearestNeighbor.id });
          gameState.emit('stationPhaseChanged', { stationId: nearestNeighbor.id, phase: 'alert' });
        }
      }
    }
  }

  // ─── Reconstruction ───────────────────────────────────────────────────────

  /**
   * Re-emit 'enemyStationRestored' for all non-cleared stations.
   * Called at boot after save/load.
   */
  reconstructStations() {
    for (const st of (gameState.enemyStations || [])) {
      if (!st.cleared) {
        gameState.emit('enemyStationRestored', { stationId: st.id, phase: st.phase });
      }
    }
  }
}
