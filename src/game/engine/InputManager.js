import * as THREE from 'three';

export class InputManager {
  constructor(camera, scene, domElement, cameraController) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.cameraController = cameraController;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clickables = [];

    this._hoveredPlanet = null;
    this._onHoverCallbacks = [];
    this._hoveredStation = null;
    this._onHoverStationCallbacks = [];
    this._hoveredColonyShip = null;
    this._onHoverColonyShipCallbacks = [];
    this._hoveredShip = null;
    this._onHoverShipCallbacks = [];
    this._hoveredAnyMesh = null;
    this._onHoverAnyCallbacks = [];
    this._onMissedClickCallbacks = [];

    // Click handler — only fire on pointerup if it wasn't a drag
    domElement.addEventListener('pointerup', (e) => this._onPointerUp(e));
    domElement.addEventListener('pointermove', (e) => this._onPointerMove(e));
  }

  /** Register a mesh as clickable with a handler */
  addClickable(mesh, handler) {
    mesh.userData._clickHandler = handler;
    this.clickables.push(mesh);
  }

  removeClickable(mesh) {
    this.clickables = this.clickables.filter(m => m !== mesh);
    delete mesh.userData._clickHandler;
  }

  /** Register a hover callback: fn(planetId|null, clientX, clientY) */
  onHover(fn) {
    this._onHoverCallbacks.push(fn);
  }

  /** Register a station hover callback: fn(stationPlanetId|null, clientX, clientY) */
  onHoverStation(fn) {
    this._onHoverStationCallbacks.push(fn);
  }

  /** Register a colony ship hover callback: fn(fromPlanetId|null, clientX, clientY) */
  onHoverColonyShip(fn) {
    this._onHoverColonyShipCallbacks.push(fn);
  }

  /** Register a ship hover callback: fn(shipId|null, clientX, clientY) */
  onHoverShip(fn) {
    this._onHoverShipCallbacks.push(fn);
  }

  /** Register a generic hover callback: fn(mesh|null) */
  onHoverAny(fn) {
    this._onHoverAnyCallbacks.push(fn);
  }

  /** Register a callback fired when a click lands on nothing registered */
  onMissedClick(fn) {
    this._onMissedClickCallbacks.push(fn);
  }

  _onPointerUp(e) {
    if (!this.cameraController.wasClick()) return;
    if (e.button !== 0) return;

    // Convert to NDC
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);

    if (hits.length > 0) {
      const obj = hits[0].object;
      if (obj.userData._clickHandler) {
        obj.userData._clickHandler(hits[0]);
      }
    } else {
      for (const fn of this._onMissedClickCallbacks) fn();
    }
  }

  _onPointerMove(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);

    // Check for station hit first (station hitbox is inner — takes priority)
    let stationId = null;
    let planetId = null;
    for (const hit of hits) {
      if (hit.object.userData?.stationId && !stationId) {
        stationId = hit.object.userData.stationId;
      }
      if (!stationId) {
        let current = hit.object;
        while (current) {
          if (current.userData?.planetId) {
            planetId = current.userData.planetId;
            break;
          }
          current = current.parent;
        }
      }
      if (stationId) break;
    }

    // Colony ship hover (only if no station hovered)
    let colonyShipPlanetId = null;
    if (!stationId) {
      for (const hit of hits) {
        if (hit.object.userData?.isColonyShip) {
          colonyShipPlanetId = hit.object.userData.colonyShipPlanetId;
          break;
        }
      }
    }

    // Ship hover (cargo + colony-in-flight, only if no station hovered)
    let hoveredShipId = null;
    if (!stationId) {
      for (const hit of hits) {
        if (hit.object.userData?.shipId) {
          hoveredShipId = hit.object.userData.shipId;
          break;
        }
      }
    }

    // Station hover
    if (stationId !== this._hoveredStation) {
      this._hoveredStation = stationId;
      for (const fn of this._onHoverStationCallbacks) fn(stationId, e.clientX, e.clientY);
    }

    // Colony ship hover
    if (colonyShipPlanetId !== this._hoveredColonyShip) {
      this._hoveredColonyShip = colonyShipPlanetId;
      for (const fn of this._onHoverColonyShipCallbacks) fn(colonyShipPlanetId, e.clientX, e.clientY);
    }

    // Ship hover
    if (hoveredShipId !== this._hoveredShip) {
      this._hoveredShip = hoveredShipId;
      for (const fn of this._onHoverShipCallbacks) fn(hoveredShipId, e.clientX, e.clientY);
    }

    // Planet hover — suppress if hovering station, colony ship, or ship
    const effectivePlanetId = (stationId || colonyShipPlanetId || hoveredShipId) ? null : planetId;
    if (effectivePlanetId !== this._hoveredPlanet) {
      this._hoveredPlanet = effectivePlanetId;
      for (const fn of this._onHoverCallbacks) fn(effectivePlanetId, e.clientX, e.clientY);
    }

    // Generic hover — any clickable mesh
    const anyMesh = hits.length > 0 ? hits[0].object : null;
    if (anyMesh !== this._hoveredAnyMesh) {
      this._hoveredAnyMesh = anyMesh;
      for (const fn of this._onHoverAnyCallbacks) fn(anyMesh);
    }
  }
}
