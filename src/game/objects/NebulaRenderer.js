/**
 * Procedural nebula texture generator.
 * Uses multi-octave value noise rendered per-pixel via ImageData
 * to create rich, Stellaris-style gas cloud backgrounds.
 */

// --- Seeded hash-based noise ---

function hash2d(x, y, seed) {
  let h = seed;
  h ^= x * 374761393;
  h ^= y * 668265263;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  h = Math.imul(h, 1911520717);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296; // 0-1
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smoothstep(x - ix);
  const fy = smoothstep(y - iy);

  const v00 = hash2d(ix, iy, seed);
  const v10 = hash2d(ix + 1, iy, seed);
  const v01 = hash2d(ix, iy + 1, seed);
  const v11 = hash2d(ix + 1, iy + 1, seed);

  const top = v00 + (v10 - v00) * fx;
  const bot = v01 + (v11 - v01) * fx;
  return top + (bot - top) * fy;
}

function fbm(x, y, seed, octaves = 5) {
  let val = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    val += valueNoise(x * freq, y * freq, seed + i * 7919) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return val / max; // normalized 0-1
}

// --- Color helpers ---

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function lerpColor(c1, c2, t) {
  return {
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t,
  };
}

function sampleGradient(colors, t) {
  t = Math.max(0, Math.min(1, t));
  const n = colors.length - 1;
  const idx = t * n;
  const i = Math.min(Math.floor(idx), n - 1);
  const frac = idx - i;
  return lerpColor(colors[i], colors[i + 1], frac);
}

// --- Main generator ---

/**
 * Generate a nebula CanvasTexture for a given planet palette.
 * @param {Phaser.Scene} scene
 * @param {string} key - texture key
 * @param {number} width
 * @param {number} height
 * @param {object} palette - { colors: ['#hex',...], density, seed }
 * @returns {string} texture key
 */
export function generateNebulaTexture(scene, key, width, height, palette) {
  if (scene.textures.exists(key)) return key;

  const canvas = scene.textures.createCanvas(key, width, height);
  const ctx = canvas.context;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const colors = palette.colors.map(hexToRgb);
  const seed = palette.seed || 42;
  const density = palette.density || 0.6;

  // We'll composite 3 noise layers with different scales and color ranges
  const layers = [
    { scale: 0.0015, octaves: 5, amp: 0.55, offset: 0 },        // large-scale base clouds
    { scale: 0.004,  octaves: 4, amp: 0.35, offset: 1000 },      // medium wisps
    { scale: 0.009,  octaves: 3, amp: 0.20, offset: 2000 },       // fine dust detail
  ];

  // Vignette center and radius for soft falloff
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      let totalR = 0, totalG = 0, totalB = 0, totalA = 0;

      for (const layer of layers) {
        const nx = (px + layer.offset) * layer.scale;
        const ny = (py + layer.offset) * layer.scale;

        // Get noise value — use different seed per layer
        let n = fbm(nx, ny, seed + layer.offset, layer.octaves);

        // Shape the noise: push toward extremes for cloudier look
        n = Math.pow(n, 1.3);

        // Apply density threshold — lower values create more sparse clouds
        n = Math.max(0, n - (1 - density)) / density;
        n = Math.min(1, n);

        // Sample color from gradient based on noise value
        const col = sampleGradient(colors, n * 0.8);

        // Alpha based on noise and layer amplitude
        const alpha = n * layer.amp;

        // Accumulate (premultiplied alpha compositing)
        totalR += col.r * alpha;
        totalG += col.g * alpha;
        totalB += col.b * alpha;
        totalA += alpha;
      }

      // Soft vignette — fade out near edges
      const dx = (px - cx) / cx;
      const dy = (py - cy) / cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const vignette = 1 - smoothstep(Math.max(0, Math.min(1, (dist - 0.5) / 0.5)));

      // Global alpha scale — keep nebula subtle (not overwhelming)
      const globalScale = 0.18 * vignette;

      const idx = (py * width + px) * 4;
      data[idx]     = Math.min(255, totalR * globalScale);
      data[idx + 1] = Math.min(255, totalG * globalScale);
      data[idx + 2] = Math.min(255, totalB * globalScale);
      data[idx + 3] = Math.min(255, totalA * globalScale * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  canvas.refresh();
  return key;
}

/**
 * Generate nebula for a specific planet.
 * @param {Phaser.Scene} scene
 * @param {object} planetDef - planet definition from planets.js (must have nebulaPalette)
 * @param {number} viewWidth - viewport width
 * @param {number} viewHeight - viewport height
 * @returns {string} texture key
 */
export function generatePlanetNebula(scene, planetDef, viewWidth, viewHeight) {
  const key = `nebula_${planetDef.id}`;
  // Generate at 2x viewport for pan room, but cap at reasonable size
  const w = Math.min(Math.round(viewWidth * 2), 3840);
  const h = Math.min(Math.round(viewHeight * 2), 2160);
  return generateNebulaTexture(scene, key, w, h, planetDef.nebulaPalette);
}
