import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Smoke({ opacity = 1 }: { opacity?: number } = {}) {
  const smokeMaterial = useRef<THREE.ShaderMaterial>(null!);
  const perlinTexture = useTexture(TEXTURES.PERLIN_NOISE);
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  useFrame((state) => {
    smokeMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    smokeMaterial.current.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh position={[75, -5, 8]} scale={[8, 25, 8]}>
      <planeGeometry args={[1, 1, 16, 64]} />
      <smokeMaterial
        ref={smokeMaterial}
        uPerlinTexture={perlinTexture}
        uTime={0}
        uOpacity={opacity}
      />
    </mesh>
  );
}
