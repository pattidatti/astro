import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

let sharedGeometries = null;
let sharedMaterials = null;

/**
 * A lightweight logical representation of a 3D enemy ship.
 * Does not contain a THREE.Group. Calculates matrix and color for EnemyManager3D.
 */
export class EnemyShip3D {
  static initSharedResources() {
    if (sharedGeometries) return;

    // Materials
    const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x15151b, metalness: 0.8, roughness: 0.3 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x25252d, metalness: 0.6, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 1.0, roughness: 0.1, emissive: 0x330000 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Glow color overridden by instance color

    sharedMaterials = { body: [obsidianMat, armorMat, glassMat], glow: glowMat };

    // Helpers to build and merge
    const applyMat = (geo, matIndex) => {
      // Clear existing groups and assign material index to everything
      geo.clearGroups();
      geo.addGroup(0, geo.attributes.position.count, matIndex);
      return geo;
    };

    // --- INTERCEPTOR ---
    const intBody = [];
    const intGlow = [];

    const intCore = new THREE.CylinderGeometry(0.015, 0.05, 0.35, 6);
    intCore.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    intBody.push(applyMat(intCore, 0)); // obsidian

    const intWingL = new THREE.BoxGeometry(0.25, 0.02, 0.08);
    intWingL.translate(-0.11, 0, -0.05);
    intWingL.rotateY(-Math.PI / 6);
    intBody.push(applyMat(intWingL, 1)); // armor

    const intWingR = new THREE.BoxGeometry(0.25, 0.02, 0.08);
    intWingR.translate(0.11, 0, -0.05);
    intWingR.rotateY(Math.PI / 6);
    intBody.push(applyMat(intWingR, 1));

    const intEngGeo = new THREE.CylinderGeometry(0.015, 0.025, 0.1, 8);
    intEngGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    
    const intEngL = intEngGeo.clone();
    intEngL.translate(-0.04, 0, -0.15);
    intBody.push(applyMat(intEngL, 0));
    
    const intEngR = intEngGeo.clone();
    intEngR.translate(0.04, 0, -0.15);
    intBody.push(applyMat(intEngR, 0));

    const intGlowGeo = new THREE.CircleGeometry(0.02, 8);
    intGlowGeo.rotateY(Math.PI);
    const intGlowL = intGlowGeo.clone();
    intGlowL.translate(-0.04, 0, -0.201);
    intGlow.push(intGlowL);
    
    const intGlowR = intGlowGeo.clone();
    intGlowR.translate(0.04, 0, -0.201);
    intGlow.push(intGlowR);

    // --- BOMBER ---
    const bomBody = [];
    const bomGlow = [];

    const bomCore = new THREE.BoxGeometry(0.15, 0.08, 0.25);
    bomBody.push(applyMat(bomCore, 1)); // armor

    const bomWings = new THREE.BoxGeometry(0.35, 0.04, 0.15);
    bomWings.translate(0, 0, -0.02);
    bomBody.push(applyMat(bomWings, 0));

    const bomPod = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
    bomPod.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const bomPodL = bomPod.clone();
    bomPodL.translate(-0.12, -0.04, 0);
    bomBody.push(applyMat(bomPodL, 0));
    const bomPodR = bomPod.clone();
    bomPodR.translate(0.12, -0.04, 0);
    bomBody.push(applyMat(bomPodR, 0));

    const bomEng = new THREE.BoxGeometry(0.12, 0.06, 0.08);
    bomEng.translate(0, 0, -0.15);
    bomBody.push(applyMat(bomEng, 0));

    const bomGlowGeo = new THREE.PlaneGeometry(0.1, 0.05);
    bomGlowGeo.rotateY(Math.PI);
    bomGlowGeo.translate(0, 0, -0.191);
    bomGlow.push(bomGlowGeo);

    const bomGlass = new THREE.BoxGeometry(0.08, 0.04, 0.08);
    bomGlass.translate(0, 0.05, 0.08);
    bomBody.push(applyMat(bomGlass, 2));

    // --- RAIDER ---
    const raiBody = [];
    const raiGlow = [];

    const raiCore = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 6);
    raiCore.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    raiCore.translate(0, 0, -0.05);
    raiBody.push(applyMat(raiCore, 0));

    const raiProngGeo = new THREE.BoxGeometry(0.03, 0.15, 0.25);
    const raiProngL = raiProngGeo.clone();
    raiProngL.translate(-0.12, 0, 0.02);
    raiBody.push(applyMat(raiProngL, 1));
    const raiProngR = raiProngGeo.clone();
    raiProngR.translate(0.12, 0, 0.02);
    raiBody.push(applyMat(raiProngR, 1));

    const raiWings = new THREE.BoxGeometry(0.24, 0.02, 0.06);
    raiWings.translate(0, 0, -0.05);
    raiBody.push(applyMat(raiWings, 0));

    const raiGlowGeo = new THREE.CircleGeometry(0.02, 6);
    raiGlowGeo.rotateY(Math.PI);
    raiGlowGeo.translate(0, 0, -0.126);
    raiGlow.push(raiGlowGeo);

    const raiGlass = new THREE.SphereGeometry(0.035, 8, 8);
    raiGlass.translate(0, 0, 0.08);
    raiBody.push(applyMat(raiGlass, 2));

    // Merge everything
    sharedGeometries = {
      interceptor: { body: mergeGeometries(intBody, true), glow: mergeGeometries(intGlow, false) },
      bomber:      { body: mergeGeometries(bomBody, true), glow: mergeGeometries(bomGlow, false) },
      raider:      { body: mergeGeometries(raiBody, true), glow: mergeGeometries(raiGlow, false) }
    };
  }

  static getSharedResources() {
    return { geometries: sharedGeometries, materials: sharedMaterials };
  }

  constructor() {
    this.visible = false;
    this.matrix = new THREE.Matrix4();
    this.worldPosition = new THREE.Vector3(); // Cache for logic

    this._type = null;
    this._color = new THREE.Color();
    this._glowColor = new THREE.Color();
    this._bodyColor = new THREE.Color(0xffffff);

    this._targetPos = new THREE.Vector3();
    this._orbitAngle = Math.random() * Math.PI * 2;
    this._orbitRadius = 15 + Math.random() * 15;
    this._orbitInclination = 0.5 + Math.random() * 0.8;
    this._orbitAzimuth = Math.random() * Math.PI * 2;
    this._speed = 1.0;

    // Approach animation state
    this._inApproach = false;
    this._approachFrom = new THREE.Vector3();
    this._approachTo = new THREE.Vector3();
    this._approachTime = 0;
    this._approachDuration = 1.5;

    // Orbit sync
    this._inOrbitSync = false;
    this._orbitSyncFrom = new THREE.Vector3();
    this._orbitSyncTime = 0;
    this._orbitSyncDuration = 0.5;

    // Transit animation state
    this._acroTime = Math.random() * 100;
    this._barrelRoll = null;
    this._bankAngle = 0;

    // Scale and visuals
    this._baseScale = 1.0;
    this._targetScale = 1.0;
    this._currentScale = 1.0;
    this._isAttacking = false;
    this._flashTime = 0;
    this._flashDuration = 0.15;
    this._isFlashing = false;

    // Transformation variables
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.scale = new THREE.Vector3(1, 1, 1);

    // Trail info
    this.trailPositions = Array.from({ length: 16 }, () => new THREE.Vector3());
  }

  setType(type, colorHex) {
    this._type = type;
    this._color.set(colorHex);
    this._glowColor.set(colorHex);
    this._bodyColor.set(0xffffff); // Default tint

    if (type === 'bomber') {
      this._baseScale = 1.2;
    } else if (type === 'raider') {
      this._baseScale = 1.0;
    } else {
      this._baseScale = 1.0;
    }

    this._targetScale = this._baseScale;
    this._currentScale = this._baseScale;
    this.scale.setScalar(this._baseScale);
  }

  activate(targetPos, speed) {
    this._targetPos.copy(targetPos);
    this._speed = speed || 1.0;
    this._orbitAngle = Math.random() * Math.PI * 2;
    this._orbitRadius = 15 + Math.random() * 15;
    this._orbitInclination = 0.5 + Math.random() * 0.8;
    this._orbitAzimuth = Math.random() * Math.PI * 2;
    this.visible = true;
    
    this._isFlashing = false;
    this._bodyColor.set(0xffffff);

    const orbitPos = this._calcOrbitPos();
    this._approachTo.copy(orbitPos);

    const approachDir = new THREE.Vector3().subVectors(this._approachTo, targetPos).normalize();
    this._approachFrom.copy(targetPos).addScaledVector(approachDir, 60);

    this._inApproach = true;
    this._approachTime = 0;
    this.position.copy(this._approachFrom);

    for (const v of this.trailPositions) v.copy(this._approachFrom);
  }

  deactivate() {
    this.visible = false;
  }

  setAttacking(isAttacking) {
    this._targetScale = isAttacking ? this._baseScale * 2.0 : this._baseScale;
  }

  flashHit() {
    this._isFlashing = true;
    this._flashTime = 0;
    this._bodyColor.set(0xffffff); // Multiplier set to max white
    this._glowColor.set(0xffffff);
  }

  // Not used via 3D planes anymore, but keeping signature for HUD Bridge future link
  setHP(current, max) {}

  _calcOrbitPos() {
    const R = this._orbitRadius;
    const t = this._orbitAngle;
    const incl = this._orbitInclination;
    const azim = this._orbitAzimuth;

    const lx = Math.cos(t) * R;
    const ly = Math.sin(t) * R * Math.sin(incl);
    const lz = Math.sin(t) * R * Math.cos(incl);

    return new THREE.Vector3(
      this._targetPos.x + lx * Math.cos(azim) - lz * Math.sin(azim),
      this._targetPos.y + ly,
      this._targetPos.z + lx * Math.sin(azim) + lz * Math.cos(azim),
    );
  }

  _lookAt(targetPos) {
      const m = new THREE.Matrix4();
      m.lookAt(this.position, targetPos, new THREE.Vector3(0,1,0));
      this.quaternion.setFromRotationMatrix(m);
  }

  update(dt, targetPos) {
    if (targetPos) this._targetPos.copy(targetPos);

    // Scale lerp
    if (Math.abs(this._currentScale - this._targetScale) > 0.001) {
      this._currentScale = THREE.MathUtils.lerp(this._currentScale, this._targetScale, Math.min(1, dt * 5));
      this.scale.setScalar(this._currentScale);
    }

    // Flash fade
    if (this._isFlashing) {
      this._flashTime += dt;
      const t = Math.min(1, this._flashTime / this._flashDuration);
      this._bodyColor.lerpColors(new THREE.Color(0xffffff), new THREE.Color(0xffffff), t); // Body restores to pure white tint
      this._glowColor.lerpColors(new THREE.Color(0xffffff), this._color, t);
      if (t >= 1) this._isFlashing = false;
    }

    let newPos = this.position.clone();

    if (this._inApproach) {
      this._approachTime += dt;
      const rawT = Math.min(1, this._approachTime / this._approachDuration);
      const t = 1 - Math.pow(1 - rawT, 2);

      newPos = new THREE.Vector3().lerpVectors(this._approachFrom, this._approachTo, t);
      this.position.copy(newPos);

      if (rawT < 0.98) {
        const dir = new THREE.Vector3().subVectors(this._approachTo, this._approachFrom).normalize();
        this._lookAt(newPos.clone().add(dir));
      }

      if (rawT >= 1) {
        this._inApproach = false;
        this._inOrbitSync = true;
        this._orbitSyncFrom.copy(newPos);
        this._orbitSyncTime = 0;
      }
    } else if (this._inOrbitSync) {
      this._orbitAngle += dt * 0.5 * this._speed;
      const orbitPos = this._calcOrbitPos();
      const syncT = Math.min(1, this._orbitSyncTime / this._orbitSyncDuration);
      const eased = syncT * syncT * (3 - 2 * syncT);
      newPos = new THREE.Vector3().lerpVectors(this._orbitSyncFrom, orbitPos, eased);
      this.position.copy(newPos);

      const R = this._orbitRadius;
      const t = this._orbitAngle;
      const incl = this._orbitInclination;
      const azim = this._orbitAzimuth;
      const ldx = -Math.sin(t) * R;
      const ldy = Math.cos(t) * R * Math.sin(incl);
      const ldz = Math.cos(t) * R * Math.cos(incl);
      const lookPos = newPos.clone().add(new THREE.Vector3(
        ldx * Math.cos(azim) - ldz * Math.sin(azim),
        ldy,
        ldx * Math.sin(azim) + ldz * Math.cos(azim),
      ));
      this._lookAt(lookPos);

      this._orbitSyncTime += dt;
      if (this._orbitSyncTime >= this._orbitSyncDuration) {
        this._inOrbitSync = false;
      }
    } else {
      // Normal orbit
      this._orbitAngle += dt * 0.5 * this._speed;
      newPos = this._calcOrbitPos();
      this.position.copy(newPos);

      const lookAngle = this._orbitAngle + 0.2;
      const R = this._orbitRadius;
      const incl = this._orbitInclination;
      const azim = this._orbitAzimuth;
      const lx = Math.cos(lookAngle) * R;
      const ly = Math.sin(lookAngle) * R * Math.sin(incl);
      const lz = Math.sin(lookAngle) * R * Math.cos(incl);
      const lookPos = new THREE.Vector3(
        this._targetPos.x + lx * Math.cos(azim) - lz * Math.sin(azim),
        this._targetPos.y + ly,
        this._targetPos.z + lx * Math.sin(azim) + lz * Math.cos(azim),
      );
      this._lookAt(lookPos);

      const bankRoll = Math.sin(this._orbitAngle) * 0.4;
      const bankQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), bankRoll);
      this.quaternion.multiply(bankQuat);
    }

    // Update trail
    for (let i = 15; i > 0; i--) {
      this.trailPositions[i].copy(this.trailPositions[i - 1]);
    }
    this.trailPositions[0].copy(newPos);

    this.worldPosition.copy(this.position);
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }

  animateTransit(dt, time, turnRate = 0) {
    this._acroTime += dt;
    const phase = this._orbitAzimuth;

    if (!this._barrelRoll && Math.random() < dt * 0.001) {
      this._barrelRoll = { time: 0, duration: 1.2, dir: Math.random() < 0.5 ? 1 : -1 };
    }

    let rollAngle = turnRate * 1.5;
    rollAngle += Math.sin(time * 0.8 + phase) * 0.15;

    if (this._barrelRoll) {
      this._barrelRoll.time += dt;
      const t = this._barrelRoll.time / this._barrelRoll.duration;
      if (t >= 1) {
        this._barrelRoll = null;
      } else {
        const ease = t * t * (3 - 2 * t);
        rollAngle += ease * Math.PI * 2 * this._barrelRoll.dir;
      }
    }

    const pitchAngle = Math.sin(time * 0.4 + phase * 1.5) * 0.1;

    // Apply transit rotation on top of current look
    const transitQuat = new THREE.Quaternion();
    transitQuat.setFromEuler(new THREE.Euler(pitchAngle, 0, rollAngle, 'XYZ'));
    this.quaternion.multiply(transitQuat);
    
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }

  dispose() {}
}
