import { PLANETS } from '../data/planets.js';
import { HYPERLANES } from '../data/galaxyLayout.js';
import { gameState } from '../GameState.js';

const SIZE = 160;
const CENTER = SIZE / 2;
const MAX_ORBIT = 1400; // voidex orbit radius
const SCALE = (SIZE / 2 - 14) / MAX_ORBIT; // leave 14px margin from edge
const DPR = Math.min(window.devicePixelRatio || 1, 2);

export class Minimap {
  constructor({ onPlanetClick } = {}) {
    this._onPlanetClick = onPlanetClick || null;
    this._visible = true;
    this._time = 0;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'minimap-canvas';
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    document.getElementById('hud-overlay')?.appendChild(canvas);

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._ctx.scale(DPR, DPR);

    // Click handler
    canvas.addEventListener('pointerdown', (e) => this._handleClick(e));

    // Precompute planet lookup
    this._planetMap = {};
    for (const p of PLANETS) {
      this._planetMap[p.id] = p;
    }
  }

  _getPlanetPos(planet, time) {
    const { radius, speed, phase } = planet.orbit;
    const angle = phase + speed * time;
    const x = CENTER + Math.cos(angle) * radius * SCALE;
    const y = CENTER + Math.sin(angle) * radius * SCALE;
    return { x, y };
  }

  _handleClick(e) {
    const rect = this._canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closestId = null;
    let closestDist = 12; // max click distance in px

    for (const planet of PLANETS) {
      const pos = this._getPlanetPos(planet, this._time);
      const dx = mx - pos.x;
      const dy = my - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = planet.id;
      }
    }

    if (closestId && this._onPlanetClick) {
      this._onPlanetClick(closestId);
    }
  }

  update(time, cameraController) {
    this._time = time;
    const ctx = this._ctx;

    // Toggle visibility based on zoom
    const zoomLevel = cameraController.getZoomLevel();
    const shouldShow = zoomLevel === 'galaxy' || zoomLevel === 'system';
    if (shouldShow !== this._visible) {
      this._visible = shouldShow;
      this._canvas.classList.toggle('minimap-hidden', !shouldShow);
    }
    if (!shouldShow) return;

    // Clear
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Background
    ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
    ctx.beginPath();
    ctx.roundRect(0, 0, SIZE, SIZE, 8);
    ctx.fill();

    // Draw orbit rings (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (const planet of PLANETS) {
      const r = planet.orbit.radius * SCALE;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw hyperlanes
    ctx.strokeStyle = 'rgba(212, 168, 67, 0.15)';
    ctx.lineWidth = 0.8;
    for (const [fromId, toId] of HYPERLANES) {
      const fromPlanet = this._planetMap[fromId];
      const toPlanet = this._planetMap[toId];
      if (!fromPlanet || !toPlanet) continue;

      const from = this._getPlanetPos(fromPlanet, time);
      const to = this._getPlanetPos(toPlanet, time);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }

    // Draw central star
    ctx.fillStyle = '#ffdd44';
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw planets
    const owned = gameState.ownedPlanets;
    const focused = gameState.focusedPlanet;

    for (const planet of PLANETS) {
      const pos = this._getPlanetPos(planet, time);
      const isOwned = owned.includes(planet.id);
      const isFocused = planet.id === focused;
      const isUnderAttack = gameState.isUnderAttack?.(planet.id);

      const dotRadius = isOwned ? 4 : 2.5;

      // Under-attack pulsing ring
      if (isUnderAttack) {
        const pulseR = dotRadius + 3 + Math.sin(time * 4) * 2;
        ctx.strokeStyle = 'rgba(224, 85, 85, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Focused planet highlight ring
      if (isFocused) {
        ctx.strokeStyle = '#d4a843';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotRadius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet dot
      if (isOwned) {
        ctx.fillStyle = planet.col;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw camera position indicator
    const camPos = cameraController.target;
    if (camPos) {
      // Camera target is in 3D world coords — for our single-system layout
      // all planets orbit at center (0,0,0), and orbit radii map to XZ plane distance
      // We need to convert 3D camera target back to minimap coords
      const camDist = Math.sqrt(camPos.x * camPos.x + camPos.z * camPos.z);
      const camAngle = Math.atan2(camPos.z, camPos.x);
      // World coords: orbit radius 120 maps to 120 * 0.05 = 6 world units (from CoordinateMapper SCALE=0.05)
      // So world distance / 0.05 = orbit radius equivalent
      const orbitEquiv = camDist / 0.05;
      const cx = CENTER + Math.cos(camAngle) * orbitEquiv * SCALE;
      const cy = CENTER + Math.sin(camAngle) * orbitEquiv * SCALE;

      // Small crosshair
      ctx.strokeStyle = 'rgba(232, 196, 90, 0.5)';
      ctx.lineWidth = 1;
      const s = 4;
      ctx.beginPath();
      ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
      ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s);
      ctx.stroke();
    }
  }

  dispose() {
    this._canvas.remove();
  }
}
