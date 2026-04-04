import * as THREE from 'three';
import { EnemyShip3D } from '../objects/EnemyShip3D.js';

/**
 * PlayerFleet3D — 3D visual for one player fleet.
 *
 * Pattern mirrors RoamingFleet3D. Each ship in the fleet is rendered as a
 * gold-tinted EnemyShip3D instance at fleet.position + ship.localPos.
 *
 * In RTS mode: shows a yellow wireframe bounding box + dashed waypoint line.
 * Provides a click sphere for InputManager selection.
 */

// Gold/amber palette for player ships (friendly fire = gold, not red)
const PLAYER_SHIP_COLOR = {
  fighter:    0xd4a843,  // main gold
  bomber:     0xe87020,  // orange-gold
  carrier:    0x44ccdd,  // teal (support)
  battleship: 0xc0c8e0,  // silver-blue
  titan:      0xaa5533,  // burnt orange (imposing)
};

// Map player ship type → EnemyShip3D geometry type
const SHIP_GEOM = {
  fighter:    'interceptor',
  bomber:     'bomber',
  carrier:    'raider',
  battleship: 'interceptor',
  titan:      'raider',
};

// Visual scale for each ship type (EnemyShip3D base is ~0.3 units)
const SHIP_SCALE = {
  fighter:    10,
  bomber:     13,
  carrier:    18,
  battleship: 16,
  titan:      25,
};

export class PlayerFleet3D {
  constructor(scene) {
    this._scene = scene;

    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    this._fleetId = null;
    this._ships   = []; // [{ group: THREE.Group, ship: EnemyShip3D }]

    this._worldPos = new THREE.Vector3();

    // Invisible click/selection sphere
    const hitGeo = new THREE.SphereGeometry(10, 8, 6);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this._clickSphere = new THREE.Mesh(hitGeo, hitMat);
    this.group.add(this._clickSphere);

    // Yellow RTS wireframe bounding box (shows only in RTS mode)
    this._rtsBBox = this._makeBBox();
    this.group.add(this._rtsBBox);

    // Waypoint line + ring — added to scene (world-space), not to the group
    this._wpLine    = null;  // THREE.Line (dashed, world space)
    this._wpMarker  = null;  // THREE.Mesh ring at destination
    this._buildWaypointVisuals();
  }

  get fleetId()       { return this._fleetId; }
  get worldPosition() { return this._worldPos; }
  get clickMesh()     { return this._clickSphere; }
  get selectMesh()    { return this._clickSphere; }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  activate(fleet) {
    this._fleetId = fleet.id;
    this._clearShips();
    this._clickSphere.userData.playerFleetId = fleet.id;

    // Scatter ships in initial formation around fleet center
    this._initShipPositions(fleet.ships);

    for (const ship of fleet.ships) {
      this._buildShipMesh(ship);
    }

    this.group.visible = true;
  }

  deactivate() {
    this._clearShips();
    this.group.visible = false;
    if (this._wpLine)   this._wpLine.visible   = false;
    if (this._wpMarker) this._wpMarker.visible  = false;
    this._fleetId = null;
  }

  // ─── Per-frame ────────────────────────────────────────────────────────────

  update(fleet, isRTSMode) {
    if (!fleet) return;

    // Move group to fleet center
    this.group.position.set(fleet.position.x, fleet.position.y || 0, fleet.position.z);
    this.group.getWorldPosition(this._worldPos);

    // Keep click sphere tagged
    this._clickSphere.userData.playerFleetId = fleet.id;

    // Update individual ship positions from Boids localPos
    for (let i = 0; i < this._ships.length && i < fleet.ships.length; i++) {
      const sm   = this._ships[i];
      const ship = fleet.ships[i];
      if (!ship.localPos) ship.localPos = { x: 0, y: 0, z: 0 };
      sm.group.position.set(ship.localPos.x, 0, ship.localPos.z);
    }

    // RTS bounding box
    this._rtsBBox.visible = isRTSMode;

    // Waypoint visuals
    const hasWaypoint = fleet.state === 'moving' && !!fleet.waypoint;
    const showWp = hasWaypoint && isRTSMode;

    if (this._wpLine) {
      this._wpLine.visible = showWp;
      if (showWp) {
        const pos = this._wpLine.geometry.attributes.position.array;
        pos[0] = fleet.position.x; pos[1] = 1.5; pos[2] = fleet.position.z;
        pos[3] = fleet.waypoint.x; pos[4] = 1.5; pos[5] = fleet.waypoint.z;
        this._wpLine.geometry.attributes.position.needsUpdate = true;
        this._wpLine.computeLineDistances();
      }
    }
    if (this._wpMarker) {
      this._wpMarker.visible = showWp;
      if (showWp) {
        this._wpMarker.position.set(fleet.waypoint.x, 1, fleet.waypoint.z);
      }
    }
  }

  /** Called when a new ship is added to the fleet mid-game */
  addShip(ship) {
    if (!ship.localPos) {
      // Scatter new ship near others
      const angle = Math.random() * Math.PI * 2;
      const r     = 4 + Math.random() * 6;
      ship.localPos = { x: Math.cos(angle) * r, y: 0, z: Math.sin(angle) * r };
    }
    this._buildShipMesh(ship);
  }

  // ─── Internal builders ───────────────────────────────────────────────────

  _buildShipMesh(ship) {
    const geom  = SHIP_GEOM[ship.type]          ?? 'interceptor';
    const color = PLAYER_SHIP_COLOR[ship.type]   ?? 0xd4a843;
    const scale = SHIP_SCALE[ship.type]          ?? 10;

    const enemyShip = new EnemyShip3D();
    enemyShip.setType(geom, color);
    enemyShip.group.scale.setScalar(scale);
    enemyShip.group.visible = true;

    // Hide EnemyShip3D's built-in HP bars (fleet displays them differently)
    if (enemyShip._hpBg) enemyShip._hpBg.visible = false;
    if (enemyShip._hpFg) enemyShip._hpFg.visible = false;

    const lp = ship.localPos ?? { x: 0, y: 0, z: 0 };
    enemyShip.group.position.set(lp.x, 0, lp.z);

    this.group.add(enemyShip.group);
    this._ships.push({ group: enemyShip.group, ship: enemyShip });
  }

  _makeBBox() {
    const geo = new THREE.BoxGeometry(22, 10, 22);
    const mat = new THREE.MeshBasicMaterial({
      color:       0xffee00,
      wireframe:   true,
      transparent: true,
      opacity:     0.45,
      depthWrite:  false,
    });
    const box = new THREE.Mesh(geo, mat);
    box.visible = false;
    return box;
  }

  _buildWaypointVisuals() {
    // Dashed line from fleet center to waypoint (world-space)
    const pts = new Float32Array([0, 1.5, 0,  0, 1.5, 0]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const mat = new THREE.LineDashedMaterial({
      color:       0xffee00,
      dashSize:    5,
      gapSize:     3,
      linewidth:   1,
      transparent: true,
      opacity:     0.75,
      depthWrite:  false,
    });
    this._wpLine = new THREE.Line(geo, mat);
    this._wpLine.computeLineDistances();
    this._wpLine.visible = false;
    this._scene.add(this._wpLine);

    // Ring marker at waypoint destination
    const rGeo = new THREE.RingGeometry(2.8, 3.8, 20);
    const rMat = new THREE.MeshBasicMaterial({
      color:       0xffee00,
      side:        THREE.DoubleSide,
      transparent: true,
      opacity:     0.8,
      depthWrite:  false,
    });
    this._wpMarker = new THREE.Mesh(rGeo, rMat);
    this._wpMarker.rotation.x = -Math.PI / 2; // flat on Y=0 plane
    this._wpMarker.visible    = false;
    this._scene.add(this._wpMarker);
  }

  /** Scatter ships in a loose V-formation around the fleet center on first spawn */
  _initShipPositions(ships) {
    const count = ships.length;
    for (let i = 0; i < count; i++) {
      if (ships[i].localPos && (ships[i].localPos.x !== 0 || ships[i].localPos.z !== 0)) continue;
      const angle = (i / Math.max(count, 1)) * Math.PI * 2 + Math.PI;
      const r     = 4 + (i % 3) * 3;
      ships[i].localPos = {
        x: Math.cos(angle) * r,
        y: 0,
        z: Math.sin(angle) * r,
      };
    }
  }

  _clearShips() {
    for (const sm of this._ships) {
      this.group.remove(sm.group);
      sm.ship?.dispose?.();
      sm.group.traverse(c => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
          else c.material.dispose();
        }
      });
    }
    this._ships = [];
  }

  dispose() {
    this._clearShips();
    this._clickSphere.geometry.dispose();
    this._clickSphere.material.dispose();
    this._rtsBBox.geometry.dispose();
    this._rtsBBox.material.dispose();
    if (this._wpLine) {
      this._scene.remove(this._wpLine);
      this._wpLine.geometry.dispose();
      this._wpLine.material.dispose();
    }
    if (this._wpMarker) {
      this._scene.remove(this._wpMarker);
      this._wpMarker.geometry.dispose();
      this._wpMarker.material.dispose();
    }
    this._scene.remove(this.group);
  }
}
