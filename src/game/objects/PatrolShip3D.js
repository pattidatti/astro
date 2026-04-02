import * as THREE from 'three';

const HULL       = 0x8a7a4e;   // dark gold
const HULL_DARK  = 0x2a3a40;   // dark grey-blue
const GOLD       = 0xc8a84e;   // bright gold
const AMBER      = 0xff8822;   // engine glow
const SILVER     = 0xccccdd;

/** Orbit speed shared with DefenseManager3D for formation sync. */
export const PATROL_ORBIT_SPEED = 0.055;

/**
 * Military patrol ship in player faction colors.
 * Wedge-nosed fuselage with wing outriggers, dual engines, and forward cannon.
 * Position driven externally by DefenseManager3D (V-formation).
 */
export class PatrolShip3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._engineMats = [];
    this._build();
  }

  // ── Geometry ──────────────────────────────────────────────────────────────
  _build() {
    const G = this.group;

    // Main fuselage
    const fuseGeo = new THREE.BoxGeometry(0.26, 0.13, 0.60);
    const fuseMat = new THREE.MeshStandardMaterial({
      color: HULL, emissive: HULL, emissiveIntensity: 0.18,
      metalness: 0.85, roughness: 0.25,
    });
    G.add(new THREE.Mesh(fuseGeo, fuseMat));

    // Nose cone (4-sided pyramid pointing forward −Z)
    const noseGeo = new THREE.ConeGeometry(0.095, 0.30, 4);
    const noseMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: GOLD, emissiveIntensity: 0.2,
      metalness: 0.85, roughness: 0.2,
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    // Cone's axis is +Y; rotate −90° around X so it points in −Z (forward)
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, 0, -0.45);
    G.add(nose);

    // Dorsal spine ridge
    const spineGeo = new THREE.BoxGeometry(0.06, 0.06, 0.50);
    const spineMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: GOLD, emissiveIntensity: 0.25,
      metalness: 0.8, roughness: 0.3,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0.09, -0.05);
    G.add(spine);

    // Wing outriggers (swept back)
    for (const sign of [-1, 1]) {
      const wingGeo = new THREE.BoxGeometry(0.55, 0.04, 0.28);
      const wingMat = new THREE.MeshStandardMaterial({
        color: GOLD, emissive: GOLD, emissiveIntensity: 0.22,
        metalness: 0.8, roughness: 0.3,
      });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(sign * 0.40, 0, 0.04);
      G.add(wing);

      // Wing tip nav light
      const navGeo = new THREE.SphereGeometry(0.034, 4, 4);
      const navMat = new THREE.MeshBasicMaterial({
        color: sign < 0 ? 0xff3333 : 0x33ff88,
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const nav = new THREE.Mesh(navGeo, navMat);
      nav.position.set(sign * 0.71, 0, 0.04);
      G.add(nav);
    }

    // Forward cannon (center-mounted, under nose)
    const canGeo = new THREE.CylinderGeometry(0.026, 0.036, 0.44, 6);
    const canMat = new THREE.MeshStandardMaterial({
      color: SILVER, metalness: 0.92, roughness: 0.1,
    });
    const cannon = new THREE.Mesh(canGeo, canMat);
    cannon.rotation.x = Math.PI / 2;
    cannon.position.set(0, -0.055, -0.42);
    G.add(cannon);

    // Muzzle glow
    const mGeo = new THREE.CircleGeometry(0.030, 6);
    const mMat = new THREE.MeshBasicMaterial({
      color: 0xffcc44, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const muzzle = new THREE.Mesh(mGeo, mMat);
    muzzle.position.set(0, -0.055, -0.65);
    G.add(muzzle);

    // Dual engine pods (rear)
    for (const sign of [-1, 1]) {
      const engGeo = new THREE.CylinderGeometry(0.060, 0.080, 0.22, 8);
      const engMat = new THREE.MeshStandardMaterial({
        color: HULL_DARK, metalness: 0.7, roughness: 0.4,
      });
      const eng = new THREE.Mesh(engGeo, engMat);
      eng.rotation.x = Math.PI / 2;
      eng.position.set(sign * 0.17, 0, 0.30);
      G.add(eng);

      // Engine glow disc
      const eGeo = new THREE.CircleGeometry(0.058, 8);
      const eMat = new THREE.MeshBasicMaterial({
        color: AMBER, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const eGlow = new THREE.Mesh(eGeo, eMat);
      eGlow.position.set(sign * 0.17, 0, 0.42);
      G.add(eGlow);
      this._engineMats.push(eMat);
    }

    // Invisible hitbox
    const hGeo = new THREE.SphereGeometry(0.65, 6, 6);
    const hMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitbox = new THREE.Mesh(hGeo, hMat);
    G.add(this.hitbox);
  }

  // ── Orbit control (driven by DefenseManager3D) ───────────────────────────

  /**
   * Set planet-local position in orbitGroup space.
   * @param {number} angle  - Orbit angle (radians)
   * @param {number} radius - Orbit radius
   * @param {number} inclination - Orbit tilt (radians)
   * @param {number} lateralOffset - Signed radial offset for wing positions
   * @param {number} yOffset - Vertical offset for 3D V-formation
   */
  setOrbitState(angle, radius, inclination, lateralOffset, yOffset) {
    const r = radius + lateralOffset; // lateral uses radial distance
    const a = angle;
    const incl = inclination;
    this.group.position.set(
      Math.cos(a) * r,
      Math.sin(incl) * Math.sin(a) * r * 0.35 + yOffset,
      Math.sin(a) * r,
    );
    // Face direction of travel (tangent to orbit)
    this.group.rotation.y = -a;
  }

  activate() {
    this.group.visible = true;
    this.hitbox.visible = true;
  }

  deactivate() {
    this.group.visible = false;
    this.hitbox.visible = false;
  }

  update(dt, time) {
    for (let i = 0; i < this._engineMats.length; i++) {
      this._engineMats[i].opacity = 0.6 + Math.sin(time * 5.5 + i) * 0.25;
    }
  }

  getWorldPosition() {
    const v = new THREE.Vector3();
    this.group.getWorldPosition(v);
    return v;
  }

  dispose() {
    this.group.traverse(obj => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}
