import BaseRobot from './BaseRobot.js';

export default class Miner extends BaseRobot {
  get trailColor() { return 0xc8a84e; }

  draw(g, x, y, t, cargo) {
    // Glow — warm gold
    g.fillStyle(0xc8a84e, 0.08 + cargo * 0.04);
    g.fillCircle(x, y, 10);

    // Boxy hull
    g.fillStyle(0x1a1408, 1);
    g.lineStyle(1.5, 0xc8a84e, 1);
    g.fillRoundedRect(x - 6, y - 5, 12, 9, 2);
    g.strokeRoundedRect(x - 6, y - 5, 12, 9, 2);

    // Drill arm (rotates)
    const drillX = x + 6;
    g.lineStyle(1.5, 0xe8c85e, 1);
    for (let i = 0; i < 3; i++) {
      const a = t * 3 + i * (Math.PI * 2 / 3);
      g.beginPath();
      g.moveTo(drillX, y);
      g.lineTo(drillX + Math.cos(a) * 4, y + Math.sin(a) * 4);
      g.strokePath();
    }

    // Viewport
    g.fillStyle(0xc89030, 0.5);
    g.fillRect(x - 4, y - 3.5, 4, 3);

    // Warning stripe
    g.fillStyle(0xe8c85e, 0.4);
    g.fillRect(x - 5, y + 1.5, 3, 2);

    // Cargo indicator
    if (cargo > 1.5) {
      g.lineStyle(1.2, 0xe8c85e, 0.7);
      g.strokeCircle(x, y, 9);
    }
  }
}
