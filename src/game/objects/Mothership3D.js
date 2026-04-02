import * as THREE from 'three';

/**
 * Dark Sovereign Dreadnought — the big evil mothership for invasion events.
 * Procedural geometry: layered hull + swept wings + weapon prongs + central cannon
 * + underbelly weapon port + 7-engine cluster. Pooled by EnemyManager3D (1-2 max).
 *
 * Coordinate system (local space, before 2.5x scale):
 *   Front/nose = -Z, Rear/engines = +Z, Up = +Y
 */
export class Mothership3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._warpProgress = 0;
    this._isWarping = false;
    this._hoverTime = 0;

    // Animation targets — populated by build methods
    this._engineConeMats = [];
    this._engineDiscMats = [];
    this._engineLights = [];
    this._weaponLight = null;
    this._weaponCoreMat = null;
    this._weaponCoreInnerMat = null;
    this._cannonMuzzleMat = null;
    this._cannonCoreMat = null;
    this._prongTipMats = [];
    this._dorsalMat = null;

    this._buildMesh();
    this._createHPBar();
    this._createEngineGlow();
    this._createWarpFlash();
  }

  // ─── Shared material factories ─────────────────────────────────────────────

  _hullMaterial() {
    return new THREE.MeshStandardMaterial({
      color: 0x0d0d10,
      metalness: 0.85,
      roughness: 0.3,
      emissive: new THREE.Color(0x3a0000),
      emissiveIntensity: 0.3,
    });
  }

  _additiveMat(color, opacity = 0.8) {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }

  // ─── Build phases ──────────────────────────────────────────────────────────

  _buildMesh() {
    this._buildHull();
    this._buildWings();
    this._buildWeaponProng(-1);
    this._buildWeaponProng(1);
    this._buildCentralCannon();
    this._buildWeaponPort();
    this._buildHullDetail();
    this._buildEngines();

    this.group.scale.setScalar(2.5);
  }

  _buildHull() {
    // Shared near-black hull material
    const hullMat = this._hullMaterial();

    // Dorsal material — slightly more red-emissive, stored for animation
    this._dorsalMat = new THREE.MeshStandardMaterial({
      color: 0x120808,
      metalness: 0.8,
      roughness: 0.35,
      emissive: new THREE.Color(0x4a0000),
      emissiveIntensity: 0.5,
    });

    const pieces = [
      // [geometry, position, material]
      [new THREE.BoxGeometry(1.2, 0.35, 3.5),  [0, 0, 0],       hullMat],        // fuselage core
      [new THREE.BoxGeometry(0.4, 0.22, 2.8),  [0, 0.28, 0],    this._dorsalMat], // dorsal ridge
      [new THREE.BoxGeometry(0.15, 0.35, 1.8), [0, 0.55, 0.2],  this._dorsalMat], // dorsal fin
      [new THREE.BoxGeometry(1.6, 0.18, 0.8),  [0, -0.05, -1.3], hullMat],       // forward jaw
      [new THREE.BoxGeometry(0.6, 0.2, 3.0),   [0, -0.28, 0],   hullMat],        // keel
      [new THREE.BoxGeometry(1.0, 0.45, 0.5),  [0, 0, 1.5],     hullMat],        // rear engine block
    ];

    for (const [geo, pos, mat] of pieces) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      this.group.add(mesh);
    }
  }

  _buildWings() {
    const hullMat = this._hullMaterial();

    for (const sign of [-1, 1]) {
      // Wing root
      const root = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 1.2), hullMat);
      root.position.set(sign * 1.0, -0.02, 0.1);
      root.rotation.y = sign * 0.14; // 8°
      this.group.add(root);

      // Wing outer panel
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 1.4), hullMat);
      panel.position.set(sign * 1.55, -0.06, 0.3);
      panel.rotation.y = sign * 0.31; // 18°
      this.group.add(panel);

      // Wing tip — emissive blade
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.5), this._dorsalMat);
      tip.position.set(sign * 2.1, -0.04, 0.5);
      this.group.add(tip);
    }
  }

  _buildWeaponProng(sign) {
    const hullMat = this._hullMaterial();

    // Prong arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 1.2), hullMat);
    arm.position.set(sign * 0.55, -0.12, -1.7);
    arm.rotation.y = sign * 0.12;
    this.group.add(arm);

    // Prong tip housing
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.3), hullMat);
    housing.position.set(sign * 0.6, -0.12, -2.3);
    this.group.add(housing);

    // Prong energy tip — charged purple sphere
    const tipMat = this._additiveMat(0x9944ff, 0.7);
    this._prongTipMats.push(tipMat);
    const tipSphere = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), tipMat);
    tipSphere.position.set(sign * 0.6, -0.12, -2.45);
    this.group.add(tipSphere);
  }

  _buildCentralCannon() {
    const hullMat = this._hullMaterial();
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a22,
      metalness: 0.9,
      roughness: 0.1,
    });

    // Outer housing
    const housingGeo = new THREE.CylinderGeometry(0.16, 0.22, 1.0, 8);
    housingGeo.rotateX(Math.PI / 2);
    const housing = new THREE.Mesh(housingGeo, hullMat);
    housing.position.set(0, -0.15, -2.0);
    this.group.add(housing);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.08, 0.10, 0.7, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(0, -0.15, -2.5);
    this.group.add(barrel);

    // Muzzle ring
    this._cannonMuzzleMat = this._additiveMat(0x9944ff, 0.8);
    const ringGeo = new THREE.TorusGeometry(0.12, 0.025, 6, 12);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, this._cannonMuzzleMat);
    ring.position.set(0, -0.15, -2.87);
    this.group.add(ring);

    // Muzzle core fill
    this._cannonCoreMat = this._additiveMat(0x9944ff, 0.9);
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.07, 8), this._cannonCoreMat);
    core.position.set(0, -0.15, -2.88);
    this.group.add(core);
  }

  _buildWeaponPort() {
    // Outer structural torus
    const outerTorusMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d10,
      metalness: 0.85,
      roughness: 0.3,
      emissive: new THREE.Color(0x4a0000),
      emissiveIntensity: 0.4,
    });
    const outerGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 16);
    outerGeo.rotateX(Math.PI / 2);
    const outerTorus = new THREE.Mesh(outerGeo, outerTorusMat);
    outerTorus.position.set(0, -0.42, 0.2);
    this.group.add(outerTorus);

    // Inner energy ring
    const innerTorusMat = new THREE.MeshStandardMaterial({
      color: 0x220033,
      metalness: 0.5,
      roughness: 0.5,
      emissive: new THREE.Color(0x6600cc),
      emissiveIntensity: 0.8,
    });
    const innerGeo = new THREE.TorusGeometry(0.28, 0.05, 6, 12);
    innerGeo.rotateX(Math.PI / 2);
    const innerTorus = new THREE.Mesh(innerGeo, innerTorusMat);
    innerTorus.position.set(0, -0.43, 0.2);
    this.group.add(innerTorus);

    // Weapon core (outer glow)
    this._weaponCoreMat = this._additiveMat(0x8800ff, 0.7);
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), this._weaponCoreMat);
    coreSphere.position.set(0, -0.4, 0.2);
    this.group.add(coreSphere);

    // Weapon core (inner bright)
    this._weaponCoreInnerMat = this._additiveMat(0xcc88ff, 0.9);
    const coreInner = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), this._weaponCoreInnerMat);
    coreInner.position.set(0, -0.4, 0.2);
    this.group.add(coreInner);
  }

  _buildHullDetail() {
    const dorsalMat = this._dorsalMat;
    const hullMat = this._hullMaterial();

    // Dorsal panel ridges (port and starboard)
    for (const sign of [-1, 1]) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.0), dorsalMat);
      ridge.position.set(sign * 0.2, 0.42, -0.3);
      this.group.add(ridge);

      // Longitudinal hull strake
      const strake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 2.0), dorsalMat);
      strake.position.set(sign * 0.62, 0.05, 0);
      this.group.add(strake);
    }

    // Rear engine deck plate
    const deckPlate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.4), hullMat);
    deckPlate.position.set(0, 0.25, 1.3);
    this.group.add(deckPlate);

    // Forward sensor cluster (3 cubes)
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x151520,
      metalness: 0.7,
      roughness: 0.4,
      emissive: new THREE.Color(0x000044),
      emissiveIntensity: 0.3,
    });
    for (const [sx, sz] of [[-0.25, -1.5], [0, -1.55], [0.25, -1.5]]) {
      const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), sensorMat);
      sensor.position.set(sx, 0.22, sz);
      this.group.add(sensor);
    }
  }

  _buildEngines() {
    const shroudMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: new THREE.Color(0x110000),
      emissiveIntensity: 0.2,
    });

    // 7 engine positions: [x, y]
    const enginePositions = [
      [-0.35, 0], [0, 0], [0.35, 0],   // center row
      [-0.6, 0.1], [0.6, 0.1],          // upper flanks
      [-0.45, -0.15], [0.45, -0.15],    // lower flanks
    ];

    for (const [ex, ey] of enginePositions) {
      // Outer shroud
      const shroudGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.2, 8);
      shroudGeo.rotateX(Math.PI / 2);
      const shroud = new THREE.Mesh(shroudGeo, shroudMat);
      shroud.position.set(ex, ey, 1.76);
      this.group.add(shroud);

      // Inner glow cone (points rearward, +Z)
      const coneMat = this._additiveMat(0xff1100, 0.85);
      this._engineConeMats.push(coneMat);
      const coneGeo = new THREE.ConeGeometry(0.09, 0.25, 8);
      coneGeo.rotateX(-Math.PI / 2); // apex toward +Z
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(ex, ey, 1.87);
      this.group.add(cone);

      // Exhaust bloom disc
      const discMat = this._additiveMat(0xff4400, 0.6);
      this._engineDiscMats.push(discMat);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.11, 8), discMat);
      disc.position.set(ex, ey, 1.99);
      this.group.add(disc);
    }
  }

  // ─── HP Bar ────────────────────────────────────────────────────────────────

  _createHPBar() {
    const bgGeo = new THREE.PlaneGeometry(1.8, 0.1);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.7,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(bgGeo, bgMat);
    this._hpBg.position.set(0, 1.5, 0);
    this.group.add(this._hpBg);

    const fgGeo = new THREE.PlaneGeometry(1.74, 0.07);
    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(fgGeo, this._hpFgMat);
    this._hpFg.position.set(0, 1.5, 0.001);
    this.group.add(this._hpFg);
  }

  // ─── Lights ────────────────────────────────────────────────────────────────

  _createEngineGlow() {
    // 3 engine lights with slightly offset positions for the 7-engine cluster
    const engineLightDefs = [
      { pos: [0, 0, 2.1],     intensity: 2.5, distance: 18 }, // center cluster
      { pos: [0.55, 0, 2.1],  intensity: 1.8, distance: 12 }, // starboard flanks
      { pos: [-0.55, 0, 2.1], intensity: 1.8, distance: 12 }, // port flanks
    ];

    for (const def of engineLightDefs) {
      const light = new THREE.PointLight(0xff2200, def.intensity, def.distance);
      light.position.set(...def.pos);
      this.group.add(light);
      this._engineLights.push(light);
    }

    // Weapon port light — purple underglow
    this._weaponLight = new THREE.PointLight(0x8800ff, 1.2, 10);
    this._weaponLight.position.set(0, -0.5, 0.2);
    this.group.add(this._weaponLight);
  }

  // ─── Warp Flash ────────────────────────────────────────────────────────────

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

  // ─── Public API ────────────────────────────────────────────────────────────

  warpIn(position) {
    this.group.position.copy(position);
    this.group.position.y += 20;
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

  setHP(current, max) {
    const frac = Math.max(0, current / max);
    this._hpFg.scale.x = frac;
    this._hpFg.position.x = -(1 - frac) * 0.87;

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

  spawnFlash() {
    this._warpFlashMat.opacity = 0.6;
    // Burst the weapon core for dramatic effect
    this._weaponCoreMat.opacity = 1.0;
    this._weaponCoreInnerMat.opacity = 1.0;
    this._weaponLight.intensity = 4.0;
  }

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
      // Gentle hover + slow rotation (reduced from 0.05 so the frontal view stays visible)
      this.group.position.y += Math.sin(this._hoverTime * 0.3) * dt * 0.3;
      this.group.rotation.y += dt * 0.02;
    }

    // Fade warp flash
    if (this._warpFlashMat.opacity > 0) {
      this._warpFlashMat.opacity = Math.max(0, this._warpFlashMat.opacity - dt * 2);
    }

    const t = this._hoverTime;

    // Engine pulse (2.8 Hz)
    const ep = 0.7 + Math.sin(t * 2.8) * 0.3;
    for (const m of this._engineConeMats) m.opacity = 0.7 * ep + 0.15;
    for (const m of this._engineDiscMats) m.opacity = 0.5 * ep + 0.1;
    this._engineLights[0].intensity = 2.5 * (0.75 + ep * 0.5);
    this._engineLights[1].intensity = 1.8 * (0.75 + (0.5 + Math.sin(t * 2.8 + 0.7) * 0.3));
    this._engineLights[2].intensity = 1.8 * (0.75 + (0.5 + Math.sin(t * 2.8 + 1.4) * 0.3));

    // Weapon port pulse (1.6 Hz, out of phase with engines)
    const wp = 0.5 + 0.5 * Math.sin(t * 1.6 + Math.PI);
    this._weaponCoreMat.opacity = Math.min(1.0, 0.5 + wp * 0.4);
    this._weaponCoreInnerMat.opacity = Math.min(1.0, 0.7 + wp * 0.25);
    this._weaponLight.intensity = Math.max(0.8 + wp * 1.2, this._weaponLight.intensity - dt * 6);

    // Cannon / prong charge (2.2 Hz)
    const cp = 0.5 + 0.5 * Math.sin(t * 2.2 + 1.1);
    this._cannonMuzzleMat.opacity = 0.5 + cp * 0.5;
    this._cannonCoreMat.opacity = 0.6 + cp * 0.4;
    for (const m of this._prongTipMats) m.opacity = 0.4 + cp * 0.6;

    // Hull emissive breathe (0.5 Hz — barely perceptible, gives it a living quality)
    this._dorsalMat.emissiveIntensity = 0.5 * (0.8 + 0.2 * Math.sin(t * 0.5));
  }

  dispose() {
    this.group.traverse(child => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    this._engineLights.forEach(l => l.dispose());
    this._weaponLight.dispose();
  }
}
