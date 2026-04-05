import * as THREE from 'three';

const BURST_COUNT    = 40;
const BURST_LIFETIME = 1.2;
const POOL_SIZE      = 8;

/**
 * One-shot particle burst effect for robot surface mining.
 * Particles are emitted in a hemisphere along the surface normal.
 * Lives in planet-local (orbitGroup) space — no world-space conversion needed.
 * Uses object pooling to avoid per-burst geometry/material allocation.
 */
export class MiningBurst {
  constructor(parent) {
    this.parent  = parent; // THREE.Group — orbitGroup
    this._active = [];

    // Pre-allocate pool of burst objects
    this._pool = [];
    for (let p = 0; p < POOL_SIZE; p++) {
      this._pool.push(this._createBurstObject());
    }

    // Scratch vectors for tangent frame construction
    this._tangent1 = new THREE.Vector3();
    this._tangent2 = new THREE.Vector3();
    this._velScratch = new THREE.Vector3();
    this._crossRef1 = new THREE.Vector3(1, 0, 0);
    this._crossRef2 = new THREE.Vector3(0, 1, 0);
  }

  _createBurstObject() {
    const positions = new Float32Array(BURST_COUNT * 3);
    const sizes     = new Float32Array(BURST_COUNT);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uOpacity;
        varying float vOpacity;
        void main() {
          vOpacity = uOpacity;
          vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (120.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3  uColor;
        varying float vOpacity;
        void main() {
          vec2  uv    = gl_PointCoord - 0.5;
          float alpha = exp(-dot(uv, uv) * 8.0) * vOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      uniforms: {
        uOpacity: { value: 1.0 },
        uColor:   { value: new THREE.Color(0xc8a84e) },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    const points = new THREE.Points(geo, mat);
    points.visible = false;

    // Pre-allocate velocity array
    const velocities = [];
    for (let i = 0; i < BURST_COUNT; i++) {
      velocities.push(new THREE.Vector3());
    }

    return { points, geo, mat, velocities, age: 0, inUse: false };
  }

  /**
   * Spawn a burst at a planet-local position.
   * @param {THREE.Vector3} localPos  - Surface position in planet-local coords
   * @param {THREE.Vector3} normal    - Outward surface normal (normalised)
   * @param {number}        color     - Hex color (default gold)
   */
  spawn(localPos, normal, color = 0xc8a84e) {
    // Grab from pool, or create new if pool exhausted
    let burst = this._pool.find(b => !b.inUse);
    if (!burst) {
      burst = this._createBurstObject();
      this._pool.push(burst);
    }

    burst.inUse = true;
    burst.age = 0;

    // Build tangent frame
    const tangent1 = this._tangent1;
    const tangent2 = this._tangent2;
    if (Math.abs(normal.x) < 0.9) {
      tangent1.crossVectors(normal, this._crossRef1).normalize();
    } else {
      tangent1.crossVectors(normal, this._crossRef2).normalize();
    }
    tangent2.crossVectors(normal, tangent1);

    const positions = burst.geo.attributes.position.array;
    const sizes     = burst.geo.attributes.size.array;

    for (let i = 0; i < BURST_COUNT; i++) {
      positions[i * 3]     = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI * 0.7;
      const speed = 1.5 + Math.random() * 3.5;

      burst.velocities[i].copy(normal)
        .multiplyScalar(Math.cos(phi))
        .addScaledVector(tangent1, Math.sin(phi) * Math.cos(theta))
        .addScaledVector(tangent2, Math.sin(phi) * Math.sin(theta))
        .multiplyScalar(speed);

      sizes[i] = 0.08 + Math.random() * 0.14;
    }

    burst.geo.attributes.position.needsUpdate = true;
    burst.geo.attributes.size.needsUpdate = true;
    burst.mat.uniforms.uColor.value.set(color);
    burst.mat.uniforms.uOpacity.value = 1.0;
    burst.points.position.copy(localPos);
    burst.points.visible = true;

    if (!burst.points.parent) {
      this.parent.add(burst.points);
    }

    this._active.push(burst);
  }

  update(dt) {
    for (let i = this._active.length - 1; i >= 0; i--) {
      const burst = this._active[i];
      burst.age += dt;

      if (burst.age >= BURST_LIFETIME) {
        burst.points.visible = false;
        burst.inUse = false;
        this._active.splice(i, 1);
        continue;
      }

      const t = burst.age / BURST_LIFETIME;
      burst.mat.uniforms.uOpacity.value = (1 - t) * (1 - t);

      const pos = burst.geo.attributes.position.array;
      for (let j = 0; j < BURST_COUNT; j++) {
        const v = burst.velocities[j];
        pos[j * 3]     += v.x * dt;
        pos[j * 3 + 1] += v.y * dt;
        pos[j * 3 + 2] += v.z * dt;
        v.multiplyScalar(1 - dt * 1.8);
      }
      burst.geo.attributes.position.needsUpdate = true;
    }
  }

  dispose() {
    for (const burst of this._pool) {
      if (burst.points.parent) burst.points.parent.remove(burst.points);
      burst.geo.dispose();
      burst.mat.dispose();
    }
    this._pool = [];
    this._active = [];
  }
}
