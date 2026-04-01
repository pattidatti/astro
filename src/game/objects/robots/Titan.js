import BaseRobot from './BaseRobot.js';

export default class Titan extends BaseRobot {
  get trailColor() { return 0x44ffaa; }

  draw(g, x, y, t, cargo) {
    const rumble = Math.sin(t * 8) * 0.5;

    // Left tread
    g.fillStyle(0x223322, 1);
    g.lineStyle(1, 0x44aa66, 1);
    g.fillRoundedRect(x - 9 + rumble, y - 5, 5, 10, 2);
    g.strokeRoundedRect(x - 9 + rumble, y - 5, 5, 10, 2);
    for (let i = 0; i < 4; i++) {
      g.fillStyle(0x44aa66, 1);
      g.fillRect(x - 8.5 + rumble, y - 3 + i * 2.5, 4, 1.5);
    }

    // Right tread
    g.fillStyle(0x223322, 1);
    g.lineStyle(1, 0x44aa66, 1);
    g.fillRoundedRect(x + 4 - rumble, y - 5, 5, 10, 2);
    g.strokeRoundedRect(x + 4 - rumble, y - 5, 5, 10, 2);
    for (let i = 0; i < 4; i++) {
      g.fillStyle(0x44aa66, 1);
      g.fillRect(x + 4.5 - rumble, y - 3 + i * 2.5, 4, 1.5);
    }

    // Hull glow
    g.fillStyle(0x44ffaa, 0.08 + cargo * 0.04);
    g.fillCircle(x, y, 11);

    // Main body
    g.fillStyle(0x001a0e, 1);
    g.lineStyle(1.5, 0x33cc88, 1);
    g.fillRoundedRect(x - 5, y - 6, 10, 11, 2);
    g.strokeRoundedRect(x - 5, y - 6, 10, 11, 2);

    // Turret base
    g.fillStyle(0x002211, 1);
    g.lineStyle(1.5, 0x44ffaa, 1);
    g.fillCircle(x, y - 2, 4);
    g.strokeCircle(x, y - 2, 4);

    // Cannon (rotates slowly)
    const cannonAngle = Math.sin(t * 0.5) * 0.2;
    const cannonLen = 7;
    const cx2 = x + Math.cos(cannonAngle) * cannonLen;
    const cy2 = y - 2 + Math.sin(cannonAngle) * cannonLen;
    g.fillStyle(0x44ffaa, 1);
    g.lineStyle(3, 0x44ffaa, 1);
    g.beginPath();
    g.moveTo(x, y - 2);
    g.lineTo(cx2, cy2);
    g.strokePath();

    // Scanner light
    g.fillStyle(0x64ffb4, 0.4 + Math.sin(t * 3) * 0.4);
    g.fillCircle(x, y - 2, 1.5);

    if (cargo > 1.5) {
      g.lineStyle(1.5, 0x44ffaa, 0.6);
      g.strokeCircle(x, y, 12);
    }
  }
}
