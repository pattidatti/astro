import Phaser from 'phaser';
import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { generatePlanetTexture, drawPlanetRings } from '../objects/PlanetRenderer.js';
import Starfield from '../objects/Starfield.js';
import Station from '../objects/Station.js';
import RobotManager from '../objects/RobotManager.js';

export default class PlanetScene extends Phaser.Scene {
  constructor() {
    super('Planet');
  }

  create() {
    this.starfield = new Starfield(this);
    this.ringGraphics = this.add.graphics().setDepth(0);
    this.tetherGraphics = this.add.graphics().setDepth(1);
    this.planetImage = null;
    this.currentPlanetId = null;
    this.station = null;
    this.robotManager = new RobotManager(this);
    this.shootingStarTime = 0;
    this.shootingStarGraphics = this.add.graphics().setDepth(5);

    // Deep space glow behind planet
    this.glowGraphics = this.add.graphics().setDepth(-1);

    this.setupPlanet();

    // Listen for planet changes
    gameState.on('planetChanged', () => this.setupPlanet());
    gameState.on('planetColonized', () => this.setupPlanet());
    gameState.on('stateLoaded', () => this.setupPlanet());

    // Handle resize
    this.scale.on('resize', (gameSize) => {
      this.starfield.resize(gameSize.width, gameSize.height);
      this.setupPlanet();
    });
  }

  setupPlanet() {
    const def = gameState.activePlanetDef;
    const W = this.scale.width;
    const H = this.scale.height;
    // Planet occupies top ~48% of screen
    const sceneH = H * 0.48;
    const cx = W / 2;
    const cy = sceneH / 2;
    const R = Math.min(W, sceneH) * 0.36;

    this.planetCx = cx;
    this.planetCy = cy;
    this.planetR = R;

    // Regenerate texture if needed
    const texKey = generatePlanetTexture(this, def, R);

    // Remove old planet image
    if (this.planetImage) this.planetImage.destroy();

    this.planetImage = this.add.image(cx, cy, texKey)
      .setDisplaySize(R * 2.9, R * 2.9) // texture includes atmosphere
      .setDepth(2)
      .setInteractive(
        new Phaser.Geom.Circle(R * 1.45, R * 1.45, R),
        Phaser.Geom.Circle.Contains
      );

    // Click/tap handler
    this.planetImage.on('pointerdown', (pointer) => {
      gameState.addOre(gameState.clickPow);
      this.showClickFeedback(pointer.x, pointer.y);
    });

    // Station position
    const sx = cx + R * 1.72;
    const sy = cy - R * 0.26;
    if (this.station) this.station.destroy();
    this.station = new Station(this, sx, sy);
    this.station.setDepth(3);

    this.stationX = sx;
    this.stationY = sy;

    // Planet name label
    if (this.planetLabel) this.planetLabel.destroy();
    this.planetLabel = this.add.text(cx, sceneH - 8, def.name, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: 'rgba(0,200,255,0.4)',
      letterSpacing: 4
    }).setOrigin(0.5, 1).setDepth(10);

    this.currentPlanetId = def.id;
    this.robotManager.setup(cx, cy, R, sx, sy);
  }

  showClickFeedback(x, y) {
    // Floating number
    const text = this.add.text(x, y, `+${formatNumber(gameState.clickPow)}`, {
      fontFamily: 'Orbitron, monospace',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#80ff44',
      shadow: { offsetX: 0, offsetY: 0, color: '#80ff44', blur: 14, fill: true }
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({
      targets: text,
      y: y - 55,
      alpha: 0,
      scale: 0.8,
      duration: 900,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });

    // Ripple circle
    const ripple = this.add.circle(x, y, 12, 0x00e5ff, 0).setDepth(99);
    ripple.setStrokeStyle(2, 0x00e5ff, 1);
    this.tweens.add({
      targets: ripple,
      scaleX: 6,
      scaleY: 6,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => ripple.destroy()
    });
  }

  update(time, delta) {
    const t = time / 1000;
    this.starfield.update(delta);
    this.station.update(time, delta);
    this.robotManager.update(t, delta);

    // Draw rings (behind planet for gas/star/void)
    this.ringGraphics.clear();
    const def = gameState.activePlanetDef;
    drawPlanetRings(this.ringGraphics, def, this.planetCx, this.planetCy, this.planetR, t);

    // Draw tether beam
    this.drawTether(t);

    // Deep space glow
    this.glowGraphics.clear();
    const color = Phaser.Display.Color.HexStringToColor(def.glow);
    this.glowGraphics.fillStyle(color.color, 0.06);
    this.glowGraphics.fillCircle(this.planetCx, this.planetCy, this.planetR * 2.8);

    // Shooting star
    this.drawShootingStar(t);

    // Station bob
    this.station.y = this.stationY + Math.sin(t) * 8;
  }

  drawTether(t) {
    const g = this.tetherGraphics;
    g.clear();

    const cx = this.planetCx, cy = this.planetCy, R = this.planetR;
    const sx = this.stationX, sy = this.station.y;

    const dx = sx - cx, dy = sy - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ex = cx + (dx / len) * R;
    const ey = cy + (dy / len) * R;

    // Main beam
    g.lineStyle(2, 0x00f0ff, 0.65);
    g.beginPath();
    g.moveTo(ex, ey);
    g.lineTo(sx, sy);
    g.strokePath();

    // Glow
    g.lineStyle(7, 0x00f0ff, 0.08);
    g.beginPath();
    g.moveTo(ex, ey);
    g.lineTo(sx, sy);
    g.strokePath();
  }

  drawShootingStar(t) {
    const g = this.shootingStarGraphics;
    g.clear();

    const ss = Math.sin(t * 0.06) * Math.cos(t * 0.11);
    if (ss > 0.97) {
      const W = this.scale.width, H = this.scale.height;
      const a = (ss - 0.97) * 33;
      const ssx = W * (0.05 + ((t * 19) % 1) * 0.9);
      const ssy = H * (0.04 + ((t * 13) % 1) * 0.25);

      g.lineStyle(1.5, 0xffffff, a * 0.9);
      g.beginPath();
      g.moveTo(ssx, ssy);
      g.lineTo(ssx - 55, ssy + 20);
      g.strokePath();
    }
  }
}

function formatNumber(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
}
