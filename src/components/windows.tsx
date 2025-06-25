import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { windowMaterial, WindowMaterial } from "./window-material";
import { useAppStore } from "@/store";

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
  { position: [-8.512, 20.556, 7.78], rotation: [-0.022, 1.014, 0.02] },
];

interface WindowsProps {
  groupPosition?: [number, number, number];
}

export default function Windows({ groupPosition = [0, 0, 0] }: WindowsProps) {
  const windowInsideMesh = useAppStore((state) => state.windowInsideMesh);
  const loadingState = useAppStore((state) => state.loadingState);
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);

  // Create instanced mesh
  const instancedMesh = useMemo(() => {
    if (!windowInsideMesh) {
      return null;
    }

    const mesh = new THREE.InstancedMesh(
      windowInsideMesh.geometry,
      windowMaterial,
      windowPositions.length
    );

    const tempObject = new THREE.Object3D();

    // Create time offsets for each window
    const timeOffsets = new Float32Array(windowPositions.length);
    for (let i = 0; i < windowPositions.length; i++) {
      // Random offset between 0 and 2π to spread out the flickering
      timeOffsets[i] = Math.random() * Math.PI * 2;
    }

    // Add the time offset attribute
    mesh.geometry.setAttribute(
      "timeOffset",
      new THREE.InstancedBufferAttribute(timeOffsets, 1)
    );

    windowPositions.forEach(({ position, rotation }, i) => {
      tempObject.position.set(position[0], position[1], position[2]);
      tempObject.rotation.set(rotation[0], rotation[1], rotation[2]);
      tempObject.scale.set(0.226, 0.226, 0.5);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });

    return mesh;
  }, [windowInsideMesh]);

  // Update instanced mesh position when group position changes
  useEffect(() => {
    if (instancedMesh && instancedMeshRef.current) {
      const mesh = instancedMeshRef.current;
      const tempObject = new THREE.Object3D();

      windowPositions.forEach(({ position, rotation }, i) => {
        // Apply group position offset to each window
        tempObject.position.set(
          position[0] + groupPosition[0],
          position[1] + groupPosition[1],
          position[2] + groupPosition[2]
        );
        tempObject.rotation.set(rotation[0], rotation[1], rotation[2]);
        tempObject.scale.set(0.226, 0.226, 0.5);
        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    }
  }, [groupPosition, instancedMesh]);

  useEffect(() => {
    if (instancedMesh) {
      instancedMeshRef.current = instancedMesh;
    }
  }, [instancedMesh]);

  if (!instancedMesh) {
    return null;
  }

  return (
    <>
      <primitive object={instancedMesh} />
      <WindowMaterial />
    </>
  );
}
