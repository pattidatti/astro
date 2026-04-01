import { COMMON_VERTEX, NOISE_GLSL, FRESNEL_GLSL } from '../../utils/ShaderLib.js';

export const GasShader = {
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
      // Latitude-based banding
      float lat = vPosition.y * 5.0;

      // Turbulence at band boundaries
      float turb = fbm3(vPosition * 8.0 + vec3(uTime * 0.06, 0.0, uTime * 0.02), 4);
      lat += turb * 0.5;

      // Band pattern
      float band = sin(lat) * 0.5 + 0.5;

      // Color from band position
      vec3 bandColor = mix(
        mix(uColors[0], uColors[1], band),
        mix(uColors[2], uColors[3], band),
        smoothstep(0.3, 0.7, band)
      );

      // Great spot (vortex)
      vec2 spotCenter = vec2(0.3, 0.1);
      vec3 spotRef = normalize(vec3(spotCenter.x, spotCenter.y, sqrt(max(0.0, 1.0 - dot(spotCenter, spotCenter)))));
      float spotDist = distance(normalize(vPosition), spotRef);
      float spot = smoothstep(0.2, 0.1, spotDist);
      float swirl = fbm3(vPosition * 15.0 + vec3(uTime * 0.1), 3);
      vec3 spotColor = mix(uColors[3], uColors[0], swirl);
      bandColor = mix(bandColor, spotColor, spot * 0.7);

      // Lighting
      float diff = max(dot(vNormal, uLightDir), 0.0);
      float ambient = 0.15;
      vec3 lit = bandColor * (ambient + diff * 0.75);

      // Soft atmospheric scattering
      float rim = fresnel(vViewDir, vNormal, 2.0);
      lit += uColors[1] * rim * 0.2;

      gl_FragColor = vec4(lit, 1.0);
    }
  `,
};
