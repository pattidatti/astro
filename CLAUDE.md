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
    → Galaxy (8 planets + 9 Hyperlanes + cosmic nebulas + patrol dots + threat indicators)
      → SolarSystem (Planet3D + Station3D + RobotManager3D + ShipManager3D + EnemyManager3D
                     + AsteroidBelt + DustCloud + NebulaVolume(×6) + LensFlare)
    → Skybox (starfield cubemap + procedural nebula)
    → ClickFeedback (expanding ring + floating number)
    → Minimap
  → ProductionSystem (per-planet resource ticks + colony ship build)
  → HyperlanePatrolSystem (enemy patrol movement)
  → ThreatSystem (invasion wave management)
  → CombatSystem (combat simulation + damage)
  → RouteSystem (ship dispatch + delivery)
  → HUDBridge (DOM updates)
  → Tutorial
```

**Boot phases:**
1. AudioManager + MusicManager init, Firebase init, anonymous auth, create 3D game
2. Show LandingScreen — wait for user choice (continue / cloud / new game)
3. Apply save; attempt cloud sync if available; MusicManager.start()
4. Init ProductionSystem → HyperlanePatrolSystem → ThreatSystem → CombatSystem → RouteSystem (reconstruct active ships + attacks), then HUDBridge + Tutorial

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

**Top-level state**: `ownedPlanets`, `focusedPlanet`, `routes[]`, `activeShips[]` (runtime only), `tutorialStep`

**Runtime combat state**: `activeAttacks[]`, `hyperlanePatrols[]`, `lastAttackTime{}`, `colonizationTime{}`

**Colony ship state**: `colonyShipsInOrbit[]`, `colonyShipsInFlight[]`, `colonyShipsArriving[]`

**Lifetime stats**: `stats.{ totalOreProduced, totalEnergyProduced, totalCrystalProduced, totalShipDeliveries, totalResourcesShipped, totalRobotsHired, planetsColonized, playTimeSeconds }`

**Events**: `siloChanged`, `baseBuilt`, `baseUpgraded`, `robotHired`, `robotUpgraded`, `routeAdded`, `routeRemoved`, `routeToggled`, `shipLaunched`, `shipArrived`, `depositUnlocked`, `productionTick`, `planetColonized`, `focusedPlanet`, `planetChanged`, `stateLoaded`, `colonyShipQueued`, `colonyShipBuilt`, `colonyShipLaunched`, `colonyShipArriving`, `colonyShipArrived`, `attackStarted`, `attackEnded`, `planetFallen`

**Key methods**: `buildBase(planetId)`, `hireRobot(planetId, type)`, `addRoute(route)`, `removeRoute(id)`, `toggleRoute(id)`, `buyBaseUpgrade(planetId, upgradeId)`, `buyRobotUpgrade(planetId, upgradeId)`, `addToSilo()`, `deductFromSilo()`, `siloHas()`, `getShipSlots(planetId)`, `queueColonyShip(planetId)`, `launchColonyShip(shipId, toPlanetId, distance)`

### Game Systems (`src/game/systems/`)

- **ProductionSystem.js** — Registers with `animationLoop.onUpdate()`. Per-planet, per-frame resource generation:
  - Ore: `count × 0.5 × speedMult × loadMult × planetMult.ore × max(1, unlockedZones)`
  - Energy: `count × 0.4 × speedMult × loadMult × planetMult.energy × max(1, unlockedZones) + passive`
  - Crystal: `count × 0.2 × speedMult × loadMult × planetMult.crystal × unlockedZones` (only if crystalZones > 0)
  - Scouts tick `depositProgress`; when threshold reached, a zone unlocks and production starts
  - Also advances `colonyShipBuildQueue` each frame
- **RouteSystem.js** — Registers with `animationLoop.onUpdate()`. Dispatches ships when routes are active and docking slots are free. Delivers cargo on arrival. Reconstructs in-flight ships from `gameState.activeShips` on load.
- **ThreatSystem.js** — Manages enemy invasion waves. Schedules attacks on owned planets, scales difficulty with game progression. Emits `attackStarted` / `attackEnded` events.
- **CombatSystem.js** — Simulates combat each frame. Applies enemy DPS to station HP, handles defense fire, processes active abilities (EMP, shieldBoost, orbitalStrike). Calls `reconstructAttacks()` on load for in-progress battles.
- **HyperlanePatrolSystem.js** — Moves enemy patrol groups along hyperlane paths. Integrates with RouteSystem to affect ship safety on contested lanes.

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

Shared GLSL utilities in `src/game/utils/ShaderLib.js` (noise, FBM, Fresnel).

### World Structure (`src/game/world/`)

- **Galaxy.js** — Manages all 8 planets (single system), 9 Hyperlanes, 6 cosmic NebulaVolume backdrops (`_createCosmicNebulas()`), patrol dots (`_createPatrolDots()`), and threat indicators (`_createThreatIndicators()`)
- **SolarSystem.js** — Groups Planet3D + Station3D + RobotManager3D + ShipManager3D + EnemyManager3D + AsteroidBelt + DustCloud + 6× NebulaVolume layers + LensFlare. Manages LOD visibility per component.
- **EnemyManager3D.js** — Pool of visual enemy ships, spawned/recycled per active attack wave
- **Hyperlane.js** — Glowing line with flowing particles between connected systems
- **Skybox.js** — Procedural starfield cubemap + 500 twinkling animated stars + nebula shader overlay (palette shifts per planet)
- **Ship3D.js** — 3D cargo vessel geometry and flight animation
- **ShipManager3D.js** — Pool of visual ship objects, spawned/recycled per active route

### 3D Objects (`src/game/objects/`)

- **Planet3D.js** — Sphere + ShaderMaterial + atmosphere mesh + optional rings
- **Station3D.js** — Procedural geometry (torus rings, spokes, panels, hub, nav light). Orbits planet.
- **Star3D.js** — Decorative star at the center of the system (uses StarShader)
- **Robot3D.js** — Base: 3D orbital flight, cargo cycle, engine trail
- **4 active robot types** in `robots/`: `miner`, `energyBot`, `builder`, `scout` (old MinerBot/ScoutBot/SpiderBot/HoverBot/TitanBot files exist but are unused)
- **RobotManager3D.js** — Pool of up to 32 visual robots
- **ColonyShip3D.js** — Colony ship model; flight animation from source to destination planet
- **EnemyShip3D.js** — Enemy fighter geometry
- **Mothership3D.js** — Special large enemy ship class
- **PatrolDot3D.js** — Visual indicator for enemy patrol presence on hyperlanes

### UI Components

- **PlanetPanel.js** (`src/game/ui/`) — Floating side panels shown when zoomed into a planet:
  - Left panel: base status, silos, ship routes
  - Right panel: robot hiring, active robots, robot specialization upgrades
  - Position tracks planet's screen coordinates
- **CombatHUD.js** (`src/game/ui/`) — Overlay panel showing station HP, shield HP, active attack waves, defense counts, and ability cooldown buttons
- **DefensePanel.js** (`src/game/ui/`) — UI for building and upgrading defense structures on a planet
- **Minimap.js** (`src/game/ui/`) — Top-down minimap for galaxy navigation
- **LandingScreen.js** (`src/ui/`) — Title screen on boot; also accessible as pause menu via ESC. Shows continue/cloud/new-game options and a cloud save browser.

### Tutorial & Audio

- **Tutorial.js** (`src/game/tutorial/`) — Guided onboarding. Tracks step via `gameState.tutorialStep`. Positions `#tutorial-hand` DOM element (pointer + bubble) over UI targets.
- **AudioManager.js** (`src/game/audio/`) — ~20 SFX via Web Audio API. Buffer pooling, volume/mute persisted to localStorage.
- **MusicManager.js** (`src/game/audio/`) — Background music system. Initialized with AudioManager's context and music gain node. Started after save is applied in boot phase 3.

### Visual Effects (`src/game/effects/`)

- **ClickFeedback.js** — Expanding ring + floating "+N" number at 3D click point
- **DustCloud.js** — 200 particles drifting around each planet
- **LensFlare.js** — Sprite-based glow + rays for star-type planets
- **NebulaVolume.js** — Billboard quad with FBM noise shader. Each SolarSystem now uses 6 layered NebulaVolume instances (primary, complementary, side, deep background, complementary color, triadic accent)
- **AsteroidBelt.js** — Particle ring of asteroids orbiting each planet
- **CombatEffects.js** — Combat VFX: laser fire, explosions, shield hits, EMP pulse, orbital strike beam
- **SpawnFlight.js** — Animation for robots spawning and flying to their orbit
- **MiningBurst.js** — Particle burst at mining contact points

### LOD Thresholds (camera distance)

| Distance | What changes |
|----------|-------------|
| < 180 | Planet shader animates |
| 180–220 | Asteroid belt fades in |
| < 100 | Rim + fill lights activate |
| < 80 | Station + colony ship become visible |
| < 60 | Robots become visible |
| 350–300 | Nebula volumes fade in |
| 15–300 | Label visible |

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
| `src/game/data/enemies.js` | ENEMY_TYPES (interceptor, bomber, raider, mothership) |
| `src/game/data/routes.js` | Route creation + validation |
| `src/game/data/galaxyLayout.js` | Planet positions (4000×4000 grid) + 9 hyperlane connections |
| `src/game/systems/ThreatSystem.js` | Enemy invasion wave scheduling + difficulty scaling |
| `src/game/systems/CombatSystem.js` | Frame-by-frame combat simulation, abilities, damage |
| `src/game/systems/HyperlanePatrolSystem.js` | Enemy patrol movement along hyperlanes |
| `src/game/ui/CombatHUD.js` | Combat overlay (station HP, shield, waves, abilities) |
| `src/game/ui/DefensePanel.js` | Defense building + upgrade UI |
| `src/game/utils/ShaderLib.js` | Shared GLSL (noise, FBM, Fresnel) |
| `src/game/utils/CoordinateMapper.js` | 2D galaxy coords → 3D world positions |
| `src/game/world/Ship3D.js` | 3D cargo ship geometry + animation |
| `src/game/world/ShipManager3D.js` | Visual ship pool management |
| `src/game/objects/Star3D.js` | Central star at system center |
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
- **Post-processing**: Bloom (UnrealBloomPass, strength 0.5, threshold 0.75), ACES Filmic tone mapping (exposure 1.1)
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
- **Camera**: Orbital (default) + free-fly (hold Shift). Scroll to zoom, click planet to focus. Dynamic near/far planes by zoom level (0.05–1.0 near, 500–2000 far).
- **Performance**: Distant planets (>300 units) update at 10% frequency. Hyperlanes skip updates beyond 250 units.
