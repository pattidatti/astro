export const HyperlaneShader = {
  vertex: /* glsl */`
    #ifdef USE_LOGDEPTHBUF
      uniform float logDepthBufFC;
    #endif
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      #ifdef USE_LOGDEPTHBUF
        gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC - 1.0;
        gl_Position.z *= gl_Position.w;
      #endif
    }
  `,
  fragment: /* glsl */`
    uniform float uTime;
    uniform vec3  uColor;
    uniform float uIntensity;

    varying vec2 vUv;

    void main() {
      // Animated energy flow along tube length (uv.x = 0→1 along tube)
      float flow = sin((vUv.x * 10.0 - uTime * 2.0) * 3.14159) * 0.5 + 0.5;
      flow = pow(flow, 3.0);

      // Fade at tube end-caps (x near 0 and 1)
      float capFade = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);

      // Tube looks best when uniformly bright — no hollow center needed
      float alpha = (0.20 + flow * 0.45) * capFade * uIntensity;

      // Brighter color with flow highlight
      vec3 color = uColor * (1.5 + flow * 1.0);

      gl_FragColor = vec4(color, alpha);
    }
  `,
};
