import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";

export default function Rocks() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(TEXTURES.ROCK_DIFFUSE);
  diffuse.flipY = false;

  useEffect(() => {
    const geometry = nodes.objects.geometry;

    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.objects.geometry}
      material={nodes.objects.material}
      position={[7.225, 2.852, 16.36]}
      scale={[1, 1.542, 1]}
    >
      <meshStandardMaterial map={diffuse} />
    </mesh>
  );
}
