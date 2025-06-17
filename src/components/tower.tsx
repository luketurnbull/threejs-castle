import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

import type { Model } from "../types/model";
import { TEXTURES } from "../constants/assets";

export default function Tower() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  const diffuse = useTexture(TEXTURES.TOWER_DIFFUSE);
  diffuse.flipY = false;

  const doorDiffuse = useTexture(TEXTURES.DOOR_DIFFUSE);
  doorDiffuse.flipY = false;

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
        <meshStandardMaterial map={diffuse} />
      </mesh>
      <mesh
        name="door"
        geometry={nodes.door.geometry}
        position={[5.765, 4.182, 8.243]}
        rotation={[-3.086, -0.697, 1.606]}
        scale={[0.192, 3.847, 0.691]}
      >
        <meshStandardMaterial map={doorDiffuse} />
      </mesh>
    </>
  );
}
