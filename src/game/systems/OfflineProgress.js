import { gameState } from '../GameState.js';
import { planetProductionRates } from '../data/productionRates.js';
import { applyScouting, pumpSpaceElevator } from './ProductionSystem.js';

/**
 * Catch-up for time spent with the game closed.
 *
 * `lastSaved` was written on every save and read by nothing, so an idle game
 * produced nothing at all while idle: closing the tab froze the economy, and the
 * only way to accumulate anything was to leave a WebGL canvas rendering. This
 * closes that gap.
 *
 * What runs offline is deliberately narrow — production, surveying, and the
 * space elevator. Everything that spawns objects into the world (build queues,
 * colony flights, raids, fleet combat) keeps running only while the game is
 * open. That keeps the rule easy to state and symmetric: nothing is produced by
 * an absence that the player could not have watched happen, and nothing is lost
 * to one either.
 *
 * The catch-up is a real simulation, not a closed-form multiply: it steps the
 * same functions the live tick uses, so silos fill and stop, the elevator drains
 * a planet into a military base, and a survey that completes mid-window raises
 * the rate for the rest of it — exactly as they would have on screen.
 */

/** Longest stretch that is ever paid out. Beyond this, absence stops accruing. */
export const MAX_OFFLINE_SECONDS = 8 * 3600;

/** Below this, the gap is a reload or a quick pause — not worth a report. */
export const MIN_OFFLINE_SECONDS = 120;

/**
 * Simulation granularity. Small enough that a silo filling mid-window is placed
 * within a minute, large enough that a full 8-hour catch-up is ~960 steps.
 */
const STEP_SECONDS = 30;

/**
 * Run the catch-up and mutate state.
 *
 * @param {object} [gs]  game state (the singleton in the game, a stub in tests)
 * @param {number} [now] current epoch ms — injectable so tests need no clock
 * @returns {null|{
 *   awaySeconds:number, creditedSeconds:number, capped:boolean,
 *   gained:{ore:number,energy:number,crystal:number},
 *   unlocks:Array<{planetId:string,resource:string,zones:number}>,
 *   filled:Array<{planetId:string,resource:string,afterSeconds:number}>,
 * }} null when the gap was too short to matter
 */
export function applyOfflineProgress(gs = gameState, now = Date.now()) {
  const away = Math.floor((now - (gs.lastSaved ?? now)) / 1000);
  // A clock that moved backwards (timezone change, a synced save from another
  // machine) yields a negative gap — treat it as no time passed rather than
  // rewinding anything.
  if (!(away >= MIN_OFFLINE_SECONDS)) return null;

  const credited = Math.min(away, MAX_OFFLINE_SECONDS);
  const gained = { ore: 0, energy: 0, crystal: 0 };
  const unlocks = [];
  const filled = [];
  const filledSeen = new Set();

  for (let t = 0; t < credited; t += STEP_SECONDS) {
    const dt = Math.min(STEP_SECONDS, credited - t);

    for (const planetId of gs.ownedPlanets) {
      const ps = gs.getPlanetState(planetId);
      if (!ps || !ps.hasBase) continue;

      const rates = planetProductionRates(planetId, ps, gs);
      for (const resource of ['ore', 'energy', 'crystal']) {
        const wanted = rates[resource] * dt;
        if (wanted <= 0) continue;
        const added = gs.addToSilo(planetId, resource, wanted);
        gained[resource] += added;

        // First moment this silo could not take everything offered: the point
        // where the player's storage, not their robots, became the limit.
        const key = planetId + ':' + resource;
        if (added < wanted - 1e-6 && !filledSeen.has(key)) {
          filledSeen.add(key);
          filled.push({ planetId, resource, afterSeconds: t + dt });
        }
      }

      unlocks.push(...applyScouting(dt, planetId, ps, gs));
      pumpSpaceElevator(dt, ps);
    }
  }

  gs.stats.totalOreProduced     += gained.ore;
  gs.stats.totalEnergyProduced  += gained.energy;
  gs.stats.totalCrystalProduced += gained.crystal;

  // Returning from a long absence, every planet is instantly past MIN_ATTACK_GAP
  // and eligible to be raided — so a player who just earned eight hours of ore
  // could lose a planet before reading the report. Restart the gap clock.
  for (const planetId of gs.ownedPlanets) {
    gs.lastAttackTime[planetId] = now;
  }

  gs.lastSaved = now;

  return { awaySeconds: away, creditedSeconds: credited, capped: away > credited, gained, unlocks, filled };
}
