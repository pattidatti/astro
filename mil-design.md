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
- **Logistikk (Rent Manuell Mekanikk!)**: Militærbasen har *ikke* magisk tilgang til planetens ressurser. Spilleren må aktivt etablere forsyningsruter (via eksisterende RouteSystem) der standard Cargo-skip leverer Ore og Energi fra planeten opp til basen.
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
*Neste fase: Utarbeide teknisk logikk for kamp (Combat Logic) og hvordan aggro-rekkevidden skal fungere i henhold til ammunisjon og boids.*