import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

let sharedGeometries = null;
let sharedMaterials = null;

const RESOURCE_ENGINE_COLORS = {
  ore:     new THREE.Color(0xd4a843),
  energy:  new THREE.Color(0x4af0ff),
  crystal: new THREE.Color(0xaa44ee),
};

const RESOURCE_CARGO_COLORS = {
  ore:     new THREE.Color(0xd4a843),
  energy:  new THREE.Color(0x4af0ff),
  crystal: new THREE.Color(0xaa44ee),
};

export class Ship3D {
  static initSharedResources() {
    if (sharedGeometries) return;

    // Materials - Body
    const hullMatDark = new THREE.MeshStandardMaterial({ color: 0x0a0e14, metalness: 0.85, roughness: 0.4 });
    const hullMatGrey = new THREE.MeshStandardMaterial({ color: 0x1c2430, metalness: 0.8, roughness: 0.5 });
    const trimMatGold = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2, emissive: 0xd4a843, emissiveIntensity: 0.2 });
    const detailMat = new THREE.MeshStandardMaterial({ color: 0xe8d5b0, metalness: 0.4, roughness: 0.7 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, emissive: 0xd4a843, emissiveIntensity: 1.0 });
    const podCapMat = new THREE.MeshStandardMaterial({ color: 0x06080a, metalness: 0.9, roughness: 0.2 });
    const navRedMat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
    const navGreenMat = new THREE.MeshBasicMaterial({ color: 0x11ff11 });
    const navWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Materials - Cargo (base white, tinted by instanceColor)
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.3, emissive: 0x444444 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });

    sharedMaterials = {
      body: [hullMatDark, hullMatGrey, trimMatGold, detailMat, windowMat, podCapMat, navRedMat, navGreenMat, navWhiteMat],
      cargo: [cargoMat, glowMat]
    };

    const applyBodyMat = (geo, matIndex) => {
      geo.clearGroups();
      geo.addGroup(0, geo.attributes.position.count, matIndex);
      return geo;
    };
    
    const applyCargoMat = (geo, matIndex) => {
      geo.clearGroups();
      geo.addGroup(0, geo.attributes.position.count, matIndex);
      return geo;
    };

    const bodyGeos = [];
    const cargoGeos = [];

    // --- SPINE & GREEBLES ---
    const spineGeo = new THREE.BoxGeometry(0.8, 0.4, 3.8);
    bodyGeos.push(applyBodyMat(spineGeo, 0)); // hullMatDark

    const greebleGeo = new THREE.BoxGeometry(0.1, 0.08, 0.15);
    for(let i=0; i<14; i++) {
        const px = (Math.sin(i * 3.4) * 0.3);
        const pz = -1.5 + (i * 0.22);
        const meshGeo = greebleGeo.clone();
        meshGeo.translate(px, 0.22, pz);
        meshGeo.rotateY((i % 2 === 0) ? 0 : 0.2);
        bodyGeos.push(applyBodyMat(meshGeo, 1)); // hullMatGrey
    }

    // --- BRIDGE ---
    const bridgeGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    bridgeGeo.translate(0, 0.4, 1.4);
    bodyGeos.push(applyBodyMat(bridgeGeo, 1)); // hullMatGrey

    const bridgeWindowGeo = new THREE.BoxGeometry(1.25, 0.15, 0.4);
    bridgeWindowGeo.translate(0, 0.5, 1.62);
    bodyGeos.push(applyBodyMat(bridgeWindowGeo, 4)); // windowMat

    const mastGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 6);
    mastGeo.rotateZ(-0.2);
    mastGeo.rotateX(0.2);
    mastGeo.translate(-0.5, 0.9, 1.3);
    bodyGeos.push(applyBodyMat(mastGeo, 3)); // detailMat

    const dishGeo = new THREE.CylinderGeometry(0.2, 0.05, 0.05, 8);
    dishGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    dishGeo.rotateY(0.5);
    dishGeo.rotateX(-0.3);
    dishGeo.translate(-0.6, 1.2, 1.25);
    bodyGeos.push(applyBodyMat(dishGeo, 2)); // trimMatGold

    // --- CARGO PODS AND MOUNTS ---
    const podGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 8);
    podGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 8);
    capGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
    const strapGeo = new THREE.TorusGeometry(0.23, 0.03, 4, 8);
    strapGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
    const mountGeo = new THREE.BoxGeometry(0.3, 0.1, 0.15);

    for (let i = 0; i < 4; i++) {
        const zPos = 0.4 - i * 0.75; 
        
        // Cargo itself (tintable)
        const podL = podGeo.clone(); podL.translate(-0.65, 0, zPos);
        cargoGeos.push(applyCargoMat(podL, 0)); // cargoMat
        const podR = podGeo.clone(); podR.translate(0.65, 0, zPos);
        cargoGeos.push(applyCargoMat(podR, 0));

        // Mounts and caps (body)
        const capL1 = capGeo.clone(); capL1.translate(-0.35, 0, zPos); bodyGeos.push(applyBodyMat(capL1, 5)); // podCapMat
        const capL2 = capGeo.clone(); capL2.translate(-0.95, 0, zPos); bodyGeos.push(applyBodyMat(capL2, 5));
        const strapL = strapGeo.clone(); strapL.translate(-0.65, 0, zPos); bodyGeos.push(applyBodyMat(strapL, 2)); // trimMatGold

        const capR1 = capGeo.clone(); capR1.translate(0.35, 0, zPos); bodyGeos.push(applyBodyMat(capR1, 5));
        const capR2 = capGeo.clone(); capR2.translate(0.95, 0, zPos); bodyGeos.push(applyBodyMat(capR2, 5));
        const strapR = strapGeo.clone(); strapR.translate(0.65, 0, zPos); bodyGeos.push(applyBodyMat(strapR, 2));

        const mountL = mountGeo.clone(); mountL.translate(-0.4, 0, zPos); bodyGeos.push(applyBodyMat(mountL, 1)); // hullMatGrey
        const mountR = mountGeo.clone(); mountR.translate(0.4, 0, zPos); bodyGeos.push(applyBodyMat(mountR, 1));
    }

    // --- ENGINES & BLOCK ---
    const engineBlockGeo = new THREE.BoxGeometry(1.4, 0.8, 1.0);
    engineBlockGeo.translate(0, 0, -2.0);
    bodyGeos.push(applyBodyMat(engineBlockGeo, 1));

    const ribGeo = new THREE.BoxGeometry(1.2, 0.1, 0.05);
    for(let r=0; r<10; r++) {
        const rib = ribGeo.clone();
        rib.translate(0, 0.45, -1.6 - (r * 0.08));
        bodyGeos.push(applyBodyMat(rib, 0)); 
    }

    const strutGeo = new THREE.BoxGeometry(0.8, 0.2, 0.3);
    const strutL = strutGeo.clone(); strutL.rotateY(-0.4); strutL.translate(-0.9, 0, -1.7);
    bodyGeos.push(applyBodyMat(strutL, 1));
    const strutR = strutGeo.clone(); strutR.rotateY(0.4); strutR.translate(0.9, 0, -1.7);
    bodyGeos.push(applyBodyMat(strutR, 1));

    const nacelleGeo = new THREE.BoxGeometry(0.6, 0.6, 1.6);
    const nacelleL = nacelleGeo.clone(); nacelleL.translate(-1.3, 0, -1.8);
    bodyGeos.push(applyBodyMat(nacelleL, 0));
    const nacelleR = nacelleGeo.clone(); nacelleR.translate(1.3, 0, -1.8);
    bodyGeos.push(applyBodyMat(nacelleR, 0));

    const scoopGeo = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    const scoopL = scoopGeo.clone(); scoopL.translate(-1.3, 0, -0.9); bodyGeos.push(applyBodyMat(scoopL, 1));
    const scoopR = scoopGeo.clone(); scoopR.translate(1.3, 0, -0.9); bodyGeos.push(applyBodyMat(scoopR, 1));

    const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.0, 5);
    pipeGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    const pipeTop = pipeGeo.clone(); pipeTop.translate(0.2, 0.25, -0.5); bodyGeos.push(applyBodyMat(pipeTop, 2));
    const pipeSide = pipeGeo.clone(); pipeSide.translate(-0.45, -0.15, -0.5); bodyGeos.push(applyBodyMat(pipeSide, 3));

    // --- NAV LIGHTS ---
    const navLightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const navPort = navLightGeo.clone(); navPort.translate(-1.6, 0, -1.5); bodyGeos.push(applyBodyMat(navPort, 6)); // Red
    const navStar = navLightGeo.clone(); navStar.translate(1.6, 0, -1.5); bodyGeos.push(applyBodyMat(navStar, 7)); // Green
    const navAft = navLightGeo.clone(); navAft.translate(0, -0.4, -2.5); bodyGeos.push(applyBodyMat(navAft, 8)); // White
    const navNose = navLightGeo.clone(); navNose.translate(0, 0.75, 1.7); bodyGeos.push(applyBodyMat(navNose, 8)); // White

    // --- GLOW EFFECTS (Tintable Cargo Geometries) ---
    const engineGlowGeo = new THREE.ConeGeometry(0.12, 0.6, 8);
    engineGlowGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    const engines = [ { x: -1.3, z: -2.6 }, { x: -0.4, z: -2.5 }, { x:  0.4, z: -2.5 }, { x:  1.3, z: -2.6 } ];
    for (const pos of engines) {
        const glow = engineGlowGeo.clone();
        glow.translate(pos.x, 0, pos.z + 0.1);
        cargoGeos.push(applyCargoMat(glow, 1)); // glowMat
    }

    // Scale down the final geometries logic from _buildMesh: group.scale.setScalar(1.25);
    const s = 1.25;
    const sMat = new THREE.Matrix4().makeScale(s, s, s);

    const mergedBody = mergeGeometries(bodyGeos, true);
    mergedBody.applyMatrix4(sMat);
    const mergedCargo = mergeGeometries(cargoGeos, true);
    mergedCargo.applyMatrix4(sMat);

    sharedGeometries = {
      body: mergedBody,
      cargo: mergedCargo
    };
  }

  static getSharedResources() {
    return { geometries: sharedGeometries, materials: sharedMaterials };
  }

  constructor() {
    this.visible = false;
    this.matrix = new THREE.Matrix4();
    this.worldPosition = new THREE.Vector3();

    this._fromPos = new THREE.Vector3();
    this._toPos = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.scale = new THREE.Vector3(1, 1, 1);

    this.cargoColor = new THREE.Color(0xffffff);
    this.engineColor = new THREE.Color(0xffffff);

    this.trailPositions = Array.from({ length: 16 }, () => new THREE.Vector3());
  }

  activate(fromPos, toPos, resource) {
    this._fromPos.copy(fromPos);
    this._toPos.copy(toPos);
    
    // Set color based on resource
    const engC = RESOURCE_ENGINE_COLORS[resource] ?? RESOURCE_ENGINE_COLORS.ore;
    const carC = RESOURCE_CARGO_COLORS[resource] ?? RESOURCE_CARGO_COLORS.ore;
    
    // Pass color to the instanced matrix
    this.engineColor.copy(engC);
    this.cargoColor.copy(carC);

    this.visible = true;
    for (const v of this.trailPositions) v.copy(fromPos);
    this.update(0, fromPos, toPos);
  }

  deactivate() {
    this.visible = false;
  }

  update(t, fromPos, toPos) {
    this.position.lerpVectors(fromPos, toPos, t);
    const arcHeight = fromPos.distanceTo(toPos) * 0.10;
    this.position.y += Math.sin(t * Math.PI) * arcHeight;

    const tangent = new THREE.Vector3().subVectors(toPos, fromPos);
    tangent.y += Math.cos(t * Math.PI) * arcHeight * 2;
    if (tangent.lengthSq() > 0.0001) {
      tangent.normalize();
      this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }

    // Trail shift
    for (let i = 15; i > 0; i--) {
      this.trailPositions[i].copy(this.trailPositions[i - 1]);
    }
    this.trailPositions[0].copy(this.position);

    this.worldPosition.copy(this.position);
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }

  dispose() {}
}
