export const ColorGradeShader = {
  name: 'ColorGradeShader',
  uniforms: {
    tDiffuse:     { value: null },
    uSaturation:  { value: 1.35 },
    uContrast:    { value: 1.12 },
    uVigStrength: { value: 0.45 },
    uCAStrength:  { value: 0.0018 },
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
    uniform float uSaturation;
    uniform float uContrast;
    uniform float uVigStrength;
    uniform float uCAStrength;
    varying vec2 vUv;

    vec3 sCurve(vec3 x) {
      // Smoothstep S-curve: keeps darks dark, boosts mids, compresses highlights
      x = clamp(x, 0.0, 1.0);
      return x * x * (3.0 - 2.0 * x);
    }

    vec3 adjustSaturation(vec3 col, float sat) {
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      return mix(vec3(luma), col, sat);
    }

    void main() {
      vec2 center = vUv - 0.5;

      // Chromatic aberration: R pushed out, B pushed in
      float dist = length(center);
      vec2 aberr = normalize(center + 0.0001) * dist * uCAStrength;

      float r = texture2D(tDiffuse, vUv + aberr).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - aberr).b;
      vec3 col = vec3(r, g, b);

      // S-curve contrast
      col = sCurve(col) * uContrast;

      // Cool shadows / warm highlights (sci-fi color grade)
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(col, col * vec3(0.85, 0.90, 1.10), smoothstep(0.3, 0.0, luma));
      col = mix(col, col * vec3(1.08, 1.04, 0.92), smoothstep(0.6, 1.0, luma));

      // Saturation boost
      col = adjustSaturation(col, uSaturation);

      // Vignette
      float vig = 1.0 - dot(center, center) * uVigStrength * 3.5;
      col *= clamp(vig, 0.0, 1.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
