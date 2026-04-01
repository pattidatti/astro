import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const TerrestrialShader = {
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
      // Spherical noise for land/ocean
      vec3 sp = vPosition * 2.5;
      float n = fbm3(sp + vec3(0.0, 0.0, uTime * 0.01), 5);

      // Land vs ocean threshold
      float land = smoothstep(0.42, 0.48, n);

      // Ocean color (deeper blue in deep areas)
      vec3 ocean = mix(uColors[0], uColors[1], smoothstep(0.3, 0.42, n));

      // Land color with elevation
      float elevation = smoothstep(0.48, 0.7, n);
      vec3 terrain = mix(uColors[2], uColors[3], elevation);

      vec3 baseColor = mix(ocean, terrain, land);

      // Cloud layer (separate noise, animated)
      float clouds = fbm3(vPosition * 3.0 + vec3(uTime * 0.03, uTime * 0.02, 0.0), 4);
      clouds = smoothstep(0.45, 0.65, clouds);
      baseColor = mix(baseColor, vec3(1.0, 1.0, 0.98), clouds * 0.5);

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.15;
      vec3 lit = baseColor * (ambient + diff * 0.85);

      // Specular on ocean
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 40.0) * (1.0 - land) * 0.4;
      lit += vec3(spec);

      // Rim light
      float rim = fresnel(vViewDir, vNormal, 2.5);
      lit += uColors[0] * rim * 0.15;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
