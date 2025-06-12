import type { JSX } from "react";
import Tower from "./tower";
import Grass from "./grass";
import Windows from "./windows";
import Rocks from "./rocks";
import { Cloud, Sky } from "@react-three/drei";
import WavingFlag from "./waving-flag/waving-flag";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
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
      <Tower />
      <Grass />
      <Windows />
      <Rocks />
      <WavingFlag />
    </group>
  );
}
