import { gameState } from './GameState.js';
import { PLANETS } from './data/planets.js';
import { PlanetPanel } from './ui/PlanetPanel.js';
import { AudioManager } from './audio/AudioManager.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

// Camera distance threshold for showing planet panels
const PANEL_SHOW_DISTANCE = 80;

export class HUDBridge {
  constructor(game, { onMenu } = {}) {
    this.game = game;
    this._planetPanel = new PlanetPanel();
    this._panelsVisible = false;
    this._currentPlanetId = null;
    this._suppressNextPlanetChanged = false;

    this.dom = {
      upgTooltip:    document.getElementById('upg-tooltip'),
      planetTooltip: document.getElementById('planet-tooltip'),
      toast:         document.getElementById('toast'),
    };

    if (onMenu) {
      document.getElementById('menu-btn')?.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        onMenu();
      });
    }

    this._setupPlanetHover();
    this._setupEvents();

    // Show welcome toast
    this.toast('WELCOME, COMMANDER');

    // Per-frame update
    game.animationLoop.onUpdate((dt) => this.update(dt));
  }

  _setupPlanetHover() {
    this.game.inputManager.onHover((planetId, x, y) => {
      const tt = this.dom.planetTooltip;
      if (!planetId) {
        tt.classList.remove('visible');
        return;
      }

      const planet = PLANETS.find(p => p.id === planetId);
      if (!planet) return;
      const owned = gameState.ownedPlanets.includes(planetId);
      const isFocused = gameState.focusedPlanet === planetId;
      const ps = gameState.getPlanetState(planetId);

      let statsHtml = '';
      if (owned && ps) {
        const totalRobots = Object.values(ps.robots).reduce((s, r) => s + r.count, 0);
        const oreAmount = ps.silos.ore?.amount || 0;
        const oreCapacity = ps.silos.ore?.capacity || 0;
        statsHtml = `
          <div class="pt-stats">
            <span>ROBOTS — ${totalRobots}</span>
            <span>ORE — ${fmt(oreAmount)} / ${fmt(oreCapacity)}</span>
            <span>PLANETS — ${gameState.ownedPlanets.length}</span>
          </div>
          ${!isFocused ? '<div class="pt-type" style="margin-top:6px">Click to warp</div>' : ''}
        `;
      }

      const oreCost = planet.baseCost?.ore || 0;
      const energyCost = planet.baseCost?.energy || 0;
      let costStr = '';
      if (oreCost > 0) costStr += `⬡ ${fmt(oreCost)} ORE`;
      if (energyCost > 0) costStr += (costStr ? '  ' : '') + `⚡ ${fmt(energyCost)} ENERGY`;

      tt.innerHTML = `
        <div class="pt-name">${planet.name}</div>
        <div class="pt-type">${planet.desc}</div>
        ${planet.mb > 0 ? `<div class="pt-bonus">+${(planet.mb * 100).toFixed(0)}% extraction bonus</div>` : ''}
        ${statsHtml}
        ${!owned ? `<div class="pt-cost">${costStr || 'FREE'}</div>` : ''}
      `;
      tt.classList.add('visible');
      tt.style.left = (x + 16) + 'px';
      tt.style.top  = (y - 10) + 'px';
    });
  }

  _setupEvents() {
    gameState.on('planetColonized', (id) => {
      AudioManager.play('PLANET_COLONIZED');
      this._suppressNextPlanetChanged = true; // colonize emits focusedPlanet right after — avoid double-sound
      const p = PLANETS.find(x => x.id === id);
      this.toast('🌍 COLONIZED: ' + (p ? p.name : id));
    });
    gameState.on('focusedPlanet', (id) => {
      if (this._suppressNextPlanetChanged) {
        this._suppressNextPlanetChanged = false;
      } else {
        AudioManager.play('PLANET_CHANGED');
      }
      this._currentPlanetId = id;
      // If panels are visible, update them for new planet
      if (this._panelsVisible) {
        this._planetPanel.show(id);
      }
    });
    gameState.on('baseUpgraded', ({ planetId }) => {
      AudioManager.play('BASE_UPGRADED');
      if (planetId === this._currentPlanetId) return; // panel re-renders itself
      this.toast('⬆ BASE UPGRADED');
    });
    gameState.on('robotHired', () => {
      AudioManager.play('ROBOT_HIRED');
    });
    gameState.on('robotUpgraded', () => {
      AudioManager.play('ROBOT_UPGRADED');
    });
    gameState.on('shipLaunched', () => {
      AudioManager.play('SHIP_LAUNCHED');
    });
    gameState.on('shipArrived', (ship) => {
      AudioManager.play('SHIP_ARRIVED');
      const toDef = PLANETS.find(p => p.id === ship.toPlanet);
      if (toDef) this.toast(`📦 DELIVERY: ${fmt(ship.amount)} to ${toDef.name}`);
    });
    gameState.on('depositUnlocked', ({ planetId, resource, zones }) => {
      AudioManager.play('DEPOSIT_UNLOCKED');
      this.toast(`🔭 NEW DEPOSIT: ${resource.toUpperCase()} (${zones} zones)`);
    });
    gameState.on('routeAdded', () => {
      AudioManager.play('UI_ROUTE_ADD');
    });
    gameState.on('routeRemoved', () => {
      AudioManager.play('UI_CLICK_DENIED');
    });
    gameState.on('stateLoaded', () => {
      AudioManager.play('STATE_LOADED');
      this._currentPlanetId = gameState.focusedPlanet;
    });
  }

  update(_dt) {
    const camera = this.game.camera;
    const cameraController = this.game.cameraController;
    const galaxy = this.game.galaxy;

    // Check camera distance to focused planet to decide panel visibility
    const planetPos = galaxy.getPlanetWorldPosition(gameState.focusedPlanet);
    if (planetPos) {
      const dist = camera.position.distanceTo(planetPos);
      const shouldShow = dist < PANEL_SHOW_DISTANCE;

      if (shouldShow && !this._panelsVisible) {
        this._panelsVisible = true;
        this._planetPanel.show(gameState.focusedPlanet);
      } else if (!shouldShow && this._panelsVisible) {
        this._panelsVisible = false;
        this._planetPanel.hide();
      }

      // Update panel position to track planet Y on screen
      if (this._panelsVisible) {
        this._planetPanel.update(camera, galaxy);
      }
    }
  }

  toast(msg) {
    const el = this.dom.toast;
    el.textContent = msg;
    el.classList.add('on');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  }
}
