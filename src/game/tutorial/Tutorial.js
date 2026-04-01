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

    if (this._step >= 0 && this._handEl) {
      game.animationLoop.onUpdate(() => this._tick());
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
      this._handEl.style.display = 'block';
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

    this._handEl.style.display = 'block';
    this._handEl.style.left = (rect.left + rect.width / 2) + 'px';
    this._handEl.style.top  = (rect.top - 60) + 'px';
  }

  _defineSteps() {
    const game = this._game;
    return [
      {
        message: 'ZOOM IN ON XERION TO BEGIN',
        condition: () => {
          const ps = game.galaxy?.getPlanetWorldPosition('xerion');
          if (!ps) return false;
          return game.camera.position.distanceTo(ps) < 80;
        },
        targetEl: () => null,
      },
      {
        message: 'BUILD YOUR SPACE BASE',
        condition: () => gameState.getPlanetState('xerion')?.hasBase === true,
        targetEl: () => document.querySelector('#panel-base .build-base-btn'),
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
        message: 'HIRE AN ENERGY HARVESTER',
        condition: () => (gameState.getPlanetState('xerion')?.robots.energyBot.count ?? 0) >= 1,
        targetEl: () => document.querySelector('.hire-energy-btn'),
      },
      {
        message: 'EXPAND YOUR BASE STORAGE',
        condition: () => (gameState.getPlanetState('xerion')?.baseLevels.storage ?? 0) >= 1,
        targetEl: () => document.querySelector('.base-upg-btn'),
      },
      {
        // Final step — auto-complete
        message: 'GOOD LUCK, COMMANDER',
        condition: () => true,
        targetEl: () => null,
      },
    ];
  }
}
