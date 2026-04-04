import { gameState, getSpeedMult, getLoadMult } from '../GameState.js';
import { DEFENSE_TYPES, DEFENSE_UPGRADES, ACTIVE_ABILITIES,
         BUILDER_REPAIR_RATE, calcDefenseDPS, calcEnemyDPS } from '../data/defenses.js';
import { ENEMY_TYPES } from '../data/enemies.js';

/**
 * CombatSystem — resolves combat per frame.
 *
 * Two modes:
 * - Full simulation: for the focused planet (per-enemy targeting, positions)
 * - Simplified DPS: for background planets (net DPS calculation)
 *
 * Also handles:
 * - Ability cooldown ticking
 * - Builder robot auto-repair
 * - Attack completion checks
 */
export class CombatSystem {
  constructor(animationLoop, threatSystem) {
    this._threatSystem = threatSystem;
    this._focusTargets = {}; // planetId → enemyId (player focus-fire target)
    animationLoop.onUpdate((dt) => this._tick(dt));
  }

  _tick(dt) {
    const clampedDt = Math.min(dt, 1);

    // Process all active attacks
    for (let i = gameState.activeAttacks.length - 1; i >= 0; i--) {
      const attack = gameState.activeAttacks[i];
      attack.elapsed += clampedDt;

      const ps = gameState.getPlanetState(attack.planetId);
      if (!ps || !ps.hasBase || ps.combat.fallen) {
        // Planet no longer valid — end attack
        gameState.activeAttacks.splice(i, 1);
        gameState.lastAttackTime[attack.planetId] = Date.now();
        gameState.emit('attackEnded', { attackId: attack.id, planetId: attack.planetId, reason: 'invalid' });
        continue;
      }

      const isFocused = attack.planetId === gameState.focusedPlanet;

      if (isFocused) {
        this._tickFullCombat(attack, ps, clampedDt);
      } else {
        this._tickSimplifiedCombat(attack, ps, clampedDt);
      }

      // Advance invasion waves
      if (attack.type === 'invasion') {
        this._threatSystem.tickInvasionWaves(attack, clampedDt);
      }

      // Check attack completion
      const allEnemiesDead = attack.enemies.every(e => e.hp <= 0);
      const mothershipDead = !attack.mothership || attack.mothership.hp <= 0;
      const wavesComplete = !attack.template || attack.wave >= (attack.template.waves.length - 1);

      if (allEnemiesDead && mothershipDead && wavesComplete) {
        gameState.activeAttacks.splice(i, 1);
        gameState.lastAttackTime[attack.planetId] = Date.now();
        gameState.emit('attackEnded', { attackId: attack.id, planetId: attack.planetId, reason: 'victory' });
      }
    }

    // Tick ability cooldowns and builder repair for all owned planets
    for (const planetId of gameState.ownedPlanets) {
      const ps = gameState.getPlanetState(planetId);
      if (!ps || !ps.hasBase) continue;

      gameState.tickAbilityCooldowns(planetId, clampedDt);
      this._tickBuilderRepair(planetId, ps, clampedDt);
      this._tickShieldRegen(planetId, ps, clampedDt);
    }
  }

  /**
   * Full combat simulation — per-enemy, per-defense resolution.
   * Used for the planet the player is currently viewing.
   */
  _tickFullCombat(attack, ps, dt) {
    const planetId = attack.planetId;
    const combat = ps.combat;

    // Check for EMP effect (disables all enemies)
    const empActive = gameState.hasActiveEffect(planetId, 'emp');

    // ── Defenses fire at enemies ──
    const focusTarget = this._focusTargets[planetId];
    const aliveEnemies = attack.enemies.filter(e => e.hp > 0);

    for (const [typeId, level] of Object.entries(combat.defenses)) {
      if (level <= 0) continue;
      const defType = DEFENSE_TYPES[typeId];
      if (!defType || !defType.damage) continue;

      const baseDmg = defType.damage[level - 1];
      const baseRate = defType.fireRate[level - 1];

      // Apply upgrade multipliers
      const dmgMult = this._getDefenseUpgradeMult(combat, typeId, 'damageMult');
      const rateMult = this._getDefenseUpgradeMult(combat, typeId, 'fireRateMult');

      const damagePerShot = baseDmg * dmgMult;
      const shotsPerSecond = baseRate * rateMult;
      const totalDamage = damagePerShot * shotsPerSecond * dt;

      // Pick target: focus target first, then random alive enemy
      let target = null;
      if (focusTarget) {
        target = aliveEnemies.find(e => e.id === focusTarget);
      }
      if (!target && aliveEnemies.length > 0) {
        target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      }

      if (target) {
        target.hp -= totalDamage;
        if (target.hp <= 0) {
          target.hp = 0;
          gameState.emit('enemyDestroyed', {
            attackId: attack.id,
            planetId,
            enemy: target,
            defenseType: typeId,
          });
        } else {
          gameState.emit('defenseFired', {
            planetId,
            defenseType: typeId,
            targetId: target.id,
            damage: totalDamage,
          });
        }
      }
    }

    // ── Defenses also fire at mothership ──
    if (attack.mothership && attack.mothership.hp > 0 && aliveEnemies.length === 0) {
      const totalDefDPS = calcDefenseDPS(combat);
      const dmg = totalDefDPS * dt;
      attack.mothership.hp -= dmg;
      if (attack.mothership.hp <= 0) {
        attack.mothership.hp = 0;
        gameState.emit('mothershipDestroyed', { attackId: attack.id, planetId });
      }
    }

    // ── Enemies deal damage (unless EMP'd) ──
    if (!empActive) {
      // Military base targeting: damage goes to military base first if flagged
      const milBase = ps.militaryBase;
      const targetMilBase = attack.targetMilitaryBase && milBase?.built && milBase.hp > 0;

      for (const enemy of aliveEnemies) {
        const dmg = enemy.damage * dt;

        if (targetMilBase) {
          // All damage routed to military base while it stands
          gameState.damageMilitaryBase(planetId, dmg);
          // If military base just fell, switch targeting to station
          if (milBase.hp <= 0) attack.targetMilitaryBase = false;
        } else {
          switch (enemy.target) {
            case 'station':
              gameState.damageStation(planetId, dmg);
              break;
            case 'robots':
              // Damage station at reduced rate (robots are abstractions, not HP targets)
              gameState.damageStation(planetId, dmg * 0.3);
              break;
            case 'silo':
              // Raiders steal resources
              if (enemy.stealRate > 0) {
                const stealAmount = enemy.stealRate * dt;
                for (const resource of ['ore', 'energy', 'crystal']) {
                  gameState.stealFromSilo(planetId, resource, stealAmount / 3);
                }
              }
              // Also deal minor station damage
              gameState.damageStation(planetId, dmg * 0.1);
              break;
          }
        }
      }

      // Mothership also damages station (or military base)
      if (attack.mothership && attack.mothership.hp > 0) {
        if (targetMilBase && milBase.hp > 0) {
          gameState.damageMilitaryBase(planetId, attack.mothership.damage * dt);
          if (milBase.hp <= 0) attack.targetMilitaryBase = false;
        } else {
          gameState.damageStation(planetId, attack.mothership.damage * dt);
        }
      }
    }

    // ── Apply orbital strike if active ──
    if (gameState.hasActiveEffect(planetId, 'orbitalStrike')) {
      // Orbital strike is instant, remove the effect and deal damage
      const strikeAbility = ACTIVE_ABILITIES.orbitalStrike;
      const orbitalMult = gameState.isTechUnlocked('orbital_damage') ? 1.5 : 1.0;
      const strikeHits = gameState.isTechUnlocked('counter_measures') ? 2 : 1;
      const strikeDmg = strikeAbility.damage * orbitalMult * strikeHits;
      for (const enemy of aliveEnemies) {
        enemy.hp -= strikeDmg;
        if (enemy.hp <= 0) {
          enemy.hp = 0;
          gameState.emit('enemyDestroyed', { attackId: attack.id, planetId, enemy, defenseType: 'orbitalStrike' });
        }
      }
      if (attack.mothership && attack.mothership.hp > 0) {
        attack.mothership.hp -= strikeDmg;
        if (attack.mothership.hp <= 0) {
          attack.mothership.hp = 0;
          gameState.emit('mothershipDestroyed', { attackId: attack.id, planetId });
        }
      }
      // Remove the orbital strike effect immediately (it's instant, not duration-based)
      ps.combat.activeEffects = ps.combat.activeEffects.filter(e => e.type !== 'orbitalStrike');
    }

    // ── Shield boost doubles shield values while active ──
    // (Handled in damageStation via shieldHP being pre-boosted when ability activates)
  }

  /**
   * Simplified DPS combat — net damage calculation for off-screen planets.
   * No per-enemy targeting, just total DPS vs total DPS.
   */
  _tickSimplifiedCombat(attack, ps, dt) {
    const planetId = attack.planetId;
    const combat = ps.combat;

    // Calculate defense DPS
    const defenseDPS = calcDefenseDPS(combat);
    const aliveEnemies = attack.enemies.filter(e => e.hp > 0);

    // Apply defense damage to enemies (distributed evenly)
    if (aliveEnemies.length > 0 && defenseDPS > 0) {
      const damagePerEnemy = (defenseDPS * dt) / aliveEnemies.length;
      for (const enemy of aliveEnemies) {
        enemy.hp -= damagePerEnemy;
        if (enemy.hp <= 0) {
          enemy.hp = 0;
          gameState.emit('enemyDestroyed', { attackId: attack.id, planetId, enemy, defenseType: 'auto' });
        }
      }
    }

    // Apply defense damage to mothership when no fighters alive
    if (attack.mothership && attack.mothership.hp > 0 && aliveEnemies.length === 0) {
      attack.mothership.hp -= defenseDPS * dt;
      if (attack.mothership.hp <= 0) {
        attack.mothership.hp = 0;
        gameState.emit('mothershipDestroyed', { attackId: attack.id, planetId });
      }
    }

    // Calculate enemy DPS and apply to station (or military base)
    const milBase = ps.militaryBase;
    const targetMilBase = attack.targetMilitaryBase && milBase?.built && milBase.hp > 0;

    const enemyDPS = calcEnemyDPS(aliveEnemies);
    if (enemyDPS > 0) {
      if (targetMilBase) {
        gameState.damageMilitaryBase(planetId, enemyDPS * dt);
        if (milBase.hp <= 0) attack.targetMilitaryBase = false;
      } else {
        gameState.damageStation(planetId, enemyDPS * dt);
      }
    }

    // Mothership damage
    if (attack.mothership && attack.mothership.hp > 0) {
      if (targetMilBase && milBase.hp > 0) {
        gameState.damageMilitaryBase(planetId, attack.mothership.damage * dt);
        if (milBase.hp <= 0) attack.targetMilitaryBase = false;
      } else {
        gameState.damageStation(planetId, attack.mothership.damage * dt);
      }
    }

    // Raiders steal in simplified mode too
    for (const enemy of aliveEnemies) {
      if (enemy.stealRate > 0 && enemy.hp > 0) {
        const stealAmount = enemy.stealRate * dt;
        for (const resource of ['ore', 'energy', 'crystal']) {
          gameState.stealFromSilo(planetId, resource, stealAmount / 3);
        }
      }
    }
  }

  /**
   * Builder robot auto-repair when station is damaged.
   */
  _tickBuilderRepair(planetId, ps, dt) {
    if (ps.combat.stationHP >= ps.combat.stationMaxHP) return;
    if (ps.robots.builder.count <= 0) return;

    // Don't repair during active combat (builders hide)
    if (gameState.isUnderAttack(planetId)) return;

    const { count, speedLevel, loadLevel } = ps.robots.builder;
    const builderTechMult = gameState.isTechUnlocked('builder_efficiency') ? 1.6 : 1.0;
    const repairRate = count * BUILDER_REPAIR_RATE * getSpeedMult(speedLevel) * getLoadMult(loadLevel) * builderTechMult;
    gameState.repairStation(planetId, repairRate * dt);
  }

  /**
   * Shield HP regeneration (costs energy).
   */
  _tickShieldRegen(planetId, ps, dt) {
    const shieldLevel = ps.combat.defenses.shield;
    if (shieldLevel <= 0) return;
    if (ps.combat.shieldHP >= ps.combat.shieldMaxHP) return;

    const defType = DEFENSE_TYPES.shield;
    const regenRate = defType.regenRate[shieldLevel - 1];
    const energyDrain = defType.energyDrain[shieldLevel - 1];

    // Apply regen upgrade multiplier
    const regenMult = this._getDefenseUpgradeMult(ps.combat, 'shield', 'regenMult');

    // Check energy
    const energyCost = energyDrain * dt;
    if (!gameState.siloHas(planetId, 'energy', energyCost)) return;

    gameState.deductFromSilo(planetId, 'energy', energyCost);

    const regen = regenRate * regenMult * dt;

    // Shield boost doubles max HP while active
    let maxHP = ps.combat.shieldMaxHP;
    const capMult = this._getDefenseUpgradeMult(ps.combat, 'shield', 'capacityMult');
    maxHP = Math.floor(maxHP * capMult);
    if (gameState.hasActiveEffect(planetId, 'shieldBoost')) {
      maxHP *= gameState.isTechUnlocked('shield_boost_power') ? 3 : 2;
    }

    ps.combat.shieldHP = Math.min(maxHP, ps.combat.shieldHP + regen);
  }

  /**
   * Get upgrade multiplier for a defense type and effect.
   */
  _getDefenseUpgradeMult(combat, defenseTypeId, effectName) {
    const upg = DEFENSE_UPGRADES.find(u => u.defenseType === defenseTypeId && u.effect === effectName);
    if (!upg) return 1;
    const level = combat.defenseLevels[upg.id] || 0;
    return 1 + level * upg.mult;
  }

  /**
   * Set focus-fire target on a planet (player interaction).
   */
  setFocusTarget(planetId, enemyId) {
    this._focusTargets[planetId] = enemyId;
    gameState.emit('focusTargetSet', { planetId, enemyId });
  }

  /**
   * Clear focus-fire target.
   */
  clearFocusTarget(planetId) {
    delete this._focusTargets[planetId];
  }

  /**
   * Reconstruct active attacks from save data.
   * Called after deserialize to restore runtime combat state.
   */
  reconstructAttacks() {
    // Active attacks are already in gameState.activeAttacks from deserialize.
    // Just emit events for any ongoing attacks so visual systems can pick them up.
    for (const attack of gameState.activeAttacks) {
      gameState.emit('attackStarted', {
        attack,
        planetId: attack.planetId,
        type: attack.type,
        restored: true,
      });
    }
  }
}
