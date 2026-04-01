export const FilmGrainShader = {
  name: 'FilmGrainShader',
  uniforms: {
    tDiffuse:  { value: null },
    uTime:     { value: 0 },
    uStrength: { value: 0.028 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uStrength;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      // Seed changes each frame via uTime so grain doesn't burn in
      float grain = hash(vUv + fract(uTime * 0.07)) * 2.0 - 1.0;
      col.rgb += grain * uStrength;
      gl_FragColor = col;
    }
  `,
};
