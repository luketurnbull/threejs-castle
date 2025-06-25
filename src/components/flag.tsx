import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useAppStore } from "@/store";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

const HOVER_TRANSITION_SPEED = 2.0; // Speed of hover transition

export default function Flag() {
  const flagMaterial = useRef<THREE.ShaderMaterial>(null!);
  const alphaMap = useAppStore((state) => state.flag);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3());
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTransition, setHoverTransition] = useState(0.0);
  const { camera, raycaster, pointer } = useThree();
  const flagRef = useRef<THREE.Mesh>(null!);

  const mode = useAppStore((state) => state.mode);
  const transitionStartTimeRef = useRef<number>(0);
  const previousModeRef = useRef<string>("day");

  // Reset transition start time when mode changes
  useEffect(() => {
    if (mode !== previousModeRef.current) {
      transitionStartTimeRef.current = 0;
      previousModeRef.current = mode;
    }
  }, [mode]);

  useFrame((state, delta) => {
    if (flagMaterial.current && flagRef.current) {
      // Update time uniform
      flagMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;

      // Update mouse position in world space
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(flagRef.current);

      if (intersects.length > 0) {
        setMousePosition(intersects[0].point);
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }

      // Smoothly transition hover state
      const targetHover = isHovered ? 1.0 : 0.0;
      const newHoverTransition = THREE.MathUtils.lerp(
        hoverTransition,
        targetHover,
        delta * HOVER_TRANSITION_SPEED
      );
      setHoverTransition(newHoverTransition);

      // Pass mouse position and smooth hover transition to shader
      flagMaterial.current.uniforms.uMousePosition.value = mousePosition;
      flagMaterial.current.uniforms.uIsHovered.value = newHoverTransition;

      // Day/Night Transition
      const targetTransition = mode === "day" ? 0 : 1;
      // Start timing the transition
      if (transitionStartTimeRef.current === 0) {
        transitionStartTimeRef.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - transitionStartTimeRef.current;
      const progress = Math.min(elapsed / NIGHT_TIME_TRANSITION_DURATION, 1);

      const easedProgress = progress * progress * (3 - 2 * progress);
      const transitionValue =
        targetTransition === 1 ? easedProgress : 1 - easedProgress;
      flagMaterial.current.uniforms.uTransitionFactor.value = transitionValue;
    }
  });

  return (
    <group position={[-2, 42, 0.1]}>
      <mesh ref={flagRef} rotation-y={Math.PI * 1.5} position={[0, 3.2, 4.3]}>
        <planeGeometry args={[9, 6, 32, 32]} />
        <flagMaterial
          ref={flagMaterial}
          uAlphaMap={alphaMap}
          uSunPosition={new THREE.Vector3(4, 0.25, -12)}
          uMousePosition={mousePosition}
          uIsHovered={hoverTransition}
          uDayColor={new THREE.Color("#ff0000")}
          uNightColor={new THREE.Color("#4d0000")}
        />
      </mesh>
    </group>
  );
}
