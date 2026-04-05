import * as THREE from 'three';

const DUST_COUNT = 600;
const DUST_RADIUS = 18;

/**
 * Particle dust cloud around a planet.
 * Uses GPU-based oscillating drift — all particle movement computed in vertex shader.
 * Uses a gaussian soft-sprite ShaderMaterial for realistic puff appearance.
 */
export class DustCloud {
  constructor(color = 0xc8a84e) {
    this.group = new THREE.Group();

    const positions = new Float32Array(DUST_COUNT * 3);
    const sizes     = new Float32Array(DUST_COUNT);
    const opacities = new Float32Array(DUST_COUNT);
    const colors    = new Float32Array(DUST_COUNT * 3);
    const velocities = new Float32Array(DUST_COUNT * 3);
    const freqs     = new Float32Array(DUST_COUNT * 3); // oscillation frequencies per axis

    const baseColor = new THREE.Color(color);

    for (let i = 0; i < DUST_COUNT; i++) {
      const r = 11 + Math.random() * DUST_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);
      positions[i * 3]     = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      sizes[i]    = 0.15 + Math.random() * 0.5;
      opacities[i] = 0.15 + Math.random() * 0.35;

      // Slight color variation per particle (brightness +/-20%)
      const brightness = 0.8 + Math.random() * 0.4;
      const c = baseColor.clone().multiplyScalar(brightness);
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Drift velocity with orbital tangential bias
      let vx = (Math.random() - 0.5) * 0.3;
      let vy = (Math.random() - 0.5) * 0.15;
      let vz = (Math.random() - 0.5) * 0.3;

      // Orbital bias: particles gently circulate around planet equator
      const xzLen = Math.sqrt(px * px + pz * pz) + 0.001;
      const tangentScale = 0.08;
      vx += (-pz / xzLen) * tangentScale;
      vz += ( px / xzLen) * tangentScale;

      velocities[i * 3]     = vx;
      velocities[i * 3 + 1] = vy;
      velocities[i * 3 + 2] = vz;

      // Per-particle oscillation frequencies for bounded drift
      freqs[i * 3]     = 0.15 + Math.random() * 0.25;
      freqs[i * 3 + 1] = 0.10 + Math.random() * 0.20;
      freqs[i * 3 + 2] = 0.15 + Math.random() * 0.25;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('aVelocity',new THREE.BufferAttribute(velocities,3));
    geo.setAttribute('aFreq',    new THREE.BufferAttribute(freqs,     3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        uniform float uTime;
        attribute float size;
        attribute float aOpacity;
        attribute vec3  aColor;
        attribute vec3  aVelocity;
        attribute vec3  aFreq;
        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          vOpacity = aOpacity;
          vColor   = aColor;
          // Oscillating drift: bounded sinusoidal movement along velocity direction
          // Amplitude scales with velocity magnitude, frequency varies per particle
          vec3 drift = aVelocity * vec3(
            sin(uTime * aFreq.x),
            sin(uTime * aFreq.y),
            sin(uTime * aFreq.z)
          ) * 12.0;
          vec3 pos = position + drift;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uOpacity;
        varying float vOpacity;
        varying vec3  vColor;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          // Gaussian soft-puff -- no hard edges
          float alpha = exp(-dot(uv, uv) * 10.0) * vOpacity * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      uniforms: {
        uOpacity: { value: 0.35 },
        uTime:    { value: 0 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    this.points = new THREE.Points(geo, this.material);
    this.group.add(this.points);
  }

  /** Set overall opacity (called from SolarSystem LOD). */
  setOpacity(v) {
    this.material.uniforms.uOpacity.value = v;
  }

  update(dt) {
    // All particle movement is GPU-driven via uTime
    this.material.uniforms.uTime.value += dt;

    // Slow orbital rotation of the entire cloud
    this.group.rotation.y += dt * 0.05;
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
