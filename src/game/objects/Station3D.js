import * as THREE from 'three';
import { gameState } from '../GameState.js';

const HULL      = 0xc8c0b0;
const HULL_MID  = 0x9a9490;
const GOLD      = 0xc8a84e;
const GOLD_DIM  = 0x8a7a4e;
const REACTOR   = 0xd4a843;
const ENGINE_ORG = 0xff7722;
const HANGAR_BLU = 0x4488cc;
const SOLAR_BLK  = 0x1a2233;
const WINDOW_BLU = 0x88ccff;

/**
 * Procedural orbital command station — ISS-meets-WH40K showpiece.
 * Multi-tier hull · outer habitat ring · solar arrays · 3 docking arms ·
 * 6 engine struts · enhanced antenna array. All animated.
 */
export class Station3D {
  constructor() {
    this.group           = new THREE.Group();
    this._hangarMats     = [];
    this._dockRings      = [];   // { mesh, dir }
    this._antennaTips    = [];   // { mesh, phase }
    this._engines        = [];   // { mat, phase }
    this._windows        = [];   // { mat, phase }
    this._outerRingGroup = null;
    this._reactor        = null;
    this._reactorRing    = null;
    this._reactorRing2   = null;
    this._flashState     = 0;
    this._flashTimer     = 0;
    this._flashCount     = 0;

    this._build();
    this.orbitAngle  = Math.random() * Math.PI * 2;
    this.orbitRadius = 15;
    this.orbitSpeed  = 0.1;
  }

  // ── Material factories ────────────────────────────────────────────────────
  _hm()  { return new THREE.MeshStandardMaterial({ color: HULL,     emissive: HULL,     emissiveIntensity: 0.18, metalness: 0.2,  roughness: 0.6  }); }
  _mm()  { return new THREE.MeshStandardMaterial({ color: HULL_MID, emissive: HULL_MID, emissiveIntensity: 0.10, metalness: 0.25, roughness: 0.65 }); }
  _gm()  { return new THREE.MeshStandardMaterial({ color: GOLD,     emissive: GOLD,     emissiveIntensity: 0.35, metalness: 0.85, roughness: 0.2  }); }
  _gdm() { return new THREE.MeshStandardMaterial({ color: GOLD_DIM, emissive: GOLD_DIM, emissiveIntensity: 0.12, metalness: 0.8,  roughness: 0.4  }); }
  _mk(geo, mat) { return new THREE.Mesh(geo, mat); }

  _build() {
    this._buildHull();
    this._buildReactor();
    this._buildOuterRing();
    this._buildDockingArms();
    this._buildSolarMasts();
    this._buildEngineSection();
    this._buildAntennaArray();
    this.group.scale.setScalar(0.75);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HULL — 3-tier body + detail rings + windows + dome
  // ─────────────────────────────────────────────────────────────────────────
  _buildHull() {
    const G = this.group;

    // Three stacked hull cylinders
    const tierA = this._mk(new THREE.CylinderGeometry(0.82, 1.05, 1.0,  16), this._hm());
    tierA.position.y = -1.0;
    G.add(tierA);

    const tierB = this._mk(new THREE.CylinderGeometry(0.80, 0.82, 1.6,  16), this._hm());
    tierB.position.y = 0.3;
    G.add(tierB);

    const tierC = this._mk(new THREE.CylinderGeometry(0.52, 0.80, 0.7,  12), this._mm());
    tierC.position.y = 1.45;
    G.add(tierC);

    // 8 detail rings (alternating gold / grey)
    const rings = [
      { y: -1.38, r: 1.07, t: 0.033, gold: true  },
      { y: -0.90, r: 0.85, t: 0.026, gold: false },
      { y: -0.52, r: 0.83, t: 0.040, gold: true  },
      { y: -0.08, r: 0.82, t: 0.026, gold: false },
      { y:  0.35, r: 0.82, t: 0.040, gold: true  },
      { y:  0.82, r: 0.82, t: 0.026, gold: false },
      { y:  1.12, r: 0.82, t: 0.036, gold: true  },
      { y:  1.58, r: 0.53, t: 0.026, gold: false },
    ];
    for (const d of rings) {
      const rib = this._mk(new THREE.TorusGeometry(d.r, d.t, 8, 28), d.gold ? this._gdm() : this._mm());
      rib.rotation.x = Math.PI / 2;
      rib.position.y = d.y;
      G.add(rib);
    }

    // Observation deck ring (wide gold torus at mid)
    const obsRing = this._mk(new THREE.TorusGeometry(1.35, 0.075, 10, 48), this._gm());
    obsRing.rotation.x = Math.PI / 2;
    obsRing.position.y = 0.45;
    G.add(obsRing);

    // 8 radial support struts
    for (let i = 0; i < 8; i++) {
      const sg = new THREE.Group();
      sg.rotation.y = (i / 8) * Math.PI * 2;
      const strut = this._mk(new THREE.CylinderGeometry(0.020, 0.020, 0.53, 5), this._gdm());
      strut.rotation.z = Math.PI / 2;
      strut.position.x = 1.085;
      sg.add(strut);
      G.add(sg);
    }

    // Hull windows — 2 rows × 10
    for (let row = 0; row < 2; row++) {
      const wy = row === 0 ? 0.55 : 0.05;
      for (let w = 0; w < 10; w++) {
        const a = (w / 10) * Math.PI * 2;
        const mat = new THREE.MeshStandardMaterial({
          color: WINDOW_BLU, emissive: WINDOW_BLU, emissiveIntensity: 1.2,
          transparent: true, opacity: 0.9,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const win = this._mk(new THREE.PlaneGeometry(0.10, 0.065), mat);
        win.position.set(Math.cos(a) * 0.83, wy, Math.sin(a) * 0.83);
        win.rotation.y = -(a - Math.PI / 2);
        this._windows.push({ mat, phase: (row * 10 + w) * 0.628 });
        G.add(win);
      }
    }

    // Command dome
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xd8d0b8, emissive: 0xd8d0b8, emissiveIntensity: 0.15,
      metalness: 0.2, roughness: 0.55,
    });
    const dome = this._mk(new THREE.SphereGeometry(0.5, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), domeMat);
    dome.position.y = 1.8;
    G.add(dome);

    const domeRing = this._mk(new THREE.TorusGeometry(0.50, 0.048, 8, 32), this._gm());
    domeRing.rotation.x = Math.PI / 2;
    domeRing.position.y = 1.8;
    G.add(domeRing);

    // Dome windows — 8 around equator
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const mat = new THREE.MeshStandardMaterial({
        color: WINDOW_BLU, emissive: WINDOW_BLU, emissiveIntensity: 1.5,
        transparent: true, opacity: 0.88,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const win = this._mk(new THREE.PlaneGeometry(0.09, 0.07), mat);
      win.position.set(Math.cos(a) * 0.40, 2.01, Math.sin(a) * 0.40);
      win.rotation.y = -(a - Math.PI / 2);
      win.rotation.z = 0.28;
      this._windows.push({ mat, phase: i * 0.785 + 3.14 });
      G.add(win);
    }

    // Dome collar
    const domeCollar = this._mk(new THREE.CylinderGeometry(0.24, 0.50, 0.16, 12), this._mm());
    domeCollar.position.set(0, 2.32, 0);
    G.add(domeCollar);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REACTOR — core + two orbit rings + 4 containment arcs
  // ─────────────────────────────────────────────────────────────────────────
  _buildReactor() {
    const G = this.group;

    const reactorMat = new THREE.MeshStandardMaterial({
      color: REACTOR, emissive: REACTOR, emissiveIntensity: 1.5,
      metalness: 0.3, roughness: 0.5,
    });
    this._reactor = this._mk(new THREE.SphereGeometry(0.38, 18, 18), reactorMat);
    G.add(this._reactor);

    this._reactorRing = this._mk(new THREE.TorusGeometry(0.54, 0.028, 8, 32), this._gm());
    G.add(this._reactorRing);

    this._reactorRing2 = this._mk(new THREE.TorusGeometry(0.54, 0.022, 8, 32), this._gm());
    this._reactorRing2.rotation.x = Math.PI / 2;
    G.add(this._reactorRing2);

    // 4 containment half-arcs
    for (let i = 0; i < 4; i++) {
      const arc = this._mk(new THREE.TorusGeometry(0.68, 0.016, 6, 18, Math.PI), this._gdm());
      arc.rotation.y = (i / 4) * Math.PI * 2;
      arc.rotation.x = Math.PI / 2;
      G.add(arc);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OUTER HABITAT RING — large torus + spokes + habitat pods (slow rotation)
  // ─────────────────────────────────────────────────────────────────────────
  _buildOuterRing() {
    this._outerRingGroup = new THREE.Group();
    const R = this._outerRingGroup;

    // Main torus
    const ringMat = new THREE.MeshStandardMaterial({
      color: HULL_MID, emissive: HULL_MID, emissiveIntensity: 0.08,
      metalness: 0.2, roughness: 0.65,
    });
    const torus = this._mk(new THREE.TorusGeometry(5.0, 0.22, 14, 64), ringMat);
    torus.rotation.x = Math.PI / 2;
    R.add(torus);

    // Two gold accent bands
    for (const dy of [-0.20, 0.20]) {
      const accent = this._mk(new THREE.TorusGeometry(5.0, 0.038, 6, 64), this._gm());
      accent.rotation.x = Math.PI / 2;
      accent.position.y = dy;
      R.add(accent);
    }

    // 6 spokes (every 60°)
    for (let i = 0; i < 6; i++) {
      const sg = new THREE.Group();
      sg.rotation.y = (i / 6) * Math.PI * 2;
      // Hull surface ≈ x=0.82, ring inner edge ≈ x=4.78 → length 3.96, center 2.80
      const spoke = this._mk(new THREE.CylinderGeometry(0.05, 0.06, 3.96, 6), this._mm());
      spoke.rotation.z = Math.PI / 2;
      spoke.position.x = 2.80;
      sg.add(spoke);
      // Junction cap at outer end
      const cap = this._mk(new THREE.BoxGeometry(0.16, 0.16, 0.16), this._gdm());
      cap.position.x = 4.78;
      sg.add(cap);
      R.add(sg);
    }

    // 4 habitat pods at 90° spacing
    for (let j = 0; j < 4; j++) {
      const a = (j / 4) * Math.PI * 2 + Math.PI / 4;
      const pg = new THREE.Group();
      pg.position.set(Math.cos(a) * 5.0, 0, Math.sin(a) * 5.0);
      pg.rotation.y = a + Math.PI / 2;

      pg.add(this._mk(new THREE.BoxGeometry(0.85, 0.40, 0.45), this._hm()));

      // End caps
      for (const xe of [-0.42, 0.42]) {
        const cap = this._mk(new THREE.CylinderGeometry(0.20, 0.20, 0.45, 8), this._mm());
        cap.rotation.z = Math.PI / 2;
        cap.position.x = xe;
        pg.add(cap);
      }

      // 3 pod windows
      for (let w = 0; w < 3; w++) {
        const mat = new THREE.MeshStandardMaterial({
          color: WINDOW_BLU, emissive: WINDOW_BLU, emissiveIntensity: 1.4,
          transparent: true, opacity: 0.9,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const win = this._mk(new THREE.PlaneGeometry(0.10, 0.08), mat);
        win.position.set(-0.26 + w * 0.26, 0.04, 0.23);
        this._windows.push({ mat, phase: j * 3 + w + 10.0 });
        pg.add(win);
      }

      // Green running nav light
      const navMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 3.0 });
      const nav = this._mk(new THREE.SphereGeometry(0.04, 5, 5), navMat);
      nav.position.set(0, 0.24, 0);
      this._antennaTips.push({ mesh: nav, phase: j * 1.57 + 7.0 });
      pg.add(nav);

      R.add(pg);
    }

    this.group.add(this._outerRingGroup);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3 DOCKING ARMS — 120° apart, fully detailed
  // ─────────────────────────────────────────────────────────────────────────
  _buildDockingArms() {
    for (let i = 0; i < 3; i++) {
      const A = new THREE.Group();
      A.rotation.y = (i / 3) * Math.PI * 2;

      // Junction block at hull
      const junc = this._mk(new THREE.BoxGeometry(0.30, 0.30, 0.30), this._mm());
      junc.position.x = 0.98;
      A.add(junc);

      // Main shaft
      const shaft = this._mk(new THREE.CylinderGeometry(0.15, 0.20, 2.2, 8), this._hm());
      shaft.rotation.z = Math.PI / 2;
      shaft.position.x = 1.95;
      A.add(shaft);

      // Upper + lower rails
      for (const sy of [-0.23, 0.23]) {
        const rail = this._mk(new THREE.CylinderGeometry(0.024, 0.024, 2.0, 4), this._gdm());
        rail.rotation.z = Math.PI / 2;
        rail.position.set(1.95, sy, 0);
        A.add(rail);
      }

      // X-bracing (3 pairs)
      for (let b = 0; b < 3; b++) {
        const bx = 1.2 + b * 0.62;
        for (const sign of [1, -1]) {
          const brace = this._mk(new THREE.BoxGeometry(0.042, 0.44, 0.042), this._gdm());
          brace.position.set(bx, 0, 0);
          brace.rotation.z = sign * Math.PI * 0.22;
          A.add(brace);
        }
      }

      // Fuel tank pod (horizontal, on top of arm)
      const tank = this._mk(new THREE.CylinderGeometry(0.15, 0.15, 0.55, 8), this._mm());
      tank.rotation.z = Math.PI / 2;
      tank.position.set(2.05, 0.38, 0);
      A.add(tank);
      for (const xe of [-0.275, 0.275]) {
        const cap = this._mk(new THREE.SphereGeometry(0.15, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), this._mm());
        cap.rotation.x = Math.PI / 2;
        cap.rotation.z = xe > 0 ? 0 : Math.PI;
        cap.position.set(2.05 + xe, 0.38, 0);
        A.add(cap);
      }

      // Terminus bay box
      const bay = this._mk(new THREE.BoxGeometry(1.02, 0.78, 0.78), this._hm());
      bay.position.x = 3.42;
      A.add(bay);

      // 4 corner trim strips
      for (const sy of [-0.39, 0.39]) {
        for (const sz of [-0.39, 0.39]) {
          const trim = this._mk(new THREE.BoxGeometry(1.06, 0.058, 0.058), this._gm());
          trim.position.set(3.42, sy, sz);
          A.add(trim);
        }
      }

      // Front face gold plate
      const plate = this._mk(new THREE.BoxGeometry(0.06, 0.73, 0.73), this._gm());
      plate.position.x = 3.94;
      A.add(plate);

      // Hangar glow
      const hangarMat = new THREE.MeshStandardMaterial({
        color: HANGAR_BLU, emissive: HANGAR_BLU, emissiveIntensity: 1.4,
        side: THREE.DoubleSide, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const hangar = this._mk(new THREE.PlaneGeometry(0.60, 0.60), hangarMat);
      hangar.rotation.y = Math.PI / 2;
      hangar.position.x = 3.95;
      this._hangarMats.push(hangarMat);
      A.add(hangar);

      // Outer docking ring
      const dockOuter = this._mk(new THREE.TorusGeometry(0.33, 0.034, 8, 24), this._gm());
      dockOuter.rotation.y = Math.PI / 2;
      dockOuter.position.x = 3.95;
      this._dockRings.push({ mesh: dockOuter, dir: 1 });
      A.add(dockOuter);

      // Inner docking ring (counter-rotation)
      const dockInner = this._mk(new THREE.TorusGeometry(0.22, 0.020, 6, 20), this._gdm());
      dockInner.rotation.y = Math.PI / 2;
      dockInner.position.x = 3.97;
      this._dockRings.push({ mesh: dockInner, dir: -1 });
      A.add(dockInner);

      // 6 docking bolts around opening
      for (let c = 0; c < 6; c++) {
        const ca = (c / 6) * Math.PI * 2;
        const bolt = this._mk(new THREE.CylinderGeometry(0.024, 0.024, 0.06, 5), this._gdm());
        bolt.rotation.y = Math.PI / 2;
        bolt.position.set(3.94, Math.sin(ca) * 0.33, Math.cos(ca) * 0.33);
        A.add(bolt);
      }

      // Bay running light
      const rlMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 2.5 });
      const rl = this._mk(new THREE.SphereGeometry(0.04, 6, 6), rlMat);
      rl.position.set(3.97, 0.40, 0.40);
      this._antennaTips.push({ mesh: rl, phase: i * 2.09 + 5.0 });
      A.add(rl);

      this.group.add(A);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SOLAR MASTS — 3 arrays between arms (60°, 180°, 300°)
  // ─────────────────────────────────────────────────────────────────────────
  _buildSolarMasts() {
    for (let i = 0; i < 3; i++) {
      const S = new THREE.Group();
      S.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 3;

      // Mast pole
      const mast = this._mk(new THREE.CylinderGeometry(0.032, 0.050, 3.2, 6), this._mm());
      mast.rotation.z = Math.PI / 2;
      mast.position.x = 2.0;
      S.add(mast);

      // Cross-arm
      const cross = this._mk(new THREE.CylinderGeometry(0.022, 0.022, 2.4, 5), this._mm());
      cross.position.x = 3.4;
      S.add(cross);

      // Junction box
      const jbox = this._mk(new THREE.BoxGeometry(0.14, 0.14, 0.14), this._gdm());
      jbox.position.x = 3.4;
      S.add(jbox);

      // 2 solar panels (above + below cross-arm)
      for (const sign of [1, -1]) {
        const panelMat = new THREE.MeshStandardMaterial({
          color: SOLAR_BLK, emissive: 0x0d1a2b, emissiveIntensity: 0.4,
          metalness: 0.1, roughness: 0.9, side: THREE.DoubleSide,
        });
        const panel = this._mk(new THREE.PlaneGeometry(1.2, 0.60), panelMat);
        panel.position.set(3.4, sign * 0.72, 0);
        panel.rotation.x = Math.PI / 2;
        S.add(panel);

        // Frame border
        const frame = this._mk(new THREE.BoxGeometry(1.24, 0.035, 0.64), this._gdm());
        frame.position.set(3.4, sign * 0.72, 0);
        S.add(frame);

        // 2 cell divider strips
        for (const fz of [-0.18, 0.18]) {
          const strip = this._mk(new THREE.BoxGeometry(1.2, 0.035, 0.012), this._mm());
          strip.position.set(3.4, sign * 0.72, fz);
          S.add(strip);
        }
      }

      this.group.add(S);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ENGINE SECTION — base plate + 6 strut legs with nozzles
  // ─────────────────────────────────────────────────────────────────────────
  _buildEngineSection() {
    const G = this.group;

    // Base flare disc
    const plate = this._mk(new THREE.CylinderGeometry(0.90, 0.90, 0.08, 16), this._mm());
    plate.position.y = -1.52;
    G.add(plate);

    // Bottom cone cap
    const cone = this._mk(new THREE.CylinderGeometry(0.0, 0.44, 0.28, 12), this._mm());
    cone.position.y = -1.72;
    G.add(cone);

    // 6 strut legs
    for (let i = 0; i < 6; i++) {
      const E = new THREE.Group();
      E.rotation.y = (i / 6) * Math.PI * 2;

      // Angled strut
      const strut = this._mk(new THREE.CylinderGeometry(0.038, 0.038, 0.72, 5), this._mm());
      strut.rotation.z = Math.PI * 0.18;
      strut.position.set(0.50, -1.56, 0);
      E.add(strut);

      // Diagonal brace
      const brace = this._mk(new THREE.CylinderGeometry(0.020, 0.020, 0.44, 4), this._gdm());
      brace.rotation.z = -Math.PI * 0.30;
      brace.position.set(0.34, -1.50, 0);
      E.add(brace);

      // Engine pod
      const pod = this._mk(new THREE.CylinderGeometry(0.16, 0.20, 0.44, 8), this._hm());
      pod.position.set(0.72, -1.82, 0);
      E.add(pod);

      // Nozzle bell
      const nozzleMat = new THREE.MeshStandardMaterial({
        color: 0x888880, emissive: 0x333333, emissiveIntensity: 0.2,
        metalness: 0.55, roughness: 0.4,
      });
      const nozzle = this._mk(new THREE.CylinderGeometry(0.08, 0.175, 0.22, 8), nozzleMat);
      nozzle.position.set(0.72, -2.06, 0);
      E.add(nozzle);

      // Engine glow
      const glowMat = new THREE.MeshStandardMaterial({
        color: ENGINE_ORG, emissive: ENGINE_ORG, emissiveIntensity: 2.5,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const glow = this._mk(new THREE.CircleGeometry(0.15, 8), glowMat);
      glow.rotation.x = Math.PI / 2;
      glow.position.set(0.72, -2.19, 0);
      this._engines.push({ mat: glowMat, phase: i * (Math.PI / 3) });
      E.add(glow);

      G.add(E);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ANTENNA ARRAY — nav spire · comm dish · 4 antennas · sec dishes · spires
  // ─────────────────────────────────────────────────────────────────────────
  _buildAntennaArray() {
    const G = this.group;

    // Nav spire needle
    const spireNeedle = this._mk(new THREE.CylinderGeometry(0.011, 0.024, 1.05, 4), this._gdm());
    spireNeedle.position.y = 2.84;
    G.add(spireNeedle);

    // Top nav blink light
    const topLightMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 2.5 });
    const topLight = this._mk(new THREE.SphereGeometry(0.038, 6, 6), topLightMat);
    topLight.position.y = 3.38;
    this._antennaTips.push({ mesh: topLight, phase: 0.0 });
    G.add(topLight);

    // Main comm dish (tilted, offset from centre)
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xb0a890, emissive: 0xb0a890, emissiveIntensity: 0.12,
      metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide,
    });
    const dish = this._mk(new THREE.CircleGeometry(0.35, 14), dishMat);
    dish.position.set(0.45, 2.92, 0);
    dish.lookAt(new THREE.Vector3(1.8, 5.8, 0));
    G.add(dish);

    const dishMast = this._mk(new THREE.CylinderGeometry(0.018, 0.028, 0.48, 5), this._gdm());
    dishMast.position.set(0.22, 2.70, 0);
    G.add(dishMast);

    // Feed horn
    const feedMat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 1.0 });
    const feed = this._mk(new THREE.SphereGeometry(0.036, 6, 6), feedMat);
    feed.position.set(0.60, 3.06, 0);
    G.add(feed);

    // 4 main antennas
    const antPos    = [[0.50, 0.50], [-0.50, 0.50], [0.50, -0.50], [-0.50, -0.50]];
    const antHeight = [1.90, 1.48, 1.70, 2.10];
    const antMat    = new THREE.MeshStandardMaterial({
      color: GOLD_DIM, emissive: GOLD_DIM, emissiveIntensity: 0.18,
      metalness: 0.7, roughness: 0.3,
    });

    for (let i = 0; i < 4; i++) {
      const [x, z] = antPos[i];
      const h = antHeight[i];
      const baseY = 1.82;

      const ant = this._mk(new THREE.CylinderGeometry(0.014, 0.024, h, 4), antMat.clone());
      ant.position.set(x, baseY + h * 0.5, z);
      G.add(ant);

      // Cross-arm on 2 tallest antennas
      if (h > 1.8) {
        const crossArm = this._mk(new THREE.CylinderGeometry(0.010, 0.010, 0.52, 4), antMat.clone());
        crossArm.position.set(x, baseY + h * 0.68, z);
        G.add(crossArm);

        for (const xe of [-0.26, 0.26]) {
          const xtipMat = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2.5 });
          const xtip = this._mk(new THREE.SphereGeometry(0.024, 5, 5), xtipMat);
          xtip.position.set(x + xe, baseY + h * 0.68, z);
          this._antennaTips.push({ mesh: xtip, phase: i * 1.31 + 1.6 });
          G.add(xtip);
        }
      }

      // Main blinking tip
      const tipMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 2.5 });
      const tip = this._mk(new THREE.SphereGeometry(0.034, 6, 6), tipMat);
      tip.position.set(x, baseY + h + 0.04, z);
      this._antennaTips.push({ mesh: tip, phase: i * 1.31 });
      G.add(tip);
    }

    // 4 secondary sensor dishes
    const secDishMat = new THREE.MeshStandardMaterial({
      color: 0x9a9288, emissive: 0x9a9288, emissiveIntensity: 0.10,
      metalness: 0.35, roughness: 0.45, side: THREE.DoubleSide,
    });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI * 0.12;
      const dx = Math.cos(a) * 0.76, dz = Math.sin(a) * 0.76;
      const secDish = this._mk(new THREE.CircleGeometry(0.20, 10), secDishMat.clone());
      secDish.position.set(dx, 1.94, dz);
      secDish.lookAt(new THREE.Vector3(dx * 3.5, 5.5, dz * 3.5));
      G.add(secDish);
      const stand = this._mk(new THREE.CylinderGeometry(0.011, 0.011, 0.22, 4), antMat.clone());
      stand.position.set(dx, 1.82, dz);
      G.add(stand);
    }

    // 2 WH40K gothic spires
    for (let i = 0; i < 2; i++) {
      const a = (i / 2) * Math.PI * 2;
      const sx = Math.cos(a) * 0.42, sz = Math.sin(a) * 0.42;

      const spireShaft = this._mk(new THREE.CylinderGeometry(0.030, 0.095, 1.28, 6), this._gdm());
      spireShaft.position.set(sx, 2.08, sz);
      G.add(spireShaft);

      // Mid-band ring
      const band = this._mk(new THREE.TorusGeometry(0.062, 0.016, 5, 14), this._gm());
      band.rotation.x = Math.PI / 2;
      band.position.set(sx, 2.42, sz);
      G.add(band);

      // Gold cap
      const capMat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.1 });
      const cap = this._mk(new THREE.SphereGeometry(0.062, 6, 6), capMat);
      cap.position.set(sx, 2.76, sz);
      G.add(cap);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HITBOX + helpers
  // ─────────────────────────────────────────────────────────────────────────
  init(planetId) {
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitboxMesh = this._mk(new THREE.SphereGeometry(2.75, 8, 8), mat);
    this.hitboxMesh.userData.stationId = planetId;
    this.group.add(this.hitboxMesh);
  }

  get stationWorldPosition() {
    const v = new THREE.Vector3();
    this.group.getWorldPosition(v);
    return v;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELIVERY FLASH — blinks all nav lights 3× rapidly on ship arrival
  // ─────────────────────────────────────────────────────────────────────────
  flashDelivery() {
    this._flashState = 1;
    this._flashTimer = 0;
    this._flashCount = 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PURCHASE PULSE — all emissive materials glow bright then fade back
  // ─────────────────────────────────────────────────────────────────────────
  flashPurchase() {
    this._purchasePulse = 1.0; // starts at full intensity, decays to 0
  }

  _updateFlash(dt) {
    this._flashTimer += dt;
    if (this._flashTimer >= 0.1) {
      this._flashTimer -= 0.1;
      this._flashState = this._flashState === 1 ? 2 : 1;
      if (this._flashState === 1) {
        this._flashCount++;
        if (this._flashCount >= 3) {
          this._flashState = 0;
          return;
        }
      }
    }
    for (const a of this._antennaTips) {
      a.mesh.material.emissiveIntensity = this._flashState === 1 ? 9.0 : 0.0;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE — orbital path + all animations
  // ─────────────────────────────────────────────────────────────────────────
  update(time, dt = 0.016) {
    // Orbital path
    this.orbitAngle = time * this.orbitSpeed;
    this.group.position.set(
      Math.cos(this.orbitAngle) * this.orbitRadius,
      Math.sin(this.orbitAngle * 0.3) * 1.5,
      Math.sin(this.orbitAngle) * this.orbitRadius,
    );
    this.group.rotation.y = time * 0.05;

    // Reactor core pulse
    if (this._reactor) {
      this._reactor.material.emissiveIntensity = 1.0 + Math.sin(time * 1.5) * 0.8;
    }

    // Primary reactor ring
    if (this._reactorRing) {
      this._reactorRing.rotation.z = time * 0.28;
      this._reactorRing.rotation.x = time * 0.18;
    }

    // Secondary reactor ring (perpendicular counter-tumble)
    if (this._reactorRing2) {
      this._reactorRing2.rotation.z = time * -0.22;
      this._reactorRing2.rotation.y = time *  0.15;
    }

    // Outer habitat ring (slow continuous rotation)
    if (this._outerRingGroup) {
      this._outerRingGroup.rotation.y = time * 0.035;
    }

    // Engine exhaust flicker
    for (const eng of this._engines) {
      eng.mat.emissiveIntensity = 2.0 + Math.sin(time * 7.3 + eng.phase) * 0.85;
    }

    // Antenna tips + nav lights — staggered blink, suppressed during delivery flash
    if (this._flashState !== 0) {
      this._updateFlash(dt);
    } else {
      for (const a of this._antennaTips) {
        a.mesh.material.emissiveIntensity = 0.4 + Math.abs(Math.sin(time * 3.8 + a.phase)) * 2.2;
      }
    }

    // Hangar glow breathe
    for (const m of this._hangarMats) {
      m.emissiveIntensity = 1.1 + Math.sin(time * 2.4) * 0.45;
    }

    // Docking rings — inner and outer counter-rotate
    for (const r of this._dockRings) {
      r.mesh.rotation.z = time * 0.75 * r.dir;
    }

    // Window shimmer (very subtle)
    for (const w of this._windows) {
      w.mat.emissiveIntensity = 1.1 + Math.sin(time * 0.9 + w.phase) * 0.12;
    }

    // Purchase pulse — boost all emissives then decay
    if (this._purchasePulse > 0) {
      this._purchasePulse = Math.max(0, this._purchasePulse - dt / 1.2);
      const boost = this._purchasePulse * 4.0;
      if (this._reactor) this._reactor.material.emissiveIntensity += boost;
      for (const eng of this._engines) eng.mat.emissiveIntensity += boost;
      for (const m of this._hangarMats) m.emissiveIntensity += boost;
      for (const w of this._windows) w.mat.emissiveIntensity += boost * 0.5;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COMBAT — damage states + shield dome
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initialize shield dome mesh (call once when defense is first built).
   */
  initShieldDome() {
    if (this._shieldDome) return;
    const geo = new THREE.SphereGeometry(4.5, 24, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    this._shieldDome = new THREE.Mesh(geo, mat);
    this._shieldDomeMat = mat;
    this._shieldDomeGeo = geo;
    this.group.add(this._shieldDome);
  }

  /**
   * Update shield dome visibility based on shield HP.
   */
  setShieldState(shieldHP, shieldMaxHP) {
    if (!this._shieldDome) {
      if (shieldMaxHP > 0) this.initShieldDome();
      else return;
    }
    if (shieldMaxHP <= 0) {
      this._shieldDomeMat.opacity = 0;
      return;
    }
    const frac = shieldHP / shieldMaxHP;
    this._shieldDomeMat.opacity = 0.08 + frac * 0.12; // subtle visible when up
    this._shieldDomeMat.color.setHex(frac > 0.5 ? 0x4488ff : (frac > 0.2 ? 0x44aaff : 0xff4444));
  }

  /**
   * Set visual damage state based on station HP percentage.
   * 0 = destroyed, 1 = full health.
   */
  setDamageState(hpFraction) {
    if (!this._damageParticles) {
      this._createDamageParticles();
    }

    // Show spark particles below 75%
    if (hpFraction < 0.75) {
      this._damageParticles.visible = true;
      const intensity = 1 - hpFraction; // 0 at full, 1 at 0 HP
      this._damageParticleMat.opacity = intensity * 0.6;
      this._damageParticleMat.size = 0.1 + intensity * 0.15;
    } else {
      this._damageParticles.visible = false;
    }

    // Darken hull emissive when damaged
    const darken = Math.max(0, 1 - hpFraction * 2); // starts darkening below 50%
    if (this._reactor) {
      this._reactor.material.emissive.setHex(darken > 0.3 ? 0x880000 : REACTOR);
    }
  }

  _createDamageParticles() {
    const count = 20;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._damageParticleMat = new THREE.PointsMaterial({
      color: 0xff8800,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._damageParticles = new THREE.Points(geo, this._damageParticleMat);
    this._damageParticles.visible = false;
    this.group.add(this._damageParticles);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CANNON TURRETS — mounted on hull, visible from planet level
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Create or remove cannon turrets to match the purchased count.
   * Turrets orbit the station along its observation ring (radius 1.35).
   * @param {number} count - Number of turrets (0 removes all)
   */
  syncCannonTurrets(count) {
    if (!this._turretGroup) {
      this._turretGroup = new THREE.Group();
      this.group.add(this._turretGroup);
      this._turretPivots = []; // { pivot: Group, sweepOffset: number }
    }

    const current = this._turretPivots.length;
    if (current === count) return;

    // Clear all turrets and rebuild
    this._turretGroup.clear();
    this._turretPivots = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.35; // observation ring radius (station-local, pre-scale)
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Base mount
      const baseGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.10, 6);
      const baseMat = new THREE.MeshStandardMaterial({
        color: GOLD, emissive: GOLD, emissiveIntensity: 0.3,
        metalness: 0.85, roughness: 0.2,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(x, 0.08, z);
      this._turretGroup.add(base);

      // Barrel pivot group (rotates to aim)
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.15, z);
      this._turretGroup.add(pivot);

      // Barrel
      const bGeo = new THREE.CylinderGeometry(0.022, 0.030, 0.38, 6);
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xbbbbcc, metalness: 0.92, roughness: 0.1,
      });
      const barrel = new THREE.Mesh(bGeo, bMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.z = -0.22;
      pivot.add(barrel);

      // Muzzle glow
      const mGeo = new THREE.CircleGeometry(0.026, 6);
      const mMat = new THREE.MeshBasicMaterial({
        color: REACTOR, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const muzzle = new THREE.Mesh(mGeo, mMat);
      muzzle.position.z = -0.41;
      pivot.add(muzzle);

      this._turretPivots.push({
        pivot,
        sweepOffset: angle, // stagger sweep phase
        baseAngle: angle,
      });
    }
  }

  /**
   * Smoothly aim all turret pivots toward the nearest enemy in the planet.
   * Falls back to a slow sweep when not in combat.
   * Called by DefenseManager3D each frame.
   * @param {string} planetId
   */
  aimTurretsAtNearest(planetId) {
    if (!this._turretPivots || this._turretPivots.length === 0) return;

    const attack = gameState.activeAttacks.find(a => a.planetId === planetId);
    const alive = attack?.enemies.filter(e => e.hp > 0) ?? [];

    // Get station world position for reference
    const stationWorldPos = this.stationWorldPosition;

    for (const td of this._turretPivots) {
      if (alive.length > 0 && attack) {
        // Pick a random alive enemy and rotate toward where enemy ships orbit
        const enemy = alive[Math.floor(Math.random() * alive.length)];
        // Enemy visual positions not directly accessible; sweep toward orbit radius
        // Use a combat sweep: rotate quickly around the orbit axis
        td.sweepOffset += 0.008; // fast sweep during combat
      } else {
        td.sweepOffset += 0.002; // slow idle sweep
      }
      // Rotate barrel pivot (yaw around Y-axis)
      td.pivot.rotation.y = td.sweepOffset - td.baseAngle;
    }
  }

  /**
   * Return world position of a random cannon turret.
   * Used by DefenseManager3D for laser fire origin.
   */
  getRandomTurretWorldPosition() {
    if (!this._turretPivots || this._turretPivots.length === 0) return null;
    const td = this._turretPivots[Math.floor(Math.random() * this._turretPivots.length)];
    const v = new THREE.Vector3();
    td.pivot.getWorldPosition(v);
    return v;
  }

  dispose() {
    this.group.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
  }
}
