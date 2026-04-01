import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/**
 * Stealth delta-wing reconnaissance drone.
 * Flat triangular profile, twin engine glows, forward sensor pod.
 */
export class ScoutBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    const stealthMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f12, metalness: 0.85, roughness: 0.18,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e, emissive: 0xc8a84e, emissiveIntensity: 0.3,
      metalness: 0.85, roughness: 0.2,
    });

    // ── DELTA WING (flat triangular prism) ───────────────────────────────
    // 3-sided cylinder = equilateral triangle cross-section, very flat
    const wingGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.065, 3);
    const wing = new THREE.Mesh(wingGeo, stealthMat);
    wing.rotation.y = Math.PI / 6; // point faces forward (+Z in local space)
    group.add(wing);

    // Gold trim on wing underside
    const wingTrimGeo = new THREE.CylinderGeometry(0.59, 0.59, 0.018, 3);
    const wingTrim = new THREE.Mesh(wingTrimGeo, goldMat.clone());
    wingTrim.rotation.y = Math.PI / 6;
    wingTrim.position.y = -0.04;
    group.add(wingTrim);

    // ── FUSELAGE SPINE ────────────────────────────────────────────────────
    const fuselage = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.058, 0.72),
      stealthMat.clone(),
    );
    group.add(fuselage);

    // ── NOSE SENSOR POD ───────────────────────────────────────────────────
    const noseGeo = new THREE.SphereGeometry(0.065, 8, 6);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a22, metalness: 0.75, roughness: 0.28,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.scale.set(0.75, 0.7, 1.5);
    nose.position.z = 0.42;
    group.add(nose);

    // Sensor lens (glowing)
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff, emissive: 0x4488cc, emissiveIntensity: 1.2,
      side: THREE.DoubleSide,
    });
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.036, 8), lensMat);
    lens.position.set(0, -0.025, 0.495);
    this._lensMat = lensMat;
    group.add(lens);

    // ── TWIN ENGINE PODS (rear wing roots) ───────────────────────────────
    this._engineGlows = [];
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;

      const engineGeo = new THREE.CylinderGeometry(0.055, 0.04, 0.22, 6);
      const engine = new THREE.Mesh(engineGeo, stealthMat.clone());
      engine.rotation.x = Math.PI / 2;
      engine.position.set(side * 0.27, 0, -0.34);
      group.add(engine);

      // Engine ring detail
      const eRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.012, 5, 16),
        goldMat.clone(),
      );
      eRing.position.set(side * 0.27, 0, -0.3);
      group.add(eRing);

      // Engine exhaust glow
      const glowMat = new THREE.MeshStandardMaterial({
        color: 0x44aaff, emissive: 0x44aaff, emissiveIntensity: 2.0,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const glow = new THREE.Mesh(new THREE.CircleGeometry(0.042, 8), glowMat);
      glow.position.set(side * 0.27, 0, -0.455);
      this._engineGlows.push({ mat: glowMat, phase: i * 1.71 });
      group.add(glow);
    }

    // ── DORSAL FIN ────────────────────────────────────────────────────────
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.11, 0.24),
      stealthMat.clone(),
    );
    fin.position.set(0, 0.085, -0.08);
    group.add(fin);

    // Gold cockpit strip
    const cockpitGeo = new THREE.BoxGeometry(0.03, 0.02, 0.18);
    const cockpit = new THREE.Mesh(cockpitGeo, goldMat.clone());
    cockpit.position.set(0, 0.044, 0.18);
    group.add(cockpit);

    // Radar ring pool — added to the outer (unscaled) group so rings appear at world scale
    this._radarRings  = [];
    this._radarTimer  = Math.random() * 3.0; // staggered start per robot
    this._radarGroup  = new THREE.Group();
    this.group.add(this._radarGroup);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);

    // Engine glows pulse with slight stagger
    for (const eg of this._engineGlows) {
      eg.mat.emissiveIntensity = 1.4 + Math.sin(time * 6.5 + eg.phase) * 0.75;
    }

    // Sensor lens: active scanning flicker + occasional sharp spike
    if (this._lensMat) {
      const scan = 0.7 + Math.sin(time * 3.2) * 0.6;
      const spike = Math.random() < 0.02 ? 2.5 : 0;
      this._lensMat.emissiveIntensity = scan + spike;
    }

    // Radar pulse emission
    this._radarTimer += dt;
    if (this._radarTimer >= 3.0) {
      this._radarTimer = 0;
      this._emitRadarRing();
    }

    // Update active radar rings: expand + fade
    for (let i = this._radarRings.length - 1; i >= 0; i--) {
      const r = this._radarRings[i];
      r.age += dt;
      if (r.age >= 1.5) {
        this._radarGroup.remove(r.mesh);
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
        this._radarRings.splice(i, 1);
        continue;
      }
      const t = r.age / 1.5;
      r.mesh.scale.setScalar(1 + t * 4);
      r.mesh.material.opacity = (1 - t) * 0.6;
    }
  }

  _emitRadarRing() {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.5, 24),
      new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    // Orient ring to face outward from planet center
    // _radarGroup is child of this.group; planet center in this.group-local space = -this.group.position
    ring.lookAt(
      -this.group.position.x,
      -this.group.position.y,
      -this.group.position.z,
    );
    this._radarGroup.add(ring);
    this._radarRings.push({ mesh: ring, age: 0 });
  }

  dispose() {
    for (const r of this._radarRings) {
      r.mesh.geometry.dispose();
      r.mesh.material.dispose();
    }
    super.dispose();
  }
}
