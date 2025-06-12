import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";

export default function Tower() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(TEXTURES.TOWER_DIFFUSE);
  diffuse.flipY = false;

  const normal = useTexture(TEXTURES.TOWER_NORMAL);
  normal.flipY = false;

  const roughness = useTexture(TEXTURES.TOWER_ROUGHNESS);
  roughness.flipY = false;

  useEffect(() => {
    const geometry = nodes.tower.geometry;

    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  return (
    <mesh
      geometry={nodes.tower.geometry}
      position={[-1.617, 0.627, 0.229]}
      scale={10}
    >
      <meshStandardMaterial
        map={diffuse}
        roughnessMap={roughness}
        normalMap={normal}
      />
    </mesh>
  );
}
