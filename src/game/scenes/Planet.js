import Phaser from 'phaser';
import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { generatePlanetTexture, drawPlanetRings } from '../objects/PlanetRenderer.js';
import Starfield from '../objects/Starfield.js';
import Station from '../objects/Station.js';
import RobotManager from '../objects/RobotManager.js';

// Layout constants for desktop panels
const LEFT_PANEL_W = 270;
const RIGHT_PANEL_W = 250;
const TOP_BAR_H = 56;
const BOTTOM_BAR_H = 64;

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
    this.transitioning = false;

    // Deep space glow behind planet
    this.glowGraphics = this.add.graphics().setDepth(-1);

    this.setupPlanet();

    // Listen for planet changes — with transition
    gameState.on('planetChanged', () => this.transitionToPlanet());
    gameState.on('planetColonized', () => this.transitionToPlanet());
    gameState.on('stateLoaded', () => this.setupPlanet());

    // Handle resize
    this.scale.on('resize', (gameSize) => {
      this.starfield.resize(gameSize.width, gameSize.height);
      this.setupPlanet();
    });
  }

  /** Calculate the visible center area between panels */
  getViewArea() {
    const W = this.scale.width;
    const H = this.scale.height;
    const left = LEFT_PANEL_W;
    const right = W - RIGHT_PANEL_W;
    const top = TOP_BAR_H;
    const bottom = H - BOTTOM_BAR_H;
    const areaW = right - left;
    const areaH = bottom - top;
    const cx = left + areaW / 2;
    const cy = top + areaH * 0.45;
    const R = Math.min(areaW, areaH) * 0.30;
    return { cx, cy, R, areaW, areaH, left, right, top, bottom };
  }

  setupPlanet() {
    const def = gameState.activePlanetDef;
    const { cx, cy, R } = this.getViewArea();

    this.planetCx = cx;
    this.planetCy = cy;
    this.planetR = R;

    // Regenerate texture if needed
    const texKey = generatePlanetTexture(this, def, R);

    // Remove old planet image
    if (this.planetImage) this.planetImage.destroy();

    this.planetImage = this.add.image(cx, cy, texKey)
      .setDisplaySize(R * 2.9, R * 2.9)
      .setDepth(2)
      .setInteractive(
        new Phaser.Geom.Circle(R * 1.45, R * 1.45, R),
        Phaser.Geom.Circle.Contains
      );

    // Click/tap handler
    this.planetImage.on('pointerdown', (pointer) => {
      if (this.transitioning) return;
      gameState.addOre(gameState.clickPow);
      this.showClickFeedback(pointer.x, pointer.y);
    });

    // Station position — right side of planet
    const sx = cx + R * 1.55;
    const sy = cy - R * 0.2;
    if (this.station) this.station.destroy();
    this.station = new Station(this, sx, sy);
    this.station.setDepth(3);

    this.stationX = sx;
    this.stationY = sy;

    // Planet name label (subtle, in the game view)
    if (this.planetLabel) this.planetLabel.destroy();
    const { bottom } = this.getViewArea();
    this.planetLabel = this.add.text(cx, bottom - 10, def.name, {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: 'rgba(200,168,78,0.3)',
      letterSpacing: 4
    }).setOrigin(0.5, 1).setDepth(10);

    this.currentPlanetId = def.id;
    this.robotManager.setup(cx, cy, R, sx, sy);
  }

  /** Smooth zoom-out → swap → zoom-in transition */
  transitionToPlanet() {
    if (this.transitioning) return;
    this.transitioning = true;

    const targets = [this.planetImage];
    if (this.station) targets.push(this.station);
    if (this.planetLabel) targets.push(this.planetLabel);

    // Hide robots during transition
    this.robotManager.bots.forEach(b => { b.setAlpha(0); });

    // Fade out + scale down
    this.tweens.add({
      targets,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
    });

    // Also fade rings and tether
    this.ringAlpha = 1;
    this.tweens.add({
      targets: this,
      ringAlpha: 0,
      duration: 500,
      ease: 'Power2',
    });

    // After fade out, set up new planet
    this.time.delayedCall(550, () => {
      this.setupPlanet();

      // Start new planet invisible and small
      const targetW = this.planetImage.displayWidth;
      const targetH = this.planetImage.displayHeight;
      this.planetImage.setDisplaySize(targetW * 0.4, targetH * 0.4);
      this.planetImage.setAlpha(0);
      if (this.station) this.station.setAlpha(0);
      if (this.planetLabel) this.planetLabel.setAlpha(0);

      // Zoom in + fade in
      this.tweens.add({
        targets: this.planetImage,
        displayWidth: targetW,
        displayHeight: targetH,
        alpha: 1,
        duration: 800,
        ease: 'Back.easeOut',
      });

      if (this.station) {
        this.tweens.add({
          targets: this.station,
          alpha: 1,
          duration: 600,
          delay: 200,
          ease: 'Power2',
        });
      }

      if (this.planetLabel) {
        this.tweens.add({
          targets: this.planetLabel,
          alpha: 1,
          duration: 600,
          delay: 300,
          ease: 'Power2',
        });
      }

      // Fade robots back in
      this.time.delayedCall(400, () => {
        this.robotManager.bots.forEach(b => {
          this.tweens.add({
            targets: b,
            alpha: 1,
            duration: 400,
            ease: 'Power2',
          });
        });
      });

      this.ringAlpha = 0;
      this.tweens.add({
        targets: this,
        ringAlpha: 1,
        duration: 800,
        delay: 200,
        ease: 'Power2',
      });

      this.time.delayedCall(900, () => {
        this.transitioning = false;
      });
    });
  }

  showClickFeedback(x, y) {
    // Floating number — gold themed
    const text = this.add.text(x, y, `+${formatNumber(gameState.clickPow)}`, {
      fontFamily: 'Orbitron, monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#e8c85e',
      shadow: { offsetX: 0, offsetY: 0, color: '#c8a84e', blur: 14, fill: true }
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

    // Ripple circle — gold
    const ripple = this.add.circle(x, y, 12, 0xc8a84e, 0).setDepth(99);
    ripple.setStrokeStyle(2, 0xc8a84e, 1);
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

    // Draw rings (with transition alpha support)
    this.ringGraphics.clear();
    const def = gameState.activePlanetDef;
    const rAlpha = this.ringAlpha !== undefined ? this.ringAlpha : 1;
    drawPlanetRings(this.ringGraphics, def, this.planetCx, this.planetCy, this.planetR, t, rAlpha);

    // Draw tether beam
    this.drawTether(t);

    // Deep space glow (layered for richer look)
    this.glowGraphics.clear();
    const color = Phaser.Display.Color.HexStringToColor(def.glow);
    this.glowGraphics.fillStyle(color.color, 0.025);
    this.glowGraphics.fillCircle(this.planetCx, this.planetCy, this.planetR * 3.5);
    this.glowGraphics.fillStyle(color.color, 0.05);
    this.glowGraphics.fillCircle(this.planetCx, this.planetCy, this.planetR * 2.2);
    this.glowGraphics.fillStyle(color.color, 0.07);
    this.glowGraphics.fillCircle(this.planetCx, this.planetCy, this.planetR * 1.5);

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

    // Main beam — golden
    g.lineStyle(2, 0xc8a84e, 0.55);
    g.beginPath();
    g.moveTo(ex, ey);
    g.lineTo(sx, sy);
    g.strokePath();

    // Glow
    g.lineStyle(7, 0xc8a84e, 0.06);
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
