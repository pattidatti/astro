import * as THREE from 'three';
import { gameState } from '../GameState.js';
import { Ship3D } from './Ship3D.js';
import { ColonyShip3D } from '../objects/ColonyShip3D.js';

const MAX_SHIPS = 150;
const MAX_COLONY_SHIPS = 3;
const TRAIL_LENGTH = 16;

/**
 * Manages cargo ship and colony ship visual logic.
 * Cargo ships use InstancedMesh for extreme swarm performance.
 */
export class ShipManager3D {
  constructor(scene, animationLoop, galaxy, inputManager = null) {
    this._scene        = scene;
    this._galaxy       = galaxy;
    this._inputManager = inputManager;
    
    Ship3D.initSharedResources();
    const { geometries, materials } = Ship3D.getSharedResources();

    // 1. Instanced Meshes for Cargo Ships
    this._bodyMesh = new THREE.InstancedMesh(geometries.body, materials.body, MAX_SHIPS);
    this._bodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._bodyMesh.castShadow = true;
    this._bodyMesh.receiveShadow = true;
    this._bodyMesh.count = 0;
    scene.add(this._bodyMesh);

    this._cargoMesh = new THREE.InstancedMesh(geometries.cargo, materials.cargo, MAX_SHIPS);
    this._cargoMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._cargoMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SHIPS * 3), 3);
    this._cargoMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    this._cargoMesh.count = 0;
    scene.add(this._cargoMesh);

    this._hitMap = []; // instanceId -> shipId
    this._prevCargoCount = -1; // tracks last frame's count to minimize trail zero-fill

    // Connect InputManager to Instanced Meshes
    if (this._inputManager) {
      const clickHandler = (hit) => {
        const shipId = this._hitMap[hit.instanceId];
        if (shipId) gameState.emit('cargoShipClicked', { shipId });
      };
      
      this._bodyMesh.userData.isInstancedFleet = true;
      this._bodyMesh.userData.getShipId = (id) => this._hitMap[id];
      this._inputManager.addClickable(this._bodyMesh, clickHandler);

      this._cargoMesh.userData.isInstancedFleet = true;
      this._cargoMesh.userData.getShipId = (id) => this._hitMap[id];
      this._inputManager.addClickable(this._cargoMesh, clickHandler);
    }

    // 2. Global Trails
    const numPoints = MAX_SHIPS * (TRAIL_LENGTH - 1) * 2;
    const trailPos = new Float32Array(numPoints * 3);
    const trailCol = new Float32Array(numPoints * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    this._trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
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

    // 3. Logic Pools
    this._pool   = [];
    this._active = new Map(); // shipId → { ship3d, data }
    for (let i = 0; i < MAX_SHIPS; i++) {
      this._pool.push(new Ship3D());
    }

    this._colonyPool = [];
    for (let i = 0; i < MAX_COLONY_SHIPS; i++) {
      const cs = new ColonyShip3D();
      scene.add(cs.group);
      this._colonyPool.push(cs);
    }

    // Listen for ship events
    gameState.on('shipLaunched',       (data) => this._onShipLaunched(data));
    gameState.on('shipArrived',        (data) => this._onShipArrived(data));
    gameState.on('colonyShipLaunched', (data) => this._onShipLaunched(data));
    gameState.on('colonyShipArrived',  (data) => this._onColonyShipArrived(data));
    gameState.on('stateLoaded',        ()     => this._reconstructArrivingShips());

    // Per-frame update
    animationLoop.onUpdate((dt) => this._update(dt));

    this._reconstructArrivingShips();
  }

  _onShipLaunched(data) {
    if (this._active.has(data.id)) return;

    let ship3d;
    if (data.isColony) {
      if (this._colonyPool.length === 0) return;
      ship3d = this._colonyPool.pop();
      const fromPos = this._galaxy.getPlanetWorldPosition(data.fromPlanet);
      const toPos   = this._galaxy.getPlanetWorldPosition(data.toPlanet);
      if (fromPos && toPos) ship3d.activate(fromPos, toPos, data.resource);
      
      this._active.set(data.id, { ship3d, data });

      if (this._inputManager && ship3d.hitbox) {
        const shipId = data.id;
        this._inputManager.addClickable(ship3d.hitbox, () => {
          gameState.emit('colonyShipInFlightClicked', { shipId });
        });
        ship3d.hitbox.userData.shipId = shipId;
      }
    } else {
      if (this._pool.length === 0) return;
      ship3d = this._pool.pop();
      const fromPos = this._galaxy.getPlanetWorldPosition(data.fromPlanet);
      const toPos   = this._galaxy.getPlanetWorldPosition(data.toPlanet);
      if (fromPos && toPos) ship3d.activate(fromPos, toPos, data.resource);
      this._active.set(data.id, { ship3d, data });
    }
  }

  _onShipArrived(data) {
    const entry = this._active.get(data.id);
    if (!entry) return;

    entry.ship3d.deactivate();
    if (entry.data.isColony) {
      if (this._inputManager && entry.ship3d.hitbox) {
         this._inputManager.removeClickable(entry.ship3d.hitbox);
         entry.ship3d.hitbox.userData.shipId = null;
      }
      this._colonyPool.push(entry.ship3d);
    } else {
      this._pool.push(entry.ship3d);
    }
    this._active.delete(data.id);
  }

  _onColonyShipArrived(data) {
    for (const [shipId, entry] of this._active) {
      if (entry.data.isColony && entry.data.toPlanet === data.toPlanetId) {
        if (this._inputManager && entry.ship3d.hitbox) {
          this._inputManager.removeClickable(entry.ship3d.hitbox);
          entry.ship3d.hitbox.userData.shipId = null;
        }
        entry.ship3d.deactivate();
        this._colonyPool.push(entry.ship3d);
        this._active.delete(shipId);
        break;
      }
    }
  }

  _reconstructArrivingShips() {
    for (const ship of gameState.colonyShipsArriving) {
      if (this._active.has(ship.id)) continue; 
      if (this._colonyPool.length === 0) break;
      const ship3d = this._colonyPool.pop();
      ship3d.group.visible = true;
      this._active.set(ship.id, {
        ship3d,
        data: {
          id: ship.id,
          fromPlanet: ship.fromPlanetId,
          toPlanet: ship.toPlanetId,
          isColony: true,
          duration: 1,
          t: 1,
          orbitPhase: true,
          orbitTime: 0,
        },
      });
      if (this._inputManager && ship3d.hitbox) {
        const shipId = ship.id;
        ship3d.hitbox.userData.shipId = shipId;
        this._inputManager.addClickable(ship3d.hitbox, () => {
          gameState.emit('colonyShipInFlightClicked', { shipId });
        });
      }
    }
  }

  _update(dt) {
    let cargoCount = 0;
    this._hitMap.length = 0;

    const trailPos = this._trailGeo.attributes.position.array;
    const trailCol = this._trailGeo.attributes.color.array;

    for (const [shipId, entry] of this._active) {
      // COLONY SHIP LOGIC
      if (entry.data.isColony) {
        if (entry.data.orbitPhase) {
          entry.data.orbitTime = (entry.data.orbitTime || 0) + dt;
          const toPos = this._galaxy.getPlanetWorldPosition(entry.data.toPlanet);
          if (toPos) {
            const radius = 20;
            const angle = entry.data.orbitTime * 0.08 + Math.PI;
            entry.ship3d.group.position.set(
              toPos.x + Math.cos(angle) * radius,
              toPos.y + Math.sin(angle * 0.3) * 2,
              toPos.z + Math.sin(angle) * radius
            );
            entry.ship3d.group.rotation.y = -angle + Math.PI / 2;
          }
          continue;
        }

        entry.data.t += dt / entry.data.duration;
        if (entry.data.t >= 1) {
          entry.data.t = 1;
          entry.data.orbitPhase = true;
          entry.data.orbitTime = 0;
          continue;
        }
        const fromPosC = this._galaxy.getPlanetWorldPosition(entry.data.fromPlanet);
        const toPosC   = this._galaxy.getPlanetWorldPosition(entry.data.toPlanet);
        if (fromPosC && toPosC) entry.ship3d.update(entry.data.t, fromPosC, toPosC);
        continue;
      }

      // CARGO SHIP LOGIC (Instanced)
      const shipData = gameState.activeShips.find(s => s.id === shipId);
      if (!shipData) {
        entry.ship3d.deactivate();
        this._pool.push(entry.ship3d);
        this._active.delete(shipId);
        continue;
      }

      const fromPos = this._galaxy.getPlanetWorldPosition(shipData.fromPlanet);
      const toPos   = this._galaxy.getPlanetWorldPosition(shipData.toPlanet);
      if (fromPos && toPos) {
        entry.ship3d.update(shipData.t, fromPos, toPos);
      }

      // Record to instances
      const idx = cargoCount++;
      this._hitMap[idx] = shipId;

      this._bodyMesh.setMatrixAt(idx, entry.ship3d.matrix);
      this._cargoMesh.setMatrixAt(idx, entry.ship3d.matrix);
      this._cargoMesh.setColorAt(idx, entry.ship3d.cargoColor);

      // Record Global Trails
      const c = entry.ship3d.engineColor;
      for (let i = 0; i < 15; i++) {
        const vOffset = (idx * 15 + i) * 2;
        const p1 = entry.ship3d.trailPositions[i];
        const p2 = entry.ship3d.trailPositions[i + 1];

        // Pulse intensity slightly per ship across time based on global dt or t
        const pulse = 0.9 + Math.sin(shipData.t * Math.PI * 40) * 0.2;
        
        const alpha1 = (1 - (i / 15)) * pulse;
        const alpha2 = (1 - ((i + 1) / 15)) * pulse;

        // P1
        trailPos[vOffset * 3 + 0] = p1.x; trailPos[vOffset * 3 + 1] = p1.y; trailPos[vOffset * 3 + 2] = p1.z;
        trailCol[vOffset * 3 + 0] = c.r * alpha1; trailCol[vOffset * 3 + 1] = c.g * alpha1; trailCol[vOffset * 3 + 2] = c.b * alpha1;
        // P2
        trailPos[(vOffset + 1) * 3 + 0] = p2.x; trailPos[(vOffset + 1) * 3 + 1] = p2.y; trailPos[(vOffset + 1) * 3 + 2] = p2.z;
        trailCol[(vOffset + 1) * 3 + 0] = c.r * alpha2; trailCol[(vOffset + 1) * 3 + 1] = c.g * alpha2; trailCol[(vOffset + 1) * 3 + 2] = c.b * alpha2;
      }
    }

    // Zero-fill only the newly-vacated tail when ship count drops
    if (cargoCount < this._prevCargoCount) {
      const start = cargoCount * 15 * 2;
      const end   = this._prevCargoCount * 15 * 2;
      for (let i = start; i < end; i++) {
        trailPos[i * 3] = 0; trailPos[i * 3 + 1] = 0; trailPos[i * 3 + 2] = 0;
      }
    }
    this._prevCargoCount = cargoCount;

    // Mark updates
    this._bodyMesh.count = cargoCount;
    this._cargoMesh.count = cargoCount;
    this._bodyMesh.instanceMatrix.needsUpdate = true;
    this._cargoMesh.instanceMatrix.needsUpdate = true;
    this._cargoMesh.instanceColor.needsUpdate = true;

    this._trailGeo.attributes.position.needsUpdate = true;
    this._trailGeo.attributes.color.needsUpdate = true;
    this._trailGeo.setDrawRange(0, currentUsedTrails);
  }

  getColonyShipPosition(shipId) {
    const entry = this._active.get(shipId);
    return entry?.ship3d?.group?.position ?? null;
  }

  getShipPosition(shipId) {
    const entry = this._active.get(shipId);
    return entry?.ship3d?.worldPosition ?? null;
  }

  dispose() {
    for (const ship of this._pool) ship.dispose();
    for (const ship of this._colonyPool) ship.dispose();
    for (const { ship3d } of this._active.values()) ship3d.dispose();
    
    if (this._inputManager) {
      this._inputManager.removeClickable(this._bodyMesh);
      this._inputManager.removeClickable(this._cargoMesh);
    }
  }
}
