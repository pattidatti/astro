import * as THREE from 'three';

const MAX_LASERS = 8;
const MAX_EXPLOSIONS = 6;
const MAX_SHIELD_HITS = 4;
const MAX_PROJECTILES = 20;

const LASER_LIFETIME = 0.12;
const EXPLOSION_LIFETIME = 0.6;
const SHIELD_HIT_LIFETIME = 0.4;
const PROJECTILE_SPEED = 120;

/**
 * Pooled combat visual effects: laser beams, explosions, shield impacts, warp flashes.
 */
export class CombatEffects {
  constructor(scene) {
    this._scene = scene;
    this._activeLasers = [];
    this._activeExplosions = [];
    this._activeShieldHits = [];
    this._activeProjectiles = [];
  }

  /**
   * Spawn a traveling projectile bolt from origin toward target.
   */
  projectile(fromPos, toPos, color = 0xff4444) {
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    const distance = dir.length();
    if (distance < 0.001) return;
    dir.divideScalar(distance);

    // Bolt: small elongated sphere
    const boltGeo = new THREE.SphereGeometry(0.15, 6, 4);
    boltGeo.applyMatrix4(new THREE.Matrix4().makeScale(0.4, 0.4, 1.8));
    const boltMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bolt = new THREE.Mesh(boltGeo, boltMat);
    bolt.position.copy(fromPos);

    // Orient bolt along direction of travel
    bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

    this._scene.add(bolt);

    // Small glow point
    const glowGeo = new THREE.SphereGeometry(0.2, 6, 4);
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(fromPos);
    this._scene.add(glow);

    this._activeProjectiles.push({
      bolt, glow, boltGeo, boltMat, glowGeo, glowMat,
      fromPos: fromPos.clone(),
      toPos: toPos.clone(),
      dir,
      distance,
      traveled: 0,
    });

    while (this._activeProjectiles.length > MAX_PROJECTILES) {
      this._disposeProjectile(this._activeProjectiles.shift());
    }
  }

  /**
   * Spawn a laser beam between two world positions.
   */
  laser(fromPos, toPos, color = 0xff4444) {
    const points = [fromPos.clone(), toPos.clone()];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 2,
    });
    const line = new THREE.Line(geo, mat);
    this._scene.add(line);

    // Glow point at hit position
    const glowGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(toPos);
    this._scene.add(glow);

    this._activeLasers.push({ line, glow, geo, mat, glowGeo, glowMat, age: 0 });

    while (this._activeLasers.length > MAX_LASERS) {
      this._disposeLaser(this._activeLasers.shift());
    }
  }

  /**
   * Spawn an explosion at a world position.
   */
  explosion(pos, size = 1.0, color = 0xff6600) {
    // Expanding sphere
    const sphereGeo = new THREE.SphereGeometry(0.3 * size, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.copy(pos);
    this._scene.add(sphere);

    // Flash ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.4, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffcc44,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.rotation.x = Math.PI / 2;
    this._scene.add(ring);

    // Flash light
    const light = new THREE.PointLight(color, 3, 20);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeExplosions.push({
      sphere, ring, light,
      sphereGeo, sphereMat, ringGeo, ringMat,
      age: 0, size,
    });

    while (this._activeExplosions.length > MAX_EXPLOSIONS) {
      this._disposeExplosion(this._activeExplosions.shift());
    }
  }

  /**
   * Spawn a shield impact flash at station.
   */
  shieldHit(pos, color = 0x4488ff) {
    const geo = new THREE.SphereGeometry(1.5, 16, 8, 0, Math.PI);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this._scene.add(mesh);

    this._activeShieldHits.push({ mesh, geo, mat, age: 0 });

    while (this._activeShieldHits.length > MAX_SHIELD_HITS) {
      this._disposeShieldHit(this._activeShieldHits.shift());
    }
  }

  /**
   * Large EMP burst ring.
   */
  empBurst(pos) {
    const ringGeo = new THREE.RingGeometry(0.5, 1.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.rotation.x = Math.PI / 2;
    this._scene.add(ring);

    const light = new THREE.PointLight(0x4488ff, 4, 40);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeExplosions.push({
      sphere: null, ring, light,
      sphereGeo: null, sphereMat: null, ringGeo, ringMat,
      age: 0, size: 3, isEMP: true,
    });
  }

  /**
   * Orbital strike beam effect.
   */
  orbitalStrike(pos) {
    // Vertical beam from high above
    const beamGeo = new THREE.CylinderGeometry(0.3, 1.5, 50, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(pos);
    beam.position.y += 25;
    this._scene.add(beam);

    const light = new THREE.PointLight(0xffcc00, 6, 50);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeExplosions.push({
      sphere: beam, ring: null, light,
      sphereGeo: beamGeo, sphereMat: beamMat, ringGeo: null, ringMat: null,
      age: 0, size: 1, isStrike: true,
    });
  }

  /**
   * Per-frame update all active effects.
   */
  update(dt) {
    // Projectiles
    for (let i = this._activeProjectiles.length - 1; i >= 0; i--) {
      const p = this._activeProjectiles[i];
      p.traveled += PROJECTILE_SPEED * dt;

      if (p.traveled >= p.distance) {
        // Arrived — dispose
        this._disposeProjectile(p);
        this._activeProjectiles.splice(i, 1);
        continue;
      }

      const t = p.traveled / p.distance;
      p.bolt.position.lerpVectors(p.fromPos, p.toPos, t);
      p.glow.position.copy(p.bolt.position);
      // Fade slightly as it nears target
      p.boltMat.opacity = 0.95 * (1 - t * 0.3);
      p.glowMat.opacity = 0.6 * (1 - t * 0.3);
    }

    // Lasers
    for (let i = this._activeLasers.length - 1; i >= 0; i--) {
      const e = this._activeLasers[i];
      e.age += dt;
      if (e.age >= LASER_LIFETIME) {
        this._disposeLaser(e);
        this._activeLasers.splice(i, 1);
        continue;
      }
      const t = e.age / LASER_LIFETIME;
      e.mat.opacity = (1 - t) * 0.9;
      e.glowMat.opacity = (1 - t) * 0.8;
    }

    // Explosions
    for (let i = this._activeExplosions.length - 1; i >= 0; i--) {
      const e = this._activeExplosions[i];
      e.age += dt;
      const lifetime = e.isStrike ? 0.8 : (e.isEMP ? 1.0 : EXPLOSION_LIFETIME);
      if (e.age >= lifetime) {
        this._disposeExplosion(e);
        this._activeExplosions.splice(i, 1);
        continue;
      }
      const t = e.age / lifetime;

      if (e.sphere) {
        if (e.isStrike) {
          e.sphereMat.opacity = (1 - t) * 0.7;
        } else {
          e.sphere.scale.setScalar(1 + t * 5 * e.size);
          e.sphereMat.opacity = (1 - t) * 0.9;
        }
      }
      if (e.ring) {
        const expandRate = e.isEMP ? 25 : 8;
        e.ring.scale.setScalar(1 + t * expandRate);
        e.ringMat.opacity = (1 - t) * 0.8;
      }
      if (e.light) {
        e.light.intensity = (1 - t) * (e.isEMP ? 4 : (e.isStrike ? 6 : 3));
      }
    }

    // Shield hits
    for (let i = this._activeShieldHits.length - 1; i >= 0; i--) {
      const e = this._activeShieldHits[i];
      e.age += dt;
      if (e.age >= SHIELD_HIT_LIFETIME) {
        this._disposeShieldHit(e);
        this._activeShieldHits.splice(i, 1);
        continue;
      }
      const t = e.age / SHIELD_HIT_LIFETIME;
      e.mat.opacity = (1 - t) * 0.5;
      e.mesh.scale.setScalar(1 + t * 0.5);
    }
  }

  _disposeProjectile(p) {
    this._scene.remove(p.bolt);
    this._scene.remove(p.glow);
    p.boltGeo.dispose();
    p.boltMat.dispose();
    p.glowGeo.dispose();
    p.glowMat.dispose();
  }

  _disposeLaser(e) {
    this._scene.remove(e.line);
    this._scene.remove(e.glow);
    e.geo.dispose();
    e.mat.dispose();
    e.glowGeo.dispose();
    e.glowMat.dispose();
  }

  _disposeExplosion(e) {
    if (e.sphere) { this._scene.remove(e.sphere); e.sphereGeo?.dispose(); e.sphereMat?.dispose(); }
    if (e.ring) { this._scene.remove(e.ring); e.ringGeo?.dispose(); e.ringMat?.dispose(); }
    if (e.light) this._scene.remove(e.light);
  }

  _disposeShieldHit(e) {
    this._scene.remove(e.mesh);
    e.geo.dispose();
    e.mat.dispose();
  }
}
