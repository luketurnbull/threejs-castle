import Scene from "./scene";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh,
  OrbitControls,
} from "@react-three/drei";
import "./grass-material";
import "./flag-material";
import "./smoke-material";
import "./day-night-material";
import SkySettings from "./sky-settings";
import CloudSettings from "./cloud-settings";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useAppStore } from "@/store";

export default function Experience() {
  const { gl } = useThree();
  const init = useAppStore((state) => state.init);

  useEffect(() => {
    if (gl) {
      void init(gl);
    }
  }, [gl, init]);

  return (
    <>
      <SkySettings />
      <CloudSettings />
      <Scene />
      <Controls />

      <Bvh firstHitOnly={true} />
      <AdaptiveDpr pixelated={true} />
      <AdaptiveEvents />
    </>
  );
}

function Controls() {
  const loadingState = useAppStore((state) => state.loadingState);

  if (loadingState !== "complete") {
    return null;
  }

  return (
    <OrbitControls
      minPolarAngle={Math.PI * 0.45}
      maxPolarAngle={Math.PI * 0.55}
      enableZoom={false}
      makeDefault={true}
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
