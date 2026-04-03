import * as THREE from 'three';
import { gameState } from '../GameState.js';
import { EnemyShip3D } from '../objects/EnemyShip3D.js';
import { Mothership3D } from '../objects/Mothership3D.js';
import { ENEMY_TYPES } from '../data/enemies.js';

const MAX_ENEMY_SHIPS = 150;
const MAX_MOTHERSHIPS = 2;
const ENEMY_TRAIL_LENGTH = 16;

/**
 * Manages pooled enemy 3D objects and InstancedMeshes.
 */
export class EnemyManager3D {
  constructor(scene, animationLoop, galaxy, combatEffects) {
    this._scene = scene;
    this._galaxy = galaxy;
    this._combatEffects = combatEffects ?? null;

    EnemyShip3D.initSharedResources();
    const { geometries, materials } = EnemyShip3D.getSharedResources();

    // Mapping enemy types to internal names
    this._typeMap = {
      interceptor: 'interceptor',
      bomber: 'bomber',
      raider: 'raider'
    };

    // Creating InstancedMeshes
    this._instancedMeshes = {};
    const types = ['interceptor', 'bomber', 'raider'];

    for (const t of types) {
      // Body
      const bodyMesh = new THREE.InstancedMesh(geometries[t].body, materials.body, MAX_ENEMY_SHIPS);
      bodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      bodyMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_ENEMY_SHIPS * 3), 3);
      bodyMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      // All inactive by default (scale 0) -> we'll clear count or scale 0.
      bodyMesh.count = 0; 
      scene.add(bodyMesh);

      // Glow
      const glowMesh = new THREE.InstancedMesh(geometries[t].glow, materials.glow, MAX_ENEMY_SHIPS);
      glowMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      glowMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_ENEMY_SHIPS * 3), 3);
      glowMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
      glowMesh.count = 0;
      scene.add(glowMesh);

      this._instancedMeshes[t] = { body: bodyMesh, glow: glowMesh };
    }

    // Global Trails
    const maxTrailPoints = MAX_ENEMY_SHIPS * (ENEMY_TRAIL_LENGTH - 1) * 2; // segments
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailColors = new Float32Array(maxTrailPoints * 3);
    
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    this._trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    this._trailGeo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    this._trailGeo.attributes.color.setUsage(THREE.DynamicDrawUsage);

    this._trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._trails = new THREE.LineSegments(this._trailGeo, this._trailMat);
    scene.add(this._trails);

    // Enemy ship logic pool
    this._shipPool = [];
    this._activeShips = new Map(); // enemyId → EnemyShip3D wrapper
    this._shipFireTimers = new Map();

    for (let i = 0; i < MAX_ENEMY_SHIPS; i++) {
      const ship = new EnemyShip3D();
      this._shipPool.push(ship); // No THREE.Group to add
    }

    // Mothership pool
    this._mothershipPool = [];
    this._activeMotherships = new Map();

    for (let i = 0; i < MAX_MOTHERSHIPS; i++) {
      const ms = new Mothership3D(); // Motherships remain classical THREE.Group
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

  _onAttackEnded({ attackId }) {
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

    const ms = this._activeMotherships.get(attackId);
    if (ms) ms.spawnFlash();

    for (const enemy of enemies) {
      if (enemy.hp <= 0) continue;
      this._spawnEnemyShip(enemy, planetPos);
    }
  }

  _onFocusChanged() {
    this._despawnAll();
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

    for (const enemy of attack.enemies) {
      if (enemy.hp <= 0) continue;
      this._spawnEnemyShip(enemy, planetPos);
    }

    if (attack.mothership && attack.mothership.hp > 0) {
      if (this._mothershipPool.length > 0 && !this._activeMotherships.has(attack.id)) {
        const ms = this._mothershipPool.pop();
        const msPos = planetPos.clone();
        msPos.y += 11;
        if (attack.restored) {
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
    const internalT = this._typeMap[enemy.type] || 'interceptor';
    
    ship.setType(internalT, def?.color || '#ff3333');
    ship.activate(planetPos, enemy.speed);
    ship.setAttacking(false);

    const interval = this._getFireInterval(enemy);
    this._shipFireTimers.set(enemy.id, Math.random() * interval);
    this._activeShips.set(enemy.id, ship);
  }

  _despawnAttack(attackId) {
    const ms = this._activeMotherships.get(attackId);
    if (ms) {
      ms.deactivate();
      this._mothershipPool.push(ms);
      this._activeMotherships.delete(attackId);
    }
    // Orphaned ships will be despawned during _update if they don't map to an active attack
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
    
    // Reset instance counters
    const counts = { interceptor: 0, bomber: 0, raider: 0 };
    let shipIndex = 0; // Absolute total active ships for trails
    
    const trailPositions = this._trailGeo.attributes.position.array;
    const trailColors = this._trailGeo.attributes.color.array;

    for (const [enemyId, ship] of this._activeShips) {
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

      // Logic update
      ship.update(dt, planetPos);

      if (!ship._inApproach && !ship._isAttacking) {
        ship._isAttacking = true;
        ship.setAttacking(true);
      }

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

      // Record Instanced Transform/Color
      const typeStr = ship._type;
      const idx = counts[typeStr];
      counts[typeStr]++;
      
      const meshes = this._instancedMeshes[typeStr];
      meshes.body.setMatrixAt(idx, ship.matrix);
      meshes.body.setColorAt(idx, ship._bodyColor);
      
      meshes.glow.setMatrixAt(idx, ship.matrix);
      meshes.glow.setColorAt(idx, ship._glowColor);

      // Record Global Trails
      const c = ship._glowColor;
      // 15 segments = 30 vertices
      for (let i = 0; i < 15; i++) {
        const vOffset = (shipIndex * 15 + i) * 2;
        
        const p1 = ship.trailPositions[i];
        const p2 = ship.trailPositions[i + 1];

        // Alpha fade out via darkening (additive blending)
        const alpha1 = 1 - (i / 15);
        const alpha2 = 1 - ((i + 1) / 15);

        // P1
        trailPositions[vOffset * 3 + 0] = p1.x;
        trailPositions[vOffset * 3 + 1] = p1.y;
        trailPositions[vOffset * 3 + 2] = p1.z;
        trailColors[vOffset * 3 + 0] = c.r * alpha1;
        trailColors[vOffset * 3 + 1] = c.g * alpha1;
        trailColors[vOffset * 3 + 2] = c.b * alpha1;

        // P2
        trailPositions[(vOffset + 1) * 3 + 0] = p2.x;
        trailPositions[(vOffset + 1) * 3 + 1] = p2.y;
        trailPositions[(vOffset + 1) * 3 + 2] = p2.z;
        trailColors[(vOffset + 1) * 3 + 0] = c.r * alpha2;
        trailColors[(vOffset + 1) * 3 + 1] = c.g * alpha2;
        trailColors[(vOffset + 1) * 3 + 2] = c.b * alpha2;
      }
      shipIndex++;
    }

    // Collapse unused trail segments
    const totalMaxTrails = MAX_ENEMY_SHIPS * 15 * 2;
    const currentUsedTrails = shipIndex * 15 * 2;
    for (let i = currentUsedTrails; i < totalMaxTrails; i++) {
       trailPositions[i * 3 + 0] = 0;
       trailPositions[i * 3 + 1] = 0; // Or hidden behind camera
       trailPositions[i * 3 + 2] = 0;
    }

    // Mark instanced mesh updates
    for (const t of Object.keys(this._instancedMeshes)) {
      const { body, glow } = this._instancedMeshes[t];
      body.count = counts[t];
      glow.count = counts[t];
      body.instanceMatrix.needsUpdate = true;
      body.instanceColor.needsUpdate = true;
      glow.instanceMatrix.needsUpdate = true;
      glow.instanceColor.needsUpdate = true;
    }
    
    // Mark global trail update
    this._trailGeo.attributes.position.needsUpdate = true;
    this._trailGeo.attributes.color.needsUpdate = true;
    // Set geometry draw range explicitly based on used trails to optimize
    this._trailGeo.setDrawRange(0, currentUsedTrails);

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

  getEnemyWorldPosition(enemyId) {
    const ship = this._activeShips.get(enemyId);
    if (!ship || !ship.visible) return null;
    return ship.worldPosition.clone();
  }

  getAnyEnemyWorldPosition() {
    for (const [, ship] of this._activeShips) {
      if (ship.visible) {
        return ship.worldPosition.clone();
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

  getShip(enemyId) {
    return this._activeShips.get(enemyId) ?? null;
  }

  _getFireInterval(enemy) {
    return Math.max(1.5, 3.0 - (enemy.damage ?? 0) * 0.3);
  }

  _fireEnemyProjectile(ship, enemyData, planetId) {
    const sys = this._galaxy.getSystem(planetId);
    if (!sys?.stationWorldPosition) return;
    const colorMap = { bomber: 0xff4400, raider: 0xff8800, interceptor: 0xff2222 };
    this._combatEffects.projectile(ship.worldPosition, sys.stationWorldPosition, colorMap[enemyData.type] ?? 0xff3333);
  }

  dispose() {
    for (const ship of this._shipPool) ship.dispose();
    for (const [, ship] of this._activeShips) ship.dispose();
    for (const ms of this._mothershipPool) ms.dispose();
    for (const [, ms] of this._activeMotherships) ms.dispose();
    this._trailGeo.dispose();
    this._trailMat.dispose();
  }
}
