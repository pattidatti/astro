/** Shared GLSL code snippets used across planet and effect shaders */

export const NOISE_GLSL = /* glsl */`
  // Hash-based pseudo-random
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float hash31(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  // Smooth value noise 2D
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Smooth value noise 3D
  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i);
    float n100 = hash31(i + vec3(1,0,0));
    float n010 = hash31(i + vec3(0,1,0));
    float n110 = hash31(i + vec3(1,1,0));
    float n001 = hash31(i + vec3(0,0,1));
    float n101 = hash31(i + vec3(1,0,1));
    float n011 = hash31(i + vec3(0,1,1));
    float n111 = hash31(i + vec3(1,1,1));
    float n00 = mix(n000, n100, f.x);
    float n10 = mix(n010, n110, f.x);
    float n01 = mix(n001, n101, f.x);
    float n11 = mix(n011, n111, f.x);
    float n0 = mix(n00, n10, f.y);
    float n1 = mix(n01, n11, f.y);
    return mix(n0, n1, f.z);
  }

  // Fractal Brownian Motion (2D)
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amp * vnoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  // Fractal Brownian Motion (3D)
  float fbm3(vec3 p, int octaves) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amp * vnoise3(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return value;
  }
`;

export const FRESNEL_GLSL = /* glsl */`
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
  }
`;

export const COMMON_VERTEX = /* glsl */`
  #ifdef USE_LOGDEPTHBUF
    uniform float logDepthBufFC;
  #endif

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #ifdef USE_LOGDEPTHBUF
      gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC - 1.0;
      gl_Position.z *= gl_Position.w;
    #endif
  }
`;

export const ATMOSPHERE_VERTEX = /* glsl */`
  #ifdef USE_LOGDEPTHBUF
    uniform float logDepthBufFC;
  #endif

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #ifdef USE_LOGDEPTHBUF
      gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC - 1.0;
      gl_Position.z *= gl_Position.w;
    #endif
  }
`;
