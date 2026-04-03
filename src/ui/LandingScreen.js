import { hasLocalSave, getAllLocalSaves, deleteLocalSave } from '../storage.js';
import { getCurrentUser, isGoogleUser, upgradeToGoogle } from '../auth.js';
import { loadFromFirestore, getAllCloudSaves } from '../db.js';
import { isFirebaseConfigured } from '../firebase.js';
import { AudioManager } from '../game/audio/AudioManager.js';
import { gameState } from '../game/GameState.js';

function fmtOre(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

function fmtDate(ts) {
  if (!ts) return 'unknown date';
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
}

function fmtTime(secs) {
  if (!secs) return '0s';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const sec = Math.floor(secs % 60);
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function getTotalOre(save) {
  if (!save) return 0;
  if (save.planetState) {
    return Object.values(save.planetState).reduce((acc, p) => acc + (p.silos?.ore?.amount || 0), 0);
  }
  return save.ore || 0;
}

export class LandingScreen {
  // inGame: true = pause menu mode (shows RESUME instead of CONTINUE)
  constructor({ inGame = false } = {}) {
    this._inGame = inGame;
    this._resolve = null;
    this._newGamePending = false;
    this._newGameTimer = null;
    this._subpanelTimer = null;
    this._onKeyDown = (e) => { if (e.key === 'Escape') this._handleResume(); };
    this._overlay = this._buildDOM();
    document.body.appendChild(this._overlay);
    document.addEventListener('keydown', this._onKeyDown);
    const hud = document.getElementById('hud-overlay');
    if (hud) hud.style.display = 'none';
  }

  _buildDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'landing-overlay';

    const continueLabel = this._inGame ? 'RESUME' : 'CONTINUE';
    const continueSub = this._inGame ? 'Return to game' : 'Loading...';

    overlay.innerHTML = `
      <div id="landing-bg-gradient"></div>
      <div id="landing-scanlines"></div>
      <div id="landing-content">
        <div id="landing-logo">
          <div class="landing-logo-hex">&#x2B22;</div>
          <h1 class="landing-title">ASTRO HARVEST</h1>
          <div class="landing-subtitle">Galactic Extraction</div>
          <div class="landing-version">v1.0</div>
        </div>
        <nav id="landing-nav">
          <button class="landing-btn" id="btn-play">
            ${this._inGame ? 'RESUME' : 'PLAY'}
            <span class="landing-btn-sub" id="btn-play-sub">${this._inGame ? 'Return to game' : 'Start your journey'}</span>
          </button>
          <button class="landing-btn" id="btn-slots">
            SAVE SLOTS
            <span class="landing-btn-sub">Load, start new, or delete</span>
          </button>
          <button class="landing-btn" id="btn-settings">
            SETTINGS
            <span class="landing-btn-sub">Audio, graphics &amp; more</span>
          </button>
          <button class="landing-btn" id="btn-stats">
            STATISTICS
            <span class="landing-btn-sub">View your progress</span>
          </button>
          <button class="landing-btn" id="btn-login">
            LOGIN WITH GOOGLE
            <span class="landing-btn-sub">Link account for cloud saves</span>
          </button>
        </nav>
        <div id="landing-subpanel"></div>
        <div id="landing-footer">
          <span class="landing-footer-l" id="footer-left">SAVE: LOCAL ONLY</span>
          <span class="landing-footer-r" id="footer-right">ANONYMOUS</span>
        </div>
      </div>
    `;

    return overlay;
  }

  async init() {
    const btnPlay = document.getElementById('btn-play');
    const btnPlaySub = document.getElementById('btn-play-sub');

    if (this._inGame) {
      btnPlay.classList.add('landing-btn-primary');
      btnPlaySub.textContent = 'Return to game  [ESC]';
    } else {
      btnPlay.classList.add('landing-btn-primary');
      const saves = getAllLocalSaves();
      if (saves.slot_1 || saves.slot_2 || saves.slot_3) {
         btnPlaySub.textContent = 'Select a save slot';
      } else {
         btnPlaySub.textContent = 'No saves — start a new game';
      }
    }

    // Login button — hide if already Google user
    if (isGoogleUser()) {
      document.getElementById('btn-login').style.display = 'none';
    }

    // If boot mode, no local save, no Firebase
    if (!this._inGame && !isFirebaseConfigured()) {
      const saves = getAllLocalSaves();
      if (!saves.slot_1 && !saves.slot_2 && !saves.slot_3) {
        document.getElementById('btn-slots').classList.add('landing-btn-primary');
      }
    }

    this._updateFooter();
    this._attachListeners();
  }

  _attachListeners() {
    const menuClick = () => { AudioManager.unlock(); AudioManager.play('UI_MENU_CLICK'); };
    document.getElementById('btn-play').addEventListener('click', () => { menuClick(); this._handleResume(); });
    document.getElementById('btn-slots').addEventListener('click', () => { menuClick(); this._showSaveSlotsPanel(); });
    document.getElementById('btn-settings').addEventListener('click', () => { menuClick(); this._showSettingsPanel(); });
    document.getElementById('btn-stats').addEventListener('click', () => { menuClick(); this._showStatisticsPanel(); });
    document.getElementById('btn-login').addEventListener('click', () => { menuClick(); this._handleLogin(); });
  }

  show() {
    requestAnimationFrame(() => {
      this._overlay.classList.add('landing-visible');
    });
  }

  waitForChoice() {
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  _dismiss() {
    clearTimeout(this._newGameTimer);
    document.removeEventListener('keydown', this._onKeyDown);
    this._overlay.classList.add('landing-exit');
    const hud = document.getElementById('hud-overlay');
    if (hud) {
      hud.style.display = '';
      hud.style.visibility = '';
    }
    this._overlay.addEventListener('transitionend', () => {
      this._overlay.remove();
    }, { once: true });
  }

  // Resume / Play
  _handleResume() {
    if (this._inGame) {
      this._resolve({ action: 'resume' });
      this._dismiss();
    } else {
      this._showSaveSlotsPanel();
    }
  }

  _showSaveSlotsPanel(cloudMode = false) {
    const panel = this._prepareSubPanel();
    panel.innerHTML = `
      <div class="landing-panel-box" style="width: 450px;">
        <div class="landing-panel-title">SAVE SLOTS</div>
        <div class="landing-spinner"></div>
      </div>
    `;
    panel.classList.add('open');

    const saves = getAllLocalSaves();
    let slotsHTML = '';

    for (let i = 1; i <= 3; i++) {
        const slot = 'slot_' + i;
        const save = saves[slot];
        if (save) {
            const ore = getTotalOre(save);
            const playTime = save.stats ? save.stats.playTimeSeconds : 0;
            const planets = save.ownedPlanets ? save.ownedPlanets.length : 1;
            const ts = save.lastSaved || save.timestamp;

            slotsHTML += `
              <div class="landing-save-card" style="margin-bottom: 12px; position: relative;">
                <div class="landing-save-meta">SLOT ${i}</div>
                <div class="landing-save-ore">${fmtOre(ore)} ORE</div>
                <div class="landing-save-meta">Planets: ${planets}/8 &nbsp;|&nbsp; Playtime: ${fmtTime(playTime)}</div>
                <div class="landing-save-meta">Last saved: ${fmtDate(ts)}</div>
                <div style="margin-top: 10px; display: flex; gap: 8px;">
                  <button class="landing-btn-load" data-slot="${slot}" style="flex:1;">LOAD</button>
                  <button class="landing-btn-delete" data-slot="${slot}" style="padding: 10px; background: rgba(255,50,50,0.1); border: 1px solid #ff3333; color: #ff3333; cursor: pointer; text-transform: uppercase;">DELETE</button>
                </div>
              </div>
            `;
        } else {
            slotsHTML += `
              <div class="landing-save-card" style="margin-bottom: 12px; opacity: 0.6; text-align: center; padding: 20px;">
                <div class="landing-save-meta">SLOT ${i}</div>
                <div style="margin: 10px 0;">-- EMPTY --</div>
                <div style="margin-top: 10px;">
                  <button class="landing-btn-new" data-slot="${slot}" style="padding: 10px 20px; background: rgba(50,255,50,0.1); border: 1px solid #33ff33; color: #33ff33; cursor: pointer; text-transform: uppercase; width: 100%;">NEW GAME</button>
                </div>
              </div>
            `;
        }
    }

    panel.innerHTML = `
      <div class="landing-panel-box" style="width: 450px;">
        <div class="landing-panel-title">SAVE SLOTS</div>
        <div style="max-height: 50vh; overflow-y: auto; overflow-x: hidden; padding-right: 8px;" class="slots-container">
          ${slotsHTML}
        </div>
        <button class="landing-btn-back" id="panel-back">BACK</button>
      </div>
    `;

    panel.querySelectorAll('.landing-btn-load').forEach(b => b.addEventListener('click', (e) => {
        AudioManager.play('UI_CONFIRM');
        this._resolve({ action: 'load', slot: e.target.dataset.slot });
        this._dismiss();
    }));

    panel.querySelectorAll('.landing-btn-new').forEach(b => b.addEventListener('click', (e) => {
        AudioManager.play('UI_CONFIRM');
        this._resolve({ action: 'newgame', slot: e.target.dataset.slot });
        this._dismiss();
    }));

    panel.querySelectorAll('.landing-btn-delete').forEach(b => b.addEventListener('click', (e) => {
        if (!b.classList.contains('confirming')) {
            b.classList.add('confirming');
            b.textContent = 'CONFIRM?';
            b.style.background = 'rgba(255,0,0,0.3)';
            setTimeout(() => { 
                if (b && document.body.contains(b)) { 
                    b.classList.remove('confirming'); 
                    b.textContent = 'DELETE'; 
                    b.style.background = 'rgba(255,50,50,0.1)'; 
                } 
            }, 3000);
        } else {
            AudioManager.play('UI_MENU_CLICK');
            deleteLocalSave(b.dataset.slot);
            this._showSaveSlotsPanel();
        }
    }));

    document.getElementById('panel-back').addEventListener('click', () => this._closeSubPanel());
  }

  async _handleLogin() {
    const btn = document.getElementById('btn-login');
    const footerRight = document.getElementById('footer-right');
    btn.disabled = true;
    btn.querySelector('.landing-btn-sub').textContent = 'Opening Google sign-in...';

    const user = await upgradeToGoogle();
    if (user) {
      btn.style.display = 'none';
      this._updateFooter();
    } else {
      btn.disabled = false;
      btn.querySelector('.landing-btn-sub').textContent = 'Link account for cloud saves';
      footerRight.textContent = 'LOGIN FAILED';
      footerRight.classList.add('landing-footer-error');
      setTimeout(() => {
        footerRight.classList.remove('landing-footer-error');
        this._updateFooter();
      }, 3000);
    }
  }

;

  _showSettingsPanel() {
    const panel = this._prepareSubPanel();
    const muted      = AudioManager.isMuted();
    const vol        = AudioManager.getVolume();
    const musicVol   = AudioManager.getMusicVolume();
    const sfxVol     = AudioManager.getSfxVolume();

    const renderVol = (v) => Math.round(v * 100) + '%';

    panel.innerHTML = `
      <div class="landing-panel-box">
        <div class="landing-panel-title">SETTINGS</div>

        <div class="landing-section-title">AUDIO</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">MASTER</span>
          <div class="landing-setting-controls">
            <input type="range" id="audio-master-slider" class="landing-slider" min="0" max="1" step="0.05" value="${vol}">
            <span id="audio-master-val" class="landing-setting-val">${renderVol(vol)}</span>
          </div>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">MUSIC</span>
          <div class="landing-setting-controls">
            <input type="range" id="audio-music-slider" class="landing-slider" min="0" max="1" step="0.05" value="${musicVol}">
            <span id="audio-music-val" class="landing-setting-val">${renderVol(musicVol)}</span>
          </div>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">EFFECTS</span>
          <div class="landing-setting-controls">
            <input type="range" id="audio-sfx-slider" class="landing-slider" min="0" max="1" step="0.05" value="${sfxVol}">
            <span id="audio-sfx-val" class="landing-setting-val">${renderVol(sfxVol)}</span>
          </div>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">MUTE</span>
          <button id="audio-mute-btn" class="landing-setting-toggle">${muted ? 'ON' : 'OFF'}</button>
        </div>

        <div class="landing-section-title">GRAPHICS</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">RENDER QUALITY</span>
          <span class="landing-setting-selector">&lt; HIGH &gt;</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">BLOOM EFFECT</span>
          <button id="graphics-bloom-btn" class="landing-setting-toggle">ON</button>
        </div>

        <button class="landing-btn-back" id="panel-back" style="margin-top:8px;">BACK</button>
      </div>
    `;
    panel.classList.add('open');
    
    document.getElementById('audio-master-slider').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      AudioManager.setVolume(v);
      document.getElementById('audio-master-val').textContent = renderVol(v);
    });
    document.getElementById('audio-music-slider').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      AudioManager.setMusicVolume(v);
      document.getElementById('audio-music-val').textContent = renderVol(v);
    });
    document.getElementById('audio-sfx-slider').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      AudioManager.setSfxVolume(v);
      document.getElementById('audio-sfx-val').textContent = renderVol(v);
    });
    document.getElementById('audio-mute-btn').addEventListener('click', (e) => {
      const nowMuted = AudioManager.toggleMute();
      if (!nowMuted) AudioManager.play('UI_MUTE');
      e.currentTarget.textContent = nowMuted ? 'ON' : 'OFF';
    });
    document.getElementById('graphics-bloom-btn').addEventListener('click', (e) => {
      /* Placeholder for future bloom toggle */
      e.currentTarget.textContent = e.currentTarget.textContent === 'ON' ? 'OFF' : 'ON';
      AudioManager.play('UI_MENU_CLICK');
    });
    document.getElementById('panel-back').addEventListener('click', () => this._closeSubPanel());
  }

  _showStatisticsPanel() {
    const panel = this._prepareSubPanel();
    const s = gameState.stats;

    const fmtT = fmtTime;

    panel.innerHTML = `
      <div class="landing-panel-box">
        <div class="landing-panel-title">STATISTICS</div>

        <div class="stats-section-title">PRODUCTION</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">TOTAL ORE</span>
          <span class="landing-setting-ctrl stats-val stats-ore">${fmtOre(s.totalOreProduced)}</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">TOTAL ENERGY</span>
          <span class="landing-setting-ctrl stats-val stats-energy">${fmtOre(s.totalEnergyProduced)}</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">TOTAL CRYSTAL</span>
          <span class="landing-setting-ctrl stats-val stats-crystal">${fmtOre(s.totalCrystalProduced)}</span>
        </div>

        <div class="stats-section-title">LOGISTICS</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">SHIP DELIVERIES</span>
          <span class="landing-setting-ctrl stats-val">${s.totalShipDeliveries.toLocaleString()}</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">RESOURCES SHIPPED</span>
          <span class="landing-setting-ctrl stats-val">${fmtOre(s.totalResourcesShipped)}</span>
        </div>

        <div class="stats-section-title">PROGRESS</div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">PLANETS OWNED</span>
          <span class="landing-setting-ctrl stats-val">${gameState.ownedPlanets.length} / 8</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">ROBOTS HIRED</span>
          <span class="landing-setting-ctrl stats-val">${s.totalRobotsHired.toLocaleString()}</span>
        </div>
        <div class="landing-setting-row">
          <span class="landing-setting-label">PLAY TIME</span>
          <span class="landing-setting-ctrl stats-val">${fmtT(s.playTimeSeconds)}</span>
        </div>

        <button class="landing-btn-back" id="panel-back">BACK</button>
      </div>
    `;
    panel.classList.add('open');
    document.getElementById('panel-back').addEventListener('click', () => this._closeSubPanel());
  }

  _prepareSubPanel() {
    clearTimeout(this._subpanelTimer);
    const panel = document.getElementById('landing-subpanel');
    const nav = document.getElementById('landing-nav');
    if (nav) nav.classList.add('hidden');
    return panel;
  }

  _closeSubPanel() {
    clearTimeout(this._subpanelTimer);
    const panel = document.getElementById('landing-subpanel');
    const nav = document.getElementById('landing-nav');
    panel.classList.remove('open');
    if (nav) nav.classList.remove('hidden');
    this._subpanelTimer = setTimeout(() => {
      if (!panel.classList.contains('open')) {
        panel.innerHTML = '';
      }
    }, 300);
  }

  _updateFooter() {
    const leftEl = document.getElementById('footer-left');
    const rightEl = document.getElementById('footer-right');
    const user = getCurrentUser();
    if (isGoogleUser()) {
      leftEl.textContent = 'SAVE: CLOUD + LOCAL';
      rightEl.textContent = user.email || user.displayName || 'GOOGLE USER';
    } else if (user) {
      leftEl.textContent = 'SAVE: LOCAL ONLY';
      rightEl.textContent = 'ANONYMOUS';
    } else {
      leftEl.textContent = 'SAVE: LOCAL ONLY';
      rightEl.textContent = 'OFFLINE';
    }
  }
}
