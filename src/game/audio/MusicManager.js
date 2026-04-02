import { gameState } from '../GameState.js';

const AMBIENT_TRACKS = [
  '/audio/music/ambient_1.ogg',
  '/audio/music/ambient_2.ogg',
  '/audio/music/ambient_3.ogg',
];

const COMBAT_TRACKS = [
  '/audio/music/combat_1.ogg',
  '/audio/music/combat_2.ogg',
  '/audio/music/combat_3.ogg',
];

const FADE_DURATION = 2.0; // seconds

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MusicManager = {
  _ctx: null,
  _musicGainNode: null,
  _audio: null,       // [HTMLAudioElement, HTMLAudioElement]
  _gains: null,       // [GainNode, GainNode]
  _sources: null,     // [MediaElementSourceNode, MediaElementSourceNode]
  _active: 0,
  _started: false,
  _mode: 'ambient',   // 'ambient' | 'combat'
  _playlist: [],
  _idx: 0,

  init(audioCtx, musicGainNode) {
    this._ctx = audioCtx;
    this._musicGainNode = musicGainNode;

    this._audio = [new Audio(), new Audio()];
    this._gains = [audioCtx.createGain(), audioCtx.createGain()];
    this._sources = this._audio.map((el, i) => {
      el.crossOrigin = 'anonymous';
      const src = audioCtx.createMediaElementSource(el);
      src.connect(this._gains[i]);
      this._gains[i].gain.value = 0;
      this._gains[i].connect(musicGainNode);
      return src;
    });

    this._audio[0].addEventListener('ended', () => this._onTrackEnded());
    this._audio[1].addEventListener('ended', () => this._onTrackEnded());

    gameState.on('attackStarted', () => this._setCombat(true));
    gameState.on('attackEnded',   () => {
      if (gameState.activeAttacks.length === 0) this._setCombat(false);
    });
  },

  start() {
    if (this._started) return;
    this._started = true;
    this._playlist = shuffle(AMBIENT_TRACKS);
    this._idx = 0;
    this._playTrack(this._playlist[0], true);
  },

  _onTrackEnded() {
    if (!this._started) return;
    this._idx = (this._idx + 1) % this._playlist.length;
    if (this._idx === 0) {
      // Re-shuffle when playlist loops
      this._playlist = shuffle(
        this._mode === 'combat' ? COMBAT_TRACKS : AMBIENT_TRACKS
      );
    }
    this._crossfadeTo(this._playlist[this._idx]);
  },

  _setCombat(active) {
    const newMode = active ? 'combat' : 'ambient';
    if (newMode === this._mode) return;
    this._mode = newMode;
    if (!this._started) return;
    this._playlist = shuffle(active ? COMBAT_TRACKS : AMBIENT_TRACKS);
    this._idx = 0;
    this._crossfadeTo(this._playlist[0]);
  },

  _playTrack(url, immediate = false) {
    const el = this._audio[this._active];
    const gain = this._gains[this._active];
    el.src = url;
    el.loop = false;
    el.play().catch(() => {});
    if (immediate) {
      gain.gain.setValueAtTime(1, this._ctx.currentTime);
    }
  },

  _crossfadeTo(url) {
    const next = 1 - this._active;
    const currentGain = this._gains[this._active];
    const nextGain    = this._gains[next];
    const now = this._ctx.currentTime;

    // Fade out current
    currentGain.gain.cancelScheduledValues(now);
    currentGain.gain.setValueAtTime(currentGain.gain.value, now);
    currentGain.gain.linearRampToValueAtTime(0, now + FADE_DURATION);

    // Prepare and fade in next
    nextGain.gain.cancelScheduledValues(now);
    nextGain.gain.setValueAtTime(0, now);
    nextGain.gain.linearRampToValueAtTime(1, now + FADE_DURATION);

    this._audio[next].src = url;
    this._audio[next].loop = false;
    this._audio[next].play().catch(() => {});

    const prev = this._active;
    this._active = next;

    setTimeout(() => {
      this._audio[prev].pause();
      this._audio[prev].src = '';
    }, FADE_DURATION * 1000 + 100);
  },
};

export { MusicManager };
