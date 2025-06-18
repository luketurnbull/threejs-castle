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

export default function Experience() {
  return (
    <>
      <ambientLight color="white" intensity={18} />
      <SkySettings />

      <Scene />

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
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Stats />
    </>
  );
}

function SkySettings() {
  const sunPosition = useAppStore((state) => state.sunPosition);

  return (
    <Sky
      distance={600000}
      sunPosition={[sunPosition.x, sunPosition.y, sunPosition.z]}
      rayleigh={4}
      turbidity={10}
      mieCoefficient={0.004}
      mieDirectionalG={0.8}
    />
  );
}
