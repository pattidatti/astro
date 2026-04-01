export const HyperlaneShader = {
  vertex: /* glsl */`
    attribute float aOffset;
    varying float vOffset;
    varying vec2 vUv;

    void main() {
      vOffset = aOffset;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */`
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;

    varying float vOffset;
    varying vec2 vUv;

    void main() {
      // Animated energy flow
      float flow = sin((vUv.x * 10.0 - uTime * 2.0) * 3.14159) * 0.5 + 0.5;
      flow = pow(flow, 3.0);

      // Fade at edges
      float edge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

      float alpha = (0.15 + flow * 0.3) * edge * uIntensity;
      vec3 color = uColor * (1.0 + flow * 0.5);

      gl_FragColor = vec4(color, alpha);
    }
  `,
};
