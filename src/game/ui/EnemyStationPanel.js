import { gameState } from '../GameState.js';

const PHASE_COLORS = {
  dormant:  '#4488ff',
  alert:    '#ffcc44',
  skirmish: '#ff8800',
  war:      '#ff2222',
};

const DEBUFF_TEXT = {
  lava:       'Beams ignore 20% of player shield',
  ice:        'Frost beams reduce fleet speed −40%',
  industrial: 'Balanced kinetic weaponry',
  void:       'Energy-drain pulses reduce supply regen',
  generic:    '',
};

/**
 * EnemyStationPanel — shows when player left-clicks an enemy station.
 *
 * Displays:
 *   - Station name and CLEARED badge
 *   - Phase indicator (DORMANT/ALERT/SKIRMISH/WAR) with color
 *   - Station type and debuff description
 *   - Hull HP bar
 *   - Shield HP bar (if applicable)
 *
 * Updates:
 *   - 'enemyStationDamaged' event → fast bar patch via _updateBarsOnly()
 *   - update() called per frame → hides if station cleared
 */
export class EnemyStationPanel {
  constructor() {
    this._el = document.createElement('div');
    this._el.id = 'enemy-station-panel';
    this._el.style.display = 'none';
    document.getElementById('hud-overlay').appendChild(this._el);

    this._stationId = null;

    // Fast bar update without full re-render
    gameState.on('enemyStationDamaged', ({ stationId }) => {
      if (stationId === this._stationId) this._updateBarsOnly();
    });
  }

  /**
   * Show the panel for a given station.
   * @param {string} stationId
   */
  show(stationId) {
    this._stationId = stationId;
    this._el.style.display = 'block';
    this._render();
  }

  hide() {
    this._stationId = null;
    this._el.style.display = 'none';
  }

  /** Call each frame to auto-hide if station is cleared. */
  update() {
    if (!this._stationId) return;
    const st = gameState.enemyStations?.find(s => s.id === this._stationId);
    if (!st) { this.hide(); return; }
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  _render() {
    const st = gameState.enemyStations?.find(s => s.id === this._stationId);
    if (!st) { this.hide(); return; }

    const hpPct = Math.max(0, Math.min(100, (st.hp / st.maxHP) * 100));
    const shPct = st.shieldMaxHP > 0 ? Math.max(0, Math.min(100, (st.shieldHP / st.shieldMaxHP) * 100)) : 0;
    const phaseColor = PHASE_COLORS[st.phase] ?? '#888';
    const debuff = DEBUFF_TEXT[st.type] ?? '';

    this._el.innerHTML = `
      <div class="esp-header">
        <span class="esp-title">${st.id.replace(/_/g, ' ').toUpperCase()}</span>
        ${st.cleared ? '<span class="esp-cleared-badge">CLEARED</span>' : ''}
        <button class="esp-close-btn">✕</button>
      </div>
      <div class="esp-phase-badge" style="color:${phaseColor}">${(st.phase || 'DORMANT').toUpperCase()}</div>
      ${debuff ? `<div class="esp-debuff-text">${debuff}</div>` : ''}
      <div class="esp-bars">
        <div class="esp-bar-row">
          <span class="esp-bar-label">HULL</span>
          <div class="esp-bar-bg"><div id="esp-hp-fill" class="esp-bar-fill esp-hull-fill" style="width:${hpPct}%"></div></div>
          <span id="esp-hp-val" class="esp-bar-val">${Math.ceil(st.hp)}/${st.maxHP}</span>
        </div>
        ${st.shieldMaxHP > 0 ? `
        <div class="esp-bar-row">
          <span class="esp-bar-label">SHIELD</span>
          <div class="esp-bar-bg"><div id="esp-sh-fill" class="esp-bar-fill esp-shield-fill" style="width:${shPct}%"></div></div>
          <span id="esp-sh-val" class="esp-bar-val">${Math.ceil(st.shieldHP)}/${st.shieldMaxHP}</span>
        </div>` : ''}
      </div>
    `;

    const closeBtn = this._el.querySelector('.esp-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide(), { once: true });
    }
  }

  _updateBarsOnly() {
    const st = gameState.enemyStations?.find(s => s.id === this._stationId);
    if (!st) return;

    const hpFill = document.getElementById('esp-hp-fill');
    const hpVal  = document.getElementById('esp-hp-val');
    const shFill = document.getElementById('esp-sh-fill');
    const shVal  = document.getElementById('esp-sh-val');

    if (hpFill) hpFill.style.width = `${Math.max(0, (st.hp / st.maxHP) * 100)}%`;
    if (hpVal)  hpVal.textContent  = `${Math.ceil(st.hp)}/${st.maxHP}`;
    if (shFill && st.shieldMaxHP > 0) shFill.style.width = `${Math.max(0, (st.shieldHP / st.shieldMaxHP) * 100)}%`;
    if (shVal  && st.shieldMaxHP > 0) shVal.textContent  = `${Math.ceil(st.shieldHP)}/${st.shieldMaxHP}`;
  }
}
