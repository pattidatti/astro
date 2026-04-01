import * as THREE from 'three';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();

    // Subtle fog for depth cue at galaxy scale
    this.scene.fog = new THREE.FogExp2(0x0a0e14, 0.0008);

    this.setupLighting();
  }

  setupLighting() {
    // Directional sun — warm white, with shadow casting
    this.sunLight = new THREE.DirectionalLight(0xfff5e0, 0.5);
    this.sunLight.position.set(50, 30, -20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -30;
    this.sunLight.shadow.camera.right = 30;
    this.sunLight.shadow.camera.top = 30;
    this.sunLight.shadow.camera.bottom = -30;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);

    // Ambient fill — slightly bluer, low intensity
    this.ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.25);
    this.scene.add(this.ambientLight);

    // Hemisphere light — cool sky, warm ground
    this.hemiLight = new THREE.HemisphereLight(0x2244aa, 0x221100, 0.18);
    this.scene.add(this.hemiLight);
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }
}
