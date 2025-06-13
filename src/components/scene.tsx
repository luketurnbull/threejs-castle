import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Rocks from "./rocks";
import Flag from "./flag";
import * as THREE from "three";

type SceneProps = JSX.IntrinsicElements["group"] & {
  sunPosition: THREE.Vector3;
};

export default function Scene({ sunPosition, ...props }: SceneProps) {
  return (
    <group {...props} dispose={null}>
      <Flag sunPosition={sunPosition} />
      <Tower />
      <Windows />
      <Rocks />
      <Grass />
    </group>
  );
}
