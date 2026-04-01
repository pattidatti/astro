import * as THREE from 'three';
import { MinerBot } from './robots/MinerBot.js';
import { ScoutBot } from './robots/ScoutBot.js';
import { SpiderBot } from './robots/SpiderBot.js';
import { HoverBot } from './robots/HoverBot.js';
import { TitanBot } from './robots/TitanBot.js';

const MAX_VISIBLE = 32;
const ROBOT_CLASSES = [MinerBot, ScoutBot, SpiderBot, HoverBot, TitanBot];

/**
 * Manages a pool of visual robots for a solar system.
 * Syncs visible count with gameState.robots, caps at MAX_VISIBLE.
 */
export class RobotManager3D {
  constructor() {
    this.group = new THREE.Group();
    this.robots = [];
    this.targetCount = 0;
  }

  /**
   * Set the station position so robots know where to return cargo.
   * @param {THREE.Vector3} pos - Station world-local position
   */
  setStationPosition(pos) {
    for (const robot of this.robots) {
      robot.stationPos.copy(pos);
    }
    this._stationPos = pos.clone();
  }

  /**
   * Sync visible robot count with game state.
   * @param {number} totalRobots - Total robots owned
   */
  syncCount(totalRobots) {
    this.targetCount = Math.min(totalRobots, MAX_VISIBLE);

    // Add robots if needed
    while (this.robots.length < this.targetCount) {
      const index = this.robots.length;
      const RobotClass = ROBOT_CLASSES[index % ROBOT_CLASSES.length];
      const robot = new RobotClass(index);
      if (this._stationPos) {
        robot.stationPos.copy(this._stationPos);
      }
      this.robots.push(robot);
      this.group.add(robot.group);
    }

    // Hide excess robots (don't dispose — may be needed again)
    for (let i = 0; i < this.robots.length; i++) {
      this.robots[i].group.visible = i < this.targetCount;
    }
  }

  /**
   * Update all active robots.
   * @param {number} dt
   * @param {number} time
   */
  update(dt, time) {
    for (let i = 0; i < this.targetCount && i < this.robots.length; i++) {
      this.robots[i].update(dt, time);
    }
  }

  dispose() {
    for (const robot of this.robots) {
      robot.dispose();
    }
    this.robots = [];
  }
}
