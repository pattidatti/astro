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
    this.curTab = 'u';
    this.updateTimer = 0;

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
    };

    // Tab buttons
    document.getElementById('tu').addEventListener('pointerdown', () => this.setTab('u'));
    document.getElementById('tg').addEventListener('pointerdown', () => this.setTab('g'));

    // Multiplier buttons
    document.getElementById('m1').addEventListener('pointerdown', () => this.setMult(1));
    document.getElementById('m10').addEventListener('pointerdown', () => this.setMult(10));
    document.getElementById('m100').addEventListener('pointerdown', () => this.setMult(100));

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

    this.renderUpgrades();
    this.renderPlanets();

    // Show offline earnings or welcome
    if (gameState._offlineEarnings) {
      const oe = gameState._offlineEarnings;
      const hrs = Math.floor(oe.elapsed / 3600);
      const mins = Math.floor((oe.elapsed % 3600) / 60);
      const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
      this.toast(`OFFLINE ${timeStr}: +${fmt(oe.earned)} ORE`);
      delete gameState._offlineEarnings;
    } else {
      this.toast('WELCOME, COMMANDER \u2014 TAP THE PLANET');
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
      if (this.curTab === 'g') this.renderPlanets();
    }
  }

  setTab(t) {
    this.curTab = t;
    document.getElementById('tabU').style.display = t === 'u' ? 'block' : 'none';
    document.getElementById('tabG').style.display = t === 'g' ? 'block' : 'none';
    document.getElementById('tu').classList.toggle('on', t === 'u');
    document.getElementById('tg').classList.toggle('on', t === 'g');
    if (t === 'g') this.renderPlanets();
  }

  setMult(m) {
    gameState.buyMult = m;
    [1, 10, 100].forEach(v => document.getElementById('m' + v).classList.toggle('on', v === m));
    this.renderUpgrades();
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

    for (let i = 0; i < visible.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'uprow';

      [visible[i], visible[i + 1]].forEach(u => {
        if (!u) {
          const spacer = document.createElement('div');
          spacer.style.flex = '1';
          row.appendChild(spacer);
          return;
        }

        const cost = gameState.upgradeCost(u.id);
        const can = gameState.canAfford(u.id);
        const lv = gameState.upgradeLevels[u.id] || 0;

        let costStr = '';
        if (cost.ore > 0) costStr += '\u2B21' + fmt(cost.ore);
        if (cost.crystal > 0) costStr += (costStr ? ' ' : '') + '\u25C8' + fmt(cost.crystal);
        if (cost.mult > 1) costStr += ` \u00D7${cost.mult}`;

        const d = document.createElement('div');
        d.className = 'upg ' + (can ? 'can' : 'no');
        d.innerHTML = `${lv > 0 ? `<div class="upg-lv">LV${lv}</div>` : ''}
          <div class="upg-icon">${u.icon}</div>
          <div class="upg-name">${u.name}</div>
          <div class="upg-desc">${u.desc}</div>
          <div class="upg-cost">${costStr}</div>`;

        if (can) {
          d.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            gameState.buyUpgrade(u.id);
            this.renderUpgrades();
          });
        }
        row.appendChild(d);
      });

      grid.appendChild(row);
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
      d.className = 'plcard' + (isAct ? ' act' : canBuy ? ' buy' : locked ? ' lck' : '');
      d.innerHTML = `
        <div class="pldot" style="background:radial-gradient(circle at 35% 35%,${p.col}cc,${p.col}44);box-shadow:0 0 16px ${p.glow}66"></div>
        <div class="pli">
          <div class="pln">${p.name}${isAct ? '<span class="plm">\u25CF ACTIVE</span>' : ''}</div>
          <div class="pld">${p.desc}</div>
          ${!owned && p.cost > 0 ? `<div class="plc">\u2B21 ${fmt(p.cost)} to colonize</div>` : ''}
          ${owned && p.mb > 0 ? `<div class="plb">+${(p.mb * 100).toFixed(0)}% extraction bonus</div>` : ''}
        </div>
        ${!owned ? '<span style="opacity:.2;font-size:20px">\u{1F512}</span>' : ''}`;

      if (owned) {
        d.addEventListener('pointerdown', () => {
          gameState.switchPlanet(p.id);
          this.toast('WARPING TO ' + p.name);
          this.renderPlanets();
        });
      } else if (canBuy) {
        d.addEventListener('pointerdown', () => {
          gameState.colonizePlanet(p.id);
          this.renderPlanets();
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
