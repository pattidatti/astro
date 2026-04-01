# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Astro Harvest: Galactic Extraction** — A space-themed idle/clicker game built with Three.js and vanilla JavaScript (no TypeScript). Players mine ore, buy upgrades, deploy robots, and colonize planets in a 3D galaxy.

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
main.js (boot: auth → save → init)
  → Game.js (Three.js setup)
    → Galaxy (8 SolarSystems + Hyperlanes)
      → SolarSystem (Planet3D + Station3D + RobotManager3D + effects)
    → Skybox (starfield cubemap + procedural nebula)
    → ClickFeedback (expanding ring + floating number)
```

### Engine Modules (`src/game/engine/`)

- **SceneManager.js** — Single THREE.Scene, lighting (directional sun + ambient + hemisphere)
- **CameraController.js** — Hybrid camera: orbital (drag/zoom/click-focus) + free (Shift+WASD+mouse)
- **RenderPipeline.js** — WebGLRenderer (logarithmic depth buffer) + EffectComposer (bloom, tone mapping)
- **AnimationLoop.js** — rAF loop, calls `gameState.tick(dt)` + update callbacks + render
- **InputManager.js** — Raycasting for 3D click detection on planet meshes

### State Management

**GameState** (`src/game/GameState.js`): Singleton with EventEmitter pattern. Holds all game data. Events:

- `robotsChanged`, `upgradeBought`, `planetColonized`, `planetChanged`
- `crystalUnlocked`, `energyUnlocked`, `stateLoaded`

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

- **Galaxy.js** — Manages all 8 SolarSystems and 10 Hyperlanes
- **SolarSystem.js** — Groups Planet3D + Station3D + RobotManager3D + DustCloud + NebulaVolume + LensFlare. Manages LOD visibility per component.
- **Hyperlane.js** — Glowing line with flowing particles between connected systems
- **Skybox.js** — Procedural starfield cubemap + nebula shader overlay (palette shifts per planet)

### 3D Objects (`src/game/objects/`)

- **Planet3D.js** — Sphere + ShaderMaterial + atmosphere mesh + optional rings
- **Station3D.js** — Procedural geometry (torus rings, spokes, panels, hub, nav light). Orbits planet.
- **Robot3D.js** — Base: 3D orbital flight, cargo cycle, engine trail
- **5 robot types** in `robots/`: MinerBot, ScoutBot, SpiderBot, HoverBot, TitanBot
- **RobotManager3D.js** — Pool of up to 32 visual robots, cycles through 5 types

### Visual Effects (`src/game/effects/`)

- **ClickFeedback.js** — Expanding ring + floating "+N" number at 3D click point
- **DustCloud.js** — 200 particles drifting around each planet
- **LensFlare.js** — Sprite-based glow + rays for star-type planets
- **NebulaVolume.js** — Billboard quad with FBM noise shader behind each planet

### LOD Thresholds (camera distance)

| Distance | Planet Shader | Station | Robots | Dust | Nebula Volume | Label |
|----------|--------------|---------|--------|------|---------------|-------|
| >150 | Static | hidden | hidden | hidden | hidden | hidden |
| 80-150 | Static | hidden | hidden | hidden | visible | visible |
| 60-80 | Animated | hidden | hidden | visible | visible | visible |
| 45-60 | Animated | visible | hidden | visible | visible | visible |
| 15-45 | Animated | visible | visible | visible | visible | visible |
| <15 | Animated | visible | visible | visible | visible | hidden |

### Save System (Dual)

- **LocalStorage** (`src/storage.js`): Auto-saves every 10s + on visibility change + on significant events
- **Firestore** (`src/db.js`): Cloud sync every 30s at `saves/{uid}/state/current`. Requires auth
- **Conflict resolution**: Prefer save with highest ore; tie-break by timestamp
- **Offline earnings**: 50% of production rate, capped at 8 hours

### Authentication

`src/auth.js`: Anonymous sign-in by default, optional Google Sign-In with account linking.

### HUD Bridge

`src/game/HUDBridge.js`: Standalone module (no Phaser dependency) that updates existing HTML DOM elements each frame. Handles upgrade grid, planet list, resource displays, toast notifications, panel toggles.

## Key Files

| Path | Purpose |
|------|---------|
| `src/main.js` | Entry point — boot sequence (auth → save → Three.js) |
| `src/game/Game.js` | Three.js init, galaxy setup, click handling, render loop |
| `src/game/GameState.js` | Singleton state + EventEmitter |
| `src/game/HUDBridge.js` | HTML HUD updates (non-Phaser) |
| `src/game/data/planets.js` | 8 planets with costs, multipliers, colors, nebula palettes |
| `src/game/data/upgrades.js` | 13 upgrades + cost scaling formula |
| `src/game/data/galaxyLayout.js` | System positions (4000×4000 grid) + hyperlane connections |
| `src/game/utils/ShaderLib.js` | Shared GLSL (noise, FBM, Fresnel) |
| `src/game/utils/CoordinateMapper.js` | 2D galaxy coords → 3D world positions |
| `src/ui/HUD.css` | UI stylesheet (Stellaris-inspired panels) |
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

- **Theme**: Stellaris-inspired sci-fi with gold/green palette
- **Colors**: Gold `#c8a84e` (main), green `#7cb85e` (accent), dark bg `#0a0e14`
- **Fonts**: Orbitron (headers/numbers), Share Tech Mono (body/values) — loaded via Google Fonts in `index.html`
- **Panel layout**: 270px left (upgrades), 250px right (stats), 56px top bar, 64px bottom bar (planet selector)
- **CSS**: All styling in `src/ui/HUD.css` — CSS Grid layout with scanline effects, gradient gold borders, glassmorphism panels
- **Post-processing**: Bloom (UnrealBloomPass), ACES Filmic tone mapping
- **Lighting**: Hybrid — directional sun + ambient + hemisphere + per-planet point lights

## Game Mechanics

- **Resources**: Ore (primary), Crystal (unlocked via upgrade), Energy (unlocked via upgrade)
- **Production**: `robots × 0.5 × efficiencyMultiplier × planetBonus + autoRate`
- **Upgrade cost scaling**: `baseCost × 1.15^level` — buy multiplier toggles ×1/×10/×100
- **8 planets**: Colonization costs range from 0 to 8M ore, bonuses from 0% to 3000%
- **5 robot types**: Miner, Scout, Spider, Hover, Titan — each with unique procedural 3D geometry
- **Camera**: Orbital (default) + free-fly (hold Shift). Scroll to zoom, click planet to focus.
