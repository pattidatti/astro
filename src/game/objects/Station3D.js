import * as THREE from 'three';

const GOLD = 0xc8a84e;
const GOLD_DIM = 0x8a7a4e;
const GREEN = 0x7cb85e;
const DARK = 0x1a1508;

/**
 * Procedural 3D orbital station built from Three.js primitives.
 * Orbits its parent planet.
 */
export class Station3D {
  constructor() {
    this.group = new THREE.Group();
    this._build();
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitRadius = 15;
    this.orbitSpeed = 0.1;
  }

  _build() {
    // --- Outer ring ---
    const outerRingGeo = new THREE.TorusGeometry(1.5, 0.08, 12, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.25,
    });
    this.outerRing = new THREE.Mesh(outerRingGeo, goldMat);
    this.outerRing.rotation.x = Math.PI / 2;
    this.group.add(this.outerRing);

    // --- Inner ring ---
    const innerRingGeo = new THREE.TorusGeometry(0.9, 0.05, 12, 36);
    const dimGoldMat = new THREE.MeshStandardMaterial({
      color: GOLD_DIM,
      emissive: GOLD_DIM,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.3,
    });
    this.innerRing = new THREE.Mesh(innerRingGeo, dimGoldMat);
    this.innerRing.rotation.x = Math.PI / 2;
    this.group.add(this.innerRing);

    // --- Central hub ---
    const hubGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const hubMat = new THREE.MeshStandardMaterial({
      color: DARK,
      emissive: GREEN,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.4,
    });
    this.hub = new THREE.Mesh(hubGeo, hubMat);
    this.group.add(this.hub);

    // --- 4 spokes connecting hub to outer ring ---
    const spokeMat = new THREE.MeshStandardMaterial({
      color: GOLD_DIM,
      metalness: 0.7,
      roughness: 0.4,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.15, 6);
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = angle;
      spoke.position.set(
        Math.cos(angle) * 0.75,
        0,
        Math.sin(angle) * 0.75
      );
      this.group.add(spoke);
    }

    // --- 4 solar panels on outer ring ---
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x224488,
      emissive: 0x112244,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.5,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4; // offset from spokes
      const panelGeo = new THREE.BoxGeometry(0.5, 0.02, 0.25);
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(
        Math.cos(angle) * 1.5,
        0,
        Math.sin(angle) * 1.5
      );
      panel.rotation.y = angle;
      this.group.add(panel);
    }

    // --- Docking port on top ---
    const dockGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8);
    const dockMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.3,
    });
    const dock = new THREE.Mesh(dockGeo, dockMat);
    dock.position.y = 0.3;
    this.group.add(dock);

    // --- Green nav light ---
    const navGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const navMat = new THREE.MeshStandardMaterial({
      color: GREEN,
      emissive: GREEN,
      emissiveIntensity: 2.0,
    });
    this.navLight = new THREE.Mesh(navGeo, navMat);
    this.navLight.position.y = -0.25;
    this.group.add(this.navLight);

    // Scale the whole station
    this.group.scale.setScalar(0.8);
  }

  /**
   * Update orbital position and rotation.
   * @param {number} time - Elapsed time in seconds
   */
  update(time) {
    // Orbit around planet center (parent group is at planet position)
    this.orbitAngle = time * this.orbitSpeed;
    this.group.position.set(
      Math.cos(this.orbitAngle) * this.orbitRadius,
      Math.sin(this.orbitAngle * 0.3) * 1.5, // vertical bob
      Math.sin(this.orbitAngle) * this.orbitRadius
    );

    // Station spins on its own axis
    this.outerRing.rotation.z = time * 0.32;
    this.innerRing.rotation.z = -time * 0.2;

    // Nav light pulse
    const pulse = Math.sin(time * 3.0) * 0.5 + 0.5;
    this.navLight.material.emissiveIntensity = 1.0 + pulse * 2.0;
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
