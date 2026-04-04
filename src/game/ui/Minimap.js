import { PLANETS } from '../data/planets.js';
import { HYPERLANES, FREE_FLOATING_BASES } from '../data/galaxyLayout.js';
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
    this._cameraController = null;
    this._galaxy = null;  // Set by Game.js
    this._mapZoom = 1.0; // 1 = full galaxy view

    // Create canvas wrapper (for absolute-positioned zoom buttons)
    const wrapper = document.createElement('div');
    wrapper.className = 'minimap-wrapper';
    document.getElementById('top-left-hud')?.appendChild(wrapper);

    const canvas = document.createElement('canvas');
    canvas.id = 'minimap-canvas';
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    wrapper.appendChild(canvas);

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._ctx.scale(DPR, DPR);

    // Click handler
    canvas.addEventListener('pointerdown', (e) => this._handleClick(e));

    // Zoom controls (overlaid bottom-right of canvas)
    const controls = document.createElement('div');
    controls.className = 'minimap-zoom-controls';
    const btnIn = document.createElement('button');
    btnIn.className = 'minimap-zoom-btn';
    btnIn.textContent = '+';
    btnIn.title = 'Zoom inn';
    btnIn.addEventListener('click', () => {
      this._mapZoom = Math.min(4, this._mapZoom * 1.5);
    });
    const btnOut = document.createElement('button');
    btnOut.className = 'minimap-zoom-btn';
    btnOut.textContent = '−';
    btnOut.title = 'Zoom ut';
    btnOut.addEventListener('click', () => {
      this._mapZoom = Math.max(0.5, this._mapZoom / 1.5);
    });
    controls.appendChild(btnIn);
    controls.appendChild(btnOut);
    wrapper.appendChild(controls);

    // Precompute planet lookup
    this._planetMap = {};
    for (const p of PLANETS) {
      this._planetMap[p.id] = p;
    }
  }

  setGalaxy(galaxy) {
    this._galaxy = galaxy;
  }

  _getPlanetPos(planet, time) {
    const { radius, speed, phase } = planet.orbit;
    const angle = phase + speed * time;
    const s = SCALE * this._mapZoom;
    const x = CENTER + Math.cos(angle) * radius * s;
    const y = CENTER + Math.sin(angle) * radius * s;
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
    if (!this._cameraController) this._cameraController = cameraController;
    this._time = time;
    const ctx = this._ctx;

    // Toggle visibility based on zoom
    const zoomLevel = cameraController.getZoomLevel();
    const shouldShow = zoomLevel === 'galaxy' || zoomLevel === 'system';
    if (shouldShow !== this._visible) {
      this._visible = shouldShow;
      const container = document.getElementById('top-left-hud');
      if (container) container.classList.toggle('minimap-hidden', !shouldShow);
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
    const s = SCALE * this._mapZoom;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (const planet of PLANETS) {
      const r = planet.orbit.radius * s;
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

    // Draw enemy stations (red diamonds, gray for cleared)
    if (this._galaxy && gameState.enemyStations) {
      for (const st of gameState.enemyStations) {
        let pos = null;
        if (st.anchorPlanet) {
          // Planet-anchored: same position as planet (same orbit around sun)
          const planetDef = this._planetMap[st.anchorPlanet];
          if (planetDef) pos = this._getPlanetPos(planetDef, time);
        } else {
          // Free-floating: compute from FREE_FLOATING_BASES orbit
          const base = FREE_FLOATING_BASES.find(b => b.id === st.id);
          if (base) {
            const angle = base.orbitAngle + base.orbitSpeed * time;
            const r = base.orbitRadius;
            const x = CENTER + Math.cos(angle) * r * s;
            const y = CENTER + Math.sin(angle) * r * s;
            pos = { x, y };
          }
        }

        if (!pos) continue;

        if (st.cleared) {
          // Draw gray diamond for cleared stations
          const dia = 4;
          ctx.save();
          ctx.fillStyle = 'rgba(80, 80, 80, 0.4)';
          ctx.translate(pos.x, pos.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-dia, -dia, dia * 2, dia * 2);
          ctx.restore();
        } else {
          // Draw pulsing ring around active station
          ctx.save();
          const pulse = 6 + Math.sin(this._time * 4) * 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulse, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();

          // Draw red diamond (rotated square)
          const dia = 4;
          ctx.save();
          ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
          ctx.translate(pos.x, pos.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-dia, -dia, dia * 2, dia * 2);
          ctx.restore();
        }
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
      const cx = CENTER + Math.cos(camAngle) * orbitEquiv * s;
      const cy = CENTER + Math.sin(camAngle) * orbitEquiv * s;

      // Small crosshair
      ctx.strokeStyle = 'rgba(232, 196, 90, 0.5)';
      ctx.lineWidth = 1;
      const ch = 4;
      ctx.beginPath();
      ctx.moveTo(cx - ch, cy); ctx.lineTo(cx + ch, cy);
      ctx.moveTo(cx, cy - ch); ctx.lineTo(cx, cy + ch);
      ctx.stroke();
    }
  }

  dispose() {
    this._canvas.closest('.minimap-wrapper')?.remove();
  }
}
