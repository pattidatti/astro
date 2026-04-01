import * as THREE from 'three';

const PARTICLE_COUNT = 20;
const PARTICLE_SPEED = 0.15;

/**
 * A glowing line connecting two solar systems, with flowing particles.
 */
export class Hyperlane {
  constructor(fromPos, toPos, fromId, toId) {
    this.fromId = fromId;
    this.toId = toId;
    this.group = new THREE.Group();

    // Main line
    const points = [fromPos.clone(), toPos.clone()];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc8a84e,
      transparent: true,
      opacity: 0.15,
      linewidth: 1,
    });
    this.line = new THREE.Line(lineGeo, this.lineMaterial);
    this.group.add(this.line);

    // Flowing particles along the lane
    this.direction = toPos.clone().sub(fromPos);
    this.length = this.direction.length();
    this.dirNorm = this.direction.clone().normalize();
    this.fromPos = fromPos.clone();

    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    this.particleOffsets = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particleOffsets[i] = Math.random(); // 0..1 along the lane
      const pos = fromPos.clone().addScaledVector(this.dirNorm, this.particleOffsets[i] * this.length);
      particlePositions[i * 3] = pos.x;
      particlePositions[i * 3 + 1] = pos.y;
      particlePositions[i * 3 + 2] = pos.z;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0xc8a84e,
      size: 0.8,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particles = new THREE.Points(particleGeo, this.particleMaterial);
    this.group.add(this.particles);
  }

  /**
   * Update particle flow and visual state.
   * @param {number} dt - Delta time
   * @param {boolean} owned - Whether both ends are owned (brighter if so)
   */
  update(dt, owned) {
    // Animate particle positions along the lane
    const positions = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particleOffsets[i] = (this.particleOffsets[i] + dt * PARTICLE_SPEED) % 1.0;
      const t = this.particleOffsets[i];
      const pos = this.fromPos.clone().addScaledVector(this.dirNorm, t * this.length);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // Brighten if both systems owned
    const targetOpacity = owned ? 0.35 : 0.12;
    this.lineMaterial.opacity += (targetOpacity - this.lineMaterial.opacity) * 0.05;
    this.particleMaterial.opacity = owned ? 0.6 : 0.3;
  }

  dispose() {
    this.line.geometry.dispose();
    this.lineMaterial.dispose();
    this.particles.geometry.dispose();
    this.particleMaterial.dispose();
  }
}
