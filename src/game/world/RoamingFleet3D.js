import * as THREE from 'three';
import { EnemyShip3D } from '../objects/EnemyShip3D.js';

const _dir = new THREE.Vector3();
const _up  = new THREE.Vector3(0, 1, 0);
const _mid = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _toLine = new THREE.Vector3();

/** Colors per enemy type. */
const TYPE_COLOR = {
  interceptor: 0xff2222,
  bomber:      0xff6600,
  raider:      0xee1166,
  mothership:  0xff0044,
};

/** Scale multiplier for the mothership hull. */
const MOTHERSHIP_SCALE = 2.2;

/** Scale multiplier for EnemyShip3D in fleet formation. */
const FLEET_SHIP_SCALE = 12;

/**
 * RoamingFleet3D — renders a roaming fleet as a 3D ship formation.
 *
 * Ships are arranged in a V-formation facing the direction of travel.
 * The whole group is pooled via RoamingFleetManager3D.
 */
export class RoamingFleet3D {
  constructor(scene) {
    this._scene = scene;
    this.group  = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    this._fleetId    = null;
    this._shipMeshes = [];       // { bodyGroup, hpBack, hpFill, enemyId }
    this._msGroup    = null;     // mothership sub-group (invasion only)
    this._msMesh     = null;     // mothership body mesh
    this._msHpBack   = null;
    this._msHpFill   = null;

    this._worldPos = new THREE.Vector3();
    this._avoidPlanets = [];     // Array of nearby planet positions

    // Invisible click sphere — registered with InputManager
    const hitGeo = new THREE.SphereGeometry(9, 8, 6);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this._clickSphere = new THREE.Mesh(hitGeo, hitMat);
    this.group.add(this._clickSphere);
  }

  get fleetId()      { return this._fleetId; }
  get worldPosition(){ return this._worldPos; }
  get clickMesh()    { return this._clickSphere; }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  activate(fleet, fromPos, toPos) {
    this._fleetId = fleet.id;
    this._clearChildren();

    if (fleet.type === 'invasion' && fleet.mothership) {
      this._buildMothership(fleet.mothership);
    }

    const offsets = this._formationOffsets(fleet);
    for (let i = 0; i < fleet.enemies.length; i++) {
      this._buildFighter(fleet.enemies[i], offsets[i] ?? new THREE.Vector3(i * 5, 0, 0));
    }

    this._updateTransform(fromPos, toPos, fleet.position);
    this.group.visible = true;
  }

  deactivate() {
    this.group.visible = false;
    this._clearChildren();
    this._fleetId = null;
  }

  // ─── Per-frame ────────────────────────────────────────────────────────────

  update(fromPos, toPos, fleet, avoidPositions = []) {
    if (!fromPos || !toPos) return;
    this._avoidPlanets = avoidPositions;
    this._updateTransform(fromPos, toPos, fleet.position);
    this._updateHpBars(fleet);
  }

  // ─── HP bars ──────────────────────────────────────────────────────────────

  _updateHpBars(fleet) {
    // Fighter HP bars
    for (const sm of this._shipMeshes) {
      const enemy = fleet.enemies.find(e => e.id === sm.enemyId);
      if (!enemy) continue;
      const pct = Math.max(0, enemy.hp / enemy.maxHP);
      sm.hpFill.scale.x = pct;
      sm.hpFill.position.x = (pct - 1) * 0.5; // anchor left
      const col = pct > 0.5 ? 0x44ff44 : pct > 0.25 ? 0xffcc00 : 0xff2222;
      sm.hpFill.material.color.setHex(col);
      sm.bodyGroup.visible = enemy.hp > 0;
    }

    // Mothership HP bar
    if (this._msMesh && fleet.mothership) {
      const ms = fleet.mothership;
      const pct = Math.max(0, ms.hp / ms.maxHP);
      this._msHpFill.scale.x = pct;
      this._msHpFill.position.x = (pct - 1) * 0.5;
      const col = pct > 0.5 ? 0x44ff44 : pct > 0.25 ? 0xffcc00 : 0xff2222;
      this._msHpFill.material.color.setHex(col);
      this._msGroup.visible = ms.hp > 0;
    }
  }

  // ─── Internal builders ───────────────────────────────────────────────────

  _buildFighter(enemy, localOffset) {
    const color = TYPE_COLOR[enemy.type] ?? 0xff3333;

    // Create EnemyShip3D instance
    const ship = new EnemyShip3D();
    ship.setType(enemy.type, color);

    // EnemyShip3D is modeled at ~0.3 units scale. Scale up for fleet formation.
    ship.group.scale.setScalar(FLEET_SHIP_SCALE);
    ship.group.position.copy(localOffset);
    ship.group.visible = true;

    // Hide the built-in HP bars from EnemyShip3D (we use external bars)
    ship._hpBg.visible = false;
    ship._hpFg.visible = false;

    // HP bar — background (grey) + fill (green→red), external to the ship group
    const { hpBack, hpFill } = this._makeHpBar(3.0, localOffset.y + 2.5);
    this.group.add(hpBack);
    this.group.add(hpFill);

    this.group.add(ship.group);
    this._shipMeshes.push({ bodyGroup: ship.group, hpBack, hpFill, enemyId: enemy.id, ship });
  }

  _buildMothership(msData) {
    const color = 0xff0044;
    this._msGroup = new THREE.Group();

    // Wedge hull via extruded shape
    const shape = new THREE.Shape();
    shape.moveTo(0,  4.0);   // nose
    shape.lineTo(-3.5, -3.0);
    shape.lineTo( 3.5, -3.0);
    shape.closePath();

    const extSettings = { depth: 1.6, bevelEnabled: false };
    const hullGeo = new THREE.ExtrudeGeometry(shape, extSettings);
    hullGeo.rotateX(-Math.PI / 2);
    hullGeo.rotateY(Math.PI);
    hullGeo.translate(0, 0, 0.8);
    const hullMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 });
    this._msMesh = new THREE.Mesh(hullGeo, hullMat);
    this._msMesh.scale.setScalar(MOTHERSHIP_SCALE);
    this._msGroup.add(this._msMesh);

    // Engine glows
    for (const xOff of [-1.2, 0, 1.2]) {
      const light = new THREE.PointLight(color, 1.5, 14);
      light.position.set(xOff * MOTHERSHIP_SCALE, 0, -3 * MOTHERSHIP_SCALE);
      this._msGroup.add(light);
    }

    // HP bar
    const { hpBack, hpFill } = this._makeHpBar(5.0, 7.5);
    this._msGroup.add(hpBack);
    this._msGroup.add(hpFill);
    this._msHpBack = hpBack;
    this._msHpFill = hpFill;

    this.group.add(this._msGroup);
  }

  _makeHpBar(width, yPos) {
    const backGeo = new THREE.PlaneGeometry(width, 0.4);
    const backMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.7 });
    const hpBack = new THREE.Mesh(backGeo, backMat);
    hpBack.position.y = yPos;

    const fillGeo = new THREE.PlaneGeometry(width, 0.4);
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x44ff44, transparent: true, opacity: 0.9 });
    const hpFill = new THREE.Mesh(fillGeo, fillMat);
    hpFill.position.y = yPos;
    hpFill.position.z = 0.01; // above back

    return { hpBack, hpFill };
  }

  _formationOffsets(fleet) {
    const count     = fleet.enemies.length;
    const isInvasion = fleet.type === 'invasion';
    const rearZ     = isInvasion ? -10 : -4;

    switch (count) {
      case 1: return [new THREE.Vector3(0,  0, rearZ)];
      case 2: return [
        new THREE.Vector3(-3.5, 0, rearZ),
        new THREE.Vector3( 3.5, 0, rearZ),
      ];
      case 3: return [
        new THREE.Vector3(-5,   0, rearZ - 2),
        new THREE.Vector3( 0,   0, rearZ),
        new THREE.Vector3( 5,   0, rearZ - 2),
      ];
      default: return [
        new THREE.Vector3(-6,   0, rearZ - 3),
        new THREE.Vector3(-2,   0, rearZ),
        new THREE.Vector3( 2,   0, rearZ),
        new THREE.Vector3( 6,   0, rearZ - 3),
      ];
    }
  }

  // ─── Bezier path avoidance ────────────────────────────────────────────────

  /**
   * Compute position along a possibly-curved path that arcs around nearby planets.
   * Uses quadratic bezier if a planet is close to the straight-line path.
   */
  _computeBezierPoint(fromPos, toPos, t) {
    const AVOID_RADIUS = 15;
    let bestPlanet = null;
    let bestDist = Infinity;
    let bestClosestT = 0;

    for (const pPos of this._avoidPlanets) {
      // Project pPos onto segment fromPos → toPos
      _dir.subVectors(toPos, fromPos);
      const lenSq = _dir.lengthSq();
      if (lenSq < 0.001) continue;

      _toLine.subVectors(pPos, fromPos);
      const segT = Math.max(0, Math.min(1, _toLine.dot(_dir) / lenSq));
      const closest = _dir.clone().multiplyScalar(segT).add(fromPos);
      const dist = pPos.distanceTo(closest);

      if (dist < AVOID_RADIUS && dist < bestDist) {
        bestDist = dist;
        bestPlanet = pPos;
        bestClosestT = segT;
      }
    }

    if (!bestPlanet) {
      // Straight line — no avoidance needed
      return new THREE.Vector3().lerpVectors(fromPos, toPos, t);
    }

    // Compute control point at the midpoint, pushed perpendicular away from planet
    _mid.lerpVectors(fromPos, toPos, 0.5);
    const closestOnLine = new THREE.Vector3().lerpVectors(fromPos, toPos, bestClosestT);
    _perp.subVectors(closestOnLine, bestPlanet).normalize(); // direction away from planet
    const pushDist = (AVOID_RADIUS - bestDist) + 8;
    const ctrl = _mid.clone().addScaledVector(_perp, pushDist);

    // Quadratic bezier: B(t) = (1-t)² A + 2(1-t)t ctrl + t² B
    const s = 1 - t;
    return new THREE.Vector3(
      s * s * fromPos.x + 2 * s * t * ctrl.x + t * t * toPos.x,
      s * s * fromPos.y + 2 * s * t * ctrl.y + t * t * toPos.y,
      s * s * fromPos.z + 2 * s * t * ctrl.z + t * t * toPos.z,
    );
  }

  // ─── Transform ────────────────────────────────────────────────────────────

  _updateTransform(fromPos, toPos, t) {
    const curPos = this._computeBezierPoint(fromPos, toPos, t);
    curPos.y += 4;  // float above lane/path
    this._worldPos.copy(curPos);
    this.group.position.copy(this._worldPos);

    // Direction: use bezier tangent (evaluate at t and t+epsilon)
    const eps = Math.min(0.02, 1 - t);
    const ahead = this._computeBezierPoint(fromPos, toPos, Math.min(1, t + eps));
    _dir.subVectors(ahead, curPos);
    if (_dir.lengthSq() > 0.001) {
      _dir.normalize();
      const angle = Math.atan2(_dir.x, _dir.z);
      this.group.rotation.y = angle;
    }
  }

  _clearChildren() {
    for (const sm of this._shipMeshes) {
      this.group.remove(sm.bodyGroup);
      // If it's an EnemyShip3D wrapper, dispose it properly
      if (sm.ship) {
        sm.ship.dispose?.();
        sm.bodyGroup.traverse(c => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      } else {
        sm.bodyGroup.traverse(c => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      }
      // Remove HP bar planes from group
      this.group.remove(sm.hpBack);
      this.group.remove(sm.hpFill);
      sm.hpBack.geometry.dispose();
      sm.hpBack.material.dispose();
      sm.hpFill.geometry.dispose();
      sm.hpFill.material.dispose();
    }
    this._shipMeshes = [];

    if (this._msGroup) {
      this.group.remove(this._msGroup);
      this._msGroup.traverse(c => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      this._msGroup = null;
      this._msMesh  = null;
      this._msHpBack = null;
      this._msHpFill = null;
    }
  }

  dispose() {
    this._clearChildren();
    this._clickSphere.geometry.dispose();
    this._clickSphere.material.dispose();
    this._scene.remove(this.group);
  }
}
