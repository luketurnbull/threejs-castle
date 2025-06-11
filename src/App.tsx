import { Canvas } from "@react-three/fiber";
import Experience from "./components/experience";
import LoadingScreen from "./components/loading-screen";
import { useState } from "react";
import backgroundSounds from "./assets/background.mp3";

function App() {
  const [started, setStarted] = useState(false);
  const [backgroundAudio] = useState(() => new Audio(backgroundSounds));

  return (
    <div className="h-screen w-screen relative">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          started ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
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

      {!started && (
        <LoadingScreen
          onStart={() => {
            setStarted(true);
            backgroundAudio.loop = true;
            backgroundAudio.volume = 0.6;
            backgroundAudio.play();
          }}
        />
      )}
    </div>
  );
}

export default App;
