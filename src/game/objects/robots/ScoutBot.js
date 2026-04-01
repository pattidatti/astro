import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/** Oval body with antenna */
export class ScoutBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // Oval body (squashed sphere)
    const bodyGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x4488cc,
      metalness: 0.7,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(1.2, 0.7, 0.9);
    group.add(body);

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.8,
      roughness: 0.2,
    });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 0.45, 0);
    group.add(antenna);

    // Antenna tip (emissive)
    const tipGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff4444,
      emissiveIntensity: 2.0,
    });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0, 0.72, 0);
    this._tip = tip;
    group.add(tip);

    // Scanner dish
    const dishGeo = new THREE.CircleGeometry(0.15, 8);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.35, 0.1, 0);
    dish.rotation.y = Math.PI / 2;
    group.add(dish);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);
    if (this._tip) {
      this._tip.material.emissiveIntensity = 1.0 + Math.sin(time * 5) * 1.5;
    }
  }
}
