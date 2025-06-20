import { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store";

export default function Tower() {
  const towerMaterialRef = useRef<THREE.ShaderMaterial>(null!);
  const doorMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(TEXTURES.TOWER_DIFFUSE);
  diffuse.flipY = false;

  const diffuseNight = useTexture(TEXTURES.TOWER_DIFFUSE_NIGHT);
  diffuseNight.flipY = false;

  const mode = useAppStore((state) => state.mode);

  const targetTransition = mode === "day" ? 0 : 1;

  useFrame((_, delta) => {
    const speed = delta / NIGHT_TIME_TRANSITION_DURATION;

    if (towerMaterialRef.current) {
      const current = towerMaterialRef.current.uniforms.uTransitionFactor.value;
      const newValue = THREE.MathUtils.lerp(current, targetTransition, speed);
      towerMaterialRef.current.uniforms.uTransitionFactor.value = newValue;
    }

    if (doorMaterialRef.current) {
      const current = doorMaterialRef.current.uniforms.uTransitionFactor.value;
      const newValue = THREE.MathUtils.lerp(current, targetTransition, speed);
      doorMaterialRef.current.uniforms.uTransitionFactor.value = newValue;
    }
  });

  const doorDiffuse = useTexture(TEXTURES.DOOR_DIFFUSE);
  doorDiffuse.flipY = false;

  const doorDiffuseNight = useTexture(TEXTURES.DOOR_DIFFUSE_NIGHT);
  doorDiffuseNight.flipY = false;

  useEffect(() => {
    const towerGeometry = nodes.tower.geometry;
    const doorGeometry = nodes.door.geometry;

    towerGeometry.attributes.uv = towerGeometry.attributes.uv1;
    towerGeometry.attributes.uv.needsUpdate = true;

    doorGeometry.attributes.uv = doorGeometry.attributes.uv1;
    doorGeometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  return (
    <>
      <mesh
        geometry={nodes.tower.geometry}
        position={[5.043, 7.913, 7.884]}
        rotation={[Math.PI / 2, 0, -0.737]}
        scale={4.22}
      >
        <dayNightMaterial
          ref={towerMaterialRef}
          uDayDiffuse={diffuse}
          uNightDiffuse={diffuseNight}
        />
      </mesh>
      <mesh
        name="door"
        geometry={nodes.door.geometry}
        position={[5.765, 4.182, 8.243]}
        rotation={[-3.086, -0.697, 1.606]}
        scale={[0.192, 3.847, 0.691]}
      >
        <dayNightMaterial
          ref={doorMaterialRef}
          uDayDiffuse={doorDiffuse}
          uNightDiffuse={doorDiffuseNight}
        />
      </mesh>
    </>
  );
}
