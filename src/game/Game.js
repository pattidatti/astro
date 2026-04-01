import * as THREE from 'three';
import { AudioManager } from './audio/AudioManager.js';
import { PLANETS } from './data/planets.js';
import { SceneManager } from './engine/SceneManager.js';
import { CameraController } from './engine/CameraController.js';
import { RenderPipeline } from './engine/RenderPipeline.js';
import { AnimationLoop } from './engine/AnimationLoop.js';
import { InputManager } from './engine/InputManager.js';
import { gameState } from './GameState.js';
import { Galaxy } from './world/Galaxy.js';
import { Skybox } from './world/Skybox.js';
import { ClickFeedback } from './effects/ClickFeedback.js';
import { GodRayShader } from './shaders/effects/GodRayShader.js';
import { ShipManager3D } from './world/ShipManager3D.js';

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
  renderPipeline.addGodRayPass(GodRayShader);

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

  // Planet collision colliders — use live position getters for orbiting planets
  const planetColliders = Object.values(galaxy.systems).map(sys => ({
    get position() { return sys.planetWorldPosition; },
    radius: sys.planet.radius,
  }));
  cameraController.setPlanetColliders(planetColliders);

  // Register click targets
  for (const target of galaxy.getClickTargets()) {
    inputManager.addClickable(target.mesh, (hit) => {
      const { planetId, system } = target;

      if (gameState.ownedPlanets.includes(planetId)) {
        AudioManager.play('PLANET_CLICK_3D');
        gameState.switchPlanet(planetId);
      } else {
        // Colonize from the currently focused planet
        const toDef = PLANETS.find(p => p.id === planetId);
        const { ore: oreCost = 0, energy: energyCost = 0 } = toDef?.baseCost ?? {};
        const canAfford = gameState.siloHas(gameState.focusedPlanet, 'ore', oreCost) &&
                          gameState.siloHas(gameState.focusedPlanet, 'energy', energyCost);
        AudioManager.play(canAfford ? 'PLANET_CLICK_3D' : 'COLONIZE_DENIED');
        gameState.colonizePlanet(gameState.focusedPlanet, planetId);
      }

      cameraController.trackObject(() => system.planetWorldPosition, 55);
    });
  }

  // --- Ships ---
  const shipManager = new ShipManager3D(sceneManager.scene, animationLoop, galaxy);

  // Focus on active planet at start — track the orbiting planet
  const startSystem = galaxy.getSystem(gameState.activePlanet);
  if (startSystem) {
    const startPos = startSystem.planetWorldPosition;
    cameraController.targetTarget.copy(startPos);
    cameraController.target.copy(startPos);
    cameraController.spherical.radius = 30;
    cameraController.targetSpherical.radius = 30;
    cameraController.trackObject(() => startSystem.planetWorldPosition, 55);
  }

  // Planet events — track orbiting planet position
  gameState.on('planetChanged', (id) => {
    const system = galaxy.getSystem(id);
    if (system) cameraController.trackObject(() => system.planetWorldPosition, 55);
    skybox.setPlanetPalette(gameState.activePlanetDef);
  });
  gameState.on('planetColonized', (id) => {
    const system = galaxy.getSystem(id);
    if (system) cameraController.trackObject(() => system.planetWorldPosition, 55);
    skybox.setPlanetPalette(gameState.activePlanetDef);
  });

  // Reusable vector to avoid per-frame allocation for god rays
  const _godRayUV = new THREE.Vector2();
  const _godRayNDC = new THREE.Vector3();

  // Per-frame update
  animationLoop.onUpdate((dt, time) => {
    galaxy.update(camera, dt, time);
    skybox.update(time, camera);
    clickFeedback.update(dt);
    renderPipeline.tick(time);

    // God rays: activate when a star-type planet is near and on-screen
    const activeDef = gameState.activePlanetDef;
    if (activeDef?.type === 'star') {
      const sys = galaxy.getSystem(activeDef.id);
      if (sys) {
        _godRayNDC.copy(sys.worldPosition).project(camera);
        _godRayUV.set((_godRayNDC.x + 1) * 0.5, (_godRayNDC.y + 1) * 0.5);
        const dist = camera.position.distanceTo(sys.worldPosition);
        const onScreen = Math.abs(_godRayNDC.x) < 1.8 && Math.abs(_godRayNDC.y) < 1.8 && _godRayNDC.z < 1.0;
        const intensity = THREE.MathUtils.smoothstep(350, 80, dist);
        renderPipeline.setGodRaySource(_godRayUV, onScreen ? intensity : 0.0);
      }
    } else {
      renderPipeline.setGodRaySource(_godRayUV.set(0.5, 0.5), 0.0);
    }
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
    shipManager,
  };
}
