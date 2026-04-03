# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Astro Harvest: Galactic Extraction** — A space-themed idle/clicker game built with Three.js and vanilla JavaScript (no TypeScript). Players mine ore, build bases, deploy robots, establish ship routes, colonize planets, and defend against enemy invasions in a 3D galaxy.

- **3D Engine**: Three.js 0.170 (WebGL, custom GLSL shaders, post-processing)
- **Build tool**: Vite 6
- **Backend**: Firebase (Firestore + Auth)
- **Deployment**: GitHub Pages at `astro.haaland.de` (auto-deploy on push to `main` via `.github/workflows/deploy.yml`)

## Commands

```bash
npm run dev       # Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No lint or test scripts are configured.

## Architecture

### Single Scene, Seamless Zoom

One continuous `THREE.Scene` — no scene transitions. The camera zooms seamlessly from galaxy overview to planet level. LOD (Level of Detail) controls what's visible at each zoom level.

```
main.js (4-phase boot: audio+auth → LandingScreen → systems → HUD+tutorial)
  → Game.js (Three.js setup)
    → Galaxy (8 planets + 9 Hyperlanes + GalacticAsteroidBelt + cosmic nebulas + threat indicators)
      → SolarSystem (Planet3D + Station3D + RobotManager3D + DefenseManager3D + ShipManager3D
                     + EnemyManager3D + AsteroidBelt + DustCloud + NebulaVolume(×5) + LensFlare)
    → RoamingFleetManager3D (visual pool for roaming enemy fleets)
    → Skybox (starfield cubemap + procedural nebula)
    → ClickFeedback (expanding ring + floating number)
    → Minimap
  → ProductionSystem (per-planet resource ticks + colony ship build)
  → ThreatSystem (invasion wave management)
  → CombatSystem (combat simulation + damage)
  → RoamingFleetSystem (scout + invasion fleet movement)
  → RouteSystem (ship dispatch + delivery, fleet-aware lane blocking)
  → HUDBridge (DOM updates)
  → Tutorial
```

**Boot phases:**
1. AudioManager + MusicManager init, Firebase init, anonymous auth, create 3D game
2. Show LandingScreen — wait for user choice (continue / cloud / new game)
3. Apply save; attempt cloud sync if available; MusicManager.start()
4. Init ProductionSystem → ThreatSystem → CombatSystem → RoamingFleetSystem → RouteSystem (reconstruct active ships + attacks + fleets), then HUDBridge + Tutorial

### Engine Modules (`src/game/engine/`)

- **SceneManager.js** — Single THREE.Scene, lighting (directional sun with shadows + ambient + hemisphere), exponential fog for depth
- **CameraController.js** — Hybrid camera: orbital (drag/zoom/click-focus) + free (Shift+WASD+mouse). Dynamic near/far planes by zoom level. `setPlanetColliders()` for collision, `trackObject()` for smooth following.
- **RenderPipeline.js** — WebGLRenderer (logarithmic depth buffer, PCFSoft shadow maps) + EffectComposer (bloom, ACES tone mapping)
- **AnimationLoop.js** — rAF loop, calls registered `onUpdate` callbacks + render
- **InputManager.js** — Raycasting for 3D click/hover detection on planet meshes and stations. Separate click target registration for planets vs stations.

### State Management

**GameState** (`src/game/GameState.js`): Singleton with EventEmitter pattern. Holds all per-planet state. Save version 3 (v1→v2→v3 migration supported).

**Per-planet state** (one record per owned planet):
```js
{
  hasBase: bool,
  baseLevels: { storage, shipSpeed, shipSlots, passiveEnergy },
  silos: { ore: { amount, capacity }, energy: { amount, capacity }, crystal: { amount, capacity } },
  robots: { miner: { count, speedLevel, loadLevel }, energyBot, builder, scout },
  deposits: { ... },           // from planets.js definition
  depositProgress: { ore, crystal, energy },  // scout unlock progress (seconds)
  upgradeLevels: {},
  buildQueue: [],
  colonyShipBuildQueue: [],    // [{ progress: 0 }] — one at a time
  combat: {
    stationHP, stationMaxHP, shieldHP, shieldMaxHP,
    defenses: { cannon, satellite, defenseShip, shield },  // counts
    defenseLevels: {},         // upgradeId → level
    abilityCooldowns: { emp, shieldBoost, orbitalStrike },
    activeEffects: [],         // [{ type, remaining }]
    fallen: bool,
  },
}
```

**Top-level state**: `ownedPlanets`, `focusedPlanet`, `routes[]`, `activeShips[]` (runtime only), `tutorialStep`, `unlockedTech` (Set of tech node IDs)

**Runtime combat state**: `activeAttacks[]`, `roamingFleets[]`, `lastAttackTime{}`, `colonizationTime{}`

**Colony ship state**: `colonyShipsInOrbit[]`, `colonyShipsInFlight[]`, `colonyShipsArriving[]`

**Lifetime stats**: `stats.{ totalOreProduced, totalEnergyProduced, totalCrystalProduced, totalShipDeliveries, totalResourcesShipped, totalRobotsHired, planetsColonized, playTimeSeconds }`

**Events**: `siloChanged`, `baseBuilt`, `baseUpgraded`, `robotHired`, `robotUpgraded`, `routeAdded`, `routeRemoved`, `routeToggled`, `shipLaunched`, `shipArrived`, `depositUnlocked`, `productionTick`, `planetColonized`, `focusedPlanet`, `planetChanged`, `stateLoaded`, `colonyShipQueued`, `colonyShipBuilt`, `colonyShipLaunched`, `colonyShipArriving`, `colonyShipArrived`, `attackStarted`, `attackEnded`, `planetFallen`, `techUnlocked`, `fleetSpawned`, `fleetMoved`, `fleetDestroyed`, `fleetArrived`, `cargoIntercepted`

**Key methods**: `buildBase(planetId)`, `hireRobot(planetId, type)`, `addRoute(route)`, `removeRoute(id)`, `toggleRoute(id)`, `buyBaseUpgrade(planetId, upgradeId)`, `buyRobotUpgrade(planetId, upgradeId)`, `addToSilo()`, `deductFromSilo()`, `siloHas()`, `getShipSlots(planetId)`, `queueColonyShip(planetId)`, `launchColonyShip(shipId, toPlanetId, distance)`

### Game Systems (`src/game/systems/`)

- **ProductionSystem.js** — Registers with `animationLoop.onUpdate()`. Per-planet, per-frame resource generation:
  - Ore: `count × 0.5 × speedMult × loadMult × planetMult.ore × max(1, unlockedZones)`
  - Energy: `count × 0.4 × speedMult × loadMult × planetMult.energy × max(1, unlockedZones) + passive`
  - Crystal: `count × 0.2 × speedMult × loadMult × planetMult.crystal × unlockedZones` (only if crystalZones > 0)
  - Scouts tick `depositProgress`; when threshold reached, a zone unlocks and production starts
  - Also advances `colonyShipBuildQueue` each frame
- **RouteSystem.js** — Registers with `animationLoop.onUpdate()`. Dispatches ships when routes are active, docking slots are free, and the hyperlane is not blocked by a roaming fleet. Delivers cargo on arrival. Reconstructs in-flight ships from `gameState.activeShips` on load.
- **ThreatSystem.js** — Manages enemy invasion waves. Schedules attacks on owned planets, scales difficulty with game progression. Roaming fleets convert to direct attacks via `spawnFleetAttack()`. Emits `attackStarted` / `attackEnded` events.
- **CombatSystem.js** — Simulates combat each frame in two modes: full per-enemy simulation for the focused planet, simplified net-DPS for background planets. Applies enemy DPS to station HP, handles defense fire, processes active abilities (EMP, shieldBoost, orbitalStrike). Calls `reconstructAttacks()` on load for in-progress battles.
- **RoamingFleetSystem.js** — Manages autonomous enemy fleets that traverse the galaxy. Two fleet types: **scout fleets** (follow hyperlane network, intercept cargo, speed 0.04) and **invasion fleets** (free movement planet-to-planet, contain mothership, speed 0.025). Max 4 concurrent fleets. Planets with `defenseShip` defenses can damage passing scout fleets. Calls `reconstructFleets()` on load.

### Planet Rendering (`src/game/shaders/planet/`)

Each planet type has a custom GLSL fragment shader:

| Type | Shader | Key Effect |
|------|--------|------------|
| `terr` | TerrestrialShader | Ocean/land/clouds with specular water |
| `lava` | LavaShader | Glowing cracks, pulsing magma flow |
| `cryst` | CrystalShader | Crystal veins, sparkle, sharp specular |
| `gas` | GasShader | Banded turbulence, Great Spot vortex |
| `ice` | IceShader | Crack patterns, subsurface scattering |
| `neb` | NebulaWorldShader | Swirling multi-layer gas, emissive hotspots |
| `star` | StarShader | Full emissive plasma, solar flares, corona |
| `void` | VoidShader | Spiral distortion, inverted lighting, void energy |

Plus: `AtmosphereShader` (Fresnel glow), `RingShader` (planetary rings for gas/star/void).

**Effect shaders** (`src/game/shaders/effects/`):
- `ColorGradeShader.js` — S-curve color grading, vignette, chromatic aberration
- `EngineTrailShader.js` — Engine trail fade
- `FilmGrainShader.js` — Film grain overlay
- `GodRayShader.js` — Volumetric god rays
- `HyperlaneShader.js` — Glowing tube shader for hyperlane connections

Shared GLSL utilities in `src/game/utils/ShaderLib.js` (noise, FBM, Fresnel).

### World Structure (`src/game/world/`)

- **Galaxy.js** — Manages all 8 planets, 9 Hyperlanes, GalacticAsteroidBelt (inner 370–450 radius + outer 1500–1700 radius), 10 DustCloud instances, 6 cosmic NebulaVolume backdrops, and threat indicators (`_createThreatIndicators()`). Injects RoamingFleetManager3D.
- **SolarSystem.js** — Groups Planet3D + Station3D + RobotManager3D + DefenseManager3D + ShipManager3D + EnemyManager3D + AsteroidBelt + DustCloud + 5× NebulaVolume layers + LensFlare. Manages LOD visibility per component.
- **EnemyManager3D.js** — Pool of up to 12 enemy ships + 2 motherships, spawned/recycled per active attack wave
- **Hyperlane.js** — Glowing tube (HyperlaneShader) with 60 flowing particles between connected systems
- **Skybox.js** — Procedural starfield cubemap (2048px, 2000 stars/face) + 2000 twinkling near-stars + domain-warped nebula shader with Milky Way band. Palette shifts per planet.
- **Ship3D.js** — 3D cargo vessel geometry and flight animation
- **ShipManager3D.js** — Pool of visual ship objects, spawned/recycled per active route
- **DefenseManager3D.js** — Manages visual defense structures per planet: DefenseSatellite3D and PatrolShip3D instances. Provides fire-position lookups for CombatEffects.
- **RoamingFleet3D.js** — 3D visual representation of a roaming enemy fleet (group of EnemyShip3D meshes)
- **RoamingFleetManager3D.js** — Pool manager for RoamingFleet3D instances, spawned/recycled per active roaming fleet
- **RouteLane3D.js** — Visual lane rendered between planets with an active trade route

### 3D Objects (`src/game/objects/`)

- **Planet3D.js** — Sphere + ShaderMaterial + atmosphere mesh + optional rings
- **Station3D.js** — Procedural geometry (torus rings, spokes, panels, hub, nav light). Orbits planet at radius 15, speed 0.1.
- **Star3D.js** — Decorative star at the center of the system (uses StarShader + PointLight)
- **Robot3D.js** — Base: 8-state mining cycle (orbit → descend → surface → bore → underground → ascend → return), engine trail, cargo threshold 3
- **5 visual robot classes** in `robots/`: `MinerBot`, `ScoutBot`, `SpiderBot`, `HoverBot`, `TitanBot` — actively used and cycled through by RobotManager3D
- **RobotManager3D.js** — Pool of up to 32 visual robots, cycles through the 5 robot classes
- **ColonyShip3D.js** — Colony ship model; orbit mode (radius 20) and travel mode (parabolic arc animation)
- **EnemyShip3D.js** — Enemy fighter with 3 types: interceptor (needle), bomber (bulky), raider (fork-shape). Includes HP bar and hit-flash.
- **Mothership3D.js** — Large enemy dreadnought (2.5× scale). Warp-in animation, pulsing engines (2.8 Hz), weapon charging (2.2 Hz), HP bar.
- **DefenseSatellite3D.js** — Orbiting defense platform with weapon arms, solar fins, sensor dome, and click hitbox
- **PatrolShip3D.js** — Military patrol fighter with swept wings, dual engine pods, forward cannon, nav lights

### UI Components

- **PlanetPanel.js** (`src/game/ui/`) — Floating side panels shown when zoomed into a planet. Tabbed: base build/upgrade, robot hire/upgrade, silo status, trade routes, colony ship launcher. Also hosts DefensePanel.
- **CombatHUD.js** (`src/game/ui/`) — Alert banners (INVASION INCOMING, RAID DETECTED, THREAT NEUTRALIZED, STATION DESTROYED, CARGO INTERCEPTED) + floating combat summary. Event-driven, alerts auto-dismiss after 4s.
- **DefensePanel.js** (`src/game/ui/`) — Defense build/upgrade grid (cannon, satellite, defenseShip, shield). Active ability buttons (EMP, orbitalStrike, shieldBoost) with pie-chart cooldown overlays.
- **Minimap.js** (`src/game/ui/`) — 160×160px canvas minimap. Shows hyperlanes, planet dots (owned/unowned), attack pulse rings, focused-planet highlight, and camera crosshair. Zoom controls ×0.5–4. Hides when camera is close to a planet.
- **FleetPanel.js** (`src/game/ui/`) — Floating panel for inspecting a roaming fleet: type (scout/invasion), enemy composition with HP bars, destination, ETA.
- **TechTreeWindow.js** (`src/game/ui/`) — Modal tech tree with 4 branches (robots, defense, base, colonization). Nodes show locked/available/unlocked state with SVG dependency lines. Press T to toggle.
- **LandingScreen.js** (`src/ui/`) — Title screen on boot; also accessible as pause menu via ESC. Shows continue/cloud/new-game options and a cloud save browser.

### Tutorial & Audio

- **Tutorial.js** (`src/game/tutorial/`) — 7-step guided onboarding. Tracks step via `gameState.tutorialStep` (persists across sessions). Positions `#tutorial-hand` DOM element (pointer + bubble) over UI targets. Steps: build base → hire energy bot → unlock miner in research → hire miner → watch ore silo → expand storage → farewell message.
- **AudioManager.js** (`src/game/audio/`) — ~20 SFX via Web Audio API. Buffer pooling, volume/mute persisted to localStorage.
- **MusicManager.js** (`src/game/audio/`) — Background music system. Initialized with AudioManager's context and music gain node. Started after save is applied in boot phase 3.

### Visual Effects (`src/game/effects/`)

- **ClickFeedback.js** — Expanding ring + floating "+N" number at 3D click point
- **DustCloud.js** — Particles drifting around each planet / galaxy zone
- **LensFlare.js** — Sprite-based glow + rays for star-type planets
- **NebulaVolume.js** — Billboard quad with FBM noise shader. Each SolarSystem uses 5 layered NebulaVolume instances.
- **AsteroidBelt.js** — Particle ring of asteroids orbiting each planet
- **GalacticAsteroidBelt.js** — Galaxy-scale asteroid field (inner ring 370–450 radius, 4000 particles; outer ring 1500–1700 radius, 3000 particles)
- **CombatEffects.js** — Combat VFX: laser fire, explosions, shield hits, EMP pulse, orbital strike beam
- **SpawnFlight.js** — Animation for robots spawning and flying to their orbit
- **MiningBurst.js** — Particle burst at mining contact points

### LOD Thresholds (camera distance)

Camera zones (CameraController): `galaxy` (d > 200), `system` (d > 50), `planet` (d > 15), `close` (d ≤ 15)

| Distance | What changes |
|----------|-------------|
| < 180 | Planet shader animates |
| 180–220 | Asteroid belt fades in |
| < 100 | Rim + fill lights activate |
| < 80 | Station + colony ship become visible |
| < 60 | Robots become visible |
| 350–300 | Nebula volumes fade in |
| 15–300 | Label visible |

Dynamic near/far planes: d < 20 → 0.05/500, d < 80 → 0.1/1000, else → 1.0/2000

### Save System (Dual)

- **LocalStorage** (`src/storage.js`): Auto-saves every 10s + on visibility change + on significant events
- **Firestore** (`src/db.js`): Cloud sync every 30s at `saves/{uid}/state/current`. Requires auth
- **Conflict resolution**: Prefer save with highest ore; tie-break by timestamp
- **Offline earnings**: Handled by ProductionSystem on load

### Authentication

`src/auth.js`: Anonymous sign-in by default, optional Google Sign-In with account linking.

### HUD Bridge

`src/game/HUDBridge.js`: Standalone module that updates existing HTML DOM elements each frame. Handles resource displays, planet panels, toast notifications, panel toggles.

## Key Files

| Path | Purpose |
|------|---------|
| `src/main.js` | Entry point — 4-phase boot sequence |
| `src/game/Game.js` | Three.js init, galaxy setup, click handling, render loop |
| `src/game/GameState.js` | Singleton state + EventEmitter (per-planet, v3 save format) |
| `src/game/HUDBridge.js` | HTML HUD updates |
| `src/game/systems/ProductionSystem.js` | Per-planet resource generation per frame |
| `src/game/systems/RouteSystem.js` | Ship route dispatch + delivery |
| `src/game/ui/PlanetPanel.js` | Floating left/right planet detail panels |
| `src/game/tutorial/Tutorial.js` | Guided onboarding |
| `src/game/audio/AudioManager.js` | Sound effects system |
| `src/game/audio/MusicManager.js` | Background music system |
| `src/ui/LandingScreen.js` | Title/pause screen |
| `src/game/data/planets.js` | 8 planets: costs, multipliers, resourceTypes, deposits, nebula palettes |
| `src/game/data/upgrades.js` | BASE_UPGRADES (4) + ROBOT_UPGRADES (8) + ROBOT_ACTIONS (4) + cost helpers |
| `src/game/data/defenses.js` | DEFENSE_TYPES (4) + DEFENSE_UPGRADES + ACTIVE_ABILITIES (3) + balance constants |
| `src/game/data/enemies.js` | ENEMY_TYPES (interceptor, bomber, raider, mothership) + RAID/INVASION_TEMPLATES |
| `src/game/data/routes.js` | Route creation + validation |
| `src/game/data/galaxyLayout.js` | Planet positions (4000×4000 grid) + 9 hyperlane connections |
| `src/game/data/techTree.js` | Tech tree node definitions (4 branches: robots, defense, base, colonization) |
| `src/game/systems/ThreatSystem.js` | Enemy invasion wave scheduling + difficulty scaling |
| `src/game/systems/CombatSystem.js` | Frame-by-frame combat simulation (full + simplified DPS modes), abilities, damage |
| `src/game/systems/RoamingFleetSystem.js` | Autonomous scout + invasion fleet movement, lane blocking, cargo interception |
| `src/game/ui/CombatHUD.js` | Alert banners + combat summary overlay |
| `src/game/ui/DefensePanel.js` | Defense building + upgrade UI with pie-chart cooldowns |
| `src/game/ui/FleetPanel.js` | Roaming fleet inspection panel |
| `src/game/ui/TechTreeWindow.js` | Tech tree modal (press T to toggle) |
| `src/game/utils/ShaderLib.js` | Shared GLSL (noise, FBM, Fresnel) |
| `src/game/utils/CoordinateMapper.js` | 2D galaxy coords → 3D world positions |
| `src/game/world/Ship3D.js` | 3D cargo ship geometry + animation |
| `src/game/world/ShipManager3D.js` | Visual ship pool management |
| `src/game/world/DefenseManager3D.js` | Defense structure visuals + fire-position lookup |
| `src/game/world/RoamingFleet3D.js` | 3D visual for a roaming enemy fleet |
| `src/game/world/RoamingFleetManager3D.js` | Pool manager for roaming fleet visuals |
| `src/game/world/RouteLane3D.js` | Visual lane for active trade routes |
| `src/game/objects/Star3D.js` | Central star at system center |
| `src/game/objects/DefenseSatellite3D.js` | Orbiting defense satellite geometry |
| `src/game/objects/PatrolShip3D.js` | Military patrol fighter geometry |
| `src/ui/HUD.css` | UI stylesheet |
| `src/firebase.js` | Firebase init (graceful offline fallback) |

## Environment

Copy `.env.local.template` → `.env.local` and fill in Firebase credentials:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

If `VITE_FIREBASE_PROJECT_ID` is missing, the game runs in **offline-only mode** (localStorage saves only).

## Visual Design

- **Theme**: Dune/sci-fi with gold/amber palette
- **Colors**: Gold `#d4a843` (main), amber `#c67b30` (accent), sand `#e8d5b0`, dark bg `#0a0e14`
- **Fonts**: Orbitron (headers/numbers), Share Tech Mono (body/values) — loaded via Google Fonts in `index.html`
- **Panel layout**: 380px floating side panels, shown/hidden dynamically by zoom level. Menu button top-left.
- **CSS**: All styling in `src/ui/HUD.css` + `src/ui/LandingScreen.css` — glassmorphism panels, gradient gold borders
- **Post-processing**: Bloom (UnrealBloomPass, strength 0.8, threshold 0.6, smoothRadius 0.55) + ColorGradeShader (S-curve, vignette, chromatic aberration), ACES Filmic tone mapping (exposure 1.1)
- **Lighting**: Hybrid — directional sun (with PCFSoft shadow maps) + ambient + hemisphere + per-planet rim light + fill light
- **Shadows**: Planet meshes cast shadows, rings receive shadows. Shadow map 1024×1024.
- **Fog**: Exponential fog (0.0008 density) for depth cue at galaxy scale

## Game Mechanics

- **Resources**: Ore, Crystal, Energy — each planet has independent silos with separate capacities
- **Production**: Per-planet per-frame (see ProductionSystem). Zone count is a multiplier — 0 unlocked zones = 0 production. Scouts progressively unlock zones.
- **Deposit unlock**: Scouts accumulate `depositProgress` over time; when threshold reached, a zone unlocks. More zones → higher production multiplier.
- **Base upgrades** (4): Storage expansion, ship speed thruster, docking bay slots, fusion cell passive energy — each up to 3–5 levels, cost in energy
- **Robot specialization upgrades** (8): Speed and load upgrades per robot type — each up to 5 levels, cost in energy
- **Robot hire cost**: Scales with existing count (`energyCostFn(ps)` in ROBOT_ACTIONS)
- **Upgrade cost scaling**: `baseCost × 1.15^level` — buy multiplier toggles ×1/×10/×100
- **8 planets**: Colonization `baseCost` ranges from 0 (Xerion) to ~600k energy (Voidex). Each planet has `resourceTypes` (ore/energy/crystal) and `planetMult` bonuses per resource.
- **Per-planet autonomy**: Robots, silos, upgrade levels, and deposit unlock progress are all independent per planet.
- **Ship routes**: Player creates routes between owned planets to transfer resources. Active routes dispatch ships when docking slots are free (limited by `baseLevels.shipSlots`). Ship travel time based on 3D distance and thruster level.
- **Colony ships**: Colonization is a multi-step process: (1) queue a colony ship build on a planet (costs `{ ore: 300 }`, takes 20s); (2) launch the ship to an unowned planet (costs `50 + distance × 0.3` energy); (3) ship flies there and enters orbit; (4) player builds a base manually to complete colonization. Building the base deducts the planet's `baseCost`. Recolonizing a fallen planet costs `baseCost × RECOLONIZE_COST_MULT`.
- **4 active robot types**: `miner` (ore), `energyBot` (energy), `scout` (unlock zones), `builder` (repairs station HP)
- **Combat & Defense**: Each planet's station has HP (`BASE_STATION_HP`). ThreatSystem sends enemy waves (interceptor, bomber, raider, mothership). Defenses (cannon, satellite, defenseShip, shield) automatically fire each frame via CombatSystem. Players can activate 3 abilities: EMP (stuns enemies), shieldBoost (regenerates shield HP), orbitalStrike (massive AoE damage). If station HP reaches 0, the planet falls (`combat.fallen = true`) and loses a fraction of robots (`FALL_ROBOT_SURVIVAL`). Builder robots passively repair station HP at `BUILDER_REPAIR_RATE`.
- **Defense upgrades**: Each defense type has its own upgrade tree (levels in `combat.defenseLevels`). Costs paid in energy.
- **Tech tree**: Global progression system with 4 branches (robots, defense, base, colonization). Unlocking nodes costs energy and may require prerequisite nodes. Unlocked tech persisted in `gameState.unlockedTech` (Set). Access via `TechTreeWindow` (press T).
- **Camera**: Orbital (default) + free-fly (hold Shift). Scroll to zoom, click planet to focus. Dynamic near/far planes by zoom level (0.05–1.0 near, 500–2000 far).
- **Performance**: Distant planets (>300 units) update at 10% frequency. Hyperlanes skip updates beyond 250 units.
