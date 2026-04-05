import { gameState } from '../GameState.js';
import { MILITARY_SHIPS } from '../data/militaryShips.js';
import { TITAN_ULTIMATE_COOLDOWN, EMERGENCY_JUMP_COOLDOWN } from '../data/militaryStats.js';

/**
 * PlayerFleetPanel — shown when the player clicks one of their own fleets in RTS mode.
 *
 * Displays:
 *   - Fleet composition (ship type, count, HP bars)
 *   - Ore supply bar (ammo)
 *   - Energy supply bar (fuel)
 *   - Titan Ultimate button with cooldown bar (when fleet has a Titan)
 *
 * Updates:
 *   - 'fleetSupplyChanged' event → fast bar patch via _updateBarsOnly()
 *   - update() called per frame → _updateTitanButton()
 *   - Hides automatically if the fleet is destroyed
 */
export class PlayerFleetPanel {
  constructor() {
    this._el = document.createElement('div');
    this._el.id = 'player-fleet-panel';
    this._el.style.display = 'none';
    document.getElementById('hud-overlay').appendChild(this._el);

    this._fleetId = null;
    this._onClose = null;
    this._onTitan = null;
    this._onJump = null;

    // Fast supply bar update without full re-render
    gameState.on('fleetSupplyChanged', ({ fleetId }) => {
      if (fleetId === this._fleetId) this._updateBarsOnly();
    });
  }

  /**
   * Show the panel for a given fleet.
   * @param {string} fleetId
   * @param {{ onClose?: function, onTitan?: function, onJump?: function }} opts
   */
  show(fleetId, { onClose, onTitan, onJump } = {}) {
    this._fleetId = fleetId;
    this._onClose = onClose ?? null;
    this._onTitan = onTitan ?? null;
    this._onJump = onJump ?? null;
    this._el.style.display = 'block';
    this._render();
  }

  hide() {
    this._fleetId = null;
    this._el.style.display = 'none';
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  _render() {
    const fleet = gameState.playerFleets.find(f => f.id === this._fleetId);
    if (!fleet) { this.hide(); return; }

    // Group ships by type
    const counts = {};
    for (const ship of fleet.ships) {
      if (ship.hp <= 0) continue;
      if (!counts[ship.type]) counts[ship.type] = { hp: 0, maxHP: 0, count: 0 };
      counts[ship.type].count++;
      counts[ship.type].hp    += ship.hp;
      counts[ship.type].maxHP += ship.maxHP;
    }

    let shipsHTML = '';
    for (const [type, data] of Object.entries(counts)) {
      const def  = MILITARY_SHIPS[type];
      const pct  = data.hp / data.maxHP;
      const col  = pct > 0.5 ? '#44ff44' : pct > 0.25 ? '#ffcc00' : '#ff3333';
      const w    = Math.round(pct * 100);
      shipsHTML += `
        <div class="fleet-ship-row">
          <span class="fleet-ship-icon pfp-icon">${def?.icon ?? '◈'}</span>
          <span class="fleet-ship-name">${(def?.name ?? type).toUpperCase()}${data.count > 1 ? ` ×${data.count}` : ''}</span>
          <span class="fleet-hp-bar"><span class="fleet-hp-fill" style="width:${w}%;background:${col}"></span></span>
        </div>`;
    }
    if (!shipsHTML) shipsHTML = '<div class="fleet-empty">No active ships</div>';

    // Supply bars
    const supply    = fleet.supply;
    const oreAmt    = supply ? supply.ore.amount    : 0;
    const oreMax    = supply ? supply.ore.max       : 1;
    const energyAmt = supply ? supply.energy.amount : 0;
    const energyMax = supply ? supply.energy.max    : 1;
    const orePct    = Math.round(oreAmt    / oreMax    * 100);
    const energyPct = Math.round(energyAmt / energyMax * 100);

    const oreCol    = orePct    > 50 ? '#44ff88' : orePct    > 20 ? '#ffcc00' : '#ff3333';
    const energyCol = energyPct > 50 ? '#44aaff' : energyPct > 20 ? '#ffcc00' : '#ff3333';

    // Titan section
    const hasTitan     = fleet.ships.some(s => s.hp > 0 && s.type === 'titan');
    const cooldown     = fleet.titanCooldown ?? 0;
    const cooldownPct  = Math.max(0, Math.min(100, (1 - cooldown / TITAN_ULTIMATE_COOLDOWN) * 100));
    const titanReady   = cooldown <= 0;
    const titanHTML    = hasTitan ? `
      <div class="pfp-section">
        <div class="fleet-section-title">TITAN ULTIMATE</div>
        <div class="pfp-titan-row">
          <button
            id="pfp-titan-btn"
            class="pfp-titan-btn${titanReady ? '' : ' pfp-titan-btn--cooldown'}"
            ${titanReady ? '' : 'disabled'}
          >☄ UNLEASH</button>
          <span class="pfp-cooldown-bar-wrap">
            <span id="pfp-cd-fill" class="pfp-cooldown-fill" style="width:${cooldownPct}%"></span>
          </span>
        </div>
        <div id="pfp-cd-label" class="pfp-cd-label">${titanReady ? 'READY' : `${Math.ceil(cooldown)}s`}</div>
      </div>` : '';

    // Emergency Jump section
    const jumpCooldown    = fleet.emergencyJumpCooldown ?? 0;
    const jumpReady       = jumpCooldown <= 0;
    const jumpCooldownPct = Math.max(0, Math.min(100, (1 - jumpCooldown / EMERGENCY_JUMP_COOLDOWN) * 100));
    const energyPct2      = fleet.supply ? fleet.supply.energy.amount / fleet.supply.energy.max : 0;
    const jumpEnabled     = jumpReady && energyPct2 > 0.01;

    const planetOptions = gameState.ownedPlanets
      .map(pid => `<option value="${pid}">${pid.toUpperCase()}</option>`).join('');

    const jumpHTML = `
      <div class="pfp-section">
        <div class="fleet-section-title">EMERGENCY JUMP</div>
        <div class="pfp-jump-dest-row">
          <select id="pfp-jump-dest" class="pfp-jump-select">${planetOptions}</select>
        </div>
        <div class="pfp-titan-row">
          <button id="pfp-jump-btn"
            class="pfp-jump-btn${jumpEnabled ? '' : ' pfp-jump-btn--cooldown'}"
            ${jumpEnabled ? '' : 'disabled'}>⚡ JUMP</button>
          <span class="pfp-cooldown-bar-wrap">
            <span id="pfp-jump-fill" class="pfp-cooldown-fill pfp-jump-fill"
                  style="width:${jumpCooldownPct}%"></span>
          </span>
        </div>
        <div id="pfp-jump-label" class="pfp-cd-label">
          ${jumpReady ? (energyPct2 > 0.01 ? 'READY' : 'NO FUEL') : `${Math.ceil(jumpCooldown)}s`}
        </div>
      </div>`;

    // Render
    const stateLabel = { orbiting: 'ORBITING', moving: 'MOVING', engaged: 'ENGAGED' }[fleet.state] ?? fleet.state.toUpperCase();
    const stateCol   = fleet.state === 'engaged' ? '#ff4444' : fleet.state === 'moving' ? '#ffcc44' : '#44ff88';

    this._el.innerHTML = `
      <div class="fleet-panel-header pfp-header">
        <span class="fleet-panel-title pfp-title">⚡ FLEET</span>
        <span class="pfp-state" style="color:${stateCol}">${stateLabel}</span>
        <button class="fleet-panel-close" id="pfp-close-btn">✕</button>
      </div>
      <div class="fleet-section">
        <div class="fleet-section-title">COMPOSITION</div>
        ${shipsHTML}
      </div>
      <div class="pfp-section">
        <div class="fleet-section-title">SUPPLY</div>
        <div class="pfp-supply-row">
          <span class="pfp-supply-label">ORE</span>
          <span class="pfp-supply-bar-wrap">
            <span id="pfp-ore-fill" class="pfp-supply-fill" style="width:${orePct}%;background:${oreCol}"></span>
          </span>
          <span id="pfp-ore-val" class="pfp-supply-val">${Math.floor(oreAmt)}/${Math.floor(oreMax)}</span>
        </div>
        <div class="pfp-supply-row">
          <span class="pfp-supply-label">FUEL</span>
          <span class="pfp-supply-bar-wrap">
            <span id="pfp-energy-fill" class="pfp-supply-fill" style="width:${energyPct}%;background:${energyCol}"></span>
          </span>
          <span id="pfp-energy-val" class="pfp-supply-val">${Math.floor(energyAmt)}/${Math.floor(energyMax)}</span>
        </div>
      </div>
      ${titanHTML}
      ${jumpHTML}
    `;

    // Close button
    const closeBtn = this._el.querySelector('#pfp-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        if (this._onClose) this._onClose();
      }, { once: true });
    }

    // Titan button
    if (hasTitan) {
      const titanBtn = this._el.querySelector('#pfp-titan-btn');
      if (titanBtn) {
        titanBtn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          if (this._onTitan) this._onTitan(this._fleetId);
        }, { once: true });
      }
    }

    // Emergency Jump button
    const jumpBtn = this._el.querySelector('#pfp-jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const dest = this._el.querySelector('#pfp-jump-dest')?.value;
        if (dest && this._onJump) this._onJump(this._fleetId, dest);
      }, { once: true });
    }
  }

  // ─── Fast update helpers ───────────────────────────────────────────────────

  _updateBarsOnly() {
    const fleet = gameState.playerFleets.find(f => f.id === this._fleetId);
    if (!fleet?.supply) return;

    const { ore, energy } = fleet.supply;
    const orePct    = Math.round(ore.amount    / ore.max    * 100);
    const energyPct = Math.round(energy.amount / energy.max * 100);
    const oreCol    = orePct    > 50 ? '#44ff88' : orePct    > 20 ? '#ffcc00' : '#ff3333';
    const energyCol = energyPct > 50 ? '#44aaff' : energyPct > 20 ? '#ffcc00' : '#ff3333';

    const oreFill = this._el.querySelector('#pfp-ore-fill');
    if (oreFill) { oreFill.style.width = `${orePct}%`; oreFill.style.background = oreCol; }

    const energyFill = this._el.querySelector('#pfp-energy-fill');
    if (energyFill) { energyFill.style.width = `${energyPct}%`; energyFill.style.background = energyCol; }

    const oreVal = this._el.querySelector('#pfp-ore-val');
    if (oreVal) oreVal.textContent = `${Math.floor(ore.amount)}/${Math.floor(ore.max)}`;

    const energyVal = this._el.querySelector('#pfp-energy-val');
    if (energyVal) energyVal.textContent = `${Math.floor(energy.amount)}/${Math.floor(energy.max)}`;
  }

  _updateTitanButton() {
    const fleet = gameState.playerFleets.find(f => f.id === this._fleetId);
    if (!fleet) return;

    const btn = this._el.querySelector('#pfp-titan-btn');
    if (!btn) return;

    const cooldown    = fleet.titanCooldown ?? 0;
    const ready       = cooldown <= 0;
    const cooldownPct = Math.max(0, Math.min(100, (1 - cooldown / TITAN_ULTIMATE_COOLDOWN) * 100));

    btn.disabled = !ready;
    btn.classList.toggle('pfp-titan-btn--cooldown', !ready);

    const fill = this._el.querySelector('#pfp-cd-fill');
    if (fill) fill.style.width = `${cooldownPct}%`;

    const label = this._el.querySelector('#pfp-cd-label');
    if (label) label.textContent = ready ? 'READY' : `${Math.ceil(cooldown)}s`;

    // Re-bind click when button transitions to ready (once: true consumed on prev click)
    if (ready && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        delete btn.dataset.bound;
        if (this._onTitan) this._onTitan(this._fleetId);
      }, { once: true });
    } else if (!ready) {
      delete btn.dataset.bound;
    }
  }

  _updateJumpButton() {
    const fleet = gameState.playerFleets.find(f => f.id === this._fleetId);
    if (!fleet) return;

    const btn = this._el.querySelector('#pfp-jump-btn');
    if (!btn) return;

    const jumpCooldown = fleet.emergencyJumpCooldown ?? 0;
    const jumpReady = jumpCooldown <= 0;
    const hasEnergy = fleet.supply
      ? fleet.supply.energy.amount / fleet.supply.energy.max > 0.01
      : false;
    const enabled = jumpReady && hasEnergy;
    const cdPct = Math.max(0, Math.min(100,
      (1 - jumpCooldown / EMERGENCY_JUMP_COOLDOWN) * 100));

    btn.disabled = !enabled;
    btn.classList.toggle('pfp-jump-btn--cooldown', !enabled);

    const fill = this._el.querySelector('#pfp-jump-fill');
    if (fill) fill.style.width = `${cdPct}%`;

    const label = this._el.querySelector('#pfp-jump-label');
    if (label) label.textContent = jumpReady
      ? (hasEnergy ? 'READY' : 'NO FUEL')
      : `${Math.ceil(jumpCooldown)}s`;

    // Re-bind when button transitions back to ready
    if (enabled && !btn.dataset.jumpBound) {
      btn.dataset.jumpBound = '1';
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        delete btn.dataset.jumpBound;
        const dest = this._el.querySelector('#pfp-jump-dest')?.value;
        if (dest && this._onJump) this._onJump(this._fleetId, dest);
      }, { once: true });
    } else if (!enabled) {
      delete btn.dataset.jumpBound;
    }
  }

  /** Call each frame to update button states. */
  update() {
    if (!this._fleetId) return;
    const fleet = gameState.playerFleets.find(f => f.id === this._fleetId);
    if (!fleet) { this.hide(); return; }
    this._updateTitanButton();
    this._updateJumpButton();
  }
}
