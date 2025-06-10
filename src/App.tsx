import { Canvas } from "@react-three/fiber";
import Experience from "./components/experience";
import LoadingScreen from "./components/loading-screen";
import { useState } from "react";
import backgroundSounds from "./assets/background.mp3";

function App() {
  const [started, setStarted] = useState(false);
  const [backgroundAudio] = useState(() => new Audio(backgroundSounds));

  if (!started) {
    return (
      <LoadingScreen
        onStart={() => {
          setStarted(true);
          backgroundAudio.loop = true;
          backgroundAudio.play();
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{
          position: [-150, 5, 15],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}

export default App;
