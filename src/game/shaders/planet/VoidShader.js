import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const VoidShader = {
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
      vec3 sp = vPosition * 2.5;

      // Spiraling void distortion
      float angle = atan(vPosition.z, vPosition.x);
      float dist = length(vPosition.xz);
      float spiral = angle + dist * 3.0 - uTime * 0.3;
      float spiralPattern = sin(spiral * 4.0) * 0.5 + 0.5;

      // Dark matter noise
      float darkNoise = fbm3(sp + vec3(uTime * 0.03, -uTime * 0.02, uTime * 0.04), 5);

      // Combined pattern
      float pattern = mix(spiralPattern, darkNoise, 0.6);

      // Inverted lighting — dark where lit, bright at edges
      float invertedLight = 1.0 - max(dot(vNormal, uLightDir), 0.0);

      // Base colors — very dark with purple/violet highlights
      vec3 baseColor = mix(uColors[3], uColors[2], pattern);
      vec3 highlight = mix(uColors[1], uColors[0], darkNoise);

      // Void energy veins
      float veins = pow(fbm3(sp * 6.0 + uTime * 0.1, 3), 4.0) * 3.0;
      baseColor += highlight * veins;

      // Dim emissive in void patterns
      float emissive = smoothstep(0.4, 0.8, pattern) * 0.4;

      // Lighting — mostly ambient + inverted contribution
      vec3 lit = baseColor * (0.15 + invertedLight * 0.3) + baseColor * emissive;

      // Eerie purple rim
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[0] * rim * 0.4;

      // Dimensional rift pulsing
      float pulse = sin(uTime * 0.7 + pattern * 5.0) * 0.15 + 0.85;
      lit *= pulse;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
