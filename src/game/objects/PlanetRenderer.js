import { PLANET_COLORS } from '../data/planets.js';

/**
 * Generates a CanvasTexture for a planet using raw Canvas 2D API.
 * Called once per planet type during boot; the texture is then cached by Phaser.
 */
export function generatePlanetTexture(scene, planetDef, size) {
  const key = `planet_${planetDef.id}`;
  if (scene.textures.exists(key)) return key;

  const s = size * 2; // double for retina
  const canvas = scene.textures.createCanvas(key, s, s);
  const ctx = canvas.context;
  const R = s * 0.45;
  const cx = s / 2;
  const cy = s / 2;

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  // Base radial gradient
  const cols = PLANET_COLORS[planetDef.type] || PLANET_COLORS.terr;
  const bg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.01, cx, cy, R);
  cols.forEach((c, i) => bg.addColorStop(i / 3, c));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, s, s);

  // Surface bands
  ctx.globalAlpha = 0.09;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)';
    ctx.fillRect(cx - R, cy - R + (R * 2 / 5.5) * i + Math.sin(i * 1.3) * 6, R * 2, 10 + Math.sin(i * 2.1) * 3);
  }

  // Type-specific surface effects
  ctx.globalAlpha = 0.2;
  drawSurfaceEffects(ctx, planetDef.type, cx, cy, R);

  // Clouds
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 5; i++) {
    const a = 0.3 + i * (Math.PI * 2 / 5);
    const ex = cx + Math.cos(a) * R * 0.52;
    const ey = cy + Math.sin(a) * R * 0.2;
    const cg = ctx.createRadialGradient(ex, ey, 0, ex, ey, R * 0.28);
    cg.addColorStop(0, 'rgba(255,255,255,.55)');
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(ex, ey, R * 0.3, R * 0.1, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Specular highlight
  const sp = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.4, 0, cx - R * 0.18, cy - R * 0.2, R * 0.72);
  sp.addColorStop(0, 'rgba(255,255,255,.26)');
  sp.addColorStop(0.25, 'rgba(255,255,255,.08)');
  sp.addColorStop(1, 'transparent');
  ctx.fillStyle = sp;
  ctx.fillRect(0, 0, s, s);

  // Shadow terminator (softer for better visibility)
  const sh = ctx.createRadialGradient(cx + R * 0.55, cy + R * 0.15, 0, cx + R * 0.55, cy + R * 0.15, R * 1.4);
  sh.addColorStop(0, 'transparent');
  sh.addColorStop(0.45, 'transparent');
  sh.addColorStop(1, 'rgba(0,0,8,.65)');
  ctx.fillStyle = sh;
  ctx.fillRect(0, 0, s, s);

  ctx.restore();

  // Atmosphere rim glow (outside clip)
  const atm = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.18);
  atm.addColorStop(0, planetDef.glow + '00');
  atm.addColorStop(0.3, planetDef.glow + '99');
  atm.addColorStop(1, planetDef.glow + '00');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
  ctx.strokeStyle = atm;
  ctx.lineWidth = R * 0.18;
  ctx.stroke();

  // Outer halo (stronger glow)
  const ah = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.45);
  ah.addColorStop(0, planetDef.glow + '30');
  ah.addColorStop(0.5, planetDef.glow + '12');
  ah.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2);
  ctx.fillStyle = ah;
  ctx.fill();

  canvas.refresh();
  return key;
}

function drawSurfaceEffects(ctx, type, cx, cy, R) {
  if (type === 'lava') {
    for (let i = 0; i < 8; i++) {
      const a = 0.5 + i * (Math.PI / 4);
      ctx.strokeStyle = `rgba(255,${Math.floor(150 + Math.sin(i) * 50)},0,.7)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const px = cx + Math.cos(a) * R * 0.1;
      const py = cy + Math.sin(a) * R * 0.1;
      ctx.moveTo(px, py);
      ctx.bezierCurveTo(
        px + Math.cos(a + 0.5) * R * 0.3, py + Math.sin(a + 0.5) * R * 0.3,
        px + Math.cos(a - 0.2) * R * 0.5, py + Math.sin(a - 0.2) * R * 0.5,
        cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82
      );
      ctx.stroke();
    }
  }

  if (type === 'cryst') {
    for (let i = 0; i < 10; i++) {
      const a = 0.2 + i * (Math.PI * 2 / 10);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(i) * 0.15})`;
      ctx.beginPath();
      const px = cx + Math.cos(a) * R * 0.5;
      const py = cy + Math.sin(a) * R * 0.5;
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(a + 0.4) * R * 0.3, py + Math.sin(a + 0.4) * R * 0.3);
      ctx.lineTo(cx + Math.cos(a + 0.2) * R * 0.15, cy + Math.sin(a + 0.2) * R * 0.15);
      ctx.fill();
    }
  }

  if (type === 'void') {
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let a = 0.1; a < Math.PI * 5; a += 0.05) {
        const sr = a * R * 0.052 + i * R * 0.12;
        if (sr > R) break;
        ctx.lineTo(cx + Math.cos(a + i * 2.1) * sr, cy + Math.sin(a + i * 2.1) * sr);
      }
      ctx.strokeStyle = `rgba(${180 + i * 20},${50 + i * 30},255,.6)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  if (type === 'star') {
    for (let i = 0; i < 6; i++) {
      const a = i * (Math.PI / 3);
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = 'rgba(255,250,200,.6)';
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * R * 0.45, cy + Math.sin(a) * R * 0.45, R * 0.2, R * 0.07, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'ice') {
    ctx.globalAlpha = 0.13;
    for (let i = 0; i < 6; i++) {
      const a = i * (Math.PI / 3);
      ctx.strokeStyle = 'rgba(180,240,255,.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R * 0.92, cy + Math.sin(a) * R * 0.92);
      ctx.stroke();
    }
  }

  if (type === 'neb') {
    for (let i = 0; i < 5; i++) {
      const a = 0.3 + i * (Math.PI * 2 / 5);
      ctx.globalAlpha = 0.15;
      const ng = ctx.createRadialGradient(
        cx + Math.cos(a) * R * 0.4, cy + Math.sin(a) * R * 0.4, 0,
        cx + Math.cos(a) * R * 0.4, cy + Math.sin(a) * R * 0.4, R * 0.3
      );
      ng.addColorStop(0, 'rgba(255,100,200,.5)');
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * R * 0.4, cy + Math.sin(a) * R * 0.4, R * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (type === 'gas') {
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,200,50,.3)' : 'rgba(200,100,0,.25)';
      const bandY = cy - R + (R * 2 / 8) * i;
      ctx.fillRect(cx - R, bandY + Math.sin(i * 1.7) * 4, R * 2, 8 + Math.sin(i * 2.3) * 4);
    }
  }
}

/**
 * Draw planetary rings for gas/star/void types (called each frame on the Graphics object).
 */
export function drawPlanetRings(graphics, planetDef, cx, cy, R, time) {
  if (!['gas', 'star', 'void'].includes(planetDef.type)) return;
  const color = Phaser.Display.Color.HexStringToColor(planetDef.glow);
  for (let i = 0; i < 4; i++) {
    const rr = R * (1.4 + i * 0.19);
    const alpha = 0.25 - i * 0.04;
    graphics.lineStyle(13 - i * 2, color.color, alpha);
    graphics.beginPath();
    // Draw ellipse for ring tilt
    const steps = 64;
    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      const rx = cx + Math.cos(a) * rr;
      const ry = cy + Math.sin(a) * rr * 0.19;
      if (s === 0) graphics.moveTo(rx, ry);
      else graphics.lineTo(rx, ry);
    }
    graphics.strokePath();
  }
}
