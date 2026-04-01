import { gameState } from '../GameState.js';
import Scout from './robots/Scout.js';
import Miner from './robots/Miner.js';
import Spider from './robots/Spider.js';
import Hover from './robots/Hover.js';
import Titan from './robots/Titan.js';

const ROBOT_CLASSES = [Scout, Miner, Spider, Hover, Titan];
const MAX_VISUAL = 32;

export default class RobotManager {
  constructor(scene) {
    this.scene = scene;
    this.bots = [];
    this.planetCx = 0;
    this.planetCy = 0;
    this.planetR = 0;
    this.stationX = 0;
    this.stationY = 0;

    gameState.on('robotsChanged', () => this.syncBots());
    gameState.on('stateLoaded', () => this.syncBots());
  }

  setup(cx, cy, R, sx, sy) {
    this.planetCx = cx;
    this.planetCy = cy;
    this.planetR = R;
    this.stationX = sx;
    this.stationY = sy;

    // Update existing bots with new positions
    for (const bot of this.bots) {
      bot.planetCx = cx;
      bot.planetCy = cy;
      bot.planetR = R;
      bot.stationX = sx;
      bot.stationY = sy;
    }

    this.syncBots();
  }

  syncBots() {
    const target = Math.min(gameState.robots, MAX_VISUAL);

    // Add missing bots
    while (this.bots.length < target) {
      const RobotClass = ROBOT_CLASSES[Math.floor(Math.random() * ROBOT_CLASSES.length)];
      const bot = new RobotClass(this.scene, {
        angle: Math.random() * Math.PI * 2,
        speed: (0.003 + Math.random() * 0.007) * (Math.random() < 0.5 ? 1 : -1)
      });
      bot.planetCx = this.planetCx;
      bot.planetCy = this.planetCy;
      bot.planetR = this.planetR;
      bot.stationX = this.stationX;
      bot.stationY = this.stationY;
      bot.setDepth(4);
      this.bots.push(bot);
    }

    // Remove excess bots
    while (this.bots.length > target) {
      const bot = this.bots.pop();
      bot.destroy();
    }
  }

  update(t, delta) {
    // Update station Y for trails (station bobs)
    const stationContainer = this.scene.station;
    if (stationContainer) {
      const sy = stationContainer.y;
      for (const bot of this.bots) {
        bot.stationY = sy;
      }
    }

    for (const bot of this.bots) {
      bot.update(t);
    }
  }
}
