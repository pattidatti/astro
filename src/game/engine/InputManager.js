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
    }
  }

  _onPointerMove(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);

    // Walk up hierarchy to find planetId
    let planetId = null;
    if (hits.length > 0) {
      let current = hits[0].object;
      while (current) {
        if (current.userData?.planetId) {
          planetId = current.userData.planetId;
          break;
        }
        current = current.parent;
      }
    }

    if (planetId !== this._hoveredPlanet || planetId) {
      this._hoveredPlanet = planetId;
      for (const fn of this._onHoverCallbacks) {
        fn(planetId, e.clientX, e.clientY);
      }
    }
  }
}
