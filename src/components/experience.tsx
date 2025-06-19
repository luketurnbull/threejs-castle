import Scene from "./scene";
import {
  BakeShadows,
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh,
  Stats,
} from "@react-three/drei";
import "./grass-material";
import "./flag-material";
import "./smoke-material";
import "./day-night-material";
import SkySettings from "./sky-settings";
import LightSettings from "./light-settings";
import CloudSettings from "./cloud-settings";

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
