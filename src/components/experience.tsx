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
  const loadingState = useAppStore((state) => state.loadingState);

  useEffect(() => {
    if (gl && loadingState === "idle") {
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
  const started = useAppStore((state) => state.started);

  return (
    <OrbitControls
      minPolarAngle={Math.PI * 0.4}
      maxPolarAngle={Math.PI * 0.52}
      enableZoom={true}
      minDistance={110}
      maxDistance={180}
      makeDefault={true}
      enablePan={false}
      enableDamping={true}
      dampingFactor={0.02}
      enabled={started}
      panSpeed={0.05}
      zoomSpeed={0.06}
    />
  );
}
