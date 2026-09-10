/**
 * Graphics quality presets.
 *
 * The renderer used to be fixed at its most expensive configuration — device
 * pixel ratio up to 2, soft shadow maps, and four post-processing passes — with
 * no way for a player on integrated graphics to trade looks for frame rate.
 * These presets expose that trade-off.
 *
 * Everything here applies live; nothing needs a reload. The two dominant costs
 * are pixel ratio (quadratic in fragment count) and the post chain, so 'low'
 * targets those first and only then drops shadows.
 */

const STORAGE_KEY = 'astro_graphics_quality';

export const QUALITY_PRESETS = {
  low: {
    label: 'LOW',
    hint: 'Best frame rate — no shadows or post effects',
    pixelRatio: 1,
    shadows: false,
    shadowMapSize: 512,
    bloom: false,
    godRays: false,
    colorGrade: true,   // cheap single pass, carries the game's whole look
  },
  medium: {
    label: 'MEDIUM',
    hint: 'Shadows and bloom, no volumetric light',
    pixelRatio: 1.5,
    shadows: true,
    shadowMapSize: 1024,
    bloom: true,
    godRays: false,
    colorGrade: true,
  },
  high: {
    label: 'HIGH',
    hint: 'Everything on',
    pixelRatio: 2,
    shadows: true,
    shadowMapSize: 1024,
    bloom: true,
    godRays: true,
    colorGrade: true,
  },
};

export const QUALITY_ORDER = ['low', 'medium', 'high'];

const DEFAULT_QUALITY = 'high';

/** Registered listeners, called with the resolved preset whenever quality changes. */
const _listeners = new Set();

let _current = readStoredQuality();

function readStoredQuality() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && QUALITY_PRESETS[stored]) return stored;
  } catch { /* storage blocked — fall through to the default */ }
  return DEFAULT_QUALITY;
}

/** Current quality key ('low' | 'medium' | 'high'). */
export function getQuality() { return _current; }

/** Current preset object. */
export function getPreset() { return QUALITY_PRESETS[_current]; }

/**
 * Change quality, persist it, and notify listeners. No-op for an unknown key or
 * one that is already active.
 */
export function setQuality(quality) {
  if (!QUALITY_PRESETS[quality] || quality === _current) return;
  _current = quality;
  try {
    localStorage.setItem(STORAGE_KEY, quality);
  } catch { /* storage blocked — the setting still applies for this session */ }
  const preset = QUALITY_PRESETS[quality];
  for (const fn of _listeners) {
    try {
      fn(preset);
    } catch (e) {
      console.warn('[GraphicsSettings] listener failed:', e);
    }
  }
}

/**
 * Subscribe to quality changes. Fires immediately with the current preset so
 * subscribers can use one code path for initial setup and later changes.
 * @returns {() => void} unsubscribe
 */
export function onQualityChange(fn) {
  _listeners.add(fn);
  fn(getPreset());
  return () => _listeners.delete(fn);
}
