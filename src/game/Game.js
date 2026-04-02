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
import { EnemyManager3D } from './world/EnemyManager3D.js';
import { SpawnFlight } from './effects/SpawnFlight.js';
import { CombatEffects } from './effects/CombatEffects.js';

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

  // Wire delivery ceremony: robot arrival → clickFeedback burst at station
  galaxy.setDeliveryCallback((worldPos, amount) => {
    clickFeedback.deliveryBurst(worldPos, amount);
  });

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
        // Unowned planet — need colony ship to colonize
        AudioManager.play('COLONIZE_DENIED');
      }

      cameraController.trackObject(() => system.planetWorldPosition, 55);
    });
  }

  // Register station click targets
  for (const target of galaxy.getStationClickTargets()) {
    inputManager.addClickable(target.mesh, () => {
      AudioManager.play('PLANET_CLICK_3D');
      cameraController.trackObject(() => target.system.stationWorldPosition, 12);
    });
  }

  // --- Ships ---
  const shipManager = new ShipManager3D(sceneManager.scene, animationLoop, galaxy);

  // --- Enemy ships + combat effects ---
  const enemyManager = new EnemyManager3D(sceneManager.scene, animationLoop, galaxy);
  const combatEffects = new CombatEffects(sceneManager.scene);

  // Combat visual events
  gameState.on('defenseFired', ({ planetId, defenseType, targetId, damage }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const stationPos = galaxy.getSystem(planetId)?.stationWorldPosition;
    // Find target position from enemy manager (approximate from planet pos)
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (stationPos && planetPos) {
      // Target position: offset from planet toward a random orbit point
      const angle = Math.random() * Math.PI * 2;
      const targetPos = planetPos.clone();
      targetPos.x += Math.cos(angle) * 13;
      targetPos.z += Math.sin(angle) * 13;
      targetPos.y += (Math.random() - 0.5) * 4;
      combatEffects.laser(stationPos, targetPos, defenseType === 'satellite' ? 0x44aaff : 0xff4444);
    }
  });

  gameState.on('enemyDestroyed', ({ planetId, enemy }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (planetPos) {
      const pos = planetPos.clone();
      pos.x += (Math.random() - 0.5) * 20;
      pos.y += (Math.random() - 0.5) * 6;
      pos.z += (Math.random() - 0.5) * 20;
      combatEffects.explosion(pos, enemy.type === 'bomber' ? 1.5 : 1.0);
      cameraController.shake(0.02, 0.2);
    }
  });

  gameState.on('mothershipDestroyed', ({ planetId }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (planetPos) {
      const pos = planetPos.clone();
      pos.y += 8;
      combatEffects.explosion(pos, 3.0, 0xff2200);
      cameraController.shake(0.08, 0.5);
    }
  });

  gameState.on('shieldDamaged', ({ planetId }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const sys = galaxy.getSystem(planetId);
    if (sys) combatEffects.shieldHit(sys.stationWorldPosition);
  });

  gameState.on('abilityActivated', ({ planetId, abilityId }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (!planetPos) return;
    if (abilityId === 'emp') combatEffects.empBurst(planetPos);
    if (abilityId === 'orbitalStrike') combatEffects.orbitalStrike(planetPos);
    if (abilityId === 'shieldBoost') {
      const sys = galaxy.getSystem(planetId);
      if (sys) combatEffects.shieldHit(sys.stationWorldPosition, 0x44ff88);
    }
    cameraController.zoomPunch(0.06);
  });

  gameState.on('planetFell', (planetId) => {
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (planetPos) {
      combatEffects.explosion(planetPos, 4.0, 0xff0000);
      cameraController.shake(0.15, 0.8);
      cameraController.zoomPunch(0.1);
    }
  });

  // Update station damage visuals per-frame
  gameState.on('stationDamaged', ({ planetId }) => {
    const sys = galaxy.getSystem(planetId);
    const ps = gameState.getPlanetState(planetId);
    if (sys?.station && ps) {
      sys.station.setDamageState(ps.combat.stationHP / ps.combat.stationMaxHP);
    }
  });

  gameState.on('repairTick', ({ planetId }) => {
    const sys = galaxy.getSystem(planetId);
    const ps = gameState.getPlanetState(planetId);
    if (sys?.station && ps) {
      sys.station.setDamageState(ps.combat.stationHP / ps.combat.stationMaxHP);
    }
  });

  // --- Spawn flight: robot flies from panel to station ---
  const spawnFlight = new SpawnFlight(sceneManager.scene, camera, galaxy);
  spawnFlight.onArrival = (worldPos) => {
    clickFeedback.spawnBurst(worldPos);
  };
  gameState.on('robotHired', ({ planetId, robotType }) => {
    spawnFlight.launch(planetId, robotType);
    cameraController.zoomPunch(0.03);
  });

  // --- Camera punch + shockwave on upgrades/colonization ---
  gameState.on('baseUpgraded', ({ planetId }) => {
    cameraController.zoomPunch(0.05);
    const sys = galaxy.getSystem(planetId);
    if (sys) clickFeedback.shockwave(sys.stationWorldPosition);
  });
  gameState.on('planetColonized', (id) => {
    cameraController.zoomPunch(0.08);
    const sys = galaxy.getSystem(id);
    if (sys) clickFeedback.shockwave(sys.planetWorldPosition);
  });

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

  // Colony ship camera follow during flight
  gameState.on('colonyShipLaunched', (data) => {
    const getPos = () => shipManager.getColonyShipPosition(data.id);
    cameraController.trackObject(getPos, 20);
  });
  gameState.on('colonyShipArrived', (data) => {
    const sys = galaxy.getSystem(data.toPlanetId);
    if (sys) cameraController.trackObject(() => sys.planetWorldPosition, 55);
  });

  // Colony ship built: register click target
  gameState.on('colonyShipBuilt', ({ fromPlanetId }) => {
    const sys = galaxy.getSystem(fromPlanetId);
    if (!sys || !sys.colonyShip) return;
    const hitbox = sys.colonyShip.hitbox;
    hitbox.userData.colonyShipPlanetId = fromPlanetId;
    inputManager.addClickable(hitbox, () => {
      AudioManager.play('PLANET_CLICK_3D');
      // The popup is managed by PlanetPanel — it listens for this event
      gameState.emit('colonyShipClicked', { planetId: fromPlanetId });
    });
  });

  // Colony ship launched: unregister click target
  gameState.on('colonyShipLaunched', (data) => {
    const sys = galaxy.getSystem(data.fromPlanet);
    if (sys?.colonyShip) {
      inputManager.removeClickable(sys.colonyShip.hitbox);
    }
  });

  // Reusable vector to avoid per-frame allocation for god rays
  const _godRayUV = new THREE.Vector2();
  const _godRayNDC = new THREE.Vector3();

  // Per-frame update
  animationLoop.onUpdate((dt, time) => {
    galaxy.update(camera, dt, time);
    skybox.update(time, camera);
    clickFeedback.update(dt);
    combatEffects.update(dt);
    spawnFlight.update(dt);
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
