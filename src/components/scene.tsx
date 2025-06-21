import type { JSX } from "react";
import Grass from "./grass";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Flag />
      <Windows />
      <Objects />
      <Smoke />
      <Grass />
    </group>
  );
}
