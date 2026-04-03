import { gameState } from '../GameState.js';
import { AudioManager } from '../audio/AudioManager.js';
import { PLANETS } from '../data/planets.js';

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

/**
 * Two-panel Military Base HUD.
 *
 * Left panel  (#mil-panel-left)  : Base management — construction, silos, hangars
 * Right panel (#mil-panel-right) : Fleet command   — ship building queue
 *
 * Both are shown/hidden together and sit in the same screen positions
 * as the civilian planet panels.
 */
export class MilitaryPanel {
  constructor() {
    this._leftEl    = document.getElementById('mil-panel-left');
    this._rightEl   = document.getElementById('mil-panel-right');
    this._bodyLeft  = document.getElementById('mil-panel-body');
    this._bodyRight = document.getElementById('mil-panel-body-right');
    this._nameEl    = document.getElementById('mil-panel-name');
    this._visible   = false;
    this._planetId  = null;

    /** Expose for HUDBridge / Game.js checks */
    this.isVisible = false;

    // Close button (left panel header only)
    document.getElementById('mil-panel-close')?.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // Re-render on relevant state changes (only while visible)
    const rerender = () => { if (this._visible) this._renderAll(); };
    gameState.on('militaryBaseBuilt',    rerender);
    gameState.on('militaryBaseUpgraded', rerender);
    gameState.on('techUnlocked',         rerender);
    gameState.on('siloChanged',          rerender);

    // Fast silo bar update without full DOM rebuild
    gameState.on('militaryBaseSiloChanged', ({ planetId }) => {
      if (this._visible && planetId === this._planetId) this._updateSiloBars();
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  show(planetId) {
    this._planetId = planetId;
    this._visible  = true;
    this.isVisible = true;
    const def = PLANETS.find(p => p.id === planetId);
    if (this._nameEl) {
      this._nameEl.textContent = `${def?.name?.toUpperCase() ?? planetId.toUpperCase()} · BASE`;
    }
    this._renderAll();
    this._leftEl?.classList.add('visible');
    this._rightEl?.classList.add('visible');
  }

  hide() {
    this._visible  = false;
    this.isVisible = false;
    this._planetId = null;
    this._leftEl?.classList.remove('visible');
    this._rightEl?.classList.remove('visible');
  }

  // ── Master render ─────────────────────────────────────────────────────────

  _renderAll() {
    this._renderLeft();
    this._renderRight();
  }

  // ══ LEFT PANEL — Base management ══════════════════════════════════════════

  _renderLeft() {
    if (!this._bodyLeft || !this._planetId) return;
    const ps  = gameState.getPlanetState(this._planetId);
    if (!ps) return;
    this._bodyLeft.innerHTML = '';

    // ── Not yet a civilian base ───────────────────────────────────────────
    if (!ps.hasBase) {
      this._bodyLeft.innerHTML = `
        <div class="mil-section">
          <div class="mil-section-title">BASE REQUIRED</div>
          <div class="mil-info-text">Build a civilian space base on this planet first.</div>
        </div>`;
      return;
    }

    // ── Tech not yet unlocked ─────────────────────────────────────────────
    if (!gameState.isTechUnlocked('military_base')) {
      this._bodyLeft.innerHTML = `
        <div class="mil-section">
          <div class="mil-section-title">LOCKED</div>
          <div class="mil-info-text">Research <strong>Orbital Shipyards</strong> in the tech tree (T) to unlock.</div>
        </div>`;
      return;
    }

    const mb = ps.militaryBase;

    // ── Not yet built → show construction CTA ────────────────────────────
    if (!mb?.built) {
      this._renderConstructSection(ps);
      return;
    }

    // ── Active base ────────────────────────────────────────────────────────
    this._renderStatusSection(mb);
    this._renderSiloSection(mb);
    this._renderHangarSection(mb);
  }

  _renderConstructSection(ps) {
    const canOre    = gameState.siloHas(this._planetId, 'ore',    2000);
    const canEnergy = gameState.siloHas(this._planetId, 'energy', 1500);
    const canAfford = canOre && canEnergy;

    const sec = document.createElement('div');
    sec.className = 'mil-section';
    sec.innerHTML = `<div class="mil-section-title">⚔ CONSTRUCTION</div>`;

    // Current silo stocks for context
    const ore    = ps.silos.ore?.amount    ?? 0;
    const energy = ps.silos.energy?.amount ?? 0;
    sec.innerHTML += `
      <div class="mil-stock-row">
        <span class="${canOre ? 'mil-stock-ok' : 'mil-stock-low'}">⬡ ${fmt(ore)} / 2,000 ORE</span>
        <span class="${canEnergy ? 'mil-stock-ok' : 'mil-stock-low'}">⚡ ${fmt(energy)} / 1,500 ENERGY</span>
      </div>`;

    const btn = document.createElement('button');
    btn.className = 'mil-build-btn' + (canAfford ? '' : ' cant-afford');
    btn.disabled  = !canAfford;
    btn.innerHTML = `
      <span class="mil-build-label">🔨 BUILD MILITARY BASE</span>
      <span class="mil-build-cost">
        <span class="${canOre ? '' : 'mil-cost-cant'}">⬡ 2,000 ORE</span>
        &nbsp;
        <span class="${canEnergy ? '' : 'mil-cost-cant'}">⚡ 1,500 ENERGY</span>
      </span>`;
    btn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      AudioManager.play('UI_CLICK');
      gameState.buildMilitaryBase(this._planetId);
    });
    sec.appendChild(btn);
    this._bodyLeft.appendChild(sec);
  }

  _renderStatusSection(mb) {
    const fleetCap = mb.fleetCap ?? 0;
    const sec = document.createElement('div');
    sec.className = 'mil-section';
    sec.innerHTML = `
      <div class="mil-status-row">
        <span class="mil-status-dot"></span>
        <span class="mil-status-label">OPERATIONAL</span>
        <span class="mil-fleet-cap">Cap: <strong>${fleetCap}</strong></span>
      </div>`;
    this._bodyLeft.appendChild(sec);
  }

  _renderSiloSection(mb) {
    const sec = document.createElement('div');
    sec.className = 'mil-section';
    sec.innerHTML = `<div class="mil-section-title">SILOS <span class="mil-elevator-tag">Space Elevator ↑ 2/s</span></div>`;

    for (const res of ['ore', 'energy']) {
      const silo = mb.silo?.[res];
      if (!silo) continue;
      const pct  = silo.capacity > 0 ? (silo.amount / silo.capacity) * 100 : 0;
      const full = pct >= 99.5;
      const row  = document.createElement('div');
      row.className = 'silo-bar-row';
      row.innerHTML = `
        <span class="silo-label">${res === 'ore' ? 'ORE' : 'ENERGY'}</span>
        <div class="silo-track">
          <div class="silo-fill ${res}${full ? ' full' : ''}" style="width:${pct.toFixed(1)}%"></div>
        </div>
        <span class="silo-amount" id="mil-silo-amt-${this._planetId}-${res}">${fmt(silo.amount)}/${fmt(silo.capacity)}</span>`;
      sec.appendChild(row);
    }
    this._bodyLeft.appendChild(sec);
  }

  _renderHangarSection(mb) {
    const hangars  = mb.hangars   ?? 0;
    const fleetCap = mb.fleetCap  ?? 0;
    const sec = document.createElement('div');
    sec.className = 'mil-section';

    const pct = (hangars / 5) * 100;
    sec.innerHTML = `
      <div class="mil-section-title">HANGARS <span class="mil-hangar-count">${hangars}/5</span></div>
      <div class="mil-hangar-track">
        <div class="mil-hangar-fill" style="width:${pct}%"></div>
      </div>`;

    const cost = gameState.militaryHangarCost(this._planetId);
    if (cost) {
      const canAfford    = gameState.siloHas(this._planetId, 'energy', cost.energy);
      const capPerHangar = gameState.isTechUnlocked('fleet_formations') ? 15 : 10;
      const btn = document.createElement('button');
      btn.className = 'mil-hangar-btn' + (canAfford ? '' : ' cant-afford');
      btn.disabled  = !canAfford;
      btn.innerHTML = `
        <span>🏗 HANGAR LV${hangars + 1}</span>
        <span class="mil-hangar-effect">+${capPerHangar} Cap</span>
        <span class="mil-hangar-cost ${canAfford ? '' : 'mil-cost-cant'}">⚡ ${fmt(cost.energy)}</span>`;
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        AudioManager.play('UI_CLICK');
        gameState.buildHangar(this._planetId);
      });
      sec.appendChild(btn);
    } else if (hangars >= 5) {
      const note = document.createElement('div');
      note.className = 'mil-info-text';
      note.textContent = 'All hangars built. Fleet capacity maximized.';
      sec.appendChild(note);
    }

    this._bodyLeft.appendChild(sec);
  }

  // ══ RIGHT PANEL — Fleet command ═══════════════════════════════════════════

  _renderRight() {
    if (!this._bodyRight || !this._planetId) return;
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps) return;
    this._bodyRight.innerHTML = '';

    const mb       = ps.militaryBase;
    const built    = !!mb?.built;
    const fleetCap = mb?.fleetCap ?? 0;
    const hangars  = mb?.hangars  ?? 0;

    // ── Fleet capacity overview ───────────────────────────────────────────
    const statsSec = document.createElement('div');
    statsSec.className = 'mil-section';
    statsSec.innerHTML = `
      <div class="mil-section-title">FLEET STATUS</div>
      <div class="mil-fleet-stat-row">
        <span class="mil-fleet-stat-label">CAPACITY</span>
        <span class="mil-fleet-stat-val">${fleetCap > 0 ? fleetCap : '—'}</span>
      </div>
      <div class="mil-fleet-stat-row">
        <span class="mil-fleet-stat-label">HANGARS</span>
        <span class="mil-fleet-stat-val">${built ? `${hangars}/5` : '—'}</span>
      </div>
      <div class="mil-fleet-stat-row">
        <span class="mil-fleet-stat-label">ACTIVE</span>
        <span class="mil-fleet-stat-val">0</span>
      </div>`;
    this._bodyRight.appendChild(statsSec);

    // ── Shipyard section ──────────────────────────────────────────────────
    const shipSec = document.createElement('div');
    shipSec.className = 'mil-section';
    shipSec.innerHTML = `<div class="mil-section-title">SHIPYARD</div>`;

    if (!built || fleetCap === 0) {
      shipSec.innerHTML += `<div class="mil-info-text">Build hangars to unlock fleet production.</div>`;
    } else {
      // Ship type cards — locked in Phase 2, will be activated in Phase 3
      const shipTypes = [
        { id: 'fighter',    name: 'FIGHTER',     icon: '✈', desc: 'Fast interceptor',   cost: { ore: 150, energy: 80  }, tech: 'fighter_mk1'  },
        { id: 'bomber',     name: 'BOMBER',      icon: '💣', desc: 'Area damage',        cost: { ore: 300, energy: 200 }, tech: 'bomber_tech'  },
        { id: 'carrier',    name: 'CARRIER',     icon: '🛸', desc: 'Fleet command ship', cost: { ore: 800, energy: 500 }, tech: 'carrier_tech' },
      ];

      for (const ship of shipTypes) {
        const techOk = gameState.isTechUnlocked(ship.tech);
        const card   = document.createElement('div');
        card.className = 'mil-ship-card' + (techOk ? '' : ' locked');
        card.innerHTML = `
          <span class="mil-ship-icon">${ship.icon}</span>
          <div class="mil-ship-info">
            <span class="mil-ship-name">${ship.name}</span>
            <span class="mil-ship-desc">${techOk ? ship.desc : '🔒 Requires tech research'}</span>
          </div>
          ${techOk ? `
            <button class="mil-ship-build-btn" disabled>
              <span class="mil-ship-cost">⬡ ${ship.cost.ore}  ⚡ ${ship.cost.energy}</span>
            </button>` : ''}`;
        shipSec.appendChild(card);
      }

      const note = document.createElement('div');
      note.className = 'mil-info-text';
      note.style.marginTop = '8px';
      note.innerHTML = `<em>Ship construction coming in Phase 3.</em>`;
      shipSec.appendChild(note);
    }

    this._bodyRight.appendChild(shipSec);
  }

  // ── Fast silo bar update (no DOM rebuild) ─────────────────────────────────
  _updateSiloBars() {
    const ps = gameState.getPlanetState(this._planetId);
    if (!ps?.militaryBase?.built) return;
    const mb = ps.militaryBase;
    for (const res of ['ore', 'energy']) {
      const silo  = mb.silo?.[res];
      const amtEl = document.getElementById(`mil-silo-amt-${this._planetId}-${res}`);
      if (silo && amtEl) amtEl.textContent = `${fmt(silo.amount)}/${fmt(silo.capacity)}`;
    }
  }
}
