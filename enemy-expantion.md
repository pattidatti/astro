# Enemy Expansion: Galactic Strongholds (Technical Design Document)

## 1. Vision & Core Loop

This expansion transitions the game from a "wave-based" defense game to a "persistent-territory" RTS/Idle hybrid. The primary gameplay loop is: **scout → provoke → destroy** enemy strongholds to permanently "clear" sectors of the galaxy.

There are **7 enemy stations** total:
- **4 planet-anchored stations** orbiting outside the per-planet asteroid belt (~50 units from planet center)
- **3 free-floating outposts** on independent elliptical orbits around the central sun

**End-game:** When all 7 stations are cleared (`cleared = true`), the player achieves permanent peace — no more station-driven invasions or scouts. `ThreatSystem` waves (scaling with owned planets) continue as normal. Stations do **not** re-spawn.

---

## 2. Enemy Station Archetypes

### Planet-Anchored Stations

| Type | Planet | Visual Style | HP | Shield | War-Phase DPS | Special |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lava** | Drakon | Magma core, red emissive | 800 | 200 | High | Beams ignore 20% of player shield |
| **Ice** | Glacius | Frozen glass, blue-white emissive | 600 | 600 | Medium | Frost beams reduce player fleet speed −40% |
| **Industrial** | Crystara | Dark metal, amber emissive | 700 | 400 | Medium | Kinetic weaponry, balanced |
| **Void** | Voidex | Dark aura, purple emissive | 1200 | 300 | High | Energy-drain pulses reduce supply regen |

> Note: "Terran" from earlier drafts is renamed **Industrial** — Crystara (`cryst` type) is the closest thematic fit.

Station orbit radius: **~50 units** in planet-local space (outside the per-planet asteroid belt, which spans 25–40 units).

### Free-Floating Outposts (3 generic stations)

Independent elliptical orbits around the central sun. Generic visual style (hostile dark-metal variant of existing station geometry). Same 4-phase state machine as planet-anchored stations.

```js
// galaxyLayout.js
FREE_FLOATING_BASES: [
  { id: 'outpost_alpha', orbitRadius: 550,  orbitAngle: Math.PI * 0.3, orbitSpeed: 0.003, inclination: 0.05,
    patrolLanes: [['crystara', 'glacius']] },
  { id: 'outpost_beta',  orbitRadius: 950,  orbitAngle: Math.PI * 1.1, orbitSpeed: 0.002, inclination: 0.07,
    patrolLanes: [['drakon', 'voidex']] },
  { id: 'outpost_gamma', orbitRadius: 1250, orbitAngle: Math.PI * 1.7, orbitSpeed: 0.001, inclination: 0.04,
    patrolLanes: [['xerion', 'drakon']] },
]
```

> **Merk:** Det er ikke stasjonene selv som blokkerer hyperlaner — det er patrol-skipene de sender ut. Outpost-spawnte scouts får `fromPlanet`/`toPlanet` fra den konfigurerte `patrolLanes`-lista, slik at de fungerer med det eksisterende `isLaneBlocked()`-systemet.

---

## 3. The Awakening & Escalation Mechanics

Hostility is local and triggered by player expansion or aggression.

### Awakening Triggers (Dormant → Alert)
1. **Expansion**: Player colonizes their **3rd planet** → the **2 nearest dormant stations** (by 3D world-distance to the newly colonized planet) awaken simultaneously.
2. **Aggression**: Player fleet moves **within 50 units** of a dormant station → that station awakens.
   - Only player-controlled fleets count (not roaming enemy fleets).

Once awakened, a station **never returns to Dormant**.

### Phase State Machine

```
Dormant ──[3rd colony / fleet proximity]──► Alert
Alert   ──[scout snitches / fleet sighted]──► Skirmish
Skirmish──[station takes direct damage]──────► War
```

| Phase | Visual | Ship Production | Fleet Behavior |
| :--- | :--- | :--- | :--- |
| **Dormant** | Static, blue emissive | None | Nothing |
| **Alert** | Yellow emissive lights | 1–2 scouts (via RoamingFleetSystem) | Scouts monitor; can snitch |
| **Skirmish** | Orange emissive | Raiders + patrol scout fleets | Scouts block hyperlanes (existing `isLaneBlocked`) |
| **War** | Pulsing red emissive (2s cycle) | Motherships + heavy invasion fleets | Full invasion waves on player planets |

### Station Invasion Cap (separate from ThreatSystem)
`EnemyStationSystem` maintains its own `stationInvasionCount` pool (max **2** concurrent station-spawned invasions). This is independent of `ThreatSystem`'s `MAX_CONCURRENT_ATTACKS = 3` — both pools coexist. This prevents stations from filling the attack cap and blocking normal `ThreatSystem` waves.

War-phase stations: **180s cooldown** between invasions, tracked via `lastSpawnTime` in station state.

### Distress Flare
At **< 15% HP**: a pulsating red particle pillar (200 units high, `MiningBurst`-style emitter) appears — **purely visual**. Simultaneously, a snitch scout is dispatched toward the nearest neighboring station, which triggers that station's Alert phase on arrival via the normal snitch mechanic.

> **Chain-reaksjon cap:** Maks 1 ledd. En stasjon som blir alertet via distress flare sender **ikke** sin egen distress flare videre — den kan fortsatt produsere vanlige snitch-scouts, men ingen kaskade av distress-kallet.

---

## 4. The Snitch Mechanic

When a scout fleet **witnesses a battle** (a player fleet engages any entity within **30 units** of the scout — matching `ENGAGE_RADIUS` from `fleetCombatStats.js`):

- Scout sets `isSnitching: true`, `snitchTarget: nearestStationId`, `snitchMode: 'hyperlane' | 'freespace'`
- Scout flees toward the target station:
  - **`snitchMode: 'hyperlane'`** — planet-anchored stations: navigerer langs hyperlane-grafen
  - **`snitchMode: 'freespace'`** — free-floating outposts: reiser i rett linje gjennom fri rom
- **Speed**: 0.03 units/s (player fleet speed is typically 0.05+ — a narrow but real catch window)
- **Red Path Visual**: a solid red `LineSegments` line renders from the scout's current position to its destination station (no particles — distinct from `RouteLane3D`)
- **On arrival**: destination station immediately advances to Alert phase; emits `stationAlerted` event
- **Chain reaction**: the newly alerted station spawns its own scouts, which can snitch further (but does **not** re-dispatch a distress flare — max 1 chain for distress)

### Snitch Interrupt
If the snitching scout fleet is **killed before reaching its destination**: `isSnitching` is cleared, `SnitchPath3D` is removed, and **no `stationAlerted` is emitted**. The player is rewarded for catching the scout. This is the primary counterplay to the snitch mechanic.

**Implementation:**
- Extend `RoamingFleetSystem` with `_tickSnitchBehavior()`
- Add `isSnitching: bool`, `snitchTarget: string | null`, `snitchMode: 'hyperlane' | 'freespace'` to roaming fleet state
- New file: `src/game/world/SnitchPath3D.js` — `LineSegments` rendered per active snitching scout

---

## 5. Hyperlane Interception (Blocker Fleets)

Station-spawned scout fleets use the **existing `isLaneBlocked()` system** in `RoamingFleetSystem`. No new "Blocker Fleet" entity is needed.

- In **Skirmish** and **War** phases, stations spawn patrol scout fleets that roam hyperlanes
- While a scout fleet with alive enemies occupies a lane, `RouteSystem` skips cargo dispatch on that route
- **Visual state change**: The `RouteLane3D` for a blocked lane switches to a dim red/orange tint (opacity reduced, color shifted) via new `setBlocked(bool)` method
- **UI**: Clickable toast "⚠ ROUTE BLOCKED — [Lane Name]" that centers camera on the blocking fleet

---

## 6. Station Combat (Admiral Mode)

### Flow
1. Player enters Admiral Mode (V key) and **box-selects** ships
2. **Left-click** on enemy station mesh → `EnemyStationPanel` opens (HP/shield bars, phase, type, debuff info)
   - Disambiguering fra box-select: `InputManager` bruker **5px drag-threshold**. Hvis musen beveger seg < 5px mellom `mousedown` og `mouseup` = klikk (panel åpnes). Hvis > 5px = box-select starter.
3. **Right-click** on station with ships selected → station set as attack waypoint in `FleetMovementSystem`
4. Fleet arrives within **~20 units** → `FleetCombatSystem._tickStationCombat()` activates

### Combat Logic
- **Player → Station**: fighters/bombers/battleships apply DPS each frame; shield absorbs first
- **Station → Player**: fires on closest player ships; DPS scales by phase (Alert: low, Skirmish: medium, War: high)
- **Type-specific debuffs**: Ice slows fleet speed (−40%); Void drains supply regen; Lava ignores 20% of shield
- **Carriers**: existing heal behavior applies — heal nearby ships while in combat range
- **Station destroyed**: emits `enemyStationDestroyed` → wreckage spawns → `cleared = true` → visual collapse animation

---

## 7. The Aftermath: Wreckage & Scavenging

### Wreckage Fields
Upon station destruction, **3–5 persistent debris nodes** spawn at the station's world position.
- Each node has a random resource pool (Ore and/or Crystal)
- Lifetime: **10 minutes game-time** (dt-accumulated — timer pauses when game is tabbed out/paused). Stored as `elapsed` field (seconds), not a wall-clock timestamp.
- Clearing a station permanently removes the interception/invasion risk from that station

### Scavenger Ship (New Unit)

Built on the **military base**, deployed manually in Admiral Mode. Deployes som **solo-flåte** (1 skip = eget entry i `playerFleets[]`) — ikke som del av en multi-skip flåte. Dette unngår behov for per-skip seleksjon innad i en flåte.

```js
// militaryShips.js
{
  type: 'scavenger',
  hp: 150,
  dps: 1,
  tractorRange: 15,
  holdCapacity: { ore: 200, crystal: 100 },
  combatBehavior: 'none',       // does not auto-engage; excluded from FleetCombatSystem aggro scan
  cost: { ore: 400, energy: 600 },
  requiredTech: 'scavenger_vessels',  // military branch, requires 'battleship' node
}
```

> **Scavenger aggro-eksklusjon:** `FleetCombatSystem` hopper over aggro-scan for flåter der `fleet.ships[0]?.type === 'scavenger'`. Med `dps: 1` ville den ellers "engasjere" fiender meningsløst og tømme ammo.

> **Flee-behavior:** Manuelt — spilleren må selv flytte scavengeren ut av fare. Ingen auto-flee er implementert.

**Hold persistence:** Scavengerens last lagres direkte i `playerFleets[]`-entryen som `hold: { ore, crystal }` — **ikke** i en separat `scavengerHolds[]`-array. Dette gjør at holdet persisteres automatisk med savefilen.

**Collection flow:**
- Player sends scavenger to wreckage area in Admiral Mode
- When within `tractorRange` (15 units) and stationary: tractor beam activates
  - Visual: amber `LineSegments` from scavenger to each nearby wreckage node
  - Floating "+N ore/crystal" numbers drift upward
  - Resources fill the scavenger's hold; **når holdet er fullt stopper tractor beam** (overflow til Carriers er ikke i scope for v1)
- Player delivers by **right-clicking a target** (owned planet / Station3D / military base) with the scavenger selected
  - Ship flies to target and auto-docks
  - Visual: beam to silo + "+N ore/crystal" floating confirmation numbers
  - Resources deposited into target planet's silo

---

## 8. Combat & Logistics (Admiral Mode)

Admiral Mode (V key) is a **camera mode only** — isometric RTS view with box-select and right-click waypoints. All fleet commands (move, attack, deliver) are issued here.

### Emergency Jump (Fleet Ability)
- **Cost**: 40% of fleet's `supply.energy.max` — blocked if current energy < 40% max
- **Cooldown**: 300 seconds — visualized as a fill-bar (samme mønster som Titan Ultimate: `pfp-cooldown-bar-wrap` / `pfp-cd-fill`) i `PlayerFleetPanel`
- **Destination**: Player chooses — clicking "EMERGENCY JUMP" expands the button to a **dropdown list** of owned planets/bases sorted by 3D distance (planet name + distance shown). Player clicks a destination to execute the jump.
  - `FleetMovementSystem` kaller `this._galaxy.getOwnedStationPositions()` → `[{planetId, worldPos}]`
  - `Galaxy.js` eksponerer `getOwnedStationPositions()` — ny metode
  - `FleetMovementSystem.setGalaxy(galaxy)` settes ved init i `Game.js`
- **Effect**: instant teleport + `WarpDistortionEffect` (0.4s full GLSL radial blur shader i `RenderPipeline.js`, uniform: `uCenter`, `uStrength`, `uProgress`) + audio "pop"
- **Button**: in `PlayerFleetPanel`, below the Titan button

### Auto-Resupply at Friendly Stations
When a player fleet orbits a friendly `Station3D` or military base:
- Automatically fills `supply.ore` (ammo) and `supply.energy` (fuel) from that planet's silo
- Rate: **20 units/sec** per resource (same as military base — uses existing `RESUPPLY_RATE` constant)
- Visual: beam from station to fleet + "+N" floating numbers
- No player action required

---

## 9. Audio & UI Feedback

### Sound
- **Dormant stations**: deep industrial hum (low-pass filter scales with camera distance)
- **Alert phase**: sharp siren burst on phase transition
- **War phase**: continuous low rumble with occasional weapon charge sounds
- **Station destruction**: massive metallic crash + shockwave audio
- **Emergency Jump**: warp "pop" audio

### HUD
- **`CombatHUD`**: "THREAT DETECTED" banner when entering a sector with a non-dormant station; "WAR ZONE" when a station enters War phase nearby
- **`Minimap`**: enemy stations render as pulsing red diamonds; clear/dim when destroyed
- **`HUDBridge` toasts**:
  - `stationAwakened` → clickable toast, centers camera on station
  - `stationDestroyed` → clickable toast, centers on wreckage
  - `snitchDetected` → "⚠ SCOUT FLEEING" with red indicator

### `EnemyStationPanel` (left-click on station)
- HP bar + shield bar
- Phase indicator (DORMANT / ALERT / SKIRMISH / WAR) with color coding
- Station type and type-specific debuff description
- "CLEARED" badge if destroyed

---

## 10. State & Persistence

### `GameState` additions

```js
// Persisted (save v6 — kodebasen var på v5, dette bumper til v6)
enemyStations: [
  {
    id: 'station_nebulox',
    type: 'lava' | 'ice' | 'industrial' | 'void' | 'generic',
    anchorPlanet: 'nebulox' | null,   // null for free-floating
    hp: number,
    maxHP: number,
    shieldHP: number,
    shieldMaxHP: number,
    phase: 'dormant' | 'alert' | 'skirmish' | 'war',
    lastSpawnTime: number,           // for 180s invasion cooldown (War phase)
    scoutIds: string[],              // active scout fleet IDs spawned by this station
    cleared: boolean,
  }
]

// Also persisted (save v6)
stationSieges: [
  {
    id: string,
    playerFleetId: string,
    enemyStationId: string,
    elapsed: number,
  }
]
// reconstructSieges() called on load, analogous to reconstructEngagements()
```

**Save v6 migration**: If incoming save has no `enemyStations`, initialize all 7 stations from `enemyStations.js` defaults (`phase: 'dormant'`, full HP, `cleared: false`). `stationSieges: []`.

```js
// Runtime only (not persisted)
wreckageFields: [
  {
    id: string,
    position: THREE.Vector3,
    nodes: [{ id, ore, crystal }],   // 3–5 nodes
    elapsed: number,                 // seconds of game-time elapsed (dt-accumulated)
    // lifetime = 600s (10 min). NOT a wall-clock timestamp — timer pauses when game pauses.
  }
]
```

**Scavenger hold**: Stored directly in the fleet's `playerFleets[]` entry as `hold: { ore: 0, crystal: 0 }`. Only populated when `fleet.ships[0]?.type === 'scavenger'`. Persists automatically with save. No separate `scavengerHolds[]` array.

---

## 11. Technical Implementation Roadmap

- [ ] **Phase 1 — Data & State**: `GameState` additions + save **v6** migration (`enemyStations[]`, `stationSieges[]`, runtime `wreckageFields[]` with `elapsed`); `galaxyLayout.js` free-floating base params + `patrolLanes`; `militaryShips.js` scavenger type (`combatBehavior: 'none'`, solo-fleet deploy, hold in playerFleets[]); `techTree.js` scavenger_vessels node (**military branch, requires `battleship`**); ny `src/game/data/enemyStations.js` med 7 stasjonsdefinitioner
- [ ] **Phase 2 — 3D Visuals**: `EnemyStation3D.js` (**fra scratch**, ~200 linjer, 5 varianter, fase-basert emissiv, HP-bar Mothership3D-mønster, shield dome); `EnemyStationManager3D.js`; integrer i `SolarSystem.js` (radius 50, LOD < 200 units) og `Galaxy.js` (orbital update loop + `getOwnedStationPositions()` + **legg til ny** `getPlayerStationClickTargets()` + behold/gi nytt navn `getStationClickTargets()` etter grep på alle kallere); `Minimap.js` røde diamanter; `SnitchPath3D.js`
- [ ] **Phase 3 — State Machine & Escalation**: `EnemyStationSystem.js` (Dormant→Alert→Skirmish→War, **separat stationInvasionCount pool maks 2**, **180s invasion cooldown** via `lastSpawnTime`); boot-rekkefølge: **etter CombatSystem, før RouteSystem** i `main.js`; awakening: **2 nærmeste dormant stasjoner** i world-distance ved 3. koloni; proximity check 50 units; `RoamingFleetSystem` station spawn source + `_tickSnitchBehavior()` (to modi: hyperlane/freespace, **30 units witness radius**, snitch avbrytes ved drap); distress flare (**maks 1 ledd**)
- [ ] **Phase 4 — Station Combat**: `FleetCombatSystem._tickStationCombat()` + `reconstructSieges()` + **scavenger ekskludert fra aggro-scan** (`fleet.ships[0]?.type === 'scavenger'`); `FleetMovementSystem` stasjon som stationary angrepswaypoint + `setGalaxy()` + Emergency Jump `_execEmergencyJump(fleet, targetPlanetId)`; `InputManager` **5px drag-threshold** for klikk vs box-select; `EnemyStationPanel.js`; stasjonsdestuksjon → wreckage spawn
- [ ] **Phase 5 — Scavenger & Wreckage**: `WreckageField3D.js` (debris nodes, resource pools, **dt-accumulated `elapsed` ≥ 600s cleanup**); scavenger tractor beam + hold (**hold lagret i playerFleets[], fullt hold = stopper innsamling**) + delivery flow; auto-resupply ved `Station3D` (**20/s — eksisterende `RESUPPLY_RATE`-konstant**); `RouteLane3D.setBlocked()`; `HUDBridge` + `CombatHUD` notifikasjoner
- [ ] **Phase 6 — Emergency Jump & Polish**: `PlayerFleetPanel` Emergency Jump-knapp + **dropdown-destinasjonsvelger** (sortert etter 3D-avstand) + 300s **fill-bar** (følger Titan-mønster); **full GLSL radial blur shader** i `RenderPipeline.js` (`WarpDistortionEffect`, uniform: uCenter/uStrength/uProgress); audio pass (hums, sirens, crash, warp pop); `HUD.css` nye stiler

---

## 12. Detaljert Implementasjonsplan

---

### Fase 1 — Data & State

#### Mål
Legge til alt data-fundament og persistens-infrastruktur som de påfølgende fasene avhenger av. Ingen gameplay-logikk, ingen 3D — kun data, typer og serialisering.

#### Filer som endres

- **`src/game/GameState.js`**
  - Bump `SAVE_VERSION = 5` → `6`
  - I `_initFresh()`: legg til `this.enemyStations = [];`, `this.stationSieges = [];`, `this.wreckageFields = [];` (`wreckageFields` er runtime-only — serialiseres **ikke**)
  - I `serialize()`: legg til `enemyStations: JSON.parse(JSON.stringify(this.enemyStations))` og `stationSieges: JSON.parse(JSON.stringify(this.stationSieges))`
  - I `deserialize()`: `this.enemyStations = data.enemyStations ?? null;` og `this.stationSieges = data.stationSieges ?? []`; reset `this.wreckageFields = []` alltid
  - **v5→v6 migrasjonsblokk** (etter eksisterende v4→v5-blokk): `if (!this.enemyStations?.length) { this.enemyStations = buildDefaultEnemyStations(); }` — importert fra `enemyStations.js`
  - Nye metoder: `damageEnemyStation(stationId, amount)` (shield-absorb først, emit `'enemyStationDamaged'`), `destroyEnemyStation(stationId)` (sett `cleared = true`, emit `'enemyStationDestroyed'`, push til `wreckageFields`), `startStationSiege(fleetId, stationId)`, `dispatchFleetToStation(fleetId, stationId)`

- **`src/game/data/galaxyLayout.js`**
  - Legg til ny export på bunnen: `export const FREE_FLOATING_BASES = [...]` med de 3 objektene fra Section 2 (`id`, `orbitRadius`, `orbitAngle`, `orbitSpeed`, `inclination`, `patrolLanes`)

- **`src/game/data/militaryShips.js`**
  - Legg til `scavenger`-oppføring etter `titan`: `combatBehavior: 'none'`, `tractorRange: 15`, `holdCapacity: { ore: 200, crystal: 100 }`, `tech: 'scavenger_vessels'`, kost `{ ore: 400, energy: 600 }`
  - `SHIP_TYPES` genereres automatisk — ingen endring nødvendig

- **`src/game/data/techTree.js`** (militærbranchen, etter `battleship_chassis`-noden, tier 3)
  - Legg til: `{ id: 'scavenger_vessels', name: 'SCAVENGER VESSELS', icon: '♻', desc: 'Deploy scavenger ships to collect wreckage from destroyed enemy stations.', cost: 6000, requires: ['battleship_chassis'], tier: 3, branch: 'military' }`

#### Nye filer

- **`src/game/data/enemyStations.js`**
  - `ENEMY_STATION_DEFS` — array med 7 stasjonsdefinisjonsobjekter: `id`, `type` (`'lava'|'ice'|'industrial'|'void'|'generic'`), `anchorPlanet` (planetnavn eller `null`), `maxHP`, `shieldMaxHP`, `orbitRadius` (50 for planet-anchored)
  - `buildDefaultEnemyStations()` — returnerer 7 runtime-stasjonsobjekter fra definisjonene: full HP, `phase: 'dormant'`, `lastSpawnTime: 0`, `scoutIds: []`, `cleared: false`

#### Integrasjonspunkter
Ingen avhengigheter utover eksisterende imports. `buildDefaultEnemyStations()` importeres kun av `GameState.js`.

#### Verifisering
1. Nytt spill → DevTools: `gameState.enemyStations` har 7 objekter med `phase: 'dormant'`
2. Lagre + reload → `saveVersion: 6` i localStorage, `enemyStations` serialisert
3. Last inn v5-lagret spill → migrasjonsblokk fyller inn 7 stasjoner automatisk
4. `SHIP_TYPES` inkluderer `'scavenger'`
5. `TECH_BY_ID['scavenger_vessels']` eksisterer og krever `battleship_chassis`

---

### Fase 2 — 3D Visuals

#### Mål
Synlige fiendtlige stasjoner i 3D-scenen — inkludert HP-bar, shield-dome, LOD-integrasjon, minimap-diamonds og snitch-stisvisualisering. Ingen gameplay-logikk; stasjonene er statisk Dormant-fase.

#### Filer som endres

- **`src/game/world/SolarSystem.js`**
  - Konstruktør (etter `_restoreMilitaryBase()`): legg til `this.enemyStation = null;`; registrer lyttere: `'enemyStationSpawned'` → `_spawnEnemyStation()`, `'stateLoaded'` → `_restoreEnemyStation()`, `'enemyStationDestroyed'` → `_removeEnemyStation()`
  - `_spawnEnemyStation()` — sjekker om planet-ID matcher en `anchorPlanet` i `gameState.enemyStations`; oppretter `new EnemyStation3D(def)`, legger til i `orbitGroup` ved radius 50 (utenfor asteroid-beltet på 25–40)
  - `_removeEnemyStation()` — fjern fra `orbitGroup`, kall `dispose()`
  - I `updateLOD()`: legg til `if (this.enemyStation && distance < 200) this.enemyStation.update(time, dt, camera);` — følger mønsteret for `militaryBase.update()`
  - Legg til getter: `get enemyStationClickTarget() { return this.enemyStation?.hitboxMesh ?? null; }`

- **`src/game/world/Galaxy.js`**
  - I `update()`: legg til `this.enemyStationManager?.update(dt, time);`
  - Ny metode `getEnemyStationClickTargets()` — henter fra `EnemyStationManager3D` (free-floating) + itererer `this.systems` for `sys.enemyStationClickTarget` (planet-anchored)
  - Ny metode `getOwnedStationPositions()` — returnerer `gameState.ownedPlanets.map(id => ({ planetId: id, worldPos: this.getPlanetWorldPosition(id) }))` — brukes av Emergency Jump (Fase 6)

- **`src/game/ui/Minimap.js`**
  - I `update()` (etter planet-tegning): iterer `gameState.enemyStations`; konverter planet/orbital-posisjon til canvas-koordinater via `CENTER + worldX / 0.05 * s`; tegn rød diamant (`ctx.save()`, `ctx.rotate(Math.PI/4)`, `ctx.fillRect(mx-4, my-4, 8, 8)`, `ctx.restore()`) og pulserende ring (`strokeStyle: 'rgba(255,50,50,0.6)'`, radius: `6 + Math.sin(time * 4) * 2`); grå/dim for `cleared`-stasjoner
  - Legg til `setGalaxy(galaxy)` for å hente planet-posisjoner

#### Nye filer

- **`src/game/objects/EnemyStation3D.js`** (~220 linjer)
  - Konstruktør tar `stationDef` med `type`-felt
  - Geometri: sentral `CylinderGeometry` (hull), `TorusGeometry` ringdetaljer, type-spesifikk fargepalett (lava: rød/oransje, ice: blå/hvit, void: lilla, industrial: grå/rav, generic: mørk metall)
  - HP-bar: **identisk mønster** som `Mothership3D._createHPBar()` (linje 309–333): `_hpBg` + `_hpFg` PlaneGeometry-par med `depthTest: false`; `setHP(current, max)` skalerer og forskyver `_hpFg.scale.x` + `_hpFg.position.x`; fargeterskler `> 0.5` rød → `> 0.25` oransje → gul
  - Shield dome: `SphereGeometry(5.0, 24, 16)`, `wireframe: true`, `AdditiveBlending`, `opacity: 0`; `setShield(hp, max)` justerer opacity `0.08 + frac * 0.12`
  - Fase-emissiv: `setPhase(phase)` justerer `emissiveIntensity` + farge (dormant: blå, alert: gul, skirmish: oransje, war: pulserende rød 2s-syklus)
  - `faceCamera(camera)` — kopierer camera-kvaternion til HP-bar-meshes per frame
  - `update(time, dt, camera)`, `dispose()`
  - Invisible `hitboxMesh`: `SphereGeometry(3, 8, 8)`, `MeshBasicMaterial({ visible: false })`, `userData.type = 'enemyStation'`, `userData.stationId`

- **`src/game/world/EnemyStationManager3D.js`** (~150 linjer)
  - Håndterer de 3 free-floating stasjonene (planet-anchored håndteres av `SolarSystem`)
  - Pool av 3 `EnemyStation3D`-instanser; `_activeStations: Map<stationId, EnemyStation3D>`
  - Lytter til `'stateLoaded'` + `'enemyStationDestroyed'`
  - `update(dt, time)`: oppdaterer orbital posisjon for free-floating via `FREE_FLOATING_BASES[i].orbitRadius/Speed/Angle`
  - `getClickTargets()` → `[{ mesh: station3D.hitboxMesh, stationId }]`
  - Instansieres i `Game.js`, settes som `galaxy.enemyStationManager`

- **`src/game/world/SnitchPath3D.js`** (~80 linjer)
  - `LineSegments` (2 punkter) fra snitching scout til målstasjon
  - `LineBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.7, depthWrite: false })`
  - `update(fromPos, toPos)` — oppdaterer position-attributtet + `needsUpdate = true`
  - Opprettes/fjernes av `EnemyStationSystem` (Fase 3) ved `isSnitching`-endringer

#### Integrasjonspunkter
- `SolarSystem` henter stasjonsdefinisjon fra `gameState.enemyStations` (hydrated i Fase 1)
- `EnemyStationManager3D` instansieres i `Game.js` etter `Galaxy`, settes som `galaxy.enemyStationManager`
- `Galaxy.getEnemyStationClickTargets()` registreres i `Game.js` tilsvarende eksisterende `getStationClickTargets()` (linje 198 i `Game.js`)

#### Verifisering
1. Start spill → 4 planet-anchored stasjoner synlige i orbit (radius ~50); 3 free-floating i galaxy-view
2. HP-bar rendres over stasjonene, shield-dome synlig
3. Minimap: 7 røde diamanter med pulserende ring
4. Klikk på stasjon-hitbox → logg i DevTools (click-handler treffer, panel ikke implementert ennå)
5. Ingen console-feil, ingen Three.js warnings om manglende dispose

---

### Fase 3 — State Machine & Eskalering

#### Mål
Implementere den fullstendige 4-fase state-maskinen, awakening-triggers, snitch-mekanikk og distress-flare. Dette er kjernelogikken som driver all fiendtlig aktivitet fra stasjonene.

#### Filer som endres

- **`src/game/systems/RoamingFleetSystem.js`**
  - I fleet-opprettelse: legg til `isSnitching: false`, `snitchTarget: null`, `snitchMode: 'hyperlane' | 'freespace'` på fleet-objektet
  - Ny privat metode `_tickSnitchBehavior(dt)` — kalt som 5. subtick i `_tick()`
  - Inne i `_tickSnitchBehavior`: for hvert ikke-snitchende scout-fleet, sjekk om en player-fleet er innen 30 enheter (matcher `ENGAGE_RADIUS` fra `fleetCombatStats.js`) → sett `isSnitching = true`, beregn `snitchTarget` (nærmeste stasjon) og `snitchMode`
  - Flytt snitchende scouts mot mål (speed: 0.03 vs spillerflåtens ~0.05+ — reell catch-window); hyperlane-modus navigerer langs lane-grafen, freespace-modus bruker direkte retningsvektor
  - På ankomst: `gameState.emit('stationAlerted', { stationId: fleet.snitchTarget })`; clear snitch-state
  - Eksponér `spawnStationScout(stationId, lane)` som public metode (wrapper rundt intern `_spawnScout()`)

- **`src/game/Game.js`**
  - Import og instansier `EnemyStationSystem` **etter** `CombatSystem` og **før** `RouteSystem` (boot-rekkefølge fra Section 10)
  - Registrer click-targets: `for (const t of galaxy.getEnemyStationClickTargets()) { ... }`
  - Lytt til `'stationAwakened'`, `'stationAlerted'` → `HUDBridge`-toast med kamera-navigasjon
  - Lytt til `'enemyStationDestroyed'` → `combatEffects.explosion(pos, 4.0, 0xff4400)` + kamera-shake

#### Nye filer

- **`src/game/systems/EnemyStationSystem.js`** (~250 linjer)
  - Konstruktør tar `animationLoop`, `roamingFleetSystem`, `galaxy`
  - `animationLoop.onUpdate(dt => this._tick(dt))`
  - `_tick(dt)` kaller:
    1. `_tickAwakeningChecks()` — `ownedPlanets.length === 3`: våkne 2 nærmeste dormant-stasjoner by world-distance til nykolonisert planet; proximity 50 enheter mellom player-flåter og dormant-stasjoner
    2. `_tickPhaseTransitions()` — sjekk betingelser per stasjon (scout snitcher → Alert, direkte skade → War, etc.)
    3. `_tickScoutSpawning(dt)` — Alert/Skirmish/War: kall `roamingFleetSystem.spawnStationScout()`, begrens av `MAX_ROAMING_FLEETS = 4`
    4. `_tickInvasionSpawning(dt)` — War: sjekk `stationInvasionCount < 2` OG `dt.now() - station.lastSpawnTime > 180000`; trigger invasjon via eksisterende `ThreatSystem`-mekanikk
    5. `_tickDistressFlare()` — ved HP < 15% og `!station.distressFlareFired`: sett `distressFlareFired = true`, emit `'distressFlare'`; snitche-scout mot nærmeste nabostasjon; **maks 1 ledd** (stasjon alertet via distress flare sender ikke sin egen)
  - `reconstructStations()` — re-emit `'enemyStationRestored'` for alle stasjoner (kalles fra boot etter load, tilsvarende `reconstructEngagements()`)
  - Events emittet: `'stationAwakened'`, `'stationAlerted'`, `'stationPhaseChanged'`, `'distressFlare'`

#### Integrasjonspunkter
- Proximity-sjekk bruker `galaxy.getPlanetWorldPosition()` for planet-anchored; beregnet orbital-posisjon for free-floating
- `SnitchPath3D`-objekter opprettes/fjernes ved `isSnitching`-endring; kan håndteres i `RoamingFleetManager3D.update()` eller lytter i `Game.js`

#### Verifisering
1. DevTools: `gameState.ownedPlanets` manuelt til 3 planeter → 2 nærmeste dormant-stasjoner bytter til `phase: 'alert'`
2. Flytt player-fleet innen 50 enheter av dormant stasjon → den våkner
3. Alert-stasjon spawner scout-flåter i `RoamingFleetSystem`
4. Drep snitchende scout midt i reisen → `stationAlerted` emitttes **ikke**
5. Reduser stasjon HP til < 15% → distress flare visuell + snitch-scout spawner mot nabostation, men chain-reaksjon er max 1 ledd

---

### Fase 4 — Station Combat

#### Mål
La player-flåter angripe og ødelegge fiendtlige stasjoner — siege-engasjement, type-spesifikke debuffs, wreckage-spawn ved destruction, og UI-panel for valgt stasjon.

#### Filer som endres

- **`src/game/systems/FleetCombatSystem.js`**
  - I `_tick(dt)`: legg til `this._tickStationCombat(dt)` som 4. subtick
  - `_tickStationCombat(dt)`: iterer `gameState.stationSieges`; appliser player DPS mot stasjonens shield → HP; appliser stasjonens DPS mot nærmeste player-skip; type-debuffs: lava (ignorer 20% av shield-absorb), ice (sett `fleet.speedDebuff = 0.6`), void (reduser supply-regen); fjern siege ved fleet-destruksjon eller `cleared`
  - I `_tickAggroScan()`: tidlig `continue` for fleet der `fleet.ships[0]?.type === 'scavenger'` — ekskluder fra aggro-scan
  - Ny metode `reconstructSieges()` — re-emit `'stationSiegeRestored'` for alle `gameState.stationSieges`; kalles fra `main.js` etter load tilsvarende `reconstructEngagements()` (linje 423)

- **`src/game/systems/FleetMovementSystem.js`**
  - Legg til `setGalaxy(galaxy)` — lagrer `this._galaxy = galaxy`
  - Legg til `_execEmergencyJump(fleet, targetPlanetId)`: `worldPos = this._galaxy.getOwnedStationPositions().find(s => s.planetId === targetPlanetId)?.worldPos`; sett `fleet.position = { x: worldPos.x, y: 0, z: worldPos.z }`; reset `fleet.state = 'orbiting'`; emit `'emergencyJumpExecuted'`
  - I `_moveFleet()`: multipliser `fleet.speed` med `fleet.speedDebuff ?? 1.0` for ice-stasjonens debuff

- **`src/game/Game.js`**
  - Etter `FleetMovementSystem`-instansiering: kall `fleetMovementSystem.setGalaxy(galaxy)`
  - Right-click på enemy station hitbox med selected fleets → `gameState.dispatchFleetToStation(fleetId, stationId)` → sett waypoint til stasjonsposisjon og `fleet.attackTarget`
  - Lytt til `'stationSiegeStarted'` → `EnemyStationPanel.show(stationId)`

#### Nye filer

- **`src/game/ui/EnemyStationPanel.js`** (~180 linjer)
  - Kopierer strukturen fra `PlayerFleetPanel.js` (inline HTML, `_render()`, `show(stationId)`, `hide()`, `update(dt)`)
  - Innhold: HP-bar + shield-bar, fase-indikator (DORMANT/ALERT/SKIRMISH/WAR) med fargekoding, stasjonstype + type-spesifikk debuff-beskrivelse, "CLEARED"-badge ved `cleared: true`
  - Lytter til `'enemyStationDamaged'` → `_updateBarsOnly()` (ingen full re-render for performance)
  - Posisjonering: venstre side (høyreklikk-panel; `PlanetPanel` er høyre side)

#### Integrasjonspunkter
- `FleetCombatSystem._tickStationCombat()` trenger stasjonsposisjon: injiser via konstruktør som `getEnemyStationWorldPosFn` (tilsvarende eksisterende `getEnemyWorldPosFn`-mønster)
- `CombatEffects.laser()` brukes for stasjonens angrep: `combatEffects.laser(stationWorldPos, targetShipPos, 0x8800ff)` for void-type etc.

#### Verifisering
1. Fleet innen 20 enheter av stasjon → siege startes, HP-bar synker i `EnemyStationPanel`
2. Lava-stasjon ignorerer 20% av shield-absorpsjon (verifiser med logging)
3. Scavenger-fleet trigges ikke inn i aggro — sjekk `fleet.ships[0].type === 'scavenger'` skip
4. Ødelegg stasjon fullstendig → `cleared: true` i `gameState`, wreckage-data pushet til `wreckageFields`
5. `EnemyStationPanel` HP og shield-barer synkroniserer korrekt med GameState

---

### Fase 5 — Scavenger & Wreckage

#### Mål
Wreckage-visualisering, scavenger-skipets tractor beam + hold-mekanikk, delivery-flow, auto-resupply ved friendly stasjoner, og visuell blokkering av ruter.

#### Filer som endres

- **`src/game/systems/FleetCombatSystem.js`**
  - Legg til `_tickScavengerBeams(dt)` — 5. subtick: for scavenger-fleet i `'orbiting'`-state, sjekk `wreckageFields` innen `tractorRange` (15 enheter); trekk ressurser fra noder, fyll `fleet.hold`; stopp når holdet er fullt (`fleet.hold.ore >= holdCapacity.ore && fleet.hold.crystal >= holdCapacity.crystal`); emit `'scavengerCollecting'`

- **`src/game/systems/SupplySystem.js`**
  - Legg til auto-resupply for fleet som orbiter ved friendly `Station3D` eller military base: rate 20/s for ore og energy fra planetens silo; bruk eksisterende `RESUPPLY_RATE`-konstant; emit `'fleetResupplied'`

- **`src/game/world/RouteLane3D.js`**
  - Legg til metode `setBlocked(bool)`:
    - `true`: `this._lineMat.color.setHex(0xff3300)`, opacity → 0.25; `this._particleMat.uniforms.uColor.value.set(0.8, 0.1, 0.05)`
    - `false`: tilbakestill til original farge og opacity
  - I `update()`: respekter `_blocked`-flag ved opacity-beregning (override normal aktiv/inaktiv logikk)
  - `Galaxy.update()` kaller `lane.setBlocked(roamingFleetSystem.isLaneBlocked(...))` for hver rute

- **`src/game/ui/HUDBridge.js`** / **`src/game/ui/CombatHUD.js`**
  - `CombatHUD`: legg til "THREAT DETECTED"-banner ved entry i sektor med ikke-dormant stasjon; "WAR ZONE" ved War-fase
  - `HUDBridge`: toast for `'stationAwakened'` (klikk-navigasjon til stasjon), `'enemyStationDestroyed'`, `'snitchDetected'` ("⚠ SCOUT FLEEING")

#### Nye filer

- **`src/game/world/WreckageField3D.js`** (~180 linjer)
  - Konstruktør tar `wreckageField`-objekt fra `gameState.wreckageFields`
  - 3–5 `Mesh`-noder: `BoxGeometry` + `SphereGeometry` (lave poly, tilfeldig rotert), mørk hull-farge, lavt oransje/rødt `emissive`
  - `tractorBeam(fromPos, toNodePos)` — kaller `combatEffects.laser(from, to, 0xffaa00)` for amber tractor-beam (gjenbruk pooled laser, kall per frame for persistent-utseende)
  - Floating resource-tekst: `THREE.Sprite` med `CanvasTexture` som drifter oppover og fades ut (tilsvarende `ClickFeedback.js`-mønsteret)
  - `update(dt)` — akkumulerer `elapsed += dt`; fjern og `dispose()` ved `elapsed >= 600` sekunder
  - Opprettes av `EnemyStationManager3D` på `'enemyStationDestroyed'`-event

#### Integrasjonspunkter
- `wreckageFields` er runtime-only: ikke serialisert; wreckage re-spawner ikke etter page-load (dokumentert design-beslutning)
- Scavenger hold-delivery: right-click på owned planet med scavenger selected → `gameState.dispatchFleetToStation()` med `deliverHold: true`; på ankomst depositer `fleet.hold` til planetens silo; `fleet.hold = { ore: 0, crystal: 0 }`

#### Verifisering
1. Ødelegg stasjon → wreckage-noder spawner visuelt
2. Scavenger innen 15 enheter → tractor beams vises, `fleet.hold.ore` øker
3. Full hold → innsamling stopper automatisk
4. High-click owned planet med scavenger → scavenger flyr dit, silo fylles opp
5. Wreckage forsvinner etter 600 sekunder (akselerér med `dt`-multiplikator i DevTools)
6. Blokkert lane → `RouteLane3D` rød-tint

---

### Fase 6 — Emergency Jump & Polish

#### Mål
Emergency Jump-knapp med GLSL warp-shader, audio-pass for alle nye hendelser, og CSS-polish. Avslutter featuren til spillbar standard.

#### Filer som endres

- **`src/game/ui/PlayerFleetPanel.js`**
  - I `_render()` (etter `titanHTML`, ca. linje 124): legg til `emergencyJumpHTML` — identisk mønster med `pfp-jump-btn`, `pfp-jump-fill`, `pfp-jump-label` IDs; 300s cooldown (`EMERGENCY_JUMP_COOLDOWN` fra `militaryStats.js`); knapp er disabled hvis `fleet.supply.energy.amount < fleet.supply.energy.max * 0.4`
  - Knappen åpner inline dropdown-liste ved klikk: `galaxy.getOwnedStationPositions()` sortert etter 3D-avstand fra fleet; vis planetnavn + avstand; klikk → `this._onJump(fleetId, planetId)`
  - `_updateJumpButton()` — analog til `_updateTitanButton()` (linje 206–237); fill-bar + label per frame; re-bind click ved ready-state overgang via `dataset.bound`-flag
  - I `update()`: legg til `this._updateJumpButton()`

- **`src/game/engine/RenderPipeline.js`**
  - Ny metode `addWarpDistortionEffect(WarpDistortionShader)` — **identisk mønster** som `addGodRayPass()` (linje 61–86): dispose passes → rebuild composer → insert `ShaderPass(WarpDistortionShader)` etter bloom, før colorGrade
  - Ny metode `triggerWarpDistortion(screenUV)`: sett `uCenter` uniform, start `_warpProgress = 0`, sett `uEnabled = 1`
  - I `tick(time)`: inkrementer `_warpProgress`; sett `uStrength = Math.max(0, 1 - _warpProgress / 0.4)` og `uProgress`; nullstill `uEnabled` ved fullført

- **`src/game/audio/AudioManager.js`**
  - Legg til synth-lyder: `'WARP_POP'` (kort toneburst, 80ms), `'STATION_HUM'` (loopet lavfrekvent drone), `'STATION_ALARM'` (skarpt signal ved Alert-fase), `'STATION_CRASH'` (metallisk boom ved destruction)

- **`src/ui/HUD.css`**
  - Nye stiler: `.pfp-jump-btn`, `.pfp-jump-btn--cooldown`, `#pfp-jump-fill`, `#pfp-jump-label` — kopiér klassestruktur fra Titan-knapp-stilene
  - `EnemyStationPanel`-containerstil (venstre side, bredde 340px, glassmorphism)
  - `.station-phase-badge` med fargekoding per fase

#### Nye filer

- **`src/game/shaders/effects/WarpDistortionShader.js`** (~80 linjer)
  - Modellert etter `GodRayShader.js`: eksporter objekt med `name`, `uniforms`, `vertexShader`, `fragmentShader`
  - Uniforms: `tDiffuse`, `uCenter: Vector2(0.5, 0.5)`, `uStrength: float(0)`, `uProgress: float(0)`, `uEnabled: float(0)`
  - Fragment shader: radial blur — sample `tDiffuse` langs N=12 retninger fra `uCenter` med offset skalert av `uStrength * exp(-dist² * 8.0) * (1 - uProgress)`; tidlig return ved `uEnabled < 0.01` (følger GodRayShader-mønsteret, linje 38–41)
  - Håndter `logarithmicDepthBuffer` (legg til `#ifdef USE_LOGDEPTHBUF`-guard tilsvarende `RouteLane3D`-particle-shaderen)

#### Integrasjonspunkter
- `FleetMovementSystem._execEmergencyJump()` (Fase 4) emitterer `'emergencyJumpExecuted'` → trigger warp-visual i `Game.js`
- `EMERGENCY_JUMP_COOLDOWN = 300` og `EMERGENCY_JUMP_ENERGY_COST_PCT = 0.4` legges til `militaryStats.js`
- Energikostnad-validering i `gameState.dispatchEmergencyJump()` (ny metode) — blokkerer jump om `fleet.supply.energy.amount < energyMax * 0.4`

#### Verifisering
1. Fleet supply > 40% → Emergency Jump-knapp aktiv; klikk → dropdown med planeter sortert etter avstand
2. Velg destinasjon → fleet teleporterer øyeblikkelig, WarpDistortionShader aktiveres 0.4s
3. 300s fill-bar teller ned identisk med Titan-mønsteret
4. Fleet supply < 40% → knapp disabled (grå)
5. `AudioManager.playSynth('WARP_POP')` kalles én gang per jump
6. Alle 7 stasjoner cleared → `gameState.enemyStations.every(s => s.cleared) === true` → ingen nye stasjons-triggede invasjoner

---

### Sekvensierte avhengigheter

| Fase | Krever |
|------|--------|
| 2 | Fase 1 (`gameState.enemyStations` eksisterer) |
| 3 | Fase 2 (`EnemyStation3D.setPhase()` for visuelle overganger) |
| 4 | Fase 1 + 2 (serialiserte `stationSieges` + `hitboxMesh` for click) |
| 5 | Fase 4 (`enemyStationDestroyed`-event + wreckage-data) |
| 6 | Fase 4 (`_execEmergencyJump()` i `FleetMovementSystem`) |
