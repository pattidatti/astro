import * as THREE from 'three';

const TRAIL_LENGTH = 16;

/**
 * A 3D enemy fighter ship. Used for interceptors, bombers, and raiders.
 * Pooled by EnemyManager3D — activate/deactivate as needed.
 */
export class EnemyShip3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;

    this._type = null;
    this._targetPos = new THREE.Vector3();
    this._orbitAngle = Math.random() * Math.PI * 2;
    this._orbitRadius = 15 + Math.random() * 15;
    this._orbitInclination = 0.5 + Math.random() * 0.8;  // 29–74 degrees from horizontal
    this._orbitAzimuth = Math.random() * Math.PI * 2;     // random orbit plane orientation
    this._speed = 1.0;

    // Approach animation state
    this._inApproach = false;
    this._approachFrom = new THREE.Vector3();
    this._approachTo = new THREE.Vector3();
    this._approachTime = 0;
    this._approachDuration = 1.5;

    this._buildMesh();
    this._createTrail();
    this._createHPBar();
    this._createEngineGlow();
  }

  _buildMesh() {
    this._meshGroup = new THREE.Group();
    this.group.add(this._meshGroup);

    // Shared materials
    this._obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x15151b, // Dark obsidian
      metalness: 0.8,
      roughness: 0.3,
    });
    this._armorMat = new THREE.MeshStandardMaterial({
      color: 0x25252d, // Dark metal armor
      metalness: 0.6,
      roughness: 0.5,
    });
    this._glowMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
    });
    this._glassMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 1.0,
      roughness: 0.1,
      emissive: new THREE.Color(0x330000),
    });

    this._interceptorGroup = this._buildInterceptor();
    this._bomberGroup = this._buildBomber();
    this._raiderGroup = this._buildRaider();

    this._meshGroup.add(this._interceptorGroup);
    this._meshGroup.add(this._bomberGroup);
    this._meshGroup.add(this._raiderGroup);
  }

  _buildInterceptor() {
    const group = new THREE.Group();
    // Needle core
    const coreGeo = new THREE.CylinderGeometry(0.015, 0.05, 0.35, 6);
    coreGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const core = new THREE.Mesh(coreGeo, this._obsidianMat);
    group.add(core);

    // Forward swept wings
    const wingGeo = new THREE.BoxGeometry(0.25, 0.02, 0.08);
    const wingL = new THREE.Mesh(wingGeo, this._armorMat);
    wingL.position.set(-0.11, 0, -0.05);
    wingL.rotation.y = -Math.PI / 6;
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, this._armorMat);
    wingR.position.set(0.11, 0, -0.05);
    wingR.rotation.y = Math.PI / 6;
    group.add(wingR);

    // Engines
    const engineGeo = new THREE.CylinderGeometry(0.015, 0.025, 0.1, 8);
    engineGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const engL = new THREE.Mesh(engineGeo, this._obsidianMat);
    engL.position.set(-0.04, 0, -0.15);
    group.add(engL);
    
    const engR = engL.clone();
    engR.position.set(0.04, 0, -0.15);
    group.add(engR);

    // Glow
    const glowGeo = new THREE.CircleGeometry(0.02, 8);
    const glL = new THREE.Mesh(glowGeo, this._glowMat);
    glL.position.set(-0.04, 0, -0.201);
    glL.rotation.y = Math.PI;
    group.add(glL);
    
    const glR = new THREE.Mesh(glowGeo, this._glowMat);
    glR.position.set(0.04, 0, -0.201);
    glR.rotation.y = Math.PI;
    group.add(glR);

    return group;
  }

  _buildBomber() {
    const group = new THREE.Group();
    // Bulky core
    const coreGeo = new THREE.BoxGeometry(0.15, 0.08, 0.25);
    const core = new THREE.Mesh(coreGeo, this._armorMat);
    group.add(core);

    // Thick wings
    const wingGeo = new THREE.BoxGeometry(0.35, 0.04, 0.15);
    const wings = new THREE.Mesh(wingGeo, this._obsidianMat);
    wings.position.set(0, 0, -0.02);
    group.add(wings);

    // Bomb pods
    const podGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
    podGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const podL = new THREE.Mesh(podGeo, this._obsidianMat);
    podL.position.set(-0.12, -0.04, 0);
    group.add(podL);
    
    const podR = podL.clone();
    podR.position.set(0.12, -0.04, 0);
    group.add(podR);

    // Engine
    const engineGeo = new THREE.BoxGeometry(0.12, 0.06, 0.08);
    const engine = new THREE.Mesh(engineGeo, this._obsidianMat);
    engine.position.set(0, 0, -0.15);
    group.add(engine);

    // Glow
    const glowGeo = new THREE.PlaneGeometry(0.1, 0.05);
    const glow = new THREE.Mesh(glowGeo, this._glowMat);
    glow.position.set(0, 0, -0.191);
    glow.rotation.y = Math.PI;
    group.add(glow);

    // Cockpit
    const glassGeo = new THREE.BoxGeometry(0.08, 0.04, 0.08);
    const glass = new THREE.Mesh(glassGeo, this._glassMat);
    glass.position.set(0, 0.05, 0.08);
    group.add(glass);

    return group;
  }

  _buildRaider() {
    const group = new THREE.Group();
    // Fork shape (TIE style prongs)
    const coreGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 6);
    coreGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const core = new THREE.Mesh(coreGeo, this._obsidianMat);
    core.position.set(0, 0, -0.05);
    group.add(core);

    const prongGeo = new THREE.BoxGeometry(0.03, 0.15, 0.25);
    const prongL = new THREE.Mesh(prongGeo, this._armorMat);
    prongL.position.set(-0.12, 0, 0.02);
    group.add(prongL);

    const prongR = prongL.clone();
    prongR.position.set(0.12, 0, 0.02);
    group.add(prongR);

    const wingGeo = new THREE.BoxGeometry(0.24, 0.02, 0.06);
    const wings = new THREE.Mesh(wingGeo, this._obsidianMat);
    wings.position.set(0, 0, -0.05);
    group.add(wings);

    // Engine
    const glowGeo = new THREE.CircleGeometry(0.02, 6);
    const glow = new THREE.Mesh(glowGeo, this._glowMat);
    glow.position.set(0, 0, -0.126);
    glow.rotation.y = Math.PI;
    group.add(glow);

    // Cockpit glass sphere
    const glassGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const glass = new THREE.Mesh(glassGeo, this._glassMat);
    glass.position.set(0, 0, 0.08);
    group.add(glass);

    return group;
  }

  _createTrail() {
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    this._trailGeo = new THREE.BufferGeometry();
    this._trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._trailMat = new THREE.LineBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._trail = new THREE.Line(this._trailGeo, this._trailMat);
    this._trailPositions = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3());
    this.group.add(this._trail);
  }

  _createHPBar() {
    // HP bar background
    const bgGeo = new THREE.PlaneGeometry(0.4, 0.04);
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.6,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpBg = new THREE.Mesh(bgGeo, bgMat);
    // Lowered HP bar due to scale reduction
    this._hpBg.position.set(0, 0.25, 0);
    this.group.add(this._hpBg);

    // HP bar foreground
    const fgGeo = new THREE.PlaneGeometry(0.38, 0.03);
    this._hpFgMat = new THREE.MeshBasicMaterial({
      color: 0x44ff44,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    this._hpFg = new THREE.Mesh(fgGeo, this._hpFgMat);
    this._hpFg.position.set(0, 0.25, 0.001);
    this.group.add(this._hpFg);
  }

  _createEngineGlow() {
    this._engineLight = new THREE.PointLight(0xff4444, 0.3, 2);
    // Positioned slightly behind the group
    this._engineLight.position.set(0, 0, -0.2);
    this.group.add(this._engineLight);
  }

  /**
   * Set enemy type and color.
   */
  setType(type, color) {
    this._type = type;
    
    // Set glowing colors
    this._glowMat.color.set(color);
    this._glassMat.emissive.set(new THREE.Color(color).multiplyScalar(0.3));
    this._trailMat.color.set(color);
    this._engineLight.color.set(color);

    // Toggle visuals based on type
    this._interceptorGroup.visible = false;
    this._bomberGroup.visible = false;
    this._raiderGroup.visible = false;

    if (type === 'bomber') {
      this._bomberGroup.visible = true;
      this._meshGroup.scale.setScalar(1.2); 
    } else if (type === 'raider') {
      this._raiderGroup.visible = true;
      this._meshGroup.scale.setScalar(1.0);
    } else {
      this._interceptorGroup.visible = true;
      this._meshGroup.scale.setScalar(1.0);
    }
  }

  /**
   * Activate this enemy ship at a position orbiting a target.
   */
  activate(targetPos, speed) {
    this._targetPos.copy(targetPos);
    this._speed = speed || 1.0;
    this._orbitAngle = Math.random() * Math.PI * 2;
    this._orbitRadius = 15 + Math.random() * 15;
    this._orbitInclination = 0.5 + Math.random() * 0.8;
    this._orbitAzimuth = Math.random() * Math.PI * 2;
    this.group.visible = true;

    // Set up approach animation
    const orbitPos = this._calcOrbitPos();
    this._approachTo.copy(orbitPos);

    // Start position: 60 units away along the direction to the orbit position
    const approachDir = new THREE.Vector3().subVectors(this._approachTo, targetPos).normalize();
    this._approachFrom.copy(targetPos).addScaledVector(approachDir, 60);

    this._inApproach = true;
    this._approachTime = 0;
    this.group.position.copy(this._approachFrom);

    // Initialize trail at start position
    for (const v of this._trailPositions) v.copy(this._approachFrom);
  }

  deactivate() {
    this.group.visible = false;
  }

  /**
   * Update HP bar display.
   */
  setHP(current, max) {
    const frac = Math.max(0, current / max);
    this._hpFg.scale.x = frac;
    // Scale goes from -0.19 to 0 (for a width of 0.38)
    this._hpFg.position.x = -(1 - frac) * 0.19;

    // Color: green → yellow → red
    if (frac > 0.6) {
      this._hpFgMat.color.setHex(0x44ff44);
    } else if (frac > 0.3) {
      this._hpFgMat.color.setHex(0xffcc00);
    } else {
      this._hpFgMat.color.setHex(0xff3333);
    }
  }

  /**
   * Make HP bar always face camera.
   */
  faceCamera(camera) {
    this._hpBg.quaternion.copy(camera.quaternion);
    this._hpFg.quaternion.copy(camera.quaternion);
  }

  _calcOrbitPos() {
    const R = this._orbitRadius;
    const t = this._orbitAngle;
    const incl = this._orbitInclination;
    const azim = this._orbitAzimuth;

    // Position in tilted orbit plane
    const lx = Math.cos(t) * R;
    const ly = Math.sin(t) * R * Math.sin(incl);
    const lz = Math.sin(t) * R * Math.cos(incl);

    // Rotate around Y axis by azimuth for varied orbit orientations
    return new THREE.Vector3(
      this._targetPos.x + lx * Math.cos(azim) - lz * Math.sin(azim),
      this._targetPos.y + ly,
      this._targetPos.z + lx * Math.sin(azim) + lz * Math.cos(azim),
    );
  }

  /**
   * Per-frame update — orbit around target, update trail.
   */
  update(dt, targetPos) {
    if (targetPos) this._targetPos.copy(targetPos);

    // Handle approach animation
    if (this._inApproach) {
      this._approachTime += dt;
      const rawT = Math.min(1, this._approachTime / this._approachDuration);
      // Ease-out quadratic: decelerate into orbit
      const t = 1 - Math.pow(1 - rawT, 2);

      const newPos = new THREE.Vector3().lerpVectors(this._approachFrom, this._approachTo, t);
      this.group.position.copy(newPos);

      // Face direction of travel during approach
      if (rawT < 0.98) {
        const dir = new THREE.Vector3().subVectors(this._approachTo, this._approachFrom).normalize();
        this._meshGroup.lookAt(newPos.clone().add(dir));
      }

      // Update trail during approach
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        this._trailPositions[i].copy(this._trailPositions[i - 1]);
      }
      this._trailPositions[0].copy(newPos);
      const arr = this._trailGeo.attributes.position.array;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const local = this._trailPositions[i].clone().sub(newPos);
        arr[i * 3] = local.x; arr[i * 3 + 1] = local.y; arr[i * 3 + 2] = local.z;
      }
      this._trailGeo.attributes.position.needsUpdate = true;

      if (rawT >= 1) {
        this._inApproach = false;
        // Orbit angle was set in activate() and _approachTo was computed from it.
        // Leave orbit angle unchanged; normal orbiting starts from there.
      }
      return;
    }

    // Normal orbit behavior
    this._orbitAngle += dt * 0.5 * this._speed;
    const newPos = this._calcOrbitPos();
    this.group.position.copy(newPos);

    // Face direction of travel (look ahead along orbit)
    const lookAngle = this._orbitAngle + 0.2;
    const R = this._orbitRadius;
    const incl = this._orbitInclination;
    const azim = this._orbitAzimuth;
    const lx = Math.cos(lookAngle) * R;
    const ly = Math.sin(lookAngle) * R * Math.sin(incl);
    const lz = Math.sin(lookAngle) * R * Math.cos(incl);
    const lookPos = new THREE.Vector3(
      this._targetPos.x + lx * Math.cos(azim) - lz * Math.sin(azim),
      this._targetPos.y + ly,
      this._targetPos.z + lx * Math.sin(azim) + lz * Math.cos(azim),
    );
    this._meshGroup.lookAt(lookPos);

    // The engine light follows the rotation approximately
    this._engineLight.position.set(0, 0, -0.2).applyQuaternion(this._meshGroup.quaternion);

    // Update trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      this._trailPositions[i].copy(this._trailPositions[i - 1]);
    }
    this._trailPositions[0].copy(newPos);

    const arr = this._trailGeo.attributes.position.array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const local = this._trailPositions[i].clone().sub(newPos);
      arr[i * 3]     = local.x;
      arr[i * 3 + 1] = local.y;
      arr[i * 3 + 2] = local.z;
    }
    this._trailGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._trailGeo.dispose();
    this._trailMat.dispose();
  }
}
