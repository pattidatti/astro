import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const IceShader = {
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
      vec3 sp = vPosition * 3.0;

      // Ice surface — smooth with cracks
      float surface = fbm3(sp + vec3(0.0, 0.0, uTime * 0.005), 5);

      // Crack pattern (Voronoi-like via sharp noise)
      float cracks = fbm3(sp * 5.0, 4);
      cracks = pow(1.0 - cracks, 6.0);

      // Base ice color — high albedo
      vec3 baseColor = mix(uColors[0], uColors[1], surface);
      baseColor = mix(baseColor, uColors[2], smoothstep(0.4, 0.6, surface));

      // Dark cracks
      baseColor = mix(baseColor, uColors[3], cracks * 0.5);

      // Subsurface scattering approximation
      float sss = fresnel(vViewDir, vNormal, 1.2);
      float backlight = max(dot(vNormal, -uLightDir), 0.0);
      vec3 subsurface = uColors[1] * backlight * 0.15;

      // Lighting — high ambient for ice reflectivity
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.25;
      vec3 lit = baseColor * (ambient + diff * 0.65) + subsurface;

      // Sharp specular (ice is reflective)
      vec3 halfDir = normalize(uLightDir + vViewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 60.0) * 0.5;
      lit += vec3(spec);

      // Blue rim
      float rim = fresnel(vViewDir, vNormal, 3.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
