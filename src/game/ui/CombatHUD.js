import { gameState } from '../GameState.js';
import { PLANETS } from '../data/planets.js';

const ALERT_DURATION = 4000; // ms

/**
 * Combat HUD overlay — alert banners, threat indicators.
 * Creates and manages DOM elements for combat notifications.
 */
export class CombatHUD {
  constructor() {
    this._alertEl = null;
    this._alertTimeout = null;
    this._createDOM();
    this._setupEvents();
  }

  _createDOM() {
    // Alert banner container
    this._alertEl = document.createElement('div');
    this._alertEl.id = 'combat-alert';
    this._alertEl.className = 'combat-alert';
    document.body.appendChild(this._alertEl);

    // Combat summary (small floating info when under attack)
    this._summaryEl = document.createElement('div');
    this._summaryEl.id = 'combat-summary';
    this._summaryEl.className = 'combat-summary';
    document.body.appendChild(this._summaryEl);
  }

  _setupEvents() {
    gameState.on('attackStarted', ({ attack, planetId, type }) => {
      const planet = PLANETS.find(p => p.id === planetId);
      const name = planet?.name || planetId;
      if (type === 'invasion') {
        this.showAlert(`⚠ INVASION INCOMING — ${name}`, 'invasion');
      } else {
        this.showAlert(`⚠ RAID DETECTED — ${name}`, 'raid');
      }
    });

    gameState.on('attackEnded', ({ planetId, reason }) => {
      const planet = PLANETS.find(p => p.id === planetId);
      const name = planet?.name || planetId;
      if (reason === 'victory') {
        this.showAlert(`✓ THREAT NEUTRALIZED — ${name}`, 'victory');
      }
    });

    gameState.on('planetFell', (planetId) => {
      const planet = PLANETS.find(p => p.id === planetId);
      const name = planet?.name || planetId;
      this.showAlert(`✖ STATION DESTROYED — ${name}`, 'fall');
    });

    gameState.on('cargoIntercepted', ({ ship, lane }) => {
      this.showAlert(`⚠ CARGO INTERCEPTED — ${ship.resource.toUpperCase()}`, 'raid');
    });

    gameState.on('patrolSpawned', () => {
      // Subtle notification, no alert banner
    });

    // ── Fleet combat alerts ──
    gameState.on('fleetEngaged', ({ restored }) => {
      if (!restored) {
        this.showAlert('⚔ FLEET ENGAGED — COMBAT INITIATED', 'raid');
      }
    });

    gameState.on('fleetDisengaged', ({ reason }) => {
      if (reason === 'victory') {
        this.showAlert('✓ ENEMY FLEET DESTROYED', 'victory');
      } else if (reason === 'destroyed') {
        this.showAlert('✖ FLEET LOST', 'fall');
      } else if (reason === 'retreat') {
        this.showAlert('⟵ FLEET RETREATING', 'raid');
      }
    });

    gameState.on('militaryBaseDestroyed', ({ planetId }) => {
      const planet = PLANETS.find(p => p.id === planetId);
      const name = planet?.name || planetId;
      this.showAlert(`✖ MILITARY BASE DESTROYED — ${name}`, 'fall');
    });
  }

  /**
   * Show an alert banner at the top of the screen.
   */
  showAlert(text, type = 'raid') {
    this._alertEl.textContent = text;
    this._alertEl.className = `combat-alert visible ${type}`;

    clearTimeout(this._alertTimeout);
    this._alertTimeout = setTimeout(() => {
      this._alertEl.classList.remove('visible');
    }, ALERT_DURATION);
  }

  /**
   * Update combat summary info (called per frame by HUDBridge).
   */
  updateSummary() {
    const attacks = gameState.activeAttacks;
    if (attacks.length === 0) {
      this._summaryEl.classList.remove('visible');
      return;
    }

    // Show summary of all active attacks
    let html = '';
    for (const attack of attacks) {
      const planet = PLANETS.find(p => p.id === attack.planetId);
      const name = planet?.name || attack.planetId;
      const aliveCount = attack.enemies.filter(e => e.hp > 0).length;
      const ps = gameState.getPlanetState(attack.planetId);
      const hpPct = ps ? Math.round((ps.combat.stationHP / ps.combat.stationMaxHP) * 100) : 0;

      const typeIcon = attack.type === 'invasion' ? '👾' : '⚔';
      html += `
        <div class="combat-summary-row">
          <span>${typeIcon} ${name}</span>
          <span>ENEMIES: ${aliveCount}${attack.mothership?.hp > 0 ? ' +MS' : ''}</span>
          <span>HULL: ${hpPct}%</span>
        </div>
      `;
    }

    this._summaryEl.innerHTML = html;
    this._summaryEl.classList.add('visible');
  }
}
