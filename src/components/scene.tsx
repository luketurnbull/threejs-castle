import type { JSX } from "react";
import { Tower } from "./tower";
import Grass from "./grass";
import { useGLTF } from "@react-three/drei";
import type { Model } from "@/types/model";
import {
  MeshStandardMaterial,
  DoubleSide,
  InstancedMesh,
  Object3D,
} from "three";
import { useMemo } from "react";

type WindowPosition = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  // Create window positions and rotations
  const windowPositions = useMemo<WindowPosition[]>(
    () => [
      { position: [-11.62, 27.204, -0.5], rotation: [-0.012, 0.044, 0.001] },
      { position: [-11.658, 11.996, -0.229], rotation: [-0.012, 0.044, 0.001] },
      { position: [6.292, 26.054, 6.59], rotation: [-3.128, 0.528, 3.136] },
      { position: [8.098, 12.109, -2.783], rotation: [-3.128, -0.492, -3.134] },
      { position: [3.646, 26.821, -8.355], rotation: [-3.114, -1.129, -3.116] },
      { position: [-8.463, 20.556, 7.702], rotation: [-0.022, 1.014, 0.02] },
    ],
    []
  );

  // Create instanced mesh
  const instancedMesh = useMemo(() => {
    const windowMaterial = new MeshStandardMaterial({
      color: "#000000",
      side: DoubleSide,
    });

    const mesh = new InstancedMesh(
      nodes.windowInside.geometry,
      windowMaterial,
      windowPositions.length
    );

    const tempObject = new Object3D();

    windowPositions.forEach(({ position, rotation }, i) => {
      tempObject.position.set(position[0], position[1], position[2]);
      tempObject.rotation.set(rotation[0], rotation[1], rotation[2]);
      tempObject.scale.set(0.226, 0.226, 0.5);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });

    return mesh;
  }, [nodes.windowInside.geometry, windowPositions]);

  return (
    <group {...props} dispose={null}>
      <Tower />
      <Grass />
      <primitive object={instancedMesh} />
    </group>
  );
}
