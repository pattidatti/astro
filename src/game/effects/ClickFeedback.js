import * as THREE from 'three';

const MAX_RINGS            = 8;
const RING_LIFETIME        = 0.6;
const MAX_DELIVERY_RINGS   = 4;
const DELIVERY_LIFETIME    = 1.0;

/**
 * 3D click feedback: expanding ring + floating number at click point.
 * Also handles delivery ceremony bursts at station positions.
 */
export class ClickFeedback {
  constructor(scene) {
    this.scene = scene;
    this.activeRings        = [];
    this.activeDeliveryRings = [];
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
   * Spawn a delivery ceremony burst at a station world position.
   * Larger ring, brighter text, floats upward.
   * @param {THREE.Vector3} worldPos - Station world position
   * @param {number} amount          - Cargo amount to show
   */
  deliveryBurst(worldPos, amount) {
    // Expanding energy ring
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
    ring.position.copy(worldPos);
    ring.rotation.x = Math.PI / 2; // lay flat
    this.scene.add(ring);

    // Larger, brighter floating number
    const sprite = this._createDeliverySprite(amount);
    sprite.position.copy(worldPos).setY(worldPos.y + 1.0);
    this.scene.add(sprite);

    const entry = { ring, sprite, age: 0, startY: worldPos.y };
    this.activeDeliveryRings.push(entry);

    // Cap pool
    while (this.activeDeliveryRings.length > MAX_DELIVERY_RINGS) {
      this._disposeDeliveryEntry(this.activeDeliveryRings.shift());
    }
  }

  _createDeliverySprite(amount) {
    const canvas = document.createElement('canvas');
    canvas.width  = 192;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.font      = 'bold 44px Orbitron, monospace';
    ctx.textAlign = 'center';
    // White glow halo
    ctx.fillStyle  = 'rgba(255,255,255,0.25)';
    ctx.fillText('+' + Math.round(amount), 96, 56);
    // Gold foreground
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
    return sprite;
  }

  _disposeDeliveryEntry(entry) {
    this.scene.remove(entry.ring);
    this.scene.remove(entry.sprite);
    entry.ring.geometry.dispose();
    entry.ring.material.dispose();
    entry.sprite.material.map.dispose();
    entry.sprite.material.dispose();
  }

  update(dt) {
    // Delivery rings
    for (let i = this.activeDeliveryRings.length - 1; i >= 0; i--) {
      const entry = this.activeDeliveryRings[i];
      entry.age += dt;
      if (entry.age >= DELIVERY_LIFETIME) {
        this._disposeDeliveryEntry(entry);
        this.activeDeliveryRings.splice(i, 1);
        continue;
      }
      const t = entry.age / DELIVERY_LIFETIME;
      entry.ring.scale.setScalar(1 + t * 7);
      entry.ring.material.opacity = (1 - t) * 0.9;
      entry.sprite.position.y     = entry.startY + 1.0 + t * 4;
      entry.sprite.material.opacity = 1 - t;
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
  }
}
