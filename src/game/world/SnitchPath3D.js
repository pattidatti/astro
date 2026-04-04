import * as THREE from 'three';

/**
 * Visual red line from a snitching scout to its target station.
 * Shared LineSegments geometry with dynamic position updates.
 */
export class SnitchPath3D {
  constructor(scene) {
    const positions = new Float32Array(6); // 2 points × 3 coords
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      linewidth: 2,
    });

    this.line = new THREE.LineSegments(geo, mat);
    this.line.visible = false;
    scene.add(this.line);
  }

  /**
   * Update the line endpoints.
   * @param {THREE.Vector3} fromPos - Scout world position
   * @param {THREE.Vector3} toPos   - Target station world position
   */
  update(fromPos, toPos) {
    const pos = this.line.geometry.attributes.position;
    pos.setXYZ(0, fromPos.x, fromPos.y, fromPos.z);
    pos.setXYZ(1, toPos.x, toPos.y, toPos.z);
    pos.needsUpdate = true;
    this.line.visible = true;
  }

  /**
   * Hide the line (scout killed before reaching target).
   */
  hide() {
    this.line.visible = false;
  }

  dispose() {
    this.line.geometry.dispose();
    this.line.material.dispose();
    this.line.parent?.remove(this.line);
  }
}
