/**
 * Fatal-error screen.
 *
 * The game is a single WebGL canvas with no server-rendered fallback, so any
 * uncaught failure during boot — no WebGL, a shader that won't compile, a
 * corrupt save — used to leave the player staring at a black page with the real
 * cause only visible in devtools. This renders something readable instead, and
 * offers the two recoveries that actually help: reload, and start a fresh slot.
 */

const SAVE_KEY_PREFIX = 'astro_save_';

/** Detect WebGL support without keeping a context alive. */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Replace the page with an error screen. Safe to call more than once — only the
 * first call renders, so a cascade of failures doesn't stack overlays.
 * @param {object} opts
 * @param {string} opts.title    short headline, e.g. 'GRAPHICS UNAVAILABLE'
 * @param {string} opts.message  one or two sentences the player can act on
 * @param {Error|string} [opts.detail]  technical cause, shown in a collapsed block
 * @param {boolean} [opts.canReload=true]
 * @param {boolean} [opts.canResetSave=false] offer to clear the active save slot
 * @param {string}  [opts.slot]  slot cleared by the reset button
 */
export function showFatalError({
  title,
  message,
  detail,
  canReload = true,
  canResetSave = false,
  slot = 'slot_1',
} = {}) {
  if (document.getElementById('fatal-error')) return;

  // The 3D canvas and HUD are meaningless now and may still be animating.
  document.getElementById('hud-overlay')?.style.setProperty('display', 'none');
  document.getElementById('game-container')?.style.setProperty('display', 'none');

  const detailText = detail instanceof Error
    ? `${detail.name}: ${detail.message}\n${detail.stack || ''}`.trim()
    : (detail ? String(detail) : '');

  const el = document.createElement('div');
  el.id = 'fatal-error';
  el.innerHTML = `
    <div class="fatal-panel">
      <div class="fatal-glyph">⚠</div>
      <h1 class="fatal-title"></h1>
      <p class="fatal-message"></p>
      <div class="fatal-actions">
        ${canReload ? '<button class="fatal-btn fatal-btn--primary" id="fatal-reload">RELOAD</button>' : ''}
        ${canResetSave ? '<button class="fatal-btn" id="fatal-reset">START FRESH SLOT</button>' : ''}
      </div>
      ${detailText ? `
        <details class="fatal-details">
          <summary>TECHNICAL DETAIL</summary>
          <pre></pre>
        </details>` : ''}
    </div>
  `;
  // Assign untrusted text through textContent so a message containing markup
  // can't inject into the page.
  el.querySelector('.fatal-title').textContent = title;
  el.querySelector('.fatal-message').textContent = message;
  if (detailText) el.querySelector('.fatal-details pre').textContent = detailText;

  document.body.appendChild(el);

  el.querySelector('#fatal-reload')?.addEventListener('click', () => location.reload());
  el.querySelector('#fatal-reset')?.addEventListener('click', () => {
    try {
      localStorage.removeItem(SAVE_KEY_PREFIX + slot);
    } catch { /* storage unavailable — reload anyway */ }
    location.reload();
  });
}
