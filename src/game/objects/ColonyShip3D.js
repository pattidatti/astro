import * as THREE from 'three';

const TRAIL_LENGTH = 32;

/**
 * Colony ship with habitat-ring design.
 * Dual-mode: orbit (circles a planet) and travel (flies between planets).
 * Geometry: central cylinder + habitat torus ring + 4 engine nacelles.
 */
export class ColonyShip3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;
    this.group.scale.setScalar(1.5);

    this._fromPos = new THREE.Vector3();
    this._toPos = new THREE.Vector3();
    this._currentPos = new THREE.Vector3();

    // Orbit parameters
    this._orbitRadius = 20;
    this._orbitSpeed = 0.08;

    this._buildMesh();
    this._createTrail();
    this._createEngineGlow();
    this._createHitbox();
  }

  _buildMesh() {
    // Central module — elongated cylinder along Z axis
    const moduleGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.0, 12);
    moduleGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const moduleMat = new THREE.MeshStandardMaterial({
      color: 0xd4a843,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x221500),
      emissiveIntensity: 0.3,
    });
    this._module = new THREE.Mesh(moduleGeo, moduleMat);
    this.group.add(this._module);

    // Habitat ring — torus centered on the cylinder
    const ringGeo = new THREE.TorusGeometry(1.2, 0.15, 8, 24);
    ringGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc67b30,
      metalness: 0.7,
      roughness: 0.3,
      emissive: new THREE.Color(0x1a0800),
      emissiveIntensity: 0.2,
    });
    this._ring = new THREE.Mesh(ringGeo, ringMat);
    this.group.add(this._ring);

    // 4 engine nacelles at corners
    const nacelleGeo = new THREE.BoxGeometry(0.15, 0.15, 0.8);
    const nacelleMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.1,
    });

    const offsets = [
      [ 0.8,  0.8, -0.6],
      [-0.8,  0.8, -0.6],
      [ 0.8, -0.8, -0.6],
      [-0.8, -0.8, -0.6],
    ];

    this._nacelles = offsets.map(([x, y, z]) => {
      const n = new THREE.Mesh(nacelleGeo.clone(), nacelleMat.clone());
      n.position.set(x, y, z);
      this.group.add(n);
      return n;
    });
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color: 0xd4a843,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._trail = new THREE.Line(this._trailGeo, this._trailMat);
    this._trailPositions = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3());
    this.group.add(this._trail);
  }

  _createEngineGlow() {
    this._engineLights = [];
    this._engineCones = [];

    const glowGeo = new THREE.ConeGeometry(0.06, 0.3, 8);
    glowGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    const offsets = [
      [ 0.8,  0.8, -1.0],
      [-0.8,  0.8, -1.0],
      [ 0.8, -0.8, -1.0],
      [-0.8, -0.8, -1.0],
    ];

    for (const [x, y, z] of offsets) {
      const light = new THREE.PointLight(0xd4a843, 0.4, 4);
      light.position.set(x, y, z);
      this.group.add(light);
      this._engineLights.push(light);

      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xd4a843,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(glowGeo.clone(), glowMat);
      cone.position.set(x, y, z + 0.05);
      this.group.add(cone);
      this._engineCones.push(cone);
    }
  }

  _createHitbox() {
    const geo = new THREE.SphereGeometry(2.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitbox = new THREE.Mesh(geo, mat);
    this.hitbox.userData.isColonyShip = true;
    this.group.add(this.hitbox);
  }

  // ─── Orbit mode ───────────────────────────────────────────────────────────

  /** Update position for orbital mode (called by SolarSystem) */
  updateOrbit(time) {
    const angle = time * this._orbitSpeed + Math.PI; // offset from station
    this.group.position.set(
      Math.cos(angle) * this._orbitRadius,
      Math.sin(angle * 0.3) * 2,
      Math.sin(angle) * this._orbitRadius,
    );
    this.group.rotation.y = time * 0.08;
  }

  // ─── Travel mode ──────────────────────────────────────────────────────────

  /**
   * Activate for travel between planets.
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   */
  activate(fromPos, toPos) {
    this._fromPos.copy(fromPos);
    this._toPos.copy(toPos);
    this.group.visible = true;
    for (const v of this._trailPositions) v.copy(fromPos);
    this.update(0, fromPos, toPos);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update ship position along route (same API as Ship3D).
   * @param {number} t         - Progress 0..1
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   */
  update(t, fromPos, toPos) {
    this._currentPos.lerpVectors(fromPos, toPos, t);
    const arcHeight = fromPos.distanceTo(toPos) * 0.12;
    this._currentPos.y += Math.sin(t * Math.PI) * arcHeight;

    this.group.position.copy(this._currentPos);

    // Face direction of travel
    const tangent = new THREE.Vector3().subVectors(toPos, fromPos);
    tangent.y += Math.cos(t * Math.PI) * arcHeight * 2;
    if (tangent.lengthSq() > 0.0001) {
      tangent.normalize();
      this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // Shift trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this._trailPositions[i].copy(this._trailPositions[i - 1]);
    }
    this._trailPositions[0].copy(this._currentPos);

    // Update trail geometry in local space
    const positions = this._trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const local = this._trailPositions[i].clone().sub(this._currentPos);
      const inv = new THREE.Quaternion().copy(this.group.quaternion).invert();
      local.applyQuaternion(inv);
      positions[i * 3]     = local.x;
      positions[i * 3 + 1] = local.y;
      positions[i * 3 + 2] = local.z;
    }
    this._trailGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._trailGeo.dispose();
    this._trailMat.dispose();
    for (const cone of this._engineCones) {
      cone.geometry.dispose();
      cone.material.dispose();
    }
  }
}
