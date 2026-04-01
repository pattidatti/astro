import * as THREE from 'three';
import { Planet3D } from '../objects/Planet3D.js';
import { Station3D } from '../objects/Station3D.js';
import { RobotManager3D } from '../objects/RobotManager3D.js';
import { DustCloud } from '../effects/DustCloud.js';
import { NebulaVolume } from '../effects/NebulaVolume.js';
import { AsteroidBelt } from '../effects/AsteroidBelt.js';
import { LensFlare } from '../effects/LensFlare.js';
import { gameState } from '../GameState.js';

/**
 * A planet node orbiting the central star.
 * Contains Planet3D + Station3D + Robots + visual effects in an orbit group
 * that moves around the system center each frame.
 */
export class SolarSystem {
  constructor(planetDef, worldPosition) {
    this.id = planetDef.id;
    this.def = planetDef;
    this.group = new THREE.Group();
    this.group.position.copy(worldPosition);
    this.group.userData.type = 'solarSystem';
    this.group.userData.planetId = planetDef.id;

    // Orbital parameters
    const orbit = planetDef.orbit || { radius: 0, speed: 0, inclination: 0, phase: 0 };
    this.orbitRadius = orbit.radius;
    this.orbitSpeed = orbit.speed;
    this.orbitInclination = orbit.inclination;
    this.orbitPhase = orbit.phase;

    // Cached vector for planetWorldPosition getter
    this._cachedPlanetWorldPos = new THREE.Vector3();

    // Orbit path line — faint ellipse showing the orbital track
    this._createOrbitLine(planetDef);

    // Orbit group — everything orbits the central star
    this.orbitGroup = new THREE.Group();
    this.group.add(this.orbitGroup);

    // Planet
    this.planet = new Planet3D(planetDef);
    this.orbitGroup.add(this.planet.group);

    // Station
    this.station = new Station3D();
    this.orbitGroup.add(this.station.group);

    // Robots
    this.robotManager = new RobotManager3D();
    this.orbitGroup.add(this.robotManager.group);
    this._lastStationSync = 0;

    // Dust cloud (tinted to planet glow)
    this.dustCloud = new DustCloud(planetDef.glow);
    this.orbitGroup.add(this.dustCloud.group);

    // Nebula volumes — primary (large, behind planet) + secondary (offset, rotated 45°)
    const nebColors = planetDef.nebulaPalette?.colors || ['#110022', '#220044', '#003344', '#220055', '#004455'];
    const nebCol3 = nebColors[4] || nebColors[2] || '#003344';

    // Seed-baserte timeOffsets → hvert volum per planet skifter farge unikt
    const seed = planetDef.nebulaPalette?.seed || 42;
    const baseOff = (seed % 100) / 100 * Math.PI * 6;

    this.nebulaVolume = new NebulaVolume(
      nebColors[1] || nebColors[0],
      nebColors[3] || nebColors[1],
      nebCol3,
      80, baseOff
    );
    this.nebulaVolume.mesh.position.set(0, 0, -20);
    this.orbitGroup.add(this.nebulaVolume.mesh);

    // Second nebula layer — complementary colors, offset, 45° rotated
    this.nebulaVolume2 = new NebulaVolume(
      nebColors[3] || nebColors[0],
      nebColors[0],
      nebColors[2] || nebColors[1],
      70, baseOff + 1.1
    );
    this.nebulaVolume2.mesh.position.set(5, 3, -30);
    this.nebulaVolume2.mesh.rotation.z = Math.PI / 4;
    this.orbitGroup.add(this.nebulaVolume2.mesh);

    // Third nebula — side angle, smaller
    this.nebulaVolume3 = new NebulaVolume(
      nebColors[2] || nebColors[0],
      nebColors[4] || nebColors[2],
      nebColors[0],
      55, baseOff + 2.3
    );
    this.nebulaVolume3.mesh.position.set(-14, 7, -12);
    this.nebulaVolume3.mesh.rotation.z = -Math.PI / 5;
    this.orbitGroup.add(this.nebulaVolume3.mesh);

    // Fourth nebula — deep background, compact
    this.nebulaVolume4 = new NebulaVolume(
      nebColors[0],
      nebColors[2] || nebColors[1],
      nebColors[3] || nebColors[2],
      42, baseOff + 3.7
    );
    this.nebulaVolume4.mesh.position.set(10, -5, -42);
    this.nebulaVolume4.mesh.rotation.z = Math.PI / 3;
    this.nebulaVolume4.mesh.rotation.x = Math.PI / 8;
    this.orbitGroup.add(this.nebulaVolume4.mesh);

    // Komplementær + triadisk accentfarge — kontrast mot planetens dominante hue
    const dominantColor = new THREE.Color(nebColors[4] || nebColors[3]);
    const hsl = {};
    dominantColor.getHSL(hsl);
    const accentBright = new THREE.Color().setHSL((hsl.h + 0.5) % 1.0, 0.85, 0.55);
    const accentDark   = new THREE.Color().setHSL((hsl.h + 0.5) % 1.0, 0.6,  0.12);
    const triBright    = new THREE.Color().setHSL((hsl.h + 0.33) % 1.0, 0.80, 0.50);
    const triDark      = new THREE.Color().setHSL((hsl.h + 0.33) % 1.0, 0.5,  0.10);

    // Fifth nebula — komplementærfarge (f.eks. teal rundt rød planet)
    this.nebulaVolume5 = new NebulaVolume(
      '#' + accentDark.getHexString(),
      '#' + accentBright.getHexString(),
      nebColors[2] || nebColors[1],
      50, Math.PI * 1.2
    );
    this.nebulaVolume5.mesh.position.set(-9, 11, -20);
    this.nebulaVolume5.mesh.rotation.z = Math.PI / 6;
    this.orbitGroup.add(this.nebulaVolume5.mesh);

    // Sixth nebula — triadisk accent (f.eks. gull rundt lilla planet)
    this.nebulaVolume6 = new NebulaVolume(
      '#' + triDark.getHexString(),
      '#' + triBright.getHexString(),
      nebColors[4] || nebColors[3],
      38, Math.PI * 1.9
    );
    this.nebulaVolume6.mesh.position.set(15, -7, -16);
    this.nebulaVolume6.mesh.rotation.x = Math.PI / 7;
    this.orbitGroup.add(this.nebulaVolume6.mesh);

    // Asteroid belt (all planet types except star)
    this.asteroidBelt = null;
    if (planetDef.type !== 'star') {
      const beltColor = new THREE.Color(planetDef.col || planetDef.glow)
        .lerp(new THREE.Color(0x887766), 0.65);
      this.asteroidBelt = new AsteroidBelt(beltColor.getHex());
      this.orbitGroup.add(this.asteroidBelt.group);
    }

    // Lens flare for star-type planets
    this.lensFlare = null;
    if (planetDef.type === 'star') {
      this.lensFlare = new LensFlare(planetDef.glow, 1.0);
      this.orbitGroup.add(this.lensFlare.group);
    }

    // Rim light
    const glowColor = new THREE.Color(planetDef.glow);
    this.rimLight = new THREE.PointLight(glowColor, 0.8, 50, 1.5);
    this.rimLight.position.set(-8, 3, 12);
    this.orbitGroup.add(this.rimLight);

    // Fill light
    const fillColor = glowColor.clone().lerp(new THREE.Color(0xffffff), 0.3);
    this.fillLight = new THREE.PointLight(fillColor, 0.3, 35, 2);
    this.fillLight.position.set(5, -6, 5);
    this.orbitGroup.add(this.fillLight);

    // Label sprite
    this._createLabel(planetDef.name);

    // Robot sync
    this._onRobotsChanged = () => this._syncRobots();
    this._onPlanetChanged = () => this._syncRobots();
    this._onStateLoaded = () => this._syncRobots();
    this._syncRobots();
    gameState.on('robotsChanged', this._onRobotsChanged);
    gameState.on('planetChanged', this._onPlanetChanged);
    gameState.on('stateLoaded', this._onStateLoaded);

    // Set initial orbit position
    this._updateOrbit(0);
  }

  _createOrbitLine(planetDef) {
    if (this.orbitRadius === 0) return;
    const segments = 128;
    const points = [];
    const r = this.orbitRadius;
    const incl = this.orbitInclination;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * r,
        Math.sin(incl) * Math.sin(angle) * r * 0.3,
        Math.sin(angle) * r
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const color = new THREE.Color(planetDef.glow);
    this.orbitLineMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });
    this.orbitLine = new THREE.Line(geo, this.orbitLineMaterial);
    this.group.add(this.orbitLine);
  }

  _syncRobots() {
    const isActive = gameState.activePlanet === this.id;
    const count = isActive ? gameState.robots : 0;
    this.robotManager.syncCount(count);
  }

  _createLabel(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 28px Orbitron, monospace';
    ctx.textAlign = 'center';

    // Mørk dropshadow i flere lag for kontrast uten synlig ramme
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#000';
    for (let i = 0; i < 3; i++) ctx.fillText(name, 128, 42);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#e8d070';
    ctx.fillText(name, 128, 42);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    this.label = new THREE.Sprite(mat);
    this.label.scale.set(12, 3, 1);
    this.label.position.set(0, 14, 0);
    this.orbitGroup.add(this.label);
  }

  get clickTarget() {
    return this.planet.clickTarget;
  }

  /** System center (sun position) */
  get worldPosition() {
    return this.group.position;
  }

  /** Actual world position of the orbiting planet */
  get planetWorldPosition() {
    this.orbitGroup.getWorldPosition(this._cachedPlanetWorldPos);
    return this._cachedPlanetWorldPos;
  }

  /** Update orbital position of the planet around the central star */
  _updateOrbit(time) {
    if (this.orbitRadius === 0) return;
    const angle = time * this.orbitSpeed + this.orbitPhase;
    const r = this.orbitRadius;
    this.orbitGroup.position.set(
      Math.cos(angle) * r,
      Math.sin(this.orbitInclination) * Math.sin(angle) * r * 0.3,
      Math.sin(angle) * r
    );
  }

  /**
   * Update LOD based on camera distance to planet.
   * @param {number} distance - Distance from camera to this planet
   * @param {number} time - Elapsed time
   * @param {number} dt - Delta time
   * @param {THREE.Camera} camera - For billboard effects
   */
  updateLOD(distance, time, dt, camera) {
    // Update orbital position every frame
    this._updateOrbit(time);

    // Planet shader
    if (distance < 180) {
      this.planet.update(time);
    }

    // Station
    const stationVisible = distance < 80;
    this.station.group.visible = stationVisible;
    if (stationVisible) {
      this.station.update(time);
      if (time - this._lastStationSync > 0.2) {
        this._lastStationSync = time;
        this.robotManager.setStationPosition(this.station.group.position);
      }
    }

    // Robots
    const robotsVisible = distance < 60;
    this.robotManager.group.visible = robotsVisible;
    if (robotsVisible && dt !== undefined) {
      this.robotManager.update(dt, time);
    }

    // Asteroid belt — fade out 180→220
    if (this.asteroidBelt) {
      const beltFade = THREE.MathUtils.smoothstep(220, 180, distance);
      this.asteroidBelt.group.visible = beltFade > 0;
      if (beltFade > 0 && dt !== undefined) {
        this.asteroidBelt.update(dt);
        this.asteroidBelt.mesh.material.opacity = beltFade;
        this.asteroidBelt.mesh.material.transparent = beltFade < 0.99;
      }
    }

    // Dust cloud — fade out 130→160
    const dustFade = THREE.MathUtils.smoothstep(160, 130, distance);
    this.dustCloud.group.visible = dustFade > 0;
    if (dustFade > 0 && dt !== undefined) {
      this.dustCloud.setOpacity(0.35 * dustFade);
      this.dustCloud.update(dt, time);
    }

    // Nebula volumes — fade out 300→350
    const nebFade = THREE.MathUtils.smoothstep(350, 300, distance);
    this.nebulaVolume.mesh.visible = nebFade > 0;
    this.nebulaVolume2.mesh.visible = nebFade > 0;
    this.nebulaVolume3.mesh.visible = nebFade > 0;
    this.nebulaVolume4.mesh.visible = nebFade > 0;
    this.nebulaVolume5.mesh.visible = nebFade > 0;
    this.nebulaVolume6.mesh.visible = nebFade > 0;
    if (nebFade > 0 && camera) {
      this.nebulaVolume.material.uniforms.uOpacity.value = nebFade;
      this.nebulaVolume.update(time, camera);
      this.nebulaVolume2.material.uniforms.uOpacity.value = nebFade * 0.7;
      this.nebulaVolume2.update(time, camera);
      this.nebulaVolume3.material.uniforms.uOpacity.value = nebFade * 0.9;
      this.nebulaVolume3.update(time, camera);
      this.nebulaVolume4.material.uniforms.uOpacity.value = nebFade * 0.8;
      this.nebulaVolume4.update(time, camera);
      this.nebulaVolume5.material.uniforms.uOpacity.value = nebFade * 0.75;
      this.nebulaVolume5.update(time, camera);
      this.nebulaVolume6.material.uniforms.uOpacity.value = nebFade * 0.65;
      this.nebulaVolume6.update(time, camera);
    }

    // Lens flare (star-type only) — fade out 390→450
    if (this.lensFlare) {
      const flareFade = THREE.MathUtils.smoothstep(450, 390, distance);
      this.lensFlare.group.visible = flareFade > 0;
      if (flareFade > 0 && camera) {
        this.lensFlare.group.traverse(child => {
          if (child.isSprite) child.material.opacity = flareFade;
        });
        this.lensFlare.update(camera, time);
      }
    }

    // Label
    this.label.visible = distance > 15 && distance < 300;
    if (this.label.visible) {
      const s = Math.min(1.0, distance / 50);
      this.label.scale.set(12 * s, 3 * s, 1);
    }

    // Atmosphere — fade out 240→280
    if (this.planet.atmosphereMesh) {
      const atmFade = THREE.MathUtils.smoothstep(280, 240, distance);
      this.planet.atmosphereMesh.visible = atmFade > 0;
      if (atmFade > 0) {
        const base = this.planet.def.type === 'star' ? 1.2 : 0.8;
        this.planet.atmosphereMaterial.uniforms.uAtmIntensity.value = base * atmFade;
      }
    }

    // Rings — fade out 210→250
    if (this.planet.ringMesh) {
      const ringFade = THREE.MathUtils.smoothstep(250, 210, distance);
      this.planet.ringMesh.visible = ringFade > 0;
      if (ringFade > 0) {
        this.planet.ringMaterial.uniforms.uOpacity.value = 0.5 * ringFade;
      }
    }

    // Lights
    this.rimLight.visible = distance < 100;
    this.fillLight.visible = distance < 100;
  }

  dispose() {
    gameState.off('robotsChanged', this._onRobotsChanged);
    gameState.off('planetChanged', this._onPlanetChanged);
    gameState.off('stateLoaded', this._onStateLoaded);
    this.planet.dispose();
    this.station.dispose();
    this.robotManager.dispose();
    this.dustCloud.dispose();
    this.nebulaVolume.dispose();
    this.nebulaVolume2.dispose();
    this.nebulaVolume3.dispose();
    this.nebulaVolume4.dispose();
    this.nebulaVolume5.dispose();
    this.nebulaVolume6.dispose();
    if (this.asteroidBelt) this.asteroidBelt.dispose();
    if (this.orbitLine) {
      this.orbitLine.geometry.dispose();
      this.orbitLineMaterial.dispose();
    }
    if (this.lensFlare) this.lensFlare.dispose();
    if (this.label) {
      this.label.material.map.dispose();
      this.label.material.dispose();
    }
  }
}
