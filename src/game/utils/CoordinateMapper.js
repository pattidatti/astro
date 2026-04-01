import * as THREE from 'three';
import { SYSTEM_POSITIONS, GALAXY_SIZE } from '../data/galaxyLayout.js';

const HALF = GALAXY_SIZE / 2;
const SCALE = 0.05; // 4000 grid → ±100 units

/** Seeded pseudo-random for consistent Y offsets */
function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Convert a 2D galaxy layout position to a 3D world coordinate.
 * X/Z from the 2D grid, Y from a seeded random for galactic plane variation.
 */
export function galaxyToWorld(systemPos) {
  const x = (systemPos.x - HALF) * SCALE;
  const z = (systemPos.y - HALF) * SCALE;
  const y = (seededRandom(systemPos.x * 0.01 + systemPos.y * 0.01) - 0.5) * 12;
  return new THREE.Vector3(x, y, z);
}

/**
 * Get all system positions as 3D vectors, keyed by planet ID.
 */
export function getAllWorldPositions() {
  const positions = {};
  for (const id in SYSTEM_POSITIONS) {
    positions[id] = galaxyToWorld(SYSTEM_POSITIONS[id]);
  }
  return positions;
}
