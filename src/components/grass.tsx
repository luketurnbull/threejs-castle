import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import type { Model } from "../types/model";
import rustleAudio from "../assets/leavesRustling2.mp3";
import { TEXTURES } from "../constants/assets";
import { getTexturePixelData } from "../utils/textureUtils";
import { useAppStore } from "@/store";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

// Preload the audio
const preloadedAudio = new Audio(rustleAudio);
preloadedAudio.load();

const NUM_BLADES = 150000;
const HILL_SCALE = new THREE.Vector3(131.333, 95.653, 131.333);
const HILL_POSITION = new THREE.Vector3(-1.637, -89.253, 0.168);

// Audio settings
const MIN_DISTANCE = 60; // Distance at which volume will be 1
const MAX_DISTANCE = 230; // Distance at which volume will be 0
const FADE_SPEED = 0.05; // Speed of volume fade in/out
const STOP_DELAY = 200; // Delay before stopping sound (ms)

function createBladeGeometry() {
  const geometry = new THREE.PlaneGeometry(0.2, 1, 1, 4);
  geometry.translate(0, 0.5, 0);
  return geometry;
}

export default function Grass() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const hillMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const hillRef = useRef<THREE.Mesh>(null!);
  const prevPointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const targetVolumeRef = useRef<number>(0);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rustleSoundRef = useRef<HTMLAudioElement | null>(null);
  const transitionStartTimeRef = useRef<number>(0);
  const previousModeRef = useRef<string>("day");

  useEffect(() => {
    // Clone the preloaded audio to avoid issues with multiple instances
    rustleSoundRef.current = preloadedAudio.cloneNode(true) as HTMLAudioElement;
    rustleSoundRef.current.loop = true;

    return () => {
      if (rustleSoundRef.current) {
        rustleSoundRef.current.pause();
        rustleSoundRef.current = null;
      }
    };
  }, []);

  const audioEnabled = useAppStore((state) => state.audioEnabled);

  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;
  const hillGeom = nodes.hill.geometry;

  useEffect(() => {
    hillGeom.attributes.uv = hillGeom.attributes.uv1;
    hillGeom.attributes.uv.needsUpdate = true;
  }, [hillGeom]);

  const texture = useTexture(TEXTURES.BLADE_DIFFUSE);
  const alphaMap = useTexture(TEXTURES.BLADE_ALPHA);

  const bakedTexture = useTexture(TEXTURES.HILL_BAKED);
  bakedTexture.flipY = false;

  const bakeNightTexture = useTexture(TEXTURES.HILL_BAKED_NIGHT);
  bakeNightTexture.flipY = false;

  const hillPatchesTexture = useTexture(TEXTURES.HILL_PATCHES);
  hillPatchesTexture.flipY = false;

  const mode = useAppStore((state) => state.mode);

  const [patchesPixelData, setPatchesPixelData] =
    useState<Uint8ClampedArray | null>(null);

  useEffect(() => {
    if (hillPatchesTexture.image) {
      setPatchesPixelData(getTexturePixelData(hillPatchesTexture));
    }
  }, [hillPatchesTexture]);

  const baseGeom = useMemo(() => createBladeGeometry(), []);

  const { camera, raycaster, pointer } = useThree();

  const grassAttributes = useMemo(() => {
    const offsets = [];
    const orientations = [];
    const stretches = [];
    const halfRootAngleSin = [];
    const halfRootAngleCos = [];
    const hillUVs = [];

    if (!patchesPixelData) {
      return {
        offsets: [],
        orientations: [],
        stretches: [],
        halfRootAngleSin: [],
        halfRootAngleCos: [],
        hillUVs: [],
      };
    }

    for (let i = 0; i < NUM_BLADES; i++) {
      // Sample point, normal, and barycentric info
      const position = hillGeom.attributes.position;
      const index = hillGeom.index;
      const faceCount = index ? index.count / 3 : position.count / 3;
      const faceIndex = Math.floor(Math.random() * faceCount);

      let a, b, c;

      if (index) {
        a = index.getX(faceIndex * 3);
        b = index.getX(faceIndex * 3 + 1);
        c = index.getX(faceIndex * 3 + 2);
      } else {
        a = faceIndex * 3;
        b = faceIndex * 3 + 1;
        c = faceIndex * 3 + 2;
      }

      const vA = new THREE.Vector3().fromBufferAttribute(position, a);
      const vB = new THREE.Vector3().fromBufferAttribute(position, b);
      const vC = new THREE.Vector3().fromBufferAttribute(position, c);

      // Barycentric coordinates
      const r1 = Math.random();
      const r2 = Math.random();
      const sqrtR1 = Math.sqrt(r1);
      const u = 1 - sqrtR1;
      const v = sqrtR1 * (1 - r2);
      const w = sqrtR1 * r2;
      const point = new THREE.Vector3()
        .addScaledVector(vA, u)
        .addScaledVector(vB, v)
        .addScaledVector(vC, w);

      // Interpolated UV
      const uvAttr = hillGeom.attributes.uv;
      const uvA = new THREE.Vector2().fromBufferAttribute(
        uvAttr as THREE.BufferAttribute,
        a
      );

      const uvB = new THREE.Vector2().fromBufferAttribute(
        uvAttr as THREE.BufferAttribute,
        b
      );

      const uvC = new THREE.Vector2().fromBufferAttribute(
        uvAttr as THREE.BufferAttribute,
        c
      );

      const uv = new THREE.Vector2()
        .addScaledVector(uvA, u)
        .addScaledVector(uvB, v)
        .addScaledVector(uvC, w);

      // Sample patch density from texture pixel data
      if (patchesPixelData) {
        const imgWidth = hillPatchesTexture.image.width;
        const imgHeight = hillPatchesTexture.image.height;
        const x = Math.min(imgWidth - 1, Math.floor(uv.x * imgWidth));
        const y = Math.min(imgHeight - 1, Math.floor(uv.y * imgHeight)); // Use uv.y directly, consistent with hill_baked texture behavior

        // Get the red channel value (assuming grayscale for density)
        const index = (y * imgWidth + x) * 4; // * 4 for RGBA
        const patchDensity = 1.0 - patchesPixelData[index] / 255.0; // Normalize to 0-1 and invert

        // Only add blade if density is above a threshold
        // and randomly based on density for partial areas
        if (patchDensity < 0.1 || Math.random() > patchDensity) {
          continue; // Skip this blade
        }
      }

      hillUVs.push(uv.x, uv.y);

      // Apply scale and position
      point.multiply(HILL_SCALE);
      point.add(HILL_POSITION);
      offsets.push(point.x, point.y, point.z);

      // Orientation: make all grass blades face straight up on Y axis with slight random rotation
      const randomAngle = (Math.random() - 0.5) * 0.3; // Random angle between -0.15 and 0.15 radians (~±8.6 degrees)
      const randomQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        randomAngle
      );
      orientations.push(randomQuat.x, randomQuat.y, randomQuat.z, randomQuat.w);

      // Random stretch
      const stretch = Math.random() * 2.0;
      stretches.push(stretch);

      // Random root angle for bending
      const rootAngle = Math.random() * Math.PI * 2;
      halfRootAngleSin.push(Math.sin(0.5 * rootAngle));
      halfRootAngleCos.push(Math.cos(0.5 * rootAngle));
    }

    return {
      offsets,
      orientations,
      stretches,
      halfRootAngleSin,
      halfRootAngleCos,
      hillUVs,
    };
  }, [hillGeom, patchesPixelData, hillPatchesTexture]);

  const targetTransition = mode === "day" ? 0 : 1;

  // Reset transition start time when mode changes
  useEffect(() => {
    if (mode !== previousModeRef.current) {
      transitionStartTimeRef.current = 0;
      previousModeRef.current = mode;
    }
  }, [mode]);

  useFrame((state) => {
    // Start timing the transition
    if (transitionStartTimeRef.current === 0) {
      transitionStartTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - transitionStartTimeRef.current;
    const progress = Math.min(elapsed / NIGHT_TIME_TRANSITION_DURATION, 1);

    // Use smoothstep for easing (similar to GSAP's power2.inOut)
    const easedProgress = progress * progress * (3 - 2 * progress);

    // Directly set the transition factor based on time, not lerp
    const transitionValue =
      targetTransition === 1 ? easedProgress : 1 - easedProgress;

    // Handle hill material transition
    if (hillMaterialRef.current) {
      hillMaterialRef.current.uniforms.uTransitionFactor.value =
        transitionValue;
    }

    if (materialRef.current && rustleSoundRef.current) {
      // Animate transition for grass aoMap
      materialRef.current.uniforms.uTransitionFactor.value = transitionValue;

      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.25;

      // Update player position based on mouse position (always for visual effects)
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObject(hillRef.current);

      if (hits.length > 0) {
        const hitPoint = hits[0].point;

        // Check if cursor has moved
        const hasMoved = !pointer.equals(prevPointerRef.current);
        prevPointerRef.current.copy(pointer);

        // Always update the player position for visual rustling effects
        materialRef.current.uniforms.playerPosition.value.copy(hitPoint);

        // Only handle audio if audio is enabled
        if (audioEnabled) {
          if (hasMoved) {
            const distance = camera.position.distanceTo(hitPoint);

            // Normalize distance to volume (1 at MIN_DISTANCE, 0 at MAX_DISTANCE)
            const normalizedVolume = Math.max(
              0,
              Math.min(
                1,
                1 - (distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)
              )
            );

            // Clear any existing stop timeout
            if (stopTimeoutRef.current) {
              clearTimeout(stopTimeoutRef.current);
              stopTimeoutRef.current = null;
            }

            // When movement resumes, restart the audio
            if (rustleSoundRef.current.paused) {
              rustleSoundRef.current.currentTime = 0;
              rustleSoundRef.current.volume = normalizedVolume; // Set initial volume immediately
              rustleSoundRef.current.play();
            } else {
              // Only use fade for subsequent volume changes
              targetVolumeRef.current = normalizedVolume;
            }
          } else {
            // Set up timeout to stop sound if no movement
            if (!stopTimeoutRef.current) {
              stopTimeoutRef.current = setTimeout(() => {
                targetVolumeRef.current = 0;
              }, STOP_DELAY);
            }
          }

          // Smoothly adjust volume towards target
          const currentVolume = rustleSoundRef.current.volume;
          const volumeDiff = targetVolumeRef.current - currentVolume;
          rustleSoundRef.current.volume =
            currentVolume + volumeDiff * FADE_SPEED;

          // Stop sound if volume is very low
          if (rustleSoundRef.current.volume < 0.01 && !hasMoved) {
            rustleSoundRef.current.pause();
            rustleSoundRef.current.volume = 0;
          }
        } else {
          // Stop audio immediately if disabled
          if (!rustleSoundRef.current.paused) {
            rustleSoundRef.current.pause();
            rustleSoundRef.current.volume = 0;
          }
          // Clear any existing stop timeout
          if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
          }
        }
      } else {
        // When not hovering over hill, immediately stop the sound (only if audio enabled)
        if (audioEnabled) {
          if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
          }

          targetVolumeRef.current = 0;
          rustleSoundRef.current.pause();
          rustleSoundRef.current.volume = 0;
        }
      }
    }
  });

  return (
    <group>
      <mesh>
        <instancedBufferGeometry
          index={baseGeom.index}
          attributes-position={baseGeom.attributes.position}
          attributes-uv={baseGeom.attributes.uv}
        >
          <instancedBufferAttribute
            attach={"attributes-offset"}
            args={[new Float32Array(grassAttributes.offsets), 3]}
          />
          <instancedBufferAttribute
            attach={"attributes-orientation"}
            args={[new Float32Array(grassAttributes.orientations), 4]}
          />
          <instancedBufferAttribute
            attach={"attributes-stretch"}
            args={[new Float32Array(grassAttributes.stretches), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleSin"}
            args={[new Float32Array(grassAttributes.halfRootAngleSin), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-halfRootAngleCos"}
            args={[new Float32Array(grassAttributes.halfRootAngleCos), 1]}
          />
          <instancedBufferAttribute
            attach={"attributes-hillUv"}
            args={[new Float32Array(grassAttributes.hillUVs), 2]}
          />
        </instancedBufferGeometry>
        <grassMaterial
          ref={materialRef}
          map={texture}
          alphaMap={alphaMap}
          toneMapped={false}
          transparent={true}
          side={THREE.DoubleSide}
          bladeHeight={1}
          brightness={15.0}
          aoMap={bakedTexture}
          aoMapNight={bakeNightTexture}
        />
      </mesh>
      <mesh
        ref={hillRef}
        geometry={hillGeom}
        scale={HILL_SCALE}
        position={HILL_POSITION}
        visible={true}
      >
        <dayNightMaterial
          ref={hillMaterialRef}
          uDayDiffuse={bakedTexture}
          uNightDiffuse={bakeNightTexture}
          uShadowMap={hillPatchesTexture}
          uHasShadowMap={!!hillPatchesTexture}
          color={"#aaaaaa"}
        />
      </mesh>
    </group>
  );
}
