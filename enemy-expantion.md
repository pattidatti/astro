# Enemy Expansion: Galactic Strongholds (Technical Design Document)

## 1. Vision & Core Loop
This expansion transitions the game from a "wave-base" defense game to a "persistent-territory" RTS/Idle hybrid. The priority is scouting, intercepting, and dismantling fixed enemy installations to "clean" the galaxy.

## 2. Enemy Space Stations (The Strongholds)
Majestic, stationary defense platforms. They are **visible on the galaxy map from the start** but remain in a dormant state until triggered.
- **Station Archetypes & Logic:**
  | Type | Visuals | Gameplay Mechanics |
  | :--- | :--- | :--- |
  | **Lava** | Magma core | High DPS (beams ignore 20% shield), Low HP. Found near inner suns. |
  | **Ice** | Frozen glass | High Shields, Frost Beams (reduces player fleet speed by 40%). |
  | **Terran** | Industrial | Balanced armor/DPS, standard kinetic weaponry. |
  | **Void** | Dark Aura | Found in deep space. High HP, energy-drain pulses (drains ammo/fuel). |

- **Scaling by Distance:** Ships produced by stations further away from the starting planet (Xerion) are significantly stronger and use more advanced ship models (Tiers 1-5).
- **Strategic Impact (Hyperlane Interception):** 
  - **Blocker Fleets:** Stations spawn unique "Interdiction Fleets" that position themselves at 50% distance along a Hyperlane.
  - **The First Loss:** A trade route remains "Active" until the first cargo ship is destroyed by a Blocker Fleet.
  - **Interception Trigger:** Upon loss, the player receives a **clickable Toast notification** ("Route Intercepted!"). Clicking the toast centers the camera on the fleet and highlights the lane.
  - **Visual Change:** The Hyperlane changes from its standard color to a **Pulsing Red** state (emissive glow cycle 2s).
  - **Logistics Lockdown:** `RouteSystem` adds the lane ID to `gameState.blockedLanes`. No more ships can be dispatched on this route until the Blocker Fleet is destroyed.

## 3. The "Awakening" & Escalation Mechanics
Hostility is local and triggered by player growth.
- **The Trigger:** Colonizing the **3rd planet** triggers the first attack. Alternatively, players can trigger awakening by damaging a station directly or moving a fleet within 50 units.
- **Station Phases (State Machine):**
  1. **Dormant:** Static visuals. No ship production. (Enemy can return to this if player loses their 3rd planet and retreats).
  2. **Alert:** Triggered by proximity, expansion, or a Scout "Snitch". Spawns **1-2 Scouts** to monitor activity. Emissive lights turn from blue to yellow.
  3. **Skirmish:** Triggered if a Scout reports a "threat". Spawns **Raiders** to attack mining robots/routes. Starts spawning Blocker Fleets.
  4. **War:** Spawns **Motherships** and heavy invasion fleets. Emissive lights turn pulsing red.

## 4. Reinforcements & "The Snitch"
- **The Scout Rule:** If a battle is detected by an enemy Scout, its priority is to **flee and report** to the nearest neighboring station node using the Hyperlane graph.
- **Visual Feedback (The Red Path):** When a Scout starts its "Snitch" run, a **solid Red Line (LineSegments)** is rendered between the Scout and its destination.
- **Speed Tuning:** Scouts fly at 0.03 speed (vs player interceptor 0.05), ensuring a narrow window to "Hunt the Scout".
- **Chain Reaction:** Successful delivery of intelligence triggers **Alert phase** in the neighbor instantly.
- **Distress Flare:** At `<15% HP`, a station emits a massive **visual 3D particle flare** (pulsating red pillar, 200 units high).

## 5. Combat & Logistics (Admiral Mode)
- **Admiral Mode Requirement:** Fleet combat (targeting and movement) is handled exclusively in the isometric Admiral Mode. 
- **Emergency Jump (New Ability):**
  - **Cost:** 40% of the fleet's Max Energy. (Blocked if energy < 40%).
  - **Cooldown:** 300 seconds (Visualized as a pie-chart overlay on the fleet command icon).
  - **Effect:** Instant teleportation to the **nearest friendly space station/base**. Includes a "Warp Distortion" shader effect and a distinct audio "Pop".
- **Supply Integration:** Player fleets use existing `energy` (fuel) and `ore` (ammo). Resupply occurs automatically when orbiting friendly Military Bases.

## 6. The Aftermath: Wreckage & Scavenging
- **Wreckage Fields:** Destruction leaves a groups of 3-5 persistent debris nodes. Each node has a random resource pool (Ore/Crystal). Wreckage has a 10-minute lifetime.
- **Carrier Scavenging:** Carriers have a "Tractor Beam" capability (range 15). When stationary near wreckage, they pull resources into the global silo. Visualized as an amber beam.
- **Security:** Clearing a sector permanently removes the "Interception" risk for that node. Enemies **cannot** rebuild destroyed stations.

## 7. Audio & UI Feedback
- **Sound:** Deep, industrial hums (low-pass filter based on camera distance); sharp sirens during "Alert"; massive metallic crash upon destruction.
- **UI Interaction:** 
  - **Threat Level:** A HUD notification reads "THREAT DETECTED" or "WAR ZONE" when entering a sector with non-dormant stations.
  - **Minimap:** Enemy stations appear as pulsing red diamonds.

## 8. Technical Implementation Roadmap
- [ ] **Phase 1:** `EnemyStation3D.js` visual variants and `galaxyLayout.js` placement.
- [ ] **Phase 2:** `GameState.js` persistence (HP, Phase) and the Awakening state machine.
- [ ] **Phase 3:** Hyperlane Interception (Blocker Fleets) and `RouteSystem` lockdown logic.
- [ ] **Phase 4:** Scout pathfinding (A* on hyperlane graph) and "Red Path" visual.
- [ ] **Phase 5:** Emergency Jump (Admiral Mode UI + Warp Effect) and Carrier Scavenging (Tractor Beam).
- [ ] **Phase 6:** Wreckage field spawning and cleanup routines.
