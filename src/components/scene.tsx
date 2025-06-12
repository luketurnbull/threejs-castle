import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Rocks from "./rocks";
import { Cloud, Sky } from "@react-three/drei";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <>
      <Sky
        distance={600000}
        sunPosition={[4, 0.25, -12]}
        rayleigh={4}
        turbidity={10}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      <Cloud
        position={[0, 110, -50]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <Cloud
        position={[150, 60, 150]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <group {...props} dispose={null}>
        <Tower />
        <Grass />
        <Windows />
        <Rocks />
      </group>
    </>
  );
}
