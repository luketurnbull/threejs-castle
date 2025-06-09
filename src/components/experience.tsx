import Scene from "./scene";
import {
  BakeShadows,
  OrbitControls,
  Sky,
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";
import "./grass-material";

export default function Experience() {
  return (
    <>
      <ambientLight color="white" intensity={20} />
      <Sky
        azimuth={0.1}
        inclination={0.6}
        distance={1000}
        sunPosition={[-50, 20, -100]}
      />

      <OrbitControls
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <Scene />

      <BakeShadows />
      <Preload all={true} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

useGLTF.preload("/scene.glb", true);
