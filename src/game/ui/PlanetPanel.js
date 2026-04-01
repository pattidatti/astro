import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES } from '../data/upgrades.js';
import { createRoute, SHIPPABLE_RESOURCES } from '../data/routes.js';
import * as THREE from 'three';
import { AudioManager } from '../audio/AudioManager.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

const RESOURCE_ICONS = { ore: '⬡', energy: '⚡', crystal: '◈' };
const RESOURCE_LABELS = { ore: 'ORE', energy: 'ENERGY', crystal: 'CRYSTAL' };
const ROBOT_ICONS = { miner: '⛏', energyBot: '🔋', builder: '🔧', scout: '📡' };
const ROBOT_NAMES = { miner: 'MINER', energyBot: 'ENERGY', builder: 'BUILDER', scout: 'SCOUT' };

const _ndc = new THREE.Vector3();

export class PlanetPanel {
  constructor() {
    this._leftEl  = document.getElementById('panel-left');
    this._rightEl = document.getElementById('panel-right');
    this._visible = false;
    this._planetId = null;
    this._renderTimer = 0;

    // Close button
    document.getElementById('panel-close')?.addEventListener('pointerdown', () => {
      this.hide();
    });

    // Listen for relevant state changes to trigger re-render
    const rerender = () => { if (this._visible) this._renderAll(); };
    gameState.on('baseUpgraded',     rerender);
    gameState.on('robotHired',       rerender);
    gameState.on('robotUpgraded',    rerender);
    gameState.on('routeAdded',       rerender);
    gameState.on('routeRemoved',     rerender);
    gameState.on('depositUnlocked',  rerender);
    gameState.on('productionTick',   () => { if (this._visible) this._renderSilos(); });
  }

  /** Show panels for a given planet */
  show(planetId) {
    this._planetId = planetId;
    this._visible = true;
    this._renderAll();
    this._leftEl.classList.add('visible');
    this._rightEl.classList.add('visible');
  }

  /** Hide panels */
  hide() {
    this._visible = false;
    this._planetId = null;
    this._leftEl.classList.remove('visible');
    this._rightEl.classList.remove('visible');
  }

  /** Call each frame to reposition panels to match planet's screen Y */
  update(camera, galaxy) {
    if (!this._visible || !this._planetId) return;

    const worldPos = galaxy.getPlanetWorldPosition(this._planetId);
    if (!worldPos) return;

    _ndc.copy(worldPos).project(camera);
    // Only reposition if planet is reasonably on screen
    if (_ndc.z > 1.0) return;

    const screenY = (-_ndc.y * 0.5 + 0.5) * window.innerHeight;
    const clampedY = Math.max(120, Math.min(window.innerHeight - 120, screenY));
    const topPx = clampedY + 'px';

    this._leftEl.style.top  = topPx;
    this._rightEl.style.top = topPx;
  }

  // ─── Internal render ──────────────────────────────────────────────────────

  _renderAll() {
    const ps = gameState.getPlanetState(this._planetId);
    const def = PLANETS.find(p => p.id === this._planetId);
    if (!def) return;

    // Update header
    const nameEl = this._leftEl.querySelector('.panel-planet-name');
    if (nameEl) nameEl.textContent = def.name + ' BASE';

    this._renderBase(ps, def);
    this._renderSilos();
    this._renderRoutes();
    this._renderHire(ps, def);
    this._renderActiveRobots(ps);
    this._renderRobotUpgrades(ps);
  }

  _renderBase(ps, def) {
    const el = document.getElementById('panel-base');
    if (!el) return;

    if (!ps || !ps.hasBase) {
      // Show build base button
      const { ore: oreCost, energy: energyCost } = def.baseCost;
      const canAfford = gameState.siloHas(this._planetId, 'ore', oreCost) &&
                        gameState.siloHas(this._planetId, 'energy', energyCost);

      // For colonies (other planets), the base is built via colony ship
      // Xerion starts with base built
      el.innerHTML = `
        <div class="panel-section-title">SPACE BASE</div>
        <div style="font-size:11px;color:var(--dune-text-dim);text-align:center;padding:8px 0">
          Send colony ship to establish base
        </div>
      `;
      return;
    }

    // Show upgrade grid
    el.innerHTML = `<div class="panel-section-title">BASE UPGRADES</div>`;
    const grid = document.createElement('div');
    grid.className = 'base-upg-grid';

    for (const upg of BASE_UPGRADES) {
      const lv = ps.baseLevels[upg.effect] ?? 0;
      const maxed = lv >= upg.maxLevel;
      const cost = maxed ? null : { energy: upg.energyCost[lv] };
      const canAfford = cost && gameState.siloHas(this._planetId, 'energy', cost.energy);

      const btn = document.createElement('button');
      btn.className = 'base-upg-btn' + (maxed ? ' maxed' : '');
      btn.disabled = maxed || !canAfford;
      btn.innerHTML = `
        <span class="base-upg-icon">${upg.icon}</span>
        <span class="base-upg-name">${upg.name}</span>
        <span class="base-upg-level">${maxed ? 'MAX' : `LV ${lv}/${upg.maxLevel}`}</span>
        ${!maxed ? `<span class="base-upg-cost ${canAfford ? '' : 'cant'}">⚡ ${fmt(upg.energyCost[lv])}</span>` : ''}
      `;

      if (!maxed && canAfford) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK');
          gameState.buyBaseUpgrade(this._planetId, upg.id);
        });
      } else if (!maxed) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK_DENIED');
        });
      }
      grid.appendChild(btn);
    }

    el.appendChild(grid);
  }

  _renderSilos() {
    const el = document.getElementById('panel-silos');
    if (!el) return;

    const ps = gameState.getPlanetState(this._planetId);
    if (!ps) return;

    el.innerHTML = `<div class="panel-section-title">SILOS</div>`;

    for (const resource of ['ore', 'energy', 'crystal']) {
      const silo = ps.silos[resource];
      if (!silo || silo.capacity === 0) continue;

      const pct = silo.capacity > 0 ? (silo.amount / silo.capacity) * 100 : 0;
      const full = pct >= 99.5;

      const row = document.createElement('div');
      row.className = 'silo-bar-row';
      row.innerHTML = `
        <span class="silo-label">${RESOURCE_LABELS[resource]}</span>
        <div class="silo-track">
          <div class="silo-fill ${resource}${full ? ' full' : ''}" style="width:${pct.toFixed(1)}%"></div>
        </div>
        <span class="silo-amount">${fmt(silo.amount)}/${fmt(silo.capacity)}</span>
      `;
      el.appendChild(row);
    }
  }

  _renderRoutes() {
    const el = document.getElementById('panel-routes');
    if (!el) return;

    const myRoutes = gameState.routes.filter(r => r.fromPlanet === this._planetId);

    el.innerHTML = `<div class="panel-section-title">SHIP ROUTES</div>`;

    for (const route of myRoutes) {
      const toDef = PLANETS.find(p => p.id === route.toPlanet);
      const row = document.createElement('div');
      row.className = 'route-item';
      row.innerHTML = `
        <div class="route-status ${route.active ? '' : 'inactive'}"></div>
        <div class="route-from-to">${toDef?.name || route.toPlanet}</div>
        <div class="route-resource">${RESOURCE_ICONS[route.resource]} ${fmt(route.amount)}</div>
        <button class="route-delete" title="Remove route">✕</button>
      `;
      row.querySelector('.route-delete').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        gameState.removeRoute(route.id); // routeRemoved event in HUDBridge plays the sound
      });
      el.appendChild(row);
    }

    // Add route button (opens inline form)
    const addBtn = document.createElement('button');
    addBtn.className = 'add-route-btn';
    addBtn.textContent = '+ ADD ROUTE';
    addBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      this._showAddRouteForm(el, addBtn);
    });
    el.appendChild(addBtn);
  }

  _showAddRouteForm(container, addBtn) {
    addBtn.style.display = 'none';

    const form = document.createElement('div');
    form.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:8px;';

    const ownedExcludingSelf = gameState.ownedPlanets.filter(id => id !== this._planetId);
    if (ownedExcludingSelf.length === 0) {
      form.innerHTML = '<div style="font-size:10px;color:var(--dune-text-dim)">No other planets owned</div>';
      container.appendChild(form);
      return;
    }

    const ps = gameState.getPlanetState(this._planetId);
    const availableResources = ps ? Object.keys(ps.silos).filter(r => ps.silos[r].capacity > 0) : ['ore'];

    form.innerHTML = `
      <select class="route-select" id="rf-to" style="background:#0a0c10;color:var(--dune-sand);border:1px solid var(--dune-border);padding:4px;font-size:11px;border-radius:3px">
        ${ownedExcludingSelf.map(id => {
          const def = PLANETS.find(p => p.id === id);
          return `<option value="${id}">${def?.name || id}</option>`;
        }).join('')}
      </select>
      <select class="route-select" id="rf-res" style="background:#0a0c10;color:var(--dune-sand);border:1px solid var(--dune-border);padding:4px;font-size:11px;border-radius:3px">
        ${availableResources.map(r => `<option value="${r}">${RESOURCE_LABELS[r]}</option>`).join('')}
      </select>
      <input id="rf-amt" type="number" value="100" min="1" placeholder="Amount" style="background:#0a0c10;color:var(--dune-sand);border:1px solid var(--dune-border);padding:4px;font-size:11px;border-radius:3px">
      <input id="rf-int" type="number" value="5" min="1" placeholder="Interval (min)" style="background:#0a0c10;color:var(--dune-sand);border:1px solid var(--dune-border);padding:4px;font-size:11px;border-radius:3px">
      <div style="display:flex;gap:6px">
        <button id="rf-confirm" style="flex:1;padding:6px;background:rgba(212,168,67,0.1);border:1px solid var(--dune-border-bright);color:var(--dune-gold);font-size:10px;border-radius:3px;cursor:pointer">CONFIRM</button>
        <button id="rf-cancel" style="flex:1;padding:6px;background:transparent;border:1px solid var(--dune-border);color:var(--dune-text-dim);font-size:10px;border-radius:3px;cursor:pointer">CANCEL</button>
      </div>
    `;
    container.appendChild(form);

    form.querySelector('#rf-confirm').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const to       = form.querySelector('#rf-to').value;
      const resource = form.querySelector('#rf-res').value;
      const amount   = parseFloat(form.querySelector('#rf-amt').value) || 100;
      const interval = parseFloat(form.querySelector('#rf-int').value) || 5;
      const route = createRoute(this._planetId, to, resource, amount, interval);
      gameState.addRoute(route);
    });
    form.querySelector('#rf-cancel').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      form.remove();
      addBtn.style.display = '';
    });
  }

  _renderHire(ps, def) {
    const el = document.getElementById('panel-robots-hire');
    if (!el) return;

    el.innerHTML = `<div class="panel-section-title">HIRE ROBOTS</div>`;

    if (!ps || !ps.hasBase) {
      el.innerHTML += '<div style="font-size:10px;color:var(--dune-text-dim);text-align:center">Build base first</div>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'hire-grid';

    for (const action of ROBOT_ACTIONS) {
      const robotType = action.type;
      const robot = ps.robots[robotType];
      const energyCost = action.energyCostFn(ps);
      const canAfford = gameState.siloHas(this._planetId, 'energy', energyCost);

      const btn = document.createElement('button');
      btn.className = 'hire-btn' + (robotType === 'miner' ? ' hire-miner-btn' : '') + (robotType === 'energyBot' ? ' hire-energy-btn' : '');
      btn.disabled = !canAfford;
      btn.innerHTML = `
        <span class="hire-btn-icon">${action.icon}</span>
        <span class="hire-btn-name">${action.name}</span>
        <span class="hire-btn-count">${robot.count}</span>
        <span class="hire-btn-cost ${canAfford ? '' : 'cant'}">⚡ ${fmt(energyCost)}</span>
      `;

      if (canAfford) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK');
          gameState.hireRobot(this._planetId, robotType);
        });
      } else {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK_DENIED');
        });
      }
      grid.appendChild(btn);
    }

    el.appendChild(grid);
  }

  _renderActiveRobots(ps) {
    const el = document.getElementById('panel-robots-active');
    if (!el) return;

    if (!ps || !ps.hasBase) { el.innerHTML = ''; return; }

    const totalRobots = Object.values(ps.robots).reduce((s, r) => s + r.count, 0);
    if (totalRobots === 0) { el.innerHTML = ''; return; }

    el.innerHTML = `<div class="panel-section-title">ACTIVE ROBOTS</div>`;

    for (const [type, robot] of Object.entries(ps.robots)) {
      if (robot.count === 0) continue;
      const row = document.createElement('div');
      row.className = 'robot-row';
      row.innerHTML = `
        <span class="robot-row-icon">${ROBOT_ICONS[type]}</span>
        <span class="robot-row-name">${ROBOT_NAMES[type]}</span>
        <span class="robot-row-count">${robot.count}</span>
      `;
      el.appendChild(row);
    }
  }

  _renderRobotUpgrades(ps) {
    const el = document.getElementById('panel-robots-upgrades');
    if (!el) return;

    if (!ps || !ps.hasBase) { el.innerHTML = ''; return; }

    // Only show upgrades for robot types that have at least 1 robot
    const relevantUpgrades = ROBOT_UPGRADES.filter(upg => ps.robots[upg.robotType]?.count > 0);
    if (relevantUpgrades.length === 0) { el.innerHTML = ''; return; }

    el.innerHTML = `<div class="panel-section-title">BOT UPGRADES</div>`;

    for (const upg of relevantUpgrades) {
      const robot = ps.robots[upg.robotType];
      const lv = robot[upg.effect] ?? 0;
      const maxed = lv >= upg.maxLevel;
      const cost = maxed ? null : { energy: upg.energyCost[lv] };
      const canAfford = cost && gameState.siloHas(this._planetId, 'energy', cost.energy);

      const row = document.createElement('div');
      row.className = 'robot-upg-row';
      row.innerHTML = `
        <span class="robot-upg-name">${upg.name}</span>
        <span class="robot-upg-level">${maxed ? 'MAX' : `${lv}/${upg.maxLevel}`}</span>
      `;

      const btn = document.createElement('button');
      btn.className = 'robot-upg-btn';
      btn.disabled = maxed || !canAfford;
      btn.textContent = maxed ? '✓' : (cost ? `⚡${fmt(cost.energy)}` : '');

      if (!maxed && canAfford) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK');
          gameState.buyRobotUpgrade(this._planetId, upg.id);
        });
      } else if (!maxed) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK_DENIED');
        });
      }
      row.appendChild(btn);
      el.appendChild(row);
    }
  }
}
