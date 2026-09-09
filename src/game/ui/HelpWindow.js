import { AudioManager } from '../audio/AudioManager.js';
import { keybindings, PRIORITY } from '../input/Keybindings.js';

/**
 * Controls reference.
 *
 * Several of the game's controls had no discovery path at all: RTS mode (V),
 * free-fly (Shift + WASD) and edge panning were only findable by accident, and
 * the tutorial covers the economy loop rather than the camera. This is the one
 * place that lists them.
 *
 * Built lazily on first open — most sessions never need the DOM.
 */

export const CONTROL_SECTIONS = [
  {
    title: 'CAMERA',
    rows: [
      [['DRAG'],                'Orbit around the focused body'],
      [['SCROLL'],              'Zoom between galaxy and surface'],
      [['MIDDLE', 'RIGHT'],     'Pan the view'],
      [['CLICK'],               'Focus a planet, station or fleet'],
      [['V'],                   'Toggle ADMIRAL MODE — top-down tactical view'],
      [['SHIFT', 'W A S D'],    'Free-fly: hold Shift, steer with WASD'],
    ],
  },
  {
    title: 'INTERFACE',
    rows: [
      [['T'],       'Research tree'],
      [['1', '–', '5'], 'Switch research branch while the tree is open'],
      [['?'],       'This screen'],
      [['ESC'],     'Close the top overlay, or open the menu'],
    ],
  },
  {
    title: 'FLEET COMMAND',
    rows: [
      [['DRAG'],   'Box-select your ships in Admiral Mode'],
      [['CLICK'],  'Send the selected fleet to a waypoint'],
      [['—'],      'Fleets burn energy while moving and ore while fighting — resupply near a military base'],
    ],
  },
];

export class HelpWindow {
  constructor() {
    this._overlay = null;
    this._visible = false;

    keybindings.bind(['?', '/'], () => this.toggle());
  }

  _build() {
    const overlay = document.createElement('div');
    overlay.id = 'help-overlay';
    overlay.innerHTML = `
      <div id="help-modal">
        <div class="help-header">
          <span class="help-title">CONTROLS</span>
          <button class="help-close" id="help-close-btn" title="Close">&#x2715;</button>
        </div>
        <div class="help-body">
          ${CONTROL_SECTIONS.map(section => `
            <div class="help-section">
              <div class="help-section-title">${section.title}</div>
              ${section.rows.map(([keys, desc]) => `
                <div class="help-row">
                  <span class="help-keys">${keys.map(k =>
                    k === '–' || k === '—' ? `<span class="help-sep">${k}</span>` : `<kbd>${k}</kbd>`
                  ).join('')}</span>
                  <span class="help-desc">${desc}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div class="help-footer">Press <kbd>?</kbd> any time to reopen</div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('pointerdown', (e) => {
      if (e.target === overlay) this.hide();
    });
    overlay.querySelector('#help-close-btn')
      .addEventListener('pointerdown', () => this.hide());

    this._overlay = overlay;
  }

  show() {
    if (!this._overlay) this._build();
    this._overlay.classList.add('help-overlay--visible');
    this._visible = true;
    keybindings.pushModal('help', () => this.hide());
    AudioManager.play('UI_CLICK');
  }

  hide() {
    if (!this._overlay) return;
    this._overlay.classList.remove('help-overlay--visible');
    this._visible = false;
    keybindings.popModal('help');
  }

  toggle() {
    this._visible ? this.hide() : this.show();
  }
}
