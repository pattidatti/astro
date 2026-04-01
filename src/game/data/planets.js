export const PLANETS = [
  { id: 'xerion',   name: 'XERION',   col: '#1a6fff', glow: '#4499ff', type: 'terr',  cost: 0,       desc: 'Home world. Rich in ore.',       mb: 0,
    nebulaPalette: { colors: ['#020810', '#0a1a33', '#102844', '#1a5577', '#2288aa'], density: 0.55, seed: 42 } },
  { id: 'drakon',   name: 'DRAKON',   col: '#cc3300', glow: '#ff6633', type: 'lava',  cost: 500,     desc: 'Volcanic. High-temp deposits.',   mb: 0.4,
    nebulaPalette: { colors: ['#0a0200', '#331000', '#662200', '#994422', '#cc7744'], density: 0.6,  seed: 137 } },
  { id: 'crystara', name: 'CRYSTARA', col: '#aa44ff', glow: '#cc88ff', type: 'cryst', cost: 2500,    desc: 'Crystal-rich atmosphere.',        mb: 0.8,
    nebulaPalette: { colors: ['#06000e', '#1a0033', '#3d1166', '#6633aa', '#9955dd'], density: 0.6,  seed: 271 } },
  { id: 'voltara',  name: 'VOLTARA',  col: '#ffcc00', glow: '#ffee66', type: 'gas',   cost: 12000,   desc: 'Gas giant. Limitless energy.',    mb: 1.5,
    nebulaPalette: { colors: ['#050300', '#1a0e00', '#33220a', '#664411', '#aa7733'], density: 0.55, seed: 389 } },
  { id: 'glacius',  name: 'GLACIUS',  col: '#88ddff', glow: '#aaeeff', type: 'ice',   cost: 60000,   desc: 'Frozen. Dense crystal matrix.',   mb: 2.5,
    nebulaPalette: { colors: ['#000508', '#051520', '#0a2a40', '#1a5570', '#338899'], density: 0.5,  seed: 503 } },
  { id: 'nebulox',  name: 'NEBULOX',  col: '#ff44aa', glow: '#ff88cc', type: 'neb',   cost: 300000,  desc: 'Nebula core. Exotic matter.',     mb: 5,
    nebulaPalette: { colors: ['#0a0006', '#2a0022', '#551144', '#882266', '#cc4499'], density: 0.7,  seed: 617 } },
  { id: 'solaris',  name: 'SOLARIS',  col: '#ff8800', glow: '#ffaa33', type: 'star',  cost: 1500000, desc: 'Star fragment. Pure energy.',     mb: 12,
    nebulaPalette: { colors: ['#080200', '#221000', '#552200', '#884400', '#cc6600'], density: 0.65, seed: 739 } },
  { id: 'voidex',   name: 'VOIDEX',   col: '#880088', glow: '#bb44bb', type: 'void',  cost: 8000000, desc: 'Void matter. Dimensional ore.',   mb: 30,
    nebulaPalette: { colors: ['#020008', '#0a0022', '#1a0044', '#2a0066', '#440088'], density: 0.6,  seed: 853 } },
];

export const PLANET_COLORS = {
  terr:  ['#88ddff', '#3388ee', '#1a55cc', '#0a2266'],
  lava:  ['#ffcc66', '#ff5522', '#cc2200', '#551100'],
  cryst: ['#ffbbff', '#dd66ff', '#9933cc', '#440066'],
  gas:   ['#ffff99', '#ffcc33', '#ee8800', '#553300'],
  ice:   ['#ffffff', '#cceeff', '#66bbee', '#113366'],
  neb:   ['#ffaadd', '#ff5599', '#cc2266', '#330022'],
  star:  ['#ffffee', '#ffee66', '#ffaa22', '#663300'],
  void:  ['#dd66ee', '#9933bb', '#553388', '#110022'],
};
