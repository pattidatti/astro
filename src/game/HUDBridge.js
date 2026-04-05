import * as THREE from 'three';
import { gameState } from './GameState.js';
import { PLANETS } from './data/planets.js';
import { PlanetPanel } from './ui/PlanetPanel.js';
import { CombatHUD } from './ui/CombatHUD.js';
import { TechTreeWindow } from './ui/TechTreeWindow.js';
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
    this._combatHUD = new CombatHUD();
    this._techTree = new TechTreeWindow();
    this._panelsVisible = false;
    this._currentPlanetId = gameState.focusedPlanet;
    this._suppressNextPlanetChanged = false;
    this._militaryPanelActive = false; // true while military base panel is shown
    this._hoverBoxLastX = null;
    this._hoverBoxLastY = null;
    this._hoverBoxVisible = false; // guards classList.add/remove to avoid per-frame DOM touch
    this._fpsFrames = 0;
    this._fpsElapsed = 0;
    this._fpsLast = 0;

    this.dom = {
      upgTooltip:          document.getElementById('upg-tooltip'),
      planetTooltip:       document.getElementById('planet-tooltip'),
      hoverTargetBox:      document.getElementById('hover-target-box'),
      toastContainer:      document.getElementById('toast-container'),
      fpsCounter:          document.getElementById('fps-counter'),
    };
    this._hoveredAnyMesh = null;
    this._tmpVec = new THREE.Vector3();

    if (onMenu) {
      document.getElementById('menu-btn')?.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        onMenu();
      });
    }

    document.getElementById('research-btn')?.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      this._techTree.toggle();
    });

    this._setupPlanetHover();
    this._setupStationHover();
    this._setupColonyShipHover();
    this._setupGenericHover();
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

  _setupStationHover() {
    this.game.inputManager.onHoverStation((stationPlanetId, x, y) => {
      this._hoveredStationId = stationPlanetId;
      const tt = this.dom.planetTooltip;
      if (!stationPlanetId) {
        tt.classList.remove('visible');
        return;
      }
      const planet = PLANETS.find(p => p.id === stationPlanetId);
      const ps = gameState.getPlanetState(stationPlanetId);
      if (!planet || !ps) return;

      const { ore, energy, crystal } = ps.silos;
      const siloRows = [
        ore ? `<span>⬡ ORE — ${fmt(ore.amount)} / ${fmt(ore.capacity)}</span>` : '',
        energy ? `<span>⚡ ENERGY — ${fmt(energy.amount)} / ${fmt(energy.capacity)}</span>` : '',
        (crystal?.capacity > 0) ? `<span>◈ CRYSTAL — ${fmt(crystal.amount)} / ${fmt(crystal.capacity)}</span>` : '',
      ].filter(Boolean).join('');

      tt.innerHTML = `
        <div class="pt-name">${planet.name} Station</div>
        <div class="pt-type">ORBITAL STATION</div>
        <div class="pt-stats">${siloRows}</div>
      `;
      tt.classList.add('visible');
      tt.style.left = (x + 16) + 'px';
      tt.style.top  = (y - 10) + 'px';
    });
  }

  _setupColonyShipHover() {
    this.game.inputManager.onHoverColonyShip((planetId) => {
      // No longer needed — generic hover handles all hoverable objects
    });
  }

  _setupGenericHover() {
    this.game.inputManager.onHoverAny((mesh) => {
      this._hoveredAnyMesh = mesh;
    });
  }

  _setupEvents() {
    gameState.on('planetColonized', (id) => {
      AudioManager.play('PLANET_COLONIZED');
      this._suppressNextPlanetChanged = true; // colonize emits focusedPlanet right after — avoid double-sound
      const p = PLANETS.find(x => x.id === id);
      this.toast('🌍 COLONIZED: ' + (p ? p.name : id), 'success');
    });
    gameState.on('focusedPlanet', (id) => {
      if (this._suppressNextPlanetChanged) {
        this._suppressNextPlanetChanged = false;
      } else {
        AudioManager.play('PLANET_CHANGED');
      }
      this._currentPlanetId = id;
      this._militaryPanelActive = false; // planet focused, military panel dismissed
      // If panels are visible, update them for new planet
      if (this._panelsVisible) {
        this._planetPanel.show(id);
      }
    });
    // Suppress planet panels while military base panel is active
    gameState.on('militaryBaseClicked', () => {
      this._militaryPanelActive = true;
      if (this._panelsVisible) {
        this._panelsVisible = false;
        this._planetPanel.hide();
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
      if (toDef) this.toast(`📦 DELIVERY: ${fmt(ship.amount)} to ${toDef.name}`, 'info');
    });
    gameState.on('depositUnlocked', ({ planetId, resource, zones }) => {
      AudioManager.play('DEPOSIT_UNLOCKED');
      this.toast(`🔭 NEW DEPOSIT: ${resource.toUpperCase()} (${zones} zones)`, 'success');
    });
    gameState.on('routeAdded', () => {
      AudioManager.play('UI_ROUTE_ADD');
    });
    gameState.on('routeUpdated', () => {
      this.toast('ROUTE SAVED', 'info');
    });
    gameState.on('routeRemoved', () => {
      AudioManager.play('UI_CLICK_DENIED');
    });
    gameState.on('stateLoaded', () => {
      AudioManager.play('STATE_LOADED');
      this._currentPlanetId = gameState.focusedPlanet;
    });

    // Combat events
    gameState.on('attackStarted', ({ planetId, type }) => {
      const p = PLANETS.find(x => x.id === planetId);
      const name = p?.name || planetId;
      if (type === 'invasion') {
        this.toast(`👾 INVASION: ${name}`, 'warn', planetId);
      } else {
        this.toast(`⚔ RAID: ${name}`, 'warn', planetId);
      }
    });
    gameState.on('attackEnded', ({ planetId, reason }) => {
      if (reason === 'victory') {
        const p = PLANETS.find(x => x.id === planetId);
        this.toast(`✓ DEFENDED: ${p?.name || planetId}`, 'success');
      }
    });
    gameState.on('planetFell', (planetId) => {
      const p = PLANETS.find(x => x.id === planetId);
      this.toast(`✖ STATION LOST: ${p?.name || planetId}`, 'error');
    });
    gameState.on('defenseBuilt', ({ planetId, defenseId }) => {
      this.toast(`🛡 DEFENSE BUILT: ${defenseId.toUpperCase()}`);
    });
    gameState.on('cargoIntercepted', ({ ship }) => {
      this.toast(`⚠ CARGO LOST: ${fmt(ship.amount)} ${ship.resource.toUpperCase()}`, 'warn');
    });
    gameState.on('fleetTargetingPlayer', ({ planetId }) => {
      const p = PLANETS.find(x => x.id === planetId);
      this.toast(`🚨 ENEMY FLEET INCOMING: ${p?.name ?? planetId}`, 'warn', planetId);
    });
    gameState.on('planetRecolonized', ({ planetId }) => {
      const p = PLANETS.find(x => x.id === planetId);
      this.toast(`🌍 RECOLONIZED: ${p?.name || planetId}`, 'success');
    });
    gameState.on('siloFull', ({ planetId, resource }) => {
      const p = PLANETS.find(x => x.id === planetId);
      this.toast(`⚠ SILO FULL: ${resource.toUpperCase()} on ${p?.name || planetId}`, 'warn');
    });
    gameState.on('newTechAvailable', () => {
      // Don't toast/pulse if the player already has the tree open
      if (this._techTree._visible) return;
      document.getElementById('research-btn')?.classList.add('research-btn--pulse');
      this.toast('NEW RESEARCH AVAILABLE', 'success');
    });
    gameState.on('techUnlocked', () => {
      AudioManager.play('BASE_UPGRADED');
    });

    // Phase 3: Enemy Station events
    gameState.on('stationAwakened', ({ stationId }) => {
      const st = gameState.enemyStations?.find(s => s.id === stationId);
      const name = st?.anchorPlanet
        ? (PLANETS.find(p => p.id === st.anchorPlanet)?.name ?? stationId)
        : stationId;
      this.toast(`⚡ STATION AWAKENED: ${name}`, 'warn');
    });
    gameState.on('stationAlerted', ({ stationId }) => {
      const st = gameState.enemyStations?.find(s => s.id === stationId);
      const name = st?.anchorPlanet
        ? (PLANETS.find(p => p.id === st.anchorPlanet)?.name ?? stationId)
        : stationId;
      this.toast(`🔴 STATION ALERTED: ${name}`, 'warn');
    });
    gameState.on('distressFlare', () => {
      this.toast('🚨 DISTRESS FLARE DETECTED', 'error');
    });

    gameState.on('enemyStationDestroyed', ({ stationId }) => {
      const st = gameState.enemyStations?.find(s => s.id === stationId);
      const name = st?.anchorPlanet
        ? (PLANETS.find(p => p.id === st.anchorPlanet)?.name ?? stationId)
        : stationId.replace(/_/g, ' ').toUpperCase();
      this.toast(`✓ STATION CLEARED: ${name}`, 'success');
    });

    gameState.on('snitchDetected', () => {
      this.toast('⚠ SCOUT FLEEING', 'warn');
    });

    gameState.on('scavengerDelivered', ({ fleetId, planetId, hold }) => {
      const planet = PLANETS.find(p => p.id === planetId);
      const name = planet?.name ?? planetId;
      const total = Math.round((hold.ore ?? 0) + (hold.crystal ?? 0));
      this.toast(`♻ SCAVENGED ${total} RESOURCES → ${name}`, 'info');
    });
  }

  update(_dt) {
    // FPS counter
    this._fpsFrames++;
    this._fpsElapsed += _dt;
    if (this._fpsElapsed >= 0.5) {
      const fps = Math.round(this._fpsFrames / this._fpsElapsed);
      this._fpsFrames = 0;
      this._fpsElapsed = 0;
      if (fps !== this._fpsLast) {
        this._fpsLast = fps;
        this.dom.fpsCounter.textContent = fps + ' FPS';
      }
    }

    const camera = this.game.camera;
    const cameraController = this.game.cameraController;
    const galaxy = this.game.galaxy;

    // Generic hover target box
    if (this._hoveredAnyMesh) {
      this._hoveredAnyMesh.getWorldPosition(this._tmpVec);
      this._tmpVec.project(camera);
      const x = (this._tmpVec.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-this._tmpVec.y * 0.5 + 0.5) * window.innerHeight;
      const hx = Math.round(x), hy = Math.round(y);
      if (hx !== this._hoverBoxLastX || hy !== this._hoverBoxLastY) {
        this.dom.hoverTargetBox.style.left = hx + 'px';
        this.dom.hoverTargetBox.style.top  = hy + 'px';
        this._hoverBoxLastX = hx;
        this._hoverBoxLastY = hy;
      }
      if (!this._hoverBoxVisible) {
        this.dom.hoverTargetBox.classList.add('visible');
        this._hoverBoxVisible = true;
      }
    } else {
      if (this._hoverBoxVisible) {
        this.dom.hoverTargetBox.classList.remove('visible');
        this._hoverBoxVisible = false;
      }
    }

    // Check camera distance to focused planet to decide panel visibility
    const planetPos = galaxy.getPlanetWorldPosition(gameState.focusedPlanet);
    if (planetPos) {
      const dist = camera.position.distanceTo(planetPos);
      const shouldShow = dist < PANEL_SHOW_DISTANCE;

      if (shouldShow && !this._panelsVisible && !this._militaryPanelActive) {
        this._panelsVisible = true;
        this._planetPanel.show(gameState.focusedPlanet);
      } else if (!shouldShow && this._panelsVisible) {
        this._panelsVisible = false;
        this._planetPanel.hide();
      }

      // Update panel position to track planet Y on screen
      if (this._panelsVisible) {
        this._planetPanel.update(camera, cameraController.target);
      }
    }

    // Update combat HUD summary
    this._combatHUD.updateSummary();
  }

  toast(msg, severity = 'info', planetId = null) {
    const container = this.dom.toastContainer;
    const el = document.createElement('div');
    el.className = `toast-item toast-${severity}`;
    el.textContent = msg;

    if (planetId) {
      el.classList.add('toast-clickable');
      el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const sys = this.game.galaxy.getSystem(planetId);
        if (!sys) return;
        gameState.switchPlanet(planetId);
        this.game.cameraController.trackObject(() => sys.planetWorldPosition, 55);
      });
    }

    container.appendChild(el);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => el.classList.add('toast-visible'));

    // Remove oldest if more than 3
    while (container.children.length > 3) {
      container.firstElementChild.remove();
    }

    // Auto-remove after 3s
    setTimeout(() => {
      el.classList.remove('toast-visible');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      // Fallback removal in case transitionend doesn't fire
      setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
    }, 3000);
  }
}
