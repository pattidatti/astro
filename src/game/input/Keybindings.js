/**
 * Central keyboard routing.
 *
 * Every discrete shortcut in the game goes through this module instead of
 * registering its own `keydown` listener on `document`/`window`. That fixes two
 * classes of bug that ad-hoc listeners kept reintroducing:
 *
 *  1. Ordering. Listeners fire in registration order, so `stopImmediatePropagation`
 *     from a late-registered handler could not stop an early-registered one.
 *     Escape used to close the tech tree *and* open the pause menu because
 *     main.js registered before HUDBridge did. Here, dispatch order is decided by
 *     explicit priority, not by module load order.
 *
 *  2. Context. Each listener had to remember to ignore keypresses aimed at a text
 *     field or at a fullscreen overlay. Most of them didn't. Those guards now live
 *     in one place.
 *
 * Escape has dedicated handling: it closes the topmost registered modal, and only
 * reaches ordinary bindings when no modal is open.
 *
 * The modal stack also owns focus. A modal that registers its element gets the
 * three things a keyboard user needs and none of which happen by default: focus
 * moves into the dialog when it opens, Tab stays inside it while it is open, and
 * focus returns to whatever opened it on close. Without that, Tab from inside an
 * open research tree walked through the HUD buttons behind the overlay.
 */

/** Bindings registered with this priority run before lower ones. */
export const PRIORITY = {
  MODAL:   100, // overlays that own the keyboard while open
  UI:       50, // HUD-level shortcuts (research, help)
  CAMERA:   10, // view controls
};

class KeybindingRouter {
  constructor() {
    this._bindings = [];   // { keys:Set, handler, priority, allowInInput, id }
    this._modals   = [];   // { id, close } — last entry is topmost
    this._suspended = 0;   // >0 while a blocking screen owns the keyboard

    // Capture phase so we see the event before anything that still listens directly.
    window.addEventListener('keydown', (e) => this._dispatch(e), { capture: true });
  }

  /**
   * Register a shortcut.
   * @param {string|string[]} keys   `event.key` values, matched case-insensitively
   *                                 (e.g. 'v', 'Escape', ['1','2','3']).
   * @param {(e: KeyboardEvent) => boolean|void} handler
   *        Return `true` to consume the event and stop lower-priority handlers.
   *        Returning nothing counts as consuming it — return `false` explicitly to
   *        let the key fall through (used by handlers that only act conditionally).
   * @param {object} [opts]
   * @param {number}  [opts.priority=PRIORITY.UI]
   * @param {boolean} [opts.allowInInput=false] fire even while a form field has focus
   * @returns {() => void} unbind function
   */
  bind(keys, handler, { priority = PRIORITY.UI, allowInInput = false } = {}) {
    const entry = {
      keys: new Set((Array.isArray(keys) ? keys : [keys]).map(k => k.toLowerCase())),
      handler,
      priority,
      allowInInput,
    };
    this._bindings.push(entry);
    this._bindings.sort((a, b) => b.priority - a.priority);
    return () => {
      const i = this._bindings.indexOf(entry);
      if (i !== -1) this._bindings.splice(i, 1);
    };
  }

  /**
   * Declare a modal open. Escape closes the most recently pushed one.
   * Pushing the same id twice is a no-op, so callers may push defensively.
   *
   * @param {string} id
   * @param {() => void} close
   * @param {Element} [el] the dialog element — pass it to get focus handling
   */
  pushModal(id, close, el = null) {
    if (this._modals.some(m => m.id === id)) return;
    const restoreTo = el ? document.activeElement : null;
    this._modals.push({ id, close, el, restoreTo });
    if (el) focusFirst(el);
  }

  /** Declare a modal closed. Safe to call when it was never pushed. */
  popModal(id) {
    const i = this._modals.findIndex(m => m.id === id);
    if (i === -1) return;
    const [modal] = this._modals.splice(i, 1);
    // Returning focus matters as much as taking it: without this, dismissing a
    // dialog drops focus on <body> and Tab restarts from the top of the page.
    if (modal.restoreTo?.isConnected) modal.restoreTo.focus?.();
  }

  /** True while any modal is registered as open. */
  get hasModal() { return this._modals.length > 0; }

  /**
   * Stop routing entirely — used while the landing/pause screen owns the keyboard.
   * Nested calls are counted, so suspend/resume pairs can overlap safely.
   */
  suspend() { this._suspended++; }
  resume()  { this._suspended = Math.max(0, this._suspended - 1); }

  _dispatch(e) {
    if (this._suspended > 0) return;

    // Tab is handled before the modifier and repeat guards: Shift+Tab is a real
    // combination, and holding Tab to move several fields is a real gesture.
    if (e.key === 'Tab' && this._trapTab(e)) return;

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.repeat) return;

    const key = e.key.toLowerCase();
    const inInput = isTextEntry(document.activeElement);

    // Escape closes the topmost modal and goes no further. Only when nothing is
    // open does it reach the ordinary bindings (i.e. the pause menu).
    if (key === 'escape' && this._modals.length > 0) {
      const top = this._modals[this._modals.length - 1];
      // Go through popModal rather than splicing here, so closing with Escape
      // restores focus the same way closing with the button does. The modal's
      // own close() usually pops too; the second call is a no-op.
      this.popModal(top.id);
      top.close?.();
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    for (const b of this._bindings) {
      if (!b.keys.has(key)) continue;
      if (inInput && !b.allowInInput) continue;
      if (b.handler(e) === false) continue; // handler declined — try the next one
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
  }

  /**
   * Keep Tab inside the topmost modal that registered an element.
   * @returns {boolean} true when the event was consumed
   */
  _trapTab(e) {
    const top = this._modals[this._modals.length - 1];
    if (!top?.el?.isConnected) return false;

    const items = focusableWithin(top.el);
    if (items.length === 0) return false;

    const first = items[0];
    const last  = items[items.length - 1];
    const active = document.activeElement;

    // Focus escaped the dialog (or never entered it) — pull it back.
    if (!top.el.contains(active)) {
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && active === first) {
      last.focus();
    } else if (!e.shiftKey && active === last) {
      first.focus();
    } else {
      return false; // ordinary move inside the dialog — let the browser do it
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    return true;
  }
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Visible, enabled, focusable descendants in document order. */
function focusableWithin(root) {
  return [...root.querySelectorAll(FOCUSABLE)]
    .filter(el => !el.hasAttribute('disabled')
                && el.getAttribute('aria-hidden') !== 'true'
                // offsetParent is null for display:none (and fixed elements, which
                // is why the size check backs it up).
                && (el.offsetParent !== null || el.getClientRects().length > 0));
}

/** Move focus into a dialog when it opens. */
function focusFirst(el) {
  const items = focusableWithin(el);
  if (items.length > 0) {
    items[0].focus();
    return;
  }
  // A dialog with nothing to focus still needs to hold focus, or Tab would
  // start again from the top of the page behind it.
  if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
  el.focus();
}

function isTextEntry(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'SELECT' || tag === 'TEXTAREA') return true;
  if (tag === 'INPUT') {
    // Range sliders and buttons don't swallow text, so shortcuts should still work.
    return !['range', 'button', 'checkbox', 'radio', 'submit'].includes(el.type);
  }
  return el.isContentEditable === true;
}

export const keybindings = new KeybindingRouter();
