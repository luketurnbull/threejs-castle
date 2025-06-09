import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Model } from "../types/model";
import rustleAudio from "../assets/leavesRustling2.mp3";

const NUM_BLADES = 80000;
const HILL_SCALE = new THREE.Vector3(119.355, 60.27, 119.355);

// Audio settings
const MIN_DISTANCE = 60; // Distance at which volume will be 1
const MAX_DISTANCE = 200; // Distance at which volume will be 0
const FADE_SPEED = 0.05; // Speed of volume fade in/out
const STOP_DELAY = 200; // Delay before stopping sound (ms)

function createBladeGeometry() {
  const geometry = new THREE.PlaneGeometry(0.2, 1, 1, 4);
  geometry.translate(0, 0.5, 0);
  return geometry;
}

export default function Grass() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const hillRef = useRef<THREE.Mesh>(null!);
  const prevPointerRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const targetVolumeRef = useRef<number>(0);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rustleSound] = useState<HTMLAudioElement>(() => {
    const audio = new Audio(rustleAudio);
    audio.loop = true;
    return audio;
  });

  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;
  const hillGeom = nodes.hill.geometry;

  const texture = useTexture("./blade_diffuse.jpg");
  const alphaMap = useTexture("./blade_alpha.jpg");
  const bakedTexture = useTexture("./hill_baked.png");
  bakedTexture.flipY = false;

  const baseGeom = useMemo(() => createBladeGeometry(), []);

  const { camera, raycaster, pointer } = useThree();

  const grassAttributes = useMemo(() => {
    const offsets = [];
    const orientations = [];
    const stretches = [];
    const halfRootAngleSin = [];
    const halfRootAngleCos = [];
    const hillUVs = [];

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

      // Normal
      const nA = new THREE.Vector3().fromBufferAttribute(
        hillGeom.attributes.normal,
        a
      );

      const nB = new THREE.Vector3().fromBufferAttribute(
        hillGeom.attributes.normal,
        b
      );

      const nC = new THREE.Vector3().fromBufferAttribute(
        hillGeom.attributes.normal,
        c
      );

      const normal = new THREE.Vector3()
        .addScaledVector(nA, u)
        .addScaledVector(nB, v)
        .addScaledVector(nC, w)
        .normalize();

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

      hillUVs.push(uv.x, uv.y);

      // Apply scale
      point.multiply(HILL_SCALE);
      offsets.push(point.x, point.y, point.z);

      // Orientation: align Y axis with normal
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
      orientations.push(quat.x, quat.y, quat.z, quat.w);

      // Random stretch
      const stretch = 0.7 + Math.random() * 0.6;
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
  }, [hillGeom]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.25;

      // Update player position based on mouse position
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObject(hillRef.current);

      if (hits.length > 0) {
        const hitPoint = hits[0].point;

        // Check if cursor has moved
        const hasMoved = !pointer.equals(prevPointerRef.current);
        prevPointerRef.current.copy(pointer);

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
          if (rustleSound.paused) {
            rustleSound.currentTime = 0;
            rustleSound.volume = normalizedVolume; // Set initial volume immediately
            rustleSound.play();
          } else {
            // Only use fade for subsequent volume changes
            targetVolumeRef.current = normalizedVolume;
          }

          materialRef.current.uniforms.playerPosition.value.copy(hitPoint);
        } else {
          // Set up timeout to stop sound if no movement
          if (!stopTimeoutRef.current) {
            stopTimeoutRef.current = setTimeout(() => {
              targetVolumeRef.current = 0;
            }, STOP_DELAY);
          }
        }

        // Smoothly adjust volume towards target
        const currentVolume = rustleSound.volume;
        const volumeDiff = targetVolumeRef.current - currentVolume;
        rustleSound.volume = currentVolume + volumeDiff * FADE_SPEED;

        // Stop sound if volume is very low
        if (rustleSound.volume < 0.01 && !hasMoved) {
          rustleSound.pause();
          rustleSound.volume = 0;
        }
      } else {
        // When not hovering over hill, immediately stop the sound
        if (stopTimeoutRef.current) {
          clearTimeout(stopTimeoutRef.current);
          stopTimeoutRef.current = null;
        }

        targetVolumeRef.current = 0;
        rustleSound.pause();
        rustleSound.volume = 0;
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
          bladeHeight={6}
          brightness={30.0}
          aoMap={bakedTexture}
        />
      </mesh>
      <mesh
        ref={hillRef}
        geometry={nodes.hill.geometry}
        scale={HILL_SCALE}
        position={[4.324, 3.324, -0.949]}
        visible={true}
      >
        <meshStandardMaterial color={"#060f05"} />
      </mesh>
    </group>
  );
}
