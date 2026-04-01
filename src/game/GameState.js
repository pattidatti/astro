import { PLANETS } from './data/planets.js';
import { UPGRADES, COST_SCALE } from './data/upgrades.js';

class EventEmitter {
  constructor() { this._listeners = {}; }
  on(evt, fn) { (this._listeners[evt] ||= []).push(fn); }
  off(evt, fn) { const a = this._listeners[evt]; if (a) this._listeners[evt] = a.filter(f => f !== fn); }
  emit(evt, data) { (this._listeners[evt] || []).forEach(fn => fn(data)); }
}

class GameState extends EventEmitter {
  constructor() {
    super();
    this.ore = 0;
    this.crystal = 0;
    this.energy = 0;
    this.robots = 0;
    this.clickPow = 1;
    this.autoRate = 0;
    this.effMult = 1;
    this.crystalUnlocked = false;
    this.energyUnlocked = false;
    this.ownedPlanets = ['xerion'];
    this.activePlanet = 'xerion';
    this.upgradeLevels = {};
    this.buyMult = 1;
    this.lastSaved = Date.now();
  }

  reset() {
    this.ore = 0;
    this.crystal = 0;
    this.energy = 0;
    this.robots = 0;
    this.clickPow = 1;
    this.autoRate = 0;
    this.effMult = 1;
    this.crystalUnlocked = false;
    this.energyUnlocked = false;
    this.ownedPlanets = ['xerion'];
    this.activePlanet = 'xerion';
    this.upgradeLevels = {};
    this.buyMult = 1;
    this.lastSaved = Date.now();
    this.emit('stateLoaded');
    this.emit('robotsChanged', 0);
  }

  get activePlanetDef() {
    return PLANETS.find(p => p.id === this.activePlanet) || PLANETS[0];
  }

  get planetMultiplier() {
    return 1 + (this.activePlanetDef.mb || 0);
  }

  get oreRate() {
    return (this.robots * 0.5 * this.effMult * this.planetMultiplier) + this.autoRate;
  }

  get crystalRate() {
    return this.crystalUnlocked ? this.robots * 0.05 * this.effMult * this.planetMultiplier : 0;
  }

  get energyRate() {
    return this.energyUnlocked ? this.robots * 0.02 * this.effMult * this.planetMultiplier : 0;
  }

  tick(dt) {
    this.ore += this.oreRate * dt;
    this.crystal += this.crystalRate * dt;
    this.energy += this.energyRate * dt;
  }

  addOre(amount) {
    this.ore += amount;
  }

  upgradeCost(upgradeId) {
    const u = UPGRADES.find(x => x.id === upgradeId);
    if (!u) return null;
    const lv = this.upgradeLevels[upgradeId] || 0;
    const isUnlock = u.effect === 'cry' || u.effect === 'enr';
    const mult = isUnlock ? 1 : this.buyMult;
    return {
      ore: Math.floor(u.oreCost * Math.pow(COST_SCALE, lv) * mult),
      crystal: Math.floor(u.crystalCost * Math.pow(COST_SCALE, lv) * mult),
      mult
    };
  }

  canAfford(upgradeId) {
    const cost = this.upgradeCost(upgradeId);
    if (!cost) return false;
    return this.ore >= cost.ore && this.crystal >= cost.crystal;
  }

  buyUpgrade(upgradeId) {
    const u = UPGRADES.find(x => x.id === upgradeId);
    if (!u) return false;
    const cost = this.upgradeCost(upgradeId);
    if (!cost || this.ore < cost.ore || this.crystal < cost.crystal) return false;
    const lv = this.upgradeLevels[upgradeId] || 0;
    if (u.max && lv >= u.max) return false;

    this.ore -= cost.ore;
    this.crystal -= cost.crystal;
    this.upgradeLevels[upgradeId] = lv + 1;

    const isUnlock = u.effect === 'cry' || u.effect === 'enr';
    const n = isUnlock ? 1 : this.buyMult;

    switch (u.effect) {
      case 'rob': this.robots += u.amt * n; this.emit('robotsChanged', this.robots); break;
      case 'aut': this.autoRate += u.amt * n; break;
      case 'eff': this.effMult += u.amt * n; break;
      case 'cry': this.crystalUnlocked = true; this.emit('crystalUnlocked'); break;
      case 'enr': this.energyUnlocked = true; this.emit('energyUnlocked'); break;
    }
    this.emit('upgradeBought', upgradeId);
    return true;
  }

  colonizePlanet(planetId) {
    const p = PLANETS.find(x => x.id === planetId);
    if (!p || this.ownedPlanets.includes(planetId)) return false;
    if (this.ore < p.cost) return false;
    this.ore -= p.cost;
    this.ownedPlanets.push(planetId);
    this.activePlanet = planetId;
    this.emit('planetColonized', planetId);
    return true;
  }

  switchPlanet(planetId) {
    if (!this.ownedPlanets.includes(planetId)) return false;
    this.activePlanet = planetId;
    this.emit('planetChanged', planetId);
    return true;
  }

  serialize() {
    return {
      ore: this.ore,
      crystal: this.crystal,
      energy: this.energy,
      robots: this.robots,
      clickPow: this.clickPow,
      autoRate: this.autoRate,
      effMult: this.effMult,
      cryUnlocked: this.crystalUnlocked,
      enrUnlocked: this.energyUnlocked,
      ownedPlanets: this.ownedPlanets,
      activePlanet: this.activePlanet,
      upgradeLevels: this.upgradeLevels,
      lastSaved: Date.now()
    };
  }

  deserialize(data) {
    if (!data) return;
    this.ore = data.ore ?? 0;
    this.crystal = data.crystal ?? 0;
    this.energy = data.energy ?? 0;
    this.robots = data.robots ?? 0;
    this.clickPow = data.clickPow ?? 1;
    this.autoRate = data.autoRate ?? 0;
    this.effMult = data.effMult ?? 1;
    this.crystalUnlocked = data.cryUnlocked ?? false;
    this.energyUnlocked = data.enrUnlocked ?? false;
    this.ownedPlanets = data.ownedPlanets ?? ['xerion'];
    this.activePlanet = data.activePlanet ?? 'xerion';
    this.upgradeLevels = data.upgradeLevels ?? {};
    this.lastSaved = data.lastSaved ?? Date.now();
    this.emit('stateLoaded');
    this.emit('robotsChanged', this.robots);
    if (this.crystalUnlocked) this.emit('crystalUnlocked');
    if (this.energyUnlocked) this.emit('energyUnlocked');
  }

  applyOfflineEarnings() {
    const elapsed = Math.min((Date.now() - this.lastSaved) / 1000, 8 * 3600);
    if (elapsed > 10) {
      const earned = this.oreRate * elapsed * 0.5;
      const crystalEarned = this.crystalRate * elapsed * 0.5;
      const energyEarned = this.energyRate * elapsed * 0.5;
      this.ore += earned;
      this.crystal += crystalEarned;
      this.energy += energyEarned;
      return { elapsed, earned, crystalEarned, energyEarned };
    }
    return null;
  }
}

export const gameState = new GameState();
