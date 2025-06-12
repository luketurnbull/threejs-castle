import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";

export default function Rocks() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(TEXTURES.ROCK_DIFFUSE);
  diffuse.flipY = false;

  const normal = useTexture(TEXTURES.ROCK_NORMAL);
  normal.flipY = false;

  useEffect(() => {
    const geometry = nodes.tower.geometry;

    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.rocks.geometry}
      material={nodes.rocks.material}
      position={[-39.969, -12.221, -27.737]}
      scale={[5.155, 4.241, 5.155]}
    >
      <meshStandardMaterial map={diffuse} normalMap={normal} />
    </mesh>
  );
}
