import Phaser from 'phaser';

/**
 * Multi-layer starfield with parallax support.
 *
 * Layers:
 *  - Nebula image (pre-rendered, depth -11, parallax 0.3)
 *  - Far stars (pre-rendered texture, depth -10, parallax 0.15)
 *  - Mid stars (per-frame Graphics, depth -8, parallax 0.5)
 *  - Near stars (per-frame Graphics, depth -7, parallax 0.75)
 *  - Dust particles (per-frame Graphics, depth -6, parallax 0.5)
 */
export default class Starfield {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;

    const W = scene.scale.width;
    const H = scene.scale.height;

    // Graphics layers
    this.midGraphics = scene.add.graphics().setDepth(-8);
    this.nearGraphics = scene.add.graphics().setDepth(-7);
    this.dustGraphics = scene.add.graphics().setDepth(-6);

    // Nebula image placeholder (set via setNebula)
    this.nebulaImage = null;

    // Far star image placeholder (generated once)
    this.farStarImage = null;

    // Generate star data
    this.midStars = this._generateMidStars(W, H);
    this.nearStars = this._generateNearStars(W, H);
    this.dust = this._generateDust(W, H);

    // Pre-render far stars
    this._generateFarStarTexture(W, H);
  }

  // --- Star generation ---

  _starColor() {
    const r = Math.random();
    if (r < 0.60) return 0xb4c8e8; // cool blue-white
    if (r < 0.80) return 0xffc87a; // warm gold
    if (r < 0.95) return 0xffffff; // white
    return 0xffaa88;               // pale orange
  }

  _generateMidStars(W, H) {
    // Spread over 2x viewport for parallax headroom
    const areaW = W * 2.5;
    const areaH = H * 2.5;
    const count = 400;
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * areaW,
      y: (Math.random() - 0.5) * areaH,
      r: Math.random() * 1.0 + 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
      baseAlpha: Math.random() * 0.55 + 0.3,
      color: this._starColor(),
    }));
  }

  _generateNearStars(W, H) {
    const areaW = W * 3;
    const areaH = H * 3;
    const count = 60;
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * areaW,
      y: (Math.random() - 0.5) * areaH,
      r: Math.random() * 1.5 + 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.002 + 0.0008,
      baseAlpha: Math.random() * 0.4 + 0.5,
      color: this._starColor(),
      haloR: Math.random() * 3 + 4,
    }));
  }

  _generateDust(W, H) {
    const areaW = W * 2.5;
    const areaH = H * 2.5;
    const count = 70;
    // Drift direction (slow solar wind)
    this.dustDirX = 0.08 + Math.random() * 0.04;
    this.dustDirY = 0.03 + Math.random() * 0.02;
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * areaW,
      y: (Math.random() - 0.5) * areaH,
      r: Math.random() * 0.8 + 0.5,
      alpha: Math.random() * 0.05 + 0.02,
      color: 0xaabbcc,
    }));
  }

  // --- Pre-rendered far star texture ---

  _generateFarStarTexture(W, H) {
    const key = '_farStars';
    if (this.scene.textures.exists(key)) {
      this.scene.textures.remove(key);
    }

    // Large canvas for parallax headroom
    const texW = Math.min(Math.round(W * 2.5), 4000);
    const texH = Math.min(Math.round(H * 2.5), 2400);
    const canvas = this.scene.textures.createCanvas(key, texW, texH);
    const ctx = canvas.context;

    const count = 1000;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * texW;
      const y = Math.random() * texH;
      const r = Math.random() * 0.5 + 0.3;
      const alpha = Math.random() * 0.4 + 0.15;

      const colRand = Math.random();
      let color;
      if (colRand < 0.6) color = 'rgba(180,200,232,';
      else if (colRand < 0.8) color = 'rgba(255,200,122,';
      else color = 'rgba(255,255,255,';

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + alpha + ')';
      ctx.fill();
    }

    canvas.refresh();

    // Create image from texture
    if (this.farStarImage) this.farStarImage.destroy();
    this.farStarImage = this.scene.add.image(0, 0, key)
      .setOrigin(0.5)
      .setDepth(-10);
  }

  // --- Nebula management ---

  setNebula(textureKey) {
    if (this.nebulaImage) this.nebulaImage.destroy();
    this.nebulaImage = this.scene.add.image(0, 0, textureKey)
      .setOrigin(0.5)
      .setDepth(-11)
      .setAlpha(1);

    // Position at viewport center initially
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    this.nebulaImage.setPosition(W / 2, H / 2);
  }

  fadeToNebula(textureKey, duration = 500) {
    const oldNebula = this.nebulaImage;

    // Create new nebula image
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    this.nebulaImage = this.scene.add.image(W / 2, H / 2, textureKey)
      .setOrigin(0.5)
      .setDepth(-11)
      .setAlpha(0);

    // Crossfade
    this.scene.tweens.add({
      targets: this.nebulaImage,
      alpha: 1,
      duration,
      ease: 'Power2',
    });

    if (oldNebula) {
      this.scene.tweens.add({
        targets: oldNebula,
        alpha: 0,
        duration,
        ease: 'Power2',
        onComplete: () => oldNebula.destroy(),
      });
    }
  }

  // --- Per-frame update ---

  update(delta, panX = 0, panY = 0) {
    this.time += delta / 1000;

    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const cx = W / 2;
    const cy = H / 2;

    // Position nebula with slow parallax
    if (this.nebulaImage) {
      this.nebulaImage.setPosition(
        cx - panX * 0.3,
        cy - panY * 0.3
      );
    }

    // Position far star image
    if (this.farStarImage) {
      this.farStarImage.setPosition(
        cx - panX * 0.15,
        cy - panY * 0.15
      );
    }

    // --- Mid stars (per-frame) ---
    const mg = this.midGraphics;
    mg.clear();

    for (const s of this.midStars) {
      s.phase += s.speed;
      const a = s.baseAlpha * (0.35 + 0.65 * Math.abs(Math.sin(s.phase)));

      const sx = cx + s.x - panX * 0.5;
      const sy = cy + s.y - panY * 0.5;

      // Cull if off-screen
      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;

      mg.fillStyle(s.color, a);
      mg.fillCircle(sx, sy, s.r);
    }

    // --- Near stars (per-frame with halos) ---
    const ng = this.nearGraphics;
    ng.clear();

    for (const s of this.nearStars) {
      s.phase += s.speed;
      const pulse = Math.abs(Math.sin(s.phase));
      const a = s.baseAlpha * (0.4 + 0.6 * pulse);

      const sx = cx + s.x - panX * 0.75;
      const sy = cy + s.y - panY * 0.75;

      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;

      // Soft glow halo
      ng.fillStyle(s.color, a * 0.08);
      ng.fillCircle(sx, sy, s.haloR);

      // Star dot
      ng.fillStyle(s.color, a);
      ng.fillCircle(sx, sy, s.r);

      // Cross-sparkle on bright moments
      if (pulse > 0.85) {
        const sparkleAlpha = (pulse - 0.85) * 6 * a * 0.4;
        const sparkleLen = s.r * 4;
        ng.lineStyle(0.6, s.color, sparkleAlpha);
        ng.beginPath();
        ng.moveTo(sx - sparkleLen, sy);
        ng.lineTo(sx + sparkleLen, sy);
        ng.strokePath();
        ng.beginPath();
        ng.moveTo(sx, sy - sparkleLen);
        ng.lineTo(sx, sy + sparkleLen);
        ng.strokePath();
      }
    }

    // --- Dust particles ---
    const dg = this.dustGraphics;
    dg.clear();

    for (const d of this.dust) {
      // Drift
      d.x += this.dustDirX;
      d.y += this.dustDirY;

      const sx = cx + d.x - panX * 0.5;
      const sy = cy + d.y - panY * 0.5;

      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;

      dg.fillStyle(d.color, d.alpha);
      dg.fillCircle(sx, sy, d.r);
    }
  }

  resize(width, height) {
    // Regenerate star positions for new dimensions
    this.midStars = this._generateMidStars(width, height);
    this.nearStars = this._generateNearStars(width, height);
    this.dust = this._generateDust(width, height);
    this._generateFarStarTexture(width, height);

    // Reposition nebula
    if (this.nebulaImage) {
      this.nebulaImage.setPosition(width / 2, height / 2);
    }
  }

  setDustColor(color) {
    for (const d of this.dust) {
      d.color = color;
    }
  }
}
