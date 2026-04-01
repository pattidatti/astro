import * as THREE from 'three';
import { gameState } from '../GameState.js';

export class InputManager {
  constructor(camera, scene, domElement, cameraController) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.cameraController = cameraController;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clickables = [];

    // Click handler — only fire on pointerup if it wasn't a drag
    domElement.addEventListener('pointerup', (e) => this._onPointerUp(e));
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
}
