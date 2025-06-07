import { Canvas } from "@react-three/fiber";
import Experience from "./components/experience";

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
        <Experience />
      </Canvas>
    </div>
  );
}

export default App;
