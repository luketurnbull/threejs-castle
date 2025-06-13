import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Rocks from "./rocks";
import Flag from "./flag";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Flag />
      <Tower />
      <Windows />
      <Rocks />
      <Grass />
    </group>
  );
}
