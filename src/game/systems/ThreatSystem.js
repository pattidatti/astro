import { gameState } from '../GameState.js';
import { ENEMY_TYPES, scaleThreat, getRaidTemplates, getInvasionTemplates,
         raidSpawnChance, invasionSpawnChance,
         MIN_ATTACK_GAP, COLONIZATION_GRACE_PERIOD, MAX_CONCURRENT_ATTACKS } from '../data/enemies.js';

let _nextAttackId = 0;

/**
 * ThreatSystem — manages threat levels per planet and spawns raids/invasions.
 * Registers with animationLoop.onUpdate().
 */
export class ThreatSystem {
  constructor(animationLoop) {
    this._spawnTimers = {}; // planetId → seconds since last spawn check
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    // Cap dt to prevent huge spawn bursts after alt-tab
    const clampedDt = Math.min(dt, 1);

    if (gameState.activeAttacks.length >= MAX_CONCURRENT_ATTACKS) return;

    for (const planetId of gameState.ownedPlanets) {
      if (planetId === 'xerion') continue; // Xerion is always peaceful

      const ps = gameState.getPlanetState(planetId);
      if (!ps || !ps.hasBase || ps.combat.fallen) continue;

      // Grace period after colonization
      const graceEnd = (gameState.colonizationTime[planetId] || 0) + COLONIZATION_GRACE_PERIOD * 1000;
      if (Date.now() < graceEnd) continue;

      // Minimum gap between attacks on same planet
      const lastEnd = gameState.lastAttackTime[planetId] || 0;
      if ((Date.now() - lastEnd) / 1000 < MIN_ATTACK_GAP) continue;

      // Already under attack?
      if (gameState.isUnderAttack(planetId)) continue;

      const threatLevel = scaleThreat(gameState.ownedPlanets.length, planetId);
      if (threatLevel <= 0) continue;

      this._spawnTimers[planetId] = (this._spawnTimers[planetId] || 0) + clampedDt;

      // Check for invasion first (rarer, higher priority)
      const invasionChance = invasionSpawnChance(threatLevel) * clampedDt;
      if (invasionChance > 0 && Math.random() < invasionChance) {
        this._spawnInvasion(planetId, threatLevel);
        this._spawnTimers[planetId] = 0;
        if (gameState.activeAttacks.length >= MAX_CONCURRENT_ATTACKS) return;
        continue;
      }

      // Check for raid
      const raidChance = raidSpawnChance(threatLevel) * clampedDt;
      if (raidChance > 0 && Math.random() < raidChance) {
        this._spawnRaid(planetId, threatLevel);
        this._spawnTimers[planetId] = 0;
        if (gameState.activeAttacks.length >= MAX_CONCURRENT_ATTACKS) return;
      }
    }
  }

  _spawnRaid(planetId, threatLevel) {
    const templates = getRaidTemplates(threatLevel);
    if (templates.length === 0) return;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const enemies = this._createEnemiesFromComposition(template.composition, threatLevel);

    const attack = {
      id: `raid_${_nextAttackId++}`,
      type: 'raid',
      planetId,
      enemies,
      mothership: null,
      wave: 0,
      elapsed: 0,
      template: null,
    };

    gameState.activeAttacks.push(attack);
    gameState.emit('attackStarted', { attack, planetId, type: 'raid' });
  }

  _spawnInvasion(planetId, threatLevel) {
    const templates = getInvasionTemplates(threatLevel);
    if (templates.length === 0) return;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const mothershipDef = ENEMY_TYPES.mothership;

    // Create mothership
    const mothership = {
      type: 'mothership',
      hp: Math.floor(mothershipDef.hp * template.mothership.hpMult),
      maxHP: Math.floor(mothershipDef.hp * template.mothership.hpMult),
      damage: mothershipDef.damage,
      target: mothershipDef.target,
    };

    // Spawn first wave of fighters
    const firstWave = template.waves[0] || [];
    const enemies = this._createEnemiesFromComposition(firstWave, threatLevel);

    const attack = {
      id: `invasion_${_nextAttackId++}`,
      type: 'invasion',
      planetId,
      enemies,
      mothership,
      wave: 0,
      waveTimer: 0,
      elapsed: 0,
      template: {
        waves: template.waves,
        spawnInterval: mothershipDef.spawnInterval,
      },
    };

    gameState.activeAttacks.push(attack);
    gameState.emit('attackStarted', { attack, planetId, type: 'invasion' });
  }

  /**
   * Create enemy instances from a composition array.
   * Scales HP with threat level for late-game challenge.
   */
  _createEnemiesFromComposition(composition, threatLevel) {
    const enemies = [];
    const hpScale = 1 + (threatLevel - 1) * 0.15; // +15% HP per threat level above 1

    for (const entry of composition) {
      const def = ENEMY_TYPES[entry.type];
      if (!def) continue;
      for (let i = 0; i < entry.count; i++) {
        enemies.push({
          id: `enemy_${_nextAttackId++}_${i}`,
          type: entry.type,
          hp: Math.floor(def.hp * hpScale),
          maxHP: Math.floor(def.hp * hpScale),
          damage: def.damage,
          speed: def.speed,
          target: def.target,
          stealRate: def.stealRate || 0,
        });
      }
    }
    return enemies;
  }

  /**
   * Advance invasion waves when mothership is alive.
   * Called by CombatSystem each tick for invasion-type attacks.
   */
  tickInvasionWaves(attack, dt) {
    if (attack.type !== 'invasion' || !attack.mothership || !attack.template) return;
    if (attack.mothership.hp <= 0) return;

    attack.waveTimer = (attack.waveTimer || 0) + dt;

    const nextWaveIndex = attack.wave + 1;
    if (nextWaveIndex >= attack.template.waves.length) return;

    if (attack.waveTimer >= attack.template.spawnInterval) {
      attack.waveTimer = 0;
      attack.wave = nextWaveIndex;

      const waveComposition = attack.template.waves[nextWaveIndex];
      const threatLevel = scaleThreat(gameState.ownedPlanets.length, attack.planetId);
      const newEnemies = this._createEnemiesFromComposition(waveComposition, threatLevel);
      attack.enemies.push(...newEnemies);

      gameState.emit('waveSpawned', {
        attackId: attack.id,
        planetId: attack.planetId,
        wave: nextWaveIndex,
        enemies: newEnemies,
      });
    }
  }
}
