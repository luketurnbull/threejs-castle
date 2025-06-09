import { useGLTF } from "@react-three/drei";
import type { Model } from "@/types/model";
import * as THREE from "three";
import { useMemo } from "react";
import { windowMaterial } from "./window-material";

type WindowPosition = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const windowPositions: WindowPosition[] = [
  { position: [-11.62, 27.204, -0.5], rotation: [-0.012, 0.044, 0.001] },
  { position: [-11.658, 11.996, -0.229], rotation: [-0.012, 0.044, 0.001] },
  { position: [6.292, 26.054, 6.59], rotation: [-3.128, 0.528, 3.136] },
  { position: [8.098, 12.109, -2.783], rotation: [-3.128, -0.492, -3.134] },
  { position: [3.646, 26.821, -8.355], rotation: [-3.114, -1.129, -3.116] },
  { position: [-8.463, 20.556, 7.702], rotation: [-0.022, 1.014, 0.02] },
];

export default function Windows() {
  const { nodes } = useGLTF("/scene.glb", true) as unknown as Model;

  // Create instanced mesh
  const instancedMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      nodes.windowInside.geometry,
      windowMaterial,
      windowPositions.length
    );

    const tempObject = new THREE.Object3D();

    windowPositions.forEach(({ position, rotation }, i) => {
      tempObject.position.set(position[0], position[1], position[2]);
      tempObject.rotation.set(rotation[0], rotation[1], rotation[2]);
      tempObject.scale.set(0.226, 0.226, 0.5);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });

    return mesh;
  }, [nodes.windowInside.geometry]);

  return <primitive object={instancedMesh} />;
}
