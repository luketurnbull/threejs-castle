import { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";
import { useFrame } from "@react-three/fiber";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import { useAppStore } from "@/store";

export default function Objects() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const mode = useAppStore((state) => state.mode);

  const diffuse = useTexture(TEXTURES.OBJECTS_DIFFUSE);
  diffuse.flipY = false;

  const diffuseNight = useTexture(TEXTURES.OBJECTS_DIFFUSE_NIGHT);
  diffuseNight.flipY = false;

  useEffect(() => {
    const geometry = nodes.objects.geometry;
    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  const targetTransition = mode === "day" ? 0 : 1;

  useFrame((_, delta) => {
    const speed = delta / NIGHT_TIME_TRANSITION_DURATION;

    if (materialRef.current) {
      const current = materialRef.current.uniforms.uTransitionFactor.value;
      const newValue = THREE.MathUtils.lerp(current, targetTransition, speed);
      materialRef.current.uniforms.uTransitionFactor.value = newValue;
    }
  });

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.objects.geometry}
      material={nodes.objects.material}
      position={[7.225, 2.852, 16.36]}
      scale={[1, 1.542, 1]}
    >
      <dayNightMaterial
        ref={materialRef}
        uDayDiffuse={diffuse}
        uNightDiffuse={diffuseNight}
      />
    </mesh>
  );
}
