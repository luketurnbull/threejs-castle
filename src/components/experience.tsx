import Scene from "./scene";
import { BakeShadows, OrbitControls, Sky, useGLTF } from "@react-three/drei";
import "./grass-material";

export default function Experience() {
  return (
    <>
      <ambientLight color="white" intensity={4} />
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
      />

      <Scene />

      <BakeShadows />
    </>
  );
}

useGLTF.preload("/tower-with-hill-3.glb", true);
