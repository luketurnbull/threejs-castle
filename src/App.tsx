import { Canvas } from "@react-three/fiber";
import { Tower } from "./components/tower";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <OrbitControls />
        <ambientLight color="white" intensity={5} />
        <Tower />
      </Canvas>
    </div>
  );
}

export default App;
