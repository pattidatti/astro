import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/** Disc body with counter-rotating torus rings */
export class HoverBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // Disc body
    const discGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x44aacc,
      metalness: 0.7,
      roughness: 0.3,
    });
    group.add(new THREE.Mesh(discGeo, discMat));

    // Top dome
    const domeGeo = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x88ddff,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.06;
    group.add(dome);

    // Outer ring (rotates)
    const ring1Geo = new THREE.TorusGeometry(0.45, 0.03, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e,
      emissive: 0xc8a84e,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    this._ring1 = new THREE.Mesh(ring1Geo, ringMat);
    this._ring1.rotation.x = Math.PI / 2;
    group.add(this._ring1);

    // Inner ring (counter-rotates)
    const ring2Geo = new THREE.TorusGeometry(0.32, 0.02, 8, 20);
    this._ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
    this._ring2.rotation.x = Math.PI / 2;
    group.add(this._ring2);

    // Bottom thruster glow
    const thrusterGeo = new THREE.CircleGeometry(0.15, 8);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0x44ccff,
      emissive: 0x44ccff,
      emissiveIntensity: 2.0,
      side: THREE.DoubleSide,
    });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.y = -0.07;
    group.add(thruster);

    return group;
  }

  update(dt, time) {
    super.update(dt, time);
    if (this._ring1) this._ring1.rotation.z = time * 2;
    if (this._ring2) this._ring2.rotation.z = -time * 3;
  }
}
