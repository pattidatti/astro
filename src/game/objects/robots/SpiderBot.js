import * as THREE from 'three';
import { Robot3D } from '../Robot3D.js';

/**
 * Capacitor-sphere energy collector.
 * Pulsing amber core, spinning collector rings, orbiting capacitor pods.
 */
export class SpiderBot extends Robot3D {
  _buildMesh() {
    const group = new THREE.Group();

    // ── CORE SPHERE ───────────────────────────────────────────────────────
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd4a843, emissive: 0xd4a843, emissiveIntensity: 2.2,
      metalness: 0.25, roughness: 0.45,
    });
    this._core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), coreMat);
    group.add(this._core);

    // ── OUTER ICOSAHEDRON CAGE (wireframe) ───────────────────────────────
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xc8a84e, emissive: 0xc8a84e, emissiveIntensity: 0.2,
      metalness: 0.9, roughness: 0.2, wireframe: true,
    });
    this._cage = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), cageMat);
    group.add(this._cage);

    // ── 3 COLLECTOR RINGS (different axes, different speeds) ─────────────
    const ringDefs = [
      { rx: 0,             ry: 0,             speed:  0.9  },
      { rx: Math.PI / 2,   ry: 0,             speed: -1.3  },
      { rx: Math.PI / 4,   ry: Math.PI / 4,   speed:  1.7  },
    ];
    this._rings = [];
    for (const def of ringDefs) {
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff, emissive: 0x4488ff, emissiveIntensity: 0.85,
        metalness: 0.7, roughness: 0.2,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.54, 0.022, 8, 32),
        ringMat,
      );
      ring.rotation.set(def.rx, def.ry, 0);
      this._rings.push({ mesh: ring, speed: def.speed });
      group.add(ring);
    }

    // ── 4 CAPACITOR PODS (orbit around core) ─────────────────────────────
    this._podGroups = [];
    for (let i = 0; i < 4; i++) {
      const podGroup = new THREE.Group();
      podGroup.rotation.y = (i / 4) * Math.PI * 2;

      // Arm
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.013, 0.013, 0.32, 4),
        new THREE.MeshStandardMaterial({ color: 0x8a7a4e, metalness: 0.8 }),
      );
      arm.rotation.z = Math.PI / 2;
      arm.position.x = 0.53;
      podGroup.add(arm);

      // Pod body
      const pod = new THREE.Mesh(
        new THREE.BoxGeometry(0.095, 0.095, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x1a1208, metalness: 0.88, roughness: 0.32 }),
      );
      pod.position.x = 0.69;
      podGroup.add(pod);

      // Emissive tip
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 2.0,
      });
      const podTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), tipMat);
      podTip.position.set(0.69, 0.11, 0);
      this._podGroups.push({ group: podGroup, tipMat, phase: i * 1.57 });
      podGroup.add(podTip);

      group.add(podGroup);
    }

    return group;
  }

  update(dt, time) {
    super.update(dt, time);

    // Core breathes
    if (this._core) {
      this._core.material.emissiveIntensity = 1.6 + Math.sin(time * 2.8) * 1.0;
    }

    // Cage slowly tumbles
    if (this._cage) {
      this._cage.rotation.y += dt * 0.28;
      this._cage.rotation.z += dt * 0.19;
    }

    // Rings spin on their respective axes
    for (const r of this._rings) {
      r.mesh.rotation.z += dt * r.speed;
    }

    // Pods orbit and flicker
    for (const p of this._podGroups) {
      p.group.rotation.y += dt * 0.55;
      p.tipMat.emissiveIntensity = 1.4 + Math.abs(Math.sin(time * 4.1 + p.phase)) * 1.2;
    }
  }
}
