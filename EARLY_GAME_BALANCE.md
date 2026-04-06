# Early Game Balance — Designplan

Sist oppdatert: 2026-04-06 (idéutviklingssessjon)

## Kontekst

Early game har to "dead zones" som bryter flyten:

1. **Før første miner (~5 min):** Med 1 energy bot (0.4/s) og 35 energi igjen etter hire, tar det ~287 sek å spare 150 energi til miner_bot research.
2. **Før scout (lang grind):** Scout Bot research koster 1500 energi — mye venting før man kan unlocke nye depositter.

**Kjernemål:** Rask spenning — ting skjer, ingen lange passive pauser. Produksjonsrater og startressurser beholdes uendret.

---

## Endring 1 — Tech Tree kostnader

**Fil:** `src/game/data/techTree.js`

| Node ID | Gammel kostnad | Ny kostnad | Effekt |
|---------|---------------|-----------|--------|
| `miner_bot` | 150 | **50** | Første miner tilgjengelig ~37 sek fra start |
| `scout_bot` | 1500 | **500** | Scout nåes naturlig med noen bots i drift |
| `mining_efficiency` | 1500 | **600** | Tidlig mining-boost mer tilgjengelig |

**Effekt på timing (miner_bot):**

| Scenario | Ventetid FØR | Ventetid ETTER |
|----------|-------------|----------------|
| 1 energy bot (35e igjen) | ~287 sek (~5 min dead time) | ~37 sek ✓ |
| 2 energy bots (18e igjen) | ~165 sek | ~0 sek (nesten umiddelbart) ✓ |

---

## Endring 2 — Robot Upgrades → Globale Tech Tree-noder

**Fil:** `src/game/data/techTree.js`

### Design-beslutninger

| Beslutning | Valg |
|-----------|------|
| Scope | **Global** — én unlock gjelder alle planeter |
| Nivåer | **3 per type** (ned fra 5 lokale) |
| Kostnad | Level 1 / 3 / 5 fra eksisterende per-planet cost-arrays |
| Bonus per nivå | +20% speed / +30% load (uendret fra i dag) |
| Maks bonus | +60% speed / +90% load ved Level III |
| Plassering | `robots`-branchen, kjede under sin robot-node |
| UPG-fanen | **Fjernes** fra høyre panel |
| Robots-fanen | Hire-knapper + read-only upgrade-status (se UI-seksjonen) |
| Save-tilnærming | **Alternativ A** — ingen save-format-endring. Unlock propagerer til alle owned planets. |
| Base-upgrades | Forblir per-planet — **uberørt** |
| Silo-kapasitet | Forblir per-planet — **uberørt** |

### Nye tech-noder (18 stk)

Kostnader hentet fra `ROBOT_UPGRADES` i `upgrades.js` — mapper idx[0], idx[2], idx[4] (level 1/3/5).

```
miner_bot
  ├── mining_speed_1 (200) → mining_speed_2 (3000) → mining_speed_3 (40000)
  └── mining_load_1  (300) → mining_load_2  (4000) → mining_load_3  (60000)

energy_bot
  ├── energy_speed_1 (250) → energy_speed_2 (3500) → energy_speed_3 (45000)
  └── energy_load_1  (350) → energy_load_2  (4500) → energy_load_3  (65000)

builder_bot
  └── builder_speed_1 (300) → builder_speed_2 (4000) → builder_speed_3 (55000)

scout_bot
  └── scout_speed_1 (350) → scout_speed_2 (4500) → scout_speed_3 (60000)
```

*(builder_load og scout_load utelates — prioriterer meningsfulle nodes)*

**Node-struktur (eksempel — miner speed):**
```js
{ id: 'mining_speed_1', name: 'MINING SPEED I',   icon: '⚡', branch: 'robots', tier: 2,
  desc: 'Miner Bots move 20% faster.', cost: 200,   requires: ['miner_bot'],      free: false },
{ id: 'mining_speed_2', name: 'MINING SPEED II',  icon: '⚡', branch: 'robots', tier: 3,
  desc: 'Miner Bots move 20% faster.', cost: 3000,  requires: ['mining_speed_1'], free: false },
{ id: 'mining_speed_3', name: 'MINING SPEED III', icon: '⚡', branch: 'robots', tier: 4,
  desc: 'Miner Bots move 20% faster.', cost: 40000, requires: ['mining_speed_2'], free: false },
```

### GameState — Propagering (Alternativ A)

Ingen endring i save-format. `speedLevel` og `loadLevel` forblir per-planet i `ps.robots.<type>`.

Når en global tech-node unlockes via `GameState.unlockTech()`, propagerer GameState til alle owned planets:

```js
// Eksempel ved unlock av 'mining_speed_2':
for (const pid of gameState.ownedPlanets) {
  const level = countUnlockedLevels(gameState.unlockedTech, 'mining_speed');
  gameState.planets[pid].robots.miner.speedLevel = Math.max(
    gameState.planets[pid].robots.miner.speedLevel,
    level
  );
}
```

`Math.max` sikrer at eksisterende per-planet levels ikke regrederer ved load av gamle saves.

### UI — Robots-fanen etter endring

Robots-fanen i høyre panel (`PlanetPanel.js`):
- Hire-knapper for alle robottyper: **uendret**
- Ny passiv statusseksjon per robottype (viser globalt nådd level):

```
MINER BOT  [2 ansatt]
  Speed: Lv 2 (Global) ●   Yield: Lv 1 (Global) ●
```

- Klikk på status → ingen handling (read-only). Spilleren trykker T for tech tree.

### UPG-fanen

Fjernes fra høyre panel i `PlanetPanel.js`. Høyre panel har deretter **2 faner: Robots | Defense**.

---

## Endring 3 — Tutorial

**Fil:** `src/game/tutorial/Tutorial.js`

- "Se siloet fylles opp"-steg: terskel **50 → 20** ore (kortere passiv venting etter første miner)

---

## Berørte filer

| Fil | Endring |
|-----|---------|
| `src/game/data/techTree.js` | 3 kostnadsjusteringer + 18 nye upgrade-noder |
| `src/game/data/upgrades.js` | `ROBOT_UPGRADES` beholdes for kostnadsreferanse |
| `src/game/GameState.js` | `unlockTech()` propagerer globalt level til alle owned planets |
| `src/game/ui/PlanetPanel.js` | Fjern UPG-fane; legg til read-only upgrade-status i Robots-fane |
| `src/game/tutorial/Tutorial.js` | Ore-terskel 50 → 20 |

---

## Forventet effekt

| | Før | Etter |
|---|---|---|
| Første miner (ny spiller) | ~5 min | ~37 sekunder |
| Scout research | Lang grind | Naturlig mål med noen bots |
| Robot upgrades | Per-planet grind i panel | Globale tech tree-beslutninger |
| PlanetPanel | Tre faner inkl. UPG | To faner: Robots \| Defense |

---

## Verifisering

1. `npm run dev` → nytt spill
2. Åpne tech tree (T) → bekreft `miner_bot` viser kost **50**, `scout_bot` **500**, `mining_efficiency` **600**
3. Vent ~37 sek med 1 energy bot → unlock miner_bot → bekreft tutorial går videre uten stall
4. Tutorial "se siloet" passeres ~40 sek etter miner hired (terskel 20 ore)
5. Naviger til robots-grenen → bekreft 18 upgrade-noder i kjeder under robot-nodene
6. Unlock `mining_speed_1` → bekreft alle owned planets får speedLevel oppdatert
7. Koloniser Drakon → bekreft miners på Drakon automatisk har Speed Lv 1
8. Bekreft UPG-fanen er borte fra høyre panel
9. Bekreft Robots-fanen viser read-only upgrade-status
10. Last inn gammel save → bekreft eksisterende speedLevels ikke regrederer (Math.max)
