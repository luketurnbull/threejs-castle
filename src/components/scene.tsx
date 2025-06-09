import type { JSX } from "react";
import { Tower } from "./tower";
import Grass from "./grass";
import { useGLTF } from "@react-three/drei";
import type { Model } from "@/types/model";
import { MeshStandardMaterial, DoubleSide } from "three";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;
  const windowMaterial = new MeshStandardMaterial({
    color: "#000000",
    side: DoubleSide,
  });

  return (
    <group {...props} dispose={null}>
      <Tower />
      <Grass />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside.geometry}
        material={windowMaterial}
        position={[-11.62, 27.204, -0.5]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside001.geometry}
        material={windowMaterial}
        position={[-11.658, 11.996, -0.229]}
        rotation={[-0.012, 0.044, 0.001]}
        scale={[0.226, 0.226, 0.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside002.geometry}
        material={windowMaterial}
        position={[6.292, 26.054, 6.59]}
        rotation={[-3.128, 0.528, 3.136]}
        scale={[0.226, 0.226, 0.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside003.geometry}
        material={windowMaterial}
        position={[8.098, 12.109, -2.783]}
        rotation={[-3.128, -0.492, -3.134]}
        scale={[0.226, 0.226, 0.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside005.geometry}
        material={windowMaterial}
        position={[3.646, 26.821, -8.355]}
        rotation={[-3.114, -1.129, -3.116]}
        scale={[0.226, 0.226, 0.5]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.windowInside006.geometry}
        material={windowMaterial}
        position={[-8.463, 20.556, 7.702]}
        rotation={[-0.022, 1.014, 0.02]}
        scale={[0.226, 0.226, 0.5]}
      />
    </group>
  );
}
