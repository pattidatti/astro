import * as THREE from 'three';

const ASTEROID_COUNT = 4000;

/**
 * Galactic asteroid belt orbiting the sun at solar-system scale.
 * Distributed in a torus (ring) between 370–450 units from system center,
 * with larger rocks than per-planet belts and slower orbital speeds.
 * Uses InstancedMesh for efficient rendering.
 */
export class GalacticAsteroidBelt {
  constructor({
    particleCount = ASTEROID_COUNT,
    innerRadius = 370,
    outerRadius = 450,
    heightVariation = 20,
    color = 0x998877,
    minScale = 0.05,
    maxScale = 0.25,
  } = {}) {
    this.group = new THREE.Group();

    this._orbitAngles  = new Float32Array(particleCount);
    this._orbitRadii   = new Float32Array(particleCount);
    this._orbitSpeeds  = new Float32Array(particleCount);
    this._orbitHeights = new Float32Array(particleCount);
    this._scales       = new Float32Array(particleCount);
    this._selfRotAxes  = [];
    this._selfRotAngles = new Float32Array(particleCount);
    this._selfRotSpeeds = new Float32Array(particleCount);

    const rockGeo = new THREE.IcosahedronGeometry(1, 1);
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.65,
      metalness: 0.08,
      color:     new THREE.Color(color),
      emissive:  new THREE.Color(0.06, 0.038, 0.014),
    });

    // Fresnel rim — makes asteroids visible from all angles
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

    this.mesh = new THREE.InstancedMesh(rockGeo, mat, particleCount);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.castShadow  = false;
    this.mesh.receiveShadow = false;

    const dummy        = new THREE.Object3D();
    const colorVariant = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      this._orbitAngles[i]  = Math.random() * Math.PI * 2;
      this._orbitRadii[i]   = innerRadius + Math.random() * (outerRadius - innerRadius);
      this._orbitSpeeds[i]  = (0.001 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1);
      this._orbitHeights[i] = (Math.random() - 0.5) * (heightVariation * 2);
      this._scales[i]       = minScale + Math.random() * (maxScale - minScale);

      this._selfRotAxes.push(
        new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      );
      this._selfRotAngles[i] = Math.random() * Math.PI * 2;
      this._selfRotSpeeds[i] = 0.05 + Math.random() * 0.25;

      // Initial matrix
      const a = this._orbitAngles[i];
      const r = this._orbitRadii[i];
      dummy.position.set(Math.cos(a) * r, this._orbitHeights[i], Math.sin(a) * r);
      dummy.scale.setScalar(this._scales[i]);
      dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);

      // Per-instance rocky colour variation — neutral grey-brown
      const hue  = 0.04 + Math.random() * 0.04;
      const sat  = 0.08 + Math.random() * 0.10;
      const lit  = 0.22 + Math.random() * 0.20;
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
    if (!this.mesh.visible) return;

    const dummy = this._dummy;
    const _quat = this._quat;
    const count = this._orbitAngles.length;

    for (let i = 0; i < count; i++) {
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

  setOpacity(v) {
    this.mesh.material.opacity = v;
    this.mesh.material.transparent = v < 0.99;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
