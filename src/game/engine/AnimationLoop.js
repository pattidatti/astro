import { gameState } from '../GameState.js';

export class AnimationLoop {
  constructor(renderPipeline, cameraController, sceneManager) {
    this.renderPipeline = renderPipeline;
    this.cameraController = cameraController;
    this.sceneManager = sceneManager;

    this._lastTime = 0;
    this._running = false;
    this._updateCallbacks = [];

    this._frame = this._frame.bind(this);
  }

  /** Register a callback to run each frame: fn(dt, time) */
  onUpdate(fn) {
    this._updateCallbacks.push(fn);
  }

  start() {
    this._running = true;
    this._lastTime = performance.now();
    requestAnimationFrame(this._frame);
  }

  stop() {
    this._running = false;
  }

  _frame(now) {
    if (!this._running) return;
    requestAnimationFrame(this._frame);

    const dt = Math.min((now - this._lastTime) / 1000, 0.1); // cap at 100ms
    this._lastTime = now;

    // Tick game state
    gameState.tick(dt);

    // Run update callbacks first (moves planets to current-frame positions)
    for (const fn of this._updateCallbacks) {
      fn(dt, now / 1000);
    }

    // Update camera after world — so tracking reads current planet positions
    this.cameraController.update(dt);

    // Render
    this.renderPipeline.render();
  }
}
