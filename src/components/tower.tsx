import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";

export default function Tower() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture("./tower_diffuse.png");
  diffuse.flipY = false;

  const normal = useTexture("./tower_normal.png");
  normal.flipY = false;

  const roughness = useTexture("./tower_roughness.png");
  roughness.flipY = false;

  useEffect(() => {
    const geometry = nodes.tower.geometry;

    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  return (
    <>
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
    </>
  );
}
