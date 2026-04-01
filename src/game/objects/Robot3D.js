import * as THREE from 'three';

const TRAIL_LENGTH      = 20;
const CARGO_THRESHOLD   = 3;
const ORBIT_MIN         = 11.5;
const ORBIT_MAX         = 13.5;
const PLANET_SURFACE_RADIUS = 10;

const MINE_STATE = {
  ORBITING:     'ORBITING',
  DESCENDING:   'DESCENDING',
  SURFACE_MOVE: 'SURFACE_MOVE',
  BORING_IN:    'BORING_IN',
  UNDERGROUND:  'UNDERGROUND',
  BORING_OUT:   'BORING_OUT',
  ASCENDING:    'ASCENDING',
  RETURNING:    'RETURNING',
};

const MINE_DURATIONS = {
  DESCENDING:   2.0,
  SURFACE_MOVE: 2.0,
  BORING_IN:    0.5,
  UNDERGROUND:  3.0,
  BORING_OUT:   0.5,
  ASCENDING:    2.0,
};

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// Module-level temp vectors to avoid per-frame allocation
const _PLANET_CENTER = new THREE.Vector3(0, 0, 0);

/**
 * Base class for 3D robots. Handles orbital flight, surface mining cycle,
 * cargo return, and engine trail. Subclasses override _buildMesh() for geometry.
 */
export class Robot3D {
  constructor(index) {
    this.group = new THREE.Group();

    // Orbital parameters
    this.orbitRadius  = ORBIT_MIN + Math.random() * (ORBIT_MAX - ORBIT_MIN);
    this.orbitSpeed   = 0.3 + Math.random() * 0.2;
    this.angle        = Math.random() * Math.PI * 2;
    this.phaseOffset  = Math.random() * Math.PI * 2;
    this.verticalAmp  = 0.8 + Math.random() * 1.2;

    // Cargo
    this.cargo = Math.random() * CARGO_THRESHOLD;

    // Mining state machine
    this.mineState     = MINE_STATE.ORBITING;
    this.mineProgress  = 0;
    this.mineStart     = new THREE.Vector3();
    this.surfacePoint  = new THREE.Vector3();
    this.surfaceMoveEnd = new THREE.Vector3();
    this.returnStart   = new THREE.Vector3();
    this.returnProgress = 0;
    this.speedMultiplier = 1.0;

    // Callbacks set by owner (RobotManager3D)
    this.onDelivery    = null;   // () => void — fired when cargo delivered to station
    this.onMiningBurst = null;   // (localPos, normal) => void — particle burst at surface

    // Station position (set by manager)
    this.stationPos = new THREE.Vector3(0, 0, 15);

    // Build robot mesh (overridden by subclasses)
    this.mesh = this._buildMesh();
    this.mesh.scale.setScalar(0.3);
    this.group.add(this.mesh);

    // Engine trail
    this._createTrail();
  }

  /** Backward-compat getter — true only during RETURNING phase */
  get returning() { return this.mineState === MINE_STATE.RETURNING; }

  /** Override in subclasses to build unique geometry. Must return a THREE.Group. */
  _buildMesh() {
    const geo = new THREE.BoxGeometry(1, 0.6, 0.8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xc8a84e, metalness: 0.7, roughness: 0.3 });
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

    this.trailPositions = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      this.trailPositions.push(new THREE.Vector3());
    }
  }

  /**
   * Main update — dispatches to current state handler, then updates trail + visuals.
   */
  update(dt, time) {
    switch (this.mineState) {
      case MINE_STATE.ORBITING:     this._updateOrbit(dt, time); this._tickCargo(dt); break;
      case MINE_STATE.DESCENDING:   this._updateDescending(dt);   break;
      case MINE_STATE.SURFACE_MOVE: this._updateSurfaceMove(dt);  break;
      case MINE_STATE.BORING_IN:    this._updateBoringIn(dt);     break;
      case MINE_STATE.UNDERGROUND:  this._updateUnderground(dt);  break;
      case MINE_STATE.BORING_OUT:   this._updateBoringOut(dt);    break;
      case MINE_STATE.ASCENDING:    this._updateAscending(dt);    break;
      case MINE_STATE.RETURNING:    this._updateReturn(dt);       break;
    }
    this._updateTrail();
  }

  _tickCargo(dt) {
    this.cargo += dt * 0.5;
    if (this.cargo >= CARGO_THRESHOLD) {
      this._startDescending();
    }
  }

  _startDescending() {
    this.mineState    = MINE_STATE.DESCENDING;
    this.mineProgress = 0;
    this.mineStart.copy(this.group.position);

    // Surface point directly below current orbit position
    this.surfacePoint.copy(this.group.position)
      .normalize()
      .multiplyScalar(PLANET_SURFACE_RADIUS);

    // Tangential surface move endpoint — side-step along the surface
    const nx = this.surfacePoint.x / PLANET_SURFACE_RADIUS;
    const nz = this.surfacePoint.z / PLANET_SURFACE_RADIUS;
    const tx = -nz;
    const tz =  nx;
    const dist = 1.5 + Math.random() * 2.0;
    this.surfaceMoveEnd.set(
      this.surfacePoint.x + tx * dist,
      this.surfacePoint.y,
      this.surfacePoint.z + tz * dist,
    ).normalize().multiplyScalar(PLANET_SURFACE_RADIUS);
  }

  _updateDescending(dt) {
    const dur = MINE_DURATIONS.DESCENDING / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress = 0;
      this.mineState = MINE_STATE.SURFACE_MOVE;
      return;
    }
    const ease = smoothstep(this.mineProgress);
    this.group.position.lerpVectors(this.mineStart, this.surfacePoint, ease);
    this.mesh.lookAt(this.surfacePoint);
  }

  _updateSurfaceMove(dt) {
    const dur = MINE_DURATIONS.SURFACE_MOVE / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress = 0;
      this.mineState = MINE_STATE.BORING_IN;
      this._fireBurst(this.surfaceMoveEnd);
      return;
    }
    const ease = smoothstep(this.mineProgress);
    this.group.position.lerpVectors(this.surfacePoint, this.surfaceMoveEnd, ease);
    this.mesh.lookAt(this.surfaceMoveEnd);
  }

  _updateBoringIn(dt) {
    const dur = MINE_DURATIONS.BORING_IN / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress = 0;
      this.mineState = MINE_STATE.UNDERGROUND;
      this.mesh.visible = false;
      this.mesh.scale.setScalar(0.3);
      // Reset trail positions to surface point so it starts clean on emergence
      for (const p of this.trailPositions) p.copy(this.surfaceMoveEnd);
      return;
    }
    const t = smoothstep(this.mineProgress);
    this.mesh.scale.setScalar(0.3 * (1 - t));
    this.group.position.copy(this.surfaceMoveEnd);
    this.mesh.lookAt(_PLANET_CENTER);
  }

  _updateUnderground(dt) {
    const dur = MINE_DURATIONS.UNDERGROUND / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress = 0;
      this.mineState = MINE_STATE.BORING_OUT;
      this.mesh.visible = true;
      this.mesh.scale.setScalar(0);
      this._fireBurst(this.surfaceMoveEnd);
    }
  }

  _updateBoringOut(dt) {
    const dur = MINE_DURATIONS.BORING_OUT / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress = 0;
      this.mineState = MINE_STATE.ASCENDING;
      this.mesh.scale.setScalar(0.3);
      return;
    }
    const t = smoothstep(this.mineProgress);
    this.mesh.scale.setScalar(0.3 * t);
    this.group.position.copy(this.surfaceMoveEnd);
    this.mesh.lookAt(this.mineStart);
  }

  _updateAscending(dt) {
    const dur = MINE_DURATIONS.ASCENDING / this.speedMultiplier;
    this.mineProgress += dt / dur;
    if (this.mineProgress >= 1) {
      this.mineProgress  = 0;
      this.mineState     = MINE_STATE.RETURNING;
      this.returnProgress = 0;
      this.returnStart.copy(this.group.position);
      return;
    }
    const ease = smoothstep(this.mineProgress);
    this.group.position.lerpVectors(this.surfaceMoveEnd, this.mineStart, ease);
    this.mesh.lookAt(this.mineStart);
  }

  _updateReturn(dt) {
    this.returnProgress += dt * 0.5;
    if (this.returnProgress >= 1) {
      if (this.onDelivery) this.onDelivery();
      this.mineState      = MINE_STATE.ORBITING;
      this.cargo          = 0;
      this.returnProgress = 0;
      this.mineProgress   = 0;
      return;
    }
    const t    = this.returnProgress;
    const ease = t * t * (3 - 2 * t);
    this.group.position.lerpVectors(this.returnStart, this.stationPos, ease);
    this.mesh.lookAt(this.stationPos);
    this.trailMat.opacity = 0.7;
  }

  _fireBurst(pos) {
    if (this.onMiningBurst) {
      this.onMiningBurst(pos.clone(), pos.clone().normalize());
    }
  }

  _updateOrbit(dt, time) {
    this.angle += this.orbitSpeed * dt;
    const wobble = Math.sin(this.phaseOffset + time * 0.7) * 0.4;

    this.group.position.set(
      Math.cos(this.angle) * (this.orbitRadius + wobble),
      Math.sin(this.phaseOffset + time * 0.5) * this.verticalAmp,
      Math.sin(this.angle) * (this.orbitRadius + wobble),
    );

    // Face direction of travel
    const lookAhead = 0.1;
    const tx = Math.cos(this.angle + lookAhead) * this.orbitRadius;
    const tz = Math.sin(this.angle + lookAhead) * this.orbitRadius;
    this.mesh.lookAt(tx, this.group.position.y, tz);
  }

  _updateTrail() {
    // Suppress trail during boring/underground phases
    const surfaceOp = (
      this.mineState === MINE_STATE.BORING_IN ||
      this.mineState === MINE_STATE.UNDERGROUND ||
      this.mineState === MINE_STATE.BORING_OUT
    );
    if (surfaceOp) {
      this.trailMat.opacity += (0 - this.trailMat.opacity) * 0.15;
      return;
    }

    // Shift trail positions
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this.trailPositions[i].copy(this.trailPositions[i - 1]);
    }
    this.trailPositions[0].copy(this.group.position);

    // Update buffer
    const arr = this.trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      arr[i * 3]     = this.trailPositions[i].x;
      arr[i * 3 + 1] = this.trailPositions[i].y;
      arr[i * 3 + 2] = this.trailPositions[i].z;
    }
    this.trailGeo.attributes.position.needsUpdate = true;

    // Fade trail: bright during return, dim otherwise
    if (this.mineState !== MINE_STATE.RETURNING) {
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
