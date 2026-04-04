import * as THREE from 'three';

/**
 * Sprite-based lens flare effect for star-type planets.
 * Creates a bright central glow + secondary flare rings.
 */
export class LensFlare {
  constructor(color = 0xffaa33, intensity = 1.0) {
    this.group = new THREE.Group();
    this.intensity = intensity;

    const c = new THREE.Color(color);

    // Central glow
    this.centralSprite = this._createGlowSprite(c, 8, 1.0);
    this.group.add(this.centralSprite);

    // Secondary ring flares
    this.rings = [];
    const ringColors = [
      { color: c.clone().lerp(new THREE.Color(0xffffff), 0.3), size: 3, offset: 12, opacity: 0.3 },
      { color: c.clone().lerp(new THREE.Color(0xff4400), 0.4), size: 2, offset: 18, opacity: 0.15 },
      { color: c.clone(), size: 1.5, offset: 25, opacity: 0.1 },
    ];
    for (const r of ringColors) {
      const sprite = this._createGlowSprite(r.color, r.size, r.opacity);
      sprite.position.y = r.offset;
      this.rings.push(sprite);
      this.group.add(sprite);
    }

    // Flat array for direct iteration — avoids group.traverse() overhead
    this.sprites = [this.centralSprite, ...this.rings];

    // Scratch vector for update() — avoids per-call allocation
    this._scratchPos = new THREE.Vector3();
  }

  _createGlowSprite(color, size, opacity) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const cx = 64, cy = 64;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
    grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
    grad.addColorStop(0.15, `rgba(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)},${opacity * 0.7})`);
    grad.addColorStop(0.5, `rgba(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)},${opacity * 0.15})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Cross-shaped rays
    ctx.strokeStyle = `rgba(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)},${opacity * 0.3})`;
    ctx.lineWidth = 1;
    for (let a = 0; a < 4; a++) {
      const angle = (a / 4) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 10, cy + Math.sin(angle) * 10);
      ctx.lineTo(cx + Math.cos(angle) * 60, cy + Math.sin(angle) * 60);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.setScalar(size);
    return sprite;
  }

  /**
   * Update flare visibility based on camera-to-flare angle.
   * @param {THREE.Camera} camera
   * @param {number} time
   */
  update(camera, time) {
    // Pulse the central glow
    const pulse = 0.85 + Math.sin(time * 1.2) * 0.15;
    this.centralSprite.scale.setScalar(8 * pulse * this.intensity);

    // Flare rings float relative to camera direction
    this.group.getWorldPosition(this._scratchPos);
    const dir = this._scratchPos.sub(camera.position).normalize();
    for (let i = 0; i < this.rings.length; i++) {
      const s = 0.7 + Math.sin(time * 0.8 + i * 1.5) * 0.3;
      this.rings[i].scale.setScalar((3 - i) * s * this.intensity);
    }
  }

  dispose() {
    this.group.traverse((child) => {
      if (child.isSprite) {
        child.material.map.dispose();
        child.material.dispose();
      }
    });
  }
}
