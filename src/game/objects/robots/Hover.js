import BaseRobot from './BaseRobot.js';

export default class Hover extends BaseRobot {
  get trailColor() { return 0xffdd00; }

  draw(g, x, y, t, cargo) {
    // Bob offset
    const bobY = y + Math.sin(t * 2.5) * 2;

    // Thruster glow
    g.fillStyle(0xffdc00, 0.06 + cargo * 0.03);
    g.fillCircle(x, bobY, 12);

    // Spinning ring 1
    g.lineStyle(1.2, 0xffc800, 0.5);
    g.beginPath();
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2 + t * 2;
      const rx = x + Math.cos(a) * 9;
      const ry = bobY + Math.sin(a) * 4;
      if (i === 0) g.moveTo(rx, ry);
      else g.lineTo(rx, ry);
    }
    g.strokePath();

    // Spinning ring 2
    g.lineStyle(1, 0xffa000, 0.4);
    g.beginPath();
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2 - t * 3;
      const rx = x + Math.cos(a) * 7;
      const ry = bobY + Math.sin(a) * 3;
      if (i === 0) g.moveTo(rx, ry);
      else g.lineTo(rx, ry);
    }
    g.strokePath();

    // Body disc
    g.fillStyle(0x221100, 1);
    g.lineStyle(1.5, 0xffaa00, 1);
    g.fillEllipse(x, bobY, 12, 6);
    g.beginPath();
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rx = x + Math.cos(a) * 6;
      const ry = bobY + Math.sin(a) * 3;
      if (i === 0) g.moveTo(rx, ry);
      else g.lineTo(rx, ry);
    }
    g.strokePath();

    // Dome top (half circle)
    g.fillStyle(0x332200, 1);
    g.lineStyle(1, 0xffcc00, 1);
    g.beginPath();
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI + (i / 16) * Math.PI;
      const px = x + Math.cos(a) * 3.5;
      const py = bobY - 1.5 + Math.sin(a) * 3.5;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.fillPath();
    g.strokePath();

    // Orbiting lights
    for (let i = 0; i < 3; i++) {
      const a = t * 2 + i * (Math.PI * 2 / 3);
      g.fillStyle(0xffff64, 0.5 + Math.sin(a) * 0.4);
      g.fillCircle(x + Math.cos(a) * 5, bobY + Math.sin(a) * 2.5, 0.8);
    }

    if (cargo > 1.5) {
      g.lineStyle(1, 0xffd700, 0.6);
      g.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const rx = x + Math.cos(a) * 12;
        const ry = bobY + Math.sin(a) * 5;
        if (i === 0) g.moveTo(rx, ry);
        else g.lineTo(rx, ry);
      }
      g.strokePath();
    }
  }
}
