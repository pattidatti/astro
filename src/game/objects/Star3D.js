import * as THREE from 'three';
import { PLANET_COLORS } from '../data/planets.js';
import { StarShader } from '../shaders/planet/StarShader.js';

function hexToVec3(hex) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

/**
 * Decorative star at the center of each solar system.
 * Uses the existing StarShader at a smaller scale.
 */
export class Star3D {
  constructor(starDef) {
    this.group = new THREE.Group();
    this.size = starDef.size;

    if (this.size === 0) return; // Solaris — planet IS the star

    const colors = PLANET_COLORS.star;
    const colorVecs = colors.map(hexToVec3);

    // Tint toward the system's star color
    const tint = new THREE.Color(starDef.color);
    colorVecs[0] = new THREE.Vector3(
      colorVecs[0].x * 0.5 + tint.r * 0.5,
      colorVecs[0].y * 0.5 + tint.g * 0.5,
      colorVecs[0].z * 0.5 + tint.b * 0.5,
    );

    this.material = new THREE.ShaderMaterial({
      vertexShader: StarShader.vertex,
      fragmentShader: StarShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        uColors: { value: colorVecs },
        uLightDir: { value: new THREE.Vector3(1, 0.5, -0.3).normalize() },
      },
    });

    const geo = new THREE.SphereGeometry(this.size, 32, 32);
    this.mesh = new THREE.Mesh(geo, this.material);
    this.group.add(this.mesh);

    // Point light to illuminate orbiting planet
    this.light = new THREE.PointLight(tint, 1.5, 50, 1.5);
    this.group.add(this.light);
  }

  update(time) {
    if (this.size === 0) return;
    this.material.uniforms.uTime.value = time;
  }

  dispose() {
    if (this.size === 0) return;
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
