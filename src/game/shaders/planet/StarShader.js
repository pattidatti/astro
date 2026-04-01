import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const StarShader = {
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

      // Churning plasma surface
      float plasma = fbm3(sp + vec3(uTime * 0.08, uTime * 0.05, uTime * 0.06), 5);

      // Surface convection cells
      float cells = fbm3(sp * 5.0 + uTime * 0.1, 3);
      cells = pow(cells, 2.0);

      // Color gradient — hottest center to cooler edges
      vec3 baseColor = mix(uColors[0], uColors[1], plasma);
      baseColor = mix(baseColor, uColors[2], cells * 0.4);

      // Solar flare rays
      float angle = atan(vPosition.z, vPosition.x);
      float flareNoise = vnoise(vec2(angle * 3.0, uTime * 0.3));
      float flareMask = pow(flareNoise, 5.0) * 2.0;
      float edgeDist = fresnel(vViewDir, vNormal, 1.5);
      float flare = flareMask * edgeDist;
      baseColor += uColors[0] * flare;

      // Pulsing intensity
      float pulse = sin(uTime * 1.5 + plasma * 4.0) * 0.1 + 1.0;

      // Fully emissive — stars don't receive shadows
      vec3 lit = baseColor * pulse * 1.8;

      // Corona rim
      float rim = fresnel(vViewDir, vNormal, 1.5);
      lit += uColors[1] * rim * 0.5;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
