import { generateNebulaTexture } from './NebulaRenderer.js';
import { GALAXY_SIZE } from '../data/galaxyLayout.js';

const HALF = GALAXY_SIZE / 2;

const GALAXY_PALETTE = {
  colors: ['#020810', '#0a1228', '#1a1a44', '#2a1855', '#1a3366'],
  density: 0.45,
  seed: 999,
};

// Slight palette variations per tile for organic feel
const TILE_SEEDS = [999, 1013, 1031, 1049];

/**
 * Creates the galaxy-scale background: tiled nebula + starfield.
 * All objects are added to the given scene.
 */
export default class GalaxyBackground {
  constructor(scene) {
    this.scene = scene;
    this.images = [];

    this._generateNebulaTiles();
    this._generateStarfield();
  }

  _generateNebulaTiles() {
    // 2×2 grid of 2000×2000 tiles
    const tileW = HALF;
    const tileH = HALF;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const idx = row * 2 + col;
        const key = `galaxy_neb_${idx}`;
        const palette = {
          ...GALAXY_PALETTE,
          seed: TILE_SEEDS[idx],
        };

        generateNebulaTexture(this.scene, key, tileW, tileH, palette);

        const img = this.scene.add.image(
          col * tileW + tileW / 2,
          row * tileH + tileH / 2,
          key
        ).setDepth(-20);

        this.images.push(img);
      }
    }
  }

  _generateStarfield() {
    // Split into 2×2 tiles to avoid huge canvas (4000×4000 = 64MB)
    const tileW = HALF;
    const tileH = HALF;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const idx = row * 2 + col;
        const key = `_galaxyStars_${idx}`;
        if (this.scene.textures.exists(key)) {
          this.scene.textures.remove(key);
        }

        const canvas = this.scene.textures.createCanvas(key, tileW, tileH);
        const ctx = canvas.context;

        // Background stars per tile
        const count = 750;
        for (let i = 0; i < count; i++) {
          const x = Math.random() * tileW;
          const y = Math.random() * tileH;
          const r = Math.random() * 0.6 + 0.2;
          const alpha = Math.random() * 0.45 + 0.1;

          const cRand = Math.random();
          let color;
          if (cRand < 0.6) color = `rgba(180,200,232,${alpha})`;
          else if (cRand < 0.8) color = `rgba(255,200,122,${alpha})`;
          else color = `rgba(255,255,255,${alpha})`;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }

        // Brighter accent stars
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * tileW;
          const y = Math.random() * tileH;
          const r = Math.random() * 0.8 + 0.5;
          const alpha = Math.random() * 0.3 + 0.3;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();

          // Tiny glow halo
          ctx.beginPath();
          ctx.arc(x, y, r + 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,210,240,${alpha * 0.08})`;
          ctx.fill();
        }

        canvas.refresh();

        const img = this.scene.add.image(
          col * tileW + tileW / 2,
          row * tileH + tileH / 2,
          key
        ).setDepth(-15);
        this.images.push(img);
      }
    }
  }

  destroy() {
    this.images.forEach(img => img.destroy());
    this.images = [];
  }
}
