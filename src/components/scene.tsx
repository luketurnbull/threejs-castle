import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Rocks from "./rocks";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Tower />
      <Grass />
      <Windows />
      <Rocks />
    </group>
  );
}
