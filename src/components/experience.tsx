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
// import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Experience() {
  return (
    <>
      <SkySettings />
      <LightSettings />
      <CloudSettings />

      <Scene />

      {/* <EffectComposer enableNormalPass={true} resolutionScale={0.5}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.025}
          intensity={0.7}
        />
      </EffectComposer> */}

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
