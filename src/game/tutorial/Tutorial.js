import { gameState } from '../GameState.js';

/**
 * Tutorial step machine.
 * Positions a #tutorial-hand div over target DOM elements to guide new players.
 */
export class Tutorial {
  constructor(game) {
    this._game = game;
    this._step = gameState.tutorialStep;
    this._handEl = document.getElementById('tutorial-hand');
    this._bubbleEl = this._handEl?.querySelector('.tutorial-bubble');
    this._steps = this._defineSteps();

    if (this._handEl) {
      game.animationLoop.onUpdate(() => this._tick());
      gameState.on('stateLoaded', () => { this._step = gameState.tutorialStep; });
    }
  }

  _tick() {
    if (this._step < 0 || this._step >= this._steps.length) {
      if (this._handEl) this._handEl.style.display = 'none';
      return;
    }

    const current = this._steps[this._step];

    // Check completion
    if (current.condition()) {
      this._step++;
      gameState.tutorialStep = this._step;

      if (this._step >= this._steps.length) {
        gameState.tutorialStep = -1;
        if (this._handEl) this._handEl.style.display = 'none';
        return;
      }
    }

    this._positionHand(this._steps[this._step]);
  }

  _positionHand(step) {
    if (!this._handEl) return;

    const targetEl = step.targetEl?.();
    if (this._bubbleEl) this._bubbleEl.textContent = step.message;

    if (!targetEl) {
      // No specific target — show centered at top
      this._handEl.style.display = 'flex';
      this._handEl.style.left = '50%';
      this._handEl.style.top  = '80px';
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0) {
      // Element not visible yet
      this._handEl.style.display = 'none';
      return;
    }

    // Measure bubble dimensions before final placement
    this._handEl.style.visibility = 'hidden';
    this._handEl.style.display = 'flex';
    this._handEl.style.left = '0px';
    this._handEl.style.top  = '0px';
    const handW = this._handEl.offsetWidth;
    const handH = this._handEl.offsetHeight;
    this._handEl.style.visibility = '';

    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: above target with small gap
    let left = rect.left + rect.width / 2;
    let top  = rect.top - handH - 10;

    // If too close to top, flip below target instead
    let flipped = false;
    if (top < margin) { top = rect.bottom + 10; flipped = true; }
    this._handEl.classList.toggle('tutorial-hand--flipped', flipped);

    // Clamp horizontal (element is centered via translateX(-50%))
    left = Math.max(handW / 2 + margin, Math.min(vw - handW / 2 - margin, left));
    // Clamp vertical
    top  = Math.max(margin, Math.min(vh - handH - margin, top));

    this._handEl.style.left = left + 'px';
    this._handEl.style.top  = top + 'px';
  }

  _defineSteps() {
    return [
      {
        message: 'BUILD YOUR SPACE BASE',
        condition: () => gameState.getPlanetState('xerion')?.hasBase === true,
        targetEl: () => document.querySelector('.build-base-btn'),
      },
      {
        message: 'HIRE AN ENERGY BOT',
        condition: () => (gameState.getPlanetState('xerion')?.robots.energyBot.count ?? 0) >= 1,
        targetEl: () => document.querySelector('.hire-energy-btn'),
      },
      {
        message: 'UNLOCK MINER BOT IN RESEARCH',
        condition: () => gameState.isTechUnlocked('miner_bot'),
        targetEl: () => document.getElementById('research-btn'),
      },
      {
        message: 'HIRE YOUR FIRST MINER',
        condition: () => (gameState.getPlanetState('xerion')?.robots.miner.count ?? 0) >= 1,
        targetEl: () => document.querySelector('.hire-miner-btn'),
      },
      {
        message: 'WATCH YOUR ORE SILO FILL',
        condition: () => (gameState.getPlanetState('xerion')?.silos.ore.amount ?? 0) >= 50,
        targetEl: () => document.querySelector('#panel-silos .silo-bar-row'),
      },
      {
        message: 'EXPAND YOUR BASE STORAGE',
        condition: () => (gameState.getPlanetState('xerion')?.baseLevels.storage ?? 0) >= 1,
        targetEl: () => document.querySelector('.base-upg-btn'),
      },
      {
        // Final step — show for 4 seconds, then complete
        message: 'GOOD LUCK, COMMANDER',
        condition: (() => {
          let shownAt = null;
          return () => {
            if (!shownAt) { shownAt = Date.now(); return false; }
            return Date.now() - shownAt > 4000;
          };
        })(),
        targetEl: () => null,
      },
    ];
  }
}
