import Phaser from 'phaser';
import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { SYSTEM_POSITIONS, HYPERLANES, GALAXY_SIZE } from '../data/galaxyLayout.js';
import GalaxyBackground from '../objects/GalaxyBackground.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

export default class GalaxyMapScene extends Phaser.Scene {
  constructor() {
    super('GalaxyMap');
  }

  create() {
    // Background layers
    this.background = new GalaxyBackground(this);

    // Graphics layers
    this.territoryGraphics = this.add.graphics().setDepth(1);
    this.laneGraphics = this.add.graphics().setDepth(0);
    this.particleGraphics = this.add.graphics().setDepth(15);

    // System node containers
    this.systemNodes = {};
    this.systemGlows = {};
    this._createSystemNodes();

    // Draw static overlays
    this.drawHyperlanes();
    this.drawTerritories();

    // Lane particles
    this.particles = [];
    this._initParticles();

    // ── Camera setup ──
    const cam = this.cameras.main;
    cam.setBounds(0, 0, GALAXY_SIZE, GALAXY_SIZE);
    cam.setZoom(0.8);

    // Center on active planet
    const activePos = SYSTEM_POSITIONS[gameState.activePlanet];
    cam.centerOn(activePos.x, activePos.y);

    // ── Input: WASD + Arrows ──
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');

    // ── Input: Mouse wheel zoom ──
    this.input.on('wheel', (pointer, gos, dx, dy) => {
      const oldZoom = cam.zoom;
      const newZoom = Phaser.Math.Clamp(oldZoom - dy * 0.001, 0.4, 2.5);
      const worldX = pointer.worldX;
      const worldY = pointer.worldY;
      cam.zoom = newZoom;
      // Adjust scroll so point under cursor stays put
      cam.scrollX += (worldX - pointer.worldX);
      cam.scrollY += (worldY - pointer.worldY);
    });

    // ── Input: Middle/right mouse drag pan ──
    this.dragPanning = false;
    this.input.on('pointerdown', (pointer) => {
      if (pointer.button === 1 || pointer.button === 2) {
        this.dragPanning = true;
      }
    });
    this.input.on('pointermove', (pointer) => {
      if (this.dragPanning && pointer.isDown) {
        cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
        cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
      }
    });
    this.input.on('pointerup', (pointer) => {
      if (pointer.button === 1 || pointer.button === 2) {
        this.dragPanning = false;
      }
    });

    // Disable right-click context menu
    this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // ── GameState event listeners ──
    this._onColonized = () => {
      this.drawHyperlanes();
      this.drawTerritories();
      this.refreshSystemStates();
    };
    this._onChanged = () => this.refreshSystemStates();
    this._onLoaded = () => {
      this.drawHyperlanes();
      this.drawTerritories();
      this.refreshSystemStates();
    };

    gameState.on('planetColonized', this._onColonized);
    gameState.on('planetChanged', this._onChanged);
    gameState.on('stateLoaded', this._onLoaded);

    // ── Wake handler ──
    this.events.on('wake', () => {
      this.refreshSystemStates();
      this.drawHyperlanes();
      this.drawTerritories();
      const pos = SYSTEM_POSITIONS[gameState.activePlanet];
      cam.centerOn(pos.x, pos.y);
      cam.setZoom(0.8);
    });

    // Periodic affordability check
    this.affordTimer = 0;

    // Transition state
    this.isTransitioning = false;
  }

  // ── System node creation ──

  _createSystemNodes() {
    for (const planet of PLANETS) {
      const pos = SYSTEM_POSITIONS[planet.id];
      if (!pos) continue;

      const container = this.add.container(pos.x, pos.y).setDepth(5);

      // Glow circle
      const glowG = this.add.graphics();
      const glowColor = Phaser.Display.Color.HexStringToColor(planet.glow);
      glowG.fillStyle(glowColor.color, 0.06);
      glowG.fillCircle(0, 0, 60);
      glowG.fillStyle(glowColor.color, 0.1);
      glowG.fillCircle(0, 0, 30);
      container.add(glowG);
      this.systemGlows[planet.id] = glowG;

      // Planet icon — reuse cached texture
      const texKey = `planet_${planet.id}`;
      if (this.textures.exists(texKey)) {
        const icon = this.add.image(0, 0, texKey).setDisplaySize(36, 36);
        container.add(icon);
        container.planetIcon = icon;
      }

      // Ownership ring (drawn on a separate Graphics)
      const ringG = this.add.graphics();
      container.add(ringG);
      container.ringGraphics = ringG;

      // Name label
      const nameLabel = this.add.text(0, 28, planet.name, {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '10px',
        fontWeight: '700',
        color: '#c8a84e',
        letterSpacing: 2,
        align: 'center',
      }).setOrigin(0.5, 0);
      nameLabel.setShadow(0, 0, 'rgba(200,168,78,0.4)', 4, false, true);
      container.add(nameLabel);
      container.nameLabel = nameLabel;

      // Cost/bonus label
      const subLabel = this.add.text(0, 42, '', {
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '9px',
        color: '#7cb85e',
        align: 'center',
      }).setOrigin(0.5, 0);
      container.add(subLabel);
      container.subLabel = subLabel;

      // Interactive hit area
      container.setSize(80, 80);
      container.setInteractive(
        new Phaser.Geom.Circle(0, 0, 40),
        Phaser.Geom.Circle.Contains
      );

      // Hover effects
      container.on('pointerover', () => {
        if (this.isTransitioning) return;
        glowG.clear();
        glowG.fillStyle(glowColor.color, 0.12);
        glowG.fillCircle(0, 0, 70);
        glowG.fillStyle(glowColor.color, 0.2);
        glowG.fillCircle(0, 0, 35);
        if (container.planetIcon) container.planetIcon.setDisplaySize(40, 40);
        this._showSystemInfo(planet);
      });

      container.on('pointerout', () => {
        glowG.clear();
        glowG.fillStyle(glowColor.color, 0.06);
        glowG.fillCircle(0, 0, 60);
        glowG.fillStyle(glowColor.color, 0.1);
        glowG.fillCircle(0, 0, 30);
        if (container.planetIcon) container.planetIcon.setDisplaySize(36, 36);
        // Restore active planet info
        this._showSystemInfo(gameState.activePlanetDef);
      });

      // Click handler
      container.on('pointerdown', () => {
        if (this.isTransitioning) return;
        this._onSystemClick(planet.id);
      });

      // Glow pulse tween
      this.tweens.add({
        targets: glowG,
        alpha: { from: 1, to: 0.5 },
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.systemNodes[planet.id] = container;
    }

    this.refreshSystemStates();
  }

  refreshSystemStates() {
    for (const planet of PLANETS) {
      const node = this.systemNodes[planet.id];
      if (!node) continue;

      const owned = gameState.ownedPlanets.includes(planet.id);
      const isActive = gameState.activePlanet === planet.id;
      const canBuy = !owned && gameState.ore >= planet.cost;
      const locked = !owned && !canBuy;

      const ringG = node.ringGraphics;
      ringG.clear();

      if (isActive) {
        // Active: bright gold ring
        ringG.lineStyle(2, 0xe8c85e, 0.8);
        ringG.strokeCircle(0, 0, 22);
        ringG.lineStyle(1, 0xe8c85e, 0.3);
        ringG.strokeCircle(0, 0, 26);
        node.nameLabel.setColor('#e8c85e');
        node.subLabel.setText('● ACTIVE');
        node.subLabel.setColor('#c8a84e');
        if (node.planetIcon) node.planetIcon.setAlpha(1);
      } else if (owned) {
        // Owned: thin gold ring
        ringG.lineStyle(1, 0xc8a84e, 0.5);
        ringG.strokeCircle(0, 0, 22);
        node.nameLabel.setColor('#c8a84e');
        node.subLabel.setText(`+${(planet.mb * 100).toFixed(0)}%`);
        node.subLabel.setColor('#7cb85e');
        if (node.planetIcon) node.planetIcon.setAlpha(0.9);
      } else if (canBuy) {
        // Affordable: pulsing dashed look (solid thin ring)
        ringG.lineStyle(1, 0xc8a84e, 0.35);
        ringG.strokeCircle(0, 0, 22);
        node.nameLabel.setColor('#c8a84e');
        node.subLabel.setText(`⬡ ${fmt(planet.cost)}`);
        node.subLabel.setColor('#7cb85e');
        if (node.planetIcon) node.planetIcon.setAlpha(0.7);
      } else {
        // Locked
        node.nameLabel.setColor('#5a5040');
        node.subLabel.setText(`⬡ ${fmt(planet.cost)}`);
        node.subLabel.setColor('#5a5040');
        if (node.planetIcon) node.planetIcon.setAlpha(0.35);
      }
    }
  }

  _showSystemInfo(planetDef) {
    // Update the right panel info via DOM
    const pdName = document.getElementById('pd-name');
    const pdType = document.getElementById('pd-type');
    const pdBonus = document.getElementById('pd-bonus');
    if (pdName) pdName.textContent = planetDef.name;
    if (pdType) pdType.textContent = planetDef.desc;
    if (pdBonus) {
      pdBonus.textContent = planetDef.mb > 0
        ? `+${(planetDef.mb * 100).toFixed(0)}% extraction bonus`
        : 'Base extraction rate';
    }
  }

  // ── System click ──

  _onSystemClick(planetId) {
    const owned = gameState.ownedPlanets.includes(planetId);
    const planet = PLANETS.find(p => p.id === planetId);
    if (!planet) return;

    if (owned) {
      // Switch and transition to planet view
      if (gameState.activePlanet !== planetId) {
        gameState.switchPlanet(planetId);
      }
      this._transitionToPlanet(planetId);
    } else if (gameState.ore >= planet.cost) {
      // Colonize
      gameState.colonizePlanet(planetId);
      this._transitionToPlanet(planetId);
    } else {
      // Show info + toast
      this._showSystemInfo(planet);
      this._toast('INSUFFICIENT ORE — ' + fmt(planet.cost) + ' REQUIRED');
    }
  }

  _toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('on');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  }

  _transitionToPlanet(planetId) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const pos = SYSTEM_POSITIONS[planetId];
    const cam = this.cameras.main;

    // Zoom into target system
    cam.pan(pos.x, pos.y, 400, 'Power2');
    cam.zoomTo(3.0, 400, 'Power2');

    // Fade to black after zoom
    this.time.delayedCall(350, () => {
      cam.fade(300, 10, 14, 20);
    });

    // After fade complete, switch scenes
    this.time.delayedCall(700, () => {
      this.isTransitioning = false;
      cam.resetFX();

      // HUD handles the scene toggle
      const hudScene = this.scene.get('HUD');
      if (hudScene && hudScene.toggleGalaxyMap) {
        hudScene.toggleGalaxyMap(false);
      }
    });
  }

  // ── Hyperlanes ──

  drawHyperlanes() {
    const g = this.laneGraphics;
    g.clear();

    for (const [idA, idB] of HYPERLANES) {
      const posA = SYSTEM_POSITIONS[idA];
      const posB = SYSTEM_POSITIONS[idB];
      if (!posA || !posB) continue;

      const ownA = gameState.ownedPlanets.includes(idA);
      const ownB = gameState.ownedPlanets.includes(idB);

      let color, outerAlpha, midAlpha, coreAlpha;
      if (ownA && ownB) {
        color = 0xc8a84e;
        outerAlpha = 0.03;
        midAlpha = 0.08;
        coreAlpha = 0.25;
      } else if (ownA || ownB) {
        color = 0x8a7a4e;
        outerAlpha = 0.02;
        midAlpha = 0.05;
        coreAlpha = 0.15;
      } else {
        color = 0x333333;
        outerAlpha = 0.01;
        midAlpha = 0.03;
        coreAlpha = 0.08;
      }

      // Outer glow
      g.lineStyle(6, color, outerAlpha);
      g.beginPath();
      g.moveTo(posA.x, posA.y);
      g.lineTo(posB.x, posB.y);
      g.strokePath();

      // Mid glow
      g.lineStyle(3, color, midAlpha);
      g.beginPath();
      g.moveTo(posA.x, posA.y);
      g.lineTo(posB.x, posB.y);
      g.strokePath();

      // Core line
      g.lineStyle(1.2, color, coreAlpha);
      g.beginPath();
      g.moveTo(posA.x, posA.y);
      g.lineTo(posB.x, posB.y);
      g.strokePath();
    }
  }

  // ── Territories ──

  drawTerritories() {
    const g = this.territoryGraphics;
    g.clear();

    for (const planetId of gameState.ownedPlanets) {
      const pos = SYSTEM_POSITIONS[planetId];
      const planet = PLANETS.find(p => p.id === planetId);
      if (!pos || !planet) continue;

      const color = Phaser.Display.Color.HexStringToColor(planet.col);
      g.fillStyle(color.color, 0.04);
      g.fillCircle(pos.x, pos.y, 140);
      g.fillStyle(color.color, 0.06);
      g.fillCircle(pos.x, pos.y, 80);
    }
  }

  // ── Lane particles ──

  _initParticles() {
    this.particles = [];
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        laneIdx: Math.floor(Math.random() * HYPERLANES.length),
        t: Math.random(),
        speed: 0.0003 + Math.random() * 0.0004,
        alpha: 0.15 + Math.random() * 0.2,
      });
    }
  }

  _updateParticles() {
    const g = this.particleGraphics;
    g.clear();

    for (const p of this.particles) {
      const lane = HYPERLANES[p.laneIdx];
      if (!lane) continue;

      const [idA, idB] = lane;
      // Only show particles on owned connections
      const ownA = gameState.ownedPlanets.includes(idA);
      const ownB = gameState.ownedPlanets.includes(idB);
      if (!ownA && !ownB) continue;

      const posA = SYSTEM_POSITIONS[idA];
      const posB = SYSTEM_POSITIONS[idB];

      p.t += p.speed;
      if (p.t > 1) p.t -= 1;

      const x = posA.x + (posB.x - posA.x) * p.t;
      const y = posA.y + (posB.y - posA.y) * p.t;

      g.fillStyle(0xc8a84e, p.alpha);
      g.fillCircle(x, y, 1.5);
    }
  }

  // ── Update loop ──

  update(time, delta) {
    if (this.isTransitioning) return;

    const dt = delta / 1000;
    const cam = this.cameras.main;

    // WASD + Arrow panning
    const speed = 500 / cam.zoom;
    if (this.keys.W.isDown || this.keys.UP.isDown) cam.scrollY -= speed * dt;
    if (this.keys.S.isDown || this.keys.DOWN.isDown) cam.scrollY += speed * dt;
    if (this.keys.A.isDown || this.keys.LEFT.isDown) cam.scrollX -= speed * dt;
    if (this.keys.D.isDown || this.keys.RIGHT.isDown) cam.scrollX += speed * dt;

    // Periodic affordability check
    this.affordTimer += dt;
    if (this.affordTimer >= 0.5) {
      this.affordTimer = 0;
      this.refreshSystemStates();
    }

    // Zoom-dependent label visibility
    const showLabels = cam.zoom > 0.6;
    for (const planet of PLANETS) {
      const node = this.systemNodes[planet.id];
      if (!node) continue;
      if (node.nameLabel) node.nameLabel.setVisible(showLabels);
      if (node.subLabel) node.subLabel.setVisible(showLabels);
    }

    // Lane particles
    this._updateParticles();
  }

  shutdown() {
    gameState.off('planetColonized', this._onColonized);
    gameState.off('planetChanged', this._onChanged);
    gameState.off('stateLoaded', this._onLoaded);
  }
}
