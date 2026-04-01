export const PLANETS = [
  { id: 'xerion',   name: 'XERION',   col: '#1a6fff', glow: '#4499ff', type: 'terr',  cost: 0,       desc: 'Home world. Rich in ore.',       mb: 0    },
  { id: 'drakon',   name: 'DRAKON',   col: '#cc3300', glow: '#ff6633', type: 'lava',  cost: 500,     desc: 'Volcanic. High-temp deposits.',   mb: 0.4  },
  { id: 'crystara', name: 'CRYSTARA', col: '#aa44ff', glow: '#cc88ff', type: 'cryst', cost: 2500,    desc: 'Crystal-rich atmosphere.',        mb: 0.8  },
  { id: 'voltara',  name: 'VOLTARA',  col: '#ffcc00', glow: '#ffee66', type: 'gas',   cost: 12000,   desc: 'Gas giant. Limitless energy.',    mb: 1.5  },
  { id: 'glacius',  name: 'GLACIUS',  col: '#88ddff', glow: '#aaeeff', type: 'ice',   cost: 60000,   desc: 'Frozen. Dense crystal matrix.',   mb: 2.5  },
  { id: 'nebulox',  name: 'NEBULOX',  col: '#ff44aa', glow: '#ff88cc', type: 'neb',   cost: 300000,  desc: 'Nebula core. Exotic matter.',     mb: 5    },
  { id: 'solaris',  name: 'SOLARIS',  col: '#ff8800', glow: '#ffaa33', type: 'star',  cost: 1500000, desc: 'Star fragment. Pure energy.',     mb: 12   },
  { id: 'voidex',   name: 'VOIDEX',   col: '#880088', glow: '#bb44bb', type: 'void',  cost: 8000000, desc: 'Void matter. Dimensional ore.',   mb: 30   },
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
