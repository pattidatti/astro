import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import PlanetScene from './scenes/Planet.js';
import HUDScene from './scenes/HUD.js';

export function createGame() {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent: 'game-container',
    backgroundColor: '#0a0e14',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    scene: [BootScene, PlanetScene, HUDScene],
    input: {
      touch: {
        capture: true
      }
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
    audio: {
      noAudio: true
    }
  });
}
