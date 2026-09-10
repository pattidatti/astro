import { gameState } from '../game/GameState.js';
import { PLANETS } from '../game/data/planets.js';
import { AudioManager } from '../game/audio/AudioManager.js';
import { keybindings } from '../game/input/Keybindings.js';
import { fmtCompact, fmtDuration } from './format.js';

/**
 * Endgame screen.
 *
 * The game could be finished — every planet colonised, every enemy station
 * destroyed — and nothing would happen. The last station fell, a toast said
 * STATION DESTROYED, and the galaxy went quiet with no acknowledgement that the
 * player had just completed it. This is that acknowledgement.
 *
 * It is not a game over. The economy keeps running behind the screen and
 * dismissing it returns to a galaxy that is simply now entirely the player's,
 * which is the right ending for an idle game: the reward for finishing is the
 * empire, not a credits roll.
 */

function statRow(label, value) {
  return `<div class="victory-stat"><span class="victory-stat-label">${label}</span>`
       + `<span class="victory-stat-val">${value}</span></div>`;
}

/** Render the victory screen. Idempotent — a second call while it is up is a no-op. */
export function showVictoryScreen() {
  if (document.getElementById('victory-screen')) return;

  const s = gameState.stats;
  const overlay = document.createElement('div');
  overlay.id = 'victory-screen';
  overlay.innerHTML = `
    <div class="victory-panel">
      <div class="victory-eyebrow">GALACTIC EXTRACTION COMPLETE</div>
      <h1 class="victory-title">GALACTIC DOMINION</h1>
      <p class="victory-blurb">
        All ${PLANETS.length} worlds are yours and every enemy station has been reduced to wreckage.
        The galaxy answers to you, Commander.
      </p>

      <div class="victory-stats">
        <div class="victory-stat-group">
          <div class="victory-group-title">CAMPAIGN</div>
          ${statRow('PLANETS COLONISED', `${gameState.ownedPlanets.length} / ${PLANETS.length}`)}
          ${statRow('STATIONS DESTROYED', `${(gameState.enemyStations || []).length} / ${(gameState.enemyStations || []).length}`)}
          ${statRow('TIME TO DOMINION', fmtDuration(s.playTimeSeconds))}
        </div>
        <div class="victory-stat-group">
          <div class="victory-group-title">EXTRACTION</div>
          ${statRow('ORE', fmtCompact(s.totalOreProduced))}
          ${statRow('ENERGY', fmtCompact(s.totalEnergyProduced))}
          ${statRow('CRYSTAL', fmtCompact(s.totalCrystalProduced))}
        </div>
        <div class="victory-stat-group">
          <div class="victory-group-title">LOGISTICS</div>
          ${statRow('ROBOTS HIRED', s.totalRobotsHired.toLocaleString())}
          ${statRow('CARGO RUNS', s.totalShipDeliveries.toLocaleString())}
          ${statRow('RESOURCES SHIPPED', fmtCompact(s.totalResourcesShipped))}
        </div>
      </div>

      <button class="victory-btn" id="victory-continue">CONTINUE PLAYING</button>
      <div class="victory-footer">Your empire keeps running. Nothing is left to fight.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => {
    keybindings.popModal('victory');
    overlay.classList.remove('victory-screen--visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    setTimeout(() => overlay.remove(), 900);
  };

  overlay.querySelector('#victory-continue').addEventListener('click', () => {
    AudioManager.play('UI_CLICK');
    close();
  });
  keybindings.pushModal('victory', close);

  requestAnimationFrame(() => overlay.classList.add('victory-screen--visible'));
}

/**
 * Wire the screen to the state.
 *
 * Also runs one check on startup: a save can already satisfy the condition —
 * from a session that ended before this screen existed, or one where the final
 * station fell as the tab closed.
 */
export function installVictoryScreen() {
  gameState.on('victory', () => showVictoryScreen());
  gameState.checkVictory();
}
