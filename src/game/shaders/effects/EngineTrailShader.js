export const EngineTrailShader = {
  vertex: /* glsl */`
    attribute float aAge;
    varying float vAge;

    void main() {
      vAge = aAge;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = max(1.0, (1.0 - aAge) * 6.0 * (300.0 / -mvPos.z));
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragment: /* glsl */`
    uniform vec3 uColor;
    varying float vAge;

    void main() {
      // Circular point
      float dist = length(gl_PointCoord - 0.5) * 2.0;
      if (dist > 1.0) discard;

      float alpha = (1.0 - vAge) * (1.0 - dist * dist) * 0.8;
      vec3 color = uColor * (1.0 + (1.0 - vAge) * 0.5);

      gl_FragColor = vec4(color, alpha);
    }
  `,
};
