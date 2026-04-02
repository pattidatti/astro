import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { ColorGradeShader } from '../shaders/effects/ColorGradeShader.js';

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
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Shadow maps
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    this.composer = null;
    this.bloomPass = null;
    this.godRayPass = null;
    this.colorGradePass = null;
  }

  setupPostProcessing(scene, camera) {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    // Bloom: aggressive settings — low threshold lets nebula and planet glow bleed through
    this.bloomPass = new UnrealBloomPass(size, 0.8, 0.6, 0.55);
    this.composer.addPass(this.bloomPass);

    // God ray pass slot — filled in by addGodRayPass() when Step 6 is wired
    // (placeholder kept for correct ordering)

    // Color grading: S-curve, cool shadows/warm highlights, saturation, vignette, CA
    this.colorGradePass = new ShaderPass(ColorGradeShader);
    this.composer.addPass(this.colorGradePass);
  }

  /** Called by Game.js each frame to advance time-based uniforms. */
  tick(time) {
  }

  /**
   * Insert god ray pass into the composer chain after bloom.
   * Called by RenderPipeline itself when GodRayShader is registered (Step 6).
   * @param {object} GodRayShader
   */
  addGodRayPass(GodRayShader) {
    if (this.godRayPass) return;

    // Dispose old passes to free WebGL render targets before rebuilding
    if (this.bloomPass)      this.bloomPass.dispose();
    if (this.colorGradePass) this.colorGradePass.dispose();

    // Rebuild composer with god ray pass inserted after bloom
    const scene = this.composer.passes[0].scene;
    const camera = this.composer.passes[0].camera;
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

    this.composer.passes.length = 0;
    this.composer.addPass(new RenderPass(scene, camera));

    this.bloomPass = new UnrealBloomPass(size, 0.8, 0.6, 0.55);
    this.composer.addPass(this.bloomPass);

    this.godRayPass = new ShaderPass(GodRayShader);
    this.godRayPass.uniforms.uLightPos.value = new THREE.Vector2(0.5, 0.5);
    this.godRayPass.uniforms.uEnabled.value = 0.0;
    this.composer.addPass(this.godRayPass);

    this.colorGradePass = new ShaderPass(ColorGradeShader);
    this.composer.addPass(this.colorGradePass);
  }

  /**
   * Set the screen-space position and intensity for god rays.
   * @param {THREE.Vector2} screenUV - screen UV (0-1)
   * @param {number} intensity - 0 = off, 1 = full
   */
  setGodRaySource(screenUV, intensity) {
    if (!this.godRayPass) return;
    this.godRayPass.uniforms.uLightPos.value.copy(screenUV);
    this.godRayPass.uniforms.uEnabled.value = intensity;
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
