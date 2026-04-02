import * as THREE from 'three';

const HULL_DARK  = 0x1e2d38;
const GOLD       = 0xc8a84e;
const GOLD_DIM   = 0x8a7a4e;
const SILVER     = 0xbbbbcc;
const CYAN_GLOW  = 0x44ddff;
const THRUSTER_C = 0x00ffcc;

/**
 * Defensive combat platform — flat hexagonal body with weapon arms,
 * sensor dome, and solar panels. Orbits a planet in the orbitGroup.
 *
 * Position is driven externally by DefenseManager3D.
 */
export class DefenseSatellite3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._selfRotAngle = Math.random() * Math.PI * 2;
    this._thrusterMat  = null;

    this._build();
  }

  // ── Geometry ──────────────────────────────────────────────────────────────
  _build() {
    const G = this.group;

    // Flat hexagonal platform body
    const bodyGeo = new THREE.CylinderGeometry(0.80, 0.80, 0.13, 6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: HULL_DARK, emissive: HULL_DARK, emissiveIntensity: 0.12,
      metalness: 0.75, roughness: 0.45,
    });
    G.add(new THREE.Mesh(bodyGeo, bodyMat));

    // Gold rim torus
    const rimGeo = new THREE.TorusGeometry(0.82, 0.032, 4, 6);
    const rimMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: GOLD, emissiveIntensity: 0.4,
      metalness: 0.85, roughness: 0.2,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    G.add(rim);

    // Weapon arms — port and starboard
    for (const sign of [-1, 1]) {
      // Arm strut
      const armGeo = new THREE.BoxGeometry(0.58, 0.09, 0.16);
      const armMat = new THREE.MeshStandardMaterial({
        color: HULL_DARK, metalness: 0.65, roughness: 0.5,
      });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(sign * 0.69, 0, 0);
      G.add(arm);

      // Turret block at arm tip
      const turretGeo = new THREE.BoxGeometry(0.18, 0.13, 0.22);
      const turretMat = new THREE.MeshStandardMaterial({
        color: GOLD_DIM, emissive: GOLD_DIM, emissiveIntensity: 0.18,
        metalness: 0.8, roughness: 0.3,
      });
      const turret = new THREE.Mesh(turretGeo, turretMat);
      turret.position.set(sign * 1.01, 0, 0);
      G.add(turret);

      // Barrel (pointing radially outward → -Z of satellite)
      const bGeo = new THREE.CylinderGeometry(0.028, 0.036, 0.45, 6);
      const bMat = new THREE.MeshStandardMaterial({
        color: SILVER, metalness: 0.9, roughness: 0.12,
      });
      const barrel = new THREE.Mesh(bGeo, bMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(sign * 1.01, 0, -0.3);
      G.add(barrel);

      // Barrel glow
      const bgGeo = new THREE.CircleGeometry(0.033, 6);
      const bgMat = new THREE.MeshBasicMaterial({
        color: CYAN_GLOW, transparent: true, opacity: 0.75,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const bGlow = new THREE.Mesh(bgGeo, bgMat);
      bGlow.position.set(sign * 1.01, 0, -0.535);
      G.add(bGlow);
    }

    // Solar panel fins (fore/aft — along Z axis)
    for (const sign of [-1, 1]) {
      const panelGeo = new THREE.BoxGeometry(0.22, 0.02, 0.62);
      const panelMat = new THREE.MeshStandardMaterial({
        color: GOLD_DIM, emissive: GOLD_DIM, emissiveIntensity: 0.22,
        metalness: 0.5, roughness: 0.55,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, sign * 0.28, 0);
      G.add(panel);
    }

    // Top sensor dome
    const domeGeo = new THREE.SphereGeometry(0.17, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: GOLD, emissive: GOLD, emissiveIntensity: 0.5,
      metalness: 0.9, roughness: 0.1,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.065;
    G.add(dome);

    // Engine thruster glow (aft)
    const tGeo = new THREE.CircleGeometry(0.06, 8);
    this._thrusterMat = new THREE.MeshBasicMaterial({
      color: THRUSTER_C, transparent: true, opacity: 0.65,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const thruster = new THREE.Mesh(tGeo, this._thrusterMat);
    thruster.rotation.y = Math.PI;
    thruster.position.set(0, 0, 0.85);
    G.add(thruster);

    // Invisible hitbox for click detection
    const hGeo = new THREE.SphereGeometry(1.0, 6, 6);
    const hMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitbox = new THREE.Mesh(hGeo, hMat);
    G.add(this.hitbox);
  }

  // ── Orbit control (called by DefenseManager3D) ───────────────────────────

  /** Place at planet-local orbit position (in orbitGroup local space). */
  setOrbitState(angle, radius, inclination) {
    const r = radius;
    const a = angle;
    const incl = inclination;
    this.group.position.set(
      Math.cos(a) * r,
      Math.sin(incl) * Math.sin(a) * r * 0.35,
      Math.sin(a) * r,
    );
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
    this._selfRotAngle += dt * 0.12;
    this.group.rotation.y = this._selfRotAngle;
    if (this._thrusterMat) {
      this._thrusterMat.opacity = 0.45 + Math.sin(time * 4.1) * 0.22;
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
