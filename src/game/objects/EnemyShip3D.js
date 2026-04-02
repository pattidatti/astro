import * as THREE from 'three';

const TRAIL_LENGTH = 16;

/**
 * A 3D enemy fighter ship. Used for interceptors, bombers, and raiders.
 * Pooled by EnemyManager3D — activate/deactivate as needed.
 */
export class EnemyShip3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._type = null;
    this._targetPos = new THREE.Vector3();
    this._orbitAngle = Math.random() * Math.PI * 2;
    this._orbitRadius = 12 + Math.random() * 6;
    this._verticalOffset = (Math.random() - 0.5) * 4;
    this._speed = 1.0;

    this._buildMesh();
    this._createTrail();
    this._createHPBar();
    this._createEngineGlow();
  }

  _buildMesh() {
    // Shared enemy hull — angular, aggressive look
    const bodyGeo = new THREE.ConeGeometry(0.15, 0.7, 6);
    bodyGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    this._bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      metalness: 0.7,
      roughness: 0.3,
      emissive: new THREE.Color(0x330000),
    });
    this._body = new THREE.Mesh(bodyGeo, this._bodyMat);
    this.group.add(this._body);

    // Wing fins
    const wingGeo = new THREE.BoxGeometry(0.5, 0.03, 0.25);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x882222,
      metalness: 0.8,
      roughness: 0.2,
    });
    this._wingL = new THREE.Mesh(wingGeo, wingMat);
    this._wingL.position.set(-0.15, 0, 0.05);
    this.group.add(this._wingL);

    this._wingR = new THREE.Mesh(wingGeo.clone(), wingMat.clone());
    this._wingR.position.set(0.15, 0, 0.05);
    this.group.add(this._wingR);
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._trail = new THREE.Line(this._trailGeo, this._trailMat);
    this._trailPositions = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3());
    this.group.add(this._trail);
  }

  _createHPBar() {
    // HP bar background
    const bgGeo = new THREE.PlaneGeometry(0.6, 0.06);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.6,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(bgGeo, bgMat);
    this._hpBg.position.set(0, 0.5, 0);
    this.group.add(this._hpBg);

    // HP bar foreground
    const fgGeo = new THREE.PlaneGeometry(0.58, 0.04);
    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0x44ff44,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(fgGeo, this._hpFgMat);
    this._hpFg.position.set(0, 0.5, 0.001);
    this.group.add(this._hpFg);
  }

  _createEngineGlow() {
    this._engineLight = new THREE.PointLight(0xff4444, 0.4, 3);
    this._engineLight.position.set(0, 0, -0.4);
    this.group.add(this._engineLight);
  }

  /**
   * Set enemy type and color.
   */
  setType(type, color) {
    this._type = type;
    this._bodyMat.color.set(color);
    this._bodyMat.emissive.set(new THREE.Color(color).multiplyScalar(0.2));
    this._trailMat.color.set(color);
    this._engineLight.color.set(color);

    // Bomber: slightly larger
    if (type === 'bomber') {
      this._body.scale.setScalar(1.4);
      this._wingL.scale.set(1.3, 1, 1.3);
      this._wingR.scale.set(1.3, 1, 1.3);
    } else {
      this._body.scale.setScalar(1.0);
      this._wingL.scale.set(1, 1, 1);
      this._wingR.scale.set(1, 1, 1);
    }
  }

  /**
   * Activate this enemy ship at a position orbiting a target.
   */
  activate(targetPos, speed) {
    this._targetPos.copy(targetPos);
    this._speed = speed || 1.0;
    this._orbitAngle = Math.random() * Math.PI * 2;
    this.group.visible = true;

    // Initialize position
    const pos = this._calcOrbitPos();
    this.group.position.copy(pos);
    for (const v of this._trailPositions) v.copy(pos);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update HP bar display.
   */
  setHP(current, max) {
    const frac = Math.max(0, current / max);
    this._hpFg.scale.x = frac;
    this._hpFg.position.x = -(1 - frac) * 0.29;

    // Color: green → yellow → red
    if (frac > 0.6) {
      this._hpFgMat.color.setHex(0x44ff44);
    } else if (frac > 0.3) {
      this._hpFgMat.color.setHex(0xffcc00);
    } else {
      this._hpFgMat.color.setHex(0xff3333);
    }
  }

  /**
   * Make HP bar always face camera.
   */
  faceCamera(camera) {
    this._hpBg.quaternion.copy(camera.quaternion);
    this._hpFg.quaternion.copy(camera.quaternion);
  }

  _calcOrbitPos() {
    return new THREE.Vector3(
      this._targetPos.x + Math.cos(this._orbitAngle) * this._orbitRadius,
      this._targetPos.y + this._verticalOffset,
      this._targetPos.z + Math.sin(this._orbitAngle) * this._orbitRadius,
    );
  }

  /**
   * Per-frame update — orbit around target, update trail.
   */
  update(dt, targetPos) {
    if (targetPos) this._targetPos.copy(targetPos);

    this._orbitAngle += dt * 0.5 * this._speed;
    const newPos = this._calcOrbitPos();
    this.group.position.copy(newPos);

    // Face direction of travel
    const lookAngle = this._orbitAngle + 0.2;
    const lookPos = new THREE.Vector3(
      this._targetPos.x + Math.cos(lookAngle) * this._orbitRadius,
      this._targetPos.y + this._verticalOffset,
      this._targetPos.z + Math.sin(lookAngle) * this._orbitRadius,
    );
    this._body.lookAt(lookPos);

    // Update trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this._trailPositions[i].copy(this._trailPositions[i - 1]);
    }
    this._trailPositions[0].copy(newPos);

    const arr = this._trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const local = this._trailPositions[i].clone().sub(newPos);
      arr[i * 3]     = local.x;
      arr[i * 3 + 1] = local.y;
      arr[i * 3 + 2] = local.z;
    }
    this._trailGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._trailGeo.dispose();
    this._trailMat.dispose();
  }
}
