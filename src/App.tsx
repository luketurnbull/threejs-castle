import { Canvas } from "@react-three/fiber";
import { Tower } from "./components/tower";
import { OrbitControls, Sky } from "@react-three/drei";

function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [0, 50, 150],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <Sky azimuth={1} inclination={0.6} distance={1000} />
        <OrbitControls
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
          enableZoom={false}
        />
        <ambientLight color="white" intensity={5} />
        <Tower />
      </Canvas>
    </div>
  );
}

export default App;
