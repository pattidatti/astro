import { gameState, colonyLaunchEnergyCost, colonyTravelDuration } from '../GameState.js';
import { PLANETS } from '../data/planets.js';
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from '../data/upgrades.js';
import { createRoute, SHIPPABLE_RESOURCES } from '../data/routes.js';
import { DefensePanel } from './DefensePanel.js';
import * as THREE from 'three';
import { AudioManager } from '../audio/AudioManager.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

const BASE_ORE_RATE = 0.5;
const BASE_ENERGY_RATE = 0.4;
const BASE_CRYSTAL_RATE = 0.2;
const _passiveUpg = BASE_UPGRADES.find(u => u.id === 'base_passive');
const _passiveRates = _passiveUpg?.passiveRate || [2, 8, 30];

const RESOURCE_ICONS = { ore: '⬡', energy: '⚡', crystal: '◈' };
const RESOURCE_LABELS = { ore: 'ORE', energy: 'ENERGY', crystal: 'CRYSTAL' };
const ROBOT_ICONS = { miner: '⛏', energyBot: '🔋', builder: '🔧', scout: '📡' };
const ROBOT_NAMES = { miner: 'MINER', energyBot: 'ENERGY', builder: 'BUILDER', scout: 'SCOUT' };

/** Flash a button green + show a floating cost label that drifts upward. */
function flashButton(btn, successClass, costText) {
  btn.classList.add(successClass);
  btn.addEventListener('animationend', () => btn.classList.remove(successClass), { once: true });

  if (costText) {
    const span = document.createElement('span');
    span.className = 'floating-cost';
    span.textContent = costText;
    // Position relative to the button
    const rect = btn.getBoundingClientRect();
    span.style.left = rect.left + rect.width / 2 + 'px';
    span.style.top  = rect.top + 'px';
    span.style.position = 'fixed';
    document.body.appendChild(span);
    span.addEventListener('animationend', () => span.remove(), { once: true });
  }
}

const _ndc = new THREE.Vector3();

export class PlanetPanel {
  constructor() {
    this._leftEl  = document.getElementById('panel-left');
    this._rightEl = document.getElementById('panel-right');
    this._visible = false;
    this._planetId = null;
    this._renderTimer = 0;
    this._tooltipEl = document.getElementById('upg-tooltip');
    this._prevSiloAmounts = {}; // track previous amounts for drain flash

    this._colonyPopupEl = document.getElementById('colony-ship-popup');
    this._colonyPopupVisible = false;
    this._defensePanel = new DefensePanel();

    // Close button
    document.getElementById('panel-close')?.addEventListener('pointerdown', () => {
      this.hide();
    });

    // Colony ship click: show target popup
    gameState.on('colonyShipClicked', ({ planetId }) => {
      if (this._planetId === planetId) {
        this._showColonyShipPopup(planetId);
      }
    });

    // Hide popup on launch
    gameState.on('colonyShipLaunched', () => this._hideColonyShipPopup());

    // Listen for relevant state changes to trigger re-render
    const rerender = () => { if (this._visible) this._renderAll(); };
    gameState.on('baseBuilt',          rerender);
    gameState.on('baseUpgraded',       rerender);
    gameState.on('robotHired',         rerender);
    gameState.on('robotUpgraded',      rerender);
    gameState.on('routeAdded',         rerender);
    gameState.on('routeRemoved',       rerender);
    gameState.on('depositUnlocked',    rerender);
    gameState.on('colonyShipQueued',   rerender);
    gameState.on('colonyShipBuilt',    rerender);
    gameState.on('defenseBuilt',       rerender);
    gameState.on('defenseUpgraded',    rerender);
    gameState.on('attackStarted',      rerender);
    gameState.on('attackEnded',        rerender);
    gameState.on('abilityActivated',   rerender);
    gameState.on('planetFell',         rerender);
    gameState.on('planetRecolonized',  rerender);
    gameState.on('colonyShipLaunched', rerender);
    gameState.on('productionTick', () => {
      if (!this._visible) return;
      this._renderSilos();
      this._updateColonyShipProgress();
      const now = performance.now();
      if (now - this._renderTimer > 1000) {
        this._renderTimer = now;
        const ps = gameState.getPlanetState(this._planetId);
        const def = PLANETS.find(p => p.id === this._planetId);
        if (ps && def) {
          this._renderBase(ps, def);
          this._renderHire(ps, def);
          this._renderRobotUpgrades(ps);
        }
      }
    });
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
    this._hideColonyShipPopup();
  }

  /** Call each frame to reposition panels to match the camera's look-at target screen Y */
  update(camera, anchorPos) {
    if (!this._visible || !this._planetId || !anchorPos) return;

    _ndc.copy(anchorPos).project(camera);
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
    this._renderColonyShip(ps, def);
    this._renderSilos();
    this._renderRoutes();
    this._renderHire(ps, def);
    this._renderActiveRobots(ps);
    this._renderRobotUpgrades(ps);
    this._renderDefenses();
  }

  _renderBase(ps, def) {
    const el = document.getElementById('panel-base');
    if (!el) return;

    if (!ps || !ps.hasBase) {
      const isOwned = gameState.ownedPlanets.includes(this._planetId);
      const isFallen = ps?.combat?.fallen;

      // Fallen planet — show recolonize UI
      if (isOwned && isFallen) {
        const recolCostMult = 0.5;
        const oreCost = Math.floor((def.baseCost.ore || 0) * recolCostMult);
        const energyCost = Math.floor((def.baseCost.energy || 0) * recolCostMult);

        // Find a source planet to pay from
        const sourcePlanets = gameState.ownedPlanets.filter(pid => {
          if (pid === this._planetId) return false;
          const sps = gameState.getPlanetState(pid);
          return sps?.hasBase;
        });

        el.innerHTML = `
          <div class="panel-section-title">⚠ STATION DESTROYED</div>
          <div style="color:var(--dune-red);font-size:11px;margin:6px 0">
            This station has fallen. Some infrastructure survived.
          </div>
          <div style="font-size:10px;color:var(--dune-text-dim);margin-bottom:8px">
            Base levels and deposits preserved. Defenses lost. Robots reduced.
          </div>
        `;

        if (sourcePlanets.length > 0) {
          let costStr = '';
          if (oreCost > 0) costStr += `⬡ ${fmt(oreCost)} ORE`;
          if (energyCost > 0) costStr += (costStr ? '  ' : '') + `⚡ ${fmt(energyCost)} ENERGY`;

          for (const srcId of sourcePlanets) {
            const srcDef = PLANETS.find(p => p.id === srcId);
            const canAfford = (oreCost <= 0 || gameState.siloHas(srcId, 'ore', oreCost)) &&
                              (energyCost <= 0 || gameState.siloHas(srcId, 'energy', energyCost));
            const btn = document.createElement('button');
            btn.className = 'build-base-btn' + (canAfford ? '' : ' cant-afford');
            btn.disabled = !canAfford;
            btn.innerHTML = `
              <span>🔄 RECOLONIZE from ${srcDef?.name || srcId}</span>
              ${costStr ? `<span class="base-upg-cost ${canAfford ? '' : 'cant'}">${costStr}</span>` : '<span style="font-size:10px;color:var(--dune-text-dim)">FREE</span>'}
            `;
            if (canAfford) {
              btn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                AudioManager.play('UI_CLICK');
                gameState.recolonize(srcId, this._planetId);
              });
            }
            el.appendChild(btn);
          }
        } else {
          el.innerHTML += '<div style="color:var(--dune-text-dim);font-size:10px">No owned planets available for recolonization.</div>';
        }
        return;
      }

      const { ore: oreCost = 0, energy: energyCost = 0 } = def.baseCost;
      const canAfford = gameState.siloHas(this._planetId, 'ore', oreCost) &&
                        gameState.siloHas(this._planetId, 'energy', energyCost);

      if (isOwned) {
        // Show clickable build base button
        let costStr = '';
        if (oreCost > 0) costStr += `⬡ ${fmt(oreCost)} ORE`;
        if (energyCost > 0) costStr += (costStr ? '  ' : '') + `⚡ ${fmt(energyCost)} ENERGY`;

        el.innerHTML = `<div class="panel-section-title">SPACE BASE</div>`;
        const btn = document.createElement('button');
        btn.className = 'build-base-btn' + (canAfford ? '' : ' cant-afford');
        btn.disabled = !canAfford;
        btn.innerHTML = `
          <span>🏗 BUILD BASE</span>
          ${costStr ? `<span class="base-upg-cost ${canAfford ? '' : 'cant'}">${costStr}</span>` : '<span style="font-size:10px;color:var(--dune-text-dim)">FREE</span>'}
        `;
        if (canAfford) {
          btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            AudioManager.play('UI_CLICK');
            gameState.buildBase(this._planetId);
          });
        } else {
          btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            AudioManager.play('UI_CLICK_DENIED');
          });
        }
        el.appendChild(btn);
      } else {
        el.innerHTML = `
          <div class="panel-section-title">SPACE BASE</div>
          <div style="font-size:11px;color:var(--dune-text-dim);text-align:center;padding:8px 0">
            Send colony ship to establish base
          </div>
        `;
      }
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
          const ok = gameState.buyBaseUpgrade(this._planetId, upg.id);
          if (ok) flashButton(btn, 'base-upg-btn--success', `-${fmt(upg.energyCost[lv])} ⚡`);
        });
      } else if (!maxed) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK_DENIED');
        });
      }

      btn.addEventListener('mouseenter', () => {
        let effectLine = '';
        if (!maxed) {
          if (upg.effect === 'storage')        effectLine = `→ +${fmt(upg.capacityBonus[lv])} capacity`;
          else if (upg.effect === 'passiveEnergy') effectLine = `→ ${upg.passiveRate[lv]} energy/s passive`;
          else if (upg.effect === 'shipSpeed')     effectLine = `→ +20% ship speed`;
          else if (upg.effect === 'shipSlots')     effectLine = `→ +1 docking slot`;
        }
        this._showTooltip(btn, `
          <div class="utt-name">${upg.name}</div>
          <div class="utt-level">${maxed ? 'MAXED OUT' : `LV ${lv} / ${upg.maxLevel}`}</div>
          <div class="utt-desc">${upg.desc}</div>
          ${!maxed ? `<div class="utt-cost">⚡ ${fmt(upg.energyCost[lv])}  ${effectLine}</div>` : ''}
        `);
      });
      btn.addEventListener('mouseleave', () => this._hideTooltip());

      grid.appendChild(btn);
    }

    el.appendChild(grid);
  }

  _computeRate(planetId, resource) {
    const ps = gameState.getPlanetState(planetId);
    if (!ps) return 0;
    const def = PLANETS.find(p => p.id === planetId);
    if (!def) return 0;

    if (resource === 'ore') {
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      if (count === 0) return 0;
      const oreZones = ps.deposits.ore.unlocked;
      return count * BASE_ORE_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
             * def.planetMult.ore * Math.max(1, oreZones);
    }
    if (resource === 'energy') {
      let rate = 0;
      const { count, speedLevel, loadLevel } = ps.robots.energyBot;
      if (count > 0) {
        const energyZones = ps.deposits.energy.unlocked;
        rate += count * BASE_ENERGY_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
                * def.planetMult.energy * Math.max(1, energyZones);
      }
      const passiveLv = ps.baseLevels.passiveEnergy;
      if (passiveLv > 0) rate += _passiveRates[passiveLv - 1] || 0;
      return rate;
    }
    if (resource === 'crystal') {
      const crystalZones = ps.deposits.crystal.unlocked;
      if (crystalZones === 0) return 0;
      const { count, speedLevel, loadLevel } = ps.robots.miner;
      if (count === 0) return 0;
      return count * BASE_CRYSTAL_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel)
             * def.planetMult.crystal * crystalZones;
    }
    return 0;
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
      const warning = pct > 90 && !full;
      const prevKey = this._planetId + '_' + resource;
      const prev = this._prevSiloAmounts[prevKey];
      const drained = prev !== undefined && silo.amount < prev - 1;
      this._prevSiloAmounts[prevKey] = silo.amount;

      const rate = this._computeRate(this._planetId, resource);
      const rateStr = rate > 0 ? `+${rate >= 10 ? fmt(rate) : rate.toFixed(1)}/s` : '';

      const fillClass = `silo-fill ${resource}${full ? ' full' : ''}${warning ? ' warning' : ''}`;

      const row = document.createElement('div');
      row.className = 'silo-bar-row';
      row.innerHTML = `
        <span class="silo-label">${RESOURCE_LABELS[resource]}</span>
        <div class="silo-track${drained ? ' silo-track--drain' : ''}">
          <div class="${fillClass}" style="width:${pct.toFixed(1)}%"></div>
        </div>
        <span class="silo-amount">${fmt(silo.amount)}/${fmt(silo.capacity)}</span>
        ${full ? '<span class="silo-full-badge">FULL</span>' : ''}
        ${rateStr ? `<span class="silo-rate ${resource}">${rateStr}</span>` : ''}
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
          const ok = gameState.hireRobot(this._planetId, robotType);
          if (ok) flashButton(btn, 'hire-btn--success', `-${fmt(energyCost)} ⚡`);
        });
      } else {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK_DENIED');
        });
      }

      btn.addEventListener('mouseenter', () => {
        this._showTooltip(btn, `
          <div class="utt-name">${action.name}</div>
          <div class="utt-desc">${action.desc}</div>
          <div class="utt-cost">⚡ ${fmt(energyCost)} ENERGY</div>
        `);
      });
      btn.addEventListener('mouseleave', () => this._hideTooltip());

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
      const spdLv  = robot.speedLevel ?? 0;
      const loadLv = robot.loadLevel  ?? 0;
      const statsHtml = (spdLv > 0 || loadLv > 0)
        ? `<span class="robot-row-stats">${spdLv > 0 ? `💨${spdLv}` : ''}${loadLv > 0 ? ` 📦${loadLv}` : ''}</span>`
        : '';
      const row = document.createElement('div');
      row.className = 'robot-row';
      row.innerHTML = `
        <span class="robot-row-icon">${ROBOT_ICONS[type]}</span>
        <span class="robot-row-name">${ROBOT_NAMES[type]}</span>
        <span class="robot-row-count">${robot.count}</span>
        ${statsHtml}
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

      const isSpeed = upg.effect === 'speedLevel';
      const effectTag = isSpeed ? '+SPD' : '+LOAD';
      const getMult = isSpeed ? getSpeedMult : getLoadMult;
      const pctPerLevel = isSpeed ? 20 : 30;

      const row = document.createElement('div');
      row.className = 'robot-upg-row';
      row.innerHTML = `
        <span class="robot-upg-name">${upg.name}<span class="upg-effect-tag">${effectTag}</span></span>
        <span class="robot-upg-level">${maxed ? 'MAX' : `${lv}/${upg.maxLevel}`}</span>
      `;

      row.addEventListener('mouseenter', () => {
        const curMult = getMult(lv);
        const nextMult = !maxed ? getMult(lv + 1) : null;
        this._showTooltip(row, `
          <div class="utt-name">${upg.name}</div>
          <div class="utt-level">${maxed ? 'MAXED OUT' : `LV ${lv} / ${upg.maxLevel}`}</div>
          <div class="utt-desc">${isSpeed ? 'Increases movement speed' : 'Increases cargo capacity'} (+${pctPerLevel}% per level)</div>
          <div class="utt-cost">${lv > 0 ? `Current: ×${curMult.toFixed(1)}` : 'No bonus yet'}${!maxed ? `  →  Next: ×${nextMult.toFixed(1)}` : ''}</div>
        `);
      });
      row.addEventListener('mouseleave', () => this._hideTooltip());

      const btn = document.createElement('button');
      btn.className = 'robot-upg-btn';
      btn.disabled = maxed || !canAfford;
      btn.textContent = maxed ? '✓' : (cost ? `⚡${fmt(cost.energy)}` : '');

      if (!maxed && canAfford) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK');
          const ok = gameState.buyRobotUpgrade(this._planetId, upg.id);
          if (ok) flashButton(btn, 'robot-upg-btn--success', `-${fmt(cost.energy)} ⚡`);
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

  // ─── Defense panel ────────────────────────────────────────────────────────

  _renderDefenses() {
    let el = document.getElementById('panel-defenses');
    if (!el) {
      // Create defense container in right panel if it doesn't exist
      el = document.createElement('div');
      el.id = 'panel-defenses';
      this._rightEl.appendChild(el);
    }
    if (this._planetId) {
      this._defensePanel.render(el, this._planetId);
    }
  }

  // ─── Colony ship ──────────────────────────────────────────────────────────

  _renderColonyShip(ps, def) {
    const el = document.getElementById('panel-colony-ship');
    if (!el) return;

    // No base = no colony ship option
    if (!ps || !ps.hasBase) { el.innerHTML = ''; return; }

    const buildQueue = ps.colonyShipBuildQueue || [];
    const inOrbit = gameState.colonyShipsInOrbit.some(s => s.fromPlanetId === this._planetId);

    // Building in progress
    if (buildQueue.length > 0) {
      const pct = Math.min(100, (buildQueue[0].progress / 20) * 100);
      el.innerHTML = `
        <div class="panel-section-title">COLONY SHIP</div>
        <div class="colony-ship-progress">
          <div class="colony-ship-progress-fill" style="width:${pct.toFixed(1)}%"></div>
          <div class="colony-ship-progress-label">BUILDING... ${Math.floor(pct)}%</div>
        </div>
      `;
      return;
    }

    // Ship in orbit — ready to launch
    if (inOrbit) {
      el.innerHTML = `
        <div class="panel-section-title">COLONY SHIP</div>
        <div class="colony-ship-status">🚀 READY — CLICK SHIP IN ORBIT</div>
      `;
      return;
    }

    // Default: build button
    const oreCost = 300;
    const canAfford = gameState.siloHas(this._planetId, 'ore', oreCost);

    el.innerHTML = `<div class="panel-section-title">COLONY SHIP</div>`;
    const btn = document.createElement('button');
    btn.className = 'colony-ship-btn';
    btn.disabled = !canAfford;
    btn.innerHTML = `
      <span>🚀 BUILD COLONY SHIP</span>
      <span class="cs-cost ${canAfford ? '' : 'cant'}">⬡ ${fmt(oreCost)} ORE</span>
    `;

    if (canAfford) {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        gameState.queueColonyShipBuild(this._planetId);
      });
    } else {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK_DENIED');
      });
    }
    el.appendChild(btn);
  }

  /** Update colony ship build progress bar each frame */
  _updateColonyShipProgress() {
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps) return;
    const queue = ps.colonyShipBuildQueue;
    if (!queue || queue.length === 0) return;
    const fill = document.querySelector('#panel-colony-ship .colony-ship-progress-fill');
    const label = document.querySelector('#panel-colony-ship .colony-ship-progress-label');
    if (!fill) return;
    const pct = Math.min(100, (queue[0].progress / 20) * 100);
    fill.style.width = pct.toFixed(1) + '%';
    if (label) label.textContent = `BUILDING... ${Math.floor(pct)}%`;
  }

  _showColonyShipPopup(planetId) {
    const popup = this._colonyPopupEl;
    if (!popup) return;

    const fromDef = PLANETS.find(p => p.id === planetId);
    if (!fromDef) return;
    const fromRadius = fromDef.orbit.radius;
    const ship = gameState.colonyShipsInOrbit.find(s => s.fromPlanetId === planetId);
    if (!ship) return;

    // Build target list
    const unowned = PLANETS.filter(p => !gameState.ownedPlanets.includes(p.id));
    if (unowned.length === 0) {
      popup.innerHTML = `
        <div class="csp-title">NO TARGETS</div>
        <div style="font-size:10px;color:var(--dune-text-dim);text-align:center;padding:8px">All planets colonized</div>
      `;
      popup.classList.add('visible');
      this._colonyPopupVisible = true;
      return;
    }

    let html = `<div class="csp-title">SELECT TARGET</div><button class="csp-close">✕</button>`;
    for (const target of unowned) {
      const dist = Math.abs(target.orbit.radius - fromRadius);
      const travelTime = colonyTravelDuration(dist);
      const energyCost = colonyLaunchEnergyCost(dist);
      const canAfford = gameState.siloHas(planetId, 'energy', energyCost);
      const timeStr = travelTime >= 60
        ? `~${Math.floor(travelTime / 60)}m ${Math.floor(travelTime % 60)}s`
        : `~${Math.floor(travelTime)}s`;

      html += `
        <div class="target-row" data-target="${target.id}" data-dist="${dist}">
          <div class="target-color" style="background:${target.col}"></div>
          <div class="target-info">
            <div class="target-name">${target.name}</div>
            <div class="target-meta">${timeStr} · ⚡${fmt(energyCost)}</div>
          </div>
          <button class="launch-btn" ${canAfford ? '' : 'disabled'}>LAUNCH</button>
        </div>
      `;
    }

    popup.innerHTML = html;

    // Close button
    popup.querySelector('.csp-close')?.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this._hideColonyShipPopup();
    });

    // Launch buttons
    popup.querySelectorAll('.target-row').forEach(row => {
      const btn = row.querySelector('.launch-btn');
      if (btn.disabled) return;
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        const targetId = row.dataset.target;
        const dist = parseFloat(row.dataset.dist);
        gameState.launchColonyShip(ship.id, targetId, dist);
      });
    });

    // Position at center of screen (will be updated per-frame if we have 3D pos)
    popup.style.left = (window.innerWidth / 2 - 140) + 'px';
    popup.style.top = (window.innerHeight / 2 - 100) + 'px';
    popup.classList.add('visible');
    this._colonyPopupVisible = true;
  }

  _hideColonyShipPopup() {
    if (this._colonyPopupEl) {
      this._colonyPopupEl.classList.remove('visible');
    }
    this._colonyPopupVisible = false;
  }

  // ─── Tooltip helpers ──────────────────────────────────────────────────────

  _showTooltip(anchorEl, html) {
    const tt = this._tooltipEl;
    if (!tt) return;
    tt.innerHTML = html;
    tt.classList.add('visible');
    const r   = anchorEl.getBoundingClientRect();
    const ttW = tt.offsetWidth  || 220;
    const ttH = tt.offsetHeight || 80;
    let left  = r.right + 8;
    if (left + ttW > window.innerWidth - 4) left = r.left - ttW - 8;
    left = Math.max(4, left);
    let top = r.top;
    if (top + ttH > window.innerHeight - 4) top = window.innerHeight - ttH - 4;
    top = Math.max(4, top);
    tt.style.left = left + 'px';
    tt.style.top  = top  + 'px';
  }

  _hideTooltip() {
    this._tooltipEl?.classList.remove('visible');
  }
}
