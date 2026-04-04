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
    id: 'station_drakon',
    type: 'lava' | 'ice' | 'industrial' | 'void' | 'generic',
    anchorPlanet: 'drakon' | null,   // null for free-floating
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
