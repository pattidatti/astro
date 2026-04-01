import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/**
 * WH40K-style heavy dreadnought.
 * Massive armored hull, shoulder pauldrons, twin-cannon turret, engine exhausts.
 */
export class TitanBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1208, metalness: 0.9, roughness: 0.25,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e, emissive: 0xc8a84e, emissiveIntensity: 0.4,
      metalness: 0.85, roughness: 0.15,
    });
    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0x7a5a28, metalness: 0.8, roughness: 0.3,
    });

    // ── MAIN HULL ─────────────────────────────────────────────────────────
    group.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.65, 0.85), armorMat));

    // Angled front armor plate
    const frontPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.58, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x221508, metalness: 0.9, roughness: 0.25 }),
    );
    frontPlate.position.x = 0.61;
    frontPlate.rotation.z = -0.18;
    group.add(frontPlate);

    // Hull gold trim edges
    for (let i = 0; i < 4; i++) {
      const edgeAngle = (i / 4) * Math.PI * 2;
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.65, 0.038), goldMat.clone());
      edge.position.set(-0.08, 0, Math.sin(edgeAngle) * 0.43);
      group.add(edge);
    }

    // ── SHOULDER PAULDRONS ────────────────────────────────────────────────
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;
      const paul = new THREE.Mesh(
        new THREE.SphereGeometry(0.31, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55),
        armorMat.clone(),
      );
      paul.position.set(0.1, 0.32, side * 0.42);
      paul.rotation.z = side * 0.28;
      paul.scale.set(1.0, 0.88, 1.18);
      group.add(paul);

      // Pauldron gold rim
      const paulRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.31, 0.022, 6, 20, Math.PI),
        goldMat.clone(),
      );
      paulRim.position.set(0.1, 0.32, side * 0.42);
      paulRim.rotation.z = side > 0 ? -Math.PI * 0.5 : Math.PI * 0.5;
      group.add(paulRim);
    }

    // ── TURRET BASE ───────────────────────────────────────────────────────
    const tBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.25, 0.17, 8),
      darkGoldMat,
    );
    tBase.position.set(0.1, 0.41, 0);
    group.add(tBase);

    // ── TURRET GROUP (scans left/right) ───────────────────────────────────
    this._turretGroup = new THREE.Group();
    this._turretGroup.position.set(0.1, 0.5, 0);

    const turretBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.21, 0.14, 8),
      armorMat.clone(),
    );
    this._turretGroup.add(turretBody);

    // Twin cannons
    this._muzzles = [];
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;

      const barrelGeo = new THREE.CylinderGeometry(0.038, 0.052, 0.78, 6);
      const barrel    = new THREE.Mesh(barrelGeo, armorMat.clone());
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(0.39, 0, side * 0.09);
      this._turretGroup.add(barrel);

      // Barrel ring detail
      const bRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.052, 0.01, 5, 14),
        goldMat.clone(),
      );
      bRing.rotation.y = Math.PI / 2;
      bRing.position.set(0.22, 0, side * 0.09);
      this._turretGroup.add(bRing);

      // Muzzle flash glow
      const muzzleGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.0,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const muzzleGlow = new THREE.Mesh(new THREE.CircleGeometry(0.038, 6), muzzleGlowMat);
      muzzleGlow.rotation.y = Math.PI / 2;
      muzzleGlow.position.set(0.79, 0, side * 0.09);
      this._muzzles.push({ mat: muzzleGlowMat, phase: i * 0.83 });
      this._turretGroup.add(muzzleGlow);
    }

    // Targeting sensor on turret
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 1.5,
    });
    this._sensor = new THREE.Mesh(new THREE.SphereGeometry(0.038, 6, 6), sensorMat);
    this._sensor.position.set(0.17, 0.1, 0);
    this._turretGroup.add(this._sensor);

    group.add(this._turretGroup);

    // WH40K purity seal on chest
    const sealMat = goldMat.clone();
    const seal = new THREE.Mesh(new THREE.CircleGeometry(0.09, 6), sealMat);
    seal.position.set(0.57, 0.08, 0);
    seal.rotation.y = Math.PI / 2;
    group.add(seal);

    // ── ENGINE EXHAUSTS (rear) ────────────────────────────────────────────
    this._exhausts = [];
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 1 : -1;

      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.115, 0.32, 6),
        armorMat.clone(),
      );
      nozzle.position.set(-0.56, 0, side * 0.22);
      group.add(nozzle);

      const exMat = new THREE.MeshStandardMaterial({
        color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 2.2,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const exGlow = new THREE.Mesh(new THREE.CircleGeometry(0.082, 6), exMat);
      exGlow.rotation.y = -Math.PI / 2;
      exGlow.position.set(-0.72, 0, side * 0.22);
      this._exhausts.push({ mat: exMat, phase: i * 1.43 });
      group.add(exGlow);
    }

    return group;
  }

  update(dt, time) {
    super.update(dt, time);

    // Turret scans slowly
    if (this._turretGroup) {
      this._turretGroup.rotation.y = Math.sin(time * 0.58) * 0.52;
    }

    // Muzzle glow — subtle idle flicker
    if (this._muzzles) {
      for (const m of this._muzzles) {
        m.mat.emissiveIntensity = 0.4 + Math.abs(Math.sin(time * 7.8 + m.phase)) * 2.2;
      }
    }

    // Sensor blink
    if (this._sensor) {
      this._sensor.material.emissiveIntensity = 0.8 + Math.abs(Math.sin(time * 2.1)) * 1.4;
    }

    // Exhaust flicker
    for (const e of this._exhausts) {
      e.mat.emissiveIntensity = 1.6 + Math.sin(time * 6.9 + e.phase) * 0.8;
    }
  }
}
