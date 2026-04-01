export const UPGRADES = [
  { id: 'd1', icon: '\u{1F916}', name: 'DRONE MK.I',   desc: '+1 drone',           oreCost: 10,    crystalCost: 0,   effect: 'rob', amt: 1,   max: null },
  { id: 'd2', icon: '\u2699\uFE0F', name: 'DRILL MK.II',  desc: '+5 drones',          oreCost: 80,    crystalCost: 0,   effect: 'rob', amt: 5,   max: null },
  { id: 'd3', icon: '\u{1F9BE}', name: 'MECH DRILL',   desc: '+25 drones',         oreCost: 500,   crystalCost: 0,   effect: 'rob', amt: 25,  max: null },
  { id: 'c1', icon: '\u{1F44A}', name: 'POWER FIST',   desc: 'Click +1',           oreCost: 50,    crystalCost: 0,   effect: 'clk', amt: 1,   max: null },
  { id: 'c2', icon: '\u26A1',     name: 'HYPER FIST',   desc: 'Click +5',           oreCost: 400,   crystalCost: 0,   effect: 'clk', amt: 5,   max: null },
  { id: 'a1', icon: '\u{1F504}', name: 'AUTO-MINE',    desc: '+2 ore/s passive',   oreCost: 200,   crystalCost: 0,   effect: 'aut', amt: 2,   max: null },
  { id: 'e1', icon: '\u{1F4E1}', name: 'EFFICIENCY+',  desc: 'All rates \u00D71.5', oreCost: 1000,  crystalCost: 5,   effect: 'eff', amt: 0.5, max: null },
  { id: 'q1', icon: '\u{1F300}', name: 'QUANTUM CORE', desc: 'All rates \u00D72',   oreCost: 5000,  crystalCost: 20,  effect: 'eff', amt: 1,   max: null },
  { id: 'sw', icon: '\u{1F680}', name: 'DRONE SWARM',  desc: '+50 drones',         oreCost: 3000,  crystalCost: 10,  effect: 'rob', amt: 50,  max: null },
  { id: 'dk', icon: '\u{1F48E}', name: 'DARK ORE',     desc: 'Unlock crystals',    oreCost: 2000,  crystalCost: 0,   effect: 'cry', amt: 1,   max: 1   },
  { id: 'fu', icon: '\u{1F525}', name: 'FUSION CORE',  desc: 'Unlock energy',      oreCost: 8000,  crystalCost: 50,  effect: 'enr', amt: 1,   max: 1   },
  { id: 'mg', icon: '\u{1F3ED}', name: 'MEGA ARRAY',   desc: '+200 drones',        oreCost: 20000, crystalCost: 100, effect: 'rob', amt: 200, max: null },
];

export const COST_SCALE = 1.15;
