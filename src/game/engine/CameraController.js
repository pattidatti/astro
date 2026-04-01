import * as THREE from 'three';

const ORBIT_DAMPING = 0.08;
const ZOOM_SPEED = 0.08;
const MIN_DISTANCE = 3;
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
    // Exponential zoom for consistent feel at all distances
    const zoomFactor = 1 + Math.sign(e.deltaY) * ZOOM_SPEED;
    this.targetSpherical.radius = Math.max(
      MIN_DISTANCE,
      Math.min(MAX_DISTANCE, this.targetSpherical.radius * zoomFactor)
    );
  }

  /** Smoothly focus camera on a world position at planet-level zoom */
  focusOnPosition(position, distance = 30) {
    this.targetTarget.copy(position);
    this.targetSpherical.radius = distance;
  }

  /** Returns whether the last pointer interaction was a click (not drag) */
  wasClick() {
    return this.dragDistance < 8;
  }

  /** Get approximate zoom level category */
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
      // Smooth orbital interpolation
      this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * ORBIT_DAMPING;
      this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * ORBIT_DAMPING;
      this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * ORBIT_DAMPING;

      this.target.lerp(this.targetTarget, ORBIT_DAMPING);

      this._updateCameraPosition();
    }
  }

  _updateCameraPosition() {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);

    // Dynamic near/far based on zoom distance to reduce Z-fighting
    const d = this.spherical.radius;
    if (d < 20) {
      this.camera.near = 0.05;
      this.camera.far = 500;
    } else if (d < 80) {
      this.camera.near = 0.1;
      this.camera.far = 1000;
    } else {
      this.camera.near = 1.0;
      this.camera.far = 2000;
    }
    this.camera.updateProjectionMatrix();
  }
}
