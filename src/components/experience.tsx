import Scene from "./scene";
import {
  BakeShadows,
  OrbitControls,
  Sky,
  useGLTF,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  Cloud,
} from "@react-three/drei";
import "./grass-material";

export default function Experience() {
  return (
    <>
      <ambientLight color="white" intensity={10} />
      <Sky
        distance={600000}
        sunPosition={[4, 0.25, -12]}
        rayleigh={4}
        turbidity={10}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      <Cloud
        position={[0, 110, -50]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <Cloud
        position={[150, 60, 150]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <OrbitControls
        minPolarAngle={Math.PI * 0.4}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
        makeDefault={true}
        enableDamping={true}
        dampingFactor={0.05}
        enablePan={false}
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
