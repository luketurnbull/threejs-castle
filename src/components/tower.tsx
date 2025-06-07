import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import "./grass-material/grassMaterial";
import type { Model } from "../types/model";

export function Tower() {
  const { nodes } = useGLTF("/tower-with-hill-3.glb", true) as unknown as Model;

  const diffuse = useTexture("./towerDiffuse.png");
  diffuse.flipY = false;

  useEffect(() => {
    const geometry = nodes.towerMainShaft.geometry;
    geometry.attributes.uv = geometry.attributes.uv1;
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  const shadowMap = useTexture("./hillShadow.png");
  shadowMap.flipY = false;

  return (
    <>
      <mesh
        geometry={nodes.towerMainShaft.geometry}
        position={[-1.617, 0, 0.229]}
        scale={10}
      >
        <meshStandardMaterial map={diffuse} />
      </mesh>
      <mesh
        geometry={nodes.windowInside.geometry}
        material={nodes.windowInside.material}
        position={[-11.648, 28.151, -0.501]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
    </>
  );
}
