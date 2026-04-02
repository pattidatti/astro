import * as THREE from 'three';

const TRAIL_LENGTH = 28;

const RESOURCE_ENGINE_COLORS = {
  ore:     new THREE.Color(0xffaa22),  // warm amber
  energy:  new THREE.Color(0x44ddff),  // cyan
  crystal: new THREE.Color(0xcc66ff),  // purple
};

const RESOURCE_CARGO_COLORS = {
  ore:     new THREE.Color(0xd4a843),
  energy:  new THREE.Color(0x4af0ff),
  crystal: new THREE.Color(0xaa44ee),
};

/**
 * A 3D cargo ship that travels between planets on a resource route.
 * Wide, flat cargo-hauler silhouette with resource-colored engine trail.
 */
export class Ship3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._fromPos    = new THREE.Vector3();
    this._toPos      = new THREE.Vector3();
    this._currentPos = new THREE.Vector3();
    this._resource   = 'ore';

    this._buildMesh();
    this._createTrail();
    this._createEngineGlow();
    this.group.scale.setScalar(5);
  }

  _buildMesh() {
    const hullMat = new THREE.MeshStandardMaterial({
      color:             0x3a4a5c,
      metalness:         0.85,
      roughness:         0.25,
      emissive:          new THREE.Color(0x3366cc),
      emissiveIntensity: 2.0,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color:             0xd4a843,
      metalness:         0.9,
      roughness:         0.15,
      emissive:          new THREE.Color(0xd4a843),
      emissiveIntensity: 1.2,
    });

    // ── Main fuselage — flat, wide cargo hauler ──
    const fuseGeo = new THREE.BoxGeometry(1.0, 0.28, 2.2);
    this._fuselage = new THREE.Mesh(fuseGeo, hullMat);
    this.group.add(this._fuselage);

    // ── Cockpit nose — tapered front ──
    const cockpitGeo = new THREE.ConeGeometry(0.18, 0.55, 5);
    cockpitGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const cockpitMat = new THREE.MeshStandardMaterial({
      color:     0x2a3848,
      metalness: 0.9,
      roughness: 0.2,
      emissive:  new THREE.Color(0x000408),
    });
    this._cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    this._cockpit.position.set(0, 0.05, 1.35);
    this.group.add(this._cockpit);

    // ── Gold hull trim strips ──
    const trimGeo = new THREE.BoxGeometry(1.05, 0.04, 0.06);
    this._trimFront = new THREE.Mesh(trimGeo, trimMat);
    this._trimFront.position.set(0, 0.16, 0.8);
    this.group.add(this._trimFront);

    this._trimMid = new THREE.Mesh(trimGeo.clone(), trimMat.clone());
    this._trimMid.position.set(0, 0.16, -0.3);
    this.group.add(this._trimMid);

    // ── Cargo pod — raised center section, glows by resource ──
    const cargoPodGeo = new THREE.BoxGeometry(0.62, 0.22, 0.9);
    this._cargoMat = new THREE.MeshStandardMaterial({
      color:     RESOURCE_CARGO_COLORS.ore,
      metalness: 0.3,
      roughness: 0.6,
      emissive:  RESOURCE_CARGO_COLORS.ore.clone().multiplyScalar(0.35),
    });
    this._cargoPod = new THREE.Mesh(cargoPodGeo, this._cargoMat);
    this._cargoPod.position.set(0, 0.25, -0.2);
    this.group.add(this._cargoPod);

    // ── Engine nacelles — wide rear pods ──
    const nacelleGeo = new THREE.CylinderGeometry(0.13, 0.17, 0.85, 8);
    nacelleGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const nacelleMat = new THREE.MeshStandardMaterial({
      color:             0x445566,
      metalness:         0.9,
      roughness:         0.15,
      emissive:          new THREE.Color(0x2244aa),
      emissiveIntensity: 2.5,
    });

    this._nacelleL = new THREE.Mesh(nacelleGeo, nacelleMat);
    this._nacelleL.position.set(-0.52, -0.04, -0.65);
    this.group.add(this._nacelleL);

    this._nacelleR = new THREE.Mesh(nacelleGeo.clone(), nacelleMat.clone());
    this._nacelleR.position.set( 0.52, -0.04, -0.65);
    this.group.add(this._nacelleR);

    // ── Wing struts connecting fuselage to nacelles ──
    const strutGeo = new THREE.BoxGeometry(0.44, 0.06, 0.4);
    this._strutL = new THREE.Mesh(strutGeo, hullMat.clone());
    this._strutL.position.set(-0.32, -0.04, -0.5);
    this.group.add(this._strutL);

    this._strutR = new THREE.Mesh(strutGeo.clone(), hullMat.clone());
    this._strutR.position.set( 0.32, -0.04, -0.5);
    this.group.add(this._strutR);
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color:       RESOURCE_ENGINE_COLORS.ore,
      transparent: true,
      opacity:     0.6,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    this._trail = new THREE.Line(this._trailGeo, this._trailMat);
    this._trailPositions = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3());
    this.group.add(this._trail);
  }

  _createEngineGlow() {
    // Left engine
    this._engineLightL = new THREE.PointLight(RESOURCE_ENGINE_COLORS.ore, 1.2, 6);
    this._engineLightL.position.set(-0.52, -0.04, -1.15);
    this.group.add(this._engineLightL);

    // Right engine
    this._engineLightR = new THREE.PointLight(RESOURCE_ENGINE_COLORS.ore, 1.2, 6);
    this._engineLightR.position.set( 0.52, -0.04, -1.15);
    this.group.add(this._engineLightR);

    const glowMat = new THREE.MeshBasicMaterial({
      color:       RESOURCE_ENGINE_COLORS.ore,
      transparent: true,
      opacity:     0.85,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const glowGeo = new THREE.ConeGeometry(0.08, 0.45, 8);
    glowGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    this._engineGlowL = new THREE.Mesh(glowGeo, glowMat.clone());
    this._engineGlowL.position.set(-0.52, -0.04, -1.08);
    this.group.add(this._engineGlowL);

    this._engineGlowR = new THREE.Mesh(glowGeo.clone(), glowMat.clone());
    this._engineGlowR.position.set( 0.52, -0.04, -1.08);
    this.group.add(this._engineGlowR);
  }

  _applyResourceColors(resource) {
    this._resource = resource || 'ore';
    const engColor   = RESOURCE_ENGINE_COLORS[this._resource] ?? RESOURCE_ENGINE_COLORS.ore;
    const cargoColor = RESOURCE_CARGO_COLORS[this._resource]  ?? RESOURCE_CARGO_COLORS.ore;

    this._trailMat.color.copy(engColor);
    this._engineLightL.color.copy(engColor);
    this._engineLightR.color.copy(engColor);
    this._engineGlowL.material.color.copy(engColor);
    this._engineGlowR.material.color.copy(engColor);

    this._cargoMat.color.copy(cargoColor);
    this._cargoMat.emissive.copy(cargoColor).multiplyScalar(0.35);
  }

  /**
   * Activate this ship for a route leg.
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   * @param {string} [resource]
   */
  activate(fromPos, toPos, resource) {
    this._fromPos.copy(fromPos);
    this._toPos.copy(toPos);
    this._applyResourceColors(resource);
    this.group.visible = true;
    for (const v of this._trailPositions) v.copy(fromPos);
    this.update(0, fromPos, toPos);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update ship position along the route.
   * @param {number} t         - Progress 0..1
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   */
  update(t, fromPos, toPos) {
    this._currentPos.lerpVectors(fromPos, toPos, t);
    const arcHeight = fromPos.distanceTo(toPos) * 0.10;
    this._currentPos.y += Math.sin(t * Math.PI) * arcHeight;

    this.group.position.copy(this._currentPos);

    // Face direction of travel
    const tangent = new THREE.Vector3().subVectors(toPos, fromPos);
    tangent.y += Math.cos(t * Math.PI) * arcHeight * 2;
    if (tangent.lengthSq() > 0.0001) {
      tangent.normalize();
      this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // Pulse engine glow intensity slightly
    const pulse = 0.9 + Math.sin(t * Math.PI * 40) * 0.1;
    this._engineLightL.intensity = 1.2 * pulse;
    this._engineLightR.intensity = 1.2 * pulse;

    // Shift trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this._trailPositions[i].copy(this._trailPositions[i - 1]);
    }
    this._trailPositions[0].copy(this._currentPos);

    const positions = this._trailGeo.attributes.position.array;
    const invScale = 1 / this.group.scale.x;
    const inv = new THREE.Quaternion().copy(this.group.quaternion).invert();
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const local = this._trailPositions[i].clone().sub(this._currentPos);
      local.applyQuaternion(inv);
      positions[i * 3]     = local.x * invScale;
      positions[i * 3 + 1] = local.y * invScale;
      positions[i * 3 + 2] = local.z * invScale;
    }
    this._trailGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._trailGeo.dispose();
    this._trailMat.dispose();
  }
}
