import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Flag from "./flag";
import * as THREE from "three";
import Objects from "./objects";
// import Smoke from "./smoke";

type SceneProps = JSX.IntrinsicElements["group"] & {
  sunPosition: THREE.Vector3;
};

export default function Scene({ sunPosition, ...props }: SceneProps) {
  return (
    <group {...props} dispose={null}>
      <Flag sunPosition={sunPosition} />
      <Tower />
      <Windows />
      <Objects />
      {/* <Smoke /> */}
      <Grass />
    </group>
  );
}
