/**
 * UI activation.
 *
 * The in-game HUD bound every button to `pointerdown`, while the landing screen
 * used `click`. That split had two consequences, both invisible to whoever wrote
 * it on a mouse:
 *
 *  1. Keyboard did nothing. The HUD buttons are real `<button>` elements, so Tab
 *     reaches them and Enter/Space fires a `click` — which nothing listened for.
 *     Every in-game action (build, hire, research, launch) was mouse-only, while
 *     the menu behind Escape worked fine.
 *
 *  2. Touch fired on contact. `pointerdown` runs the moment a finger lands, so
 *     dragging to scroll a panel triggered whatever button it started on. That
 *     matters more since the panels dock to the bottom edge on narrow screens.
 *
 * `click` fixes both: it is emitted by mouse, by touch (only after a tap that
 * did not turn into a scroll), and by Enter/Space on a focused control.
 */

/**
 * Make an element activate `handler` on click, keyboard, or tap.
 *
 * @param {Element|null} el  no-op when null, so callers can pass a query directly
 * @param {(e: Event) => void} handler
 * @param {object} [opts]
 * @param {boolean} [opts.once=false]
 *        Unbind after the first activation. Unbinds *all* of this call's
 *        listeners, not just the click one — a bare `{ once: true }` on the
 *        click listener would leave the pointerdown guard behind to accumulate
 *        every time the caller re-binds.
 * @param {boolean} [opts.stopPropagation=true]
 *        Also swallow `pointerdown`, which is what the old handlers did. Nothing
 *        above the HUD listens for it today — the camera and raycaster bind to
 *        the canvas, which is a sibling — but keeping it preserves the previous
 *        behaviour exactly rather than betting on that staying true.
 * @returns {() => void} unbind
 */
export function onActivate(el, handler, { stopPropagation = true, once = false } = {}) {
  if (!el) return () => {};

  const onClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    if (once) unbind();
    handler(e);
  };
  const swallow = (e) => e.stopPropagation();

  el.addEventListener('click', onClick);
  if (stopPropagation) el.addEventListener('pointerdown', swallow);

  // A <div> is not in the tab order and does not turn Enter/Space into a click,
  // so anything that isn't a native control has to be told it is one. Routing
  // through el.click() keeps a single activation path.
  let onKeyDown = null;
  if (!isNativeControl(el)) {
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    onKeyDown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();  // Space would otherwise scroll the panel
      el.click();
    };
    el.addEventListener('keydown', onKeyDown);
  }

  function unbind() {
    el.removeEventListener('click', onClick);
    if (stopPropagation) el.removeEventListener('pointerdown', swallow);
    if (onKeyDown) el.removeEventListener('keydown', onKeyDown);
  }
  return unbind;
}

/**
 * Dismiss a modal when the backdrop itself is activated.
 *
 * Split out because the target check is the whole point: a click that started
 * inside the dialog must not close it.
 */
export function onBackdropActivate(overlay, close) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

function isNativeControl(el) {
  const tag = el.tagName;
  return tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA'
      || (tag === 'A' && el.hasAttribute('href'));
}
