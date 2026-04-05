import { gameState, colonyLaunchEnergyCost, colonyTravelDuration, getColonyShipBuildCost } from '../GameState.js';
import { PLANETS } from '../data/planets.js';

const PLANET_MAP = new Map(PLANETS.map(p => [p.id, p]));
import { BASE_UPGRADES, ROBOT_ACTIONS, ROBOT_UPGRADES, getSpeedMult, getLoadMult } from '../data/upgrades.js';
import { createRoute, calcTravelDuration, SHIPPABLE_RESOURCES } from '../data/routes.js';
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
    span.style.top = rect.top + 'px';
    span.style.position = 'fixed';
    document.body.appendChild(span);
    span.addEventListener('animationend', () => span.remove(), { once: true });
  }
}

const _ndc = new THREE.Vector3();

export class PlanetPanel {
  constructor() {
    this._leftEl = document.getElementById('panel-left');
    this._rightEl = document.getElementById('panel-right');
    this._visible = false;
    this._planetId = null;
    this._renderTimer = 0;
    this._tooltipEl = document.getElementById('upg-tooltip');
    this._prevSiloAmounts = {}; // track previous amounts for drain flash
    this._siloEls = null;      // cached DOM refs per resource
    this._siloBuiltForPlanet = null;
    this._siloBuiltCapacity = {}; // resource → capacity when DOM was last built
    this._siloTimer = 0;       // accumulates dt to rate-limit silo DOM updates
    this._siloCache = {};      // per-resource last-rendered key for dirty-check
    this._routesFp = '';       // fingerprint to skip redundant _renderRoutes() rebuilds

    this._colonyPopupEl = document.getElementById('colony-ship-popup');
    this._colonyPopupVisible = false;
    this._defensePanel = new DefensePanel();

    this._leftTab = 'base';
    this._rightTab = 'robots';
    this._initTabs();

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
    gameState.on('baseBuilt', rerender);
    gameState.on('baseUpgraded', rerender);
    gameState.on('robotHired', rerender);
    gameState.on('robotUpgraded', rerender);
    gameState.on('routeAdded', rerender);
    gameState.on('routeRemoved', rerender);
    gameState.on('depositUnlocked', rerender);
    gameState.on('colonyShipQueued', rerender);
    gameState.on('colonyShipBuilt', rerender);
    gameState.on('defenseBuilt', rerender);
    gameState.on('defenseUpgraded', rerender);
    gameState.on('attackStarted', rerender);
    gameState.on('attackEnded', rerender);
    gameState.on('abilityActivated', rerender);
    gameState.on('planetFell', rerender);
    gameState.on('planetRecolonized', rerender);
    gameState.on('colonyShipLaunched', rerender);
    gameState.on('techUnlocked', rerender);
    gameState.on('militaryBaseBuilt', rerender);
    gameState.on('militaryBaseUpgraded', rerender);
    // Hide planet panels when military base is selected (mutually exclusive)
    gameState.on('militaryBaseClicked', () => this.hide());
    const rerenderRoutes = () => { if (this._visible) this._renderRoutes(); };
    gameState.on('shipLaunched', rerenderRoutes);
    gameState.on('shipArrived', rerenderRoutes);
    gameState.on('productionTick', (dt) => {
      if (!this._visible) return;
      // Rate-limit silo DOM updates — productionTick fires every frame, 10 updates/sec is plenty
      this._siloTimer += dt;
      if (this._siloTimer >= 0.1) {
        this._siloTimer = 0;
        this._renderSilos();
      }
      this._updateColonyShipProgress();
      const now = performance.now();
      if (now - this._renderTimer > 1000) {
        this._renderTimer = now;
        const ps = gameState.getPlanetState(this._planetId);
        const def = PLANET_MAP.get(this._planetId);
        if (ps && def) {
          this._renderBase(ps, def);
          this._renderHire(ps, def);
          this._renderRobotUpgrades(ps);
          this._renderRoutes();
        }
      }
    });
  }

  _initTabs() {
    document.querySelectorAll('#panel-left-tabs .panel-tab').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this._leftTab = btn.dataset.tab;
        this._activateTab('left', this._leftTab);
      });
    });
    document.querySelectorAll('#panel-right-tabs .panel-tab').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this._rightTab = btn.dataset.tab;
        this._activateTab('right', this._rightTab);
      });
    });
  }

  _activateTab(side, tabName) {
    const panel = side === 'left' ? this._leftEl : this._rightEl;
    panel.querySelectorAll('.panel-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === tabName)
    );
    panel.querySelectorAll('.panel-tab-content').forEach(c =>
      c.style.display = c.dataset.tab === tabName ? '' : 'none'
    );
  }

  /** Show panels for a given planet */
  show(planetId) {
    this._planetId = planetId;
    this._visible = true;
    this._siloTimer = 0;
    this._siloCache = {};
    this._routesFp = '';
    this._activateTab('left', this._leftTab);
    this._activateTab('right', this._rightTab);
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
    document.querySelectorAll('.route-inline-form').forEach(f => f.remove());
  }

  /** Call each frame to reposition panels to match the camera's look-at target screen Y */
  update(camera, anchorPos) {
    if (!this._visible || !this._planetId || !anchorPos) return;

    _ndc.copy(anchorPos).project(camera);
    // Only reposition if planet is reasonably on screen
    if (_ndc.z > 1.0) return;

    const screenY = (-_ndc.y * 0.5 + 0.5) * window.innerHeight;
    // Anchor top edge; clamp so panel stays on screen
    const topPx = Math.max(60, Math.min(window.innerHeight - 120, screenY - 200)) + 'px';

    this._leftEl.style.top = topPx;
    this._rightEl.style.top = topPx;
  }

  // ─── Internal render ──────────────────────────────────────────────────────

  _renderAll() {
    const ps = gameState.getPlanetState(this._planetId);
    const def = PLANET_MAP.get(this._planetId);
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
          <div style="color:var(--dune-red);font-size: 12px;margin:6px 0">
            This station has fallen. Some infrastructure survived.
          </div>
          <div style="font-size: 12px;color:var(--dune-text-dim);margin-bottom:8px">
            Base levels and deposits preserved. Defenses lost. Robots reduced.
          </div>
        `;

        if (sourcePlanets.length > 0) {
          let costStr = '';
          if (oreCost > 0) costStr += `⬡ ${fmt(oreCost)} ORE`;
          if (energyCost > 0) costStr += (costStr ? '  ' : '') + `⚡ ${fmt(energyCost)} ENERGY`;

          for (const srcId of sourcePlanets) {
            const srcDef = PLANET_MAP.get(srcId);
            const canAfford = (oreCost <= 0 || gameState.siloHas(srcId, 'ore', oreCost)) &&
              (energyCost <= 0 || gameState.siloHas(srcId, 'energy', energyCost));
            const btn = document.createElement('button');
            btn.className = 'build-base-btn' + (canAfford ? '' : ' cant-afford');
            btn.disabled = !canAfford;
            btn.innerHTML = `
              <span>🔄 RECOLONIZE from ${srcDef?.name || srcId}</span>
              ${costStr ? `<span class="base-upg-cost ${canAfford ? '' : 'cant'}">${costStr}</span>` : '<span style="font-size: 12px;color:var(--dune-text-dim)">FREE</span>'}
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
          el.innerHTML += '<div style="color:var(--dune-text-dim);font-size: 12px">No owned planets available for recolonization.</div>';
        }
        return;
      }

      // Apply tech multiplier and clamp to silo capacity — matches buildBase() logic exactly
      const rawOreCost    = def.baseCost.ore    || 0;
      const rawEnergyCost = def.baseCost.energy || 0;
      const costMult = gameState.getTechColonyCostMult();
      const adjOreCost    = Math.floor(rawOreCost    * costMult);
      const adjEnergyCost = Math.floor(rawEnergyCost * costMult);
      const cost = gameState._clampCost(this._planetId, { ore: adjOreCost, energy: adjEnergyCost });
      const oreCost    = cost.ore    || 0;
      const energyCost = cost.energy || 0;
      const canAfford = (oreCost    === 0 || gameState.siloHas(this._planetId, 'ore',    oreCost))
                     && (energyCost === 0 || gameState.siloHas(this._planetId, 'energy', energyCost));

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
          ${costStr ? `<span class="base-upg-cost ${canAfford ? '' : 'cant'}">${costStr}</span>` : '<span style="font-size: 12px;color:var(--dune-text-dim)">FREE</span>'}
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

        // If a colony ship is in orbit waiting for resources, show a hint
        const colonyArriving = gameState.colonyShipsArriving?.some(s => s.toPlanetId === this._planetId);
        if (colonyArriving && !canAfford && (oreCost > 0 || energyCost > 0)) {
          const hint = document.createElement('div');
          hint.style.cssText = 'font-size:11px;color:var(--dune-text-dim);margin-top:8px;line-height:1.4;text-align:center';
          hint.textContent = 'Send a cargo route from another planet to fill the silos, then build.';
          el.appendChild(hint);
        }
      } else {
        el.innerHTML = `
          <div class="panel-section-title">SPACE BASE</div>
          <div style="font-size: 12px;color:var(--dune-text-dim);text-align:center;padding:8px 0">
            Send colony ship to establish base
          </div>
        `;
      }
      return;
    }

    // base_storage is always available; others need tech tree unlock
    const BASE_TECH_MAP = {
      base_storage:   null,               // always available
      base_shipspeed: 'base_shipspeed',
      base_shipslots: 'base_shipslots',
      base_passive:   'base_passive',
    };

    // Show upgrade grid
    el.innerHTML = `<div class="panel-section-title">BASE UPGRADES</div>`;
    const grid = document.createElement('div');
    grid.className = 'base-upg-grid';

    for (const upg of BASE_UPGRADES) {
      const techId = BASE_TECH_MAP[upg.id];
      if (techId && !gameState.isTechUnlocked(techId)) continue;
      
      const level = ps.baseLevels[upg.effect] ?? 0;
      const maxed = level >= upg.maxLevel;
      const cost = maxed ? null : {
        energy: upg.energyCost?.[level] || 0,
        ore:    upg.oreCost?.[level] || 0
      };
      
      const canEnergy = !cost || cost.energy <= 0 || gameState.siloHas(this._planetId, 'energy', cost.energy);
      const canOre    = !cost || cost.ore <= 0    || gameState.siloHas(this._planetId, 'ore',    cost.ore);
      const canAfford = canEnergy && canOre;

      const btn = document.createElement('button');
      btn.className = 'base-upg-btn' + (maxed ? ' maxed' : '');
      btn.disabled = maxed || !canAfford;

      let costStr = '';
      if (!maxed) {
        if (cost.ore > 0)    costStr += `<span class="${canOre ? '' : 'cant'}">⬡ ${fmt(cost.ore)}</span>`;
        if (cost.energy > 0) costStr += (costStr ? ' ' : '') + `<span class="${canEnergy ? '' : 'cant'}">⚡ ${fmt(cost.energy)}</span>`;
      }

      btn.innerHTML = `
        <span class="base-upg-icon">${upg.icon}</span>
        <span class="base-upg-name">${upg.name}</span>
        <span class="base-upg-level">${maxed ? 'MAX' : `LV ${level}/${upg.maxLevel}`}</span>
        ${costStr ? `<span class="base-upg-cost">${costStr}</span>` : ''}
      `;

      if (!maxed && canAfford) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          AudioManager.play('UI_CLICK');
          const ok = gameState.buyBaseUpgrade(this._planetId, upg.id);
          if (ok) {
            let fStr = '';
            if (cost.ore > 0) fStr += `-${fmt(cost.ore)} ⬡ `;
            if (cost.energy > 0) fStr += `-${fmt(cost.energy)} ⚡`;
            flashButton(btn, 'base-upg-btn--success', fStr);
          }
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
          if (upg.effect === 'storage') effectLine = `→ +${fmt(upg.capacityBonus[level])} capacity`;
          else if (upg.effect === 'passiveEnergy') effectLine = `→ ${upg.passiveRate[level]} energy/s passive`;
          else if (upg.effect === 'shipSpeed') effectLine = `→ +20% ship speed`;
          else if (upg.effect === 'shipSlots') effectLine = `→ +1 docking slot`;
        }
        this._showTooltip(btn, `
          <div class="utt-name">${upg.name}</div>
          <div class="utt-level">${maxed ? 'MAXED OUT' : `LV ${level} / ${upg.maxLevel}`}</div>
          <div class="utt-desc">${upg.desc}</div>
          ${!maxed ? `
            <div class="utt-cost">
              ${cost.ore > 0 ? `⬡ ${fmt(cost.ore)}  ` : ''}
              ${cost.energy > 0 ? `⚡ ${fmt(cost.energy)}  ` : ''}
              ${effectLine}
            </div>
          ` : ''}
        `);
      });
      btn.addEventListener('mouseleave', () => this._hideTooltip());

      grid.appendChild(btn);
    }

    el.appendChild(grid);

    // ── Military Base build button (shown when tech unlocked but not yet built) ──
    if (gameState.isTechUnlocked('military_base') && !ps.militaryBase?.built) {
      const milSec = document.createElement('div');
      milSec.style.marginTop = '10px';

      const canOre    = gameState.siloHas(this._planetId, 'ore',    2000);
      const canEnergy = gameState.siloHas(this._planetId, 'energy', 1500);
      const canAffordMil = canOre && canEnergy;

      const milBtn = document.createElement('button');
      milBtn.className = 'mil-build-btn' + (canAffordMil ? '' : ' cant-afford');
      milBtn.disabled  = !canAffordMil;
      milBtn.innerHTML = `
        <span class="mil-build-label">⚔ BUILD MILITARY BASE</span>
        <span class="mil-build-cost">
          <span class="${canOre ? '' : 'mil-cost-cant'}">⬡ 2,000 ORE</span>
          &nbsp;
          <span class="${canEnergy ? '' : 'mil-cost-cant'}">⚡ 1,500 ENERGY</span>
        </span>
      `;
      milBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        gameState.buildMilitaryBase(this._planetId);
      });
      milSec.appendChild(milBtn);
      el.appendChild(milSec);
    } else if (ps.militaryBase?.built) {
      // Small active indicator — direct player to click the 3D object in orbit
      const hint = document.createElement('div');
      hint.style.cssText = 'margin-top:10px;font-size:11px;color:#cc3333;letter-spacing:1.5px;font-family:Orbitron,sans-serif;display:flex;align-items:center;gap:6px;';
      hint.innerHTML = '<span style="color:#44ff88;font-size:9px;">●</span> MILITARY BASE ACTIVE \u2014 click it in orbit';
      el.appendChild(hint);
    }
  }


  _computeRate(planetId, resource) {
    const ps = gameState.getPlanetState(planetId);
    if (!ps) return 0;
    const def = PLANET_MAP.get(planetId);
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

    // Check whether a full rebuild is needed (planet changed or storage upgraded)
    const needsRebuild = this._siloBuiltForPlanet !== this._planetId ||
      ['ore', 'energy', 'crystal'].some(r =>
        ps.silos[r] && this._siloBuiltCapacity[r] !== ps.silos[r].capacity
      );

    if (needsRebuild) {
      // Full DOM build — only happens on planet change or capacity change
      el.innerHTML = `<div class="panel-section-title">SILOS</div>`;
      this._siloEls = {};
      this._siloBuiltForPlanet = this._planetId;

      for (const resource of ['ore', 'energy', 'crystal']) {
        const silo = ps.silos[resource];
        // Always record capacity (even 0) so the needsRebuild check stays stable
        this._siloBuiltCapacity[resource] = silo?.capacity ?? 0;
        if (!silo || silo.capacity === 0) continue;

        const row = document.createElement('div');
        row.className = 'silo-bar-row';

        const label = document.createElement('span');
        label.className = 'silo-label';
        label.textContent = (RESOURCE_ICONS[resource] || '') + ' ' + RESOURCE_LABELS[resource];

        const track = document.createElement('div');
        track.className = 'silo-track';

        const fill = document.createElement('div');
        fill.className = `silo-fill ${resource}`;
        track.appendChild(fill);

        const amount = document.createElement('span');
        amount.className = 'silo-amount';

        const fullBadge = document.createElement('span');
        fullBadge.className = 'silo-full-badge';
        fullBadge.textContent = 'FULL';
        fullBadge.style.display = 'none';

        const rateEl = document.createElement('span');
        rateEl.className = `silo-rate ${resource}`;
        rateEl.style.display = 'none';

        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(amount);
        row.appendChild(fullBadge);
        row.appendChild(rateEl);
        el.appendChild(row);

        this._siloEls[resource] = { track, fill, amount, fullBadge, rateEl };
      }
    }

    // Update-only path — runs every productionTick
    for (const resource of ['ore', 'energy', 'crystal']) {
      const refs = this._siloEls?.[resource];
      if (!refs) continue;
      const silo = ps.silos[resource];
      if (!silo) continue;

      const pct = silo.capacity > 0 ? (silo.amount / silo.capacity) * 100 : 0;
      const full = pct >= 99.5;
      const warning = pct > 90 && !full;
      const prevKey = this._planetId + '_' + resource;
      const prev = this._prevSiloAmounts[prevKey];
      const drained = prev !== undefined && silo.amount < prev - 1;
      this._prevSiloAmounts[prevKey] = silo.amount;

      const rate = this._computeRate(this._planetId, resource);
      const rateStr = rate > 0 ? `+${rate >= 10 ? fmt(rate) : rate.toFixed(1)}/s` : '';

      // Skip DOM writes if visual state is identical to last render
      const cacheKey = `${Math.floor(pct)}:${full ? 1 : 0}:${warning ? 1 : 0}:${drained ? 1 : 0}:${rateStr}`;
      if (this._siloCache[resource] === cacheKey) continue;
      this._siloCache[resource] = cacheKey;

      refs.track.className = `silo-track${drained ? ' silo-track--drain' : ''}`;
      refs.fill.className = `silo-fill ${resource}${full ? ' full' : ''}${warning ? ' warning' : ''}`;
      refs.fill.style.width = pct.toFixed(1) + '%';
      refs.amount.textContent = `${fmt(silo.amount)}/${fmt(silo.capacity)}`;
      refs.fullBadge.style.display = full ? '' : 'none';
      refs.rateEl.textContent = rateStr;
      refs.rateEl.style.display = rateStr ? '' : 'none';
    }
  }

  _renderRoutes() {
    const el = document.getElementById('panel-routes');
    if (!el) return;

    // Don't wipe the DOM while a form is open — it would destroy user input mid-edit
    if (el.querySelector('.route-add-form, .route-inline-form')) return;

    const ps = gameState.getPlanetState(this._planetId);
    const myRoutes = gameState.routes.filter(r => r.fromPlanet === this._planetId);

    // O(1) per-route lookup — avoids O(routes × ships) find() calls
    const shipByRoute = new Map(
      gameState.activeShips
        .filter(s => s.routeId != null)
        .map(s => [s.routeId, s])
    );

    // Dirty check — skip rebuild if route list and transit ETAs are unchanged
    const fp = myRoutes.map(r => {
      const ship = shipByRoute.get(r.id);
      return `${r.id}:${r.active ? 1 : 0}:${ship ? Math.floor((1 - ship.t) * ship.duration) : -1}`;
    }).join('|');
    if (fp === this._routesFp) return;
    this._routesFp = fp;

    el.innerHTML = `<div class="panel-section-title">SHIP ROUTES</div>`;

    for (const route of myRoutes) {
      const toDef = PLANET_MAP.get(route.toPlanet);

      // Compute display % from current silo capacity
      const silo = ps?.silos?.[route.resource];
      const pct = silo?.capacity > 0 ? Math.round(route.amount / silo.capacity * 100) : '?';

      // Travel time
      const speedLv = ps?.baseLevels?.shipSpeed ?? 0;
      const travelSec = calcTravelDuration(route.fromPlanet, route.toPlanet, speedLv);
      const travelStr = `~${Math.floor(travelSec / 60)}m ${Math.floor(travelSec % 60)}s`;

      // In-transit ship
      const inTransitShip = shipByRoute.get(route.id);
      const etaStr = inTransitShip
        ? (() => {
          const rem = Math.max(0, (1 - inTransitShip.t) * inTransitShip.duration);
          return `${Math.floor(rem / 60)}m ${Math.floor(rem % 60)}s`;
        })()
        : null;

      // Dispatch status
      let dispatchStatus = 'ready';
      if (!route.active) {
        dispatchStatus = 'paused';
      } else if (!inTransitShip) {
        const destPs = gameState.getPlanetState(route.toPlanet);
        if (!gameState.siloHasRoom(route.toPlanet, route.resource)) {
          dispatchStatus = 'destination full';
        } else if (!gameState.siloHas(route.fromPlanet, route.resource, route.amount)) {
          const have = ps?.silos?.[route.resource]?.amount ?? 0;
          dispatchStatus = `waiting — ${fmt(have)}/${fmt(route.amount)}`;
        }
      }

      const row = document.createElement('div');
      row.className = 'route-item';
      row.innerHTML = `
        <div class="route-status ${route.active ? '' : 'inactive'}"></div>
        <div class="route-main">
          <div class="route-top-row">
            <span class="route-from-to">${toDef?.name || route.toPlanet}</span>
            <span class="route-resource">${RESOURCE_ICONS[route.resource]} ${pct}% <span class="route-amount-hint">(${fmt(route.amount)})</span></span>
          </div>
          <div class="route-meta">${travelStr} · ${dispatchStatus}</div>
          ${etaStr ? `<div class="route-transit-indicator">🚀 in transit — ETA ${etaStr}</div>` : ''}
        </div>
        <button class="route-edit" title="Edit route">✎</button>
        <button class="route-delete" title="Remove route">✕</button>
      `;
      row.querySelector('.route-edit').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        this._openInlineEdit(row, route, ps);
      });
      row.querySelector('.route-delete').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        gameState.removeRoute(route.id);
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
    form.className = 'route-add-form';

    const ownedExcludingSelf = gameState.ownedPlanets.filter(id => id !== this._planetId);
    if (ownedExcludingSelf.length === 0) {
      form.innerHTML = '<div style="font-size: 12px;color:var(--dune-text-dim)">No other planets owned</div>';
      container.appendChild(form);
      return;
    }

    const ps = gameState.getPlanetState(this._planetId);
    const availableResources = ps ? Object.keys(ps.silos).filter(r => ps.silos[r].capacity > 0) : ['ore'];
    const defaultResource = availableResources[0] || 'ore';
    const defaultSilo = ps?.silos?.[defaultResource];
    const defaultCapacity = defaultSilo?.capacity ?? 1000;
    const defaultPct = 50;
    const defaultAmt = Math.round(defaultPct / 100 * defaultCapacity);
    const defaultTo = ownedExcludingSelf[0];
    const speedLv = ps?.baseLevels?.shipSpeed ?? 0;
    const defaultTravel = calcTravelDuration(this._planetId, defaultTo, speedLv);

    form.innerHTML = `
      <div class="rf-label">DESTINATION</div>
      <select class="route-select" id="rf-to">
        ${ownedExcludingSelf.map(id => {
      const def = PLANET_MAP.get(id);
      return `<option value="${id}">${def?.name || id}</option>`;
    }).join('')}
      </select>

      <div class="rf-label">RESOURCE</div>
      <select class="route-select" id="rf-res">
        ${availableResources.map(r => `<option value="${r}">${RESOURCE_LABELS[r]}</option>`).join('')}
      </select>

      <div class="rf-label">AMOUNT PER TRIP</div>
      <div class="route-pct-row">
        <input type="range" id="rf-pct" min="1" max="100" value="${defaultPct}" class="route-pct-slider">
        <span id="rf-pct-label" class="route-pct-label">${defaultPct}% — ${fmt(defaultAmt)}</span>
      </div>

      <div id="rf-travel" class="route-travel-hint">Travel time: ~${Math.floor(defaultTravel / 60)}m ${Math.floor(defaultTravel % 60)}s</div>

      <div style="display:flex;gap:6px;margin-top:4px">
        <button id="rf-confirm" class="rf-btn rf-btn-confirm">CONFIRM</button>
        <button id="rf-cancel"  class="rf-btn rf-btn-cancel">CANCEL</button>
      </div>
    `;
    container.appendChild(form);

    // Live slider update
    const updateSliderLabel = () => {
      const resource = form.querySelector('#rf-res').value;
      const silo = ps?.silos?.[resource];
      const capacity = silo?.capacity ?? 1000;
      const sliderEl = form.querySelector('#rf-pct');
      const pct = parseInt(sliderEl.value, 10);
      const amt = Math.round(pct / 100 * capacity);
      sliderEl.style.setProperty('--val', pct + '%');
      form.querySelector('#rf-pct-label').textContent = `${pct}% — ${fmt(amt)}`;
    };
    // Initialize gradient on load
    form.querySelector('#rf-pct').style.setProperty('--val', defaultPct + '%');

    const updateTravelTime = () => {
      const to = form.querySelector('#rf-to').value;
      const travel = calcTravelDuration(this._planetId, to, speedLv);
      form.querySelector('#rf-travel').textContent =
        `Travel time: ~${Math.floor(travel / 60)}m ${Math.floor(travel % 60)}s`;
    };

    form.querySelector('#rf-pct').addEventListener('input', updateSliderLabel);
    form.querySelector('#rf-res').addEventListener('change', updateSliderLabel);
    form.querySelector('#rf-to').addEventListener('change', updateTravelTime);

    form.querySelector('#rf-confirm').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const to = form.querySelector('#rf-to').value;
      const resource = form.querySelector('#rf-res').value;
      const silo = ps?.silos?.[resource];
      const capacity = silo?.capacity ?? 1000;
      const pct = parseInt(form.querySelector('#rf-pct').value, 10);
      const amount = Math.max(1, Math.round(pct / 100 * capacity));
      const route = createRoute(this._planetId, to, resource, amount);
      form.remove();
      addBtn.style.display = '';
      gameState.addRoute(route);
    });
    form.querySelector('#rf-cancel').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      form.remove();
      addBtn.style.display = '';
    });
  }

  _openInlineEdit(row, route, ps) {
    // Close any other open inline edit first
    document.querySelectorAll('.route-inline-form').forEach(f => {
      const r = f.closest('.route-item');
      r?.classList.remove('route-item--editing');
      r?.querySelectorAll('.route-edit, .route-delete').forEach(b => b.style.display = '');
      f.remove();
    });

    // Toggle off if already open on this row
    if (row.classList.contains('route-item--editing')) return;

    row.classList.add('route-item--editing');
    row.querySelectorAll('.route-edit, .route-delete').forEach(b => b.style.display = 'none');

    const availableResources = ps ? Object.keys(ps.silos).filter(r => ps.silos[r].capacity > 0) : ['ore'];
    const silo = ps?.silos?.[route.resource];
    const currentPct = silo?.capacity > 0 ? Math.round(route.amount / silo.capacity * 100) : 50;
    const currentAmt = Math.round(currentPct / 100 * (silo?.capacity ?? 1000));

    const form = document.createElement('div');
    form.className = 'route-inline-form';
    form.innerHTML = `
      <div class="rf-label">RESOURCE</div>
      <select class="route-select" id="rei-res">
        ${availableResources.map(r =>
          `<option value="${r}" ${r === route.resource ? 'selected' : ''}>${RESOURCE_LABELS[r]}</option>`
        ).join('')}
      </select>

      <div class="rf-label">AMOUNT PER TRIP</div>
      <div class="route-pct-row">
        <input type="range" id="rei-pct" min="1" max="100" value="${currentPct}" class="route-pct-slider">
        <span id="rei-pct-label" class="route-pct-label">${currentPct}% — ${fmt(currentAmt)}</span>
      </div>

      <div class="route-inline-actions">
        <button id="rei-toggle" class="rf-btn rf-btn-toggle">${route.active ? '⏸ PAUSE' : '▶ ENABLE'}</button>
        <button id="rei-save" class="rf-btn rf-btn-confirm">SAVE</button>
        <button id="rei-cancel" class="rf-btn rf-btn-cancel">CANCEL</button>
      </div>
    `;

    row.querySelector('.route-main').appendChild(form);

    const pctInput = form.querySelector('#rei-pct');
    const pctLabel = form.querySelector('#rei-pct-label');
    const resSelect = form.querySelector('#rei-res');

    pctInput.style.setProperty('--val', currentPct + '%');

    const updateLabel = () => {
      const s = ps?.silos?.[resSelect.value];
      const cap = s?.capacity ?? 1000;
      const pct = parseInt(pctInput.value, 10);
      pctInput.style.setProperty('--val', pct + '%');
      pctLabel.textContent = `${pct}% — ${fmt(Math.round(pct / 100 * cap))}`;
    };
    pctInput.addEventListener('input', updateLabel);
    resSelect.addEventListener('change', updateLabel);

    const close = () => {
      row.classList.remove('route-item--editing');
      row.querySelectorAll('.route-edit, .route-delete').forEach(b => b.style.display = '');
      form.remove();
    };

    form.querySelector('#rei-toggle').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      gameState.toggleRoute(route.id);
      route.active = !route.active;
      form.querySelector('#rei-toggle').textContent = route.active ? '⏸ PAUSE' : '▶ ENABLE';
      row.querySelector('.route-status').classList.toggle('inactive', !route.active);
    });

    form.querySelector('#rei-save').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const resource = resSelect.value;
      const s = ps?.silos?.[resource];
      const cap = s?.capacity ?? 1000;
      const pct = parseInt(pctInput.value, 10);
      const amount = Math.max(1, Math.round(pct / 100 * cap));
      AudioManager.play('UI_CLICK');
      close();
      gameState.updateRoute(route.id, { resource, amount });
    });

    form.querySelector('#rei-cancel').addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      close();
    });
  }

  _renderHire(ps, def) {
    const el = document.getElementById('panel-robots-hire');
    if (!el) return;

    el.innerHTML = `<div class="panel-section-title">HIRE ROBOTS</div>`;

    if (!ps || !ps.hasBase) {
      el.innerHTML += '<div style="font-size: 12px;color:var(--dune-text-dim);text-align:center">Build base first</div>';
      return;
    }

    const ROBOT_TECH_MAP = {
      miner:     'miner_bot',
      energyBot: 'energy_bot',
      builder:   'builder_bot',
      scout:     'scout_bot',
    };

    const grid = document.createElement('div');
    grid.className = 'hire-grid';

    for (const action of ROBOT_ACTIONS) {
      const robotType = action.type;
      // Hide robot types that haven't been unlocked in the tech tree
      if (!gameState.isTechUnlocked(ROBOT_TECH_MAP[robotType])) continue;
      const robot = ps.robots[robotType];
      const energyCost = action.energyCostFn(ps);
      const canAfford = gameState.siloHas(this._planetId, 'energy', energyCost);

      const btn = document.createElement('button');
      btn.className = 'hire-btn'
        + (robotType === 'miner'     ? ' hire-miner-btn'  : '')
        + (robotType === 'energyBot' ? ' hire-energy-btn' : '')
        + (robotType === 'scout'     ? ' hire-scout-btn'  : '');
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
      const spdLv = robot.speedLevel ?? 0;
      const loadLv = robot.loadLevel ?? 0;
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

    const ROBOT_UPG_TECH_MAP = {
      miner:     'miner_upgrades',
      energyBot: 'energy_upgrades',
      builder:   'builder_upgrades',
      scout:     'scout_upgrades',
    };

    // Only show upgrades for robot types that have ≥1 robot AND the upgrade tech is unlocked
    const relevantUpgrades = ROBOT_UPGRADES.filter(upg =>
      ps.robots[upg.robotType]?.count > 0 &&
      gameState.isTechUnlocked(ROBOT_UPG_TECH_MAP[upg.robotType])
    );
    if (relevantUpgrades.length === 0) { el.innerHTML = ''; return; }

    el.innerHTML = `<div class="panel-section-title">BOT UPGRADES</div>`;

    for (const upg of relevantUpgrades) {
      const robot = ps.robots[upg.robotType];
      const level = robot[upg.effect] ?? 0;
      const maxed = level >= upg.maxLevel;
      const cost = maxed ? null : { energy: upg.energyCost[level] };
      const canAfford = cost && gameState.siloHas(this._planetId, 'energy', cost.energy);

      const isSpeed = upg.effect === 'speedLevel';
      const effectTag = isSpeed ? '+SPD' : '+LOAD';
      const getMult = isSpeed ? getSpeedMult : getLoadMult;
      const pctPerLevel = isSpeed ? 20 : 30;

      const row = document.createElement('div');
      row.className = 'robot-upg-row';
      row.innerHTML = `
        <span class="robot-upg-name">${upg.name}<span class="upg-effect-tag">${effectTag}</span></span>
        <span class="robot-upg-level">${maxed ? 'MAX' : `${level}/${upg.maxLevel}`}</span>
      `;

      row.addEventListener('mouseenter', () => {
        const curMult = getMult(level);
        const nextMult = !maxed ? getMult(level + 1) : null;
        this._showTooltip(row, `
          <div class="utt-name">${upg.name}</div>
          <div class="utt-level">${maxed ? 'MAXED OUT' : `LV ${level} / ${upg.maxLevel}`}</div>
          <div class="utt-desc">${isSpeed ? 'Increases movement speed' : 'Increases cargo capacity'} (+${pctPerLevel}% per level)</div>
          <div class="utt-cost">${level > 0 ? `Current: ×${curMult.toFixed(1)}` : 'No bonus yet'}${!maxed ? `  →  Next: ×${nextMult.toFixed(1)}` : ''}</div>
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
    const el = document.getElementById('panel-defenses');
    if (!el || !this._planetId) return;
    this._defensePanel.render(el, this._planetId);
  }

  // ─── Colony ship ──────────────────────────────────────────────────────────

  _renderColonyShip(ps, def) {
    const el = document.getElementById('panel-colony-ship');
    if (!el) return;

    // No base = no colony ship option
    if (!ps || !ps.hasBase) { el.innerHTML = ''; return; }

    // Colony ship must be unlocked in tech tree
    if (!gameState.isTechUnlocked('colony_ship')) { el.innerHTML = ''; return; }

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
    const { ore: oreCost } = getColonyShipBuildCost(gameState.stats.planetsColonized);
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

    const fromDef = PLANET_MAP.get(planetId);
    if (!fromDef) return;
    const fromRadius = fromDef.orbit.radius;
    const ship = gameState.colonyShipsInOrbit.find(s => s.fromPlanetId === planetId);
    if (!ship) return;

    // Build target list
    const unowned = PLANETS.filter(p => !gameState.ownedPlanets.includes(p.id));
    if (unowned.length === 0) {
      popup.innerHTML = `
        <div class="csp-title">NO TARGETS</div>
        <div style="font-size: 12px;color:var(--dune-text-dim);text-align:center;padding:8px">All planets colonized</div>
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
    const r = anchorEl.getBoundingClientRect();
    const ttW = tt.offsetWidth || 220;
    const ttH = tt.offsetHeight || 80;
    let left = r.right + 8;
    if (left + ttW > window.innerWidth - 4) left = r.left - ttW - 8;
    left = Math.max(4, left);
    let top = r.top;
    if (top + ttH > window.innerHeight - 4) top = window.innerHeight - ttH - 4;
    top = Math.max(4, top);
    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
  }

  _hideTooltip() {
    this._tooltipEl?.classList.remove('visible');
  }
}
