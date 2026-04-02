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
 * Heavy Freighter V2: Extreme Procedural Detail
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
    
    // Scale 1.25 gives a visible footprint about half the size of the original Ship3D model
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
    
    // Running lights
    const navRedMat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
    const navGreenMat = new THREE.MeshBasicMaterial({ color: 0x11ff11 });
    const navWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this._cargoMat = new THREE.MeshStandardMaterial({
      color:     RESOURCE_CARGO_COLORS.ore,
      metalness: 0.6,
      roughness: 0.3,
      emissive:  RESOURCE_CARGO_COLORS.ore.clone().multiplyScalar(0.4)
    });
    const podCapMat = new THREE.MeshStandardMaterial({
      color:     0x06080a, 
      metalness: 0.9, 
      roughness: 0.2
    });

    // ── Main Spine ──
    const spineGeo = new THREE.BoxGeometry(0.8, 0.4, 3.8);
    this._fuselage = new THREE.Mesh(spineGeo, hullMatDark);
    this.group.add(this._fuselage);

    // Greebles on spine (Procedural details)
    const greebleGeo = new THREE.BoxGeometry(0.1, 0.08, 0.15);
    for(let i=0; i<14; i++) {
        // Pseudo-random but deterministic placement
        const px = (Math.sin(i * 3.4) * 0.3);
        const pz = -1.5 + (i * 0.22);
        const mesh = new THREE.Mesh(greebleGeo, hullMatGrey);
        mesh.position.set(px, 0.22, pz);
        mesh.rotation.y = (i % 2 === 0) ? 0 : 0.2;
        this.group.add(mesh);
    }

    // ── Command Bridge (Front, elevated, blocky) ──
    const bridgeGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    this._bridge = new THREE.Mesh(bridgeGeo, hullMatGrey);
    this._bridge.position.set(0, 0.4, 1.4);
    this.group.add(this._bridge);

    const bridgeWindowGeo = new THREE.BoxGeometry(1.25, 0.15, 0.4);
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

    // Asymmetric Radar / Comm Mast (Left side only)
    const mastGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 6);
    const mast = new THREE.Mesh(mastGeo, detailMat);
    mast.position.set(-0.5, 0.9, 1.3);
    mast.rotation.z = -0.2;
    mast.rotation.x = 0.2;
    this.group.add(mast);

    const dishGeo = new THREE.CylinderGeometry(0.2, 0.05, 0.05, 8);
    dishGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const dish = new THREE.Mesh(dishGeo, trimMatGold);
    dish.position.set(-0.6, 1.2, 1.25);
    dish.rotation.y = 0.5;
    dish.rotation.x = -0.3;
    this.group.add(dish);

    // ── Cargo Pods (Sides, 8 pods total) ──
    this._cargoPods = [];
    const podGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 8);
    podGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 8);
    capGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    const strapGeo = new THREE.TorusGeometry(0.23, 0.03, 4, 8);
    strapGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    
    for (let i = 0; i < 4; i++) {
        const zPos = 0.4 - i * 0.75; 
        
        // Left pod
        const podL = new THREE.Mesh(podGeo, this._cargoMat);
        podL.position.set(-0.65, 0, zPos);
        this.group.add(podL);
        this._cargoPods.push(podL);
        
        // Left caps & straps
        const capL1 = new THREE.Mesh(capGeo, podCapMat);
        capL1.position.set(-0.35, 0, zPos);
        this.group.add(capL1);
        const capL2 = new THREE.Mesh(capGeo, podCapMat);
        capL2.position.set(-0.95, 0, zPos);
        this.group.add(capL2);
        
        const strapL = new THREE.Mesh(strapGeo, trimMatGold);
        strapL.position.set(-0.65, 0, zPos);
        this.group.add(strapL);

        // Right pod
        const podR = new THREE.Mesh(podGeo, this._cargoMat);
        podR.position.set(0.65, 0, zPos);
        this.group.add(podR);
        this._cargoPods.push(podR);

        // Right caps & straps
        const capR1 = new THREE.Mesh(capGeo, podCapMat);
        capR1.position.set(0.35, 0, zPos);
        this.group.add(capR1);
        const capR2 = new THREE.Mesh(capGeo, podCapMat);
        capR2.position.set(0.95, 0, zPos);
        this.group.add(capR2);

        const strapR = new THREE.Mesh(strapGeo, trimMatGold);
        strapR.position.set(0.65, 0, zPos);
        this.group.add(strapR);

        // Mount arms (connecting pod to spine)
        const mountGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);
        const mountL = new THREE.Mesh(mountGeo, hullMatGrey);
        mountL.position.set(-0.4, 0, zPos);
        this.group.add(mountL);
        const mountR = new THREE.Mesh(mountGeo, hullMatGrey);
        mountR.position.set(0.4, 0, zPos);
        this.group.add(mountR);
    }

    // ── Massive Engine Block & Cooling Ribs ──
    const engineBlockGeo = new THREE.BoxGeometry(1.4, 0.8, 1.0);
    this._engineBlock = new THREE.Mesh(engineBlockGeo, hullMatGrey);
    this._engineBlock.position.set(0, 0, -2.0);
    this.group.add(this._engineBlock);

    // Cooling ribs on the engine block top
    const ribGeo = new THREE.BoxGeometry(1.2, 0.1, 0.05);
    for(let r=0; r<10; r++) {
        const rib = new THREE.Mesh(ribGeo, hullMatDark);
        rib.position.set(0, 0.45, -1.6 - (r * 0.08));
        this.group.add(rib);
    }

    // Heavy angled struts holding the side nacelles
    const strutGeo = new THREE.BoxGeometry(0.8, 0.2, 0.3);
    const strutL = new THREE.Mesh(strutGeo, hullMatGrey);
    strutL.position.set(-0.9, 0, -1.7);
    strutL.rotation.y = -0.4;
    this.group.add(strutL);

    const strutR = new THREE.Mesh(strutGeo, hullMatGrey);
    strutR.position.set(0.9, 0, -1.7);
    strutR.rotation.y = 0.4;
    this.group.add(strutR);

    // ── Side Thrusters / Nacelles ──
    const nacelleGeo = new THREE.BoxGeometry(0.6, 0.6, 1.6);
    this._nacelleL = new THREE.Mesh(nacelleGeo, hullMatDark);
    this._nacelleL.position.set(-1.3, 0, -1.8);
    this.group.add(this._nacelleL);

    this._nacelleR = new THREE.Mesh(nacelleGeo, hullMatDark);
    this._nacelleR.position.set(1.3, 0, -1.8);
    this.group.add(this._nacelleR);

    // Extra nacelle detailing (intake scoops front)
    const scoopGeo = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    const scoopL = new THREE.Mesh(scoopGeo, hullMatGrey);
    scoopL.position.set(-1.3, 0, -0.9);
    this.group.add(scoopL);

    const scoopR = new THREE.Mesh(scoopGeo, hullMatGrey);
    scoopR.position.set(1.3, 0, -0.9);
    this.group.add(scoopR);

    // ── Central Pipes running along spine ──
    const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.0, 5);
    pipeGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    
    // Top offset asymmetric pipe
    this._pipeTop = new THREE.Mesh(pipeGeo, trimMatGold);
    this._pipeTop.position.set(0.2, 0.25, -0.5);
    this.group.add(this._pipeTop);
    
    // Side lower pipe
    this._pipeSide = new THREE.Mesh(pipeGeo, detailMat);
    this._pipeSide.position.set(-0.45, -0.15, -0.5);
    this.group.add(this._pipeSide);

    // ── Navigation Lights (Runners) ──
    const navLightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);

    // Port (Red) - Left Nacelle outside
    const navPort = new THREE.Mesh(navLightGeo, navRedMat);
    navPort.position.set(-1.6, 0, -1.5);
    this.group.add(navPort);

    // Starboard (Green) - Right Nacelle outside
    const navStar = new THREE.Mesh(navLightGeo, navGreenMat);
    navStar.position.set(1.6, 0, -1.5);
    this.group.add(navStar);

    // Aft (White) - Under engine block
    const navAft = new THREE.Mesh(navLightGeo, navWhiteMat);
    navAft.position.set(0, -0.4, -2.5);
    this.group.add(navAft);

    // Nose (White) - Top of bridge
    const navNose = new THREE.Mesh(navLightGeo, navWhiteMat);
    navNose.position.set(0, 0.75, 1.7);
    this.group.add(navNose);

    // Store a reference to the main part of the ship for hitboxes
    this._hitboxTarget = this._fuselage;
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
    const engines = [
      { x: -1.3, z: -2.6 },
      { x: -0.4, z: -2.5 },
      { x:  0.4, z: -2.5 },
      { x:  1.3, z: -2.6 },
    ];
    
    for (const pos of engines) {
        const plight = new THREE.PointLight(RESOURCE_ENGINE_COLORS.ore, 1.0, 5);
        plight.position.set(pos.x, 0, pos.z);
        this.group.add(plight);
        this._engineLights.push(plight);

        const glowMesh = new THREE.Mesh(glowGeo, glowMat.clone());
        glowMesh.position.set(pos.x, 0, pos.z + 0.1); 
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
