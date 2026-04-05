import * as THREE from 'three';
import { gameState } from '../GameState.js';

const LIFETIME        = 600;   // seconds before wreckage despawns
const SPRITE_LIFETIME = 2.0;   // seconds per floating resource text
const SPRITE_RISE     = 3.0;   // world units/s upward drift
const NODE_SHAPES     = ['box', 'box', 'sphere', 'box', 'sphere'];

/**
 * WreckageField3D — visual debris field spawned when an enemy station is destroyed.
 *
 * Creates 3–5 dark hull-fragment meshes scattered around the station's last
 * world position. Supports:
 *   - tractorBeam(fleetPos): amber laser from fleet to nearest node (via CombatEffects)
 *   - _spawnResourceSprite(amount, resource): floating "+N ore/crystal" text
 *   - 600-second lifetime; auto-disposes from scene and gameState.wreckageFields
 */
export class WreckageField3D {
  /**
   * @param {object}          wreckageData  - Entry from gameState.wreckageFields
   * @param {THREE.Scene}     scene
   * @param {THREE.Vector3}   worldPos      - Station's last known world position
   * @param {object|null}     combatEffects - CombatEffects instance (may be null)
   */
  constructor(wreckageData, scene, worldPos, combatEffects) {
    this._data         = wreckageData;
    this._scene        = scene;
    this._combatEffects = combatEffects;
    this._pos          = worldPos.clone();
    this._elapsed      = 0;
    this._nodes        = [];
    this._sprites      = [];
    this._disposed     = false;

    // Populate wreckageData.position so FleetCombatSystem can find this field
    this._data.position = { x: worldPos.x, y: worldPos.y, z: worldPos.z };

    this._buildNodes();
  }

  // ---------------------------------------------------------------------------
  // Internal

  _buildNodes() {
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 nodes
    const hullMat = new THREE.MeshStandardMaterial({
      color:             0x1a1a1a,
      emissive:          new THREE.Color(0xaa3300),
      emissiveIntensity: 0.4,
      roughness:         0.9,
      metalness:         0.4,
    });

    for (let i = 0; i < count; i++) {
      const shape = NODE_SHAPES[i % NODE_SHAPES.length];
      const geo   = shape === 'box'
        ? new THREE.BoxGeometry(1, 0.6, 0.8)
        : new THREE.SphereGeometry(0.5, 6, 5);

      const mesh = new THREE.Mesh(geo, hullMat.clone());
      const scale = 0.5 + Math.random() * 1.0;
      mesh.scale.setScalar(scale);

      // Scatter ±5 units around wreckage centre
      mesh.position.set(
        this._pos.x + (Math.random() - 0.5) * 10,
        this._pos.y + (Math.random() - 0.5) * 2,
        this._pos.z + (Math.random() - 0.5) * 10,
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );

      this._scene.add(mesh);
      this._nodes.push(mesh);
    }
  }

  // ---------------------------------------------------------------------------
  // Public API

  /** Fire an amber tractor-beam laser from a fleet position toward the nearest node. */
  tractorBeam(fleetPos) {
    if (!this._combatEffects || this._nodes.length === 0) return;

    // Find nearest node to the fleet
    let nearest = this._nodes[0];
    let minDist = fleetPos.distanceToSquared(nearest.position);
    for (let i = 1; i < this._nodes.length; i++) {
      const d = fleetPos.distanceToSquared(this._nodes[i].position);
      if (d < minDist) { minDist = d; nearest = this._nodes[i]; }
    }

    this._combatEffects.laser(fleetPos, nearest.position, 0xffaa00);
  }

  /**
   * Spawn a floating "+N ore/crystal" text sprite above a random node.
   * @param {number} amount
   * @param {'ore'|'crystal'} resource
   */
  spawnResourceSprite(amount, resource) {
    if (amount <= 0 || this._nodes.length === 0) return;

    const color  = resource === 'crystal' ? '#c890ff' : '#d4a843';
    const label  = `+${Math.round(amount)} ${resource}`;

    const canvas = document.createElement('canvas');
    canvas.width  = 192;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font      = 'bold 28px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(label, 96, 44);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat    = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4, 1.5, 1);

    // Offset above a random debris node
    const node = this._nodes[Math.floor(Math.random() * this._nodes.length)];
    sprite.position.copy(node.position).add(new THREE.Vector3(0, 2, 0));
    this._scene.add(sprite);

    this._sprites.push({ sprite, age: 0 });
  }

  // ---------------------------------------------------------------------------

  update(dt) {
    if (this._disposed) return;

    this._elapsed += dt;
    if (this._elapsed >= LIFETIME) {
      this.dispose();
      return;
    }

    // Slow rotation on debris nodes
    for (const node of this._nodes) {
      node.rotation.y += 0.05 * dt;
      node.rotation.x += 0.02 * dt;
    }

    // Animate floating text sprites
    for (let i = this._sprites.length - 1; i >= 0; i--) {
      const entry = this._sprites[i];
      entry.age += dt;
      const t = entry.age / SPRITE_LIFETIME;
      entry.sprite.position.y += SPRITE_RISE * dt;
      entry.sprite.material.opacity = Math.max(0, 1 - t);

      if (entry.age >= SPRITE_LIFETIME) {
        this._scene.remove(entry.sprite);
        entry.sprite.material.map?.dispose();
        entry.sprite.material.dispose();
        this._sprites.splice(i, 1);
      }
    }
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;

    for (const node of this._nodes) {
      this._scene.remove(node);
      node.geometry.dispose();
      node.material.dispose();
    }
    this._nodes = [];

    for (const { sprite } of this._sprites) {
      this._scene.remove(sprite);
      sprite.material.map?.dispose();
      sprite.material.dispose();
    }
    this._sprites = [];

    // Remove from gameState
    const idx = gameState.wreckageFields.findIndex(w => w.id === this._data.id);
    if (idx !== -1) gameState.wreckageFields.splice(idx, 1);
  }
}
