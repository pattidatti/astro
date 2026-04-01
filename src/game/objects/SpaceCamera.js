/**
 * Virtual camera for parallax panning.
 * Tracks drag input and provides smooth offset values
 * that background layers use for parallax movement.
 * Does NOT use Phaser's camera system — just offset values.
 */
export default class SpaceCamera {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.maxPan = opts.maxPan || 500;
    this.smoothing = opts.smoothing || 0.1;
    this.friction = opts.friction || 0.92;

    // Current smooth position
    this.offsetX = 0;
    this.offsetY = 0;

    // Target (where we're heading)
    this.targetX = 0;
    this.targetY = 0;

    // Velocity for momentum
    this.velX = 0;
    this.velY = 0;

    // Drag state
    this.isDragging = false;
    this.dragStartPointerX = 0;
    this.dragStartPointerY = 0;
    this.dragStartTargetX = 0;
    this.dragStartTargetY = 0;
    this.dragStartTime = 0;
    this.totalDragDist = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;

    // Whether the last interaction was a drag (used to suppress planet click)
    this.wasDrag = false;

    this._setupInput();
  }

  _setupInput() {
    const scene = this.scene;

    scene.input.on('pointerdown', (pointer) => {
      this.isDragging = false;
      this.wasDrag = false;
      this.dragStartPointerX = pointer.x;
      this.dragStartPointerY = pointer.y;
      this.dragStartTargetX = this.targetX;
      this.dragStartTargetY = this.targetY;
      this.dragStartTime = Date.now();
      this.totalDragDist = 0;
      this.lastPointerX = pointer.x;
      this.lastPointerY = pointer.y;
      this.velX = 0;
      this.velY = 0;
    });

    scene.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;

      const dx = pointer.x - this.dragStartPointerX;
      const dy = pointer.y - this.dragStartPointerY;
      const moveDist = Math.sqrt(dx * dx + dy * dy);

      // Track total movement for click-vs-drag
      this.totalDragDist = moveDist;

      if (moveDist >= 8) {
        this.isDragging = true;
        this.wasDrag = true;

        // Update target based on drag delta (inverted — drag right = pan left)
        this.targetX = this.dragStartTargetX - dx;
        this.targetY = this.dragStartTargetY - dy;

        // Clamp to bounds
        this.targetX = Math.max(-this.maxPan, Math.min(this.maxPan, this.targetX));
        this.targetY = Math.max(-this.maxPan, Math.min(this.maxPan, this.targetY));

        // Track velocity for momentum
        this.velX = (this.lastPointerX - pointer.x) * 0.5;
        this.velY = (this.lastPointerY - pointer.y) * 0.5;
      }

      this.lastPointerX = pointer.x;
      this.lastPointerY = pointer.y;
    });

    scene.input.on('pointerup', () => {
      this.isDragging = false;
      // wasDrag stays true so planet click can check it
    });
  }

  /**
   * Returns true if the last pointer interaction was a drag (not a click).
   * Call this in the planet click handler to suppress clicks during pans.
   * Resets the flag after reading.
   */
  consumeDrag() {
    const was = this.wasDrag;
    this.wasDrag = false;
    return was;
  }

  update(delta) {
    // Apply momentum when not dragging
    if (!this.isDragging && (Math.abs(this.velX) > 0.1 || Math.abs(this.velY) > 0.1)) {
      this.targetX += this.velX;
      this.targetY += this.velY;
      this.targetX = Math.max(-this.maxPan, Math.min(this.maxPan, this.targetX));
      this.targetY = Math.max(-this.maxPan, Math.min(this.maxPan, this.targetY));
      this.velX *= this.friction;
      this.velY *= this.friction;
    }

    // Smooth interpolation toward target
    this.offsetX += (this.targetX - this.offsetX) * this.smoothing;
    this.offsetY += (this.targetY - this.offsetY) * this.smoothing;
  }
}
