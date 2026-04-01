const SOUNDS = {
  UI_CLICK:         '/audio/ui/click_mid.wav',
  UI_CLICK_DENIED:  '/audio/ui/click_pitched_down.wav',
  UI_MUTE:          '/audio/ui/click_stutter.wav',
  UI_MENU_CLICK:    '/audio/ui/high_click_1.wav',
  UI_ROUTE_ADD:     '/audio/ui/click_combo_2.wav',
  UI_CONFIRM:       '/audio/tones/tone2a_major_triad_down.wav',
  PLANET_CLICK_3D:  '/audio/ui/click_combo.wav',
  SHIP_ARRIVED:     '/audio/ui/click_scoop_up.wav',

  ROBOT_HIRED:      '/audio/tones/tone1a_major_third_up.wav',
  ROBOT_UPGRADED:   '/audio/tones/tone1b_major_third_up.wav',
  BASE_UPGRADED:    '/audio/tones/tone2b_major_triad_up.wav',
  PLANET_CHANGED:   '/audio/tones/tone1c.wav',
  PLANET_COLONIZED: '/audio/tones/tone3a_major_triad_up.wav',
  STATE_LOADED:     '/audio/tones/tone3c_minor_triad_up.wav',

  SHIP_LAUNCHED:    '/audio/fx/air_fx_pitched_up.wav',
  DEPOSIT_UNLOCKED: '/audio/fx/ring_pitched_up.wav',
  COLONIZE_DENIED:  '/audio/fx/glitch_1.wav',
};

const AudioManager = {
  _ctx: null,
  _masterGain: null,
  _buffers: new Map(),
  _unlocked: false,
  _muted: false,
  _volume: 0.7,

  async init() {
    this._volume = parseFloat(localStorage.getItem('astro_audio_vol') ?? '0.7');
    this._muted  = localStorage.getItem('astro_audio_mute') === '1';
    this._ctx = new AudioContext();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = this._muted ? 0 : this._volume;
    this._masterGain.connect(this._ctx.destination);
    await this._loadAll();
  },

  unlock() {
    if (this._unlocked || !this._ctx) return;
    this._unlocked = true;
    if (this._ctx.state === 'suspended') this._ctx.resume();
  },

  play(name, { volume = 1, detune = 0 } = {}) {
    if (!this._unlocked || this._muted || !this._ctx) return;
    const buf = this._buffers.get(name);
    if (!buf) return;
    const src = this._ctx.createBufferSource();
    src.buffer = buf;
    src.detune.value = detune;
    const gain = this._ctx.createGain();
    gain.gain.value = Math.min(1, volume);
    src.connect(gain);
    gain.connect(this._masterGain);
    src.start(0);
  },

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._masterGain && !this._muted) {
      this._masterGain.gain.value = this._volume;
    }
    localStorage.setItem('astro_audio_vol', String(this._volume));
  },

  getVolume() {
    return this._volume;
  },

  toggleMute() {
    this._muted = !this._muted;
    if (this._masterGain) {
      this._masterGain.gain.value = this._muted ? 0 : this._volume;
    }
    localStorage.setItem('astro_audio_mute', this._muted ? '1' : '0');
    return this._muted;
  },

  isMuted() {
    return this._muted;
  },

  async _loadAll() {
    const entries = Object.entries(SOUNDS);
    await Promise.allSettled(entries.map(async ([name, path]) => {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ab  = await res.arrayBuffer();
        const buf = await this._ctx.decodeAudioData(ab);
        this._buffers.set(name, buf);
      } catch (e) {
        console.warn(`[AudioManager] Failed to load ${name} (${path}):`, e.message);
      }
    }));
  },
};

export { AudioManager };
