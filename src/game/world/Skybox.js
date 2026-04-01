import * as THREE from 'three';
import { NOISE_GLSL } from '../utils/ShaderLib.js';

const CUBEMAP_SIZE = 2048;
const STARS_PER_FACE = 2000;
const TWINKLE_COUNT = 2000;

/**
 * Hybrid skybox — 3 layers:
 * Layer 1: High-res procedural starfield cubemap with diffraction spikes
 * Layer 2: 2000 twinkling near-stars with custom ShaderMaterial (gaussian halos)
 * Layer 3: Domain-warped 3-channel nebula shader with Milky Way band + emission hotspots
 */
export class Skybox {
  constructor(scene) {
    this.scene = scene;
    this._createStarCubemap();
    this._createTwinkleStars();
    this._createNebulaBackground();

    // Target nebula colors (lerped toward on planet change)
    this._targetNeb1 = new THREE.Vector3(0.18, 0.05, 0.40); // deep purple
    this._targetNeb2 = new THREE.Vector3(0.65, 0.35, 0.08); // orange/gold
    this._targetNeb3 = new THREE.Vector3(0.05, 0.45, 0.55); // teal/cyan
    this._targetMilkyWay = 0.55;

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

      for (let i = 0; i < STARS_PER_FACE; i++) {
        const x = Math.random() * CUBEMAP_SIZE;
        const y = Math.random() * CUBEMAP_SIZE;
        const brightness = 0.3 + Math.random() * 0.7;
        const size = 0.3 + Math.random() * 3.7; // up to 4px (was 1.5px)

        // Stellar temperature → color
        const temp = Math.random();
        let r, g, b;
        if (temp < 0.15) { r = 0.55; g = 0.65; b = 1.0; }       // blue giant
        else if (temp < 0.35) { r = 0.75; g = 0.82; b = 1.0; }  // blue-white
        else if (temp < 0.60) { r = 1.0; g = 1.0; b = 0.95; }   // white
        else if (temp < 0.80) { r = 1.0; g = 0.90; b = 0.70; }  // yellow
        else { r = 1.0; g = 0.60; b = 0.40; }                     // orange/red

        // Star core
        ctx.fillStyle = `rgba(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)},${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo for bright stars
        if (brightness > 0.55 && size > 0.8) {
          const haloR = size * 4;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, haloR);
          grad.addColorStop(0, `rgba(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)},${brightness * 0.18})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Diffraction spikes for 5% of bright large stars
        if (Math.random() < 0.05 && brightness > 0.65 && size > 1.2) {
          const spikeLen = size * 18;
          ctx.save();
          for (let k = 0; k < 4; k++) {
            const angle = (k / 4) * Math.PI; // 0, 45, 90, 135 degrees
            const cx = Math.cos(angle);
            const cy = Math.sin(angle);

            // Draw spike in both directions
            const spikeAlpha = brightness * 0.3;
            const grad1 = ctx.createLinearGradient(x, y, x + cx * spikeLen, y + cy * spikeLen);
            grad1.addColorStop(0, `rgba(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)},${spikeAlpha})`);
            grad1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = grad1;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cx * spikeLen, y + cy * spikeLen);
            ctx.stroke();

            const grad2 = ctx.createLinearGradient(x, y, x - cx * spikeLen, y - cy * spikeLen);
            grad2.addColorStop(0, `rgba(${Math.floor(r*255)},${Math.floor(g*255)},${Math.floor(b*255)},${spikeAlpha})`);
            grad2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.strokeStyle = grad2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - cx * spikeLen, y - cy * spikeLen);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      faces.push(canvas);
    }

    const cubeTexture = new THREE.CubeTexture(faces);
    cubeTexture.colorSpace = THREE.SRGBColorSpace;
    cubeTexture.needsUpdate = true;
    this.scene.background = cubeTexture;
  }

  _createTwinkleStars() {
    const positions   = new Float32Array(TWINKLE_COUNT * 3);
    const colors      = new Float32Array(TWINKLE_COUNT * 3);
    const glowFactors = new Float32Array(TWINKLE_COUNT);

    this._twinklePhases    = new Float32Array(TWINKLE_COUNT);
    this._twinkleSpeeds    = new Float32Array(TWINKLE_COUNT);
    this._twinkleBaseSizes = new Float32Array(TWINKLE_COUNT);

    for (let i = 0; i < TWINKLE_COUNT; i++) {
      const r = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color temperature distribution
      const temp = Math.random();
      if (temp < 0.20) {
        colors[i*3] = 0.60; colors[i*3+1] = 0.72; colors[i*3+2] = 1.0;   // blue
      } else if (temp < 0.45) {
        colors[i*3] = 0.85; colors[i*3+1] = 0.92; colors[i*3+2] = 1.0;   // blue-white
      } else if (temp < 0.70) {
        colors[i*3] = 1.0;  colors[i*3+1] = 0.98; colors[i*3+2] = 0.92;  // white
      } else if (temp < 0.88) {
        colors[i*3] = 1.0;  colors[i*3+1] = 0.88; colors[i*3+2] = 0.68;  // yellow
      } else {
        colors[i*3] = 1.0;  colors[i*3+1] = 0.65; colors[i*3+2] = 0.45;  // orange/red
      }

      // 10% super-bright stars get a large glow halo
      glowFactors[i] = Math.random() < 0.10 ? 3.0 : 1.0;

      this._twinklePhases[i]    = Math.random() * Math.PI * 2;
      this._twinkleSpeeds[i]    = 1.0 + Math.random() * 3.0;
      this._twinkleBaseSizes[i] = 1.0 + Math.random() * 2.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',   new THREE.BufferAttribute(positions,   3));
    geo.setAttribute('color',      new THREE.BufferAttribute(colors,      3));
    geo.setAttribute('aGlowFactor',new THREE.BufferAttribute(glowFactors, 1));

    this._twinkleSizeAttr = new THREE.BufferAttribute(new Float32Array(TWINKLE_COUNT), 1);
    geo.setAttribute('size', this._twinkleSizeAttr);

    // Custom ShaderMaterial: gaussian soft-circle core + glow halo
    this._twinkleMaterial = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        attribute float size;
        attribute float aGlowFactor;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          vColor = color;
          vGlow  = aGlowFactor;
          vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * aGlowFactor * (300.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          vec2 uv   = gl_PointCoord - 0.5;
          float dist = length(uv);

          // Soft-circle core
          float core = smoothstep(0.5, 0.08, dist);
          // Gaussian glow halo — larger for super-bright stars
          float halo = exp(-dist * dist * 8.0) * vGlow * 0.45;

          float alpha = clamp(core + halo, 0.0, 1.0) * 0.88;
          if (alpha < 0.01) discard;

          // Halo tinted slightly blue for lens-effect
          vec3 col = vColor + vec3(0.0, 0.05, 0.12) * halo;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
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
        uniform vec2  uResolution;
        uniform float uDensity;
        uniform float uOpacity;

        // Three-channel nebula colors
        uniform vec3 uNebulaColor1;   // deep purple/blue
        uniform vec3 uNebulaColor2;   // orange/gold
        uniform vec3 uNebulaColor3;   // teal/cyan
        uniform float uMilkyWayStrength;

        varying vec2 vUv;

        // Domain-warped FBM: q offsets uv by an fbm field before sampling
        float warpedFbm(vec2 uv, float warpScale, int oct) {
          vec2 q = vec2(
            fbm(uv,                       oct),
            fbm(uv + vec2(5.2, 1.3),      oct)
          );
          return fbm(uv + q * warpScale, oct);
        }

        void main() {
          vec2 uv = vUv;
          uv.x *= uResolution.x / uResolution.y;
          float t = uTime * 0.004; // very slow drift

          // Channel 1 — deep purple/blue structure (dominant large forms)
          float n1 = warpedFbm(uv * 1.8 + t, 1.8, 6);
          n1 = pow(max(0.0, n1 - (1.0 - uDensity)), 1.3);

          // Channel 2 — orange/gold wisps (medium-scale filaments)
          float n2 = warpedFbm(uv * 2.4 - t * 0.7 + vec2(3.1, 1.7), 1.4, 5);
          n2 = pow(max(0.0, n2 - 0.45), 1.6);

          // Channel 3 — teal/cyan tendrils (fine detail)
          float n3 = warpedFbm(uv * 3.1 + t * 0.5 + vec2(7.3, 4.1), 1.2, 4);
          n3 = pow(max(0.0, n3 - 0.50), 1.8);

          vec3 nebColor = uNebulaColor1 * n1
                        + uNebulaColor2 * n2 * 0.7
                        + uNebulaColor3 * n3 * 0.5;
          float totalDensity = n1 + n2 * 0.6 + n3 * 0.4;

          // Milky Way band — gaussian strip with structured noise inside
          float bandY    = (vUv.y - 0.45) * 3.5;
          float mwBand   = exp(-bandY * bandY);
          float mwNoise  = fbm(vec2(uv.x * 4.0 + t * 0.3, uv.y * 8.0), 4);
          float mwDensity = mwBand * mwNoise * uMilkyWayStrength;
          nebColor     += vec3(0.60, 0.65, 0.85) * mwDensity;
          totalDensity += mwDensity * 0.5;

          // Bright emission hotspots (5 scattered nebula cores)
          vec2 p = vUv;
          float h = 0.0;
          h += exp(-dot(p - vec2(0.25,0.60), p - vec2(0.25,0.60)) * 25.0) * 0.5;
          h += exp(-dot(p - vec2(0.75,0.40), p - vec2(0.75,0.40)) * 25.0) * 0.5;
          h += exp(-dot(p - vec2(0.50,0.25), p - vec2(0.50,0.25)) * 25.0) * 0.4;
          h += exp(-dot(p - vec2(0.15,0.35), p - vec2(0.15,0.35)) * 25.0) * 0.3;
          h += exp(-dot(p - vec2(0.85,0.70), p - vec2(0.85,0.70)) * 25.0) * 0.3;
          nebColor += (uNebulaColor1 * 1.5 + vec3(0.3)) * h;

          // Vignette
          float vig = 1.0 - length(vUv - 0.5) * 0.65;
          vig = clamp(vig, 0.0, 1.0);

          float alpha = clamp(totalDensity * 0.35, 0.0, 0.35) * vig * uOpacity;
          if (alpha < 0.003) discard;

          gl_FragColor = vec4(nebColor, alpha);
        }
      `,
      uniforms: {
        uTime:             { value: 0 },
        uResolution:       { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uDensity:          { value: 0.55 },
        uOpacity:          { value: 1.0 },
        uNebulaColor1:     { value: new THREE.Vector3(0.18, 0.05, 0.40) },
        uNebulaColor2:     { value: new THREE.Vector3(0.65, 0.35, 0.08) },
        uNebulaColor3:     { value: new THREE.Vector3(0.05, 0.45, 0.55) },
        uMilkyWayStrength: { value: 0.55 },
      },
      transparent: true,
      depthWrite:  false,
      depthTest:   false,
      blending:    THREE.AdditiveBlending,
    });

    this.nebulaMesh = new THREE.Mesh(nebulaGeo, this.nebulaMaterial);
    this.nebulaMesh.renderOrder = -1000;
    this.nebulaMesh.frustumCulled = false;
    this.scene.add(this.nebulaMesh);
  }

  /**
   * Shift nebula palette to match the focused planet.
   * @param {object} planetDef
   */
  setPlanetPalette(planetDef) {
    if (!planetDef?.nebulaPalette) return;
    const { colors, density } = planetDef.nebulaPalette;

    // Map nebula palette colors to the 3 channel targets
    if (colors[0]) {
      const c = new THREE.Color(colors[0]);
      this._targetNeb1.set(c.r * 0.7, c.g * 0.4, c.b);
    }
    if (colors[2]) {
      const c = new THREE.Color(colors[2]);
      // Shift toward warm if planet is warm-toned, cool otherwise
      this._targetNeb2.set(
        c.r + 0.15,
        c.g * 0.8,
        c.b * 0.3
      );
    }
    if (colors[4]) {
      const c = new THREE.Color(colors[4]);
      this._targetNeb3.set(c.r * 0.2, c.g * 0.6 + 0.2, c.b * 0.8 + 0.1);
    }

    this.targetDensity = density || 0.55;
    this._targetMilkyWay = 0.40 + Math.random() * 0.25;
  }

  update(time) {
    const u = this.nebulaMaterial.uniforms;
    u.uTime.value = time;

    // Smooth nebula color channel transitions
    const lerpSpeed = 0.012;
    u.uNebulaColor1.value.lerp(this._targetNeb1, lerpSpeed);
    u.uNebulaColor2.value.lerp(this._targetNeb2, lerpSpeed);
    u.uNebulaColor3.value.lerp(this._targetNeb3, lerpSpeed);

    // Density transition
    u.uDensity.value += (this.targetDensity - u.uDensity.value) * lerpSpeed;

    // Milky Way strength transition
    u.uMilkyWayStrength.value += (this._targetMilkyWay - u.uMilkyWayStrength.value) * lerpSpeed;

    // Animate twinkling star sizes
    const sizes = this._twinkleSizeAttr.array;
    for (let i = 0; i < TWINKLE_COUNT; i++) {
      const twinkle = 0.4 + 0.6 * (Math.sin(time * this._twinkleSpeeds[i] + this._twinklePhases[i]) * 0.5 + 0.5);
      sizes[i] = this._twinkleBaseSizes[i] * twinkle;
    }
    this._twinkleSizeAttr.needsUpdate = true;
  }

  resize(width, height) {
    this.nebulaMaterial.uniforms.uResolution.value.set(width, height);
  }
}
