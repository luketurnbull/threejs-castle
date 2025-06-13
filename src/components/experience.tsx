import Scene from "./scene";
import {
  BakeShadows,
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh,
  Stats,
  Sky,
  Cloud,
} from "@react-three/drei";
import "./grass-material";
import "./flag-material";
import { useState } from "react";
import * as THREE from "three";

export default function Experience() {
  const [sunPosition] = useState(() => new THREE.Vector3(4, 0.25, -12));

  return (
    <>
      <ambientLight color="white" intensity={10} />

      <Scene sunPosition={sunPosition} />

      <Sky
        distance={600000}
        sunPosition={[sunPosition.x, sunPosition.y, sunPosition.z]}
        rayleigh={4}
        turbidity={10}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      <Cloud
        position={[0, 120, -50]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <Cloud
        position={[200, 60, 200]}
        scale={[40, 40, 40]}
        opacity={0.8}
        speed={0.2}
      />

      <OrbitControls
        minPolarAngle={Math.PI * 0.35}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
        makeDefault={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <BakeShadows />
      <Bvh firstHitOnly={true} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Stats />
    </>
  );
}
