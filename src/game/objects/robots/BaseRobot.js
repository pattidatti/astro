import Phaser from 'phaser';

export default class BaseRobot extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene, 0, 0);
    this.graphics = scene.add.graphics();
    this.add(this.graphics);
    scene.add.existing(this);

    this.angle_ = config.angle || Math.random() * Math.PI * 2;
    this.orbitSpeed = config.speed || (0.003 + Math.random() * 0.007) * (Math.random() < 0.5 ? 1 : -1);
    this.orbitScale = 0.82 + Math.random() * 0.12;
    this.phaseOffset = Math.random() * Math.PI * 2;
    this.timeOffset = Math.random() * 100;

    // Cargo cycle
    this.cargo = 0;
    this.returning = false;

    // Set by RobotManager
    this.planetCx = 0;
    this.planetCy = 0;
    this.planetR = 0;
    this.stationX = 0;
    this.stationY = 0;

    // Trail graphics (separate so we can draw lines to station)
    this.trailGraphics = scene.add.graphics().setDepth(1);
  }

  update(t) {
    this.angle_ += this.orbitSpeed;

    // Cargo cycle
    this.cargo += this.returning ? -0.055 : 0.055;
    if (this.cargo >= 3) this.returning = true;
    if (this.cargo <= 0) this.returning = false;

    // Orbital position
    const wobble = Math.sin(this.phaseOffset + t) * 2.5;
    this.x = this.planetCx + Math.cos(this.angle_) * (this.planetR * this.orbitScale + wobble);
    this.y = this.planetCy + Math.sin(this.angle_) * (this.planetR * this.orbitScale + wobble) * 0.73;

    // Draw cargo trail to station
    this.trailGraphics.clear();
    if (this.returning && this.cargo > 1.2) {
      this.trailGraphics.lineStyle(1.2, this.trailColor, 0.25);
      this.trailGraphics.beginPath();
      this.trailGraphics.moveTo(this.x, this.y);
      this.trailGraphics.lineTo(this.stationX, this.stationY);
      this.trailGraphics.strokePath();
    }

    // Redraw robot
    this.graphics.clear();
    this.draw(this.graphics, 0, 0, t + this.timeOffset, this.cargo);
  }

  // Override in subclasses
  get trailColor() { return 0xc8a84e; }
  draw(g, x, y, t, cargo) {}

  destroy() {
    this.trailGraphics.destroy();
    super.destroy();
  }
}
