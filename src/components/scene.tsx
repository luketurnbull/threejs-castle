import type { JSX } from "react";
import Grass from "./grass";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";
import { useAppStore } from "@/store";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const hillMesh = useAppStore((state) => state.hillMesh);
  const objectsMesh = useAppStore((state) => state.objectsMesh);
  const windowInsideMesh = useAppStore((state) => state.windowInsideMesh);
  const loadingState = useAppStore((state) => state.loadingState);

  if (
    !hillMesh ||
    !objectsMesh ||
    !windowInsideMesh ||
    loadingState !== "complete"
  ) {
    return null;
  }

  return (
    <group {...props} dispose={null}>
      <Flag />
      <Smoke />
      <Windows geometry={windowInsideMesh.geometry} />
      <Objects geometry={objectsMesh.geometry} />
      <Grass geometry={hillMesh.geometry} />
    </group>
  );
}
