import { gameState } from './GameState.js';
import { UPGRADES } from './data/upgrades.js';
import { PLANETS } from './data/planets.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

export class HUDBridge {
  constructor(game) {
    this.game = game;
    this.activeTab = 'mining';
    this.minimized = false;
    this.updateTimer = 0;

    this.dom = {
      vOre: document.getElementById('vOre'),
      rOre: document.getElementById('rOre'),
      vCrys: document.getElementById('vCrys'),
      rCrys: document.getElementById('rCrys'),
      vEnrg: document.getElementById('vEnrg'),
      rEnrg: document.getElementById('rEnrg'),
      rcCrys: document.getElementById('rcCrys'),
      sepCrys: document.getElementById('sepCrys'),
      rcEnrg: document.getElementById('rcEnrg'),
      barUpgrades: document.getElementById('bar-upgrades'),
      barMinimize: document.getElementById('bar-minimize'),
      bottomBar: document.getElementById('bottom-bar'),
      upgTooltip: document.getElementById('upg-tooltip'),
      planetTooltip: document.getElementById('planet-tooltip'),
      toast: document.getElementById('toast'),
    };

    this._setupTabs();
    this._setupMultiplier();
    this._setupMinimize();
    this._setupPlanetHover();
    this._setupEvents();
    this._renderUpgrades();

    // Show offline earnings or welcome
    if (gameState._offlineEarnings) {
      const oe = gameState._offlineEarnings;
      const hrs = Math.floor(oe.elapsed / 3600);
      const mins = Math.floor((oe.elapsed % 3600) / 60);
      const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      this.toast(`OFFLINE ${timeStr}: +${fmt(oe.earned)} ORE`);
      delete gameState._offlineEarnings;
    } else {
      this.toast('WELCOME, COMMANDER');
    }

    // Register with animation loop for per-frame updates
    game.animationLoop.onUpdate((dt) => this.update(dt));
  }

  _setupTabs() {
    document.querySelectorAll('.bar-tab').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.activeTab = btn.dataset.cat;
        document.querySelectorAll('.bar-tab').forEach(b => b.classList.toggle('active', b === btn));
        this._renderUpgrades();
      });
    });
  }

  _updateTabBadges() {
    const cats = ['mining', 'robots', 'tech'];
    for (const cat of cats) {
      const count = UPGRADES.filter(u => u.cat === cat && gameState.canAfford(u.id)).length;
      const badge = document.getElementById(`tbadge-${cat}`);
      if (!badge) continue;
      badge.textContent = count > 0 ? count : '';
    }
  }

  _setupMultiplier() {
    document.getElementById('m1').addEventListener('pointerdown', () => this._setMult(1));
    document.getElementById('m10').addEventListener('pointerdown', () => this._setMult(10));
    document.getElementById('m100').addEventListener('pointerdown', () => this._setMult(100));
  }

  _setupMinimize() {
    this.dom.barMinimize.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this._toggleMinimize();
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        this._toggleMinimize();
      }
    });
  }

  _toggleMinimize() {
    this.minimized = !this.minimized;
    this.dom.bottomBar.classList.toggle('minimized', this.minimized);
    this.dom.barMinimize.textContent = this.minimized ? '\u25B2' : '\u25BC';
  }

  _setupPlanetHover() {
    this.game.inputManager.onHover((planetId, x, y) => {
      const tt = this.dom.planetTooltip;
      if (!planetId) {
        tt.classList.remove('visible');
        return;
      }

      const planet = PLANETS.find(p => p.id === planetId);
      if (!planet) return;
      const owned = gameState.ownedPlanets.includes(planetId);
      const isActive = gameState.activePlanet === planetId;

      tt.innerHTML = `
        <div class="pt-name">${planet.name}</div>
        <div class="pt-type">${planet.desc}</div>
        ${planet.mb > 0 ? `<div class="pt-bonus">+${(planet.mb * 100).toFixed(0)}% extraction bonus</div>` : ''}
        ${owned && isActive ? `<div class="pt-stats">
          <span>DRONES \u2014 ${fmt(gameState.robots)}</span>
          <span>WORLDS \u2014 ${gameState.ownedPlanets.length}</span>
          <span>ORE/S \u2014 ${fmt(gameState.oreRate)}</span>
        </div>` : ''}
        ${owned && !isActive ? '<div class="pt-type">Click to warp</div>' : ''}
        ${!owned ? `<div class="pt-cost">\u2B21 ${fmt(planet.cost)}</div>` : ''}
      `;
      tt.classList.add('visible');
      tt.style.left = (x + 16) + 'px';
      tt.style.top = (y - 10) + 'px';
    });
  }

  _setupEvents() {
    gameState.on('crystalUnlocked', () => {
      this.dom.rcCrys.style.display = '';
      this.dom.sepCrys.style.display = '';
      this.toast('\u{1F48E} CRYSTAL EXTRACTION ONLINE');
    });
    gameState.on('energyUnlocked', () => {
      this.dom.rcEnrg.style.display = '';
      this.toast('\u26A1 FUSION REACTOR ONLINE');
    });
    gameState.on('planetColonized', (id) => {
      const p = PLANETS.find(x => x.id === id);
      this.toast('\u{1F30D} COLONIZED: ' + (p ? p.name : id));
    });
    gameState.on('stateLoaded', () => {
      if (gameState.crystalUnlocked) {
        this.dom.rcCrys.style.display = '';
        this.dom.sepCrys.style.display = '';
      }
      if (gameState.energyUnlocked) {
        this.dom.rcEnrg.style.display = '';
      }
    });
  }

  update(dt) {
    this.dom.vOre.textContent = fmt(gameState.ore);
    this.dom.rOre.textContent = '+' + fmt(gameState.oreRate) + '/s';

    if (gameState.crystalUnlocked) {
      this.dom.vCrys.textContent = fmt(gameState.crystal);
      this.dom.rCrys.textContent = '+' + fmt(gameState.crystalRate) + '/s';
    }
    if (gameState.energyUnlocked) {
      this.dom.vEnrg.textContent = fmt(gameState.energy);
      this.dom.rEnrg.textContent = '+' + fmt(gameState.energyRate) + '/s';
    }

    // Periodic upgrade re-render
    this.updateTimer += dt;
    if (this.updateTimer >= 0.35) {
      this.updateTimer = 0;
      this._renderUpgrades();
    }
  }

  _setMult(m) {
    gameState.buyMult = m;
    [1, 10, 100].forEach(v => document.getElementById('m' + v).classList.toggle('on', v === m));
    this._renderUpgrades();
  }

  _renderUpgrades() {
    const container = this.dom.barUpgrades;
    container.innerHTML = '';

    const filtered = UPGRADES.filter(u => {
      if (u.cat !== this.activeTab) return false;
      const lv = gameState.upgradeLevels[u.id] || 0;
      if (u.max && lv >= u.max) return false;
      if (u.effect === 'cry' && gameState.crystalUnlocked) return false;
      if (u.effect === 'enr' && gameState.energyUnlocked) return false;
      return true;
    });

    for (const u of filtered) {
      const can = gameState.canAfford(u.id);
      const lv = gameState.upgradeLevels[u.id] || 0;

      const el = document.createElement('div');
      el.className = 'bar-upg ' + (can ? 'can' : 'no');
      el.innerHTML = `
        <span class="bar-upg-icon">${u.icon}</span>
        ${lv > 0 ? `<span class="upg-badge">${lv}</span>` : ''}
      `;

      // Hover tooltip
      el.addEventListener('mouseenter', (e) => this._showUpgTooltip(u, e));
      el.addEventListener('mouseleave', () => this._hideUpgTooltip());

      // Click to buy
      if (can) {
        el.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          gameState.buyUpgrade(u.id);
          this._renderUpgrades();
        });
      }
      container.appendChild(el);
    }

    this._updateTabBadges();
  }

  _showUpgTooltip(upgrade, event) {
    const cost = gameState.upgradeCost(upgrade.id);
    const lv = gameState.upgradeLevels[upgrade.id] || 0;
    let costStr = '';
    if (cost.ore > 0) costStr += '\u2B21 ' + fmt(cost.ore);
    if (cost.crystal > 0) costStr += (costStr ? '  ' : '') + '\u25C8 ' + fmt(cost.crystal);

    this.dom.upgTooltip.innerHTML = `
      <div class="utt-name">${upgrade.name}</div>
      ${lv > 0 ? `<div class="utt-level">LEVEL ${lv}</div>` : ''}
      <div class="utt-desc">${upgrade.desc}</div>
      <div class="utt-cost">${costStr}</div>
    `;
    this.dom.upgTooltip.classList.add('visible');

    const rect = event.target.closest('.bar-upg').getBoundingClientRect();
    this.dom.upgTooltip.style.left = rect.left + 'px';
    this.dom.upgTooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    this.dom.upgTooltip.style.top = 'auto';
  }

  _hideUpgTooltip() {
    this.dom.upgTooltip.classList.remove('visible');
  }

  toast(msg) {
    const el = this.dom.toast;
    el.textContent = msg;
    el.classList.add('on');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  }
}
