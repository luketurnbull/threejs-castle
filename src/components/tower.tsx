import * as THREE from "three";
import { useEffect, type JSX } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { type GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    towerMainShaft: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};

export function Tower(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/tower-with-hill-3.glb") as unknown as GLTFResult;

  const diffuse = useTexture("./towerDiffuse.png");
  diffuse.flipY = false;

  useEffect(() => {
    const geometry = nodes.towerMainShaft.geometry;

    // Check which UV map has the correct layout
    console.log("UV map 0 (uv):", geometry.attributes.uv.array.slice(0, 10));
    console.log("UV map 1 (uv1):", geometry.attributes.uv1.array.slice(0, 10));

    // Use the second UV map (likely your baking UV)
    geometry.attributes.uv = geometry.attributes.uv1;

    // Force geometry to update
    geometry.attributes.uv.needsUpdate = true;
  }, [nodes]);

  const shadowMap = useTexture("./hillShadow.png");
  shadowMap.flipY = false;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.hill.geometry}
        scale={[119.355, 60.27, 119.355]}
      >
        <meshStandardMaterial color={"green"} aoMap={shadowMap} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.towerMainShaft.geometry}
        position={[-1.617, 0, 0.229]}
        scale={10}
      >
        <meshStandardMaterial map={diffuse} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside.geometry}
        material={nodes.windowInside.material}
        position={[-11.648, 28.151, -0.501]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
    </group>
  );
}

useGLTF.preload("/tower-with-hill-3.glb");
