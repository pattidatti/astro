import * as THREE from 'three';

const DUST_COUNT = 200;
const DUST_RADIUS = 18;

/**
 * Particle dust cloud around a planet, tinted to the planet's glow color.
 */
export class DustCloud {
  constructor(color = 0xc8a84e) {
    this.group = new THREE.Group();

    const positions = new Float32Array(DUST_COUNT * 3);
    const sizes = new Float32Array(DUST_COUNT);
    const opacities = new Float32Array(DUST_COUNT);

    // Particle data
    this.velocities = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      // Spherical distribution around the planet
      const r = 11 + Math.random() * DUST_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 0.1 + Math.random() * 0.4;
      opacities[i] = 0.1 + Math.random() * 0.3;

      // Slow drift velocities
      this.velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.3
      ));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.3,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geo, this.material);
    this.group.add(this.points);
  }

  /**
   * Animate dust drift.
   * @param {number} dt
   * @param {number} time
   */
  update(dt, time) {
    const pos = this.points.geometry.attributes.position.array;

    for (let i = 0; i < DUST_COUNT; i++) {
      const idx = i * 3;
      pos[idx] += this.velocities[i].x * dt;
      pos[idx + 1] += this.velocities[i].y * dt;
      pos[idx + 2] += this.velocities[i].z * dt;

      // Keep within bounds — wrap around
      const dist = Math.sqrt(pos[idx] ** 2 + pos[idx + 1] ** 2 + pos[idx + 2] ** 2);
      if (dist > 11 + DUST_RADIUS) {
        // Reset to inner edge
        const r = 11 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx] = r * Math.sin(phi) * Math.cos(theta);
        pos[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[idx + 2] = r * Math.cos(phi);
      }
    }
    this.points.geometry.attributes.position.needsUpdate = true;

    // Gentle overall rotation
    this.group.rotation.y += dt * 0.02;
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
