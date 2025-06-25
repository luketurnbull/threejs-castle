import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import Grass from "./grass";

const HILL_SCALE = new THREE.Vector3(131.333, 95.653, 131.333);
const HILL_POSITION = new THREE.Vector3(-1.637, -89.253, 0.168);

export default function Hill() {
  const hillMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const transitionStartTimeRef = useRef<number>(0);
  const previousModeRef = useRef<string>("day");

  const hillMesh = useAppStore((state) => state.hillMesh);
  const bakedTexture = useAppStore((state) => state.hill_day);
  const bakeNightTexture = useAppStore((state) => state.hill_night);
  const bakeNightDimTexture = useAppStore((state) => state.hill_nightDim);
  const hillPatchesTexture = useAppStore((state) => state.hill_patches);
  const mode = useAppStore((state) => state.mode);

  // Check if all required textures and mesh are loaded
  const texturesLoaded = bakedTexture && hillPatchesTexture;

  useEffect(() => {
    if (hillMesh) {
      hillMesh.geometry.attributes.uv = hillMesh.geometry.attributes.uv1;
      hillMesh.geometry.attributes.uv.needsUpdate = true;
    }
  }, [hillMesh]);

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
      hillMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Don't render if textures or mesh aren't loaded
  if (!texturesLoaded || !hillMesh) {
    return null;
  }

  return (
    <group>
      {/* Ground mesh */}
      <mesh
        geometry={hillMesh.geometry}
        scale={HILL_SCALE}
        position={HILL_POSITION}
        visible={true}
      >
        <dayNightMaterial
          ref={hillMaterialRef}
          uDayDiffuse={bakedTexture}
          uNightDiffuse={bakeNightTexture}
          uNightDiffuseDim={bakeNightDimTexture}
          uShadowMap={hillPatchesTexture}
          uHasShadowMap={!!hillPatchesTexture}
        />
      </mesh>

      {/* Grass */}
      <Grass geometry={hillMesh.geometry} />
    </group>
  );
}
