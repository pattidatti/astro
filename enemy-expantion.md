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

- **Scaling by Distance:** Ships produced by stations further away from the starting planet (Xerion) are significantly stronger and use more advanced ship models.
- **Strategic Impact:** Stations placed at "Deep Space Nodes" or orbiting planets with Hyperlane connections will **block trade routes** and intercept cargo ships unless destroyed.
- **AI Intelligence:** If a station is under attack, it prioritizes producing **Interceptors** for defense. If left alone, it focuses on **Raiders/Scouts** for expansion.

## 3. The "Awakening" & Escalation Mechanics
Hostility is local and triggered by player growth.
- **The Trigger:** Colonizing the **3rd planet** triggers the first attack, specifically targeting that new colony.
- **Station Phases (State Machine):**
  1. **Dormant:** (Default) Static visuals. No ship production.
  2. **Alert:** Triggered by proximity or expansion. Spawns **Scouts** to monitor player activity.
  3. **Skirmish:** Triggered if a Scout reports a "threat". Spawns **Raiders** to attack mining robots/routes.
  4. **War:** Spawns **Motherships** and heavy invasion fleets to siege player stations.

## 4. Reinforcements & Distress Signals
- **The Scout Rule (Core Gameplay):** If a battle is detected by an enemy Scout, its priority is to **flee and report**. 
- **Scout Snitching:** Players see a visual "radio wave" effect from the Scout when it detects a player. If the Scout reaches a neighbor, that neighbor wakes up instantly.
- **Hunt the Scout:** Players should prioritize destroying Scouts to prevent a "Chain Reaction" of bases waking up across the galaxy.
- **Distress Flare:** At `<15% HP`, a station emits a massive **visual 3D particle flare** (pulsating red pillar). This signals ALL neighboring stations to escalate to **War phase** instantly.

## 5. Combat & Logistics (Admiral Mode)
- **Admiral Mode Requirement:** Fleet combat (targeting and movement) is handled exclusively in the isometric Admiral Mode. 
- **Manual Command:** Box-select and right-click to attack.
- **Supply Integration:** Player fleets use existing `energy` (fuel) and `ore` (ammo). Attacks on distant strongholds require Military Base resupply logic.
- **Automated Planet Defense:** Existing planetary defenses (Cannons, Satellites) fire **automatically** to protect stations, providing a defensive fallback.

## 6. The Aftermath: Wreckage & Rewards
- **Wreckage Fields:** Destruction leaves a persistent debris field with multiple mining nodes.
- **Scavenging:** Debris can be harvested by `Miner` or `Builder` robots for a massive one-time injection of Ore and Crystal.
- **Security:** Clearing a sector permanently removes the "Interception" risk for any Trade Routes passing through those Hyperlanes.

## 7. Audio & UI Feedback
- **Sound:** Deep, industrial hums for base existence; sharp sirens during "Alert"; massive metallic грохот (crash) upon destruction.
- **UI:** A "Threat Level" indicator on the HUD when zoomed into sectors with active enemy stations.
- **Minimap:** Enemy stations appear as pulsing red diamonds when in Alert/War phase.

## 8. Technical Implementation Roadmap
- [ ] **Phase 1:** `EnemyStation3D.js` visual variants and placement.
- [ ] **Phase 2:** Persistence in `GameState.js` and "Awakening" phase tracking.
- [ ] **Phase 3:** Scout "Radio Wave" effects and reinforcement chain-logic.
- [ ] **Phase 4:** Wreckage field harvesting and UI threat-level indicators.
