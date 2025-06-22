import { TEXTURES } from "@/constants/assets";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useAppStore } from "@/store";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

export default function Smoke() {
  const smokeMaterial = useRef<THREE.ShaderMaterial>(null!);
  const perlinTexture = useTexture(TEXTURES.PERLIN_NOISE);
  const mode = useAppStore((state) => state.mode);
  const [transitionValue, setTransitionValue] = useState(0.0);

  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  // Smooth transition effect
  useEffect(() => {
    const targetValue = mode === "night" ? 1.0 : 0.0;
    const duration = NIGHT_TIME_TRANSITION_DURATION * 1000;
    const startValue = transitionValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);

      // Smooth easing function
      const easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newValue = startValue + (targetValue - startValue) * easedProgress;
      setTransitionValue(newValue);

      if (progress < 1.0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [mode]);

  useFrame((state) => {
    smokeMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    smokeMaterial.current.uniforms.uMode.value = transitionValue;
  });

  return (
    <mesh position={[76, -15, 9]} scale={10}>
      <planeGeometry args={[1, 1, 32, 128]} />
      <smokeMaterial
        ref={smokeMaterial}
        uPerlinTexture={perlinTexture}
        uTime={0}
        uMode={transitionValue}
      />
    </mesh>
  );
}
