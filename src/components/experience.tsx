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
import "./smoke-material";
import { useAppStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

export default function Experience() {
  return (
    <>
      <SkySettings />
      <LightSettings />
      <CloudSettings />

      <Scene />

      <OrbitControls
        minPolarAngle={Math.PI * 0.4}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
        makeDefault={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <BakeShadows />
      <Bvh firstHitOnly={true} />
      <AdaptiveDpr pixelated={true} />
      <AdaptiveEvents />
      <Stats />
    </>
  );
}

function SkySettings() {
  const mode = useAppStore((state) => state.mode);
  const [yPos, setYPos] = useState(0.25);

  useEffect(() => {
    if (mode === "night") {
      setYPos(-50);
    } else {
      setYPos(0.25);
    }
  }, [mode]);

  return (
    <Sky
      distance={600000}
      sunPosition={[4, yPos, -12]}
      rayleigh={4}
      turbidity={10}
      mieCoefficient={0.004}
      mieDirectionalG={0.8}
    />
  );
}

function LightSettings() {
  return <ambientLight color="white" intensity={18} />;
}

function CloudSettings() {
  return (
    <>
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
    </>
  );
}
