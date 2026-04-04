import { gameState } from '../GameState.js';
import { DEFENSE_TYPES, DEFENSE_UPGRADES, ACTIVE_ABILITIES, BASE_STATION_HP } from '../data/defenses.js';
import { scaleThreat } from '../data/enemies.js';
import { AudioManager } from '../audio/AudioManager.js';

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

/**
 * Renders the defense section inside the right panel.
 * Called by PlanetPanel._renderAll().
 */
export class DefensePanel {
  constructor() {
    this._el = null;
  }

  /**
   * Render defense UI into a container element.
   * @param {HTMLElement} container - The DOM element to render into
   * @param {string} planetId - Current planet ID
   */
  render(container, planetId) {
    const ps = gameState.getPlanetState(planetId);
    if (!ps || !ps.hasBase) {
      container.innerHTML = '';
      return;
    }

    const combat = ps.combat;
    const threatLevel = scaleThreat(gameState.ownedPlanets.length, planetId);
    const isUnderAttack = gameState.isUnderAttack(planetId);

    let html = '';

    // ── Station Status ──
    html += `<div class="panel-section-title">STATION STATUS</div>`;
    html += this._renderStatusBars(combat, isUnderAttack, threatLevel);

    // ── Defenses ──
    html += `<div class="panel-section-title" style="margin-top:12px">DEFENSES</div>`;
    html += this._renderDefenseGrid(planetId, combat);

    // ── Defense Upgrades ──
    const ownedDefenses = Object.entries(combat.defenses).filter(([, lv]) => lv > 0);
    const defUpgHtml = ownedDefenses.length > 0 ? this._renderDefenseUpgrades(planetId, combat) : '';
    if (defUpgHtml) {
      html += `<div class="panel-section-title" style="margin-top:12px">DEFENSE UPGRADES</div>`;
      html += defUpgHtml;
    }

    // ── Active Abilities ──
    if (ownedDefenses.length > 0) {
      html += `<div class="panel-section-title" style="margin-top:12px">ABILITIES</div>`;
      html += this._renderAbilities(planetId, combat);
    }

    container.innerHTML = html;
    this._bindEvents(container, planetId);
  }

  _renderStatusBars(combat, isUnderAttack, threatLevel) {
    const hpPct = Math.round((combat.stationHP / combat.stationMaxHP) * 100);
    const hpColor = hpPct > 60 ? '#44ff44' : (hpPct > 30 ? '#ffcc00' : '#ff3333');

    let shieldHtml = '';
    if (combat.shieldMaxHP > 0) {
      const shieldPct = Math.round((combat.shieldHP / combat.shieldMaxHP) * 100);
      shieldHtml = `
        <div class="defense-status-row">
          <span class="defense-label">🔵 SHIELD</span>
          <div class="defense-bar-track">
            <div class="defense-bar-fill shield-bar" style="width:${shieldPct}%"></div>
          </div>
          <span class="defense-value">${Math.floor(combat.shieldHP)}/${combat.shieldMaxHP}</span>
        </div>
      `;
    }

    const threatColor = threatLevel <= 2 ? '#44ff44' : (threatLevel <= 5 ? '#ffcc00' : (threatLevel <= 7 ? '#ff8800' : '#ff3333'));
    const attackBadge = isUnderAttack ? '<span class="combat-badge pulse">⚠ UNDER ATTACK</span>' : '';

    return `
      <div class="defense-status">
        ${attackBadge}
        <div class="defense-status-row">
          <span class="defense-label">❤ HULL</span>
          <div class="defense-bar-track">
            <div class="defense-bar-fill hull-bar" style="width:${hpPct}%;background:${hpColor}"></div>
          </div>
          <span class="defense-value">${Math.floor(combat.stationHP)}/${combat.stationMaxHP}</span>
        </div>
        ${shieldHtml}
        <div class="defense-status-row">
          <span class="defense-label">☠ THREAT</span>
          <span class="defense-value" style="color:${threatColor}">LV.${threatLevel}</span>
        </div>
      </div>
    `;
  }

  _renderDefenseGrid(planetId, combat) {
    // Map from DEFENSE_TYPES key → tech tree node ID
    const DEFENSE_TECH_MAP = {
      cannon:      'cannon',       // free, always shows
      satellite:   'satellite',
      defenseShip: 'patrol_craft', // internal id differs from tech node id
      shield:      'shield',
    };

    let html = '<div class="hire-grid">';

    for (const [id, def] of Object.entries(DEFENSE_TYPES)) {
      if (!gameState.isTechUnlocked(DEFENSE_TECH_MAP[id])) continue;
      const level = combat.defenses[id] || 0;
      const maxed = level >= def.maxLevel;
      
      const cost = gameState.getDefenseCost(planetId, id);
      const energyCost = cost?.energy || 0;
      const oreCost    = cost?.ore    || 0;
      
      const canEnergy = maxed || energyCost <= 0 || gameState.siloHas(planetId, 'energy', energyCost);
      const canOre    = maxed || oreCost <= 0    || gameState.siloHas(planetId, 'ore',    oreCost);
      const canAfford = canEnergy && canOre;

      let costStr = '';
      if (!maxed) {
        if (oreCost > 0)    costStr += `<span class="${canOre ? '' : 'cant'}">⬡${fmt(oreCost)}</span>`;
        if (energyCost > 0) costStr += (costStr ? ' ' : '') + `<span class="${canEnergy ? '' : 'cant'}">⚡${fmt(energyCost)}</span>`;
      }

      html += `
        <button class="hire-btn${maxed ? ' maxed' : ''}"
                data-defense-id="${id}"
                ${!maxed && !canAfford ? 'disabled' : ''}>
          <span class="hire-btn-icon">${def.icon}</span>
          <span class="hire-btn-name">${def.name}</span>
          <span class="hire-btn-count">${level > 0 ? 'LV.' + level : '—'}</span>
          <span class="hire-btn-cost">${maxed ? '✓ MAX' : costStr}</span>
        </button>
      `;
    }

    html += '</div>';
    return html;
  }

  _renderDefenseUpgrades(planetId, combat) {
    const DEFENSE_UPG_TECH_MAP = {
      cannon:      'cannon_upgrades',
      satellite:   'satellite_upgrades',
      defenseShip: 'patrol_upgrades',
      shield:      'shield_upgrades',
    };

    let rows = '';

    for (const upg of DEFENSE_UPGRADES) {
      const defLevel = combat.defenses[upg.defenseType] || 0;
      if (defLevel <= 0) continue;
      // Also require the upgrade category to be unlocked
      if (!gameState.isTechUnlocked(DEFENSE_UPG_TECH_MAP[upg.defenseType])) continue;

      const level = combat.defenseLevels[upg.id] || 0;
      const maxed = level >= upg.maxLevel;
      
      const cost = gameState.getDefenseUpgradeCost(planetId, upg.id);
      const energyCost = cost?.energy || 0;
      const oreCost    = cost?.ore    || 0;

      const canEnergy = maxed || energyCost <= 0 || gameState.siloHas(planetId, 'energy', energyCost);
      const canOre    = maxed || oreCost <= 0    || gameState.siloHas(planetId, 'ore',    oreCost);
      const canAfford = canEnergy && canOre;

      let costStr = '';
      if (!maxed) {
        if (oreCost > 0)    costStr += `<span class="${canOre ? '' : 'cant'}">⬡${fmt(oreCost)}</span>`;
        if (energyCost > 0) costStr += (costStr ? ' ' : '') + `<span class="${canEnergy ? '' : 'cant'}">⚡${fmt(energyCost)}</span>`;
      }

      rows += `
        <div class="defense-upg-row">
          <span class="defense-upg-name">${upg.icon} ${upg.name}</span>
          <span class="defense-upg-level">${level}/${upg.maxLevel}</span>
          ${!maxed ? `
            <button class="defense-upg-btn${canAfford ? '' : ' cant-afford'}"
                    data-upgrade-id="${upg.id}" ${canAfford ? '' : 'disabled'}>
              ${costStr}
            </button>
          ` : '<span class="defense-maxed-sm">MAX</span>'}
        </div>
      `;
    }

    if (!rows) return ''; // nothing visible — caller skips the section title
    return `<div class="defense-upgrades">${rows}</div>`;
  }

  _renderAbilities(planetId, combat) {
    let html = '<div class="ability-grid">';

    for (const [id, ability] of Object.entries(ACTIVE_ABILITIES)) {
      const cooldown = combat.abilityCooldowns[id] || 0;
      const onCooldown = cooldown > 0;
      const canAfford = gameState.siloHas(planetId, 'energy', ability.energyCost);
      const isUnderAttack = gameState.isUnderAttack(planetId);
      const canUse = !onCooldown && canAfford && isUnderAttack;

      const cooldownPct = onCooldown ? Math.round((cooldown / ability.cooldown) * 100) : 0;

      html += `
        <button class="ability-btn${canUse ? '' : ' disabled'}"
                data-ability-id="${id}" ${canUse ? '' : 'disabled'}>
          <div class="ability-icon">${ability.icon}</div>
          <div class="ability-name">${ability.name}</div>
          <div class="ability-cost">⚡${ability.energyCost}</div>
          ${onCooldown ? `
            <div class="ability-cooldown-overlay" style="background:conic-gradient(transparent ${100-cooldownPct}%, rgba(0,0,0,0.6) ${100-cooldownPct}%)"></div>
            <div class="ability-cooldown-text">${Math.ceil(cooldown)}s</div>
          ` : ''}
        </button>
      `;
    }

    html += '</div>';
    return html;
  }

  _bindEvents(container, planetId) {
    // Defense buy buttons
    container.querySelectorAll('[data-defense-id]').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const defenseId = btn.dataset.defenseId;
        if (gameState.buyDefense(planetId, defenseId)) {
          AudioManager.play('BASE_UPGRADED');
        }
      });
    });

    // Defense upgrade buttons
    container.querySelectorAll('.defense-upg-btn').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const upgradeId = btn.dataset.upgradeId;
        if (gameState.buyDefenseUpgrade(planetId, upgradeId)) {
          AudioManager.play('ROBOT_UPGRADED');
        }
      });
    });

    // Ability buttons
    container.querySelectorAll('.ability-btn').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const abilityId = btn.dataset.abilityId;
        if (gameState.activateAbility(planetId, abilityId)) {
          AudioManager.play('BASE_UPGRADED');
        }
      });
    });
  }
}

function isActive(level) {
  return level > 0;
}
