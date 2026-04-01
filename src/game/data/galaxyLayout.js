/**
 * Galaxy map layout — system positions and hyperlane connections.
 * Coordinates in a 4000×4000 world space.
 * Spiral pattern: Xerion at center, progression outward.
 */

export const SYSTEM_POSITIONS = {
  xerion:   { x: 2000, y: 2000 },
  drakon:   { x: 2280, y: 1780 },
  crystara: { x: 1580, y: 1640 },
  voltara:  { x: 1380, y: 2180 },
  glacius:  { x: 1700, y: 2620 },
  nebulox:  { x: 2400, y: 2720 },
  solaris:  { x: 2900, y: 2200 },
  voidex:   { x: 2800, y: 1400 },
};

export const HYPERLANES = [
  ['xerion', 'drakon'],
  ['xerion', 'crystara'],
  ['drakon', 'crystara'],
  ['crystara', 'voltara'],
  ['voltara', 'glacius'],
  ['glacius', 'nebulox'],
  ['nebulox', 'solaris'],
  ['solaris', 'voidex'],
  ['drakon', 'voltara'],
  ['nebulox', 'voidex'],
];

export const GALAXY_SIZE = 4000;
