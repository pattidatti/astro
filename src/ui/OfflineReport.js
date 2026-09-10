import { PLANETS } from '../game/data/planets.js';
import { AudioManager } from '../game/audio/AudioManager.js';
import { keybindings } from '../game/input/Keybindings.js';
import { fmtCompact, fmtDuration } from './format.js';
import { MAX_OFFLINE_SECONDS } from '../game/systems/OfflineProgress.js';

/**
 * "While you were away" panel.
 *
 * Offline progression is invisible without this: the player returns to bigger
 * numbers and no idea why, or whether being away was worth anything. The panel
 * exists to answer three questions — how long, how much, and what stopped.
 *
 * The last one carries the weight. A silo that filled two hours into an
 * eight-hour absence means six hours produced nothing, and storage, not robots,
 * is the constraint. That is the single most useful thing an idle game can tell
 * a returning player, so it gets its own line per silo rather than a footnote.
 */

const RESOURCE_LABEL = { ore: 'ORE', energy: 'ENERGY', crystal: 'CRYSTAL' };
const RESOURCE_GLYPH = { ore: '⛏', energy: '⚡', crystal: '◈' };

function planetName(id) {
  return PLANETS.find(p => p.id === id)?.name || id.toUpperCase();
}

/**
 * Render the report for a result from `applyOfflineProgress()`.
 * No-op for a null report or one where nothing at all accrued.
 */
export function showOfflineReport(report) {
  if (!report) return;

  const { gained, unlocks, filled, awaySeconds, creditedSeconds, capped } = report;
  const earned = ['ore', 'energy', 'crystal'].filter(r => gained[r] >= 1);
  if (earned.length === 0 && unlocks.length === 0) return;

  const overlay = document.createElement('div');
  overlay.id = 'offline-report';
  overlay.innerHTML = `
    <div class="offline-panel">
      <div class="offline-header">
        <span class="offline-title">WHILE YOU WERE AWAY</span>
        <span class="offline-away">${fmtDuration(awaySeconds)}</span>
      </div>

      ${capped ? `
        <div class="offline-note">
          Production is credited for the first ${fmtDuration(MAX_OFFLINE_SECONDS)} of an absence.
        </div>` : ''}

      <div class="offline-gains">
        ${earned.map(r => `
          <div class="offline-gain offline-gain--${r}">
            <span class="offline-gain-glyph">${RESOURCE_GLYPH[r]}</span>
            <span class="offline-gain-val">+${fmtCompact(gained[r])}</span>
            <span class="offline-gain-label">${RESOURCE_LABEL[r]}</span>
          </div>`).join('')}
      </div>

      ${unlocks.length ? `
        <div class="offline-section">
          <div class="offline-section-title">SURVEYS COMPLETED</div>
          ${unlocks.map(u => `
            <div class="offline-row">
              <span class="offline-row-key">${planetName(u.planetId)}</span>
              <span class="offline-row-val">${RESOURCE_LABEL[u.resource]} ZONE ${u.zones}</span>
            </div>`).join('')}
        </div>` : ''}

      ${filled.length ? `
        <div class="offline-section offline-section--warn">
          <div class="offline-section-title">STORAGE FILLED — PRODUCTION STOPPED</div>
          ${filled.map(f => `
            <div class="offline-row">
              <span class="offline-row-key">${planetName(f.planetId)} ${RESOURCE_LABEL[f.resource]}</span>
              <span class="offline-row-val">full after ${fmtDuration(f.afterSeconds)}</span>
            </div>`).join('')}
          <div class="offline-hint">Expand storage to keep earning through a longer absence.</div>
        </div>` : ''}

      <button class="offline-btn" id="offline-dismiss">RESUME COMMAND</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    keybindings.popModal('offline-report');
    overlay.classList.remove('offline-report--visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    // Fallback for browsers that skip the transition on a hidden tab.
    setTimeout(() => overlay.remove(), 600);
  };

  overlay.querySelector('#offline-dismiss').addEventListener('click', () => {
    AudioManager.play('UI_CLICK');
    close();
  });
  overlay.addEventListener('pointerdown', (e) => { if (e.target === overlay) close(); });
  keybindings.pushModal('offline-report', close);

  requestAnimationFrame(() => overlay.classList.add('offline-report--visible'));
}
