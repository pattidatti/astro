import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/** Heavy tank-like bot with turret */
export class TitanBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // Main hull
    const hullGeo = new THREE.BoxGeometry(1.2, 0.5, 0.8);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x665533,
      metalness: 0.85,
      roughness: 0.3,
    });
    group.add(new THREE.Mesh(hullGeo, hullMat));

    // Front armor plate
    const frontGeo = new THREE.BoxGeometry(0.1, 0.4, 0.7);
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x887744,
      metalness: 0.9,
      roughness: 0.2,
    });
    const front = new THREE.Mesh(frontGeo, armorMat);
    front.position.set(0.65, 0, 0);
    group.add(front);

    // Turret base
    const turretBaseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 8);
    const turretMat = new THREE.MeshStandardMaterial({
      color: 0x776644,
      metalness: 0.8,
      roughness: 0.3,
    });
    const turretBase = new THREE.Mesh(turretBaseGeo, turretMat);
    turretBase.position.set(-0.1, 0.3, 0);
    group.add(turretBase);

    // Cannon
    const cannonGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.7, 6);
    const cannonMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.9,
      roughness: 0.2,
    });
    this._cannon = new THREE.Mesh(cannonGeo, cannonMat);
    this._cannon.rotation.z = Math.PI / 2;
    this._cannon.position.set(0.25, 0.35, 0);
    group.add(this._cannon);

    // Treads (two boxes on sides)
    const treadGeo = new THREE.BoxGeometry(1.0, 0.15, 0.15);
    const treadMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.6,
    });
    for (let side = -1; side <= 1; side += 2) {
      const tread = new THREE.Mesh(treadGeo, treadMat);
      tread.position.set(0, -0.2, side * 0.45);
      group.add(tread);
    }

    // Exhaust ports (emissive)
    const exhaustGeo = new THREE.CircleGeometry(0.06, 6);
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff6600,
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < 2; i++) {
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.position.set(-0.6, -0.05 + i * 0.15, 0);
      exhaust.rotation.y = Math.PI / 2;
      group.add(exhaust);
    }

    return group;
  }

  update(dt, time) {
    super.update(dt, time);
    // Turret slowly rotates
    if (this._cannon) {
      this._cannon.rotation.y = Math.sin(time * 0.5) * 0.3;
    }
  }
}
