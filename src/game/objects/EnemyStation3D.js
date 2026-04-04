import * as THREE from 'three';
import { gameState } from '../GameState.js';

// Type-specific color palettes
const TYPE_COLORS = {
  lava:       { hull: 0x3d0a00, emissive: 0xff2200, ring: 0xff6600 },
  ice:        { hull: 0x001a33, emissive: 0x44aaff, ring: 0xaaddff },
  industrial: { hull: 0x1a1a1a, emissive: 0xd4a843, ring: 0x886600 },
  void:       { hull: 0x150022, emissive: 0x9922ff, ring: 0xcc44ff },
  generic:    { hull: 0x111822, emissive: 0x336688, ring: 0x224455 },
};

export class EnemyStation3D {
  constructor(stationDef) {
    this.stationId  = stationDef.id;
    this.type       = stationDef.type;

    // Orbit properties — used when planet-anchored (parent positions free-floating)
    this.orbitAngle  = Math.random() * Math.PI * 2;
    this.orbitRadius = stationDef.orbitRadius ?? 50;
    this.orbitSpeed  = 0.04;

    this.group = new THREE.Group();

    this._phase       = 'dormant';
    this._warTime     = 0;
    this._emissiveMats = [];

    const col = TYPE_COLORS[this.type] ?? TYPE_COLORS.generic;
    this._buildMesh(col);
    this._createHPBar();
    this._createShieldDome();
    this._createHitbox();

    // Initialise bar state
    this.setHP(stationDef.maxHP, stationDef.maxHP);
    this.setShield(stationDef.shieldMaxHP, stationDef.shieldMaxHP);
  }

  // ── Geometry ──────────────────────────────────────────────────────────────

  _buildMesh(col) {
    const hullMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.emissive),
      emissiveIntensity: 0.1,
      roughness: 0.55,
      metalness: 0.85,
    });
    this._emissiveMats.push(hullMat);

    // Central body
    const bodyGeo = new THREE.CylinderGeometry(1.0, 1.3, 2.2, 16);
    this.group.add(new THREE.Mesh(bodyGeo, hullMat));

    // Top dome
    const domeGeo = new THREE.SphereGeometry(1.0, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, hullMat);
    dome.position.y = 1.1;
    this.group.add(dome);

    // Main torus ring
    const ringMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.ring),
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.9,
    });
    this._emissiveMats.push(ringMat);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.16, 8, 32), ringMat);
    ring1.rotation.x = Math.PI / 2;
    this.group.add(ring1);

    // Secondary ring (tilted)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.10, 8, 24), ringMat);
    ring2.rotation.z = Math.PI / 3;
    this.group.add(ring2);

    // Weapon ports (4 emissive spheres at equator)
    const portMat = new THREE.MeshBasicMaterial({
      color: col.emissive,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._emissiveMats.push(portMat);
    const portGeo = new THREE.SphereGeometry(0.18, 6, 5);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.set(Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35);
      this.group.add(port);
    }
  }

  // ── HP bar — identical Mothership3D pattern (lines 309-333) ────────────────

  _createHPBar() {
    const bgGeo = new THREE.PlaneGeometry(1.8, 0.1);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222, transparent: true, opacity: 0.7,
      depthTest: false, side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(bgGeo, bgMat);
    this._hpBg.position.set(0, 2.4, 0);
    this.group.add(this._hpBg);

    const fgGeo = new THREE.PlaneGeometry(1.74, 0.07);
    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0xff4444, transparent: true, opacity: 0.9,
      depthTest: false, side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(fgGeo, this._hpFgMat);
    this._hpFg.position.set(0, 2.4, 0.001);
    this.group.add(this._hpFg);
  }

  // ── Shield dome ───────────────────────────────────────────────────────────

  _createShieldDome() {
    const shieldGeo = new THREE.SphereGeometry(3.2, 20, 14);
    this._shieldMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff, wireframe: true, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this._shieldDome = new THREE.Mesh(shieldGeo, this._shieldMat);
    this.group.add(this._shieldDome);
  }

  // ── Invisible click hitbox ────────────────────────────────────────────────

  _createHitbox() {
    const geo = new THREE.SphereGeometry(3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitboxMesh = new THREE.Mesh(geo, mat);
    this.hitboxMesh.userData.type = 'enemyStation';
    this.hitboxMesh.userData.stationId = this.stationId;
    this.group.add(this.hitboxMesh);
  }

  // ── Public state setters ─────────────────────────────────────────────────

  setHP(current, max) {
    const frac = max > 0 ? Math.max(0, current / max) : 0;
    this._hpFg.scale.x = frac;
    this._hpFg.position.x = -(1 - frac) * 0.87;
    if (frac > 0.5)       this._hpFgMat.color.setHex(0xff4444);
    else if (frac > 0.25) this._hpFgMat.color.setHex(0xff8800);
    else                  this._hpFgMat.color.setHex(0xffcc00);
    const damaged = frac < 1.0;
    this._hpBg.visible = damaged;
    this._hpFg.visible = damaged;
  }

  setShield(hp, max) {
    const frac = max > 0 ? Math.max(0, hp / max) : 0;
    this._shieldMat.opacity = frac > 0 ? 0.08 + frac * 0.12 : 0;
  }

  setPhase(phase) {
    this._phase = phase;
    if (phase !== 'war') this._warTime = 0;

    const EMISSIVE = {
      dormant:  0x2244ff,
      alert:    0xffee00,
      skirmish: 0xff8800,
      war:      0xff2200,
    };
    const INTENSITY = { dormant: 0.1, alert: 0.5, skirmish: 0.8, war: 1.2 };
    const col = EMISSIVE[phase] ?? EMISSIVE.dormant;
    const intensity = INTENSITY[phase] ?? 0.1;

    for (const mat of this._emissiveMats) {
      if (mat.isBasicMaterial) continue; // port glow — skip emissive set
      mat.emissive?.setHex(col);
      mat.emissiveIntensity = intensity;
    }
  }

  faceCamera(camera) {
    this._hpBg.quaternion.copy(camera.quaternion);
    this._hpFg.quaternion.copy(camera.quaternion);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(time, dt, camera) {
    // Self-orbit for planet-anchored mode
    this.orbitAngle += this.orbitSpeed * dt;
    this.group.position.set(
      Math.cos(this.orbitAngle) * this.orbitRadius,
      0,
      Math.sin(this.orbitAngle) * this.orbitRadius
    );

    // War-phase pulsing red (2-second cycle)
    if (this._phase === 'war') {
      this._warTime += dt;
      const pulse = 0.8 + 0.4 * Math.sin(this._warTime * Math.PI); // period = 2s
      for (const mat of this._emissiveMats) {
        if (mat.isBasicMaterial) continue;
        mat.emissive?.setHex(0xff2200);
        mat.emissiveIntensity = pulse;
      }
    }

    if (camera) this.faceCamera(camera);

    // Keep HP/shield in sync with game state
    const st = gameState.enemyStations?.find(s => s.id === this.stationId);
    if (st) {
      this.setHP(st.hp, st.maxHP);
      this.setShield(st.shieldHP, st.shieldMaxHP);
      if (st.phase !== this._phase) this.setPhase(st.phase);
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  dispose() {
    this.group.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry.dispose();
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    });
  }
}
