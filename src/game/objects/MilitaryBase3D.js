import * as THREE from 'three';

const HULL_DARK  = 0x1a1e2a;  // dark gunmetal
const HULL_MID   = 0x252b38;  // mid steel
const STEEL      = 0x3a4255;  // lighter panel
const RED_ACCENT = 0xcc2222;  // military red
const RED_GLOW   = 0xff3333;  // reactor glow
const GOLD_TRIM  = 0x8a7a3a;  // muted gold trim
const ENGINE_BLU = 0x2255cc;  // thruster exhaust
const VIEWPORT   = 0x0a2244;  // dark viewport blue

/**
 * Orbital Military Base (Shipyard) — a compact, imposing station in outer orbit.
 * Sharp military angles, red/steel palette. Distinct from civilian Station3D.
 * Includes a vertical tether (Space Elevator) pointing down toward the planet.
 */
export class MilitaryBase3D {
  constructor() {
    this.group       = new THREE.Group();
    this.orbitAngle  = Math.random() * Math.PI * 2;
    this.orbitRadius = 25;
    this.orbitSpeed  = 0.07;

    this._reactorMat   = null;
    this._engineMats   = [];
    this._navLights    = [];
    this._tetherMat    = null;
    this._hangarMat    = null;

    this._build();
    this._buildTether();
  }

  // ── Material helpers ─────────────────────────────────────────────────────
  _std(color, emissive = 0, emissiveIntensity = 0, metalness = 0.6, roughness = 0.4) {
    return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, metalness, roughness });
  }
  _basic(color) { return new THREE.MeshBasicMaterial({ color }); }
  _mk(geo, mat) { return new THREE.Mesh(geo, mat); }

  // ── Main geometry ─────────────────────────────────────────────────────────
  _build() {
    const G = this.group;

    // ── Core hull platform ────────────────────────────────────────────────
    // Main hexagonal command deck
    const deckGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.28, 6);
    const deck = this._mk(deckGeo, this._std(HULL_DARK, HULL_DARK, 0.05, 0.7, 0.35));
    deck.position.y = 0;
    G.add(deck);

    // Raised central command module
    const cmdGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.5, 6);
    const cmd = this._mk(cmdGeo, this._std(HULL_MID, HULL_MID, 0.08, 0.65, 0.4));
    cmd.position.y = 0.39;
    G.add(cmd);

    // Command dome
    const domeGeo = new THREE.SphereGeometry(0.5, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const dome = this._mk(domeGeo, this._std(STEEL, STEEL, 0.06, 0.5, 0.5));
    dome.position.y = 0.64;
    G.add(dome);

    // 3 viewport windows on command module
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const vpMat = new THREE.MeshStandardMaterial({
        color: VIEWPORT, emissive: 0x1144aa, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const vp = this._mk(new THREE.PlaneGeometry(0.22, 0.12), vpMat);
      vp.position.set(Math.cos(a) * 0.92, 0.5, Math.sin(a) * 0.92);
      vp.rotation.y = -(a - Math.PI / 2);
      G.add(vp);
    }

    // Red accent band around deck edge
    const bandGeo = new THREE.TorusGeometry(1.95, 0.04, 6, 24);
    const bandMat = new THREE.MeshStandardMaterial({
      color: RED_ACCENT, emissive: RED_ACCENT, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3,
    });
    const band = this._mk(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.12;
    G.add(band);

    // Gold trim ring (bottom)
    const trimGeo = new THREE.TorusGeometry(2.0, 0.03, 5, 24);
    const trim = this._mk(trimGeo, this._std(GOLD_TRIM, GOLD_TRIM, 0.15, 0.8, 0.2));
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -0.1;
    G.add(trim);

    // ── Gantry arms (2 construction arms, 180° apart) ─────────────────────
    for (let i = 0; i < 2; i++) {
      const A = new THREE.Group();
      A.rotation.y = i * Math.PI;

      // Main arm strut
      const armGeo = new THREE.BoxGeometry(0.14, 0.12, 2.6);
      const arm = this._mk(armGeo, this._std(HULL_DARK, 0, 0, 0.7, 0.4));
      arm.position.z = 1.9;
      A.add(arm);

      // Arm ribbing (3 braces)
      for (let b = 0; b < 3; b++) {
        const bz = 1.0 + b * 0.7;
        const brace = this._mk(new THREE.BoxGeometry(0.06, 0.22, 0.06), this._std(STEEL));
        brace.position.set(0, 0, bz);
        A.add(brace);
      }

      // Crane head at tip
      const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const head = this._mk(headGeo, this._std(HULL_MID, HULL_MID, 0.06, 0.6, 0.4));
      head.position.set(0, 0, 3.23);
      A.add(head);

      // Crane boom (extends upward)
      const boomGeo = new THREE.CylinderGeometry(0.03, 0.05, 1.0, 5);
      const boom = this._mk(boomGeo, this._std(STEEL, 0, 0, 0.6, 0.4));
      boom.position.set(0, 0.65, 3.23);
      A.add(boom);

      // Red crane light
      const craneLightMat = new THREE.MeshStandardMaterial({
        color: RED_GLOW, emissive: RED_GLOW, emissiveIntensity: 2.5,
      });
      const craneLight = this._mk(new THREE.SphereGeometry(0.06, 6, 6), craneLightMat);
      craneLight.position.set(0, 1.18, 3.23);
      this._navLights.push({ mesh: craneLight, phase: i * Math.PI });
      A.add(craneLight);

      // Hangar bay opening (glow)
      const hgMat = new THREE.MeshStandardMaterial({
        color: 0x2244aa, emissive: 0x2244aa, emissiveIntensity: 1.2,
        side: THREE.DoubleSide, transparent: true, opacity: 0.75,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const hg = this._mk(new THREE.PlaneGeometry(0.30, 0.30), hgMat);
      hg.rotation.x = Math.PI / 2;
      hg.position.set(0, 0.25, 3.23);
      this._hangarMat = hgMat; // reuse same ref for animation
      A.add(hg);

      G.add(A);
    }

    // ── Weapon emplacements (2 turret stubs, 90° off gantry arms) ─────────
    for (let i = 0; i < 2; i++) {
      const W = new THREE.Group();
      W.rotation.y = i * Math.PI + Math.PI / 2;

      const baseGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.18, 8);
      const base = this._mk(baseGeo, this._std(HULL_DARK, 0, 0, 0.7, 0.35));
      base.position.set(1.85, 0.22, 0);
      W.add(base);

      const barrelGeo = new THREE.CylinderGeometry(0.05, 0.09, 0.55, 6);
      barrelGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      const barrel = this._mk(barrelGeo, this._std(STEEL, 0, 0, 0.8, 0.3));
      barrel.position.set(1.85, 0.30, 0.4);
      W.add(barrel);

      // Targeting light (red dot)
      const targetMat = new THREE.MeshStandardMaterial({
        color: RED_GLOW, emissive: RED_GLOW, emissiveIntensity: 1.8,
      });
      const targetLight = this._mk(new THREE.SphereGeometry(0.04, 5, 5), targetMat);
      targetLight.position.set(1.85, 0.30, 0.72);
      this._navLights.push({ mesh: targetLight, phase: i * 2.1 + 1.5 });
      W.add(targetLight);

      G.add(W);
    }

    // ── Reactor core (underside) ──────────────────────────────────────────
    const reactorMat = new THREE.MeshStandardMaterial({
      color: RED_GLOW, emissive: RED_GLOW, emissiveIntensity: 1.8,
      metalness: 0.3, roughness: 0.5,
    });
    this._reactorMat = reactorMat;
    const reactor = this._mk(new THREE.SphereGeometry(0.28, 14, 14), reactorMat);
    reactor.position.y = -0.48;
    G.add(reactor);

    // Reactor containment ring
    const rRingGeo = new THREE.TorusGeometry(0.42, 0.03, 6, 24);
    const rRing = this._mk(rRingGeo, this._std(GOLD_TRIM, GOLD_TRIM, 0.2, 0.8, 0.2));
    rRing.rotation.x = Math.PI / 2;
    rRing.position.y = -0.48;
    this._rRing = rRing;
    G.add(rRing);

    // ── Engine block (aft, 4 thruster nozzles) ────────────────────────────
    const thrusterPositions = [
      [ 0.5,  0.5], [-0.5,  0.5],
      [ 0.5, -0.5], [-0.5, -0.5],
    ];
    for (const [tx, tz] of thrusterPositions) {
      const nozzleGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.22, 8);
      const nozzle = this._mk(nozzleGeo, this._std(HULL_MID, 0, 0, 0.65, 0.4));
      nozzle.position.set(tx, -0.52, tz + 1.2);
      G.add(nozzle);

      const glowMat = new THREE.MeshStandardMaterial({
        color: ENGINE_BLU, emissive: ENGINE_BLU, emissiveIntensity: 2.0,
        side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const glow = this._mk(new THREE.CircleGeometry(0.12, 8), glowMat);
      glow.rotation.x = Math.PI / 2;
      glow.position.set(tx, -0.63, tz + 1.2);
      this._engineMats.push({ mat: glowMat, phase: (tx + tz) * 2.1 });
      G.add(glow);
    }

    // ── Invisible hitbox ──────────────────────────────────────────────────
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitboxMesh = this._mk(new THREE.SphereGeometry(3.0, 8, 8), hitMat);
    G.add(this.hitboxMesh);

    this.group.scale.setScalar(0.9);
  }

  // ── Space Elevator Tether ─────────────────────────────────────────────────
  _buildTether() {
    // Thin cylinder pointing from base hull down to planet center
    // Scaled to orbitRadius so it spans the gap. Positioned below the base.
    const tetherGeo = new THREE.CylinderGeometry(0.04, 0.04, this.orbitRadius, 6);
    this._tetherMat = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.30,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._tetherMesh = this._mk(tetherGeo, this._tetherMat);
    // Position: center it so it goes from y=0 down to y=-orbitRadius
    // In local space the base is at origin, planet is "below" toward y=-orbitRadius
    this._tetherMesh.position.set(0, -this.orbitRadius / 2, 0);
    this.group.add(this._tetherMesh);
  }

  // ── Init (called from SolarSystem to set planetId on hitbox) ─────────────
  init(planetId) {
    this.hitboxMesh.userData.type = 'militaryBase';
    this.hitboxMesh.userData.planetId = planetId;
    this._planetId = planetId;
  }

  // ── Orbital position ─────────────────────────────────────────────────────
  updateOrbit(time) {
    const angle = time * this.orbitSpeed + this.orbitAngle;
    this.group.position.set(
      Math.cos(angle) * this.orbitRadius,
      Math.sin(angle * 0.25) * 3.0,  // gentle vertical variation
      Math.sin(angle) * this.orbitRadius,
    );
    // Rotate station slowly on its own axis
    this.group.rotation.y = time * 0.04;
  }

  /** World position of the base (for camera tracking) */
  get worldPosition() {
    const v = new THREE.Vector3();
    this.group.getWorldPosition(v);
    return v;
  }

  // ── Per-frame update ─────────────────────────────────────────────────────
  update(time, dt) {
    this.updateOrbit(time);

    // Reactor pulse
    if (this._reactorMat) {
      this._reactorMat.emissiveIntensity = 1.4 + Math.sin(time * 2.2) * 0.8;
    }
    if (this._rRing) {
      this._rRing.rotation.z = time * 0.35;
      this._rRing.rotation.x = Math.PI / 2 + time * 0.12;
    }

    // Engine flicker
    for (const eng of this._engineMats) {
      eng.mat.emissiveIntensity = 1.5 + Math.sin(time * 8.5 + eng.phase) * 0.7;
    }

    // Nav lights blink
    for (const light of this._navLights) {
      light.mesh.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * 3.2 + light.phase)) * 2.5;
    }

    // Tether energy pulse
    if (this._tetherMat) {
      this._tetherMat.opacity = 0.20 + Math.sin(time * 1.8) * 0.10;
    }

    // Hangar bay breathe
    if (this._hangarMat) {
      this._hangarMat.emissiveIntensity = 0.9 + Math.sin(time * 2.6) * 0.4;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }

  dispose() {
    this.group.traverse(child => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material?.dispose();
      }
    });
  }
}
