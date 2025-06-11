import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";

const textures = {
  TOWER_DIFFUSE: "./tower_diffuse.png",
  TOWER_NORMAL: "./tower_normal.png",
  TOWER_ROUGHNESS: "./tower_roughness.png",
};

export default function Tower() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(textures.TOWER_DIFFUSE);
  diffuse.flipY = false;

  const normal = useTexture(textures.TOWER_NORMAL);
  normal.flipY = false;

  const roughness = useTexture(textures.TOWER_ROUGHNESS);
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

useTexture.preload(textures.TOWER_DIFFUSE);
useTexture.preload(textures.TOWER_NORMAL);
useTexture.preload(textures.TOWER_ROUGHNESS);
