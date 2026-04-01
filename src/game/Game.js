import * as THREE from 'three';
import { SceneManager } from './engine/SceneManager.js';
import { CameraController } from './engine/CameraController.js';
import { RenderPipeline } from './engine/RenderPipeline.js';
import { AnimationLoop } from './engine/AnimationLoop.js';
import { InputManager } from './engine/InputManager.js';
import { gameState } from './GameState.js';
import { Galaxy } from './world/Galaxy.js';
import { Skybox } from './world/Skybox.js';
import { ClickFeedback } from './effects/ClickFeedback.js';

export function createGame() {
  const container = document.getElementById('game-container');

  // Render pipeline
  const renderPipeline = new RenderPipeline(container);

  // Scene
  const sceneManager = new SceneManager();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  const cameraController = new CameraController(camera, renderPipeline.domElement);

  // Post-processing
  renderPipeline.setupPostProcessing(sceneManager.scene, camera);

  // Input
  const inputManager = new InputManager(
    camera,
    sceneManager.scene,
    renderPipeline.domElement,
    cameraController
  );

  // Animation loop
  const animationLoop = new AnimationLoop(renderPipeline, cameraController, sceneManager);

  // --- Skybox ---
  const skybox = new Skybox(sceneManager.scene);
  skybox.setPlanetPalette(gameState.activePlanetDef);

  // --- Click feedback ---
  const clickFeedback = new ClickFeedback(sceneManager.scene);

  // --- Galaxy ---
  const galaxy = new Galaxy();
  sceneManager.add(galaxy.group);

  // Register click targets
  for (const target of galaxy.getClickTargets()) {
    inputManager.addClickable(target.mesh, (hit) => {
      const { planetId, system } = target;
      const zoomLevel = cameraController.getZoomLevel();

      if ((zoomLevel === 'planet' || zoomLevel === 'close') && gameState.activePlanet === planetId) {
        // Mine ore + visual feedback
        gameState.addOre(gameState.clickPow);

        // 3D click feedback at hit point
        const worldPoint = hit.point;
        const normal = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize() : new THREE.Vector3(0, 1, 0);
        clickFeedback.spawn(worldPoint, normal, gameState.clickPow);
      } else if (gameState.ownedPlanets.includes(planetId)) {
        gameState.switchPlanet(planetId);
      } else {
        gameState.colonizePlanet(planetId);
      }

      cameraController.focusOnPosition(system.worldPosition, 30);
    });
  }

  // Focus on active planet at start
  const startPos = galaxy.getPosition(gameState.activePlanet);
  if (startPos) {
    cameraController.targetTarget.copy(startPos);
    cameraController.target.copy(startPos);
    cameraController.spherical.radius = 30;
    cameraController.targetSpherical.radius = 30;
  }

  // Planet events
  gameState.on('planetChanged', (id) => {
    const pos = galaxy.getPosition(id);
    if (pos) cameraController.focusOnPosition(pos, 30);
    skybox.setPlanetPalette(gameState.activePlanetDef);
  });
  gameState.on('planetColonized', (id) => {
    const pos = galaxy.getPosition(id);
    if (pos) cameraController.focusOnPosition(pos, 30);
    skybox.setPlanetPalette(gameState.activePlanetDef);
  });

  // Per-frame update
  animationLoop.onUpdate((dt, time) => {
    galaxy.update(camera, dt, time);
    skybox.update(time);
    clickFeedback.update(dt);
  });

  // Handle resize
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderPipeline.resize(w, h);
    skybox.resize(w, h);
  });

  // Start
  animationLoop.start();

  return {
    sceneManager,
    camera,
    cameraController,
    renderPipeline,
    animationLoop,
    inputManager,
    galaxy,
    skybox,
  };
}
