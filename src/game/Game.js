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
import { GodRayShader } from './shaders/effects/GodRayShader.js';
import { WarpDistortionShader } from './shaders/effects/WarpDistortionShader.js';
import { ShipManager3D } from './world/ShipManager3D.js';
import { EnemyManager3D } from './world/EnemyManager3D.js';
import { SpawnFlight } from './effects/SpawnFlight.js';
import { CombatEffects } from './effects/CombatEffects.js';
import { ClickFeedback } from './effects/ClickFeedback.js';
import { Minimap } from './ui/Minimap.js';
import { RoamingFleetManager3D } from './world/RoamingFleetManager3D.js';
import { EnemyStationManager3D } from './world/EnemyStationManager3D.js';
import { PlayerFleetManager3D } from './world/PlayerFleetManager3D.js';
import { FleetPanel } from './ui/FleetPanel.js';
import { MilitaryPanel } from './ui/MilitaryPanel.js';
import { PlayerFleetPanel } from './ui/PlayerFleetPanel.js';
import { EnemyStationPanel } from './ui/EnemyStationPanel.js';
import { MILITARY_SHIPS } from './data/militaryShips.js';

// Pre-built lookups — avoids O(n) PLANETS.find() calls inside hot paths
const PLANET_MAP = new Map(PLANETS.map(p => [p.id, p]));
const RES_ICONS  = { ore: '⬡', energy: '⚡', crystal: '◈' };

// Pre-allocated vectors for per-frame projections
const _shipNDC       = new THREE.Vector3();
const _waypointNDC   = new THREE.Vector3();

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
  renderPipeline.addWarpPass();

  // Input
  const inputManager = new InputManager(
    camera,
    sceneManager.scene,
    renderPipeline.domElement,
    cameraController
  );

  // Animation loop
  const animationLoop = new AnimationLoop(renderPipeline, cameraController, sceneManager);

  // --- RTS overlay DOM elements ---
  const _rtsSelectBox = document.createElement('div');
  _rtsSelectBox.id = 'rts-select-box';
  document.getElementById('hud-overlay').appendChild(_rtsSelectBox);
  inputManager._boxSelectEl = _rtsSelectBox;

  const _rtsIndicator = document.createElement('div');
  _rtsIndicator.id = 'rts-mode-indicator';
  _rtsIndicator.innerHTML =
    '<div class="rts-dot"></div>' +
    '<div class="rts-label">ADMIRAL MODE</div>' +
    '<div class="rts-hint">[V] to exit · LMB drag: select · RMB: waypoint</div>';
  document.getElementById('hud-overlay').appendChild(_rtsIndicator);

  const _rtsWaypointLabel = document.createElement('div');
  _rtsWaypointLabel.id = 'rts-waypoint-label';
  _rtsWaypointLabel.textContent = 'WAYPOINT';
  document.getElementById('hud-overlay').appendChild(_rtsWaypointLabel);

  // Toggle indicator pill when RTS mode changes
  const _origToggleRTS = cameraController.toggleRTSMode.bind(cameraController);
  cameraController.toggleRTSMode = () => {
    _origToggleRTS();
    _rtsIndicator.classList.toggle('visible', cameraController.isRTSMode);
    if (!cameraController.isRTSMode) {
      // Hide waypoint label when leaving RTS
      _rtsWaypointLabel.style.display = 'none';
    }
  };

  // --- Skybox ---
  const skybox = new Skybox(sceneManager.scene);
  skybox.setPlanetPalette(gameState.activePlanetDef);

  // --- Click feedback (delivery burst + shockwave) ---
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

  // Wire delivery burst feedback to all stations
  galaxy.setDeliveryCallback((worldPos, amount) => {
    clickFeedback.deliveryBurst(worldPos, amount);
  });

  // --- Ship tooltip ---
  let _selectedShipId   = null;
  let _selectedShipData = null; // cached reference — updated on select, cleared on deselect
  const _shipTooltipEl = document.createElement('div');
  _shipTooltipEl.id = 'ship-tooltip';
  _shipTooltipEl.style.display = 'none';
  document.getElementById('hud-overlay').appendChild(_shipTooltipEl);

  // --- Lock-on tooltip (for defense objects and ships) ---
  const _lockOnTooltipEl = document.getElementById('lockOn-tooltip');
  let _lockOnSource = null; // 'defense' | 'shipHover' | null
  const _lockOnTooltip = {
    show(infoFn) {
      const info = typeof infoFn === 'function' ? infoFn() : infoFn;
      if (!_lockOnTooltipEl) return;
      const subtitleLine = info.subtitle !== undefined
        ? `<div class="lockon-level">${info.subtitle}</div>`
        : `<div class="lockon-level">Level ${info.level}</div>`;
      _lockOnTooltipEl.innerHTML =
        `<div class="lockon-label">LOCK-ON</div>` +
        `<div class="lockon-type">${info.type.toUpperCase()}</div>` +
        subtitleLine;
      _lockOnTooltipEl.style.display = 'block';
    },
    hide() {
      if (_lockOnTooltipEl) _lockOnTooltipEl.style.display = 'none';
    },
  };

  const _fmtEta = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  const _deselectShip = () => {
    _selectedShipId   = null;
    _selectedShipData = null;
    _shipTooltipEl.style.display = 'none';
    _lockOnTooltip.hide();
    _lockOnSource = null;
  };

  gameState.on('cargoShipClicked', ({ shipId }) => {
    const ship = gameState.activeShips.find(s => s.id === shipId);
    if (!ship) return;
    _selectedShipId   = shipId;
    _selectedShipData = ship; // cache reference — properties (t, duration) stay live
    cameraController.trackObject(() => shipManager.getShipPosition(shipId), 15);
  });

  gameState.on('colonyShipInFlightClicked', ({ shipId }) => {
    cameraController.trackObject(() => shipManager.getColonyShipPosition(shipId), 20);
  });

  gameState.on('shipArrived', (data) => {
    if (data.id === _selectedShipId) _deselectShip();
  });

  // Register click targets
  for (const target of galaxy.getClickTargets()) {
    inputManager.addClickable(target.mesh, (hit) => {
      const { planetId, system } = target;
      _deselectShip();

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
      _deselectShip();
      AudioManager.play('PLANET_CLICK_3D');
      cameraController.trackObject(() => target.system.stationWorldPosition, 12);
    });
  }

  // Register defense lock-on targets (satellites + patrol ships — all hitboxes pre-created)
  for (const target of galaxy.getDefenseLockOnTargets()) {
    inputManager.addClickable(target.mesh, () => {
      if (!target.isActive()) return;   // object is pooled/inactive — ignore click
      _deselectShip();
      AudioManager.play('PLANET_CLICK_3D');
      cameraController.trackObject(target.getWorldPosition, 10);
      _lockOnSource = 'defense';
      _lockOnTooltip.show(target.info);
    });
  }

  // --- Ships ---
  const shipManager = new ShipManager3D(sceneManager.scene, animationLoop, galaxy, inputManager);

  // Register ship hover callback for lock-on tooltip
  inputManager.onHoverShip((shipId) => {
    if (!shipId) {
      if (_lockOnSource === 'shipHover') {
        _lockOnTooltip.hide();
        _lockOnSource = null;
      }
      return;
    }

    // Is it a cargo ship?
    const cargo = gameState.activeShips.find(s => s.id === shipId);
    if (cargo) {
      const fromDef = PLANETS.find(p => p.id === cargo.fromPlanet);
      const toDef   = PLANETS.find(p => p.id === cargo.toPlanet);
      _lockOnSource = 'shipHover';
      _lockOnTooltip.show({ type: 'Cargo Ship', subtitle: `${fromDef?.name || cargo.fromPlanet} → ${toDef?.name || cargo.toPlanet}` });
      return;
    }

    // Is it an arriving colony ship?
    const arriving = gameState.colonyShipsArriving.find(s => s.id === shipId);
    if (arriving) {
      const toDef = PLANETS.find(p => p.id === arriving.toPlanetId);
      _lockOnSource = 'shipHover';
      _lockOnTooltip.show({ type: 'Colony Ship', subtitle: `→ ${toDef?.name || arriving.toPlanetId}` });
      return;
    }

    // Is it an in-flight colony ship?
    const inFlight = gameState.colonyShipsInFlight.find(s => s.id === shipId);
    if (inFlight) {
      const toDef = PLANETS.find(p => p.id === inFlight.toPlanetId);
      _lockOnSource = 'shipHover';
      _lockOnTooltip.show({ type: 'Colony Ship', subtitle: `→ ${toDef?.name || inFlight.toPlanetId}` });
    }
  });

  // --- Enemy ships + combat effects ---
  const combatEffects = new CombatEffects(sceneManager.scene);
  const enemyManager = new EnemyManager3D(sceneManager.scene, animationLoop, galaxy, combatEffects);

  // --- Roaming fleet visuals ---
  const fleetManager = new RoamingFleetManager3D(sceneManager.scene, galaxy);
  galaxy.roamingFleetManager = fleetManager;

  // --- Enemy station visuals ---
  const stationManager = new EnemyStationManager3D(sceneManager.scene, combatEffects);
  galaxy.enemyStationManager = stationManager;

  // --- Fleet info panel ---
  const fleetPanel = new FleetPanel();
  let _selectedFleetId = null;

  // --- Military base panel ---
  const militaryPanel = new MilitaryPanel();

  // --- Player fleet visuals + RTS selection ---
  const playerFleetManager = new PlayerFleetManager3D(sceneManager.scene);
  const _selectedPlayerFleets = new Set(); // Set<fleetId>
  const playerFleetPanel = new PlayerFleetPanel();

  // --- Enemy station panel ---
  const enemyStationPanel = new EnemyStationPanel();

  const _registerPlayerFleetClicks = () => {
    for (const target of playerFleetManager.getClickTargets()) {
      if (target.mesh.userData._playerFleetClickBound) continue;
      target.mesh.userData._playerFleetClickBound = true;
      inputManager.addClickable(target.mesh, () => {
        // Toggle selection of this fleet and show/hide info panel
        if (_selectedPlayerFleets.has(target.fleetId)) {
          _selectedPlayerFleets.delete(target.fleetId);
          if (playerFleetPanel._fleetId === target.fleetId) playerFleetPanel.hide();
        } else {
          _selectedPlayerFleets.add(target.fleetId);
          AudioManager.play('PLANET_CLICK_3D');
          playerFleetPanel.show(target.fleetId, {
            onClose: () => _selectedPlayerFleets.delete(target.fleetId),
            onTitan: (fId) => {
              const ok = gameState.useTitanUltimate(fId);
              if (!ok) AudioManager.play('UI_CLICK_DENIED');
            },
            onJump: (fId, targetPlanetId) => {
              const ok = gameState.dispatchEmergencyJump(fId, targetPlanetId);
              if (!ok) AudioManager.play('UI_CLICK_DENIED');
            },
          });
        }
      });
    }
    // Refresh selectable mesh list for frustum box-select
    inputManager.setPlayerFleetMeshes(playerFleetManager.getSelectableMeshes());
  };

  gameState.on('playerFleetSpawned', () => {
    requestAnimationFrame(_registerPlayerFleetClicks);
  });
  // Restore fleets that exist in save on load
  gameState.on('stateLoaded', () => {
    requestAnimationFrame(_registerPlayerFleetClicks);
  });

  // Helper to hide military panel when a planet is clicked / focused
  const _hideMilitaryPanel = () => militaryPanel.hide();
  gameState.on('planetChanged', _hideMilitaryPanel);

  const _deselectFleet = () => {
    _selectedFleetId = null;
    fleetPanel.hide();
  };

  // Register fleet click targets (re-registers when new fleets spawn since InputManager
  // supports dynamic registration via addClickable)
  const _registerFleetClicks = () => {
    for (const target of galaxy.getFleetClickTargets()) {
      // Avoid double-registering the same mesh
      if (target.mesh.userData._fleetClickBound) continue;
      target.mesh.userData._fleetClickBound = true;
      inputManager.addClickable(target.mesh, () => {
        const fleet = gameState.roamingFleets.find(f => f.id === target.fleetId);
        if (!fleet) return;
        _deselectShip();
        _selectedFleetId = target.fleetId;
        AudioManager.play('PLANET_CLICK_3D');
        fleetPanel.show(fleet.id, () => {
          _selectedFleetId = null;
          cameraController.stopTracking();
        });
        const fleet3D = fleetManager.getFleet3D(fleet.id);
        if (fleet3D) {
          cameraController.trackObject(() => fleet3D.worldPosition, 50);
        }
      });
    }
  };

  gameState.on('fleetSpawned', () => {
    // Defer by one frame so RoamingFleetManager3D has time to activate the 3D object
    requestAnimationFrame(_registerFleetClicks);
  });

  gameState.on('fleetArrived',   ({ fleetId }) => { if (fleetId === _selectedFleetId) _deselectFleet(); });
  gameState.on('fleetDestroyed', ({ fleetId }) => { if (fleetId === _selectedFleetId) _deselectFleet(); });

  // Register military base click target for a planet system
  const _registerMilitaryBaseClick = (planetId) => {
    const sys = galaxy.getSystem(planetId);
    const mesh = sys?.militaryBaseClickTarget;
    if (!mesh || mesh.userData._milClickBound) return;
    mesh.userData._milClickBound = true;
    inputManager.addClickable(mesh, () => {
      _deselectShip();
      AudioManager.play('PLANET_CLICK_3D');
      gameState.emit('militaryBaseClicked', planetId); // PlanetPanel listens → hides
      militaryPanel.show(planetId);
      // Track camera to the base
      cameraController.trackObject(() => sys.militaryBaseWorldPosition, 35);
    });
  };

  // Register when a base is newly built
  gameState.on('militaryBaseBuilt', (planetId) => {
    requestAnimationFrame(() => _registerMilitaryBaseClick(planetId));
  });

  // Register on load (for saves that already have a base)
  gameState.on('stateLoaded', () => {
    for (const planetId of gameState.ownedPlanets) {
      const ps = gameState.getPlanetState(planetId);
      if (ps?.militaryBase?.built) _registerMilitaryBaseClick(planetId);
    }
  });

  // Register enemy station click targets
  const _registerEnemyStationClicks = () => {
    for (const target of galaxy.getEnemyStationClickTargets()) {
      if (!target.mesh || target.mesh.userData._esClickBound) continue;
      target.mesh.userData._esClickBound = true;
      inputManager.addClickable(target.mesh, () => {
        const st = gameState.enemyStations?.find(s => s.id === target.stationId);
        if (!st) return;
        AudioManager.play('PLANET_CLICK_3D');
        enemyStationPanel.show(target.stationId);
        // Center camera on the enemy station
        if (target.planetId) {
          // Planet-anchored — track planet world position
          const sys = galaxy.getSystem(target.planetId);
          if (sys) cameraController.trackObject(() => sys.planetWorldPosition, 80);
        } else {
          // Free-floating — track station world position directly
          const mgr = galaxy.enemyStationManager;
          const st3D = mgr?._activeStations?.get(target.stationId);
          if (st3D) {
            cameraController.trackObject(() => st3D.group.position, 80);
          }
        }
      });
    }
  };
  gameState.on('stateLoaded', _registerEnemyStationClicks);

  // RMB on enemy station: dispatch fleet to attack
  inputManager.onRightClickable((stationId) => {
    if (!_selectedPlayerFleets.size) return;
    const st = gameState.enemyStations?.find(s => s.id === stationId);
    if (!st) return;
    const stPos = galaxy.enemyStationManager?.getStationWorldPosition(stationId)
      ?? galaxy.getPlanetWorldPosition(st.anchorPlanet);
    for (const fleetId of _selectedPlayerFleets) {
      gameState.dispatchFleetToStation(fleetId, stationId);
      if (stPos) gameState.dispatchFleetWaypoint(fleetId, { x: stPos.x, y: 0, z: stPos.z });
    }
  });

  // Combat visual events — projectile cooldowns per defense type
  const _projectileCooldowns = { cannon: 0, satellite: 0, defenseShip: 0, shield: 0 };
  const _projectileCooldownTimes = { cannon: 0.4, satellite: 0.25, defenseShip: 0.35, shield: 0.3 };

  gameState.on('defenseFired', ({ planetId, defenseType, targetId, damage }) => {
    if (planetId !== gameState.focusedPlanet) return;

    // Cooldown gate: throttle to visible fire rate per defense type
    const now = performance.now() / 1000;
    if (!_projectileCooldowns[defenseType]) _projectileCooldowns[defenseType] = 0;
    if (now < _projectileCooldowns[defenseType]) return;  // on cooldown, skip this shot
    _projectileCooldowns[defenseType] = now + (_projectileCooldownTimes[defenseType] ?? 0.4);

    // Pick projectile color by defense type
    const colorMap = {
      cannon:      0xd4a843,  // amber gold
      satellite:   0x44ddff,  // cyan
      defenseShip: 0xffffff,  // white
      shield:      0x4488ff,  // blue (rare)
    };
    const laserColor = colorMap[defenseType] ?? 0xd4a843;

    // Fire origin: use actual defense object position when available
    const defMgr = galaxy.getDefenseManager(planetId);
    const fromPos = defMgr?.getFirePosition(defenseType)
      ?? galaxy.getSystem(planetId)?.stationWorldPosition;

    if (!fromPos) return;

    // Target: try to hit the actual enemy visual; fall back to orbit approximation
    const toPos = enemyManager.getEnemyWorldPosition(targetId)
      ?? enemyManager.getAnyEnemyWorldPosition()
      ?? (() => {
        const pPos = galaxy.getPlanetWorldPosition(planetId);
        if (!pPos) return null;
        const a = Math.random() * Math.PI * 2;
        return pPos.clone().add(new THREE.Vector3(Math.cos(a) * 13, (Math.random() - 0.5) * 4, Math.sin(a) * 13));
      })();

    if (toPos) combatEffects.projectile(fromPos, toPos, laserColor);

    // Flash the hit enemy
    const hitShip = enemyManager.getShip(targetId);
    if (hitShip) hitShip.flashHit();
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
    const ps = gameState.getPlanetState(planetId);
    if (sys?.station && ps) {
      sys.station.setShieldState(ps.combat.shieldHP, ps.combat.shieldMaxHP);
      combatEffects.shieldHit(sys.station.stationVisualCenter);
    }
  });

  gameState.on('abilityActivated', ({ planetId, abilityId }) => {
    if (planetId !== gameState.focusedPlanet) return;
    const planetPos = galaxy.getPlanetWorldPosition(planetId);
    if (!planetPos) return;
    if (abilityId === 'emp') combatEffects.empBurst(planetPos);
    if (abilityId === 'orbitalStrike') combatEffects.orbitalStrike(planetPos);
    if (abilityId === 'shieldBoost') {
      const sys = galaxy.getSystem(planetId);
      if (sys) combatEffects.shieldHit(sys.station.stationVisualCenter, 0x44ff88);
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

  // Phase 3: Enemy Station destruction VFX
  gameState.on('enemyStationDestroyed', ({ stationId }) => {
    const st = gameState.enemyStations?.find(s => s.id === stationId);
    let pos = null;
    if (st?.anchorPlanet) {
      pos = galaxy.getPlanetWorldPosition(st.anchorPlanet);
    } else {
      const st3D = galaxy.enemyStationManager?._activeStations?.get(stationId);
      if (st3D) pos = st3D.group.position.clone();
    }
    if (pos) {
      combatEffects.explosion(pos, 4.0, 0xff4400);
      if (cameraController.shake) cameraController.shake(0.12, 0.6);
    }
  });

  // Update station damage visuals per-frame
  gameState.on('stationDamaged', ({ planetId }) => {
    const sys = galaxy.getSystem(planetId);
    const ps = gameState.getPlanetState(planetId);
    if (sys?.station && ps) {
      sys.station.setDamageState(ps.combat.stationHP / ps.combat.stationMaxHP);
      sys.station.setShieldState(ps.combat.shieldHP, ps.combat.shieldMaxHP);
    }
  });

  gameState.on('repairTick', ({ planetId }) => {
    const sys = galaxy.getSystem(planetId);
    const ps = gameState.getPlanetState(planetId);
    if (sys?.station && ps) {
      sys.station.setDamageState(ps.combat.stationHP / ps.combat.stationMaxHP);
      sys.station.setShieldState(ps.combat.shieldHP, ps.combat.shieldMaxHP);
    }
  });

  // --- Fleet combat VFX ---
  gameState.on('fleetShipFired', ({ fleetId, shipIndex, targetId }) => {
    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;
    const ship = fleet.ships[shipIndex];
    if (!ship) return;

    // Compute world position of the firing ship
    const fromPos = new THREE.Vector3(
      fleet.position.x + (ship.localPos?.x || 0),
      fleet.position.y || 0,
      fleet.position.z + (ship.localPos?.z || 0)
    );

    // Find the engagement to get enemy fleet position
    const eng = gameState.getEngagementForFleet(fleetId);
    if (!eng) return;
    const ePos = galaxy.roamingFleetManager?.getFleetWorldPosition(eng.roamingFleetId);
    if (!ePos) return;

    const toPos = new THREE.Vector3(
      ePos.x + (Math.random() - 0.5) * 4,
      (ePos.y || 0) + (Math.random() - 0.5) * 2,
      ePos.z + (Math.random() - 0.5) * 4
    );

    // Color by ship type
    const FIRE_COLORS = {
      fighter: 0xd4a843, bomber: 0xe87020, carrier: 0x44ccdd,
      battleship: 0xc0c8e0, titan: 0xaa5533,
    };
    combatEffects.projectile(fromPos, toPos, FIRE_COLORS[ship.type] || 0xd4a843);
  });

  gameState.on('playerShipDestroyed', ({ fleetId, ship }) => {
    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;
    const pos = new THREE.Vector3(
      fleet.position.x + (ship.localPos?.x || 0),
      fleet.position.y || 0,
      fleet.position.z + (ship.localPos?.z || 0)
    );
    combatEffects.explosion(pos, 1.2, 0xd4a843);
    cameraController.shake(0.05, 0.3);
  });

  gameState.on('fleetHeal', ({ fleetId, shipIndex }) => {
    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;
    const target = fleet.ships[shipIndex];
    if (!target) return;
    // Find carrier in the fleet
    const carrier = fleet.ships.find(s => s.hp > 0 && MILITARY_SHIPS[s.type]?.combatBehavior === 'support');
    if (!carrier) return;
    const fromPos = new THREE.Vector3(
      fleet.position.x + (carrier.localPos?.x || 0),
      fleet.position.y || 0,
      fleet.position.z + (carrier.localPos?.z || 0)
    );
    const toPos = new THREE.Vector3(
      fleet.position.x + (target.localPos?.x || 0),
      fleet.position.y || 0,
      fleet.position.z + (target.localPos?.z || 0)
    );
    combatEffects.healBeam(fromPos, toPos);
  });

  gameState.on('fleetEngaged', ({ restored }) => {
    if (!restored) {
      cameraController.shake(0.08, 0.4);
    }
  });

  // Titan Ultimate VFX + sound
  gameState.on('fleetTitanUltimate', ({ position }) => {
    const pos = new THREE.Vector3(position.x, position.y || 0, position.z);
    combatEffects.fireTitanUltimate(pos);
    AudioManager.playSynth('TITAN_ULTIMATE');
    cameraController.shake(0.12, 0.6);
  });

  // Emergency Jump VFX + audio
  gameState.on('emergencyJumpExecuted', ({ fleetId }) => {
    renderPipeline.triggerWarpDistortion();
    AudioManager.playSynth('WARP_POP');
    cameraController.shake(0.06, 0.2);
  });

  // Enemy ship destroyed in fleet combat → explosion + sound
  gameState.on('fleetEnemyDestroyed', ({ fleetId }) => {
    AudioManager.playSynth('FLEET_EXPLOSION');
    const eng = gameState.fleetEngagements.find(
      e => e.roamingFleetId === fleetId || e.playerFleetId === fleetId
    );
    if (eng) {
      const ePos = galaxy.roamingFleetManager?.getFleetWorldPosition(eng.roamingFleetId);
      if (ePos) {
        const jitter = new THREE.Vector3(
          (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 6
        );
        combatEffects.explosion(ePos.clone().add(jitter), 0.8, 0xff4400);
      }
    }
  });

  // Carrier supply beam — amber for supply, throttled per fleet
  const _supplyBeamTimers = new Map();
  gameState.on('carrierSupplyBeam', ({ fleetId, type }) => {
    const now = performance.now() * 0.001;
    if ((now - (_supplyBeamTimers.get(fleetId) || 0)) < 0.5) return;
    _supplyBeamTimers.set(fleetId, now);

    const fleet = gameState.playerFleets.find(f => f.id === fleetId);
    if (!fleet) return;
    const carrier = fleet.ships.find(s => s.hp > 0 && MILITARY_SHIPS[s.type]?.combatBehavior === 'support');
    if (!carrier) return;
    const targets = fleet.ships.filter(s => s !== carrier && s.hp > 0);
    if (!targets.length) return;
    const target = targets[Math.floor(Math.random() * targets.length)];

    const fromPos = new THREE.Vector3(
      fleet.position.x + (carrier.localPos?.x || 0), fleet.position.y || 0,
      fleet.position.z + (carrier.localPos?.z || 0)
    );
    const toPos = new THREE.Vector3(
      fleet.position.x + (target.localPos?.x || 0), fleet.position.y || 0,
      fleet.position.z + (target.localPos?.z || 0)
    );
    combatEffects.supplyBeam(fromPos, toPos);
    if (type === 'orbit') AudioManager.playSynth('CARRIER_HUM');
  });

  // Station siege started → show panel
  gameState.on('stationSiegeStarted', ({ stationId }) => {
    enemyStationPanel.show(stationId);
  });

  // Station fire event → projectile VFX
  gameState.on('stationFired', ({ stationId, targetFleetId, targetShipIdx }) => {
    const stPos = galaxy.enemyStationManager?.getStationWorldPosition(stationId);
    if (!stPos) return;
    const fleet = gameState.playerFleets.find(f => f.id === targetFleetId);
    if (!fleet) return;
    const ship = fleet.ships[targetShipIdx];
    if (!ship) return;
    const toPos = new THREE.Vector3(
      fleet.position.x + (ship.localPos?.x || 0), 0,
      fleet.position.z + (ship.localPos?.z || 0)
    );
    const STATION_FIRE_COLORS = {
      lava:       0xff3300,
      ice:        0x88ccff,
      industrial: 0xd4a843,
      void:       0x8800ff,
      generic:    0xff6600,
    };
    const stDef = gameState.enemyStations?.find(s => s.id === stationId);
    const color = STATION_FIRE_COLORS[stDef?.type] ?? 0xff6600;
    combatEffects.projectile(stPos, toPos, color);
  });

  // --- Spawn flight: robot flies from panel to station ---
  const spawnFlight = new SpawnFlight(sceneManager.scene, camera, galaxy);
  spawnFlight.onArrival = (worldPos, planetId) => {
    const sys = galaxy.getSystem(planetId);
    if (sys) sys.station.flashPurchase();
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
    cameraController.spherical.radius = 55;
    cameraController.targetSpherical.radius = 55;
    cameraController.trackObject(() => startSystem.planetWorldPosition, 55);
  }

  // Snap camera to correct planet when save loads (no animation)
  gameState.on('stateLoaded', () => {
    const system = galaxy.getSystem(gameState.activePlanet);
    if (!system) return;
    const pos = system.planetWorldPosition;
    cameraController.target.copy(pos);
    cameraController.targetTarget.copy(pos);
    cameraController.spherical.radius = 55;
    cameraController.targetSpherical.radius = 55;
    cameraController.trackObject(() => system.planetWorldPosition, 55);
  });

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

  // --- Minimap ---
  const minimap = new Minimap({
    onPlanetClick: (planetId) => {
      const sys = galaxy.getSystem(planetId);
      if (!sys) return;
      if (gameState.ownedPlanets.includes(planetId)) {
        gameState.switchPlanet(planetId);
        cameraController.trackObject(() => sys.planetWorldPosition, 55);
      } else {
        cameraController.focusOnPosition(sys.planetWorldPosition, 55);
      }
    },
  });
  minimap.setGalaxy(galaxy);

  // Reusable vector to avoid per-frame allocation for god rays
  const _godRayUV = new THREE.Vector2();
  const _godRayNDC = new THREE.Vector3();

  // --- RTS: waypoint 3D state ---
  let _rtsWaypoint3D   = null;  // THREE.Vector3 of active waypoint position
  let _rtsWaypointMesh = null;  // THREE.LineSegments crosshair

  function _buildWaypointCrosshair(pos) {
    const r = 5;
    const pts = [
      -r,0,0,  r,0,0,
       0,0,-r,  0,0,r,
    ];
    const positions = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i++) positions[i] = pts[i];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex([0,1, 2,3]);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffdd30,
      transparent: true,
      opacity: 1.0,
      depthTest: false,
    });
    const mesh = new THREE.LineSegments(geo, mat);
    mesh.position.copy(pos);
    return mesh;
  }

  // Box-select: update _selectedPlayerFleets from frustum result
  inputManager.onBoxSelect((selected) => {
    _selectedPlayerFleets.clear();
    for (const mesh of selected) {
      const fleetId = mesh.userData.playerFleetId;
      if (fleetId) _selectedPlayerFleets.add(fleetId);
    }
  });

  // Waypoint: dispatch to all selected player fleets + place crosshair
  inputManager.onWaypoint((pos) => {
    // Check if waypoint is near an owned planet — enables scavenger hold delivery
    const PLANET_WAYPOINT_SNAP = 40; // world units; generous radius around planet
    let deliverPlanetId = null;
    for (const pid of gameState.ownedPlanets) {
      const pPos = galaxy.getPlanetWorldPosition(pid);
      if (!pPos) continue;
      const dx = pos.x - pPos.x, dz = pos.z - pPos.z;
      if (Math.sqrt(dx * dx + dz * dz) < PLANET_WAYPOINT_SNAP) {
        deliverPlanetId = pid;
        break;
      }
    }

    for (const fleetId of _selectedPlayerFleets) {
      gameState.dispatchFleetWaypoint(fleetId, pos);

      // Tag scavenger fleets with deliverHold when targeting an owned planet (BUG-E: remove hold check)
      if (deliverPlanetId) {
        const fleet = gameState.playerFleets.find(f => f.id === fleetId);
        const hasScavenger = fleet?.ships.some(s => s.hp > 0 && s.type === 'scavenger');
        if (hasScavenger) fleet.deliverHold = { planetId: deliverPlanetId };
      }
    }
    // Remove previous crosshair if still visible
    if (_rtsWaypointMesh) {
      sceneManager.scene.remove(_rtsWaypointMesh);
      _rtsWaypointMesh.geometry.dispose();
      _rtsWaypointMesh.material.dispose();
    }
    _rtsWaypoint3D   = pos.clone();
    _rtsWaypointMesh = _buildWaypointCrosshair(pos);
    sceneManager.scene.add(_rtsWaypointMesh);
    _rtsWaypointLabel.style.display = 'none'; // will reappear on next frame
  });

  // Per-frame update
  animationLoop.onUpdate((dt, time) => {
    galaxy.update(camera, dt, time);
    skybox.update(time, camera);
    combatEffects.update(dt);
    clickFeedback.update(dt);
    spawnFlight.update(dt);
    minimap.update(time, cameraController);
    fleetPanel.update();
    playerFleetPanel.update();
    enemyStationPanel.update();
    playerFleetManager.update(cameraController.isRTSMode);
    renderPipeline.tick(dt);

    // Waypoint crosshair: project 3D position to screen and update label
    if (_rtsWaypoint3D && cameraController.isRTSMode) {
      _rtsWaypointLabel.textContent = 'WAYPOINT';
      _waypointNDC.copy(_rtsWaypoint3D).project(camera);
      const sx = (_waypointNDC.x *  0.5 + 0.5) * window.innerWidth;
      const sy = (-_waypointNDC.y * 0.5 + 0.5) * window.innerHeight;
      if (_waypointNDC.z < 1.0) {
        _rtsWaypointLabel.style.display = 'block';
        _rtsWaypointLabel.style.left = sx + 'px';
        _rtsWaypointLabel.style.top  = (sy - 6) + 'px';
      }
      // Fade the crosshair mesh over time
      if (_rtsWaypointMesh) {
        _rtsWaypointMesh.material.opacity -= dt * 0.25;
        if (_rtsWaypointMesh.material.opacity <= 0) {
          sceneManager.scene.remove(_rtsWaypointMesh);
          _rtsWaypointMesh.geometry.dispose();
          _rtsWaypointMesh.material.dispose();
          _rtsWaypointMesh = null;
          _rtsWaypoint3D   = null;
          _rtsWaypointLabel.style.display = 'none';
        }
      }
    }

    // Ship tooltip: update position and ETA each frame
    if (_selectedShipId !== null) {
      const ship = _selectedShipData;
      if (ship) {
        const pos = shipManager.getShipPosition(ship.id);
        if (pos) {
          _shipNDC.copy(pos).project(camera);
          const sx = (_shipNDC.x * 0.5 + 0.5) * window.innerWidth;
          const sy = (-_shipNDC.y * 0.5 + 0.5) * window.innerHeight;
          const remaining = Math.max(0, (1 - ship.t) * ship.duration);
          const fromDef = PLANET_MAP.get(ship.fromPlanet);
          const toDef   = PLANET_MAP.get(ship.toPlanet);
          _shipTooltipEl.style.display = 'block';
          _shipTooltipEl.style.left = (sx + 18) + 'px';
          _shipTooltipEl.style.top  = (sy - 20) + 'px';
          _shipTooltipEl.innerHTML = `
            <div class="ship-tt-title">CARGO SHIP</div>
            <div class="ship-tt-cargo">${RES_ICONS[ship.resource] || '⬡'} ${Math.floor(ship.amount)} ${ship.resource.toUpperCase()}</div>
            <div class="ship-tt-route">${fromDef?.name || ship.fromPlanet} → ${toDef?.name || ship.toPlanet}</div>
            <div class="ship-tt-eta">ETA: ${_fmtEta(remaining)}</div>
          `;
        }
      } else {
        _deselectShip();
      }
    }

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
