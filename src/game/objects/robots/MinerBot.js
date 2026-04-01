import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/**
 * Heavy industrial drill machine.
 * Hexagonal armored barrel + rotating drill assembly + support struts.
 */
export class MinerBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f10, metalness: 0.85, roughness: 0.35,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e, emissive: 0xc8a84e, emissiveIntensity: 0.3,
      metalness: 0.8, roughness: 0.2,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x888888, metalness: 0.95, roughness: 0.15,
    });

    // Hexagonal armored barrel body (horizontal)
    const bodyGeo = new THREE.CylinderGeometry(0.44, 0.54, 0.92, 8);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Gold trim rings around hull
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.022, 6, 20),
        goldMat.clone(),
      );
      ring.rotation.y = Math.PI / 2;
      ring.position.x = -0.28 + i * 0.28;
      group.add(ring);
    }

    // Front shield plate
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1a1208, metalness: 0.9, roughness: 0.3,
    });
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.64, 0.74), plateMat);
    shieldPlate.position.x = 0.5;
    group.add(shieldPlate);

    // ── DRILL ASSEMBLY (rotates on local X) ──────────────────────────────
    this._drillGroup = new THREE.Group();
    this._drillGroup.position.x = 0.95;

    // Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.52, 8),
      steelMat.clone(),
    );
    shaft.rotation.z = Math.PI / 2;
    this._drillGroup.add(shaft);

    // Cone tip
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.62, 6), steelMat.clone());
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 0.57;
    this._drillGroup.add(tip);

    // 3 spiral fins on shaft
    for (let i = 0; i < 3; i++) {
      const finAngle = (i / 3) * Math.PI * 2;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.038, 0.11),
        steelMat.clone(),
      );
      fin.position.set(0.08, Math.cos(finAngle) * 0.13, Math.sin(finAngle) * 0.13);
      fin.rotation.x = finAngle;
      this._drillGroup.add(fin);
    }

    // Drill heat glow
    const heatGlowMat = new THREE.MeshStandardMaterial({
      color: 0xff5500, emissive: 0xff5500, emissiveIntensity: 1.8,
      side: THREE.DoubleSide, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const heatGlow = new THREE.Mesh(new THREE.CircleGeometry(0.15, 8), heatGlowMat);
    heatGlow.position.x = 0.88;
    heatGlow.rotation.y = Math.PI / 2;
    this._drillHeatMat = heatGlowMat;
    this._drillGroup.add(heatGlow);

    group.add(this._drillGroup);

    // ── 4 SUPPORT STRUTS ─────────────────────────────────────────────────
    const strutMat = new THREE.MeshStandardMaterial({
      color: 0x3a2a15, metalness: 0.8, roughness: 0.4,
    });
    for (let i = 0; i < 4; i++) {
      const a    = (i / 4) * Math.PI * 2;
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.048, 0.52, 5),
        strutMat.clone(),
      );
      strut.position.set(-0.12, Math.cos(a) * 0.38, Math.sin(a) * 0.38);
      strut.rotation.x = a + Math.PI * 0.5;
      strut.rotation.z = 0.28;
      group.add(strut);
    }

    // ── HEAT EXHAUST VENTS (top) ──────────────────────────────────────────
    for (let i = 0; i < 2; i++) {
      const vent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.075, 0.14, 6),
        hullMat.clone(),
      );
      vent.position.set(-0.18 + i * 0.36, 0.49, 0);
      group.add(vent);

      const ventGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 1.2,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const ventGlow = new THREE.Mesh(new THREE.CircleGeometry(0.055, 6), ventGlowMat);
      ventGlow.position.set(-0.18 + i * 0.36, 0.565, 0);
      group.add(ventGlow);
    }

    // Cargo status light (rear, green when loaded)
    const cargoMat = new THREE.MeshStandardMaterial({
      color: 0x7cb85e, emissive: 0x7cb85e, emissiveIntensity: 0.8,
    });
    this._cargoLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.13, 0.32),
      cargoMat,
    );
    this._cargoLight.position.x = -0.58;
    group.add(this._cargoLight);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);

    // Drill spins fast
    if (this._drillGroup) {
      this._drillGroup.rotation.x += dt * 12;
    }

    // Heat glow flickers with drill speed
    if (this._drillHeatMat) {
      this._drillHeatMat.emissiveIntensity = 1.2 + Math.sin(time * 8.5) * 0.8;
    }

    // Cargo light brightens when returning to station
    if (this._cargoLight) {
      this._cargoLight.material.emissiveIntensity = this.returning
        ? 0.5 + Math.abs(Math.sin(time * 6)) * 1.2
        : 0.6;
    }
  }
}
