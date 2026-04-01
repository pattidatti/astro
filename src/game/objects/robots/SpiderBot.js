import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/** Sphere body with articulated legs */
export class SpiderBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // Body sphere
    const bodyGeo = new THREE.SphereGeometry(0.3, 10, 10);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.8,
      roughness: 0.3,
    });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    // Eyes (emissive)
    const eyeGeo = new THREE.SphereGeometry(0.05, 6, 6);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff2200,
      emissiveIntensity: 2.0,
    });
    for (let side = -1; side <= 1; side += 2) {
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0.2, 0.1, side * 0.12);
      group.add(eye);
    }

    // 6 legs
    this._legs = [];
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x777777,
      metalness: 0.7,
      roughness: 0.4,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4);
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(
        Math.cos(angle) * 0.25,
        -0.15,
        Math.sin(angle) * 0.25
      );
      leg.rotation.z = Math.cos(angle) * 0.6;
      leg.rotation.x = Math.sin(angle) * 0.6;
      this._legs.push(leg);
      group.add(leg);
    }

    return group;
  }

  update(dt, time) {
    super.update(dt, time);
    // Animate legs
    for (let i = 0; i < this._legs.length; i++) {
      const phase = (i / this._legs.length) * Math.PI * 2;
      this._legs[i].rotation.z += Math.sin(time * 4 + phase) * dt * 2;
    }
  }
}
