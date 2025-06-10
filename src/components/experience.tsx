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
        distance={1000}
        sunPosition={[38, 2, -100]}
        rayleigh={4}
        turbidity={10}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      <OrbitControls
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.5}
        // enableZoom={false}
        makeDefault={true}
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
