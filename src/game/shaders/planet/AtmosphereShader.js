import { ATMOSPHERE_VERTEX, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const AtmosphereShader = {
  vertex: ATMOSPHERE_VERTEX,
  fragment: /* glsl */`
    ${FRESNEL_GLSL}

    uniform vec3 uAtmColor;
    uniform float uAtmIntensity;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      float rim = fresnel(vViewDir, vNormal, 3.0);
      float inner = fresnel(vViewDir, vNormal, 6.0);
      // Multi-layer glow: soft outer + sharper inner
      float glow = rim * 0.7 + inner * 0.3;
      gl_FragColor = vec4(uAtmColor, glow * uAtmIntensity);
    }
  `,
};
