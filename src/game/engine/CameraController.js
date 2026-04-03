import * as THREE from 'three';

const ORBIT_DAMPING = 0.08;
const ZOOM_SPEED = 0.08;
const MIN_DISTANCE = 3;
const PLANET_BUFFER = 0.5;
const MAX_DISTANCE = 600;
const MIN_POLAR = 0.1;
const MAX_POLAR = Math.PI - 0.1;

// Free camera
const FREE_MOVE_SPEED = 30;
const FREE_LOOK_SPEED = 0.002;

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Orbital state
    this.target = new THREE.Vector3(0, 0, 0);
    this.spherical = new THREE.Spherical(100, Math.PI / 3, 0);

    // Smooth interpolation targets
    this.targetSpherical = new THREE.Spherical(100, Math.PI / 3, 0);
    this.targetTarget = new THREE.Vector3(0, 0, 0);

    // Interaction state
    this.isDragging = false;
    this.isPanning = false;
    this.dragStart = new THREE.Vector2();
    this.dragDelta = new THREE.Vector2();
    this.dragDistance = 0;

    // Free camera mode
    this.freeMode = false;
    this.keys = {};
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

    this._lastZoom = 0;

    this._bindEvents();
    this._updateCameraPosition();
  }

  _bindEvents() {
    const el = this.domElement;

    el.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    el.addEventListener('pointermove', (e) => this._onPointerMove(e));
    el.addEventListener('pointerup', (e) => this._onPointerUp(e));
    el.addEventListener('pointercancel', (e) => this._onPointerUp(e));
    el.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.freeMode = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.freeMode = false;
      }
    });
  }

  _onPointerDown(e) {
    if (e.button === 0) {
      this.isDragging = true;
    } else if (e.button === 1 || e.button === 2) {
      this.isPanning = true;
    }
    this.dragStart.set(e.clientX, e.clientY);
    this.dragDistance = 0;
  }

  _onPointerMove(e) {
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    this.dragDistance = Math.sqrt(dx * dx + dy * dy);

    if (this.isDragging && this.dragDistance > 4) {
      if (this.freeMode) {
        // Free-look rotation
        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= e.movementX * FREE_LOOK_SPEED;
        this.euler.x -= e.movementY * FREE_LOOK_SPEED;
        this.euler.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.euler.x));
        this.camera.quaternion.setFromEuler(this.euler);
      } else {
        // Orbital rotation
        this.targetSpherical.theta -= e.movementX * 0.005;
        this.targetSpherical.phi -= e.movementY * 0.005;
        this.targetSpherical.phi = Math.max(MIN_POLAR, Math.min(MAX_POLAR, this.targetSpherical.phi));
      }
    }

    if (this.isPanning) {
      // Pan the orbital target
      const panSpeed = this.spherical.radius * 0.001;
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();
      right.setFromMatrixColumn(this.camera.matrixWorld, 0);
      up.setFromMatrixColumn(this.camera.matrixWorld, 1);
      this.targetTarget.addScaledVector(right, -e.movementX * panSpeed);
      this.targetTarget.addScaledVector(up, e.movementY * panSpeed);
    }

    this.dragStart.set(e.clientX, e.clientY);
  }

  _onPointerUp(_e) {
    this.isDragging = false;
    this.isPanning = false;
  }

  _onWheel(e) {
    e.preventDefault();
    const now = performance.now();
    const r = this.targetSpherical.radius;
    // Detect touchpad: pixel-mode scroll with small per-event delta.
    // Mouse wheel typically sends |deltaY| ≥ 100; touchpad sends < 50.
    const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
    // Throttle: touchpad fires ~30 events/s; mouse wheel fires ~3/s.
    // At planet level, slow down further. At galaxy level, throttle touchpad more.
    const throttleMs = r < 15 ? 120 : r < 45 ? 50 : isTouchpad ? 100 : 16;
    if (now - this._lastZoom < throttleMs) return;
    this._lastZoom = now;

    const speed = r < 15 ? 0.04 : r < 45 ? 0.08 : isTouchpad ? 0.08 : 0.10;
    const zoomFactor = 1 + Math.sign(e.deltaY) * speed;
    this.targetSpherical.radius = Math.max(
      MIN_DISTANCE,
      Math.min(MAX_DISTANCE, this.targetSpherical.radius * zoomFactor)
    );
  }

  /** Register planet spheres for camera collision */
  setPlanetColliders(colliders) {
    this._planetColliders = colliders;
  }

  /** Smoothly focus camera on a world position at planet-level zoom */
  focusOnPosition(position, distance = 30) {
    this._trackFn = null;
    this.targetTarget.copy(position);
    this.targetSpherical.radius = distance;
  }

  /** Track a moving object's world position each frame */
  trackObject(getPositionFn, distance = 30) {
    this._trackFn = getPositionFn;
    this.targetSpherical.radius = distance;
  }

  /** Stop tracking, keep current position */
  stopTracking() {
    this._trackFn = null;
  }

  /** Returns whether the last pointer interaction was a click (not drag) */
  wasClick() {
    return this.dragDistance < 8;
  }

  /** Get approximate zoom level category */
  /**
   * Subtle zoom-in punch that bounces back via damping.
   * @param {number} strength - 0.03 = subtle, 0.08 = strong
   */
  zoomPunch(strength = 0.03) {
    if (this.freeMode) return;
    this._punchRestore = this.targetSpherical.radius;
    this.targetSpherical.radius *= (1 - strength);
    this._punchFrame = true;
  }

  /**
   * Start a camera shake effect for combat impacts.
   * @param {number} intensity - Shake strength (0.01 = subtle, 0.1 = heavy)
   * @param {number} duration - Duration in seconds
   */
  shake(intensity = 0.03, duration = 0.3) {
    this._shakeIntensity = intensity;
    this._shakeDuration = duration;
    this._shakeElapsed = 0;
  }

  getZoomLevel() {
    const d = this.spherical.radius;
    if (d > 200) return 'galaxy';
    if (d > 50) return 'system';
    if (d > 15) return 'planet';
    return 'close';
  }

  update(dt) {
    if (this.freeMode) {
      // Free movement with WASD
      const speed = FREE_MOVE_SPEED * dt;
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      const right = new THREE.Vector3();
      right.crossVectors(dir, this.camera.up).normalize();

      if (this.keys['KeyW']) this.camera.position.addScaledVector(dir, speed);
      if (this.keys['KeyS']) this.camera.position.addScaledVector(dir, -speed);
      if (this.keys['KeyA']) this.camera.position.addScaledVector(right, -speed);
      if (this.keys['KeyD']) this.camera.position.addScaledVector(right, speed);
      if (this.keys['Space']) this.camera.position.y += speed;
      if (this.keys['KeyC']) this.camera.position.y -= speed;
    } else {
      // WASD pan in orbital mode
      const wasdKeys = this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD'];
      if (wasdKeys) {
        this._trackFn = null;
        const panSpeed = this.spherical.radius * 0.8 * dt;
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        if (forward.lengthSq() < 0.0001) forward.set(0, 0, -1);
        forward.normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        if (this.keys['KeyW']) this.targetTarget.addScaledVector(forward, panSpeed);
        if (this.keys['KeyS']) this.targetTarget.addScaledVector(forward, -panSpeed);
        if (this.keys['KeyA']) this.targetTarget.addScaledVector(right, -panSpeed);
        if (this.keys['KeyD']) this.targetTarget.addScaledVector(right, panSpeed);
      }

      // If tracking a moving object, update target each frame
      if (this._trackFn) {
        const pos = this._trackFn();
        if (pos) this.targetTarget.copy(pos);
      }

      // Restore zoom after punch (1 frame delay so damping catches the dip)
      if (this._punchFrame) {
        this._punchFrame = false;
      } else if (this._punchRestore) {
        this.targetSpherical.radius = this._punchRestore;
        this._punchRestore = null;
      }

      // Smooth orbital interpolation (frame-rate independent)
      const damping = 1 - Math.pow(1 - ORBIT_DAMPING, dt * 60);
      this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * damping;
      this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * damping;
      this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * damping;

      this.target.lerp(this.targetTarget, damping);

      this._updateCameraPosition();

      // Camera shake
      if (this._shakeDuration > 0 && this._shakeElapsed < this._shakeDuration) {
        this._shakeElapsed += dt;
        const decay = 1 - (this._shakeElapsed / this._shakeDuration);
        const offsetX = (Math.random() - 0.5) * 2 * this._shakeIntensity * decay;
        const offsetY = (Math.random() - 0.5) * 2 * this._shakeIntensity * decay;
        this.camera.position.x += offsetX;
        this.camera.position.y += offsetY;
      }
    }
  }

  _updateCameraPosition() {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    const newPos = new THREE.Vector3().copy(this.target).add(offset);

    // Planet collision: prevent camera from entering planet sphere
    if (this._planetColliders) {
      for (const { position, radius } of this._planetColliders) {
        const minDist = radius + PLANET_BUFFER;
        if (newPos.distanceTo(position) < minDist) {
          const dir = newPos.clone().sub(position);
          if (dir.lengthSq() < 0.0001) dir.set(0, 1, 0);
          dir.normalize();
          newPos.copy(position).addScaledVector(dir, minDist);
          this.spherical.radius = newPos.distanceTo(this.target);
          this.targetSpherical.radius = Math.max(this.targetSpherical.radius, this.spherical.radius);
        }
      }
    }

    this.camera.position.copy(newPos);
    this.camera.lookAt(this.target);

    // Dynamic near/far based on zoom distance to reduce Z-fighting
    const d = this.spherical.radius;
    let near, far;
    if (d < 20) {
      near = 0.05; far = 500;
    } else if (d < 80) {
      near = 0.1; far = 1000;
    } else {
      near = 1.0; far = 2000;
    }
    if (this.camera.near !== near || this.camera.far !== far) {
      this.camera.near = near;
      this.camera.far = far;
      this.camera.updateProjectionMatrix();
    }
  }
}
