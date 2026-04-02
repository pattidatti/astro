import * as THREE from 'three';

const MAX_RINGS            = 8;
const RING_LIFETIME        = 0.6;
const DELIVERY_LIFETIME    = 1.4;
const PUNCH_LIFETIME       = 0.35;
const SPAWN_BURST_LIFETIME = 0.8;
const SHOCKWAVE_LIFETIME   = 1.2;

/**
 * 3D click feedback: expanding ring + floating number at click point.
 * Also handles delivery ceremony bursts at station positions.
 */
export class ClickFeedback {
  constructor(scene) {
    this.scene = scene;
    this.activeRings         = [];
    this.activeDeliveryRings = [];
    this.activeSpawnBursts   = [];
    this.activeShockwaves    = [];
  }

  /**
   * Spawn an expanding ring at a world-space click point.
   * @param {THREE.Vector3} point - World position of the click
   * @param {THREE.Vector3} normal - Surface normal at click point
   * @param {number} amount - Ore amount to display
   */
  spawn(point, normal, amount) {
    // Ring
    const ringGeo = new THREE.RingGeometry(0.3, 0.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc8a84e,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(point);
    // Orient ring to face away from planet surface
    ring.lookAt(point.clone().add(normal));
    this.scene.add(ring);

    // Floating number sprite
    const sprite = this._createNumberSprite(amount);
    sprite.position.copy(point).add(normal.clone().multiplyScalar(0.5));
    this.scene.add(sprite);

    const entry = {
      ring,
      sprite,
      age: 0,
      normal: normal.clone(),
      startPos: point.clone(),
    };
    this.activeRings.push(entry);

    // Cap active effects
    while (this.activeRings.length > MAX_RINGS) {
      const old = this.activeRings.shift();
      this.scene.remove(old.ring);
      this.scene.remove(old.sprite);
      old.ring.geometry.dispose();
      old.ring.material.dispose();
      old.sprite.material.map.dispose();
      old.sprite.material.dispose();
    }
  }

  _createNumberSprite(amount) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 36px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c8a84e';
    ctx.fillText('+' + amount, 64, 44);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3, 1.5, 1);
    return sprite;
  }

  /**
   * Delivery ceremony burst parented to a station group.
   * Multiple rapid deliveries merge into a single accumulating effect:
   * the total amount updates and the ring pulses to signal each addition.
   * @param {THREE.Group} stationGroup - The station's Three.js group
   * @param {number} amount            - Cargo amount to add
   */
  deliveryBurst(stationGroup, amount) {
    // Merge into existing entry for this station if one is still active
    const existing = this.activeDeliveryRings.find(e => e.parent === stationGroup);
    if (existing) {
      existing.accAmount += amount;
      existing.age = 0;            // restart fade timer
      existing.punchAge = 0;       // trigger scale punch
      this._updateDeliverySprite(existing);
      return;
    }

    // New entry — ring in station-local space at origin
    const ringGeo = new THREE.RingGeometry(0.4, 0.7, 40);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffcc44,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    stationGroup.add(ring);

    // Floating number sprite — starts 1 unit above station origin
    const { sprite, canvas, ctx, texture } = this._createDeliverySprite(amount);
    sprite.position.set(0, 1.0, 0);
    stationGroup.add(sprite);

    const entry = {
      ring, sprite, canvas, ctx, texture,
      age: 0, punchAge: PUNCH_LIFETIME, // punchAge starts done so no punch on spawn
      accAmount: amount,
      startLocalY: 1.0,
      parent: stationGroup,
    };
    this.activeDeliveryRings.push(entry);
  }

  _createDeliverySprite(amount) {
    const canvas = document.createElement('canvas');
    canvas.width  = 192;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.font      = 'bold 44px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle  = 'rgba(255,255,255,0.25)';
    ctx.fillText('+' + Math.round(amount), 96, 56);
    ctx.fillStyle = '#ffcc44';
    ctx.fillText('+' + Math.round(amount), 96, 54);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(4.5, 2.2, 1);
    return { sprite, canvas, ctx, texture };
  }

  _updateDeliverySprite(entry) {
    const { ctx, canvas, texture, accAmount } = entry;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font      = 'bold 44px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle  = 'rgba(255,255,255,0.25)';
    ctx.fillText('+' + Math.round(accAmount), 96, 56);
    ctx.fillStyle = '#ffcc44';
    ctx.fillText('+' + Math.round(accAmount), 96, 54);
    texture.needsUpdate = true;
  }

  /**
   * Spawn burst when a hired robot arrives at station — cyan/electric glow.
   */
  spawnBurst(worldPos) {
    const ringGeo = new THREE.RingGeometry(0.5, 0.9, 40);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x44ccff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(worldPos);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
    this.activeSpawnBursts.push({ ring, age: 0 });
    while (this.activeSpawnBursts.length > 4) {
      const old = this.activeSpawnBursts.shift();
      this.scene.remove(old.ring);
      old.ring.geometry.dispose();
      old.ring.material.dispose();
    }
  }

  /**
   * Large shockwave ring for base upgrades / colonization.
   */
  shockwave(worldPos) {
    const ringGeo = new THREE.RingGeometry(1.0, 1.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd866,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(worldPos);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
    this.activeShockwaves.push({ ring, age: 0 });
    while (this.activeShockwaves.length > 3) {
      const old = this.activeShockwaves.shift();
      this.scene.remove(old.ring);
      old.ring.geometry.dispose();
      old.ring.material.dispose();
    }
  }

  _disposeDeliveryEntry(entry) {
    entry.parent.remove(entry.ring);
    entry.parent.remove(entry.sprite);
    entry.ring.geometry.dispose();
    entry.ring.material.dispose();
    entry.texture.dispose();
    entry.sprite.material.dispose();
  }

  update(dt) {
    // Delivery rings — one per station, accumulates rapid deliveries
    for (let i = this.activeDeliveryRings.length - 1; i >= 0; i--) {
      const entry = this.activeDeliveryRings[i];
      entry.age     += dt;
      entry.punchAge = Math.min(entry.punchAge + dt, PUNCH_LIFETIME);

      if (entry.age >= DELIVERY_LIFETIME) {
        this._disposeDeliveryEntry(entry);
        this.activeDeliveryRings.splice(i, 1);
        continue;
      }

      const t = entry.age / DELIVERY_LIFETIME;

      // Punch: quick overshoot on merge, decays with smooth ease-out
      const punchT    = entry.punchAge / PUNCH_LIFETIME;
      const punchDecay = punchT < 1 ? Math.sin(punchT * Math.PI) * 0.6 : 0;

      entry.ring.scale.setScalar((1 + t * 7) + punchDecay * 2);
      entry.ring.material.opacity = (1 - t) * 0.9;

      entry.sprite.position.y       = entry.startLocalY + t * 4;
      entry.sprite.material.opacity  = 1 - t;
      // Brief scale pop on the number when merging
      const numPop = 1 + (punchT < 1 ? Math.sin(punchT * Math.PI) * 0.35 : 0);
      entry.sprite.scale.set(4.5 * numPop, 2.2 * numPop, 1);
    }

    for (let i = this.activeRings.length - 1; i >= 0; i--) {
      const entry = this.activeRings[i];
      entry.age += dt;

      if (entry.age >= RING_LIFETIME) {
        // Remove
        this.scene.remove(entry.ring);
        this.scene.remove(entry.sprite);
        entry.ring.geometry.dispose();
        entry.ring.material.dispose();
        entry.sprite.material.map.dispose();
        entry.sprite.material.dispose();
        this.activeRings.splice(i, 1);
        continue;
      }

      const t = entry.age / RING_LIFETIME;

      // Ring expands and fades
      const scale = 1 + t * 4;
      entry.ring.scale.setScalar(scale);
      entry.ring.material.opacity = (1 - t) * 0.8;

      // Number floats up and fades
      entry.sprite.position.copy(entry.startPos)
        .add(entry.normal.clone().multiplyScalar(0.5 + t * 3));
      entry.sprite.material.opacity = 1 - t;
    }

    // Spawn bursts (cyan)
    for (let i = this.activeSpawnBursts.length - 1; i >= 0; i--) {
      const e = this.activeSpawnBursts[i];
      e.age += dt;
      if (e.age >= SPAWN_BURST_LIFETIME) {
        this.scene.remove(e.ring);
        e.ring.geometry.dispose();
        e.ring.material.dispose();
        this.activeSpawnBursts.splice(i, 1);
        continue;
      }
      const t = e.age / SPAWN_BURST_LIFETIME;
      e.ring.scale.setScalar(1 + t * 10);
      e.ring.material.opacity = (1 - t) * 0.9;
    }

    // Shockwaves (gold, larger)
    for (let i = this.activeShockwaves.length - 1; i >= 0; i--) {
      const e = this.activeShockwaves[i];
      e.age += dt;
      if (e.age >= SHOCKWAVE_LIFETIME) {
        this.scene.remove(e.ring);
        e.ring.geometry.dispose();
        e.ring.material.dispose();
        this.activeShockwaves.splice(i, 1);
        continue;
      }
      const t = e.age / SHOCKWAVE_LIFETIME;
      e.ring.scale.setScalar(1 + t * 15);
      e.ring.material.opacity = (1 - t) * 0.7;
    }
  }
}
