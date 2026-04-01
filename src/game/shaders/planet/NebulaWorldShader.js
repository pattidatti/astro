import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const NebulaWorldShader = {
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
      vec3 sp = vPosition * 2.0;

      // Multiple swirling gas layers at different speeds
      float layer1 = fbm3(sp + vec3(uTime * 0.04, uTime * 0.02, 0.0), 5);
      float layer2 = fbm3(sp * 1.5 + vec3(-uTime * 0.03, 0.0, uTime * 0.05), 4);
      float layer3 = fbm3(sp * 0.8 + vec3(0.0, uTime * 0.06, -uTime * 0.02), 3);

      // Blend layers with depth parallax effect
      float combined = layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2;

      // Color gradient through nebula gas
      vec3 color1 = mix(uColors[0], uColors[1], layer1);
      vec3 color2 = mix(uColors[2], uColors[3], layer2);
      vec3 baseColor = mix(color1, color2, combined);

      // Emissive hot spots in dense areas
      float density = pow(combined, 1.5);
      float emissive = smoothstep(0.5, 0.8, density) * 0.8;

      // Soft lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.2;
      vec3 lit = baseColor * (ambient + diff * 0.5) + baseColor * emissive;

      // Strong rim glow
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.35;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
