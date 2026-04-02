import * as THREE from 'three';
import { MinerBot } from '../objects/robots/MinerBot.js';
import { ScoutBot } from '../objects/robots/ScoutBot.js';
import { SpiderBot } from '../objects/robots/SpiderBot.js';
import { HoverBot } from '../objects/robots/HoverBot.js';

const ROBOT_TYPE_CLASS = {
  miner:     MinerBot,
  energyBot: HoverBot,
  builder:   SpiderBot,
  scout:     ScoutBot,
};

const FLIGHT_DURATION = 3.5; // seconds

/**
 * Animates a real 3D robot model flying from off-screen (behind the right panel)
 * to the station in a smooth arc. On arrival, fires onArrival callback.
 */
export class SpawnFlight {
  constructor(scene, camera, galaxy) {
    this.scene  = scene;
    this.camera = camera;
    this.galaxy = galaxy;
    this.activeFlights = [];
    this.onArrival = null; // (worldPos: THREE.Vector3, planetId: string) => void
  }

  /**
   * Launch a 3D robot from the right edge of the screen toward the station.
   * @param {string} planetId
   * @param {string} robotType - miner|energyBot|builder|scout
   */
  /**
   * Callback when robot arrives at station.
   * @callback onArrival
   * @param {THREE.Vector3} worldPos - arrival position
   * @param {string} planetId - planet where robot arrived
   */
  launch(planetId, robotType) {
    const system = this.galaxy.getSystem(planetId);
    if (!system) return;

    const endPos = system.stationWorldPosition.clone();

    // Calculate start position: unproject a point at the right edge of the viewport
    // into 3D world space, at roughly the same depth as the station
    const camPos = this.camera.position.clone();
    const toStation = endPos.clone().sub(camPos);
    const stationDist = toStation.length();

    // NDC point slightly off-screen right, vertically centered
    const startNDC = new THREE.Vector3(1.4, 0.2, 0.5);
    startNDC.unproject(this.camera);
    // Direction from camera to unprojected point
    const dir = startNDC.sub(camPos).normalize();
    // Place start very close to camera for dramatic close-up reveal
    const startPos = camPos.clone().addScaledVector(dir, Math.max(8, stationDist * 0.08));

    // Control point: midpoint raised upward for arc
    const controlPos = new THREE.Vector3()
      .addVectors(startPos, endPos)
      .multiplyScalar(0.5);
    const upOffset = Math.max(3, stationDist * 0.15);
    controlPos.y += upOffset;

    // Create temporary robot
    const RobotClass = ROBOT_TYPE_CLASS[robotType] || MinerBot;
    const robot = new RobotClass(0);
    const mesh = robot.mesh;
    mesh.position.copy(startPos);
    this.scene.add(mesh);

    // Also add the trail
    const trail = robot.trail;
    this.scene.add(trail);

    // Collect emissive sub-meshes for glow boost during flight
    const emissiveMeshes = [];
    mesh.traverse((child) => {
      if (child.isMesh && child.material && child.material.emissive) {
        emissiveMeshes.push({ mat: child.material, originalIntensity: child.material.emissiveIntensity });
      }
    });

    // PointLight that travels with the robot
    const light = new THREE.PointLight(0x88ffaa, 4.0, 12, 1.5);
    light.position.copy(startPos);
    this.scene.add(light);

    this.activeFlights.push({
      mesh,
      trail,
      robot,
      light,
      emissiveMeshes,
      startPos,
      controlPos,
      endPos,
      age: 0,
      planetId,
      system,
    });
  }

  update(dt) {
    for (let i = this.activeFlights.length - 1; i >= 0; i--) {
      const f = this.activeFlights[i];
      f.age += dt;

      const rawT = Math.min(f.age / FLIGHT_DURATION, 1);
      // Ease-out cubic for smooth deceleration
      const t = 1 - Math.pow(1 - rawT, 3);

      // Track station position as it orbits
      f.endPos.copy(f.system.stationWorldPosition);

      // Quadratic bezier: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
      const omt = 1 - t;
      const x = omt * omt * f.startPos.x + 2 * omt * t * f.controlPos.x + t * t * f.endPos.x;
      const y = omt * omt * f.startPos.y + 2 * omt * t * f.controlPos.y + t * t * f.endPos.y;
      const z = omt * omt * f.startPos.z + 2 * omt * t * f.controlPos.z + t * t * f.endPos.z;
      f.mesh.position.set(x, y, z);

      // PointLight follows robot with pulsing intensity
      f.light.position.copy(f.mesh.position);
      const lightPulse = 1.0 + 0.35 * Math.sin(f.age * 8.0);
      f.light.intensity = 4.0 * lightPulse * (1 - rawT * 0.4);

      // Emissive glow boost on robot sub-meshes
      const glowPulse = 0.7 + 0.3 * Math.sin(f.age * 6.0);
      const glowBoost = 3.0 * glowPulse * (1 - rawT * 0.6);
      for (const em of f.emissiveMeshes) {
        em.mat.emissiveIntensity = em.originalIntensity + glowBoost;
      }

      // Trail opacity and color boosted during spawn flight
      const trailOpacity = 0.5 + 0.4 * Math.sin(rawT * Math.PI);
      f.trail.material.opacity = trailOpacity;
      const w = trailOpacity * 0.3;
      f.trail.material.color.setRGB(0x7c / 255 + w, 0xb8 / 255 + w, 0x5e / 255 + w);

      // Point toward destination (tangent of bezier)
      const tNext = Math.min(t + 0.05, 1);
      const omtN = 1 - tNext;
      const nx = omtN * omtN * f.startPos.x + 2 * omtN * tNext * f.controlPos.x + tNext * tNext * f.endPos.x;
      const ny = omtN * omtN * f.startPos.y + 2 * omtN * tNext * f.controlPos.y + tNext * tNext * f.endPos.y;
      const nz = omtN * omtN * f.startPos.z + 2 * omtN * tNext * f.controlPos.z + tNext * tNext * f.endPos.z;
      f.mesh.lookAt(nx, ny, nz);

      // Slight spin for visual flair
      f.mesh.rotation.z += dt * 2;

      // Scale: start visible, peak mid-flight, settle
      const scale = 0.3 * (0.7 + 0.6 * Math.sin(rawT * Math.PI));
      f.mesh.scale.setScalar(scale);

      // Arrival
      if (rawT >= 1) {
        for (const em of f.emissiveMeshes) {
          em.mat.emissiveIntensity = em.originalIntensity;
        }
        this.scene.remove(f.light);
        f.light.dispose();
        this.scene.remove(f.mesh);
        this.scene.remove(f.trail);
        f.robot.dispose();
        this.activeFlights.splice(i, 1);
        if (this.onArrival) this.onArrival(f.endPos, f.planetId);
      }
    }
  }

  dispose() {
    for (const f of this.activeFlights) {
      this.scene.remove(f.light);
      f.light.dispose();
      this.scene.remove(f.mesh);
      this.scene.remove(f.trail);
      f.robot.dispose();
    }
    this.activeFlights = [];
  }
}
