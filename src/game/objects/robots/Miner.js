import BaseRobot from './BaseRobot.js';

export default class Miner extends BaseRobot {
  get trailColor() { return 0xff8844; }

  draw(g, x, y, t, cargo) {
    // Glow
    g.fillStyle(0xff8844, 0.08 + cargo * 0.04);
    g.fillCircle(x, y, 10);

    // Boxy hull
    g.fillStyle(0x1a0800, 1);
    g.lineStyle(1.5, 0xff6622, 1);
    g.fillRoundedRect(x - 6, y - 5, 12, 9, 2);
    g.strokeRoundedRect(x - 6, y - 5, 12, 9, 2);

    // Drill arm (rotates)
    const drillX = x + 6;
    g.lineStyle(1.5, 0xff8844, 1);
    for (let i = 0; i < 3; i++) {
      const a = t * 3 + i * (Math.PI * 2 / 3);
      g.beginPath();
      g.moveTo(drillX, y);
      g.lineTo(drillX + Math.cos(a) * 4, y + Math.sin(a) * 4);
      g.strokePath();
    }

    // Viewport
    g.fillStyle(0xff6400, 0.5);
    g.fillRect(x - 4, y - 3.5, 4, 3);

    // Warning stripe
    g.fillStyle(0xffc800, 0.4);
    g.fillRect(x - 5, y + 1.5, 3, 2);

    // Cargo indicator
    if (cargo > 1.5) {
      g.lineStyle(1.2, 0xffd700, 0.7);
      g.strokeCircle(x, y, 9);
    }
  }
}
