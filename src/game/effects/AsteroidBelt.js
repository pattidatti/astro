import * as THREE from 'three';

const ASTEROID_COUNT = 400;

/**
 * Instanced asteroid belt orbiting a planet.
 * Uses IcosahedronGeometry with per-instance color, scale, orbital speed.
 */
export class AsteroidBelt {
  constructor(color = 0x8a7560) {
    this.group = new THREE.Group();

    this._orbitAngles  = new Float32Array(ASTEROID_COUNT);
    this._orbitRadii   = new Float32Array(ASTEROID_COUNT);
    this._orbitSpeeds  = new Float32Array(ASTEROID_COUNT);
    this._orbitHeights = new Float32Array(ASTEROID_COUNT);
    this._scales       = new Float32Array(ASTEROID_COUNT);
    this._selfRotAxes  = [];
    this._selfRotAngles = new Float32Array(ASTEROID_COUNT);
    this._selfRotSpeeds = new Float32Array(ASTEROID_COUNT);

    const rockGeo = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.65,
      metalness: 0.08,
      color:     new THREE.Color(color),
      emissive:  new THREE.Color(0.06, 0.038, 0.014),
    });

    // Fresnel rim — makes asteroids visible from all angles, not just when backlit
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        /* glsl */`
        vec3 rimViewDir = normalize(-vViewPosition);
        float rim = 1.0 - max(dot(rimViewDir, normal), 0.0);
        rim = pow(rim, 2.0) * 1.8;
        outgoingLight += diffuseColor.rgb * rim;
        #include <output_fragment>
        `
      );
    };

    this.mesh = new THREE.InstancedMesh(rockGeo, mat, ASTEROID_COUNT);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.castShadow  = false;
    this.mesh.receiveShadow = false;

    const dummy        = new THREE.Object3D();
    const colorVariant = new THREE.Color();

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      this._orbitAngles[i]  = Math.random() * Math.PI * 2;
      this._orbitRadii[i]   = 20 + Math.random() * 15;   // 20–35 units
      this._orbitSpeeds[i]  = (0.03 + Math.random() * 0.06) * (Math.random() < 0.5 ? 1 : -1);
      this._orbitHeights[i] = (Math.random() - 0.5) * 4; // ±2 units
      this._scales[i]       = 0.05 + Math.random() * 0.20;

      this._selfRotAxes.push(
        new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      );
      this._selfRotAngles[i] = Math.random() * Math.PI * 2;
      this._selfRotSpeeds[i] = 0.2 + Math.random() * 0.8;

      // Initial matrix
      const a = this._orbitAngles[i];
      const r = this._orbitRadii[i];
      dummy.position.set(Math.cos(a) * r, this._orbitHeights[i], Math.sin(a) * r);
      dummy.scale.setScalar(this._scales[i]);
      dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);

      // Per-instance earthy color variation — brighter so rim effect reads well
      const hue  = 0.06 + Math.random() * 0.05;
      const sat  = 0.12 + Math.random() * 0.25;
      const lit  = 0.28 + Math.random() * 0.28;
      colorVariant.setHSL(hue, sat, lit);
      this.mesh.setColorAt(i, colorVariant);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    this.group.add(this.mesh);

    // Cached per-frame scratch objects — avoids GC churn
    this._dummy = new THREE.Object3D();
    this._quat  = new THREE.Quaternion();
  }

  update(dt) {
    const dummy = this._dummy;
    const _quat = this._quat;

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      this._orbitAngles[i]  += this._orbitSpeeds[i]  * dt;
      this._selfRotAngles[i] += this._selfRotSpeeds[i] * dt;

      const a = this._orbitAngles[i];
      const r = this._orbitRadii[i];

      dummy.position.set(Math.cos(a) * r, this._orbitHeights[i], Math.sin(a) * r);
      dummy.scale.setScalar(this._scales[i]);
      _quat.setFromAxisAngle(this._selfRotAxes[i], this._selfRotAngles[i]);
      dummy.quaternion.copy(_quat);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
