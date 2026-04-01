import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/**
 * Construction crane-arm robot.
 * Articulated boom arm, oscillating secondary arm, welding claw.
 */
export class HoverBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x1a1610, metalness: 0.9, roughness: 0.35,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e, emissive: 0xc8a84e, emissiveIntensity: 0.3,
      metalness: 0.8, roughness: 0.2,
    });

    // ── BASE PLATFORM ─────────────────────────────────────────────────────
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.4, 0.19, 8),
      hullMat,
    );
    group.add(base);

    // Gold trim ring
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.022, 6, 24),
      goldMat.clone(),
    );
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 0.08;
    group.add(trim);

    // ── VERTICAL POST ─────────────────────────────────────────────────────
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.62, 0.075),
      hullMat.clone(),
    );
    post.position.y = 0.4;
    group.add(post);

    // Post reinforcing gussets
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const gusset = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.15, 0.04),
        goldMat.clone(),
      );
      gusset.position.set(Math.cos(angle) * 0.06, 0.12, Math.sin(angle) * 0.06);
      group.add(gusset);
    }

    // ── HORIZONTAL BOOM (rotates on Y-axis) ──────────────────────────────
    this._boom = new THREE.Group();
    this._boom.position.y = 0.73;

    const boom = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.055, 0.055),
      hullMat.clone(),
    );
    boom.position.x = 0.24;
    this._boom.add(boom);

    // Gold pivot joint at post top
    const pivotGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const pivot = new THREE.Mesh(pivotGeo, goldMat.clone());
    this._boom.add(pivot);

    // Gold end joint
    const endJoint = new THREE.Mesh(pivotGeo.clone(), goldMat.clone());
    endJoint.position.x = 0.6;
    this._boom.add(endJoint);

    // Structural cross on boom
    const crossV = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.12, 0.028),
      goldMat.clone(),
    );
    crossV.position.set(0.2, 0, 0);
    this._boom.add(crossV);

    // ── SECONDARY ARM (oscillates, hangs from boom end) ──────────────────
    this._secondArm = new THREE.Group();
    this._secondArm.position.x = 0.6;

    const arm2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.048, 0.42, 0.048),
      hullMat.clone(),
    );
    arm2.position.y = -0.21;
    this._secondArm.add(arm2);

    const joint2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 6, 6),
      goldMat.clone(),
    );
    joint2.position.y = -0.44;
    this._secondArm.add(joint2);

    // ── CLAW END EFFECTOR ─────────────────────────────────────────────────
    this._claw = new THREE.Group();
    this._claw.position.y = -0.52;

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const finger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.05, 0.13, 4),
        hullMat.clone(),
      );
      finger.position.set(
        Math.cos(a) * 0.08,
        -0.055,
        Math.sin(a) * 0.08,
      );
      finger.rotation.x = Math.sin(a) * 0.35;
      finger.rotation.z = Math.cos(a) * 0.35;
      this._claw.add(finger);
    }

    // Welding arc glow at claw center
    const weldMat = new THREE.MeshStandardMaterial({
      color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 3.0,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this._weld = new THREE.Mesh(new THREE.SphereGeometry(0.042, 6, 6), weldMat);
    this._weld.position.y = -0.07;
    this._claw.add(this._weld);

    this._secondArm.add(this._claw);
    this._boom.add(this._secondArm);
    group.add(this._boom);

    // ── THRUSTER GLOW (base bottom) ───────────────────────────────────────
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x44aaff, emissive: 0x44aaff, emissiveIntensity: 1.8,
      side: THREE.DoubleSide, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this._thrusterMat = thrusterMat;
    const thruster = new THREE.Mesh(new THREE.CircleGeometry(0.17, 8), thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.y = -0.105;
    group.add(thruster);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);

    // Boom sweeps with secondary wobble for organic feel
    if (this._boom) {
      this._boom.rotation.y = time * 0.38 + Math.sin(time * 1.8) * 0.25;
    }

    // Secondary arm swings (construction motion)
    if (this._secondArm) {
      this._secondArm.rotation.z = Math.sin(time * 1.15) * 0.28;
    }

    // Claw pulses open/close via scale
    if (this._claw) {
      const t = Math.sin(time * 2.4) * 0.5 + 0.5;
      this._claw.scale.setScalar(0.8 + t * 0.35);
    }

    // Weld arc: intense flicker with occasional bright flash
    if (this._weld) {
      const flicker = Math.abs(Math.sin(time * 17.3)) * 3.5;
      const flash   = Math.random() < 0.04 ? 5.0 : 0;
      this._weld.material.emissiveIntensity = 1.5 + flicker + flash;
    }

    // Thruster: pulses hard between dim and bright, shifts color toward gold at peak
    if (this._thrusterMat) {
      const pulse = 0.9 + Math.abs(Math.sin(time * 5.3)) * 2.6;
      this._thrusterMat.emissiveIntensity = pulse;
      // Lerp emissive color: cyan at low intensity, warm gold at peak
      const t = Math.max(0, (pulse - 0.9) / 2.6);
      const r = 0.267 + t * (1.0 - 0.267);
      const g = 0.667 + t * (0.8 - 0.667);
      const b = 1.0   - t * 1.0;
      this._thrusterMat.emissive.setRGB(r, g, b);
    }
  }
}
