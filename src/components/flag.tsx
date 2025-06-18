import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const HOVER_TRANSITION_SPEED = 2.0; // Speed of hover transition

export default function Flag() {
  const flagMaterial = useRef<THREE.ShaderMaterial>(null!);
  const alphaMap = useTexture(TEXTURES.FLAG_ALPHA);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3());
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTransition, setHoverTransition] = useState(0.0);
  const { camera, raycaster, pointer } = useThree();
  const flagRef = useRef<THREE.Mesh>(null!);

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
        />
      </mesh>
    </group>
  );
}
