import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Smoke() {
  const smokeMaterial = useRef<THREE.ShaderMaterial>(null!);
  const perlinTexture = useTexture(TEXTURES.FLAG_ALPHA);
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  useFrame((state) => {
    smokeMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[50, 20, 50]} scale={[5, 25, 5]}>
      <planeGeometry args={[1, 1, 16, 64]} />
      <smokeMaterial ref={smokeMaterial} uPerlinTexture={perlinTexture} />
    </mesh>
  );
}
