import { gameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { PLANETS } from '../data/planets.js';

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

/**
 * Standalone floating panel for the Military Base.
 * Shown ONLY when the player clicks the 3D military base object.
 * Completely independent from PlanetPanel.
 */
export class MilitaryPanel {
  constructor() {
    this._el     = document.getElementById('military-panel');
    this._body   = document.getElementById('mil-panel-body');
    this._nameEl = document.getElementById('mil-panel-name');
    this._visible   = false;
    this._planetId  = null;

    // Close button
    document.getElementById('mil-panel-close')?.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // Auto-hide when player focuses a planet (panel switch)
    gameState.on('focusedPlanet', () => this.hide());
    gameState.on('planetChanged', () => this.hide());

    // Re-render on relevant state changes (only while visible)
    const rerender = () => { if (this._visible) this._render(); };
    gameState.on('militaryBaseBuilt',    rerender);
    gameState.on('militaryBaseUpgraded', rerender);
    gameState.on('techUnlocked',         rerender);
    gameState.on('siloChanged',          rerender);

    // Silo bar fast-update on each production tick (no DOM rebuild)
    gameState.on('militaryBaseSiloChanged', ({ planetId }) => {
      if (this._visible && planetId === this._planetId) this._updateSiloBars();
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  show(planetId) {
    this._planetId = planetId;
    this._visible  = true;
    const def = PLANETS.find(p => p.id === planetId);
    if (this._nameEl) this._nameEl.textContent = `MILITARY BASE · ${def?.name?.toUpperCase() || planetId.toUpperCase()}`;
    this._render();
    this._el?.classList.add('visible');
  }

  hide() {
    this._visible  = false;
    this._planetId = null;
    this._el?.classList.remove('visible');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    if (!this._body || !this._planetId) return;
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps) return;
    const mb = ps.militaryBase;

    this._body.innerHTML = '';

    if (!ps.hasBase) {
      this._body.innerHTML = `
        <div class="mil-section">
          <div class="mil-section-title">MILITARY BASE</div>
          <div class="mil-info-text">Build a civilian space base on this planet first.</div>
        </div>
      `;
      return;
    }

    if (!gameState.isTechUnlocked('military_base')) {
      this._body.innerHTML = `
        <div class="mil-section">
          <div class="mil-section-title">MILITARY BASE</div>
          <div class="mil-info-text">Research <strong>Orbital Shipyards</strong> in the tech tree to unlock.</div>
        </div>
      `;
      return;
    }

    // ── Construction section ───────────────────────────────────────────────
    if (!mb?.built) {
      this._renderBuildSection(ps);
      return;
    }

    // ── Active base ────────────────────────────────────────────────────────
    this._renderActiveBase(ps, mb);
  }

  _renderBuildSection(ps) {
    const canAffordOre    = gameState.siloHas(this._planetId, 'ore',    2000);
    const canAffordEnergy = gameState.siloHas(this._planetId, 'energy', 1500);
    const canAfford       = canAffordOre && canAffordEnergy;

    const sec = document.createElement('div');
    sec.className = 'mil-section';
    sec.innerHTML = `<div class="mil-section-title">⚔ CONSTRUCTION</div>`;

    const btn = document.createElement('button');
    btn.className = 'mil-build-btn' + (canAfford ? '' : ' cant-afford');
    btn.disabled  = !canAfford;
    btn.innerHTML = `
      <span class="mil-build-label">🔨 BUILD MILITARY BASE</span>
      <span class="mil-build-cost">
        <span class="${canAffordOre ? '' : 'mil-cost-cant'}">⬡ ${fmt(2000)} ORE</span>
        &nbsp;
        <span class="${canAffordEnergy ? '' : 'mil-cost-cant'}">⚡ ${fmt(1500)} ENERGY</span>
      </span>
    `;
    btn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      gameState.buildMilitaryBase(this._planetId);
    });

    sec.appendChild(btn);
    this._body.appendChild(sec);
  }

  _renderActiveBase(ps, mb) {
    const fleetCap = mb.fleetCap || 0;
    const hangars  = mb.hangars  || 0;

    // ── Status header ─────────────────────────────────────────────────────
    const statusSec = document.createElement('div');
    statusSec.className = 'mil-section';
    statusSec.innerHTML = `
      <div class="mil-status-row">
        <span class="mil-status-dot"></span>
        <span class="mil-status-label">ACTIVE SHIPYARD</span>
        <span class="mil-fleet-cap">Fleet Cap: <strong>${fleetCap}</strong></span>
      </div>
    `;
    this._body.appendChild(statusSec);

    // ── Space Elevator silos ──────────────────────────────────────────────
    const siloSec = document.createElement('div');
    siloSec.className = 'mil-section';
    siloSec.innerHTML = `<div class="mil-section-title">SILOS <span class="mil-elevator-tag">via Space Elevator</span></div>`;

    for (const res of ['ore', 'energy']) {
      const silo = mb.silo[res];
      if (!silo) continue;
      const pct = silo.capacity > 0 ? (silo.amount / silo.capacity) * 100 : 0;
      const full = pct >= 99.5;

      const row = document.createElement('div');
      row.className = 'silo-bar-row';
      row.innerHTML = `
        <span class="silo-label">${res === 'ore' ? 'ORE' : 'ENERGY'}</span>
        <div class="silo-track">
          <div class="silo-fill ${res}${full ? ' full' : ''}" style="width:${pct.toFixed(1)}%"></div>
        </div>
        <span class="silo-amount" id="mil-silo-amt-${this._planetId}-${res}">${fmt(silo.amount)}/${fmt(silo.capacity)}</span>
        ${full ? '<span class="silo-full-badge">FULL</span>' : ''}
      `;
      siloSec.appendChild(row);
    }
    this._body.appendChild(siloSec);

    // ── Hangars ───────────────────────────────────────────────────────────
    const hangarSec = document.createElement('div');
    hangarSec.className = 'mil-section';

    const hangPct = (hangars / 5) * 100;
    hangarSec.innerHTML = `
      <div class="mil-section-title">HANGARS <span class="mil-hangar-count">${hangars}/5</span></div>
      <div class="mil-hangar-track">
        <div class="mil-hangar-fill" style="width:${hangPct}%"></div>
      </div>
    `;

    const cost = gameState.militaryHangarCost(this._planetId);
    if (cost) {
      const canAfford = gameState.siloHas(this._planetId, 'energy', cost.energy);
      const btn = document.createElement('button');
      btn.className = 'mil-hangar-btn' + (canAfford ? '' : ' cant-afford');
      btn.disabled  = !canAfford;
      const capPerHangar = gameState.isTechUnlocked('fleet_formations') ? 15 : 10;
      btn.innerHTML = `
        <span>🏗 BUILD HANGAR LV${hangars + 1}</span>
        <span class="mil-hangar-effect">+${capPerHangar} Fleet Cap</span>
        <span class="mil-hangar-cost ${canAfford ? '' : 'mil-cost-cant'}">⚡ ${fmt(cost.energy)}</span>
      `;
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        gameState.buildHangar(this._planetId);
      });
      hangarSec.appendChild(btn);
    } else if (hangars >= 5) {
      const maxEl = document.createElement('div');
      maxEl.className = 'mil-info-text';
      maxEl.textContent = 'All hangars built. Fleet capacity maximized.';
      hangarSec.appendChild(maxEl);
    }

    this._body.appendChild(hangarSec);
  }

  // ── Fast silo bar updates (no DOM rebuild) ────────────────────────────────
  _updateSiloBars() {
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps?.militaryBase?.built) return;
    const mb = ps.militaryBase;

    for (const res of ['ore', 'energy']) {
      const silo = mb.silo[res];
      if (!silo) continue;
      const amtEl = document.getElementById(`mil-silo-amt-${this._planetId}-${res}`);
      if (amtEl) amtEl.textContent = `${fmt(silo.amount)}/${fmt(silo.capacity)}`;
    }
  }
}
