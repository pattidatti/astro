import * as THREE from 'three';
import { gameState } from '../GameState.js';

// Type-specific color palettes (for orbital + outpost classes)
const TYPE_COLORS = {
  lava:       { hull: 0x3d0a00, emissive: 0xff2200, ring: 0xff6600 },
  ice:        { hull: 0x001a33, emissive: 0x44aaff, ring: 0xaaddff },
  industrial: { hull: 0x1a1a1a, emissive: 0xd4a843, ring: 0x886600 },
  void:       { hull: 0x150022, emissive: 0x9922ff, ring: 0xcc44ff },
  generic:    { hull: 0x111822, emissive: 0x336688, ring: 0x224455 },
};

// Flagship always uses purple/gold regardless of type
const FLAGSHIP_COL = { hull: 0x1a0030, emissive: 0x8800ff, ring: 0xd4a843 };

// HP bar config per class: geometry sizes and y elevation
const HP_BAR = {
  flagship: { bgW: 5.0, bgH: 0.25, fgW: 4.84, fgH: 0.18, y: 13.0 },
  orbital:  { bgW: 2.4, bgH: 0.12, fgW: 2.32, fgH: 0.09, y:  5.5 },
  outpost:  { bgW: 1.8, bgH: 0.10, fgW: 1.74, fgH: 0.07, y:  6.5 },
};
const SHIELD_R = { flagship: 13.0, orbital: 7.0,  outpost: 5.0 };
const HITBOX_R = { flagship: 16.0, orbital: 7.0,  outpost: 5.5 };

export class EnemyStation3D {
  constructor(stationDef, options = {}) {
    this.stationId      = stationDef.id;
    this.type           = stationDef.type;
    this.isFreefloating = options.isFreefloating ?? false;
    this._def           = stationDef;

    this.orbitAngle  = Math.random() * Math.PI * 2;
    this.orbitRadius = stationDef.orbitRadius ?? 50;
    this.orbitSpeed  = 0.04;

    this.group = new THREE.Group();

    this._phase        = 'dormant';
    this._warTime      = 0;
    this._skirmishTime = 0;
    this._emissiveMats = [];
    this._outerRing    = null;
    this._innerRing2   = null;

    const cls = stationDef.stationClass || 'orbital';
    const col = cls === 'flagship'
      ? FLAGSHIP_COL
      : (TYPE_COLORS[this.type] ?? TYPE_COLORS.generic);

    this._buildMesh(col, cls);
    this._createHPBar(cls);
    this._createShieldDome(cls);
    this._createHitbox(cls);

    this.setHP(stationDef.maxHP, stationDef.maxHP);
    this.setShield(stationDef.shieldMaxHP, stationDef.shieldMaxHP);
  }

  // ── Geometry dispatch ─────────────────────────────────────────────────────

  _buildMesh(col, cls) {
    if (cls === 'flagship') this._buildFlagship(col);
    else if (cls === 'outpost') this._buildOutpost(col);
    else this._buildOrbital(this.group, col);
  }

  // ── Orbital (carrier-style asymmetric hub) ────────────────────────────────

  _buildOrbital(target, col) {
    const hullMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.emissive),
      emissiveIntensity: 0.1,
      roughness: 0.55,
      metalness: 0.85,
    });
    this._emissiveMats.push(hullMat);

    const accentMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.ring),
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.9,
    });
    this._emissiveMats.push(accentMat);

    const glowMat = new THREE.MeshBasicMaterial({
      color: col.ring,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    // Note: glowMat is MeshBasicMaterial — skipped in phase emissive changes intentionally

    // ── Central hub ──────────────────────────────────────────────────────────
    target.add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.9, 3.2, 16), hullMat));

    // Hub equatorial collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.2, 8, 32), accentMat);
    collar.rotation.x = Math.PI / 2;
    target.add(collar);

    // Small sensor domes on hub top/bottom
    const domeMat = hullMat;
    const topDome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    topDome.position.y = 1.6;
    target.add(topDome);

    // ── Carrier arm (+X direction, long and flat) ─────────────────────────────
    const deck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.55, 2.6), hullMat);
    deck.position.set(6.05, 0, 0); // spans x ≈ 1.8 → 9.8 from center
    target.add(deck);

    // Command island (superstructure on top of deck)
    const island = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 1.2), hullMat);
    island.position.set(3.8, 1.125, 0); // 0.275(deck top) + 0.85(half island)
    target.add(island);

    // Island observation windows (accent strips)
    const winMat = accentMat;
    for (let i = 0; i < 3; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 0.06), winMat);
      win.position.set(3.8, 1.0 + i * 0.4, 0.63);
      target.add(win);
    }

    // Island sensor mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.2, 6), hullMat);
    mast.position.set(3.8, 1.125 + 0.85 + 1.1, 0); // top of island + half mast
    target.add(mast);

    // Mast top indicator
    const mastTip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 5, 4), glowMat);
    mastTip.position.set(3.8, 1.125 + 0.85 + 2.2 + 0.13, 0);
    target.add(mastTip);

    // Deck panel strips (raised detail along the carrier deck)
    for (const px of [2.2, 4.8, 6.8, 8.8]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.09, 2.3), accentMat);
      panel.position.set(px, 0.32, 0);
      target.add(panel);
    }

    // Running lights along carrier deck edges
    for (let i = 0; i < 5; i++) {
      const lx = 2.2 + i * 1.7;
      for (const lz of [1.25, -1.25]) {
        const light = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4), glowMat);
        light.position.set(lx, 0.32, lz);
        target.add(light);
      }
    }

    // Deck stern (blunt end cap at x≈9.8)
    const stern = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.6, 8), hullMat);
    stern.rotation.x = Math.PI / 2;
    stern.position.set(9.8, 0, 0);
    target.add(stern);

    // ── Cannon arm (~120° standard = rotation.y = 4π/3) ──────────────────────
    // rotation.y=θ maps local +X to world (cos θ, 0, −sin θ).
    // For world dir (-0.5, 0, 0.866) [standard 120°]: cos θ=−0.5, −sin θ=0.866 → θ = 4π/3
    const cg = new THREE.Group();
    cg.rotation.y = (4 * Math.PI) / 3;
    target.add(cg);

    // Arm spine (cylinder lying along local +X)
    const cannonArm = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 5.5, 8), hullMat);
    cannonArm.rotation.z = Math.PI / 2;
    cannonArm.position.x = 4.55; // center: 1.8 (hub edge) + 2.75 (half arm) = 4.55
    cg.add(cannonArm);

    // Accent band on arm
    const cannonBand = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.12, 6, 16), accentMat);
    cannonBand.rotation.y = Math.PI / 2;
    cannonBand.position.x = 3.5;
    cg.add(cannonBand);

    // Weapon cluster at tip (triangular arrangement)
    const weapGeo = new THREE.SphereGeometry(0.26, 6, 5);
    const tipOffsets = [[0, 0.35, 0.2], [0, 0.35, -0.2], [0, -0.35, 0]];
    for (const [dx, dy, dz] of tipOffsets) {
      const weap = new THREE.Mesh(weapGeo, glowMat);
      weap.position.set(7.4 + dx, dy, dz);
      cg.add(weap);
    }

    // ── Hangar arm (~240° standard = rotation.y = 2π/3) ──────────────────────
    // For world dir (-0.5, 0, -0.866) [standard 240°]: cos θ=−0.5, −sin θ=−0.866 → θ = 2π/3
    const hg = new THREE.Group();
    hg.rotation.y = (2 * Math.PI) / 3;
    target.add(hg);

    // Arm body (box, wider and flatter than cannon arm)
    const hangarArm = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.9, 2.2), hullMat);
    hangarArm.position.x = 4.3;
    hg.add(hangarArm);

    // Hangar bay doors (dark recessed panels on the arm face)
    const bayMat = new THREE.MeshBasicMaterial({ color: 0x060810 });
    for (let i = 0; i < 2; i++) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.07), bayMat);
      bay.position.set(2.8 + i * 1.9, 0, 1.12);
      hg.add(bay);
    }

    // Accent trim on hangar arm
    const hangarTrim = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.08, 2.1), accentMat);
    hangarTrim.position.set(4.3, 0.49, 0);
    hg.add(hangarTrim);
  }

  // ── Flagship (scaled orbital + outer ring) ────────────────────────────────

  _buildFlagship(col) {
    // Build orbital geometry into a scaled inner group
    const inner = new THREE.Group();
    inner.scale.set(2.5, 2.5, 2.5);
    this._buildOrbital(inner, col);
    this.group.add(inner);

    // Outer rotating ring (at world scale, not scaled by 2.5)
    // The inner orbital extends to ~10 world units (radius). At 2.5× scale that's ~25 units.
    // Ring at radius 18 gives a sweeping presence without being absurdly large.
    const ringGeo = new THREE.TorusGeometry(18.0, 0.65, 10, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.ring),
      emissiveIntensity: 0.7,
      roughness: 0.35,
      metalness: 0.95,
    });
    this._emissiveMats.push(ringMat);
    this._outerRing = new THREE.Mesh(ringGeo, ringMat);
    this._outerRing.rotation.x = Math.PI / 3; // tilted at 60° so it's visible
    this.group.add(this._outerRing);

    // Second, thinner inner ring for visual depth
    const ring2Geo = new THREE.TorusGeometry(12.5, 0.35, 8, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.emissive),
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.9,
    });
    this._emissiveMats.push(ring2Mat);
    this._innerRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this._innerRing2.rotation.x = -Math.PI / 4;
    this._innerRing2.rotation.z = Math.PI / 6;
    this.group.add(this._innerRing2);
  }

  // ── Outpost (observer tower) ───────────────────────────────────────────────

  _buildOutpost(col) {
    const hullMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.emissive),
      emissiveIntensity: 0.1,
      roughness: 0.55,
      metalness: 0.85,
    });
    this._emissiveMats.push(hullMat);

    const accentMat = new THREE.MeshStandardMaterial({
      color: col.hull,
      emissive: new THREE.Color(col.ring),
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.9,
    });
    this._emissiveMats.push(accentMat);

    const glowMat = new THREE.MeshBasicMaterial({
      color: col.ring,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // ── Main mast (vertical spine) ────────────────────────────────────────────
    this.group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 9.5, 8), hullMat));

    // ── Base module ───────────────────────────────────────────────────────────
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 1.3, 12), hullMat);
    base.position.y = -4.85; // just below mast bottom
    this.group.add(base);

    // Base collar ring
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.12, 6, 24), accentMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -4.65;
    this.group.add(baseRing);

    // ── Primary sensor dish (near top) ───────────────────────────────────────
    const dish1 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.1, 8, 36), accentMat);
    dish1.position.y = 3.2;
    dish1.rotation.x = THREE.MathUtils.degToRad(22);
    this.group.add(dish1);

    // Dish backing plate (adds visual mass to the sensor)
    const dishBack = new THREE.Mesh(new THREE.CircleGeometry(2.3, 20), hullMat);
    dishBack.position.y = 3.2;
    dishBack.rotation.x = THREE.MathUtils.degToRad(22) - Math.PI / 2;
    this.group.add(dishBack);

    // ── Secondary sensor dish (mid-height) ───────────────────────────────────
    const dish2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.08, 6, 28), accentMat);
    dish2.position.y = 1.0;
    dish2.rotation.x = THREE.MathUtils.degToRad(-35);
    dish2.rotation.z = THREE.MathUtils.degToRad(18);
    this.group.add(dish2);

    // ── Antenna struts (3 horizontal, 120° apart) ────────────────────────────
    // rotation.y = −a makes local +X point at standard angle a in XZ plane.
    const strutAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    for (const a of strutAngles) {
      const sg = new THREE.Group();
      sg.position.y = 4.0;
      sg.rotation.y = -a;
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.8, 4), hullMat);
      strut.rotation.z = Math.PI / 2;
      strut.position.x = 1.4; // center at 1.4 from mast axis
      sg.add(strut);
      // Small tip light
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), glowMat);
      tip.position.x = 2.8;
      sg.add(tip);
      this.group.add(sg);
    }

    // ── Mid-level weapon pods ─────────────────────────────────────────────────
    const podGeo = new THREE.SphereGeometry(0.28, 7, 5);
    for (const sx of [1.5, -1.5]) {
      const pod = new THREE.Mesh(podGeo, glowMat);
      pod.position.set(sx, -0.8, 0);
      this.group.add(pod);
    }

    // ── Mid-level structural ring ─────────────────────────────────────────────
    const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, 6, 18), accentMat);
    midRing.rotation.x = Math.PI / 2;
    midRing.position.y = -1.5;
    this.group.add(midRing);

    // ── Top indicator light ───────────────────────────────────────────────────
    const topLight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 4), glowMat);
    topLight.position.y = 5.2;
    this.group.add(topLight);
  }

  // ── HP bar ─────────────────────────────────────────────────────────────────

  _createHPBar(cls) {
    const cfg = HP_BAR[cls] ?? HP_BAR.orbital;
    this._hpHalfFgWidth = cfg.fgW / 2;

    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222, transparent: true, opacity: 0.7,
      depthTest: false, side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(new THREE.PlaneGeometry(cfg.bgW, cfg.bgH), bgMat);
    this._hpBg.position.set(0, cfg.y, 0);
    this.group.add(this._hpBg);

    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0xff4444, transparent: true, opacity: 0.9,
      depthTest: false, side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(new THREE.PlaneGeometry(cfg.fgW, cfg.fgH), this._hpFgMat);
    this._hpFg.position.set(0, cfg.y, 0.001);
    this.group.add(this._hpFg);
  }

  // ── Shield dome ────────────────────────────────────────────────────────────

  _createShieldDome(cls) {
    const r = SHIELD_R[cls] ?? SHIELD_R.orbital;
    this._shieldMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff, wireframe: true, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this._shieldDome = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), this._shieldMat);
    this.group.add(this._shieldDome);
  }

  // ── Invisible click hitbox ─────────────────────────────────────────────────

  _createHitbox(cls) {
    const r = HITBOX_R[cls] ?? HITBOX_R.orbital;
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitboxMesh = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), mat);
    this.hitboxMesh.userData.type = 'enemyStation';
    this.hitboxMesh.userData.stationId = this.stationId;
    this.group.add(this.hitboxMesh);
  }

  // ── Public state setters ───────────────────────────────────────────────────

  setHP(current, max) {
    const frac = max > 0 ? Math.max(0, current / max) : 0;
    this._hpFg.scale.x = frac;
    this._hpFg.position.x = -(1 - frac) * this._hpHalfFgWidth;
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
    if (phase !== 'war')      this._warTime = 0;
    if (phase !== 'skirmish') this._skirmishTime = 0;

    const EMISSIVE = {
      dormant:  0x0044ff,
      alert:    0xffee00,
      skirmish: 0xff8800,
      war:      0xff1100,
    };
    const INTENSITY = { dormant: 0.08, alert: 0.5, skirmish: 0.8, war: 1.0 };
    const col       = EMISSIVE[phase]   ?? EMISSIVE.dormant;
    const intensity = INTENSITY[phase]  ?? 0.08;

    for (const mat of this._emissiveMats) {
      if (mat.isMeshBasicMaterial) continue;
      mat.emissive?.setHex(col);
      mat.emissiveIntensity = intensity;
    }
  }

  faceCamera(camera) {
    this._hpBg.quaternion.copy(camera.quaternion);
    this._hpFg.quaternion.copy(camera.quaternion);
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  update(time, dt, camera) {
    // Self-orbit for planet-anchored stations
    if (!this.isFreefloating) {
      this.orbitAngle += this.orbitSpeed * dt;
      this.group.position.set(
        Math.cos(this.orbitAngle) * this.orbitRadius,
        0,
        Math.sin(this.orbitAngle) * this.orbitRadius
      );
    }

    // War phase — double heartbeat pulse (two quick beats, then rest)
    if (this._phase === 'war') {
      this._warTime += dt;
      const beat  = this._warTime % 1.6;
      const pulse = (beat < 0.15 || (beat > 0.3 && beat < 0.45)) ? 1.5 : 0.85;
      for (const mat of this._emissiveMats) {
        if (mat.isMeshBasicMaterial) continue;
        mat.emissive?.setHex(0xff1100);
        mat.emissiveIntensity = pulse;
      }
    }

    // Skirmish phase — slow, ominous pulse (3-second cycle)
    if (this._phase === 'skirmish') {
      this._skirmishTime += dt;
      const pulse = 0.65 + 0.2 * Math.sin((this._skirmishTime * Math.PI * 2) / 3);
      for (const mat of this._emissiveMats) {
        if (mat.isMeshBasicMaterial) continue;
        mat.emissiveIntensity = pulse;
      }
    }

    // Flagship outer ring rotation
    if (this._outerRing) {
      this._outerRing.rotation.z -= dt * 0.12;
    }
    if (this._innerRing2) {
      this._innerRing2.rotation.z += dt * 0.18;
      this._innerRing2.rotation.x += dt * 0.05;
    }

    if (camera) this.faceCamera(camera);

    // Keep HP / shield in sync with game state
    const st = gameState.enemyStations?.find(s => s.id === this.stationId);
    if (st) {
      this.setHP(st.hp, st.maxHP);
      this.setShield(st.shieldHP, st.shieldMaxHP);
      if (st.phase !== this._phase) this.setPhase(st.phase);
    }
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  dispose() {
    this.group.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry.dispose();
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    });
  }
}
