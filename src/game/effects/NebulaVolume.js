import * as THREE from 'three';
import { NOISE_GLSL } from '../utils/ShaderLib.js';

/**
 * A positioned volumetric nebula cloud behind a planet.
 * Domain-warped three-channel noise with emission hotspots.
 * @param {string|number} color1 - Primary color (deep)
 * @param {string|number} color2 - Secondary color (warm)
 * @param {string|number} color3 - Tertiary color (complement)
 * @param {number} size - Billboard size in world units
 */
export class NebulaVolume {
  constructor(color1 = 0x220044, color2 = 0x440088, color3 = 0x003344, size = 80, timeOffset = 0) {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const c3 = new THREE.Color(color3);

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
        uniform float uOpacity;
        uniform float uTimeOffset;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform vec3  uColor3;

        varying vec2 vUv;

        void main() {
          vec2 p    = (vUv - 0.5) * 2.0;
          float dist = length(p);

          // Circular falloff — sharp center, soft edge
          float falloff = smoothstep(1.0, 0.12, dist);

          // Domain-warped noise for organic cloud shapes
          vec2 q = vec2(
            fbm(p * 1.5 + uTime * 0.010, 4),
            fbm(p * 1.5 + vec2(1.7, 9.2) + uTime * 0.008, 4)
          );
          float n1 = fbm(p * 2.0 + q * 2.0 + uTime * 0.012, 5);
          float n2 = fbm(p * 3.5 + q * 1.5 - uTime * 0.008, 4);
          float n3 = fbm(p * 5.0 - q * 1.0 + uTime * 0.006, 3);

          float density = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
          density = pow(density, 1.2);
          density *= falloff;

          // Sakte fargesyklus — hver instans har unik fase, skifter uavhengig
          float colorCycle = sin(uTime * 0.08 + uTimeOffset) * 0.5 + 0.5;
          vec3 c1 = mix(uColor1, uColor3 * 0.7 + uColor2 * 0.3, colorCycle * 0.45);
          vec3 c2 = mix(uColor2, uColor1 * 0.5 + uColor3 * 0.5, colorCycle * 0.35);

          vec3 color = mix(c1, c2, n1);
          color = mix(color, uColor3, n2 * 0.4);

          // Emission hotspots — 2 scattered bright cores
          float h1 = smoothstep(0.35, 0.0, length(p - vec2( 0.20,  0.15)));
          float h2 = smoothstep(0.25, 0.0, length(p - vec2(-0.18, -0.22)));
          color += (c1 * 1.8 + vec3(0.4)) * (h1 + h2) * 0.5;

          // Bright inner core glow
          float core = smoothstep(0.45, 0.0, dist);
          color += c2 * core * 0.4;

          // Subtil pulsering — skyene "puster" litt
          float pulse = 0.92 + 0.08 * sin(uTime * 0.18 + uTimeOffset * 1.7);
          float alpha = density * 0.40 * uOpacity * pulse;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime:       { value: 0 },
        uOpacity:    { value: 1.0 },
        uTimeOffset: { value: timeOffset },
        uColor1:     { value: new THREE.Vector3(c1.r, c1.g, c1.b) },
        uColor2:     { value: new THREE.Vector3(c2.r, c2.g, c2.b) },
        uColor3:     { value: new THREE.Vector3(c3.r, c3.g, c3.b) },
      },
      transparent: true,
      depthWrite:  false,
      side:        THREE.DoubleSide,
      blending:    THREE.AdditiveBlending,
    });

    const geo = new THREE.PlaneGeometry(size, size);
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.renderOrder = -10;
  }

  update(time, camera) {
    this.material.uniforms.uTime.value = time;
    this.mesh.lookAt(camera.position);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
