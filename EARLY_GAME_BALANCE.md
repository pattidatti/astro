# Early Game Balance — Designplan

## Kontekst

Early game har for mye dead time, særlig ventetiden for å låse opp Miner Bot (~5 min med ingenting å gjøre). Spilleren opplever ikke den mestrings- og fremgangsfølelsen spillet sikter mot.

**Kjernemål:** Tech-unlocks skal gi tydelige kvantehopp — hver unlock skal føles som et gjennombrudd.

---

## Endring 1 — Miner Tech Cost: 150 → 50

**Fil:** `src/game/data/techTree.js`

Finn `miner_bot`-noden og endre `cost: 150` til `cost: 50`.

**Effekt på timing:**

| Scenario | Ventetid FØR | Ventetid ETTER |
|----------|-------------|----------------|
| 1 energy bot (35e igjen) | ~287 sek (~5 min dead time) | ~37 sek ✓ |
| 2 energy bots (18e igjen) | ~165 sek | ~0 sek (nesten umiddelbart) ✓ |

---

## Endring 2 — Robot Upgrades → Tech Tree (Global)

### Design-beslutninger

| Beslutning | Valg |
|-----------|------|
| Scope | **Global** — én unlock gjelder alle planeter |
| Nivåer | **2 per type** (ned fra 5), kan utvides til 3 etter play-test |
| Kostnad | Samme priser som dagens per-planet-kostnader (idx 0 og idx 2 av eksisterende arrays) |
| Plassering i tech tree | Spredt naturlig — primært robots-grenen |
| UPG-fanen | **Fjernes** fra høyre panel |
| Robots-fanen | Beholder hiring + viser passiv upgrade-status (read-only) |
| Base-upgrades (ship speed, docking, passive energy) | Forblir per-planet i venstre panel — **uberørt** |
| Silo-kapasitetsoppgraderinger | Forblir per-planet i venstre panel — **uberørt** |

### Nye tech-noder

Kostnader hentet fra `ROBOT_UPGRADES` i `upgrades.js`: 2-level mapping bruker `idx[0]` (level 1) og `idx[2]` (level 3) fra de eksisterende cost-arrayene.

**Eksempel for miner:** `speedCost: [200, 500, 1500, 5000, 15000]` → Level I: 200, Level II: 1500

| Node ID | Navn | Cost (energy) | Gren | Krever |
|---------|------|--------------|------|--------|
| `mining_speed_1` | Mining Speed I | 200 | robots | `miner_bot` |
| `mining_speed_2` | Mining Speed II | 1500 | robots | `mining_speed_1` |
| `mining_load_1` | Mining Yield I | 200 | robots | `miner_bot` |
| `mining_load_2` | Mining Yield II | 1500 | robots | `mining_load_1` |
| `energy_speed_1` | Energy Harvest I | 200 | robots | `energy_bot` |
| `energy_speed_2` | Energy Harvest II | 1500 | robots | `energy_speed_1` |
| `energy_load_1` | Energy Yield I | 200 | robots | `energy_bot` |
| `energy_load_2` | Energy Yield II | 1500 | robots | `energy_load_1` |
| `builder_speed_1` | Build Speed I | 200 | robots | `builder_bot` |
| `builder_speed_2` | Build Speed II | 1500 | robots | `builder_speed_1` |
| `scout_speed_1` | Scout Range I | 150 | robots | `scout_bot` |
| `scout_speed_2` | Scout Range II | 1000 | robots | `scout_speed_1` |

*(load_builder og load_scout kan vurderes etter play-test)*

### GameState — Propagering

`speedLevel` og `loadLevel` er i dag **per-planet** (`ps.robots.<type>.speedLevel`).

**Valgt tilnærming (Alternativ A — minimal risiko):**
- Behold feltene per-planet
- Når en global tech unlockes, sett `speedLevel`/`loadLevel` automatisk på **alle owned planets**
- Ingen save-format-endring, ingen migration nødvendig

### UI — Robots-fanen etter endring

Robots-fanen i høyre panel (`PlanetPanel.js`):
- Hire-knapper for alle robottyper: **uendret**
- Ny passiv statusseksjon per robottype:

```
MINER BOT  [2 ansatt]
  Speed: Lv 2 (Global) ●   Yield: Lv 1 (Global) ●
```

- Klikk på status → ingen handling (read-only). "T" for tech tree.

### UPG-fanen

Fjernes fra høyre panel i `PlanetPanel.js`. Høyre panel har deretter **2 faner: Robots | Defense**.

---

## Berørte filer

| Fil | Endring |
|-----|---------|
| `src/game/data/techTree.js` | `miner_bot` cost 150→50 + legg til 12 nye upgrade-noder |
| `src/game/data/upgrades.js` | `ROBOT_UPGRADES` beholdes for kostnadsreferanse (ikke lenger brukt av UPG-panel) |
| `src/game/GameState.js` | Propagering av global levels til alle owned planets ved tech-unlock |
| `src/game/ui/PlanetPanel.js` | Fjern UPG-fane; legg til upgrade-status i Robots-fane |
| `src/game/ui/TechTreeWindow.js` | Render nye noder (bruker eksisterende render-logikk) |
| `src/game/systems/ProductionSystem.js` | Verifiser — trolig ingen endring nødvendig |

---

## Verifisering

1. `npm run dev` → nytt spill
2. Åpne tech tree (T) etter 1 energy bot → bekreft `miner_bot` viser kost **50**
3. Vent ~37 sek → unlock → bekreft tutorial går videre uten stall
4. Naviger til robots-grenen i tech tree → bekreft nye upgrade-noder vises
5. Unlock `mining_speed_1` → bekreft `speedLevel` oppdateres på Xerion
6. Koloniser Drakon → bekreft miners på Drakon automatisk har Speed Lv 1
7. Bekreft UPG-fanen er borte fra høyre panel
8. Bekreft Robots-fanen viser upgrade-status korrekt
