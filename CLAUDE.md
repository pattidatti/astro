# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Astro Harvest: Galactic Extraction** — A space-themed idle/clicker game built with Phaser 3 and vanilla JavaScript (no TypeScript). Players mine ore, buy upgrades, deploy robots, and colonize planets.

- **Game engine**: Phaser 3.88 (Canvas renderer, no audio)
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

### Phaser Scene Flow

```
Boot → Planet + HUD (parallel scenes)
```

- **Boot** (`src/game/scenes/Boot.js`): Pre-generates planet textures, initializes Firebase, loads/resolves saves, then launches Planet and HUD scenes
- **Planet** (`src/game/scenes/Planet.js`): Main game view — starfield, planet, orbital station, robots, click interactions, planet transition animations
- **HUD** (`src/game/scenes/HUD.js`): HTML-based UI overlay — resource bars, upgrade grid, planet selector, stats panel, toast notifications

### State Management

**GameState** (`src/game/GameState.js`): Singleton with EventEmitter pattern. Holds all game data (resources, upgrades, planets, robots). Scenes and UI subscribe to events:

- `oreChanged`, `crystalChanged`, `energyChanged`
- `robotsChanged`, `upgradeBought`, `planetColonized`, `planetChanged`

### Save System (Dual)

- **LocalStorage** (`src/storage.js`): Auto-saves every 10s + on visibility change + on significant events
- **Firestore** (`src/db.js`): Cloud sync every 30s at `saves/{uid}/state/current`. Requires auth
- **Conflict resolution**: Prefer save with highest ore; tie-break by timestamp
- **Offline earnings**: 50% of production rate, capped at 8 hours

### Authentication

`src/auth.js`: Anonymous sign-in by default, optional Google Sign-In with account linking.

## Key Files

| Path | Purpose |
|---|---|
| `src/main.js` | Entry point — creates Phaser game |
| `src/game/Game.js` | Phaser config and initialization |
| `src/game/GameState.js` | Singleton state + EventEmitter |
| `src/game/data/planets.js` | 8 planets with costs, multipliers, colors |
| `src/game/data/upgrades.js` | 13 upgrades + cost scaling formula |
| `src/game/objects/RobotManager.js` | Manages robot visuals (max 32 visible) |
| `src/game/objects/PlanetRenderer.js` | Procedural canvas texture generation |
| `src/game/objects/Station.js` | Orbital station graphics |
| `src/game/objects/Starfield.js` | Background stars + nebula |
| `src/game/objects/robots/BaseRobot.js` | Base class: orbital mechanics, cargo cycle |
| `src/ui/HUD.css` | Full UI stylesheet (Stellaris-inspired panels) |
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

## Game Mechanics

- **Resources**: Ore (primary), Crystal (unlocked via upgrade), Energy (unlocked via upgrade)
- **Production**: `robots × 0.5 × efficiencyMultiplier × planetBonus + autoRate`
- **Upgrade cost scaling**: `baseCost × 1.15^level` — buy multiplier toggles ×1/×10/×100
- **8 planets**: Colonization costs range from 0 to 8M ore, bonuses from 0% to 3000%
- **5 robot types**: Miner, Scout, Spider, Hover, Titan — all extend `BaseRobot` with unique visuals
