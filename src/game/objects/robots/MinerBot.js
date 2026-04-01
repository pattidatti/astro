import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/** Boxy hull with rotating drill arm */
export class MinerBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.BoxGeometry(1, 0.6, 0.7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xcc8833,
      metalness: 0.8,
      roughness: 0.3,
    });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    // Drill
    const drillGeo = new THREE.ConeGeometry(0.15, 0.6, 6);
    const drillMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.2,
    });
    const drill = new THREE.Mesh(drillGeo, drillMat);
    drill.rotation.z = -Math.PI / 2;
    drill.position.set(0.7, -0.1, 0);
    this._drill = drill;
    group.add(drill);

    // Cargo bay indicator
    const bayGeo = new THREE.BoxGeometry(0.3, 0.2, 0.5);
    const bayMat = new THREE.MeshStandardMaterial({
      color: 0x7cb85e,
      emissive: 0x7cb85e,
      emissiveIntensity: 0.5,
    });
    const bay = new THREE.Mesh(bayGeo, bayMat);
    bay.position.set(-0.3, 0.2, 0);
    group.add(bay);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);
    if (this._drill) {
      this._drill.rotation.y += dt * 8;
    }
  }
}
