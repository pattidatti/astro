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
    this._targetNeb1 = new THREE.Vector3(0.50, 0.08, 0.85); // vivid purple
    this._targetNeb2 = new THREE.Vector3(0.90, 0.45, 0.08); // bright amber
    this._targetNeb3 = new THREE.Vector3(0.08, 0.70, 0.80); // bright teal
    this._targetMilkyWay = 0.70;

    // Current (lerp base) — separert fra uniform slik at oscillasjon kan legges på toppen
    this._currentNeb1 = this._targetNeb1.clone();
    this._currentNeb2 = this._targetNeb2.clone();
    this._currentNeb3 = this._targetNeb3.clone();

    // For syklering av emisjonsfargen (4. kanal)
    this._emitColor = new THREE.Color();

    this.targetDensity = 0.75;
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
        varying vec3 vWorldDir;
        uniform mat4 uCameraMatrixWorld;
        uniform mat4 uProjectionMatrixInverse;

        void main() {
          vUv = uv;
          // Reconstruct world-space view ray so nebula moves with camera
          vec4 view = uProjectionMatrixInverse * vec4(position.xy, 1.0, 1.0);
          view.xyz /= view.w;
          view.w = 0.0; // direction, not position — strips translation
          vWorldDir = normalize((uCameraMatrixWorld * view).xyz);
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        ${NOISE_GLSL}

        uniform float uTime;
        uniform vec2  uResolution;
        uniform float uDensity;
        uniform float uOpacity;

        // Nebula color channels
        uniform vec3 uNebulaColor1;
        uniform vec3 uNebulaColor2;
        uniform vec3 uNebulaColor3;
        uniform vec3 uNebulaColor4; // skiftende emisjonsfilamenter
        uniform float uMilkyWayStrength;

        varying vec2 vUv;
        varying vec3 vWorldDir;

        // 3D domain-warped FBM — no seams, works directly on world direction
        float warpedFbm3(vec3 p, float warpScale, int oct) {
          vec3 q = vec3(
            fbm3(p,                           oct),
            fbm3(p + vec3(5.2, 1.3, 2.7),    oct),
            fbm3(p + vec3(1.7, 9.2, 4.5),    oct)
          );
          return fbm3(p + q * warpScale, oct);
        }

        void main() {
          vec3 dir = normalize(vWorldDir);
          float t  = uTime * 0.004;

          // Channel 1 — large dominant forms
          float n1 = warpedFbm3(dir * 0.55 + vec3(t, 0.0, t * 0.5), 1.8, 6);
          n1 = max(0.0, n1 - 0.12) * uDensity * 1.8;

          // Channel 2 — medium wisps
          float n2 = warpedFbm3(dir * 0.90 + vec3(3.1, 1.7, 0.9) - vec3(t * 0.7, 0.0, 0.0), 1.4, 5);
          n2 = pow(max(0.0, n2 - 0.22), 1.3);

          // Channel 3 — fine tendrils
          float n3 = warpedFbm3(dir * 1.50 + vec3(7.3, 4.1, 2.5) + vec3(t * 0.5, 0.0, 0.0), 1.2, 4);
          n3 = pow(max(0.0, n3 - 0.22), 1.4);

          // Channel 4 — sparse emission filaments (skifter farge over tid via uniform)
          float n4 = fbm3(dir * 2.5 + vec3(11.3, 7.8, 3.1) + vec3(t * 0.35, 0.0, 0.0), 3);
          n4 = pow(max(0.0, n4 - 0.42), 2.8);

          vec3 nebColor = uNebulaColor1 * n1
                        + uNebulaColor2 * n2 * 0.85
                        + uNebulaColor3 * n3 * 0.65
                        + uNebulaColor4 * n4 * 0.90;
          float totalDensity = n1 + n2 * 0.7 + n3 * 0.5 + n4 * 0.35;

          // Milky Way band — gaussian strip along world Y=0, noise along it
          float mwBand    = exp(-dir.y * dir.y * 12.0);
          float mwNoise   = fbm3(dir * 2.0 + vec3(t * 0.3, 0.0, 0.0), 4);
          float mwDensity = mwBand * mwNoise * uMilkyWayStrength;
          nebColor     += vec3(0.60, 0.65, 0.85) * mwDensity;
          totalDensity += mwDensity * 0.5;

          // Emission hotspots — angular distance in 3D, zero seams
          float h = 0.0;
          h += exp(-(1.0 - dot(dir, normalize(vec3(-0.8,  0.4,  0.5)))) * 18.0) * 0.5;
          h += exp(-(1.0 - dot(dir, normalize(vec3( 0.9, -0.2,  0.4)))) * 18.0) * 0.5;
          h += exp(-(1.0 - dot(dir, normalize(vec3( 0.1,  0.9,  0.3)))) * 15.0) * 0.4;
          h += exp(-(1.0 - dot(dir, normalize(vec3(-0.7, -0.5, -0.6)))) * 15.0) * 0.3;
          h += exp(-(1.0 - dot(dir, normalize(vec3( 0.6,  0.5, -0.8)))) * 15.0) * 0.3;
          nebColor += (uNebulaColor1 * 1.5 + vec3(0.3)) * h;

          float alpha = clamp(totalDensity * 0.45, 0.0, 0.55) * uOpacity;
          if (alpha < 0.003) discard;

          gl_FragColor = vec4(nebColor, alpha);
        }
      `,
      uniforms: {
        uTime:                    { value: 0 },
        uResolution:              { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uCameraMatrixWorld:       { value: new THREE.Matrix4() },
        uProjectionMatrixInverse: { value: new THREE.Matrix4() },
        uDensity:                 { value: 0.75 },
        uOpacity:          { value: 1.0 },
        uNebulaColor1:     { value: new THREE.Vector3(0.50, 0.08, 0.85) },
        uNebulaColor2:     { value: new THREE.Vector3(0.90, 0.45, 0.08) },
        uNebulaColor3:     { value: new THREE.Vector3(0.08, 0.70, 0.80) },
        uNebulaColor4:     { value: new THREE.Vector3(0.95, 0.15, 0.65) }, // shifting emission filaments
        uMilkyWayStrength: { value: 0.70 },
      },
      transparent: false,
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

    // Use the brighter palette entries (index 3 & 4) and boost them significantly
    // so the nebula is vivid and saturated like the planet's visual identity
    const boost = (hex, mult, bias = 0) => {
      const c = new THREE.Color(hex);
      return [
        Math.min(c.r * mult + bias, 1.0),
        Math.min(c.g * mult + bias, 1.0),
        Math.min(c.b * mult + bias, 1.0),
      ];
    };

    if (colors[4]) this._targetNeb1.set(...boost(colors[4], 2.5, 0.05));
    if (colors[3]) this._targetNeb2.set(...boost(colors[3], 3.0, 0.12));
    if (colors[2]) this._targetNeb3.set(...boost(colors[2], 2.2, 0.10));

    this.targetDensity = Math.max(density || 0.75, 0.55);
    this._targetMilkyWay = 0.55 + Math.random() * 0.25;
  }

  update(time, camera) {
    const u = this.nebulaMaterial.uniforms;
    u.uTime.value = time;
    if (camera) {
      u.uCameraMatrixWorld.value.copy(camera.matrixWorld);
      u.uProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
    }

    // Smooth nebula color channel transitions — lerp internt, oscillasjon på toppen
    const lerpSpeed = 0.012;
    this._currentNeb1.lerp(this._targetNeb1, lerpSpeed);
    this._currentNeb2.lerp(this._targetNeb2, lerpSpeed);
    this._currentNeb3.lerp(this._targetNeb3, lerpSpeed);

    // Uavhengig oscillasjon per RGB-kanal → organisk levende fargeskift
    const t = time;
    u.uNebulaColor1.value.set(
      this._currentNeb1.x * (0.82 + 0.18 * Math.sin(t * 0.045)),
      this._currentNeb1.y * (0.78 + 0.22 * Math.sin(t * 0.038 + 1.4)),
      this._currentNeb1.z * (0.75 + 0.25 * Math.sin(t * 0.031 + 2.8))
    );
    u.uNebulaColor2.value.set(
      this._currentNeb2.x * (0.80 + 0.20 * Math.sin(t * 0.028 + 0.7)),
      this._currentNeb2.y * (0.83 + 0.17 * Math.sin(t * 0.052 + 3.1)),
      this._currentNeb2.z * (0.85 + 0.15 * Math.sin(t * 0.041 + 1.9))
    );
    u.uNebulaColor3.value.set(
      this._currentNeb3.x * (0.78 + 0.22 * Math.sin(t * 0.061 + 2.3)),
      this._currentNeb3.y * (0.80 + 0.20 * Math.sin(t * 0.034 + 0.5)),
      this._currentNeb3.z * (0.82 + 0.18 * Math.sin(t * 0.047 + 4.1))
    );

    // Emisjonskanal sykler sakte gjennom HII/OIII/SII-farger (pink → teal → gull)
    this._emitColor.setHSL((t * 0.006) % 1.0, 0.95, 0.65);
    u.uNebulaColor4.value.set(this._emitColor.r, this._emitColor.g, this._emitColor.b);

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
