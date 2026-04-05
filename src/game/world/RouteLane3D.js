import * as THREE from 'three';

const RESOURCE_COLORS = {
  ore:     new THREE.Color(0xd4a843),
  energy:  new THREE.Color(0x4af0ff),
  crystal: new THREE.Color(0xb44aff),
};

const PARTICLE_COUNT = 30;
const PARTICLE_SPEED = 0.18;
const LANE_OFFSET    = 1.8; // world units perpendicular offset to separate bidirectional lanes

/**
 * A directional glowing lane between two planets for a single route.
 * Thin line + flowing particles colored by resource type.
 * Updated every frame because planet positions change as they orbit.
 */
export class RouteLane3D {
  constructor(route, parentGroup) {
    this._route      = route;
    this._parentGroup = parentGroup;

    const color = RESOURCE_COLORS[route.resource] ?? RESOURCE_COLORS.ore;

    // Store base colors for blocked/unblocked restore
    this._baseColor         = color.getHex();
    this._baseParticleColor = new THREE.Vector3(color.r, color.g, color.b);
    this._blocked           = false;

    // Offset sign: consistent rule so bidirectional routes go to opposite sides
    this._offsetSign = route.fromPlanet < route.toPlanet ? 1 : -1;

    this._group = new THREE.Group();

    // --- Glowing line ---
    const linePositions = new Float32Array(2 * 3);
    this._lineGeo = new THREE.BufferGeometry();
    this._lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    this._lineMat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._line = new THREE.Line(this._lineGeo, this._lineMat);
    this._group.add(this._line);

    // --- Directional particles ---
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    this._particleOffsets   = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this._particleOffsets[i] = Math.random();
    }

    this._particleGeo = new THREE.BufferGeometry();
    this._particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    this._particleMat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        #ifdef USE_LOGDEPTHBUF
          uniform float logDepthBufFC;
        #endif
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 3.5 * (120.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
          #ifdef USE_LOGDEPTHBUF
            gl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC - 1.0;
            gl_Position.z *= gl_Position.w;
          #endif
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3  uColor;
        uniform float uOpacity;
        void main() {
          vec2  uv    = gl_PointCoord - 0.5;
          float alpha = exp(-dot(uv, uv) * 14.0) * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uColor * 2.0, alpha);
        }
      `,
      uniforms: {
        uColor:   { value: this._baseParticleColor.clone() },
        uOpacity: { value: 0.45 },
      },
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    this._particles = new THREE.Points(this._particleGeo, this._particleMat);
    this._group.add(this._particles);

    parentGroup.add(this._group);

    // Scratch vectors (avoid per-frame allocation)
    this._from    = new THREE.Vector3();
    this._to      = new THREE.Vector3();
    this._perp    = new THREE.Vector3();
    this._tempPos = new THREE.Vector3();
  }

  /**
   * Mark this lane as blocked by a hostile scout fleet.
   * When blocked the lane renders in red/dim and skips normal opacity lerp.
   * @param {boolean} blocked
   */
  setBlocked(blocked) {
    if (this._blocked === blocked) return;
    this._blocked = blocked;
    if (blocked) {
      this._lineMat.color.setHex(0xff3300);
      this._lineMat.opacity = 0.25;
      this._particleMat.uniforms.uColor.value.set(0.8, 0.1, 0.05);
    } else {
      this._lineMat.color.setHex(this._baseColor);
      this._particleMat.uniforms.uColor.value.copy(this._baseParticleColor);
      // Opacity will be restored by lerp logic in the next update()
    }
  }

  /**
   * Update line endpoints and particle flow.
   * @param {number} dt
   * @param {THREE.Vector3} fromPos - live planet world position
   * @param {THREE.Vector3} toPos   - live planet world position
   * @param {boolean} active
   * @param {boolean} hasShipInTransit
   */
  update(dt, fromPos, toPos, active, hasShipInTransit) {
    if (!fromPos || !toPos) return;

    // Compute perpendicular offset in XZ plane to separate bidirectional lanes
    this._perp.set(-(toPos.z - fromPos.z), 0, toPos.x - fromPos.x).normalize();
    this._perp.multiplyScalar(LANE_OFFSET * this._offsetSign);

    this._from.copy(fromPos).add(this._perp);
    this._to.copy(toPos).add(this._perp);

    // Update line geometry
    const linePos = this._lineGeo.attributes.position.array;
    linePos[0] = this._from.x; linePos[1] = this._from.y; linePos[2] = this._from.z;
    linePos[3] = this._to.x;   linePos[4] = this._to.y;   linePos[5] = this._to.z;
    this._lineGeo.attributes.position.needsUpdate = true;

    // Lerp opacities (skipped when blocked — red/dim override is kept)
    if (!this._blocked) {
      const targetLine = hasShipInTransit ? 0.85 : active ? 0.55 : 0.15;
      const targetPart = hasShipInTransit ? 0.70 : active ? 0.45 : 0.12;
      const blend = Math.min(1, dt * 3);
      this._lineMat.opacity += (targetLine - this._lineMat.opacity) * blend;
      this._particleMat.uniforms.uOpacity.value += (targetPart - this._particleMat.uniforms.uOpacity.value) * blend;
    }

    // Advance particles along from→to
    const speed = active ? PARTICLE_SPEED : PARTICLE_SPEED * 0.25;
    const particlePos = this._particleGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this._particleOffsets[i] = (this._particleOffsets[i] + dt * speed) % 1.0;
      this._tempPos.lerpVectors(this._from, this._to, this._particleOffsets[i]);
      particlePos[i * 3]     = this._tempPos.x;
      particlePos[i * 3 + 1] = this._tempPos.y;
      particlePos[i * 3 + 2] = this._tempPos.z;
    }
    this._particleGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this._parentGroup.remove(this._group);
    this._lineGeo.dispose();
    this._lineMat.dispose();
    this._particleGeo.dispose();
    this._particleMat.dispose();
  }
}
