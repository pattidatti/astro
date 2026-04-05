import * as THREE from 'three';

export const WarpDistortionShader = {
  name: 'WarpDistortionShader',
  uniforms: {
    tDiffuse:  { value: null },
    uCenter:   { value: new THREE.Vector2(0.5, 0.5) },
    uStrength: { value: 0.18 },
    uProgress: { value: 0.0 },   // 0→1 driven by RenderPipeline.tick()
    uEnabled:  { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    #define NUM_DIRS 12
    uniform sampler2D tDiffuse;
    uniform vec2  uCenter;
    uniform float uStrength;
    uniform float uProgress;
    uniform float uEnabled;
    varying vec2 vUv;
    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      if (uEnabled < 0.01) { gl_FragColor = base; return; }
      float env = sin(uProgress * 3.14159);
      vec2 dir = vUv - uCenter;
      float dist = length(dir);
      vec4 accum = vec4(0.0);
      float step = 6.28318 / float(NUM_DIRS);
      for (int i = 0; i < NUM_DIRS; i++) {
        float a = float(i) * step;
        vec2 offset = vec2(cos(a), sin(a)) * uStrength * env * (1.0 - dist);
        accum += texture2D(tDiffuse, clamp(vUv + offset, 0.0, 1.0));
      }
      accum /= float(NUM_DIRS);
      gl_FragColor = mix(base, accum, env * uEnabled);
    }
  `,
};
