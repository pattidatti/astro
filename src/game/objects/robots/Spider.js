import BaseRobot from './BaseRobot.js';

export default class Spider extends BaseRobot {
  get trailColor() { return 0xaa44ff; }

  draw(g, x, y, t, cargo) {
    const walk = Math.sin(t * 6) * 0.3;

    // Legs
    g.lineStyle(1.2, 0x8833cc, 1);
    for (let i = 0; i < 4; i++) {
      const side = i < 2 ? -1 : 1;
      const leg = i % 2 === 0 ? walk : -walk;
      const baseY = (i % 2 === 0) ? -1 : 1;

      g.beginPath();
      g.moveTo(x + side * 5, y + baseY);
      g.lineTo(x + side * 9, y + baseY * 2 + leg * 4);
      g.lineTo(x + side * 12, y + baseY * 3 + leg * 6);
      g.strokePath();
    }

    // Body glow
    g.fillStyle(0xaa44ff, 0.1 + cargo * 0.04);
    g.fillCircle(x, y, 9);

    // Abdomen
    g.fillStyle(0x110022, 1);
    g.lineStyle(1.5, 0xaa44ff, 1);
    g.fillEllipse(x, y + 1.5, 10, 7);
    g.beginPath();
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const px = x + Math.cos(a) * 5;
      const py = y + 1.5 + Math.sin(a) * 3.5;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokePath();

    // Head
    g.fillEllipse(x, y - 2.5, 7, 6);
    g.beginPath();
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const px = x + Math.cos(a) * 3.5;
      const py = y - 2.5 + Math.sin(a) * 3;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokePath();

    // 4 eyes
    for (let i = 0; i < 4; i++) {
      const ex = x + (i - 1.5) * 1.8;
      const ey = y - 3;
      g.fillStyle(0xcc88ff, 1);
      g.fillCircle(ex, ey, 0.9);
      g.fillStyle(0xffb4ff, 0.4 + Math.sin(t * 2 + i) * 0.3);
      g.fillCircle(ex, ey, 0.4);
    }

    if (cargo > 1.5) {
      g.lineStyle(1, 0xc864ff, 0.5);
      g.strokeCircle(x, y, 10);
    }
  }
}
