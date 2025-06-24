import { useEffect, useRef } from "react";
import { useKTX2 } from "@react-three/drei";
import * as THREE from "three";
import { TEXTURES } from "../constants/assets";
import { useFrame } from "@react-three/fiber";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import { useAppStore } from "@/store";

export default function Objects({
  geometry,
}: {
  geometry: THREE.BufferGeometry;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const transitionStartTimeRef = useRef<number>(0);
  const previousModeRef = useRef<string>("day");

  const mode = useAppStore((state) => state.mode);

  const diffuse = useKTX2(TEXTURES.OBJECTS_DIFFUSE_COMPRESSED, "/basis/");
  diffuse.flipY = false;

  const diffuseNight = useKTX2(
    TEXTURES.OBJECTS_DIFFUSE_NIGHT_COMPRESSED,
    "/basis/"
  );
  diffuseNight.flipY = false;

  const diffuseNightDim = useKTX2(
    TEXTURES.OBJECTS_DIFFUSE_NIGHT_DIM_COMPRESSED,
    "/basis/"
  );
  diffuseNightDim.flipY = false;

  useEffect(() => {
    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [geometry]);

  const targetTransition = mode === "day" ? 0 : 1;

  // Reset transition start time when mode changes
  useEffect(() => {
    if (mode !== previousModeRef.current) {
      transitionStartTimeRef.current = 0;
      previousModeRef.current = mode;
    }
  }, [mode]);

  useFrame((state) => {
    if (materialRef.current) {
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
      materialRef.current.uniforms.uTransitionFactor.value = transitionValue;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      material={materialRef.current}
      position={[5.043, 7.913, 7.884]}
      rotation={[Math.PI / 2, 0, -0.737]}
      scale={4.22}
    >
      <dayNightMaterial
        ref={materialRef}
        uDayDiffuse={diffuse}
        uNightDiffuse={diffuseNight}
        uNightDiffuseDim={diffuseNightDim}
      />
    </mesh>
  );
}
