import * as THREE from 'three';

const TRAIL_LENGTH = 16;

const RESOURCE_ENGINE_COLORS = {
  ore:     new THREE.Color(0xd4a843),  // warm amber/gold
  energy:  new THREE.Color(0x4af0ff),  // cyan
  crystal: new THREE.Color(0xaa44ee),  // purple
};

const RESOURCE_CARGO_COLORS = {
  ore:     new THREE.Color(0xd4a843),
  energy:  new THREE.Color(0x4af0ff),
  crystal: new THREE.Color(0xaa44ee),
};

/**
 * A 3D cargo ship that travels between planets on a resource route.
 * Heavy Freighter design adhering to the "Golden Nebula" aesthetic.
 */
export class Ship3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._fromPos    = new THREE.Vector3();
    this._toPos      = new THREE.Vector3();
    this._currentPos = new THREE.Vector3();
    this._resource   = 'ore';

    this._buildMesh();
    this._createTrail();
    this._createEngineGlow();
    
    // Scale 1.25 gives a visible footprint about half the size of the old model
    this.group.scale.setScalar(1.25);
  }

  _buildMesh() {
    const hullMatDark = new THREE.MeshStandardMaterial({
      color:             0x0a0e14, // Obsidian
      metalness:         0.85,
      roughness:         0.4,
      emissive:          0x000000 
    });
    const hullMatGrey = new THREE.MeshStandardMaterial({
      color:             0x1c2430, // Graphite
      metalness:         0.8,
      roughness:         0.5
    });
    const trimMatGold = new THREE.MeshStandardMaterial({
      color:             0xd4a843, // Gold
      metalness:         0.9,
      roughness:         0.2,
      emissive:          0xd4a843,
      emissiveIntensity: 0.2
    });
    const detailMat = new THREE.MeshStandardMaterial({
      color:             0xe8d5b0, // Sand
      metalness:         0.4,
      roughness:         0.7
    });

    // ── Main Spine ──
    const spineGeo = new THREE.BoxGeometry(0.8, 0.4, 3.8);
    this._fuselage = new THREE.Mesh(spineGeo, hullMatDark);
    this.group.add(this._fuselage);

    // ── Command Bridge (Front, elevated, blocky) ──
    const bridgeGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    this._bridge = new THREE.Mesh(bridgeGeo, hullMatGrey);
    this._bridge.position.set(0, 0.4, 1.4);
    this.group.add(this._bridge);

    const bridgeWindowGeo = new THREE.BoxGeometry(1.25, 0.2, 0.4);
    const windowMat = new THREE.MeshStandardMaterial({
      color:             0x111111,
      metalness:         0.9,
      roughness:         0.1,
      emissive:          0xd4a843,
      emissiveIntensity: 1.0
    });
    this._bridgeWindow = new THREE.Mesh(bridgeWindowGeo, windowMat);
    this._bridgeWindow.position.set(0, 0.5, 1.62);
    this.group.add(this._bridgeWindow);

    // ── Cargo Pods (Sides, 6 pods total) ──
    this._cargoMat = new THREE.MeshStandardMaterial({
      color:     RESOURCE_CARGO_COLORS.ore,
      metalness: 0.6,
      roughness: 0.3,
      emissive:  RESOURCE_CARGO_COLORS.ore.clone().multiplyScalar(0.4)
    });
    
    this._cargoPods = [];
    const podGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 6);
    podGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    
    for (let i = 0; i < 3; i++) {
        const zPos = 0.2 - i * 0.9;
        
        const podL = new THREE.Mesh(podGeo, this._cargoMat);
        podL.position.set(-0.6, 0, zPos);
        this.group.add(podL);
        this._cargoPods.push(podL);

        const podR = new THREE.Mesh(podGeo, this._cargoMat);
        podR.position.set(0.6, 0, zPos);
        this.group.add(podR);
        this._cargoPods.push(podR);

        // Gold clamps holding pods
        const clampGeo = new THREE.BoxGeometry(0.1, 0.55, 0.85);
        const clampL = new THREE.Mesh(clampGeo, trimMatGold);
        clampL.position.set(-0.35, 0, zPos);
        this.group.add(clampL);

        const clampR = new THREE.Mesh(clampGeo, trimMatGold);
        clampR.position.set(0.35, 0, zPos);
        this.group.add(clampR);
    }

    // ── Massive Engine Block (Rear) ──
    const engineBlockGeo = new THREE.BoxGeometry(1.6, 0.8, 1.0);
    this._engineBlock = new THREE.Mesh(engineBlockGeo, hullMatGrey);
    this._engineBlock.position.set(0, 0, -1.8);
    this.group.add(this._engineBlock);

    // ── Side Thrusters / Nacelles ──
    const nacelleGeo = new THREE.BoxGeometry(0.5, 0.5, 1.4);
    
    this._nacelleL = new THREE.Mesh(nacelleGeo, hullMatDark);
    this._nacelleL.position.set(-1.1, 0, -1.6);
    this.group.add(this._nacelleL);

    this._nacelleR = new THREE.Mesh(nacelleGeo, hullMatDark);
    this._nacelleR.position.set(1.1, 0, -1.6);
    this.group.add(this._nacelleR);

    // ── Trim / Plating details ──
    const plateGeo = new THREE.BoxGeometry(1.65, 0.05, 0.8);
    const plateTop = new THREE.Mesh(plateGeo, trimMatGold);
    plateTop.position.set(0, 0.42, -1.8);
    this.group.add(plateTop);

    // ── Pipes / Antenna (Cool factor) ──
    const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 4);
    pipeGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    
    this._pipeL = new THREE.Mesh(pipeGeo, detailMat);
    this._pipeL.position.set(-0.3, 0.25, -0.2);
    this.group.add(this._pipeL);

    this._pipeR = new THREE.Mesh(pipeGeo, detailMat);
    this._pipeR.position.set(0.3, 0.25, -0.2);
    this.group.add(this._pipeR);

    // Store a reference to the main part of the ship for hitboxes
    this._hitboxTarget = this._fuselage; // Fallback reference for InputManager
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color:       RESOURCE_ENGINE_COLORS.ore,
      transparent: true,
      opacity:     0.6,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    this._trail = new THREE.Line(this._trailGeo, this._trailMat);
    this._trailPositions = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3());
    this.group.add(this._trail);
  }

  _createEngineGlow() {
    const glowMat = new THREE.MeshBasicMaterial({
      color:       RESOURCE_ENGINE_COLORS.ore,
      transparent: true,
      opacity:     0.85,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    const glowGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
    glowGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    this._engineLights = [];
    this._engineGlows = [];

    // 4 Thrusters: Left outer, left inner, right inner, right outer
    const engineXPositions = [-1.1, -0.4, 0.4, 1.1];
    
    for (const x of engineXPositions) {
        const plight = new THREE.PointLight(RESOURCE_ENGINE_COLORS.ore, 1.0, 5);
        plight.position.set(x, 0, -2.5);
        this.group.add(plight);
        this._engineLights.push(plight);

        const glowMesh = new THREE.Mesh(glowGeo, glowMat.clone());
        glowMesh.position.set(x, 0, -2.4);
        this.group.add(glowMesh);
        this._engineGlows.push(glowMesh);
    }
  }

  _applyResourceColors(resource) {
    this._resource = resource || 'ore';
    const engColor   = RESOURCE_ENGINE_COLORS[this._resource] ?? RESOURCE_ENGINE_COLORS.ore;
    const cargoColor = RESOURCE_CARGO_COLORS[this._resource]  ?? RESOURCE_CARGO_COLORS.ore;

    this._trailMat.color.copy(engColor);
    
    for (const light of this._engineLights) light.color.copy(engColor);
    for (const glow of this._engineGlows) glow.material.color.copy(engColor);

    this._cargoMat.color.copy(cargoColor);
    this._cargoMat.emissive.copy(cargoColor).multiplyScalar(0.4);
  }

  /**
   * Activate this ship for a route leg.
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   * @param {string} [resource]
   */
  activate(fromPos, toPos, resource) {
    this._fromPos.copy(fromPos);
    this._toPos.copy(toPos);
    this._applyResourceColors(resource);
    this.group.visible = true;
    for (const v of this._trailPositions) v.copy(fromPos);
    this.update(0, fromPos, toPos);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update ship position along the route.
   * @param {number} t         - Progress 0..1
   * @param {THREE.Vector3} fromPos
   * @param {THREE.Vector3} toPos
   */
  update(t, fromPos, toPos) {
    this._currentPos.lerpVectors(fromPos, toPos, t);
    const arcHeight = fromPos.distanceTo(toPos) * 0.10;
    this._currentPos.y += Math.sin(t * Math.PI) * arcHeight;

    this.group.position.copy(this._currentPos);

    // Face direction of travel
    const tangent = new THREE.Vector3().subVectors(toPos, fromPos);
    tangent.y += Math.cos(t * Math.PI) * arcHeight * 2;
    if (tangent.lengthSq() > 0.0001) {
      tangent.normalize();
      this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // Pulse engine glow intensity slightly
    const pulse = 0.9 + Math.sin(t * Math.PI * 40) * 0.1;
    for (const light of this._engineLights) light.intensity = 1.0 * pulse;

    // Shift trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this._trailPositions[i].copy(this._trailPositions[i - 1]);
    }
    this._trailPositions[0].copy(this._currentPos);

    const positions = this._trailGeo.attributes.position.array;
    const invScale = 1 / this.group.scale.x;
    const inv = new THREE.Quaternion().copy(this.group.quaternion).invert();
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const local = this._trailPositions[i].clone().sub(this._currentPos);
      local.applyQuaternion(inv);
      positions[i * 3]     = local.x * invScale;
      positions[i * 3 + 1] = local.y * invScale;
      positions[i * 3 + 2] = local.z * invScale;
    }
    this._trailGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._trailGeo.dispose();
    this._trailMat.dispose();
  }
}
