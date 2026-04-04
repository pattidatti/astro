# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Astro Harvest: Galactic Extraction** — A space-themed rts/idle game built with Three.js and vanilla JavaScript (no TypeScript). Players mine ore, build bases, deploy robots, establish ship routes, colonize planets, build military fleets, and defend against enemy invasions in a 3D galaxy.

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
main.js (boot: audio+auth → LandingScreen → 8 systems → HUD+tutorial)
  → Game.js (Three.js setup)
    → Galaxy (8 planets + 9 Hyperlanes + GalacticAsteroidBelt + cosmic nebulas + threat indicators)
      → SolarSystem (Planet3D + Station3D + RobotManager3D + DefenseManager3D + ShipManager3D
                     + EnemyManager3D + AsteroidBelt + DustCloud + NebulaVolume(×5) + LensFlare)
    → RoamingFleetManager3D (visual pool for roaming enemy fleets)
    → PlayerFleetManager3D (visual pool for player fleets + RTS selection)
    → Skybox (starfield cubemap + procedural nebula)
    → ClickFeedback (expanding ring + floating number)
    → Minimap
  → ProductionSystem (per-planet resource ticks + colony ship build)
  → ThreatSystem (invasion wave management)
  → CombatSystem (planet station combat simulation)
  → RoamingFleetSystem (enemy scout + invasion fleet movement)
  → RouteSystem (cargo ship dispatch + delivery)
  → FleetMovementSystem (player fleet Boids movement)
  → SupplySystem (fuel/ammo consumption + resupply)
  → FleetCombatSystem (open-space fleet vs fleet combat)
  → HUDBridge (DOM updates)
  → Tutorial
```

**Boot phases:**
1. AudioManager + MusicManager init, Firebase init, handle auth redirect, create 3D game
2. Show LandingScreen (3 save slots) — wait for user choice (continue / load / new game)
3. Apply save + cloud sync if available; `startAutoSave()`; `MusicManager.start()`
4. Init systems in order: `ProductionSystem` → `ThreatSystem` → `CombatSystem` (reconstructAttacks) → `RoamingFleetSystem` (reconstructFleets) → `RouteSystem` (reconstructActiveShips) → `FleetMovementSystem` → `SupplySystem` → `FleetCombatSystem` (reconstructEngagements), then `HUDBridge` + `Tutorial`

Tab visibility: `animationLoop.stop()` on `visibilitychange → hidden`; 200ms CSS poll for `game-paused` class. ESC opens pause menu (stops loop, reopens LandingScreen).

### Engine Modules (`src/game/engine/`)

- **SceneManager.js** — Single THREE.Scene, lighting (directional sun with shadows + ambient + hemisphere), exponential fog (density 0.0008)
- **CameraController.js** — Three camera modes: **orbital** (default, drag/zoom/click-focus), **free** (Shift+WASD+mouse), **RTS** (V-toggle, 120-unit radius, 22° elevation, top-down tactical view). Dynamic near/far planes by zoom level. `setPlanetColliders()` for collision, `trackObject()` for smooth following.
- **RenderPipeline.js** — WebGLRenderer (logarithmic depth buffer, PCFSoft shadow maps) + EffectComposer (bloom, ACES tone mapping)
- **AnimationLoop.js** — rAF loop, dt capped at 100ms. Calls registered `onUpdate(dt)` callbacks + render. Pauses on `document.hidden`.
- **InputManager.js** — Raycasting for 3D click/hover (planets, stations, defense objects, ships, fleet icons). RTS box-select with frustum culling. Waypoint placement on Y=0 plane.

### State Management

**GameState** (`src/game/GameState.js`): Singleton with EventEmitter pattern. Save version **5** (v1→v2→v3→v4→v5 migration supported).

**Per-planet state** (one record per owned planet):
```js
{
  hasBase: bool,
  baseLevels: { storage, shipSpeed, shipSlots, passiveEnergy },
  silos: { ore: { amount, capacity }, energy: { amount, capacity }, crystal: { amount, capacity } },
  robots: { miner: { count, speedLevel, loadLevel }, energyBot, builder, scout },
  deposits: { ... },            // from planets.js definition
  depositProgress: { ore, crystal, energy },  // scout unlock progress (seconds)
  upgradeLevels: {},
  buildQueue: [],
  colonyShipBuildQueue: [],     // [{ progress: 0 }] — one at a time
  militaryBase: {
    built: bool,
    hangars: 0–5,               // each hangar costs energy, adds fleetCap
    fleetCap: number,           // total fleet capacity (10 per hangar, 15 with fleet_formations tech)
    hp: number, maxHP: number,  // MILITARY_BASE_HP / MILITARY_BASE_MAX_HP from fleetCombatStats.js
    silo: { ore: { amount, capacity: 5000 }, energy: { amount, capacity: 5000 } },
    queue: [],                  // ship build queue [{ type, progress }]
  },
  combat: {
    stationHP, stationMaxHP, shieldHP, shieldMaxHP,
    defenses: { cannon, satellite, defenseShip, shield },  // counts
    defenseLevels: {},          // upgradeId → level
    abilityCooldowns: { emp, shieldBoost, orbitalStrike },
    activeEffects: [],          // [{ type, remaining }]
    fallen: bool,
  },
}
```

**Top-level state**:
- `ownedPlanets`, `focusedPlanet`, `routes[]`, `activeShips[]` (runtime only)
- `playerFleets[]` — `[{ id, planetId, position, waypoint, state, ships[], speed, supply:{ore,energy,oreMax,energyMax}, titanCooldown }]`
- `fleetEngagements[]` — `[{ id, playerFleetId, roamingFleetId, elapsed }]`
- `colonyShipsInOrbit[]`, `colonyShipsInFlight[]`, `colonyShipsArriving[]`
- `activeAttacks[]`, `roamingFleets[]`, `lastAttackTime{}`, `colonizationTime{}`
- `unlockedTech` (Set of tech node IDs), `_newTechAvailable` (bool, drives HUD pulse)
- `tutorialStep`, `lastSaved`

**Lifetime stats**: `stats.{ totalOreProduced, totalEnergyProduced, totalCrystalProduced, totalShipDeliveries, totalResourcesShipped, totalRobotsHired, planetsColonized, playTimeSeconds }`

**Key exported functions** (from GameState.js):
- `getColonyShipBuildCost(planetsColonized)` → `{ ore: 5000 × 1.5^colonized }`
- `colonyLaunchEnergyCost(distance)` → `50 + distance × 0.3`
- `computeFleetSupplyMax(ships, unlockedTech)` → `{ energyMax, oreMax }`

**Events**: `siloChanged`, `baseBuilt`, `baseUpgraded`, `robotHired`, `robotUpgraded`, `routeAdded`, `routeRemoved`, `routeToggled`, `shipLaunched`, `shipArrived`, `depositUnlocked`, `productionTick`, `planetColonized`, `focusedPlanet`, `planetChanged`, `stateLoaded`, `colonyShipQueued`, `colonyShipBuilt`, `colonyShipLaunched`, `colonyShipArriving`, `colonyShipArrived`, `attackStarted`, `attackEnded`, `planetFallen`, `techUnlocked`, `fleetSpawned`, `fleetMoved`, `fleetDestroyed`, `fleetArrived`, `cargoIntercepted`

### Game Systems (`src/game/systems/`)

- **ProductionSystem.js** — Per-planet, per-frame resource generation:
  - Ore: `count × 0.5 × speedMult × loadMult × planetMult.ore × max(1, unlockedZones)`
  - Energy: `count × 0.4 × speedMult × loadMult × planetMult.energy × max(1, unlockedZones) + passive`
  - Crystal: `count × 0.2 × speedMult × loadMult × planetMult.crystal × unlockedZones` (only if crystalZones > 0)
  - Scouts tick `depositProgress`; threshold → zone unlocks
  - Space elevator: pumps 2.0 ore+energy/s from planet silo → military base silo
  - Advances `colonyShipBuildQueue` and military `queue[]` each frame

- **RouteSystem.js** — One cargo ship per route. Dispatches when route active, slots free, hyperlane unblocked. Delivers on arrival. Reconstructs from `gameState.activeShips` on load.

- **ThreatSystem.js** — Schedules enemy waves on owned planets, scales difficulty by planet count + planet ID. Roaming fleets convert via `spawnFleetAttack()`. Emits `attackStarted` / `attackEnded`.

- **CombatSystem.js** — Full per-enemy simulation for focused planet, simplified net-DPS for background planets. Defense fire, active abilities (EMP, shieldBoost, orbitalStrike), builder repair. Calls `reconstructAttacks()` on load.

- **RoamingFleetSystem.js** — Two enemy fleet types: **scout** (hyperlane network, speed 0.04, intercept cargo) and **invasion** (free movement, mothership, speed 0.025). Max 4 concurrent. Calls `reconstructFleets()` on load.

- **FleetMovementSystem.js** — Player fleet Boids movement. Fleet center moves toward waypoint at `fleet.speed` (world units/s). Sun avoidance (repulsion within 35 units). Per-ship: separation (7-unit radius, strength 22), cohesion (6), alignment (10). Velocity damping 0.88, max local velocity 8, max spread 18. Arrives within 3 units.

- **SupplySystem.js** — Energy (fuel): consumed at 5/s per ship while moving. Ore (ammo): consumed at 8/s per ship while engaged. Resupply at 20/s within 20 units of allied military base. Carrier doubles resupply rate + restores 5 ore/s in combat. DPS penalty when ore < 20% capacity: DPS × 0.3.

- **FleetCombatSystem.js** — Aggro scan every 0.5s at 30-unit radius. Per-ship DPS from `MILITARY_SHIPS`. Carrier heals 5 HP/s within 20 units. Ship behaviors: fighter circles (3-unit orbit), bomber standoff (22 units), carrier support rear, battleship artillery (16 units), titan dreadnought (18 units). Disengage beyond 50 units. Titan Ultimate: 120s cooldown, 50 ore, 15-unit AoE — instakills enemies with maxHP ≤ 90, 200 damage to others. Calls `reconstructEngagements()` on load.

### Planet Rendering (`src/game/shaders/planet/`)

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

- **Galaxy.js** — Manages all 8 planets, 9 Hyperlanes, GalacticAsteroidBelt (inner 370–450 + outer 1500–1700 radius), 10 DustCloud instances, 6 cosmic NebulaVolume backdrops, threat indicators. Hosts RoamingFleetManager3D + PlayerFleetManager3D.
- **SolarSystem.js** — Groups Planet3D + Station3D + RobotManager3D + DefenseManager3D + ShipManager3D + EnemyManager3D + AsteroidBelt + DustCloud + 5× NebulaVolume + LensFlare. Manages LOD per component.
- **EnemyManager3D.js** — Pool of up to 12 enemy ships + 2 motherships per active attack wave
- **Hyperlane.js** — Glowing tube (HyperlaneShader) with 60 flowing particles between systems
- **Skybox.js** — Procedural starfield cubemap (2048px, 2000 stars/face) + 2000 twinkling near-stars + domain-warped nebula with Milky Way band. Palette shifts per planet.
- **Ship3D.js** — 3D cargo vessel geometry and flight animation
- **ShipManager3D.js** — Pool of visual cargo ships, spawned/recycled per active route
- **DefenseManager3D.js** — Visual defense structures per planet: DefenseSatellite3D + PatrolShip3D. Provides fire-position lookups for CombatEffects.
- **RoamingFleet3D.js** — 3D visual for a roaming enemy fleet (group of EnemyShip3D meshes)
- **RoamingFleetManager3D.js** — Pool manager for RoamingFleet3D instances
- **PlayerFleet3D.js** — 3D visual representation of a player fleet (ship group with formation)
- **PlayerFleetManager3D.js** — Pool manager for PlayerFleet3D; handles RTS selection targets and fleet world-position lookups
- **RouteLane3D.js** — Visual lane rendered between planets with an active trade route

### 3D Objects (`src/game/objects/`)

- **Planet3D.js** — Sphere + ShaderMaterial + atmosphere mesh + optional rings. Dual LOD (64×64 hi / 32×32 lo).
- **Station3D.js** — Procedural geometry (torus rings, spokes, panels, hub, nav light). Orbits planet at radius 15, speed 0.1.
- **Star3D.js** — Central star (StarShader + PointLight)
- **Robot3D.js** — Base 8-state mining cycle (orbit → descend → surface → bore → underground → ascend → return), engine trail, cargo threshold 3
- **5 visual robot classes** in `robots/`: `MinerBot`, `ScoutBot`, `SpiderBot`, `HoverBot`, `TitanBot`
- **RobotManager3D.js** — Pool of up to 32 visual robots, cycles through 5 robot classes
- **ColonyShip3D.js** — Colony ship; orbit mode (radius 20) and travel mode (parabolic arc)
- **EnemyShip3D.js** — Enemy fighter: interceptor (needle), bomber (bulky), raider (fork-shape). HP bar + hit-flash.
- **Mothership3D.js** — Enemy dreadnought (2.5× scale). Warp-in animation, pulsing engines (2.8 Hz), weapon charging (2.2 Hz), HP bar.
- **MilitaryBase3D.js** — Visual military base structure on planet surface. Shows hangar count and HP state.
- **DefenseSatellite3D.js** — Orbiting defense platform with weapon arms, solar fins, sensor dome, click hitbox
- **PatrolShip3D.js** — Military patrol fighter with swept wings, dual engine pods, forward cannon, nav lights

### UI Components

- **PlanetPanel.js** (`src/game/ui/`) — Floating side panels when zoomed into a planet. Tabbed: base build/upgrade, robot hire/upgrade, silo status, trade routes, colony ship launcher. Hosts DefensePanel.
- **CombatHUD.js** (`src/game/ui/`) — Alert banners (INVASION INCOMING, RAID DETECTED, THREAT NEUTRALIZED, STATION DESTROYED, CARGO INTERCEPTED) + floating combat summary. Alerts auto-dismiss after 4s.
- **DefensePanel.js** (`src/game/ui/`) — Defense build/upgrade grid (cannon, satellite, defenseShip, shield). Ability buttons (EMP, orbitalStrike, shieldBoost) with pie-chart cooldown overlays.
- **MilitaryPanel.js** (`src/game/ui/`) — Military base status: hangars, fleet capacity, HP bar. Ship build queue management. Supply level bars (fuel/ammo). Build cost from military base silo.
- **PlayerFleetPanel.js** (`src/game/ui/`) — Player fleet composition (ship counts with HP bars). Titan Ultimate button with cooldown. Fuel/ammo supply bars. Fleet movement controls.
- **Minimap.js** (`src/game/ui/`) — 160×160px canvas. Hyperlanes, planet dots, attack pulse rings, player fleet markers, roaming fleet threat indicators, camera crosshair. Zoom ×0.5–4. Hides near planets.
- **FleetPanel.js** (`src/game/ui/`) — Roaming fleet inspection: type (scout/invasion), enemy composition with HP bars, destination, ETA.
- **TechTreeWindow.js** (`src/game/ui/`) — Modal tech tree, 4 branches (robots, defense, military, colonization). Nodes show locked/available/unlocked with SVG dependency lines. Press T to toggle.
- **LandingScreen.js** (`src/ui/`) — Title screen + pause menu (ESC). 3 save slots (slot_1/slot_2/slot_3). Continue / load / new-game options. Cloud save browser. Google Sign-In.

### Tutorial & Audio

- **Tutorial.js** (`src/game/tutorial/`) — Step-based guided onboarding. Tracks via `gameState.tutorialStep`. Positions `#tutorial-hand` DOM element over UI targets. Steps: build base → hire energy bot → unlock miner in research → hire miner → watch ore silo → expand storage → farewell.
- **AudioManager.js** (`src/game/audio/`) — ~20 SFX via Web Audio API. Buffer pooling. Procedural synth sounds (fleet explosion, Titan ultimate, carrier hum). Volume/mute persisted to localStorage.
- **MusicManager.js** (`src/game/audio/`) — Background music. Fade in/out on planet switch. Started after save applied.

### Visual Effects (`src/game/effects/`)

- **ClickFeedback.js** — Expanding ring + floating "+N" at 3D click point
- **DustCloud.js** — Particles drifting around each planet / galaxy zone
- **LensFlare.js** — Sprite-based glow + rays for star-type planets
- **NebulaVolume.js** — Billboard quad with FBM noise shader, 5 layered per SolarSystem
- **AsteroidBelt.js** — Particle ring orbiting each planet
- **GalacticAsteroidBelt.js** — Galaxy-scale field (inner 370–450, 4000 particles; outer 1500–1700, 3000 particles)
- **CombatEffects.js** — Laser fire, explosions, shield hits, EMP pulse, orbital strike beam
- **SpawnFlight.js** — Robots spawn-fly animation
- **MiningBurst.js** — Particle burst at mining contact points

### LOD Thresholds (camera distance)

Camera zones: `galaxy` (d > 200), `system` (d > 50), `planet` (d > 15), `close` (d ≤ 15)

| Distance | What changes |
|----------|-------------|
| < 180 | Planet shader animates |
| 180–220 | Asteroid belt fades in |
| < 100 | Rim + fill lights activate |
| < 80 | Station + colony ship visible |
| < 60 | Robots visible |
| 350–300 | Nebula volumes fade in |
| 15–300 | Label visible |

Dynamic near/far planes: d < 20 → 0.05/500, d < 80 → 0.1/1000, else → 1.0/2000

### Save System

- **3 save slots** (`slot_1`, `slot_2`, `slot_3`). Active slot stored in `sessionStorage('astro_active_slot')`.
- **LocalStorage** (`src/storage.js`): Auto-saves every 10s + visibility change + significant events. Key: `astro_save_<slot>`.
- **Firestore** (`src/db.js`): Cloud sync every 30s at `saves/{uid}/state/current`. Requires auth.
- **Conflict resolution**: Prefer highest ore; tie-break by timestamp.
- **Save version**: 5 (migration from v1→v5 supported in `GameState.deserialize()`).

### Authentication

`src/auth.js`: `handleAuthRedirect()` on boot (OAuth redirect flow). `getCurrentUser()`, `signOut()`. Optional Google Sign-In with account linking. `onAuthReady(callback)` fires once auth state resolves.

### HUD Bridge

`src/game/HUDBridge.js`: Updates DOM each frame. Resource displays, planet panel visibility, toast notifications (5s), menu button, research (T) button pulse when `_newTechAvailable`.

## Key Files

| Path | Purpose |
|------|---------|
| `src/main.js` | Entry point — boot sequence (8 systems) |
| `src/game/Game.js` | Three.js init, galaxy setup, click handling, render loop |
| `src/game/GameState.js` | Singleton state + EventEmitter (v5 save format) |
| `src/game/HUDBridge.js` | HTML HUD updates + toast notifications |
| `src/game/systems/ProductionSystem.js` | Per-planet resource generation, space elevator, ship build ticks |
| `src/game/systems/RouteSystem.js` | Cargo ship dispatch + delivery |
| `src/game/systems/ThreatSystem.js` | Enemy invasion wave scheduling + difficulty scaling |
| `src/game/systems/CombatSystem.js` | Planet station combat (full + simplified DPS modes) |
| `src/game/systems/RoamingFleetSystem.js` | Enemy scout/invasion fleet movement, lane blocking |
| `src/game/systems/FleetMovementSystem.js` | Player fleet Boids movement + waypoint navigation |
| `src/game/systems/SupplySystem.js` | Fleet fuel/ammo consumption + resupply near military bases |
| `src/game/systems/FleetCombatSystem.js` | Open-space fleet combat, ship behaviors, Titan ultimate |
| `src/game/ui/PlanetPanel.js` | Planet detail panels (base, robots, silos, routes, colony) |
| `src/game/ui/MilitaryPanel.js` | Military base build queue, hangar management, supply bars |
| `src/game/ui/PlayerFleetPanel.js` | Player fleet composition, Titan ultimate, supply bars |
| `src/game/ui/DefensePanel.js` | Defense build/upgrade, active ability cooldown overlays |
| `src/game/ui/CombatHUD.js` | Alert banners + combat summary overlay |
| `src/game/ui/FleetPanel.js` | Roaming fleet inspection panel |
| `src/game/ui/TechTreeWindow.js` | Tech tree modal (press T) |
| `src/game/ui/Minimap.js` | Galaxy minimap with fleet markers |
| `src/game/tutorial/Tutorial.js` | Guided onboarding |
| `src/game/audio/AudioManager.js` | SFX + procedural synth sounds |
| `src/game/audio/MusicManager.js` | Background music system |
| `src/ui/LandingScreen.js` | Title/pause screen, 3-slot save management |
| `src/game/data/planets.js` | 8 planets: costs, multipliers, resourceTypes, deposits, nebula palettes |
| `src/game/data/upgrades.js` | BASE_UPGRADES (4) + ROBOT_UPGRADES (8) + ROBOT_ACTIONS (4) + cost helpers |
| `src/game/data/defenses.js` | DEFENSE_TYPES (4) + DEFENSE_UPGRADES + ACTIVE_ABILITIES (3) + balance constants |
| `src/game/data/militaryShips.js` | 5 ship types: fighter/bomber/carrier/battleship/titan (stats, costs, combat behavior) |
| `src/game/data/militaryStats.js` | Supply balance: FUEL_BURN_RATE, AMMO_BURN_RATE, RESUPPLY_RATE, TITAN constants |
| `src/game/data/fleetCombatStats.js` | Fleet combat geometry: ENGAGE_RADIUS (30), DISENGAGE_RADIUS (50), per-ship positioning |
| `src/game/data/enemies.js` | ENEMY_TYPES (interceptor/bomber/raider/mothership) + RAID/INVASION_TEMPLATES |
| `src/game/data/routes.js` | Route creation + validation + travel duration calc |
| `src/game/data/galaxyLayout.js` | Planet positions (4000×4000 grid) + 9 hyperlane connections |
| `src/game/data/techTree.js` | Tech nodes (4 branches: robots/defense/military/colonization), FREE_TECH_IDS |
| `src/game/utils/ShaderLib.js` | Shared GLSL (noise, FBM, Fresnel) |
| `src/game/utils/CoordinateMapper.js` | 2D galaxy coords → 3D world positions |
| `src/game/world/Galaxy.js` | All 8 solar systems, asteroid belts, nebulas, fleet managers |
| `src/game/world/SolarSystem.js` | Per-planet 3D group with LOD management |
| `src/game/world/PlayerFleet3D.js` | 3D visual for a player fleet |
| `src/game/world/PlayerFleetManager3D.js` | Pool manager for player fleet visuals + RTS selection |
| `src/game/world/RoamingFleet3D.js` | 3D visual for a roaming enemy fleet |
| `src/game/world/RoamingFleetManager3D.js` | Pool manager for roaming fleet visuals |
| `src/game/world/DefenseManager3D.js` | Defense structure visuals + fire-position lookup |
| `src/game/world/ShipManager3D.js` | Cargo ship visual pool |
| `src/game/world/RouteLane3D.js` | Visual lane for active trade routes |
| `src/game/objects/MilitaryBase3D.js` | Military base geometry on planet surface |
| `src/game/objects/DefenseSatellite3D.js` | Orbiting defense satellite geometry |
| `src/game/objects/PatrolShip3D.js` | Military patrol fighter geometry |
| `src/game/objects/Station3D.js` | Orbital station geometry |
| `src/ui/HUD.css` | UI stylesheet (glassmorphism, gold palette) |
| `src/ui/LandingScreen.css` | Landing/pause screen styles |
| `src/firebase.js` | Firebase init (graceful offline fallback) |
| `src/storage.js` | LocalStorage save/load, 3-slot management, auto-save |
| `src/db.js` | Firestore cloud sync |
| `src/auth.js` | Firebase auth (anonymous + Google Sign-In) |

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
- **Fonts**: Orbitron (headers/numbers), Share Tech Mono (body/values) — Google Fonts in `index.html`
- **Panel layout**: 380px floating side panels, shown/hidden by zoom level. Menu button top-left.
- **CSS**: All styling in `src/ui/HUD.css` + `src/ui/LandingScreen.css` — glassmorphism panels, gradient gold borders
- **Post-processing**: Bloom (UnrealBloomPass, strength 0.8, threshold 0.6, smoothRadius 0.55) + ColorGradeShader (S-curve, vignette, chromatic aberration), ACES Filmic tone mapping (exposure 1.1)
- **Lighting**: Directional sun (PCFSoft shadows) + ambient + hemisphere + per-planet rim + fill lights
- **Shadows**: Planet meshes cast shadows, rings receive. Shadow map 1024×1024.
- **Fog**: Exponential fog (0.0008 density) for depth at galaxy scale

## Game Mechanics

- **Resources**: Ore, Crystal, Energy — independent silos per planet
- **Production**: Per-planet per-frame (ProductionSystem). Zone count = multiplier. 0 unlocked zones = 0 production.
- **Deposit unlock**: Scouts accumulate `depositProgress`; threshold → zone unlocks → production starts
- **Base upgrades** (4): Storage expansion, ship speed, docking slots, passive energy — each 3–5 levels, cost in energy
- **Robot upgrades** (8): Speed + load per robot type — 5 levels each
- **Robot hire cost**: Scales with existing count (`energyCostFn(ps)` in ROBOT_ACTIONS)
- **Upgrade cost scaling**: `baseCost × 1.15^level` — buy multiplier toggles ×1/×10/×100
- **8 planets**: Xerion (free home) → Voidex (~8M energy). Each has `resourceTypes` and `planetMult` bonuses.
- **Colony ships**: Multi-step — (1) build on planet (cost: `5000 ore × 1.5^planetsColonized`, 20s); (2) launch to unowned planet (cost: `50 + dist × 0.3` energy); (3) ship flies + enters orbit; (4) build base manually. Recolonizing fallen planet costs `baseCost × RECOLONIZE_COST_MULT`.
- **Military base**: Build with 2000 ore + 1500 energy. Add hangars (1000 + 500×n energy each, max 5, 10–15 fleet cap/hangar). Build ships from military silo. Space elevator pumps 2 ore+energy/s from planet silo.
- **Military ships** (5 types):

| Ship | Cost (ore/energy/crystal) | HP | DPS | Build | Fleet cap |
|------|--------------------------|-----|-----|-------|-----------|
| Fighter | 150/80/— | 60 | 8 | 15s | 1 |
| Bomber | 300/200/— | 90 | 15 | 25s | 2 |
| Carrier | 800/500/— | 200 | 2 | 40s | 4 |
| Battleship | 1500/800/— | 300 | 12 | 60s | 5 |
| Titan | 5000/2000/100 | 800 | 20 | 120s | 10 |

- **Fleet combat**: Player fleets engage roaming fleets within 30 units. Disengage beyond 50 units. Supply runs out → reduced DPS. Carrier heals fleet. Titan ultimate (120s cooldown, 50 ore) AoE instakills light enemies.
- **Combat & Defense**: Station HP (`BASE_STATION_HP`). Waves of interceptor/bomber/raider/mothership. 3 abilities: EMP, shieldBoost, orbitalStrike. Planet falls → `combat.fallen = true`, fraction of robots lost. Builders repair HP.
- **Tech tree**: 4 branches (robots/defense/military/colonization). Costs energy, requires prerequisites. `FREE_TECH_IDS` unlocked on new game. Access via T.
- **Camera modes**: Orbital (default), free-fly (Shift), RTS top-down (V). Scroll to zoom, click planet to focus.
- **Performance**: Distant planets (>300 units) update at 10% frequency. Hyperlanes skip updates beyond 250 units.
