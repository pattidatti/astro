import * as THREE from 'three';

const MAX_LASERS = 8;
const MAX_EXPLOSIONS = 6;
const MAX_SHIELD_HITS = 4;
const MAX_PROJECTILES = 20;
const MAX_TITAN_EFFECTS = 3;

const LASER_LIFETIME = 0.12;
const EXPLOSION_LIFETIME = 0.6;
const SHIELD_HIT_LIFETIME = 0.4;
const PROJECTILE_SPEED = 120;
const TITAN_EFFECT_LIFETIME = 1.2;
const TITAN_SHOCKWAVE_LIFETIME = 1.0;

// Scratch vector reused across projectile spawns (never concurrent)
const _tmpUp = new THREE.Vector3(0, 0, 1);

/**
 * Pooled combat visual effects: laser beams, explosions, shield impacts, warp flashes.
 *
 * All pool objects are added to the scene at construction with visible=false.
 * Spawn grabs from pool → updates in-place → sets visible=true.
 * Expire sets visible=false → returns to pool. No geometry/material disposal.
 *
 * Rare one-off abilities (EMP, orbital strike, Titan) still allocate — they
 * fire at most once per 30+ second cooldown.
 */
export class CombatEffects {
  constructor(scene) {
    this._scene = scene;

    // Pool free lists
    this._laserPool      = [];
    this._explosionPool  = [];
    this._shieldHitPool  = [];
    this._projectilePool = [];

    // Active lists (entries are pool objects tagged with lifecycle state)
    this._activeLasers         = [];
    this._activeExplosions     = [];
    this._activeShieldHits     = [];
    this._activeProjectiles    = [];
    this._activeSpecialEffects = []; // EMP, orbital strike, Titan (allocating, rare)
    this._activeTitanEffects   = [];

    this._initPools();
  }

  _initPools() {
    // ── Laser pool ─────────────────────────────────────────────────────────
    for (let i = 0; i < MAX_LASERS; i++) {
      const posArr = new Float32Array(6); // 2 points × 3 components
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      const mat = new THREE.LineBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        linewidth: 2,
      });
      const line = new THREE.Line(geo, mat);
      line.visible = false;
      this._scene.add(line);

      const glowGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.visible = false;
      this._scene.add(glow);

      this._laserPool.push({ line, glow, geo, mat, glowMat, age: 0 });
    }

    // ── Explosion pool ─────────────────────────────────────────────────────
    for (let i = 0; i < MAX_EXPLOSIONS; i++) {
      const sphereGeo = new THREE.SphereGeometry(0.3, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.visible = false;
      this._scene.add(sphere);

      const ringGeo = new THREE.RingGeometry(0.2, 0.4, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffcc44,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.visible = false;
      this._scene.add(ring);

      const light = new THREE.PointLight(0xff6600, 0, 20);
      light.visible = false;
      this._scene.add(light);

      this._explosionPool.push({ sphere, sphereMat, ring, ringMat, light, age: 0, size: 1 });
    }

    // ── Shield hit pool ─────────────────────────────────────────────────────
    for (let i = 0; i < MAX_SHIELD_HITS; i++) {
      const geo = new THREE.SphereGeometry(1.5, 16, 8, 0, Math.PI);
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this._scene.add(mesh);

      this._shieldHitPool.push({ mesh, mat, age: 0 });
    }

    // ── Projectile pool ─────────────────────────────────────────────────────
    const _scaleM4 = new THREE.Matrix4().makeScale(0.4, 0.4, 1.8);
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      const boltGeo = new THREE.SphereGeometry(0.15, 6, 4);
      boltGeo.applyMatrix4(_scaleM4);
      const boltMat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.visible = false;
      this._scene.add(bolt);

      const glowGeo = new THREE.SphereGeometry(0.2, 6, 4);
      const glowMat = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.visible = false;
      this._scene.add(glow);

      // Pre-allocate from/to vectors so spawn never allocates
      this._projectilePool.push({
        bolt, boltMat, glow, glowMat,
        fromPos: new THREE.Vector3(),
        toPos: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        distance: 0, traveled: 0,
      });
    }
  }

  // ─── Public spawn methods ─────────────────────────────────────────────────

  /**
   * Spawn a traveling projectile bolt from origin toward target.
   */
  projectile(fromPos, toPos, color = 0xff4444) {
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    const distance = dir.length();
    if (distance < 0.001) return;
    dir.divideScalar(distance);

    const entry = this._acquireProjectile();
    if (!entry) return;

    entry.boltMat.color.set(color);
    entry.boltMat.opacity = 0.95;
    entry.glowMat.color.set(color);
    entry.glowMat.opacity = 0.6;
    entry.fromPos.copy(fromPos);
    entry.toPos.copy(toPos);
    entry.dir.copy(dir);
    entry.distance = distance;
    entry.traveled = 0;

    entry.bolt.position.copy(fromPos);
    entry.bolt.quaternion.setFromUnitVectors(_tmpUp, dir);
    entry.glow.position.copy(fromPos);

    entry.bolt.visible = true;
    entry.glow.visible = true;

    this._activeProjectiles.push(entry);
  }

  /**
   * Spawn a laser beam between two world positions.
   */
  laser(fromPos, toPos, color = 0xff4444) {
    const entry = this._acquireLaser();
    if (!entry) return;

    const posArr = entry.geo.attributes.position.array;
    posArr[0] = fromPos.x; posArr[1] = fromPos.y; posArr[2] = fromPos.z;
    posArr[3] = toPos.x;   posArr[4] = toPos.y;   posArr[5] = toPos.z;
    entry.geo.attributes.position.needsUpdate = true;
    entry.geo.computeBoundingSphere();

    entry.mat.color.set(color);
    entry.mat.opacity = 0.9;
    entry.glowMat.color.set(color);
    entry.glowMat.opacity = 0.8;
    entry.glow.position.copy(toPos);
    entry.age = 0;

    entry.line.visible = true;
    entry.glow.visible = true;

    this._activeLasers.push(entry);
  }

  /**
   * Spawn an explosion at a world position.
   */
  explosion(pos, size = 1.0, color = 0xff6600) {
    const entry = this._acquireExplosion();
    if (!entry) return;

    entry.sphereMat.color.set(color);
    entry.sphereMat.opacity = 0.9;
    entry.sphere.position.copy(pos);
    entry.sphere.scale.setScalar(size);

    entry.ringMat.color.set(0xffcc44);
    entry.ringMat.opacity = 0.8;
    entry.ring.position.copy(pos);
    entry.ring.scale.setScalar(1);

    entry.light.color.set(color);
    entry.light.intensity = 3;
    entry.light.distance = 20;
    entry.light.position.copy(pos);

    entry.age = 0;
    entry.size = size;
    entry.isEMP = false;
    entry.isStrike = false;

    entry.sphere.visible = true;
    entry.ring.visible = true;
    entry.light.visible = true;

    this._activeExplosions.push(entry);
  }

  /**
   * Spawn a shield impact flash at station.
   */
  shieldHit(pos, color = 0x4488ff) {
    const entry = this._acquireShieldHit();
    if (!entry) return;

    entry.mat.color.set(color);
    entry.mat.opacity = 0.5;
    entry.mesh.position.copy(pos);
    entry.mesh.scale.setScalar(1);
    entry.age = 0;
    entry.mesh.visible = true;

    this._activeShieldHits.push(entry);
  }

  /**
   * Large EMP burst ring — allocates (rare player ability, ~1 per 60s cooldown).
   */
  empBurst(pos) {
    const ringGeo = new THREE.RingGeometry(0.5, 1.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff, transparent: true, opacity: 0.9,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.rotation.x = Math.PI / 2;
    this._scene.add(ring);

    const light = new THREE.PointLight(0x4488ff, 4, 40);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeSpecialEffects.push({
      sphere: null, ring, light,
      sphereGeo: null, sphereMat: null, ringGeo, ringMat,
      age: 0, size: 3, isEMP: true, isStrike: false,
    });
  }

  /**
   * Orbital strike beam — allocates (rare player ability).
   */
  orbitalStrike(pos) {
    const beamGeo = new THREE.CylinderGeometry(0.3, 1.5, 50, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(pos);
    beam.position.y += 25;
    this._scene.add(beam);

    const light = new THREE.PointLight(0xffcc00, 6, 50);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeSpecialEffects.push({
      sphere: beam, ring: null, light,
      sphereGeo: beamGeo, sphereMat: beamMat, ringGeo: null, ringMat: null,
      age: 0, size: 1, isEMP: false, isStrike: true,
    });
  }

  /**
   * Spawn a green healing laser beam between a carrier and its target.
   */
  healBeam(fromPos, toPos) {
    this.laser(fromPos, toPos, 0x44ff88);
  }

  /**
   * Spawn an amber supply beam — Carrier restoring ore supply to the fleet.
   */
  supplyBeam(fromPos, toPos) {
    this.laser(fromPos, toPos, 0xffaa33);
  }

  /**
   * Titan AoE Ultimate — allocates (rare enemy ability).
   */
  fireTitanUltimate(pos) {
    const COLOR = 0xaa33ff;

    const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: COLOR, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.copy(pos);
    this._scene.add(sphere);

    const ringGeo = new THREE.RingGeometry(0.8, 1.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR, transparent: true, opacity: 0,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.rotation.x = Math.PI / 2;
    this._scene.add(ring);

    const light = new THREE.PointLight(COLOR, 8, 60);
    light.position.copy(pos);
    this._scene.add(light);

    this._activeTitanEffects.push({ sphere, ring, light, sphereGeo, sphereMat, ringGeo, ringMat, age: 0 });

    while (this._activeTitanEffects.length > MAX_TITAN_EFFECTS) {
      this._disposeTitanEffect(this._activeTitanEffects.shift());
    }
  }

  // ─── Per-frame update ─────────────────────────────────────────────────────

  update(dt) {
    // Projectiles
    for (let i = this._activeProjectiles.length - 1; i >= 0; i--) {
      const p = this._activeProjectiles[i];
      p.traveled += PROJECTILE_SPEED * dt;

      if (p.traveled >= p.distance) {
        this._releaseProjectile(p);
        this._activeProjectiles.splice(i, 1);
        continue;
      }

      const t = p.traveled / p.distance;
      p.bolt.position.lerpVectors(p.fromPos, p.toPos, t);
      p.glow.position.copy(p.bolt.position);
      p.boltMat.opacity = 0.95 * (1 - t * 0.3);
      p.glowMat.opacity = 0.6  * (1 - t * 0.3);
    }

    // Lasers (pooled)
    for (let i = this._activeLasers.length - 1; i >= 0; i--) {
      const e = this._activeLasers[i];
      e.age += dt;
      if (e.age >= LASER_LIFETIME) {
        this._releaseLaser(e);
        this._activeLasers.splice(i, 1);
        continue;
      }
      const t = e.age / LASER_LIFETIME;
      e.mat.opacity    = (1 - t) * 0.9;
      e.glowMat.opacity = (1 - t) * 0.8;
    }

    // Regular explosions (pooled)
    for (let i = this._activeExplosions.length - 1; i >= 0; i--) {
      const e = this._activeExplosions[i];
      e.age += dt;
      if (e.age >= EXPLOSION_LIFETIME) {
        this._releaseExplosion(e);
        this._activeExplosions.splice(i, 1);
        continue;
      }
      const t = e.age / EXPLOSION_LIFETIME;
      e.sphere.scale.setScalar(e.size * (1 + t * 5));
      e.sphereMat.opacity = (1 - t) * 0.9;
      e.ring.scale.setScalar(1 + t * 8);
      e.ringMat.opacity = (1 - t) * 0.8;
      e.light.intensity = (1 - t) * 3;
    }

    // Special effects (EMP, orbital strike — allocating)
    for (let i = this._activeSpecialEffects.length - 1; i >= 0; i--) {
      const e = this._activeSpecialEffects[i];
      e.age += dt;
      const lifetime = e.isStrike ? 0.8 : 1.0;
      if (e.age >= lifetime) {
        this._disposeSpecial(e);
        this._activeSpecialEffects.splice(i, 1);
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
        e.light.intensity = (1 - t) * (e.isEMP ? 4 : 6);
      }
    }

    // Shield hits (pooled)
    for (let i = this._activeShieldHits.length - 1; i >= 0; i--) {
      const e = this._activeShieldHits[i];
      e.age += dt;
      if (e.age >= SHIELD_HIT_LIFETIME) {
        this._releaseShieldHit(e);
        this._activeShieldHits.splice(i, 1);
        continue;
      }
      const t = e.age / SHIELD_HIT_LIFETIME;
      e.mat.opacity = (1 - t) * 0.5;
      e.mesh.scale.setScalar(1 + t * 0.5);
    }

    // Titan Ultimate effects (allocating)
    for (let i = this._activeTitanEffects.length - 1; i >= 0; i--) {
      const e = this._activeTitanEffects[i];
      e.age += dt;
      if (e.age >= TITAN_EFFECT_LIFETIME) {
        this._disposeTitanEffect(e);
        this._activeTitanEffects.splice(i, 1);
        continue;
      }
      const t = e.age / TITAN_EFFECT_LIFETIME;
      e.sphere.scale.setScalar(1 + t * 19);
      e.sphereMat.opacity = (1 - t) * 0.7;
      const ringT = e.age / TITAN_SHOCKWAVE_LIFETIME;
      if (ringT <= 1.0) {
        e.ring.scale.setScalar(1 + ringT * 29);
        e.ringMat.opacity = ringT < 0.3
          ? ringT / 0.3
          : (1 - (ringT - 0.3) / 0.7);
      } else {
        e.ringMat.opacity = 0;
      }
      e.light.intensity = (1 - t) * 8;
    }
  }

  // ─── Pool acquire / release ───────────────────────────────────────────────

  _acquireLaser() {
    if (this._laserPool.length > 0) return this._laserPool.pop();
    // Pool exhausted — reclaim oldest active
    if (this._activeLasers.length === 0) return null;
    const oldest = this._activeLasers.shift();
    this._releaseLaser(oldest);
    return this._laserPool.pop();
  }

  _releaseLaser(e) {
    e.line.visible = false;
    e.glow.visible = false;
    this._laserPool.push(e);
  }

  _acquireExplosion() {
    if (this._explosionPool.length > 0) return this._explosionPool.pop();
    if (this._activeExplosions.length === 0) return null;
    const oldest = this._activeExplosions.shift();
    this._releaseExplosion(oldest);
    return this._explosionPool.pop();
  }

  _releaseExplosion(e) {
    e.sphere.visible = false;
    e.ring.visible   = false;
    e.light.visible  = false;
    e.light.intensity = 0;
    this._explosionPool.push(e);
  }

  _acquireShieldHit() {
    if (this._shieldHitPool.length > 0) return this._shieldHitPool.pop();
    if (this._activeShieldHits.length === 0) return null;
    const oldest = this._activeShieldHits.shift();
    this._releaseShieldHit(oldest);
    return this._shieldHitPool.pop();
  }

  _releaseShieldHit(e) {
    e.mesh.visible = false;
    this._shieldHitPool.push(e);
  }

  _acquireProjectile() {
    if (this._projectilePool.length > 0) return this._projectilePool.pop();
    if (this._activeProjectiles.length === 0) return null;
    const oldest = this._activeProjectiles.shift();
    this._releaseProjectile(oldest);
    return this._projectilePool.pop();
  }

  _releaseProjectile(e) {
    e.bolt.visible = false;
    e.glow.visible = false;
    this._projectilePool.push(e);
  }

  // ─── Allocating-path dispose (special effects only) ───────────────────────

  _disposeSpecial(e) {
    if (e.sphere) { this._scene.remove(e.sphere); e.sphereGeo?.dispose(); e.sphereMat?.dispose(); }
    if (e.ring)   { this._scene.remove(e.ring);   e.ringGeo?.dispose();   e.ringMat?.dispose();   }
    if (e.light)  this._scene.remove(e.light);
  }

  _disposeTitanEffect(e) {
    if (e.sphere) { this._scene.remove(e.sphere); e.sphereGeo.dispose(); e.sphereMat.dispose(); }
    if (e.ring)   { this._scene.remove(e.ring);   e.ringGeo.dispose();   e.ringMat.dispose();   }
    if (e.light)  this._scene.remove(e.light);
  }
}
