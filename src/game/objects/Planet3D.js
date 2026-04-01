import * as THREE from 'three';
import { PLANET_COLORS } from '../data/planets.js';
import { TerrestrialShader } from '../shaders/planet/TerrestrialShader.js';
import { LavaShader } from '../shaders/planet/LavaShader.js';
import { CrystalShader } from '../shaders/planet/CrystalShader.js';
import { GasShader } from '../shaders/planet/GasShader.js';
import { IceShader } from '../shaders/planet/IceShader.js';
import { NebulaWorldShader } from '../shaders/planet/NebulaWorldShader.js';
import { StarShader } from '../shaders/planet/StarShader.js';
import { VoidShader } from '../shaders/planet/VoidShader.js';
import { AtmosphereShader } from '../shaders/planet/AtmosphereShader.js';
import { RingShader } from '../shaders/planet/RingShader.js';

const SHADER_MAP = {
  terr: TerrestrialShader,
  lava: LavaShader,
  cryst: CrystalShader,
  gas: GasShader,
  ice: IceShader,
  neb: NebulaWorldShader,
  star: StarShader,
  void: VoidShader,
};

// Planet types that get rings
const RING_TYPES = ['gas', 'star', 'void'];

function hexToVec3(hex) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

export class Planet3D {
  /**
   * @param {object} planetDef - Planet definition from planets.js
   * @param {number} [radius=10] - Planet sphere radius
   */
  constructor(planetDef, radius = 10) {
    this.def = planetDef;
    this.radius = radius;
    this.group = new THREE.Group();
    this.group.userData.type = 'planet';
    this.group.userData.planetId = planetDef.id;

    this._createPlanetMesh();
    this._createAtmosphere();
    if (RING_TYPES.includes(planetDef.type)) {
      this._createRings();
    }
  }

  _createPlanetMesh() {
    const colors = PLANET_COLORS[this.def.type] || PLANET_COLORS.terr;
    const colorVecs = colors.map(hexToVec3);
    const shader = SHADER_MAP[this.def.type] || TerrestrialShader;

    const lightDir = new THREE.Vector3(1, 0.5, -0.3).normalize();

    this.planetMaterial = new THREE.ShaderMaterial({
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment,
      uniforms: {
        uTime: { value: 0 },
        uColors: { value: colorVecs },
        uLightDir: { value: lightDir },
      },
    });

    const geo = new THREE.SphereGeometry(this.radius, 64, 64);
    this.planetMesh = new THREE.Mesh(geo, this.planetMaterial);
    this.planetMesh.castShadow = true;
    this.group.add(this.planetMesh);
  }

  _createAtmosphere() {
    const atmColor = new THREE.Color(this.def.glow);
    const isEmissive = this.def.type === 'star';

    this.atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertex,
      fragmentShader: AtmosphereShader.fragment,
      uniforms: {
        uAtmColor: { value: new THREE.Vector3(atmColor.r, atmColor.g, atmColor.b) },
        uAtmIntensity: { value: isEmissive ? 1.2 : 0.8 },
      },
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const atmGeo = new THREE.SphereGeometry(this.radius * 1.15, 48, 48);
    this.atmosphereMesh = new THREE.Mesh(atmGeo, this.atmosphereMaterial);
    this.group.add(this.atmosphereMesh);
  }

  _createRings() {
    const ringColor = new THREE.Color(this.def.glow);
    const innerRadius = this.radius * 1.3;
    const outerRadius = this.radius * 2.2;

    this.ringMaterial = new THREE.ShaderMaterial({
      vertexShader: RingShader.vertex,
      fragmentShader: RingShader.fragment,
      uniforms: {
        uColor: { value: new THREE.Vector3(ringColor.r, ringColor.g, ringColor.b) },
        uOpacity: { value: 0.5 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128, 1);
    this.ringMesh = new THREE.Mesh(ringGeo, this.ringMaterial);
    this.ringMesh.rotation.x = -Math.PI / 2 + 0.15; // slight tilt
    this.ringMesh.receiveShadow = true;
    this.group.add(this.ringMesh);
  }

  /** Get the main mesh for raycasting / click detection */
  get clickTarget() {
    return this.planetMesh;
  }

  /** Update shader time uniform */
  update(time) {
    this.planetMaterial.uniforms.uTime.value = time;
  }

  /** Set world position */
  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  dispose() {
    this.planetMesh.geometry.dispose();
    this.planetMaterial.dispose();
    this.atmosphereMesh.geometry.dispose();
    this.atmosphereMaterial.dispose();
    if (this.ringMesh) {
      this.ringMesh.geometry.dispose();
      this.ringMaterial.dispose();
    }
  }
}
