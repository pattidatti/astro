import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const LavaShader = {
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

      // Slow churning lava flow
      float flow = fbm3(sp + vec3(uTime * 0.04, uTime * 0.02, uTime * 0.03), 5);

      // Crust vs lava cracks
      float crust = smoothstep(0.35, 0.55, flow);

      // Hot lava color in cracks (emissive)
      vec3 lavaColor = mix(uColors[0], uColors[1], flow);
      vec3 crustColor = mix(uColors[2], uColors[3], fbm3(sp * 2.0, 3));

      vec3 baseColor = mix(lavaColor, crustColor, crust);

      // Emissive glow from lava cracks
      float emissiveStrength = (1.0 - crust) * 1.5;

      // Lighting on crust
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.1;
      vec3 lit = baseColor * (ambient + diff * 0.6) + lavaColor * emissiveStrength;

      // Pulsing heat glow
      float pulse = sin(uTime * 0.5 + flow * 6.0) * 0.5 + 0.5;
      lit += uColors[0] * (1.0 - crust) * pulse * 0.3;

      // Rim
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
