import Phaser from 'phaser';

export default class Station extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.graphics = scene.add.graphics();
    this.add(this.graphics);
    scene.add.existing(this);
    this.time = 0;
  }

  update(time, delta) {
    this.time += delta / 1000;
    this.draw(this.time);
  }

  draw(t) {
    const g = this.graphics;
    g.clear();

    // Outer halo glow — warm gold
    g.fillStyle(0xc8a84e, 0.10 + Math.sin(t * 2) * 0.05);
    g.fillCircle(0, 0, 44);

    // Rotate the whole station
    this.rotation = t * 0.32;

    // Outer ring — gold
    g.lineStyle(2.2, 0xc8a84e, 0.9);
    g.strokeCircle(0, 0, 20);

    // Inner ring — dimmer gold
    g.lineStyle(1, 0x8a7a4e, 0.4);
    g.strokeCircle(0, 0, 13);

    // Spokes + panels
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const cos = Math.cos(a);
      const sin = Math.sin(a);

      // Spoke
      g.lineStyle(1.5, 0x8a7a4e, 0.55);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(cos * 20, sin * 20);
      g.strokePath();

      // Panel
      const px = cos * 14;
      const py = sin * 14;
      g.fillStyle(0x2a2210, 0.9);
      g.fillRect(px - 5.5, py - 2, 11, 4);
      g.lineStyle(0.8, 0xc8a84e, 0.5);
      g.strokeRect(px - 5.5, py - 2, 11, 4);
      g.fillStyle(0x7cb85e, 0.3);
      g.fillRect(px - 4, py - 1.2, 3.5, 2.4);
    }

    // Hub — dark with gold border
    g.fillStyle(0x1a1508, 1);
    g.fillCircle(0, 0, 8);
    g.lineStyle(2, 0xc8a84e, 1);
    g.strokeCircle(0, 0, 8);

    // Pulse — gold
    g.fillStyle(0xc8a84e, 0.18 + Math.sin(t * 4) * 0.18);
    g.fillCircle(0, 0, 12);

    // Center dot — green
    g.fillStyle(0x7cb85e, 1);
    g.fillCircle(0, 0, 2.5);
  }
}
