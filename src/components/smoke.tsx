import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useAppStore } from "@/store";

export default function Smoke() {
  const smokeMaterial = useRef<THREE.ShaderMaterial>(null!);
  const perlinTexture = useTexture(TEXTURES.PERLIN_NOISE);
  const mode = useAppStore((state) => state.mode);

  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  useFrame((state) => {
    smokeMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    smokeMaterial.current.uniforms.uMode.value = mode === "night" ? 1.0 : 0.0;
  });

  return (
    <mesh position={[76, -13, 9]} scale={10}>
      <planeGeometry args={[1, 1, 32, 128]} />
      <smokeMaterial
        ref={smokeMaterial}
        uPerlinTexture={perlinTexture}
        uTime={0}
        uMode={mode === "night" ? 1.0 : 0.0}
      />
    </mesh>
  );
}
