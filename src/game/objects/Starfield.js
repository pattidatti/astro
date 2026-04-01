import Phaser from 'phaser';

export default class Starfield {
  constructor(scene, count = 220) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(-10);
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * scene.scale.width,
      y: Math.random() * scene.scale.height,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.001,
      baseAlpha: Math.random() * 0.85 + 0.1,
      warm: Math.random() < 0.2
    }));
    this.time = 0;

    // Nebula textures (pre-rendered)
    this.nebulaGraphics = scene.add.graphics().setDepth(-11);
    this.drawNebula();
  }

  drawNebula() {
    const g = this.nebulaGraphics;
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    // Blue nebula
    g.fillStyle(0x003ca0, 0.12);
    g.fillCircle(w * 0.2, h * 0.3, w * 0.4);
    // Purple nebula
    g.fillStyle(0x6400a0, 0.1);
    g.fillCircle(w * 0.8, h * 0.6, w * 0.35);
  }

  update(delta) {
    this.time += delta / 1000;
    const g = this.graphics;
    g.clear();

    for (const s of this.stars) {
      s.phase += s.speed;
      const a = s.baseAlpha * (0.3 + 0.7 * Math.abs(Math.sin(s.phase)));
      const color = s.warm ? 0xffbe6e : 0xb4dcff;
      g.fillStyle(color, a);
      g.fillCircle(s.x, s.y, s.r);

      // Cross-sparkle for brighter stars
      if (s.r > 1.1 && Math.abs(Math.sin(s.phase)) > 0.88) {
        g.lineStyle(0.5, color, a * 0.35);
        g.beginPath();
        g.moveTo(s.x - s.r * 3, s.y);
        g.lineTo(s.x + s.r * 3, s.y);
        g.strokePath();
        g.beginPath();
        g.moveTo(s.x, s.y - s.r * 3);
        g.lineTo(s.x, s.y + s.r * 3);
        g.strokePath();
      }
    }
  }

  resize(width, height) {
    for (const s of this.stars) {
      s.x = Math.random() * width;
      s.y = Math.random() * height;
    }
    this.nebulaGraphics.clear();
    this.drawNebula();
  }
}
