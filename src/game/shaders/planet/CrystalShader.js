import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const CrystalShader = {
  vertex: COMMON_VERTEX,
  fragment: /* glsl */`
    ${NOISE_GLSL}
    ${FRESNEL_GLSL}

    uniform float uTime;
    uniform vec3 uColors[4];
    uniform vec3 uLightDir;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewDir;

    void main() {
      vec3 sp = vPosition * 4.0;

      // Crystal formation noise — sharp edges via power
      float n = fbm3(sp, 5);
      float crystal = pow(n, 3.0);

      // Base surface
      float bands = fbm3(sp * 1.5 + vec3(0.0, uTime * 0.01, 0.0), 3);
      vec3 baseColor = mix(uColors[2], uColors[3], bands);

      // Crystal veins
      vec3 crystalColor = mix(uColors[0], uColors[1], crystal * 2.0);
      float veinMask = smoothstep(0.08, 0.12, crystal);
      baseColor = mix(baseColor, crystalColor, veinMask);

      // Sparkle effect — high frequency noise pulsing with time
      float sparkle = vnoise3(vPosition * 30.0 + uTime * 2.0);
      sparkle = pow(sparkle, 12.0) * 4.0;

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.12;
      vec3 lit = baseColor * (ambient + diff * 0.7);

      // Sharp specular for crystalline surface
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 80.0) * 0.8;
      lit += uColors[0] * spec;

      // Sparkle emission
      lit += uColors[0] * sparkle;

      // Rim
      float rim = fresnel(vViewDir, vNormal, 2.5);
      lit += uColors[1] * rim * 0.25;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
