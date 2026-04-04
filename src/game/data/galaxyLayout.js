/**
 * Solar system layout — one sun, 8 planets in orbit.
 * All planets orbit the central star at (0,0,0).
 */

/** All planets share the same system center (the sun). */
export const SYSTEM_POSITIONS = {
  xerion:   { x: 2000, y: 2000 },
  drakon:   { x: 2000, y: 2000 },
  crystara: { x: 2000, y: 2000 },
  voltara:  { x: 2000, y: 2000 },
  glacius:  { x: 2000, y: 2000 },
  nebulox:  { x: 2000, y: 2000 },
  solaris:  { x: 2000, y: 2000 },
  voidex:   { x: 2000, y: 2000 },
};

/** Hyperlane connections between planet systems (used for ship routes + visuals). */
export const HYPERLANES = [
  ['xerion',   'drakon'],
  ['drakon',   'crystara'],
  ['crystara', 'voltara'],
  ['voltara',  'glacius'],
  ['glacius',  'nebulox'],
  ['nebulox',  'solaris'],
  ['solaris',  'voidex'],
  ['xerion',   'crystara'],  // hub spoke
  ['xerion',   'voltara'],   // hub spoke
];

export const GALAXY_SIZE = 4000;

/** The central star of our solar system. */
export const CENTRAL_STAR = {
  color: '#ffdd44',
  size: 12,
};

export const FREE_FLOATING_BASES = [
  { id: 'outpost_alpha', orbitRadius: 550,  orbitAngle: Math.PI * 0.3, orbitSpeed: 0.003, inclination: 0.05,
    patrolLanes: [['crystara', 'glacius']] },
  { id: 'outpost_beta',  orbitRadius: 950,  orbitAngle: Math.PI * 1.1, orbitSpeed: 0.002, inclination: 0.07,
    patrolLanes: [['drakon', 'voidex']] },
  { id: 'outpost_gamma', orbitRadius: 1250, orbitAngle: Math.PI * 1.7, orbitSpeed: 0.001, inclination: 0.04,
    patrolLanes: [['xerion', 'drakon']] },
];
