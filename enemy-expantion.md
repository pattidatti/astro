# Enemy Expansion: Galactic Strongholds (Technical Design Document)

## 1. Vision & Core Loop

This expansion transitions the game from a "wave-based" defense game to a "persistent-territory" RTS/Idle hybrid. The primary gameplay loop is: **scout → provoke → destroy** enemy strongholds to permanently "clear" sectors of the galaxy.

There are **7 enemy stations** total:
- **4 planet-anchored stations** orbiting outside the per-planet asteroid belt (~50 units from planet center)
- **3 free-floating outposts** on independent elliptical orbits around the central sun

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
  { id: 'outpost_alpha', orbitRadius: 550,  orbitAngle: Math.PI * 0.3, orbitSpeed: 0.003, inclination: 0.05 },
  { id: 'outpost_beta',  orbitRadius: 950,  orbitAngle: Math.PI * 1.1, orbitSpeed: 0.002, inclination: 0.07 },
  { id: 'outpost_gamma', orbitRadius: 1250, orbitAngle: Math.PI * 1.7, orbitSpeed: 0.001, inclination: 0.04 },
]
```

---

## 3. The Awakening & Escalation Mechanics

Hostility is local and triggered by player expansion or aggression.

### Awakening Triggers (Dormant → Alert)
1. **Expansion**: Player colonizes their **3rd planet** → 1–2 nearest stations awaken.
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

### Distress Flare
At **< 15% HP**: a pulsating red particle pillar (200 units high, `MiningBurst`-style emitter) appears — **purely visual**. Simultaneously, a snitch scout is dispatched toward the nearest neighboring station, which triggers that station's Alert phase on arrival via the normal snitch mechanic.

---

## 4. The Snitch Mechanic

When a scout fleet **witnesses a battle** (a player fleet engages any entity within proximity of the scout):

- Scout sets `isSnitching: true`, `snitchTarget: nearestStationId`
- Scout flees along the hyperlane graph toward the target station
- **Speed**: 0.03 units/s (player interceptors move at 0.05 — a narrow but real catch window)
- **Red Path Visual**: a solid red `LineSegments` line renders from the scout's current position to its destination station (no particles — distinct from `RouteLane3D`)
- **On arrival**: destination station immediately advances to Alert phase; emits `stationAlerted` event
- **Chain reaction**: the newly alerted station spawns its own scouts, which can snitch further

**Implementation:**
- Extend `RoamingFleetSystem` with `_tickSnitchBehavior()`
- Add `isSnitching: bool`, `snitchTarget: string | null` to roaming fleet state
- New file: `src/game/world/SnitchPath3D.js` — `LineSegments` rendered per active snitching scout

---

## 5. Hyperlane Interception (Blocker Fleets)

Station-spawned scout fleets use the **existing `isLaneBlocked()` system** in `RoamingFleetSystem`. No new "Blocker Fleet" entity is needed.

- In **Skirmish** and **War** phases, stations spawn patrol scout fleets that roam hyperlanes
- While a scout fleet with alive enemies occupies a lane, `RouteSystem` skips cargo dispatch on that route
- **Visual state change**: The `RouteLane3D` for a blocked lane switches to a dim red/orange tint (opacity reduced, color shifted)
- **UI**: Clickable toast "⚠ ROUTE BLOCKED — [Lane Name]" that centers camera on the blocking fleet

---

## 6. Station Combat (Admiral Mode)

### Flow
1. Player enters Admiral Mode (V key) and **box-selects** ships
2. **Left-click** on enemy station mesh → `EnemyStationPanel` opens (HP/shield bars, phase, type, debuff info)
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
- Lifetime: **10 minutes**, then auto-cleaned from scene and `wreckageFields[]`
- Clearing a station permanently removes the interception/invasion risk from that station

### Scavenger Ship (New Unit)

Built on the **military base**, deployed manually in Admiral Mode.

```js
// militaryShips.js
{
  type: 'scavenger',
  hp: 150,
  dps: 1,
  tractorRange: 15,
  holdCapacity: { ore: 200, crystal: 100 },
  combatBehavior: 'flee',         // auto-retreats when under fire
  cost: { ore: 400, energy: 600 },
  requiredTech: 'scavenger_vessels',
}
```

**Collection flow:**
- Player sends scavenger to wreckage area in Admiral Mode
- When within `tractorRange` (15 units) and stationary: tractor beam activates
  - Visual: amber `LineSegments` from scavenger to each nearby wreckage node
  - Floating "+N ore/crystal" numbers drift upward
  - Resources fill the scavenger's hold; overflow distributed to nearby Carriers
- Player delivers by **right-clicking a target** (owned planet / Station3D / military base) with the scavenger selected
  - Ship flies to target and auto-docks
  - Visual: beam to silo + "+N ore/crystal" floating confirmation numbers
  - Resources deposited into target planet's silo

---

## 8. Combat & Logistics (Admiral Mode)

Admiral Mode (V key) is a **camera mode only** — isometric RTS view with box-select and right-click waypoints. All fleet commands (move, attack, deliver) are issued here.

### Emergency Jump (Fleet Ability)
- **Cost**: 40% of fleet's `supply.energy.max` — blocked if current energy < 40% max
- **Cooldown**: 300 seconds — visualized as a pie-chart overlay on the fleet icon in `PlayerFleetPanel`
- **Target**: auto-selects nearest owned `Station3D` or military base (shortest 3D distance)
- **Effect**: instant teleport + `WarpDistortionEffect` (0.4s radial blur shader) + audio "pop"
- **Button**: in `PlayerFleetPanel`, below the Titan button

### Auto-Resupply at Friendly Stations
When a player fleet orbits a friendly `Station3D` or military base:
- Automatically fills `supply.ore` (ammo) and `supply.energy` (fuel) from that planet's silo
- Rate: 30 units/sec per resource
- Visual: beam from station to fleet + "+N" floating numbers
- No player action required

---

## 9. Audio & UI Feedback

### Sound
- **Dormant stations**: deep industrial hum (low-pass filter scales with camera distance)
- **Alert phase**: sharp siren burst on phase transition
- **War phase**: continuous low rumble with occasional weapon charge sounds
- **Station destruction**: massive metallic crash + shockwave audio

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
// Persisted (save v4)
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
    lastSpawnTime: number,
    scoutIds: string[],              // active scout fleet IDs spawned by this station
    cleared: boolean,
  }
]

// Runtime only (not persisted)
wreckageFields: [
  {
    id: string,
    position: THREE.Vector3,
    nodes: [{ id, ore, crystal }],   // 3–5 nodes
    spawnTime: number,               // timestamp for 10-min cleanup
  }
]

scavengerHolds: [
  { shipId: string, ore: number, crystal: number }
]
```

---

## 11. Technical Implementation Roadmap

- [ ] **Phase 1 — Data & State**: `GameState` additions + save v4 migration; `galaxyLayout.js` free-floating base params; `militaryShips.js` scavenger type; `techTree.js` scavenger_vessels node
- [ ] **Phase 2 — 3D Visuals**: `EnemyStation3D.js` (4 typed + generic variants, phase-based emissive animation, HP bar); integrate into `SolarSystem.js` (radius 50) and `Galaxy.js` (orbital update loop); `Minimap.js` red diamonds
- [ ] **Phase 3 — State Machine & Escalation**: `EnemyStationSystem.js` (Dormant→Alert→Skirmish→War); awakening triggers in `ThreatSystem` and proximity check; `RoamingFleetSystem` station spawn source + `_tickSnitchBehavior()`; `SnitchPath3D.js` red line visual; distress flare particle effect
- [ ] **Phase 4 — Station Combat**: `FleetCombatSystem._tickStationCombat()` (bidirectional DPS, shield, phase-scaled retaliation, type debuffs); `FleetMovementSystem` station as stationary attack target; `InputManager` click handling; `EnemyStationPanel.js`; station destruction → wreckage spawn
- [ ] **Phase 5 — Scavenger & Wreckage**: `WreckageField.js` (debris nodes, resource pools, 10-min lifetime); scavenger tractor beam + hold + delivery flow; auto-resupply beam at friendly stations; `HUDBridge` + `CombatHUD` notifications
- [ ] **Phase 6 — Emergency Jump & Polish**: `PlayerFleetPanel` Emergency Jump button + 300s pie-chart; `WarpDistortionEffect` shader; audio pass (hums, sirens, crash, warp pop); `HUD.css` new styles
