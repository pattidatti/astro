import Phaser from 'phaser';
import { gameState } from '../GameState.js';
import { UPGRADES, COST_SCALE } from '../data/upgrades.js';
import { PLANETS } from '../data/planets.js';

const fmt = (n) => {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n) + '';
};

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  create() {
    this.updateTimer = 0;
    this.isGalaxyView = false;

    // Cache DOM refs
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
      sRob: document.getElementById('sRob'),
      sWld: document.getElementById('sWld'),
      sClk: document.getElementById('sClk'),
      sRate: document.getElementById('sRate'),
      upgGrid: document.getElementById('upgGrid'),
      pList: document.getElementById('pList'),
      toast: document.getElementById('toast'),
      pdName: document.getElementById('pd-name'),
      pdType: document.getElementById('pd-type'),
      pdBonus: document.getElementById('pd-bonus'),
      galaxyToggle: document.getElementById('galaxyToggle'),
    };

    // Multiplier buttons
    document.getElementById('m1').addEventListener('pointerdown', () => this.setMult(1));
    document.getElementById('m10').addEventListener('pointerdown', () => this.setMult(10));
    document.getElementById('m100').addEventListener('pointerdown', () => this.setMult(100));

    // Galaxy map toggle
    this.dom.galaxyToggle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.toggleGalaxyMap();
    });

    // M key to toggle galaxy map
    this.input.keyboard.on('keydown-M', () => {
      this.toggleGalaxyMap();
    });

    // Listen for unlock events
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
      this.renderPlanetDetail();
    });
    gameState.on('planetChanged', () => {
      this.renderPlanetDetail();
      this.renderPlanets();
    });
    gameState.on('stateLoaded', () => {
      if (gameState.crystalUnlocked) {
        this.dom.rcCrys.style.display = '';
        this.dom.sepCrys.style.display = '';
      }
      if (gameState.energyUnlocked) {
        this.dom.rcEnrg.style.display = '';
      }
      this.renderPlanetDetail();
    });

    this.renderUpgrades();
    this.renderPlanets();
    this.renderPlanetDetail();

    // Show offline earnings or welcome
    if (gameState._offlineEarnings) {
      const oe = gameState._offlineEarnings;
      const hrs = Math.floor(oe.elapsed / 3600);
      const mins = Math.floor((oe.elapsed % 3600) / 60);
      const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      this.toast(`OFFLINE ${timeStr}: +${fmt(oe.earned)} ORE`);
      delete gameState._offlineEarnings;
    } else {
      this.toast('WELCOME, COMMANDER \u2014 CLICK THE PLANET');
    }
  }

  update(time, delta) {
    const dt = delta / 1000;

    // Tick game state
    gameState.tick(dt);

    // Update HUD values every frame
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

    this.dom.sRob.textContent = fmt(gameState.robots);
    this.dom.sWld.textContent = gameState.ownedPlanets.length;
    this.dom.sClk.textContent = fmt(gameState.clickPow);
    this.dom.sRate.textContent = fmt(gameState.oreRate);

    // Render upgrades/planets periodically
    this.updateTimer += dt;
    if (this.updateTimer >= 0.35) {
      this.updateTimer = 0;
      this.renderUpgrades();
      this.renderPlanets();
    }
  }

  setMult(m) {
    gameState.buyMult = m;
    [1, 10, 100].forEach(v => document.getElementById('m' + v).classList.toggle('on', v === m));
    this.renderUpgrades();
  }

  /**
   * Toggle between planet view and galaxy map.
   * @param {boolean} [forceGalaxy] - if provided, force to galaxy (true) or planet (false)
   */
  toggleGalaxyMap(forceGalaxy) {
    const goToGalaxy = forceGalaxy !== undefined ? forceGalaxy : !this.isGalaxyView;

    if (goToGalaxy && !this.isGalaxyView) {
      // Open galaxy map
      this.scene.sleep('Planet');
      const galaxyScene = this.scene.get('GalaxyMap');
      if (galaxyScene.scene.isSleeping()) {
        this.scene.wake('GalaxyMap');
      } else if (!galaxyScene.scene.isActive()) {
        this.scene.launch('GalaxyMap');
      }
      this.isGalaxyView = true;
      this.dom.pList.style.display = 'none';
      this.dom.galaxyToggle.textContent = '✦ PLANET VIEW';
      this.dom.galaxyToggle.classList.add('active');
    } else if (!goToGalaxy && this.isGalaxyView) {
      // Return to planet view
      this.scene.sleep('GalaxyMap');
      this.scene.wake('Planet');
      this.isGalaxyView = false;
      this.dom.pList.style.display = '';
      this.dom.galaxyToggle.textContent = '✦ GALAXY MAP';
      this.dom.galaxyToggle.classList.remove('active');
      this.renderPlanetDetail();
    }
  }

  renderPlanetDetail() {
    const def = gameState.activePlanetDef;
    this.dom.pdName.textContent = def.name;
    this.dom.pdType.textContent = def.desc;
    if (def.mb > 0) {
      this.dom.pdBonus.textContent = `+${(def.mb * 100).toFixed(0)}% extraction bonus`;
    } else {
      this.dom.pdBonus.textContent = 'Base extraction rate';
    }
  }

  renderUpgrades() {
    const grid = this.dom.upgGrid;
    grid.innerHTML = '';

    const visible = UPGRADES.filter(u => {
      const lv = gameState.upgradeLevels[u.id] || 0;
      if (u.max && lv >= u.max) return false;
      if (u.effect === 'cry' && gameState.crystalUnlocked) return false;
      if (u.effect === 'enr' && gameState.energyUnlocked) return false;
      return true;
    });

    for (const u of visible) {
      const cost = gameState.upgradeCost(u.id);
      const can = gameState.canAfford(u.id);
      const lv = gameState.upgradeLevels[u.id] || 0;

      let costStr = '';
      if (cost.ore > 0) costStr += '\u2B21' + fmt(cost.ore);
      if (cost.crystal > 0) costStr += (costStr ? ' ' : '') + '\u25C8' + fmt(cost.crystal);
      if (cost.mult > 1) costStr += ` \u00D7${cost.mult}`;

      const d = document.createElement('div');
      d.className = 'upg ' + (can ? 'can' : 'no');
      d.innerHTML = `
        <div class="upg-top">
          <span class="upg-icon">${u.icon}</span>
          <span class="upg-name">${u.name}</span>
          ${lv > 0 ? `<span class="upg-lv">LV${lv}</span>` : ''}
        </div>
        <div class="upg-bottom">
          <span class="upg-desc">${u.desc}</span>
          <span class="upg-cost">${costStr}</span>
        </div>`;

      if (can) {
        d.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          gameState.buyUpgrade(u.id);
          this.renderUpgrades();
        });
      }
      grid.appendChild(d);
    }
  }

  renderPlanets() {
    const list = this.dom.pList;
    list.innerHTML = '';

    PLANETS.forEach(p => {
      const owned = gameState.ownedPlanets.includes(p.id);
      const isAct = gameState.activePlanet === p.id;
      const canBuy = !owned && gameState.ore >= p.cost;
      const locked = !owned && !canBuy;

      const d = document.createElement('div');
      d.className = 'pl-chip' + (isAct ? ' act' : canBuy ? ' buy' : locked ? ' lck' : '');
      d.innerHTML = `
        <div class="pl-dot" style="background:radial-gradient(circle at 35% 35%,${p.col}cc,${p.col}44);box-shadow:0 0 12px ${p.glow}44"></div>
        <div style="display:flex;flex-direction:column;gap:2px">
          <span class="pl-name">${p.name}</span>
          ${isAct ? '<span class="pl-status">\u25CF ACTIVE</span>' : ''}
          ${!owned && p.cost > 0 ? `<span class="pl-cost">\u2B21 ${fmt(p.cost)}</span>` : ''}
          ${owned && !isAct ? `<span class="pl-bonus">+${(p.mb * 100).toFixed(0)}%</span>` : ''}
        </div>
        ${!owned ? '<span class="pl-lock">\u{1F512}</span>' : ''}`;

      if (owned) {
        d.addEventListener('pointerdown', () => {
          gameState.switchPlanet(p.id);
          this.toast('WARPING TO ' + p.name);
        });
      } else if (canBuy) {
        d.addEventListener('pointerdown', () => {
          gameState.colonizePlanet(p.id);
        });
      }
      list.appendChild(d);
    });
  }

  toast(msg) {
    const el = this.dom.toast;
    el.textContent = msg;
    el.classList.add('on');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  }
}
