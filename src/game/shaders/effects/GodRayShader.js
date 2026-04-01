import * as THREE from 'three';

export const GodRayShader = {
  name: 'GodRayShader',
  uniforms: {
    tDiffuse:  { value: null },
    uLightPos: { value: new THREE.Vector2(0.5, 0.5) },
    uDecay:    { value: 0.96 },
    uDensity:  { value: 0.85 },
    uWeight:   { value: 0.35 },
    uExposure: { value: 0.18 },
    uEnabled:  { value: 0.0 },  // 0=off, 1=full — early-exit when 0
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    #define NUM_SAMPLES 64

    uniform sampler2D tDiffuse;
    uniform vec2  uLightPos;
    uniform float uDecay;
    uniform float uDensity;
    uniform float uWeight;
    uniform float uExposure;
    uniform float uEnabled;

    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);

      // Zero-cost early exit when god rays are off
      if (uEnabled < 0.01) {
        gl_FragColor = base;
        return;
      }

      vec2 texCoord = vUv;
      vec2 deltaTexCoord = (texCoord - uLightPos) * (1.0 / float(NUM_SAMPLES)) * uDensity;

      float illuminationDecay = 1.0;
      vec4  accum = vec4(0.0);

      for (int i = 0; i < NUM_SAMPLES; i++) {
        texCoord -= deltaTexCoord;
        vec2 clamped = clamp(texCoord, 0.0, 1.0);
        vec4 sample  = texture2D(tDiffuse, clamped);
        sample      *= illuminationDecay * uWeight;
        accum       += sample;
        illuminationDecay *= uDecay;
      }

      // Additive blend over original frame
      gl_FragColor = base + accum * uExposure * uEnabled;
    }
  `,
};
