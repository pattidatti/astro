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
