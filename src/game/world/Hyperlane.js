import * as THREE from 'three';
import { HyperlaneShader } from '../shaders/effects/HyperlaneShader.js';

const PARTICLE_COUNT = 60;
const PARTICLE_SPEED = 0.15;

/**
 * A glowing tube connecting two solar systems, with flowing particles.
 * Uses TubeGeometry + HyperlaneShader for an animated energy conduit look.
 */
export class Hyperlane {
  constructor(fromPos, toPos, fromId, toId) {
    this.fromId = fromId;
    this.toId = toId;
    this.group = new THREE.Group();

    // Main tube
    const path    = new THREE.LineCurve3(fromPos.clone(), toPos.clone());
    const tubeGeo = new THREE.TubeGeometry(path, 20, 0.12, 8, false);

    this.tubeMaterial = new THREE.ShaderMaterial({
      vertexShader:   HyperlaneShader.vertex,
      fragmentShader: HyperlaneShader.fragment,
      uniforms: {
        uTime:      { value: 0 },
        uColor:     { value: new THREE.Vector3(0.784, 0.659, 0.306) }, // #c8a84e in linear
        uIntensity: { value: 0.15 },
      },
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
      blending:    THREE.AdditiveBlending,
    });

    this.tube = new THREE.Mesh(tubeGeo, this.tubeMaterial);
    this.group.add(this.tube);

    // Flowing particles along the lane
    this.direction  = toPos.clone().sub(fromPos);
    this.length     = this.direction.length();
    this.dirNorm    = this.direction.clone().normalize();
    this.fromPos    = fromPos.clone();

    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    this.particleOffsets = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particleOffsets[i] = Math.random();
      const pos = fromPos.clone().addScaledVector(this.dirNorm, this.particleOffsets[i] * this.length);
      particlePositions[i * 3]     = pos.x;
      particlePositions[i * 3 + 1] = pos.y;
      particlePositions[i * 3 + 2] = pos.z;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Gaussian soft-sprite particle material
    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 4.5 * (150.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3  uColor;
        uniform float uOpacity;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float alpha = exp(-dot(uv, uv) * 12.0) * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor * 1.6, alpha);
        }
      `,
      uniforms: {
        uColor:   { value: new THREE.Vector3(0.784, 0.659, 0.306) },
        uOpacity: { value: 0.3 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    this.particles = new THREE.Points(particleGeo, this.particleMaterial);
    this.group.add(this.particles);

    // Scratch vector to avoid per-frame allocation
    this._tempPos = new THREE.Vector3();
  }

  /**
   * Update particle flow and visual state.
   * @param {number} dt - Delta time
   * @param {boolean} owned - Whether both ends are owned (brighter if so)
   */
  update(dt, owned) {
    // Advance time uniform for flow animation
    this.tubeMaterial.uniforms.uTime.value += dt;

    // Animate particle positions along the lane
    const positions = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particleOffsets[i] = (this.particleOffsets[i] + dt * PARTICLE_SPEED) % 1.0;
      this._tempPos.copy(this.fromPos).addScaledVector(this.dirNorm, this.particleOffsets[i] * this.length);
      positions[i * 3]     = this._tempPos.x;
      positions[i * 3 + 1] = this._tempPos.y;
      positions[i * 3 + 2] = this._tempPos.z;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // Brighten when both systems are owned
    const targetIntensity = owned ? 0.55 : 0.15;
    const u = this.tubeMaterial.uniforms.uIntensity;
    u.value += (targetIntensity - u.value) * 0.05;

    this.particleMaterial.uniforms.uOpacity.value = owned ? 0.65 : 0.25;
  }

  dispose() {
    this.tube.geometry.dispose();
    this.tubeMaterial.dispose();
    this.particles.geometry.dispose();
    this.particleMaterial.dispose();
  }
}
