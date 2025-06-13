import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Flag() {
  const flagMaterial = useRef<THREE.ShaderMaterial>(null!);
  const alphaMap = useTexture(TEXTURES.FLAG_ALPHA);

  useFrame((state) => {
    if (flagMaterial.current) {
      flagMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, 40, 0]}>
      <mesh scale={0.05}>
        <cylinderGeometry args={[5, 5, 250, 32]} />
        <meshBasicMaterial color={"black"} />
      </mesh>
      <mesh rotation-y={Math.PI * 1.5} position={[0, 3.2, 4.3]}>
        <planeGeometry args={[9, 6, 32, 32]} />
        <flagMaterial ref={flagMaterial} uAlphaMap={alphaMap} />
      </mesh>
    </group>
  );
}
