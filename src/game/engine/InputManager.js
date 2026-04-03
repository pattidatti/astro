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
    this._lastRaycastTime = 0;

    // RTS box-selection
    this._rtsDragging = false;
    this._rtsBoxStart = new THREE.Vector2(); // client px
    this._rtsBoxEnd   = new THREE.Vector2();
    this._playerFleetMeshes = [];
    this._onBoxSelectCallbacks = [];
    this._onWaypointCallbacks  = [];

    // Reusable objects for waypoint and frustum
    this._waypointPlane    = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this._waypointHit      = new THREE.Vector3();
    this._frustum          = new THREE.Frustum();
    this._frustumMatrix    = new THREE.Matrix4();
    this._ndcMin           = new THREE.Vector2();
    this._ndcMax           = new THREE.Vector2();

    // Click handler — only fire on pointerup if it wasn't a drag
    domElement.addEventListener('pointerdown', (e) => this._onPointerDown(e));
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

  // --- RTS helpers ---

  /** Provide the pool of player fleet meshes eligible for box-selection */
  setPlayerFleetMeshes(meshes) {
    this._playerFleetMeshes = meshes;
  }

  /** Register callback: fn(selectedMeshes[]) — called on box-select release */
  onBoxSelect(fn) {
    this._onBoxSelectCallbacks.push(fn);
  }

  /** Register callback: fn(THREE.Vector3) — called on RMB in RTS mode */
  onWaypoint(fn) {
    this._onWaypointCallbacks.push(fn);
  }

  _onPointerDown(e) {
    if (!this.cameraController.isRTSMode) return;
    if (e.button === 0) {
      this._rtsDragging = true;
      this._rtsBoxStart.set(e.clientX, e.clientY);
      this._rtsBoxEnd.set(e.clientX, e.clientY);
    }
  }


  _onPointerUp(e) {
    // RTS right-click: emit waypoint (only if it was a click, not a drag-rotation)
    if (this.cameraController.isRTSMode && e.button === 2 && this.cameraController.wasClick()) {
      const rect = this.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ndcY = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
      if (this.raycaster.ray.intersectPlane(this._waypointPlane, this._waypointHit)) {
        const wp = this._waypointHit.clone();
        for (const fn of this._onWaypointCallbacks) fn(wp);
      }
      return;
    }

    // RTS box-select release
    if (this.cameraController.isRTSMode && this._rtsDragging) {
      this._rtsDragging = false;
      if (this._boxSelectEl) this._boxSelectEl.style.display = 'none';

      const wasDrag = Math.hypot(
        this._rtsBoxEnd.x - this._rtsBoxStart.x,
        this._rtsBoxEnd.y - this._rtsBoxStart.y
      ) > 6;

      if (wasDrag) {
        this._doBoxSelect();
        return;
      }
    }

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
    // RTS box drag
    if (this.cameraController.isRTSMode && this._rtsDragging) {
      this._rtsBoxEnd.set(e.clientX, e.clientY);
      this._updateBoxSelectEl();
    }

    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Throttle raycasting to ~30fps — mousemove fires up to 200+ times/sec
    const now = performance.now();
    if (now - this._lastRaycastTime < 33) return;
    this._lastRaycastTime = now;

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
        if (hit.object.userData?.isInstancedFleet) {
          hoveredShipId = hit.object.userData.getShipId(hit.instanceId);
          if (hoveredShipId) break;
        } else if (hit.object.userData?.shipId) {
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

  // ─── RTS internals ────────────────────────────────────────────────────────

  /** Keep the #rts-select-box div in sync with the drag rectangle */
  _updateBoxSelectEl() {
    const el = this._boxSelectEl;
    if (!el) return;
    const x1 = Math.min(this._rtsBoxStart.x, this._rtsBoxEnd.x);
    const y1 = Math.min(this._rtsBoxStart.y, this._rtsBoxEnd.y);
    const x2 = Math.max(this._rtsBoxStart.x, this._rtsBoxEnd.x);
    const y2 = Math.max(this._rtsBoxStart.y, this._rtsBoxEnd.y);
    el.style.display = 'block';
    el.style.left   = x1 + 'px';
    el.style.top    = y1 + 'px';
    el.style.width  = (x2 - x1) + 'px';
    el.style.height = (y2 - y1) + 'px';
  }

  /**
   * Frustum-cull _playerFleetMeshes against the current drag rectangle.
   * Projects each mesh's world position to NDC and checks if it falls inside
   * the selection box. Simple and robust for galaxy-scale distances.
   */
  _doBoxSelect() {
    const rect = this.domElement.getBoundingClientRect();
    const toNDC = (cx, cy) => new THREE.Vector2(
      ((cx - rect.left) / rect.width)  * 2 - 1,
      -((cy - rect.top) / rect.height) * 2 + 1,
    );
    const ndcA = toNDC(this._rtsBoxStart.x, this._rtsBoxStart.y);
    const ndcB = toNDC(this._rtsBoxEnd.x,   this._rtsBoxEnd.y);
    const minX = Math.min(ndcA.x, ndcB.x);
    const maxX = Math.max(ndcA.x, ndcB.x);
    const minY = Math.min(ndcA.y, ndcB.y);
    const maxY = Math.max(ndcA.y, ndcB.y);

    const projected = new THREE.Vector3();
    const selected = [];
    for (const mesh of this._playerFleetMeshes) {
      mesh.getWorldPosition(projected);
      projected.project(this.camera);
      if (projected.x >= minX && projected.x <= maxX &&
          projected.y >= minY && projected.y <= maxY &&
          projected.z < 1.0) {
        selected.push(mesh);
      }
    }
    for (const fn of this._onBoxSelectCallbacks) fn(selected);
  }
}
