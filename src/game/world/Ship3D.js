import * as THREE from 'three';

const TRAIL_LENGTH = 24;

/**
 * A 3D ship that travels between planets on a resource route.
 * Procedural geometry: elongated fuselage + two nacelles + engine glow.
 */
export class Ship3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._fromPos = new THREE.Vector3();
    this._toPos   = new THREE.Vector3();
    this._currentPos = new THREE.Vector3();

    this._buildMesh();
    this._createTrail();
    this._createEngineGlow();
  }

  _buildMesh() {
    // Fuselage — elongated cylinder along Z axis
    const fuselageGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.0, 8);
    fuselageGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x221500),
    });
    this._fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    this.group.add(this._fuselage);

    // Left nacelle
    const nacelleGeo = new THREE.BoxGeometry(0.1, 0.1, 0.5);
    const nacelleMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    this._nacelleL = new THREE.Mesh(nacelleGeo, nacelleMat);
    this._nacelleL.position.set(-0.28, 0, 0.1);
    this.group.add(this._nacelleL);

    // Right nacelle
    this._nacelleR = new THREE.Mesh(nacelleGeo.clone(), nacelleMat.clone());
    this._nacelleR.position.set( 0.28, 0, 0.1);
    this.group.add(this._nacelleR);
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color: 0x4af0ff,
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
    this._engineLight = new THREE.PointLight(0x4af0ff, 0.6, 4);
    this._engineLight.position.set(0, 0, -0.6);
    this.group.add(this._engineLight);

    const glowGeo = new THREE.ConeGeometry(0.06, 0.3, 8);
    glowGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4af0ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._engineCone = new THREE.Mesh(glowGeo, glowMat);
    this._engineCone.position.set(0, 0, -0.55);
    this.group.add(this._engineCone);
  }

  /**
   * Activate this ship for a route leg.
   * @param {THREE.Vector3} fromPos - Starting world position
   * @param {THREE.Vector3} toPos   - Ending world position
   */
  activate(fromPos, toPos) {
    this._fromPos.copy(fromPos);
    this._toPos.copy(toPos);
    this.group.visible = true;
    // Initialize trail at start position
    for (const v of this._trailPositions) v.copy(fromPos);
    this.update(0, fromPos, toPos);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update ship position along the route.
   * @param {number} t         - Progress 0..1
   * @param {THREE.Vector3} fromPos - Live from-planet world position
   * @param {THREE.Vector3} toPos   - Live to-planet world position
   */
  update(t, fromPos, toPos) {
    // Lerp with a sine arc on Y for visual interest
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

    // Update trail geometry (world space positions, but trail is child of group... use world coords)
    const positions = this._trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      // Trail rendered in group local space — transform back
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
  }
}
