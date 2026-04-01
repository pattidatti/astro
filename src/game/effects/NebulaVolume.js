import * as THREE from 'three';
import { NOISE_GLSL } from '../utils/ShaderLib.js';

/**
 * A positioned volumetric nebula cloud behind a planet.
 * Uses a billboard quad with a raymarched-style noise shader.
 */
export class NebulaVolume {
  constructor(color1 = 0x220044, color2 = 0x440088, size = 40) {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);

    this.material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        ${NOISE_GLSL}

        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        varying vec2 vUv;

        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          float dist = length(p);

          // Circular falloff
          float falloff = smoothstep(1.0, 0.2, dist);

          // Noise layers for volume appearance
          float n1 = fbm(p * 2.0 + uTime * 0.015, 5);
          float n2 = fbm(p * 3.5 - uTime * 0.01, 4);

          float density = (n1 * 0.6 + n2 * 0.4);
          density = pow(density, 1.3);
          density *= falloff;

          vec3 color = mix(uColor1, uColor2, n1);

          // Bright core
          float core = smoothstep(0.5, 0.0, dist) * 0.3;
          color += vec3(core);

          float alpha = density * 0.15;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Vector3(c1.r, c1.g, c1.b) },
        uColor2: { value: new THREE.Vector3(c2.r, c2.g, c2.b) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const geo = new THREE.PlaneGeometry(size, size);
    this.mesh = new THREE.Mesh(geo, this.material);
    // Billboard: always face camera (done in update)
    this.mesh.renderOrder = -10;
  }

  /**
   * @param {number} time
   * @param {THREE.Camera} camera
   */
  update(time, camera) {
    this.material.uniforms.uTime.value = time;
    // Billboard: face camera
    this.mesh.lookAt(camera.position);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
