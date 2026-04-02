import * as THREE from 'three';
import { gameState } from '../GameState.js';
import { EnemyShip3D } from '../objects/EnemyShip3D.js';
import { Mothership3D } from '../objects/Mothership3D.js';
import { ENEMY_TYPES } from '../data/enemies.js';

const MAX_ENEMY_SHIPS = 12;
const MAX_MOTHERSHIPS = 2;

/**
 * Manages pooled enemy 3D objects. Only renders enemies for the focused planet.
 * Driven by GameState events: attackStarted, enemyDestroyed, mothershipDestroyed, attackEnded.
 */
export class EnemyManager3D {
  constructor(scene, animationLoop, galaxy, combatEffects) {
    this._scene = scene;
    this._galaxy = galaxy;
    this._combatEffects = combatEffects ?? null;

    // Enemy ship pool
    this._shipPool = [];
    this._activeShips = new Map(); // enemyId → EnemyShip3D
    this._shipFireTimers = new Map(); // enemyId → seconds until next shot

    for (let i = 0; i < MAX_ENEMY_SHIPS; i++) {
      const ship = new EnemyShip3D();
      scene.add(ship.group);
      this._shipPool.push(ship);
    }

    // Mothership pool
    this._mothershipPool = [];
    this._activeMotherships = new Map(); // attackId → Mothership3D

    for (let i = 0; i < MAX_MOTHERSHIPS; i++) {
      const ms = new Mothership3D();
      scene.add(ms.group);
      this._mothershipPool.push(ms);
    }

    // Event listeners
    gameState.on('attackStarted', (data) => this._onAttackStarted(data));
    gameState.on('attackEnded', (data) => this._onAttackEnded(data));
    gameState.on('enemyDestroyed', (data) => this._onEnemyDestroyed(data));
    gameState.on('mothershipDestroyed', (data) => this._onMothershipDestroyed(data));
    gameState.on('waveSpawned', (data) => this._onWaveSpawned(data));
    gameState.on('focusedPlanet', () => this._onFocusChanged());

    // Per-frame update
    animationLoop.onUpdate((dt) => this._update(dt));
  }

  _onAttackStarted({ attack, planetId }) {
    if (planetId !== gameState.focusedPlanet) return;
    this._spawnVisuals(attack);
  }

  _onAttackEnded({ attackId, planetId }) {
    this._despawnAttack(attackId);
  }

  _onEnemyDestroyed({ enemy }) {
    const ship = this._activeShips.get(enemy.id);
    if (!ship) return;
    ship.deactivate();
    this._shipPool.push(ship);
    this._activeShips.delete(enemy.id);
    this._shipFireTimers.delete(enemy.id);
  }

  _onMothershipDestroyed({ attackId }) {
    const ms = this._activeMotherships.get(attackId);
    if (!ms) return;
    ms.deactivate();
    this._mothershipPool.push(ms);
    this._activeMotherships.delete(attackId);
  }

  _onWaveSpawned({ attackId, planetId, enemies }) {
    if (planetId !== gameState.focusedPlanet) return;

    const planetPos = this._galaxy.getPlanetWorldPosition(planetId);
    if (!planetPos) return;

    // Mothership spawn flash
    const ms = this._activeMotherships.get(attackId);
    if (ms) ms.spawnFlash();

    // Spawn new enemy visuals
    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      this._spawnEnemyShip(enemy, planetPos);
    }
  }

  _onFocusChanged() {
    // Despawn all visuals
    this._despawnAll();

    // Spawn visuals for attacks on the new focused planet
    const planetId = gameState.focusedPlanet;
    for (const attack of gameState.activeAttacks) {
      if (attack.planetId === planetId) {
        this._spawnVisuals(attack);
      }
    }
  }

  _spawnVisuals(attack) {
    const planetPos = this._galaxy.getPlanetWorldPosition(attack.planetId);
    if (!planetPos) return;

    // Spawn enemy ships
    for (const enemy of attack.enemies) {
      if (enemy.hp <= 0) continue;
      this._spawnEnemyShip(enemy, planetPos);
    }

    // Spawn mothership
    if (attack.mothership && attack.mothership.hp > 0) {
      if (this._mothershipPool.length > 0 && !this._activeMotherships.has(attack.id)) {
        const ms = this._mothershipPool.pop();
        const msPos = planetPos.clone();
        msPos.y += 11;
        if (attack.restored) {
          // Restored from save — place directly
          ms.group.position.copy(msPos);
          ms.group.visible = true;
          ms.group.scale.setScalar(2.5);
        } else {
          ms.warpIn(msPos);
        }
        ms.setHP(attack.mothership.hp, attack.mothership.maxHP);
        this._activeMotherships.set(attack.id, ms);
      }
    }
  }

  _spawnEnemyShip(enemy, planetPos) {
    if (this._activeShips.has(enemy.id)) return;
    if (this._shipPool.length === 0) return;

    const ship = this._shipPool.pop();
    const def = ENEMY_TYPES[enemy.type];
    ship.setType(enemy.type, def?.color || '#ff3333');
    ship.activate(planetPos, enemy.speed);
    ship.setHP(enemy.hp, enemy.maxHP);
    ship._isAttacking = false;
    ship.setAttacking(false);
    const interval = this._getFireInterval(enemy);
    this._shipFireTimers.set(enemy.id, Math.random() * interval);
    this._activeShips.set(enemy.id, ship);
  }

  _despawnAttack(attackId) {
    // Find and despawn all ships for this attack
    const attack = gameState.activeAttacks.find(a => a.id === attackId);
    // Attack might already be removed from list — despawn based on mothership
    const ms = this._activeMotherships.get(attackId);
    if (ms) {
      ms.deactivate();
      this._mothershipPool.push(ms);
      this._activeMotherships.delete(attackId);
    }

    // We'll clean up orphaned ships in _update via HP check
  }

  _despawnAll() {
    for (const [id, ship] of this._activeShips) {
      ship.deactivate();
      this._shipPool.push(ship);
    }
    this._activeShips.clear();
    this._shipFireTimers.clear();

    for (const [id, ms] of this._activeMotherships) {
      ms.deactivate();
      this._mothershipPool.push(ms);
    }
    this._activeMotherships.clear();
  }

  _update(dt) {
    const focusedPlanet = gameState.focusedPlanet;
    const planetPos = this._galaxy.getPlanetWorldPosition(focusedPlanet);
    const camera = this._scene.getObjectByProperty?.('isCamera', true) || null;

    // Update active enemy ships
    for (const [enemyId, ship] of this._activeShips) {
      // Find enemy data to update HP
      let enemyData = null;
      for (const attack of gameState.activeAttacks) {
        enemyData = attack.enemies.find(e => e.id === enemyId);
        if (enemyData) break;
      }

      if (!enemyData || enemyData.hp <= 0) {
        ship.deactivate();
        this._shipPool.push(ship);
        this._activeShips.delete(enemyId);
        this._shipFireTimers.delete(enemyId);
        continue;
      }

      ship.update(dt, planetPos);
      ship.setHP(enemyData.hp, enemyData.maxHP);

      // Transition to attack phase when approach ends
      if (!ship._inApproach && !ship._isAttacking) {
        ship._isAttacking = true;
        ship.setAttacking(true);
      }

      // Enemy fires projectile toward station
      if (!ship._inApproach && enemyData.hp > 0 && this._combatEffects) {
        let timer = this._shipFireTimers.get(enemyId) ?? 0;
        timer -= dt;
        if (timer <= 0) {
          this._shipFireTimers.set(enemyId, this._getFireInterval(enemyData));
          this._fireEnemyProjectile(ship, enemyData, focusedPlanet);
        } else {
          this._shipFireTimers.set(enemyId, timer);
        }
      }
    }

    // Update motherships
    for (const [attackId, ms] of this._activeMotherships) {
      const attack = gameState.activeAttacks.find(a => a.id === attackId);
      if (!attack || !attack.mothership || attack.mothership.hp <= 0) {
        ms.deactivate();
        this._mothershipPool.push(ms);
        this._activeMotherships.delete(attackId);
        continue;
      }

      ms.update(dt);
      ms.setHP(attack.mothership.hp, attack.mothership.maxHP);
    }
  }

  /**
   * Get the world position of an active enemy ship by its logical id.
   * Returns null if the enemy has no active visual.
   */
  getEnemyWorldPosition(enemyId) {
    const ship = this._activeShips.get(enemyId);
    if (!ship || !ship.group.visible) return null;
    const v = new THREE.Vector3();
    ship.group.getWorldPosition(v);
    return v;
  }

  /**
   * Get the world position of any active enemy (for generic targeting).
   * Returns null if no enemies are visible.
   */
  getAnyEnemyWorldPosition() {
    for (const [, ship] of this._activeShips) {
      if (ship.group.visible) {
        const v = new THREE.Vector3();
        ship.group.getWorldPosition(v);
        return v;
      }
    }
    for (const [, ms] of this._activeMotherships) {
      if (ms.group.visible) {
        const v = new THREE.Vector3();
        ms.group.getWorldPosition(v);
        return v;
      }
    }
    return null;
  }

  /**
   * Get an active enemy ship by its logical id.
   * Returns null if the enemy is not actively spawned.
   */
  getShip(enemyId) {
    return this._activeShips.get(enemyId) ?? null;
  }

  /**
   * Compute fire interval based on enemy damage (1.5s–3.0s).
   */
  _getFireInterval(enemy) {
    return Math.max(1.5, 3.0 - (enemy.damage ?? 0) * 0.3);
  }

  /**
   * Fire a visual projectile from a ship toward the station.
   */
  _fireEnemyProjectile(ship, enemyData, planetId) {
    const sys = this._galaxy.getSystem(planetId);
    if (!sys?.stationWorldPosition) return;

    const fromPos = new THREE.Vector3();
    ship.group.getWorldPosition(fromPos);

    const colorMap = {
      bomber: 0xff4400,
      raider: 0xff8800,
      interceptor: 0xff2222,
    };
    const color = colorMap[enemyData.type] ?? 0xff3333;

    this._combatEffects.projectile(fromPos, sys.stationWorldPosition, color);
  }

  dispose() {
    for (const ship of this._shipPool) ship.dispose();
    for (const [, ship] of this._activeShips) ship.dispose();
    for (const ms of this._mothershipPool) ms.dispose();
    for (const [, ms] of this._activeMotherships) ms.dispose();
  }
}
