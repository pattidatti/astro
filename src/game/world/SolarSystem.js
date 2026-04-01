import * as THREE from 'three';
import { Planet3D } from '../objects/Planet3D.js';
import { Station3D } from '../objects/Station3D.js';
import { RobotManager3D } from '../objects/RobotManager3D.js';
import { DustCloud } from '../effects/DustCloud.js';
import { NebulaVolume } from '../effects/NebulaVolume.js';
import { LensFlare } from '../effects/LensFlare.js';
import { gameState } from '../GameState.js';

/**
 * A SolarSystem groups Planet3D + Station3D + Robots + visual effects.
 * Manages LOD visibility for its children.
 */
export class SolarSystem {
  constructor(planetDef, worldPosition) {
    this.id = planetDef.id;
    this.def = planetDef;
    this.group = new THREE.Group();
    this.group.position.copy(worldPosition);
    this.group.userData.type = 'solarSystem';
    this.group.userData.planetId = planetDef.id;

    // Planet
    this.planet = new Planet3D(planetDef);
    this.group.add(this.planet.group);

    // Station
    this.station = new Station3D();
    this.group.add(this.station.group);

    // Robots
    this.robotManager = new RobotManager3D();
    this.group.add(this.robotManager.group);
    this._lastStationSync = 0;

    // Dust cloud (tinted to planet glow)
    this.dustCloud = new DustCloud(planetDef.glow);
    this.group.add(this.dustCloud.group);

    // Nebula volume behind planet
    const nebColors = planetDef.nebulaPalette?.colors || ['#110022', '#220044'];
    this.nebulaVolume = new NebulaVolume(nebColors[1] || nebColors[0], nebColors[3] || nebColors[1], 35);
    this.nebulaVolume.mesh.position.set(0, 0, -20); // behind planet
    this.group.add(this.nebulaVolume.mesh);

    // Lens flare for star-type planets
    this.lensFlare = null;
    if (planetDef.type === 'star') {
      this.lensFlare = new LensFlare(planetDef.glow, 1.0);
      this.group.add(this.lensFlare.group);
    }

    // Rim light — positioned opposite the sun for artistic back-lighting
    const glowColor = new THREE.Color(planetDef.glow);
    this.rimLight = new THREE.PointLight(glowColor, 0.8, 50, 1.5);
    this.rimLight.position.set(-8, 3, 12);
    this.group.add(this.rimLight);

    // Fill light — softer, from below for dramatic uplighting
    const fillColor = glowColor.clone().lerp(new THREE.Color(0xffffff), 0.3);
    this.fillLight = new THREE.PointLight(fillColor, 0.3, 35, 2);
    this.fillLight.position.set(5, -6, 5);
    this.group.add(this.fillLight);

    // Label sprite
    this._createLabel(planetDef.name);

    // Robot sync
    this._onRobotsChanged = () => this._syncRobots();
    this._onPlanetChanged = () => this._syncRobots();
    this._onStateLoaded = () => this._syncRobots();
    this._syncRobots();
    gameState.on('robotsChanged', this._onRobotsChanged);
    gameState.on('planetChanged', this._onPlanetChanged);
    gameState.on('stateLoaded', this._onStateLoaded);
  }

  _syncRobots() {
    const isActive = gameState.activePlanet === this.id;
    const count = isActive ? gameState.robots : 0;
    this.robotManager.syncCount(count);
  }

  _createLabel(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 32px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c8a84e';
    ctx.fillText(name, 128, 42);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    this.label = new THREE.Sprite(mat);
    this.label.scale.set(12, 3, 1);
    this.label.position.set(0, 14, 0);
    this.group.add(this.label);
  }

  get clickTarget() {
    return this.planet.clickTarget;
  }

  get worldPosition() {
    return this.group.position;
  }

  /**
   * Update LOD based on camera distance.
   * @param {number} distance - Distance from camera to this system
   * @param {number} time - Elapsed time
   * @param {number} dt - Delta time
   * @param {THREE.Camera} camera - For billboard effects
   */
  updateLOD(distance, time, dt, camera) {
    // Planet shader
    if (distance < 80) {
      this.planet.update(time);
    }

    // Station
    const stationVisible = distance < 60;
    this.station.group.visible = stationVisible;
    if (stationVisible) {
      this.station.update(time);
      if (time - this._lastStationSync > 0.2) {
        this._lastStationSync = time;
        this.robotManager.setStationPosition(this.station.group.position);
      }
    }

    // Robots
    const robotsVisible = distance < 45;
    this.robotManager.group.visible = robotsVisible;
    if (robotsVisible && dt !== undefined) {
      this.robotManager.update(dt, time);
    }

    // Dust cloud: visible at medium range
    const dustVisible = distance < 80;
    this.dustCloud.group.visible = dustVisible;
    if (dustVisible && dt !== undefined) {
      this.dustCloud.update(dt, time);
    }

    // Nebula volume: visible at medium-far range
    const nebVisible = distance < 150;
    this.nebulaVolume.mesh.visible = nebVisible;
    if (nebVisible && camera) {
      this.nebulaVolume.update(time, camera);
    }

    // Lens flare (star-type only)
    if (this.lensFlare) {
      this.lensFlare.group.visible = distance < 200;
      if (this.lensFlare.group.visible && camera) {
        this.lensFlare.update(camera, time);
      }
    }

    // Label
    this.label.visible = distance > 15 && distance < 300;
    if (this.label.visible) {
      const s = Math.min(1.0, distance / 50);
      this.label.scale.set(12 * s, 3 * s, 1);
    }

    // Atmosphere
    if (this.planet.atmosphereMesh) {
      this.planet.atmosphereMesh.visible = distance < 120;
    }

    // Rings
    if (this.planet.ringMesh) {
      this.planet.ringMesh.visible = distance < 100;
    }

    // Lights
    this.rimLight.visible = distance < 60;
    this.fillLight.visible = distance < 60;
  }

  dispose() {
    gameState.off('robotsChanged', this._onRobotsChanged);
    gameState.off('planetChanged', this._onPlanetChanged);
    gameState.off('stateLoaded', this._onStateLoaded);
    this.planet.dispose();
    this.station.dispose();
    this.robotManager.dispose();
    this.dustCloud.dispose();
    this.nebulaVolume.dispose();
    if (this.lensFlare) this.lensFlare.dispose();
    if (this.label) {
      this.label.material.map.dispose();
      this.label.material.dispose();
    }
  }
}
