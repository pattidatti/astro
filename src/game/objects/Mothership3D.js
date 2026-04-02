import * as THREE from 'three';

/**
 * Star Destroyer-style mothership for invasion events.
 * Procedural geometry: triangular hull + bridge + engine banks.
 * Pooled by EnemyManager3D — typically 1-2 max.
 */
export class Mothership3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._warpProgress = 0;
    this._isWarping = false;
    this._hoverTime = 0;

    this._buildMesh();
    this._createHPBar();
    this._createEngineGlow();
    this._createWarpFlash();
  }

  _buildMesh() {
    // Main hull — triangular wedge
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 0);
    hullShape.lineTo(-1.5, -3.5);
    hullShape.lineTo(1.5, -3.5);
    hullShape.closePath();

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 2,
    });
    hullGeo.center();
    hullGeo.rotateX(Math.PI / 2);

    this._hullMat = new THREE.MeshStandardMaterial({
      color: 0x553333,
      metalness: 0.8,
      roughness: 0.3,
      emissive: new THREE.Color(0x220000),
      emissiveIntensity: 0.3,
    });
    this._hull = new THREE.Mesh(hullGeo, this._hullMat);
    this.group.add(this._hull);

    // Bridge superstructure
    const bridgeGeo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x663333,
      metalness: 0.7,
      roughness: 0.4,
      emissive: new THREE.Color(0x440000),
      emissiveIntensity: 0.4,
    });
    this._bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    this._bridge.position.set(0, 0.3, -0.5);
    this.group.add(this._bridge);

    // Engine banks (3 glowing cylinders at rear)
    const engineGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 8);
    engineGeo.rotateX(Math.PI / 2);
    this._engineMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    for (let i = -1; i <= 1; i++) {
      const eng = new THREE.Mesh(engineGeo.clone(), this._engineMat.clone());
      eng.position.set(i * 0.4, -0.05, 1.75);
      this.group.add(eng);
    }

    // Scale up — mothership is big
    this.group.scale.setScalar(2.5);
  }

  _createHPBar() {
    const bgGeo = new THREE.PlaneGeometry(1.5, 0.1);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.7,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(bgGeo, bgMat);
    this._hpBg.position.set(0, 1.2, 0);
    this.group.add(this._hpBg);

    const fgGeo = new THREE.PlaneGeometry(1.46, 0.07);
    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(fgGeo, this._hpFgMat);
    this._hpFg.position.set(0, 1.2, 0.001);
    this.group.add(this._hpFg);
  }

  _createEngineGlow() {
    this._engineLight = new THREE.PointLight(0xff4400, 1.5, 15);
    this._engineLight.position.set(0, 0, 1.8);
    this.group.add(this._engineLight);
  }

  _createWarpFlash() {
    const flashGeo = new THREE.SphereGeometry(3, 16, 16);
    this._warpFlashMat = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this._warpFlash = new THREE.Mesh(flashGeo, this._warpFlashMat);
    this.group.add(this._warpFlash);
  }

  /**
   * Begin warp-in animation at a position.
   */
  warpIn(position) {
    this.group.position.copy(position);
    this.group.position.y += 20; // Start above planet
    this.group.visible = true;
    this._isWarping = true;
    this._warpProgress = 0;
    this.group.scale.setScalar(0.01);
    this._warpFlashMat.opacity = 1.0;
    this._targetY = position.y + 8;
  }

  deactivate() {
    this.group.visible = false;
    this._isWarping = false;
  }

  /**
   * Set HP bar display.
   */
  setHP(current, max) {
    const frac = Math.max(0, current / max);
    this._hpFg.scale.x = frac;
    this._hpFg.position.x = -(1 - frac) * 0.73;

    if (frac > 0.5) {
      this._hpFgMat.color.setHex(0xff4444);
    } else if (frac > 0.25) {
      this._hpFgMat.color.setHex(0xff8800);
    } else {
      this._hpFgMat.color.setHex(0xffcc00);
    }
  }

  faceCamera(camera) {
    this._hpBg.quaternion.copy(camera.quaternion);
    this._hpFg.quaternion.copy(camera.quaternion);
  }

  /**
   * Spawn port flash effect when launching a wave.
   */
  spawnFlash() {
    this._warpFlashMat.opacity = 0.6;
  }

  /**
   * Per-frame update.
   */
  update(dt) {
    this._hoverTime += dt;

    if (this._isWarping) {
      this._warpProgress += dt * 0.8; // ~1.25s warp-in
      if (this._warpProgress >= 1) {
        this._isWarping = false;
        this._warpProgress = 1;
        this.group.scale.setScalar(2.5);
      } else {
        const t = this._warpProgress;
        const ease = t * t * (3 - 2 * t);
        this.group.scale.setScalar(0.01 + ease * 2.49);
        this.group.position.y = this._targetY + (1 - ease) * 12;
      }
    } else {
      // Gentle hover
      this.group.position.y += Math.sin(this._hoverTime * 0.3) * dt * 0.3;
      this.group.rotation.y += dt * 0.05;
    }

    // Fade warp flash
    if (this._warpFlashMat.opacity > 0) {
      this._warpFlashMat.opacity = Math.max(0, this._warpFlashMat.opacity - dt * 2);
    }

    // Engine pulse
    this._engineLight.intensity = 1.0 + Math.sin(this._hoverTime * 3) * 0.5;
  }

  dispose() {
    this.group.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
  }
}
