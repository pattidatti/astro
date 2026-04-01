import * as THREE from 'three';

const TRAIL_LENGTH = 20;
const CARGO_THRESHOLD = 3;
const ORBIT_MIN = 11.5;
const ORBIT_MAX = 13.5;

/**
 * Base class for 3D robots. Handles orbital flight, cargo cycle, and engine trail.
 * Subclasses override _buildMesh() to define unique geometry.
 */
export class Robot3D {
  constructor(index) {
    this.group = new THREE.Group();

    // Orbital parameters
    this.orbitRadius = ORBIT_MIN + Math.random() * (ORBIT_MAX - ORBIT_MIN);
    this.orbitSpeed = 0.3 + Math.random() * 0.2;
    this.angle = Math.random() * Math.PI * 2;
    this.phaseOffset = Math.random() * Math.PI * 2;
    this.verticalAmp = 0.8 + Math.random() * 1.2;

    // Cargo cycle
    this.cargo = Math.random() * CARGO_THRESHOLD;
    this.returning = false;
    this.returnProgress = 0;
    this.returnStart = new THREE.Vector3();

    // Station position (set by manager)
    this.stationPos = new THREE.Vector3(0, 0, 15);

    // Build robot mesh (overridden by subclasses)
    this.mesh = this._buildMesh();
    this.mesh.scale.setScalar(0.3);
    this.group.add(this.mesh);

    // Engine trail
    this._createTrail();
  }

  /** Override in subclasses */
  _buildMesh() {
    const geo = new THREE.BoxGeometry(1, 0.6, 0.8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e,
      metalness: 0.7,
      roughness: 0.3,
    });
    return new THREE.Mesh(geo, mat);
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this.trailGeo = new THREE.BufferGeometry();
    this.trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.trailMat = new THREE.LineBasicMaterial({
      color: 0x7cb85e,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.trail = new THREE.Line(this.trailGeo, this.trailMat);

    // Initialize trail positions
    this.trailPositions = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      this.trailPositions.push(new THREE.Vector3());
    }
  }

  /**
   * Update robot position and cargo cycle.
   * @param {number} dt - Delta time
   * @param {number} time - Total elapsed time
   */
  update(dt, time) {
    if (this.returning) {
      this._updateReturn(dt);
    } else {
      this._updateOrbit(dt, time);
      this.cargo += dt * 0.5;
      if (this.cargo >= CARGO_THRESHOLD) {
        this.returning = true;
        this.returnProgress = 0;
        this.returnStart.copy(this.group.position);
      }
    }

    this._updateTrail();
  }

  _updateOrbit(dt, time) {
    this.angle += this.orbitSpeed * dt;
    const wobble = Math.sin(this.phaseOffset + time * 0.7) * 0.4;

    this.group.position.set(
      Math.cos(this.angle) * (this.orbitRadius + wobble),
      Math.sin(this.phaseOffset + time * 0.5) * this.verticalAmp,
      Math.sin(this.angle) * (this.orbitRadius + wobble)
    );

    // Face direction of travel
    const lookAhead = 0.1;
    const tx = Math.cos(this.angle + lookAhead) * this.orbitRadius;
    const tz = Math.sin(this.angle + lookAhead) * this.orbitRadius;
    this.mesh.lookAt(tx, this.group.position.y, tz);
  }

  _updateReturn(dt) {
    this.returnProgress += dt * 0.5;
    if (this.returnProgress >= 1) {
      // Arrived at station, dump cargo, return to orbit
      this.returning = false;
      this.cargo = 0;
      this.returnProgress = 0;
      return;
    }

    // Lerp to station
    const t = this.returnProgress;
    const ease = t * t * (3 - 2 * t); // smoothstep
    this.group.position.lerpVectors(this.returnStart, this.stationPos, ease);

    // Face station
    this.mesh.lookAt(this.stationPos);

    // Brighter trail when returning
    this.trailMat.opacity = 0.7;
  }

  _updateTrail() {
    // Shift trail positions
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this.trailPositions[i].copy(this.trailPositions[i - 1]);
    }
    // World position of robot
    this.trailPositions[0].copy(this.group.position);

    // Update buffer
    const arr = this.trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      arr[i * 3] = this.trailPositions[i].x;
      arr[i * 3 + 1] = this.trailPositions[i].y;
      arr[i * 3 + 2] = this.trailPositions[i].z;
    }
    this.trailGeo.attributes.position.needsUpdate = true;

    // Fade trail when orbiting
    if (!this.returning) {
      this.trailMat.opacity += (0.25 - this.trailMat.opacity) * 0.1;
    }
  }

  dispose() {
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    this.trailGeo.dispose();
    this.trailMat.dispose();
  }
}
