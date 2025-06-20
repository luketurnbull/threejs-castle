import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Fire from "./fire";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Flag />
      <Tower />
      <Windows />
      <Objects />
      <Grass />
      <Fire />
    </group>
  );
}
