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

    // Particle offsets (0–1 along lane) stored as attribute for GPU animation
    const particleOffsets = new Float32Array(PARTICLE_COUNT);
    // Dummy positions — actual positions computed in vertex shader
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particleOffsets[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('aOffset',  new THREE.BufferAttribute(particleOffsets, 1));

    // Gaussian soft-sprite particle material — positions computed on GPU
    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        uniform float uTime;
        uniform vec3  uFrom;
        uniform vec3  uDir;
        uniform float uLength;
        uniform float uSpeed;
        attribute float aOffset;
        #ifdef USE_LOGDEPTHBUF
          uniform float logDepthBufFC;
        #endif
        void main() {
          float t = fract(aOffset + uTime * uSpeed);
          vec3 pos = uFrom + uDir * (t * uLength);
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 4.5 * (150.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
          #ifdef USE_LOGDEPTHBUF
            gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC - 1.0;
            gl_Position.z *= gl_Position.w;
          #endif
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
        uTime:    { value: 0 },
        uFrom:    { value: this.fromPos.clone() },
        uDir:     { value: this.dirNorm.clone() },
        uLength:  { value: this.length },
        uSpeed:   { value: PARTICLE_SPEED },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
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
    // Advance time uniform for flow animation (tube + particles both GPU-driven)
    this.tubeMaterial.uniforms.uTime.value += dt;
    this.particleMaterial.uniforms.uTime.value += dt;

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
