import BaseRobot from './BaseRobot.js';

export default class Scout extends BaseRobot {
  get trailColor() { return 0x7cb85e; }

  draw(g, x, y, t, cargo) {
    // Glow — green
    g.fillStyle(0x7cb85e, 0.1 + cargo * 0.04);
    g.fillCircle(x, y, 8);

    // Hull - oval
    g.fillStyle(0x0a1a0e, 1);
    g.lineStyle(1.5, 0x7cb85e, 1);
    g.beginPath();
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const px = x + Math.cos(a) * 6;
      const py = y + Math.sin(a) * 4.5;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.fillPath();
    g.strokePath();

    // Visor
    g.fillStyle(0x96d876, 1);
    g.fillEllipse(x, y - 1, 6, 3);

    // Eye blink
    const blink = Math.sin(t * 3 + x) > 0.8 ? 0 : 0.8;
    g.fillStyle(0xb4ffb4, blink);
    g.fillCircle(x, y - 1, 1);

    // Antenna
    g.lineStyle(1, 0x7cb85e, 1);
    g.beginPath();
    g.moveTo(x, y - 4.5);
    g.lineTo(x, y - 7);
    g.strokePath();

    // Antenna tip
    g.fillStyle(0x96d876, 1);
    g.fillCircle(x, y - 7, 1.2);

    // Cargo glow ring
    if (cargo > 1.5) {
      g.lineStyle(1, 0x96d876, 0.6);
      g.strokeCircle(x, y, 7);
    }
  }
}
