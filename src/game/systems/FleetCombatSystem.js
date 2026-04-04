import { gameState } from '../GameState.js';
import { MILITARY_SHIPS } from '../data/militaryShips.js';
import {
  ENGAGE_RADIUS,
  DISENGAGE_RADIUS,
  AGGRO_CHECK_INTERVAL,
  FIGHTER_ORBIT_RADIUS,
  BOMBER_STANDOFF,
  CARRIER_REAR_OFFSET,
  ARTILLERY_OFFSET,
  DREADNOUGHT_OFFSET,
  FIRE_VISUAL_INTERVAL,
  CRYSTAL_LASER_DPS_MULT,
} from '../data/fleetCombatStats.js';

/**
 * FleetCombatSystem — resolves open-space combat between player fleets
 * and enemy roaming fleets, completely separate from CombatSystem (which
 * handles station defense).
 *
 * Per frame:
 *   1. Aggro scan: check proximity between player fleets and roaming fleets.
 *   2. Tick engagements: resolve per-ship DPS, targeting, carrier healing.
 *   3. Disengage check: detect retreats or dead fleets.
 *
 * Registered with animationLoop.onUpdate() in main.js.
 */
export class FleetCombatSystem {
  /**
   * @param {object} animationLoop - Game animation loop.
   * @param {function} getEnemyWorldPosFn - (fleetId) => THREE.Vector3|null
   */
  constructor(animationLoop, getEnemyWorldPosFn) {
    this._getEnemyWorldPos = getEnemyWorldPosFn;
    this._aggroTimer = 0;
    this._fireTimers = new Map(); // shipKey → seconds since last VFX fire event
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  // ─── Main tick ──────────────────────────────────────────────────────────────

  _tick(dt) {
    const clampedDt = Math.min(dt, 1);

    this._tickAggroScan(clampedDt);
    this._tickEngagements(clampedDt);
    this._tickDisengageCheck();
  }

  // ─── Aggro scan ─────────────────────────────────────────────────────────────

  _tickAggroScan(dt) {
    this._aggroTimer += dt;
    if (this._aggroTimer < AGGRO_CHECK_INTERVAL) return;
    this._aggroTimer = 0;

    for (const fleet of gameState.playerFleets) {
      if (fleet.state === 'engaged') continue;
      if (!fleet.ships.length) continue;

      const pPos = fleet.position;

      for (const roaming of gameState.roamingFleets) {
        // Already engaged?
        if (gameState.getEngagementForFleet(roaming.id)) continue;
        // Has alive enemies?
        if (!roaming.enemies.some(e => e.hp > 0) &&
            (!roaming.mothership || roaming.mothership.hp <= 0)) continue;

        const ePos = this._getEnemyWorldPos(roaming.id);
        if (!ePos) continue;

        const dx = pPos.x - ePos.x;
        const dz = pPos.z - ePos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < ENGAGE_RADIUS) {
          gameState.startFleetEngagement(fleet.id, roaming.id);
          break; // One engagement per fleet per scan
        }
      }
    }
  }

  // ─── Engagement combat resolution ──────────────────────────────────────────

  _tickEngagements(dt) {
    for (let i = gameState.fleetEngagements.length - 1; i >= 0; i--) {
      const eng = gameState.fleetEngagements[i];
      eng.elapsed += dt;

      const playerFleet = gameState.playerFleets.find(f => f.id === eng.playerFleetId);
      const roamingFleet = gameState.roamingFleets.find(f => f.id === eng.roamingFleetId);

      // If either fleet no longer exists, end engagement
      if (!playerFleet || !roamingFleet) {
        const reason = !playerFleet ? 'destroyed' : 'victory';
        gameState.endFleetEngagement(eng.id, reason);
        continue;
      }

      const alivePlayerShips = playerFleet.ships.filter(s => s.hp > 0);
      const aliveEnemies = roamingFleet.enemies.filter(e => e.hp > 0);
      const mothershipAlive = roamingFleet.mothership && roamingFleet.mothership.hp > 0;

      // Check completion conditions
      if (alivePlayerShips.length === 0) {
        gameState.removeDeadShips(playerFleet.id);
        gameState.endFleetEngagement(eng.id, 'destroyed');
        continue;
      }
      if (aliveEnemies.length === 0 && !mothershipAlive) {
        gameState.endFleetEngagement(eng.id, 'victory');
        continue;
      }

      // ── Player ships fire at enemies ──
      this._tickPlayerShipsFire(eng, playerFleet, roamingFleet, aliveEnemies, dt);

      // ── Enemy ships fire at player ships ──
      this._tickEnemyShipsFire(eng, playerFleet, roamingFleet, alivePlayerShips, dt);

      // ── Carrier healing ──
      this._tickCarrierHealing(playerFleet, alivePlayerShips, dt);

      // ── Combat positioning (visual only) ──
      this._tickCombatPositioning(playerFleet, roamingFleet, dt);

      // ── Remove dead ships ──
      gameState.removeDeadShips(playerFleet.id);
    }
  }

  _tickPlayerShipsFire(eng, playerFleet, roamingFleet, aliveEnemies, dt) {
    const dpsMult = gameState.isTechUnlocked('pure_crystal_lasers') ? CRYSTAL_LASER_DPS_MULT : 1.0;

    for (let si = 0; si < playerFleet.ships.length; si++) {
      const ship = playerFleet.ships[si];
      if (ship.hp <= 0) continue;

      const shipDef = MILITARY_SHIPS[ship.type];
      if (!shipDef) continue;

      const dps = shipDef.dps * dpsMult;

      if (shipDef.combatBehavior === 'support') {
        // Carriers deal minimal damage, mainly heal (handled separately)
        // Still apply their low DPS
      }

      if (shipDef.splashCount && shipDef.splashCount > 1) {
        // Battleship: distribute damage across multiple targets
        const targets = this._pickMultipleTargets(aliveEnemies, roamingFleet.mothership, shipDef.splashCount);
        const dmgPerTarget = (dps * dt) / targets.length;
        for (const target of targets) {
          this._applyDamageToEnemy(target, dmgPerTarget, roamingFleet, eng);
        }
        this._emitFireVisual(eng.id, playerFleet.id, si, targets[0], dt);
      } else {
        // Single target: pick closest or random alive enemy
        const target = this._pickTarget(aliveEnemies, roamingFleet.mothership);
        if (target) {
          this._applyDamageToEnemy(target, dps * dt, roamingFleet, eng);
          this._emitFireVisual(eng.id, playerFleet.id, si, target, dt);
        }
      }
    }
  }

  _tickEnemyShipsFire(eng, playerFleet, roamingFleet, alivePlayerShips, dt) {
    // Enemy fighters/bombers/raiders attack random player ships
    for (const enemy of roamingFleet.enemies) {
      if (enemy.hp <= 0) continue;
      const targetIdx = Math.floor(Math.random() * alivePlayerShips.length);
      const targetShip = alivePlayerShips[targetIdx];
      if (!targetShip) continue;

      const realIdx = playerFleet.ships.indexOf(targetShip);
      if (realIdx === -1) continue;

      gameState.damagePlayerShip(playerFleet.id, realIdx, enemy.damage * dt);
    }

    // Mothership fires at random player ship
    if (roamingFleet.mothership && roamingFleet.mothership.hp > 0 && alivePlayerShips.length > 0) {
      const targetIdx = Math.floor(Math.random() * alivePlayerShips.length);
      const targetShip = alivePlayerShips[targetIdx];
      const realIdx = playerFleet.ships.indexOf(targetShip);
      if (realIdx !== -1) {
        gameState.damagePlayerShip(playerFleet.id, realIdx, roamingFleet.mothership.damage * dt);
      }
    }
  }

  _tickCarrierHealing(playerFleet, alivePlayerShips, dt) {
    for (const ship of alivePlayerShips) {
      if (ship.hp <= 0) continue;
      const def = MILITARY_SHIPS[ship.type];
      if (!def || def.combatBehavior !== 'support') continue;

      // Find the most damaged ally (lowest HP ratio) within healRange
      let bestTarget = null;
      let bestRatio = 1;

      for (const ally of alivePlayerShips) {
        if (ally === ship) continue;
        if (ally.hp <= 0 || ally.hp >= ally.maxHP) continue;
        const ratio = ally.hp / ally.maxHP;
        if (ratio < bestRatio) {
          bestRatio = ratio;
          bestTarget = ally;
        }
      }

      if (bestTarget) {
        const idx = playerFleet.ships.indexOf(bestTarget);
        if (idx !== -1) {
          gameState.healPlayerShip(playerFleet.id, idx, def.healRate * dt);
        }
      }
    }
  }

  /**
   * Update localPos offsets for combat visual positioning.
   * Fighters orbit close, bombers stand off, carriers stay behind.
   */
  _tickCombatPositioning(playerFleet, roamingFleet, dt) {
    const ePos = this._getEnemyWorldPos(roamingFleet.id);
    if (!ePos) return;

    const fleetPos = playerFleet.position;
    // Direction from player fleet to enemy
    const dx = ePos.x - fleetPos.x;
    const dz = ePos.z - fleetPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const dirX = dist > 0.001 ? dx / dist : 0;
    const dirZ = dist > 0.001 ? dz / dist : 1;

    for (const ship of playerFleet.ships) {
      if (ship.hp <= 0) continue;
      if (!ship.localPos) ship.localPos = { x: 0, y: 0, z: 0 };

      const def = MILITARY_SHIPS[ship.type];
      if (!def) continue;

      let targetX = 0;
      let targetZ = 0;
      const time = Date.now() * 0.001;

      switch (def.combatBehavior) {
        case 'circle': {
          // Orbit around enemy center at short radius
          const angle = time * 2.0 + (ship.localPos.x * 0.5); // per-ship offset
          targetX = dirX * FIGHTER_ORBIT_RADIUS + Math.cos(angle) * FIGHTER_ORBIT_RADIUS;
          targetZ = dirZ * FIGHTER_ORBIT_RADIUS + Math.sin(angle) * FIGHTER_ORBIT_RADIUS;
          break;
        }
        case 'standoff':
          // Hold position behind fleet, facing enemy
          targetX = -dirX * BOMBER_STANDOFF * 0.3;
          targetZ = -dirZ * BOMBER_STANDOFF * 0.3;
          break;
        case 'support':
          // Stay behind fleet center, away from enemy
          targetX = -dirX * CARRIER_REAR_OFFSET * 0.5;
          targetZ = -dirZ * CARRIER_REAR_OFFSET * 0.5;
          break;
        case 'artillery':
          targetX = -dirX * ARTILLERY_OFFSET * 0.2;
          targetZ = -dirZ * ARTILLERY_OFFSET * 0.2;
          break;
        case 'dreadnought':
          targetX = dirX * DREADNOUGHT_OFFSET * 0.1;
          targetZ = dirZ * DREADNOUGHT_OFFSET * 0.1;
          break;
      }

      // Smooth interpolation toward target position
      const lerp = Math.min(1, dt * 2);
      ship.localPos.x += (targetX - ship.localPos.x) * lerp;
      ship.localPos.z += (targetZ - ship.localPos.z) * lerp;
    }
  }

  // ─── Disengage check ──────────────────────────────────────────────────────

  _tickDisengageCheck() {
    for (let i = gameState.fleetEngagements.length - 1; i >= 0; i--) {
      const eng = gameState.fleetEngagements[i];

      const playerFleet = gameState.playerFleets.find(f => f.id === eng.playerFleetId);
      if (!playerFleet) continue;

      // If player has issued a new waypoint (retreat order), disengage
      if (playerFleet.state === 'moving' && playerFleet.waypoint) {
        gameState.endFleetEngagement(eng.id, 'retreat');
        continue;
      }

      // Distance-based disengage (enemy fleet has moved away somehow)
      const roaming = gameState.roamingFleets.find(f => f.id === eng.roamingFleetId);
      if (!roaming) continue;

      const ePos = this._getEnemyWorldPos(roaming.id);
      if (!ePos) continue;

      const dx = playerFleet.position.x - ePos.x;
      const dz = playerFleet.position.z - ePos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > DISENGAGE_RADIUS) {
        gameState.endFleetEngagement(eng.id, 'retreat');
      }
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  _pickTarget(aliveEnemies, mothership) {
    if (aliveEnemies.length > 0) {
      return aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    }
    if (mothership && mothership.hp > 0) return mothership;
    return null;
  }

  _pickMultipleTargets(aliveEnemies, mothership, count) {
    const targets = [];
    const pool = [...aliveEnemies.filter(e => e.hp > 0)];
    if (mothership && mothership.hp > 0) pool.push(mothership);

    for (let i = 0; i < count && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      targets.push(pool[idx]);
      // Don't remove — allow hitting same target multiple times if pool is small
      if (pool.length > count) pool.splice(idx, 1);
    }
    return targets;
  }

  _applyDamageToEnemy(target, damage, roamingFleet, engagement) {
    target.hp -= damage;
    if (target.hp <= 0) {
      target.hp = 0;
      // Is it the mothership?
      if (target === roamingFleet.mothership) {
        gameState.emit('mothershipDestroyed', { fleetId: roamingFleet.id, engagementId: engagement.id });
      } else {
        gameState.emit('fleetEnemyDestroyed', { fleetId: roamingFleet.id, enemy: target, engagementId: engagement.id });
      }
    }
  }

  _emitFireVisual(engagementId, fleetId, shipIndex, target, dt) {
    const key = `${fleetId}_${shipIndex}`;
    const timer = (this._fireTimers.get(key) || 0) + dt;

    if (timer >= FIRE_VISUAL_INTERVAL) {
      this._fireTimers.set(key, 0);
      gameState.emit('fleetShipFired', { engagementId, fleetId, shipIndex, targetId: target.id || 'mothership' });
    } else {
      this._fireTimers.set(key, timer);
    }
  }

  /**
   * Reconstruct active engagements from save data.
   * Re-emit events so visual systems can restore state.
   */
  reconstructEngagements() {
    for (const eng of gameState.fleetEngagements) {
      gameState.emit('fleetEngaged', {
        engagementId: eng.id,
        playerFleetId: eng.playerFleetId,
        roamingFleetId: eng.roamingFleetId,
        restored: true,
      });
    }
  }
}
