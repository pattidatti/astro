import * as THREE from 'three';

const MAX_RINGS = 8;
const RING_LIFETIME = 0.6;

/**
 * 3D click feedback: expanding ring + floating number at click point.
 */
export class ClickFeedback {
  constructor(scene) {
    this.scene = scene;
    this.activeRings = [];
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

  update(dt) {
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
