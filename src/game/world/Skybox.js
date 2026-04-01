import * as THREE from 'three';
import { NOISE_GLSL } from '../utils/ShaderLib.js';

const CUBEMAP_SIZE = 512;
const TWINKLE_COUNT = 500;

/**
 * Hybrid skybox:
 * Layer 1: Procedurally generated starfield cubemap (static)
 * Layer 2: Twinkling near-stars (animated THREE.Points)
 * Layer 3: Fullscreen nebula shader quad (shifts per planet)
 */
export class Skybox {
  constructor(scene) {
    this.scene = scene;
    this._createStarCubemap();
    this._createTwinkleStars();
    this._createNebulaBackground();
    this.targetPalette = [
      new THREE.Vector3(0.02, 0.08, 0.10),
      new THREE.Vector3(0.04, 0.10, 0.20),
      new THREE.Vector3(0.06, 0.16, 0.27),
      new THREE.Vector3(0.10, 0.33, 0.47),
      new THREE.Vector3(0.13, 0.53, 0.67),
    ];
    this.targetDensity = 0.55;
  }

  _createStarCubemap() {
    const faces = [];
    for (let f = 0; f < 6; f++) {
      const canvas = document.createElement('canvas');
      canvas.width = CUBEMAP_SIZE;
      canvas.height = CUBEMAP_SIZE;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, CUBEMAP_SIZE, CUBEMAP_SIZE);

      const starCount = 400;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * CUBEMAP_SIZE;
        const y = Math.random() * CUBEMAP_SIZE;
        const brightness = 0.3 + Math.random() * 0.7;
        const size = 0.3 + Math.random() * 1.2;

        const temp = Math.random();
        let r, g, b;
        if (temp < 0.2) { r = 0.6; g = 0.7; b = 1.0; }
        else if (temp < 0.5) { r = 1.0; g = 1.0; b = 0.95; }
        else if (temp < 0.8) { r = 1.0; g = 0.9; b = 0.7; }
        else { r = 1.0; g = 0.6; b = 0.4; }

        ctx.fillStyle = `rgba(${Math.floor(r * 255)},${Math.floor(g * 255)},${Math.floor(b * 255)},${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        if (brightness > 0.7 && size > 0.8) {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
          grad.addColorStop(0, `rgba(${Math.floor(r * 255)},${Math.floor(g * 255)},${Math.floor(b * 255)},0.15)`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      faces.push(canvas);
    }

    const cubeTexture = new THREE.CubeTexture(faces);
    cubeTexture.needsUpdate = true;
    this.scene.background = cubeTexture;
  }

  _createTwinkleStars() {
    const positions = new Float32Array(TWINKLE_COUNT * 3);
    const colors = new Float32Array(TWINKLE_COUNT * 3);
    this._twinklePhases = new Float32Array(TWINKLE_COUNT);
    this._twinkleSpeeds = new Float32Array(TWINKLE_COUNT);
    this._twinkleBaseSizes = new Float32Array(TWINKLE_COUNT);

    for (let i = 0; i < TWINKLE_COUNT; i++) {
      // Spread across a large sphere
      const r = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color temperature
      const temp = Math.random();
      if (temp < 0.25) {
        colors[i * 3] = 0.65; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.55) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.98; colors[i * 3 + 2] = 0.92;
      } else if (temp < 0.8) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 0.68;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.45;
      }

      this._twinklePhases[i] = Math.random() * Math.PI * 2;
      this._twinkleSpeeds[i] = 1.0 + Math.random() * 3.0;
      this._twinkleBaseSizes[i] = 1.0 + Math.random() * 2.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this._twinkleSizeAttr = new THREE.BufferAttribute(new Float32Array(TWINKLE_COUNT), 1);
    geo.setAttribute('size', this._twinkleSizeAttr);

    this._twinkleMaterial = new THREE.PointsMaterial({
      size: 2.0,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this._twinklePoints = new THREE.Points(geo, this._twinkleMaterial);
    this._twinklePoints.renderOrder = -500;
    this.scene.add(this._twinklePoints);
  }

  _createNebulaBackground() {
    const nebulaGeo = new THREE.PlaneGeometry(2, 2);
    this.nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        ${NOISE_GLSL}

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uPalette[5];
        uniform float uDensity;
        uniform float uOpacity;

        varying vec2 vUv;

        vec3 sampleGradient(float t) {
          t = clamp(t, 0.0, 1.0) * 4.0;
          int idx = int(floor(t));
          float frac = fract(t);
          if (idx >= 4) return uPalette[4];
          return mix(uPalette[idx], uPalette[idx + 1], frac);
        }

        void main() {
          vec2 uv = vUv;
          uv.x *= uResolution.x / uResolution.y;

          // Two noise layers at different scales for more depth
          float n1 = fbm(uv * 2.5 + uTime * 0.008, 5);
          float n2 = fbm(uv * 1.2 - uTime * 0.005, 4);
          float n = n1 * 0.65 + n2 * 0.35;
          n = pow(n, 1.4);

          float d = max(0.0, n - (1.0 - uDensity)) / uDensity;

          vec3 color = sampleGradient(d * 0.85);

          // Subtle bright wisps
          float wisps = pow(fbm(uv * 4.0 + uTime * 0.012, 3), 2.5);
          color += sampleGradient(0.8) * wisps * 0.08;

          // Vignette
          float vig = 1.0 - length(vUv - 0.5) * 0.7;
          vig = clamp(vig, 0.0, 1.0);

          float alpha = d * 0.14 * vig * uOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uPalette: { value: [
          new THREE.Vector3(0.02, 0.08, 0.10),
          new THREE.Vector3(0.04, 0.10, 0.20),
          new THREE.Vector3(0.06, 0.16, 0.27),
          new THREE.Vector3(0.10, 0.33, 0.47),
          new THREE.Vector3(0.13, 0.53, 0.67),
        ]},
        uDensity: { value: 0.55 },
        uOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    this.nebulaMesh = new THREE.Mesh(nebulaGeo, this.nebulaMaterial);
    this.nebulaMesh.renderOrder = -1000;
    this.nebulaMesh.frustumCulled = false;
    this.scene.add(this.nebulaMesh);
  }

  setPlanetPalette(planetDef) {
    if (!planetDef.nebulaPalette) return;
    const { colors, density } = planetDef.nebulaPalette;
    for (let i = 0; i < 5 && i < colors.length; i++) {
      const c = new THREE.Color(colors[i]);
      this.targetPalette[i].set(c.r, c.g, c.b);
    }
    this.targetDensity = density || 0.55;
  }

  update(time) {
    this.nebulaMaterial.uniforms.uTime.value = time;

    // Smooth palette transition
    const palette = this.nebulaMaterial.uniforms.uPalette.value;
    for (let i = 0; i < 5; i++) {
      palette[i].lerp(this.targetPalette[i], 0.015);
    }
    // Smooth density transition
    const ud = this.nebulaMaterial.uniforms.uDensity;
    ud.value += (this.targetDensity - ud.value) * 0.015;

    // Twinkle stars
    const sizes = this._twinkleSizeAttr.array;
    for (let i = 0; i < TWINKLE_COUNT; i++) {
      const phase = this._twinklePhases[i];
      const speed = this._twinkleSpeeds[i];
      const base = this._twinkleBaseSizes[i];
      // Sine-based twinkle with slight randomization
      const twinkle = 0.4 + 0.6 * (Math.sin(time * speed + phase) * 0.5 + 0.5);
      sizes[i] = base * twinkle;
    }
    this._twinkleSizeAttr.needsUpdate = true;
  }

  resize(width, height) {
    this.nebulaMaterial.uniforms.uResolution.value.set(width, height);
  }
}
