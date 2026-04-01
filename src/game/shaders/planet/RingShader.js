export const RingShader = {
  vertex: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */`
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      // Radial position (0 = inner edge, 1 = outer edge)
      float r = length(vUv - 0.5) * 2.0;

      // Bell-curve opacity across ring width
      float ring = smoothstep(0.3, 0.45, r) * smoothstep(1.0, 0.85, r);

      // Gap ring in the middle
      float gap = 1.0 - smoothstep(0.58, 0.6, r) * (1.0 - smoothstep(0.62, 0.64, r));

      // Thin sub-rings
      float bands = 0.8 + 0.2 * sin(r * 60.0);

      float alpha = ring * gap * bands * uOpacity;
      if (alpha < 0.01) discard;

      gl_FragColor = vec4(uColor, alpha);
    }
  `,
};
