import { gameState } from '../GameState.js';

/**
 * Guided onboarding, organised as independent chapters.
 *
 * The game has nine systems and the tutorial used to teach one — the economy
 * loop — leaving the entire military layer (bases, hangars, fleets, supply,
 * combat, Admiral Mode) to be discovered by accident. Chapters fix that without
 * making the opening longer: each one has its own trigger and its own saved
 * progress, so the military chapter only appears when the player actually
 * builds a military base, however many hours in that happens, and players who
 * finished the economy tutorial before this chapter existed still receive it.
 *
 * Exactly one chapter is active at a time; when two are eligible the earlier
 * one in the list wins, so an already-running chapter is never interrupted.
 *
 * Each step is `{ title, body, condition, targetEl }`:
 *   - `condition()` true advances to the next step
 *   - `targetEl()` returns the element to point at, or null to float top-centre
 *   - a step whose target is not on screen yet hides the hand and waits
 */
export class Tutorial {
  constructor(game) {
    this._game = game;
    this._handEl = document.getElementById('tutorial-hand');
    this._titleEl = this._handEl?.querySelector('.tutorial-bubble-title');
    this._bodyEl = this._handEl?.querySelector('.tutorial-bubble-body');
    this._dismissBtn = this._handEl?.querySelector('.tutorial-dismiss-btn');
    this._chapters = this._defineChapters();

    if (!this._handEl) return;

    game.animationLoop.onUpdate(() => this._tick());
    this._dismissBtn?.addEventListener('click', () => this._skipStep());
  }

  /** The chapter that should be showing right now, or null when none is. */
  _activeChapter() {
    for (const chapter of this._chapters) {
      const step = chapter.getProgress();
      if (step < 0 || step >= chapter.steps.length) continue; // finished
      if (!chapter.startsWhen()) continue;                    // not triggered yet
      return chapter;
    }
    return null;
  }

  /** Skip button — advance one step, completing the chapter if that was the last. */
  _skipStep() {
    const chapter = this._activeChapter();
    if (!chapter) return;
    const next = chapter.getProgress() + 1;
    chapter.setProgress(next >= chapter.steps.length ? -1 : next);
    if (next >= chapter.steps.length) this._hide();
  }

  _hide() {
    if (this._handEl) this._handEl.style.display = 'none';
  }

  _tick() {
    const chapter = this._activeChapter();
    if (!chapter) { this._hide(); return; }

    let step = chapter.getProgress();
    const current = chapter.steps[step];

    if (current.condition()) {
      step += 1;
      chapter.setProgress(step >= chapter.steps.length ? -1 : step);
      if (step >= chapter.steps.length) { this._hide(); return; }
    }

    this._positionHand(chapter.steps[step]);
  }

  _positionHand(step) {
    if (!this._handEl) return;

    const targetEl = step.targetEl?.();
    if (this._titleEl) this._titleEl.textContent = resolve(step.title);
    if (this._bodyEl) {
      const body = resolve(step.body);
      this._bodyEl.textContent = body || '';
      this._bodyEl.style.display = body ? '' : 'none';
    }

    if (!targetEl) {
      // No specific target — float centred near the top.
      this._handEl.style.display = 'flex';
      this._handEl.classList.remove('tutorial-hand--flipped');
      this._handEl.style.left = '50%';
      this._handEl.style.top = '80px';
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0) {
      // Target exists but isn't laid out yet (collapsed tab, hidden panel).
      this._handEl.style.display = 'none';
      return;
    }

    // Measure before final placement — the bubble wraps, so its height depends
    // on the copy of the step we just wrote in.
    this._handEl.style.visibility = 'hidden';
    this._handEl.style.display = 'flex';
    this._handEl.style.left = '0px';
    this._handEl.style.top = '0px';
    const handW = this._handEl.offsetWidth;
    const handH = this._handEl.offsetHeight;
    this._handEl.style.visibility = '';

    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: above the target, flipping below when there isn't room.
    let left = rect.left + rect.width / 2;
    let top = rect.top - handH - 10;

    let flipped = false;
    if (top < margin) { top = rect.bottom + 10; flipped = true; }
    this._handEl.classList.toggle('tutorial-hand--flipped', flipped);

    // Element is centred via translateX(-50%), so clamp against half its width.
    left = Math.max(handW / 2 + margin, Math.min(vw - handW / 2 - margin, left));
    top = Math.max(margin, Math.min(vh - handH - margin, top));

    this._handEl.style.left = left + 'px';
    this._handEl.style.top = top + 'px';
  }

  _defineChapters() {
    return [
      {
        id: 'economy',
        startsWhen: () => true,
        getProgress: () => gameState.tutorialStep,
        setProgress: (v) => { gameState.tutorialStep = v; },
        steps: this._economySteps(),
      },
      {
        id: 'military',
        // Only meaningful once the player has committed to the military layer.
        startsWhen: () => gameState.ownedPlanets.some(
          (id) => gameState.getPlanetState(id)?.militaryBase?.built),
        getProgress: () => gameState.tutorialMilitaryStep,
        setProgress: (v) => { gameState.tutorialMilitaryStep = v; },
        steps: this._militarySteps(),
      },
    ];
  }

  // ─── Chapter 1: the economy loop ────────────────────────────────────────

  _economySteps() {
    const xerion = () => gameState.getPlanetState('xerion');
    return [
      {
        title: 'BUILD YOUR SPACE BASE',
        body: 'Everything on a planet runs through its base. Xerion\'s is free.',
        condition: () => xerion()?.hasBase === true,
        targetEl: () => document.querySelector('.build-base-btn'),
      },
      {
        title: 'HIRE AN ENERGY BOT',
        body: 'Energy pays for everything else — more robots, research, expansion.',
        condition: () => (xerion()?.robots.energyBot.count ?? 0) >= 1,
        targetEl: () => document.querySelector('.hire-energy-btn'),
      },
      {
        title: 'RESEARCH THE MINER BOT',
        body: 'Research is galaxy-wide. Buy it once here and every planet you ever own has it.',
        condition: () => gameState.isTechUnlocked('miner_bot'),
        targetEl: () => document.getElementById('research-btn'),
      },
      {
        title: 'HIRE YOUR FIRST MINER',
        body: 'Miners dig ore — the material behind colony ships, warships and structures.',
        condition: () => (xerion()?.robots.miner.count ?? 0) >= 1,
        targetEl: () => document.querySelector('.hire-miner-btn'),
      },
      {
        title: 'WATCH YOUR ORE SILO',
        body: 'A full silo stops production dead. The bar is your warning.',
        condition: () => (xerion()?.silos.ore.amount ?? 0) >= 20,
        targetEl: () => document.querySelector('#panel-silos .silo-bar-row'),
      },
      {
        title: 'EXPAND YOUR STORAGE',
        body: 'Bigger silos mean longer unattended runs, and they set the ceiling on what you can afford at once.',
        condition: () => (xerion()?.baseLevels.storage ?? 0) >= 1,
        targetEl: () => document.querySelector('.base-upg-btn'),
      },
      {
        title: () => gameState.isTechUnlocked('scout_bot') ? 'HIRE A SCOUT BOT' : 'RESEARCH THE SCOUT BOT',
        body: 'Most of a planet\'s deposits start locked. Scouts survey them open.',
        condition: () => (xerion()?.robots.scout.count ?? 0) >= 1,
        targetEl: () => gameState.isTechUnlocked('scout_bot')
          ? document.querySelector('.hire-scout-btn')
          : document.getElementById('research-btn'),
      },
      {
        title: 'A NEW DEPOSIT ZONE',
        body: 'Every zone multiplies this planet\'s output. Scouting is the cheapest growth you have.',
        condition: () => (xerion()?.deposits?.ore?.unlocked ?? 1) >= 2,
        targetEl: () => null,
      },
      {
        title: 'BUILD A DEFENSE CANNON',
        body: 'Xerion is safe. Nothing else is — cannons shoot raiders down before they reach your station.',
        condition: () => (xerion()?.combat.defenses.cannon ?? 0) >= 1,
        targetEl: () => document.querySelector('#panel-defenses button[data-defense-id="cannon"]'),
      },
      {
        title: 'BUILD A COLONY SHIP',
        body: 'One planet caps out fast. Each new world brings its own silos, deposits and multipliers.',
        condition: () => gameState.colonyShipsInFlight.length >= 1,
        targetEl: () => document.querySelector('#panel-colony-ship .colony-ship-btn'),
      },
      {
        title: 'ESTABLISH A TRADE ROUTE',
        body: 'Cargo ships move resources between your planets, so a rich world can pay for a poor one.',
        condition: () => gameState.routes.length >= 1,
        targetEl: () => document.querySelector('button[data-tab="routes"]'),
      },
      {
        title: 'GOOD LUCK, COMMANDER',
        body: 'Press ? at any time for the full control list.',
        condition: afterDelay(5000),
        targetEl: () => null,
      },
    ];
  }

  // ─── Chapter 2: the military layer ──────────────────────────────────────

  _militarySteps() {
    /** The planet whose military base triggered this chapter. */
    const milPlanet = () => gameState.ownedPlanets
      .map((id) => gameState.getPlanetState(id))
      .find((ps) => ps?.militaryBase?.built);
    const fleets = () => gameState.playerFleets;

    return [
      {
        title: 'MILITARY BASE ONLINE',
        body: 'Warships are built here, from the base\'s own silos — the space elevator feeds them from the planet at 2/s.',
        condition: afterDelay(6000),
        targetEl: () => null,
      },
      {
        title: 'ADD A HANGAR',
        body: 'Hangars set your fleet capacity. Without one you cannot field a single ship.',
        condition: () => (milPlanet()?.militaryBase?.hangars ?? 0) >= 1,
        targetEl: () => document.querySelector('.mil-hangar-btn'),
      },
      {
        title: 'BUILD A WARSHIP',
        body: 'Ships are paid for from the military silo, not the planet silo. Fighters are the cheapest way in.',
        condition: () => (milPlanet()?.militaryBase?.queue?.length ?? 0) >= 1 || fleets().length >= 1,
        targetEl: () => document.querySelector('.mil-ship-build-btn'),
      },
      {
        title: 'PRESS V FOR ADMIRAL MODE',
        body: 'A top-down tactical view. Drag to box-select your fleet, then click where it should go.',
        condition: () => this._game?.cameraController?.isRTSMode === true,
        targetEl: () => document.getElementById('admiral-mode-btn'),
      },
      {
        title: 'SEND YOUR FLEET OUT',
        body: 'Fleets burn energy while they move and ore while they fight. Both come from the base they left.',
        condition: () => fleets().some((f) => f.waypoint || f.state === 'moving'),
        targetEl: () => null,
      },
      {
        title: 'KEEP AN EYE ON SUPPLY',
        body: 'Out of ammo your damage drops to a third. Fly back within 20 units of a military base to resupply.',
        condition: afterDelay(9000),
        targetEl: () => document.querySelector('.pfp-supply-row'),
      },
    ];
  }
}

/** Allow a step's title/body to be either a string or a function of state. */
function resolve(v) {
  return typeof v === 'function' ? v() : v;
}

/**
 * A condition that becomes true `ms` after the step is first shown — for
 * informational steps that have nothing for the player to do.
 */
function afterDelay(ms) {
  let shownAt = null;
  return () => {
    if (shownAt === null) { shownAt = Date.now(); return false; }
    return Date.now() - shownAt > ms;
  };
}
