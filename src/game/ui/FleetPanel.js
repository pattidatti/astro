import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';

const THREAT_LABELS = ['MINIMAL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

function fmtEta(seconds) {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function threatLabel(level) {
  const idx = Math.min(Math.floor(level) - 1, THREAT_LABELS.length - 1);
  return THREAT_LABELS[Math.max(0, idx)];
}

function threatDots(level) {
  const max  = 5;
  const fill = Math.min(Math.ceil(level), max);
  return '●'.repeat(fill) + '○'.repeat(max - fill);
}

function hpBarHTML(pct) {
  const col = pct > 0.5 ? '#44ff44' : pct > 0.25 ? '#ffcc00' : '#ff3333';
  const w   = Math.round(pct * 100);
  return `<span class="fleet-hp-bar"><span class="fleet-hp-fill" style="width:${w}%;background:${col}"></span></span>`;
}

const SHIP_ICONS = {
  interceptor: '◈',
  bomber:      '◆',
  raider:      '◉',
  mothership:  '⬡',
};

/**
 * FleetPanel — floating info panel shown when a roaming fleet is clicked.
 *
 * Renders fleet composition, threat level, destination and ETA.
 * Updates each frame via update().
 */
export class FleetPanel {
  constructor() {
    this._el = document.createElement('div');
    this._el.id = 'fleet-panel';
    this._el.style.display = 'none';
    document.getElementById('hud-overlay').appendChild(this._el);

    this._fleetId = null;
    this._onClose = null;
  }

  show(fleetId, onClose) {
    this._fleetId = fleetId;
    this._onClose = onClose ?? null;
    this._el.style.display = 'block';
    this._render();
  }

  hide() {
    this._fleetId = null;
    this._el.style.display = 'none';
  }

  /** Call each frame to refresh HP bars and ETA. */
  update() {
    if (!this._fleetId) return;
    const fleet = gameState.roamingFleets.find(f => f.id === this._fleetId);
    if (!fleet) { this.hide(); return; }
    this._render();
  }

  _render() {
    const fleet = gameState.roamingFleets.find(f => f.id === this._fleetId);
    if (!fleet) { this.hide(); return; }

    const toDef  = PLANETS.find(p => p.id === fleet.toPlanet);
    const eta    = Math.max(0, (1 - fleet.position) / fleet.speed);
    const label  = fleet.type === 'invasion' ? 'INVASION FLEET' : 'SCOUT FLEET';
    const tLabel = threatLabel(fleet.threatLevel);
    const tDots  = threatDots(fleet.threatLevel);

    // Group enemies by type for compact display
    const counts = {};
    for (const e of fleet.enemies) {
      if (e.hp <= 0) continue;
      counts[e.type] = (counts[e.type] || { count: 0, hp: 0, maxHP: 0 });
      counts[e.type].count++;
      counts[e.type].hp    += e.hp;
      counts[e.type].maxHP += e.maxHP;
    }

    let shipsHTML = '';
    for (const [type, data] of Object.entries(counts)) {
      const pct  = data.hp / data.maxHP;
      const icon = SHIP_ICONS[type] ?? '◈';
      shipsHTML += `
        <div class="fleet-ship-row">
          <span class="fleet-ship-icon">${icon}</span>
          <span class="fleet-ship-name">${type.toUpperCase()}${data.count > 1 ? ` ×${data.count}` : ''}</span>
          ${hpBarHTML(pct)}
        </div>`;
    }

    if (fleet.mothership && fleet.mothership.hp > 0) {
      const pct = fleet.mothership.hp / fleet.mothership.maxHP;
      shipsHTML = `
        <div class="fleet-ship-row fleet-mothership-row">
          <span class="fleet-ship-icon">⬡</span>
          <span class="fleet-ship-name">MOTHERSHIP</span>
          ${hpBarHTML(pct)}
        </div>` + shipsHTML;
    }

    if (!shipsHTML) shipsHTML = '<div class="fleet-empty">No active ships</div>';

    const isTargeting = gameState.ownedPlanets.includes(fleet.toPlanet) && fleet.toPlanet !== 'xerion';
    const destColor   = isTargeting ? '#ff4444' : 'var(--dune-text-secondary)';

    this._el.innerHTML = `
      <div class="fleet-panel-header">
        <span class="fleet-panel-title">⚔ ${label}</span>
        <button class="fleet-panel-close" id="fleet-close-btn">✕</button>
      </div>
      <div class="fleet-section">
        <div class="fleet-section-title">COMPOSITION</div>
        ${shipsHTML}
      </div>
      <div class="fleet-section">
        <div class="fleet-info-row">
          <span class="fleet-info-label">THREAT</span>
          <span class="fleet-info-val fleet-threat-dots">${tDots}</span>
          <span class="fleet-info-val fleet-threat-label" data-level="${fleet.threatLevel}">${tLabel}</span>
        </div>
        <div class="fleet-info-row">
          <span class="fleet-info-label">DESTINATION</span>
          <span class="fleet-info-val" style="color:${destColor}">${toDef?.name ?? fleet.toPlanet}</span>
        </div>
        <div class="fleet-info-row">
          <span class="fleet-info-label">ETA</span>
          <span class="fleet-info-val">~${fmtEta(eta)}</span>
        </div>
      </div>
    `;

    // Close button
    const closeBtn = this._el.querySelector('#fleet-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        if (this._onClose) this._onClose();
      }, { once: true });
    }
  }
}
