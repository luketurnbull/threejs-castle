import Scene from "./scene";
import {
  BakeShadows,
  OrbitControls,
  Sky,
  AdaptiveDpr,
  AdaptiveEvents,
  Cloud,
  Bvh,
  Stats,
} from "@react-three/drei";
import "./grass-material";

export default function Experience() {
  return (
    <>
      <ambientLight color="white" intensity={10} />

      <Scene />

      <OrbitControls
        minPolarAngle={Math.PI * 0.4}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
        makeDefault={true}
        enableDamping={true}
        dampingFactor={0.05}
        enablePan={false}
      />

      <BakeShadows />
      <Bvh firstHitOnly={true} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Stats />
    </>
  );
}
