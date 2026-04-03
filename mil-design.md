# Designplan for Militær Ekspansjon

## 1. Kamera og Navigasjonsmodus (RTS-modus)
- **Aktivering**: Hurtigtast `V`.
- **Kamera**: Isometrisk (eller overordnet) fugleperspektiv. 
  - Standard zoom-nivå settes automatisk når man trykker V første gang.
  - Spilleren kan scrolle for å zoome fritt ut/inn for å navigere galaksen.
  - *Forslag til designvalg:* Kameraets zoom-nivå huskes i løpet av spilløkten når man bytter ut og inn av V-modus, men nullstilles til et standard overblikk ved innlasting av save.
- **Interaksjon**:
  - Verden anses som et 2D-plan (Y=0) for navigasjon av romskip.
  - Venstreklikk + dra: Boks-seleksjon (Frustum culling) for å velge flere enheter.
  - Venstreklikk på enkelt-enhet for å velge.
  - Høyreklikk: Bevegelsesordre eller angrepsordre.
- **Bevegelse, Formasjon & Pathfinding**:
  - Enheter flyr i **fritt rom** (de er ikke tvunget til å følge Hyperlanes slik cargo-skip er), men de navigerer naturlig *rundt* objekter som planeter og stjerner.
  - Ved forflytning stipuleres en synlig markør/linje i Y=0-planet som viser banen og destinasjonen deres.
  - Ved ankomst til et mål, eller ved forflytting, holder enhetene seg i en **formasjon** (boids/flocking-algoritme). Flåten tvinges til å fly med samme hastighet som det *tregeste skipet* i gruppen.
- **Flåte-Visualisering i UI**:
  - For å kunne holdes øye med fra høyt zoom-nivå, markeres vennlige flåter med **gule hitbokser** (ligner de røde for roaming fleets). Boksene øker litt i størrelse når man scroller ut.
  - Når man zoomer nært nok, fjernes de gule boksene og erstattes med den normale hover-effekten for skipene for bedre innlevelse.

## 2. Militær Romstasjon (Military Base)
- **Konstruksjon**: Bygges fra en planet du eier. Den skytes ut og etablerer seg i en ytre bane ("outer orbit", lengre ut enn den vanlige stasjonen). 
- **Verdensbegrensning**: Maks 1 militærbase per planet. Behandles i systemet som en **mini-planet**, komplett med frittstående ressurs-siloer og sitt eget UI-panel (PlanetPanel-variant).
- **Logistikk (Space Elevator)**: For å ikke rote til det inter-planetariske rutesystemet (`RouteSystem`), er logistikken mellom planeten og dens egen militærbase håndtert via en *passiv "Space Elevator"*. Når stasjonen bygges etableres heisen (f.eks. en visuell tether), og overskudds-ore og energi pumpes automatisk i en jevn strøm opp til basens egne siloer, helt avkoblet fra vanlige cargo-skip routes.
- **Produksjon**: Basen fungerer som flåtens skipsverft og har egne paneler for produksjonskø. Nybygde skip vil i utgangspunktet bare samles og gå i orbit rundt basen ("Rally Point").
- **Automatisk Forflytning (Rally Routes)**: Spilleren kan konfigurere en militær "rute" fra basen. Skip som produseres kan dermed sendes automatisk videre til en annen eid planet eller militærbase. Slik kan man trygt bygge bak i egne linjer og automatisk samle frontlinjeflåten der fienden slår til.
- **Oppgraderinger**: 
  - *Base*: Kan oppgraderes for ekstra funksjoner/strukturell styrke.
  - *Hangars*: Definerer stasjonens "Fleet Cap". Du må bygge og oppgradere hangarer for å øke maksgrensen på hvor stor flåte du kan ha.
- **Forsvar & Prioritet**: Invasjonsflåter utenfra vil oppdage og angripe militærbasen *først*. Den fungerer dermed som spydspissen for forsvaret av planeten. Man kan bygge forsvarsverk på stasjonen ved å gjenbruke det eksisterende defense-systemet. *Merk:* Planetens vanlige forsvar (som kanoner nær planeten) vil stå passivt og se på mens den ytre militærbasen blir angrepet, frem til basen eventuelt faller.

## 3. Militære Enheter (The Fleet)
- **Økonomi**: Koster ressurser akkurat når de produseres. Det er *ingen* passiv upkeep, men **Aktivitet** koster:
  - **Logistikk & Ammunisjon ("Supply Line")**: Skip bruker ressurser (`Energi` og `Ore`) når de *flyr* (fuel) og når de *skyter/slåss* (ammo).
  - **Mobil Resupply**: Carrier-skipene fungerer som fyllepunkter ("tankfly") for flåten i felt.
  - **Planetær Resupply**: Når en flåte legger seg i orbit rundt en alliert planet, fylles de automatisk opp over tid (dette beslaglegger produksjonen/siloen til den aktuelle planeten). 
  - **Krystaller (Crystal Cores)**: Krystaller, som er sjeldnere, vil ikke bli brukt som drivstoff/upkeep, men vil heller være nødvendig luksus. De benyttes for å kunne bygge de aller tyngste skipene (Titan/Carrier), og som fast valuta for eksklusive, globale flåte-oppgraderinger i Tech Tree. Dette bevarer verdien deres late-game.
- **Kapasitet (Fleet Cap)**: Hvert skip krever en viss andel kapasitet (Supply). Spilleren må holde seg innenfor sin Fleet Cap, noe som holder oppdateringshastigheten i Three.js optimalisert, og gir et taktisk lag for komposisjon (sverm vs få store skip).
- **Attributter**: Avanserte enheter, individuell HP-bar, og engasjerer mål i sonen rundt dem. Eksakt kamplogikk (skyte i fart, våpenarcs) spikres i neste iterering.

### Enhetstyper og Rollefordeling
- **Fighter (Lav Fleet Cap Cost)**: Rask, lav HP, høy DPS. Skyter laser på kort hold. Ideell for "hit and run" eller som kanonføde.
- **Bomber (Moderat Fleet Cap Cost)**: Langsom. Lav HP, men massiv burst-DPS. Skyter missiler på lang avstand mot store mål.
- **Carrier (Høyt Fleet Cap Cost)**: Langsom, høy HP, lav aggresjons-DPS. Et svært viktig støtteskip ("Support") som healer og reparerer flåten din kontinuerlig i felt via visuelle grønne/helende **lasere**.
- **Battleship (Høyt Fleet Cap Cost)**: Langsom, høy HP, og pumper ut jevn/middels DPS i form av tungt artilleri mot mange mål av gangen. Den stødige veggen i flåten.
- **Titan (Maksimal Fleet Cap Cost)**: En brutal koloss av et skip, men tregest i flåten. For å skille den fra Battleship har den unike egenskaper: F.eks. et "Ultimate"-angrep, som en massiv Area-of-Effect (AoE) som velsigner fiendens sverm til aske. 

## 4. Tech Tree: Flåte (Military Branch)
For å integrere ekspansjonen organisk i spillets eksisterende progresjon, får Tech Tree vinduet en egen dedikert fane/gren for militæret.

### Tiers & Node-progresjon
- **Tier 1: Orbital Shipyards (Foundation)**
  - *Låser opp*: Bygging av Militærbase (Mini-planet) i ytre bane.
  - *Kostnad*: Moderat Energi / Ore.

- **Tier 2: Light Strike Craft & Logistics**
  - **Node 2A: Fighter Chassis** $\rightarrow$ Låser opp Fighter-skip.
  - **Node 2B: Supply Lines** $\rightarrow$ Låser opp muligheten for flåter på tokt til å dra innom og tanke (resupply) i orbit rundt egne planeter.

- **Tier 3: Heavy Ordnance & Mobile Support**
  - **Node 3A: Bomber Chassis** $\rightarrow$ Låser opp Bomber-skip. *(Krever Fighter Chassis)*.
  - **Node 3B: Fleet Formations** $\rightarrow$ Øker din base "Fleet Cap" per Hangar bygd, slik at du kan ha større flåter.
  - **Node 3C: Carrier Vessels** $\rightarrow$ Låser opp Carrier. *(Krever Supply Lines)*.

- **Tier 4: Capital Ships & Ultimate Warfare**
  - **Node 4A: Battleship Chassis** $\rightarrow$ Låser opp den massive Battleship. *(Krever Bomber Chassis)*.
  - **Node 4B: Crystal Cores** $\rightarrow$ Åpner for bruk av Krystaller i militær sammenheng, og låser opp muligheten til å bygge en flaggskip-Titan.

- **Tier 5: Crystal Tech (De ultimate Krystall-oppgraderingene)**
  - **Node 5A: Pure Crystal Lasers** $\rightarrow$ Gir permanent +20% Ammo kapasitet og +15% DPS for *alle* skip på tvers av galaksen. *(Kostnad: Massiv mengde Krystall)*.
  - **Node 5B: Quantum Fuel** $\rightarrow$ Gir permanent +50% Fuel kapasitet, noe som lar Titaner krysse store deler av kartet uten Carrier/Planet-resupply. *(Kostnad: Massiv mengde Krystall)*.

---
*Fremtidig iterasjon: Dybde-balansering av fraksjons-AI og spesifikk ammunisjons-økonomi per våpentype.*

## 5. Implementeringsplan (Faseinndelt: Arkitektur-fokusert)

Dette er den oppdaterte, skuddsikre planen designet for å takle de faktiske begrensningene i den eksisterende Vanilla JS / Three.js arkitekturen. Vi frikobler militærmekanikken fra `RouteSystem` og `CombatSystem` der det er nødvendig, og vi *må* starte med ytelsesforbedring før vi bygger funksjoner.

### Fase 0: Ytelse og Instanced Rendering
*Mål: Legge det grafiske fundamentet for massive sverm-kamper (opptil flere hundre skip).*
- [ ] **THREE.InstancedMesh for Skip**: Gjennomgå `EnemyShip3D.js` og `Ship3D.js` og skriv om tegneloggikken. I stedet for massive trær med `THREE.Group` per skip, sentraliseres all skips-rendering inn i store `InstancedMesh`-managere som oppdaterer en `InstancedBufferAttribute` matrise per tick.
- [ ] **LOD og Draw Calls**: Oppnå en reduksjon fra flere tusen potensielle draw calls til noen få instanced calls. UI (HP-bars) for skip byttes til å rendres via shaders eller HTML overlay (`HUDBridge.js`) istedenfor unike 3D Planes, for å spare geometri.
- [ ] **Verifikasjon**: Generer 200 Interceptor-modeller via dev-konsollen. Sjekk at spillet flyter på silkemyke 60 FPS og at rendering-metrikkene (Draw Calls) holder seg lave.

### Fase 1: Datastruktur og Tech Tree
*Mål: Klargjør GameState uten å påvirke gameloopen.*
- [ ] **GameState.js**: Utvid state for militærbase: `ps.militaryBase = { built: false, hangars: 0, fleetCap: 0, silo: { ore, energy }, queue: [] }`. Legg til globale arrays `gameState.playerFleets`.
- [ ] **Save Migrering (v4)**: Pass på at eldre localstorage- og firestore-saves ikke tryner på null-verdier.
- [ ] **Tech Tree**: Integrer Node 1–5 i `techTree.js`.
- [ ] **Verifikasjon**: Laste spill, sjekke save/load loop, åpne Tech Tree-grensesnittet (`T`) og verifisere at nye the-nodes kan klikkes og kodes opp over tid.

### Fase 2: Militærbase og Space Elevator (Logistikk)
*Mål: Basebygging forankret i riktig logistikkstruktur, uavhengig av RouteSystem.*
- [ ] **MilitaryBase3D.js**: Opprett stasjonen i "outer orbit" (f.eks radius 25).
- [ ] **Space Elevator (Logistikk)**: Implementer et internt sub-system i `ProductionSystem.js` eller på planet-tick. Istedenfor å hacke `RouteSystem.js`, pumper militærbasen en fast rate med ressurs (f.eks `min(baseKapasitet, planetOverskudd * 0.1)`) ut av planetens silo via en "Space Elevator", rett opp i basens egen silo per frametick.
- [ ] **Visuell Tether**: Tegn en laser/tråd (`THREE.Line` / Cylinder) fra overflaten av planeten til militærbasen.
- [ ] **MilitaryPanel.js**: UI for konstruksjon av Hangar og bygging.
- [ ] **Verifikasjon**: Bygg basen via UI, se 3D-basen pluss space-tether oppstå. Observer at basens egne siloer sakte fylles opp fra planetens silo. Vanlige trade-routes skal ikke røre basen.

### Fase 3: RTS Kamera og Kommando-Interaksjon
*Mål: Fritt admiral-perspektiv og markering.*
- [ ] **CameraController.js**: Lag `isRTSMode`. Bind `V` for pan/tilt til overordnet fugleperspektiv.
- [ ] **InputManager.js**: Implementer mus-drag for Frustum Culling boks. Gjør at kun `PlayerFleet` maskene plukkes opp av denne. Høyreklikk på Y=0 planet skal kaste en raycaster ned fra kameraet for å finne "Waypoint" vektor.
- [ ] **UI Markør**: Plasser et kryss på y=0 der man høyreklikker.
- [ ] **Verifikasjon**: Test isometrisk view, boks-markeringer som plukker egne modeller (en dummy-kube om nødvendig), og Waypoint-logging i consolen.

### Fase 4: Produksjon og Formasjon (Boids)
*Mål: Skipsbygging i militærbasen og troppeforflytning.*
- [ ] **Produksjonskø**: La systemet svelge materialer fra Military Base Silo og spytte skip inn i orbit (Rally Point).
- [ ] **FleetMovementSystem.js**: Nytt dedikert bevegelsessystem. Flåter beveger seg samlet utenom lines (som RouteSystem). `Cohesion, Alignment, Separation` algoritme (Boids) begrenset av fartstakene per fartøy. 
- [ ] **Styre unna sentrum**: Kraftig "pushing"-vektor ut fra The Sun/stjerner slik at flåtene ikke svister tvers igjennom sola under RTS-forflytning.
- [ ] **Verifikasjon**: Marker flåten, trykk på kartet. Se formasjonen samle seg, senke farten til tregeste skip og fly dit (og ta en bue rundt midten om nødvendig). Sti bør være synlig med stipla linje.

### Fase 5: Frakoblet kampsystem (FleetCombatSystem.js)
*Mål: Skille "Romkamp" fra "Stasjonskamp".*
- [ ] **FleetCombatSystem.js**: Det nåværende `CombatSystem.js` opererer sterkt mot `ps.combat.stationHP` og `focusedPlanet`. Opprett et parallelt eller nytt lag (`FleetCombatSystem` for all combat i åpent rom) som kalkulerer Vector3 vs Vector3 distanser (Aggro Range).
- [ ]Når fiendens Roaming Fleets eller Invasions nærmer seg forsvarende skip, byttes state for begge fra `Waypointing` til `Evasive/Engaged`.
- [ ] **Weapon Arcs & DPS**: Ulike skip opptrer ulikt: Fighter sirkler i kort radius (2-4 units), Bombers står i ro langt unna og fyrer "missiler" inn i mobben.
- [ ] **Targeting AI (Threat)**: Modifiser `ThreatSystem` slik at invasjonsflåter alltid forsøker å passere/utslette Militærbasen først om den finnes, før de ignorerer rommet og borer seg ned for å beskyte den vanlige stasjonen.
- [ ] **Verifikasjon**: Avskjær en fiendtlig flåte midt i absolutt ingenting (langt fra en planet) med dine egne jagerfly og observer kamputfallet og eksplosjonene styrt av det nye AI-kamp-systemet.

### Fase 6: Logistikk i felt og Ultimate Polish
*Mål: Ammunisjonsøkonomi, balansering opp mot Carrier, Tier 5 nodes.*
- [ ] **SupplySystem.js / Carrier Aura**: Skrot den gamle Fuel/Ammo logikken i det eksisterende systemene; innfør "Energy / Ore bars" på flåtene. I farta brennes litt energi; i kamp brennes kraftig ore. Fleet som blir tom stanser opp / skyter saktere.
- [ ] **Carrier og Orbit Restore**: Å ligge idle nær en egen militærbase/planet restorer supply. Har du en Carrier med, distribuerer den supply ut til svermen og healer via en grønn `CombatEffects.js` beam.
- [ ] **Titan AoE Ultimate**: Kast ultimate mot en markør fra RTS-modus. En massiv shader-eksplosjon utsletter low-tier skip.
- [ ] **Lydeffekter**: Integrer tunge, basstunge eksplosjoner og svevende thruster-lyder for moderskip og Carrier.
- [ ] **Siste Verifikasjon**: Stresstest av flåter i dyp-rom, forsyninger, balansering av kostnader i ny konfigfil (`militaryStats.js`) og at alt oppleves stramt, premium og responsivt.