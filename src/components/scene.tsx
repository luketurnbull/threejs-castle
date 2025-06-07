import type { JSX } from "react";
import { Tower } from "./tower";
import Grass from "./grass";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Tower />
      <Grass />
    </group>
  );
}
