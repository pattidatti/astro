import * as THREE from 'three';

/**
 * A red pulsing sphere representing an enemy patrol on a hyperlane.
 * Visible at galaxy zoom level (distance > 100).
 * Pooled — activate/deactivate as needed.
 */
export class PatrolDot3D {
  constructor() {
    const geo = new THREE.SphereGeometry(1.5, 8, 8);
    this._mat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geo, this._mat);
    this.mesh.visible = false;

    // Glow halo
    const haloGeo = new THREE.SphereGeometry(3, 8, 8);
    this._haloMat = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._halo = new THREE.Mesh(haloGeo, this._haloMat);
    this.mesh.add(this._halo);

    this._pulsePhase = Math.random() * Math.PI * 2;
  }

  activate(position) {
    this.mesh.position.copy(position);
    this.mesh.visible = true;
  }

  deactivate() {
    this.mesh.visible = false;
  }

  update(time, position) {
    if (!this.mesh.visible) return;
    if (position) this.mesh.position.copy(position);

    // Pulse effect
    const pulse = 0.5 + Math.sin(time * 3 + this._pulsePhase) * 0.3;
    this._mat.opacity = pulse;
    this._haloMat.opacity = pulse * 0.2;
    this.mesh.scale.setScalar(0.8 + Math.sin(time * 2 + this._pulsePhase) * 0.2);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this._mat.dispose();
    this._halo.geometry.dispose();
    this._haloMat.dispose();
  }
}
