import type { JSX } from "react";
import Hill from "./hill";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";
import { useAppStore } from "@/store";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const loadingState = useAppStore((state) => state.loadingState);

  if (loadingState !== "complete") {
    return null;
  }

  return (
    <group {...props} dispose={null}>
      <Flag />
      <Smoke />
      <Windows />
      <Objects />
      <Hill />
    </group>
  );
}
