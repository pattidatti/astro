import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class RenderPipeline {
  constructor(container) {
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0e14, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Shadow maps
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    this.composer = null;
    this.bloomPass = null;
  }

  setupPostProcessing(scene, camera) {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    // Bloom: moderate strength, wide radius, threshold lets only bright emissives through
    this.bloomPass = new UnrealBloomPass(size, 0.5, 1.0, 0.75);
    this.composer.addPass(this.bloomPass);

    this.composer.addPass(new OutputPass());
  }

  render() {
    if (this.composer) {
      this.composer.render();
    }
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  get domElement() {
    return this.renderer.domElement;
  }
}
