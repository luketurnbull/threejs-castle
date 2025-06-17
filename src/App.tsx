import { Canvas } from "@react-three/fiber";
import Experience from "./components/experience";
import LoadingScreen from "./components/loading-screen";
import { useState } from "react";
import backgroundSounds from "./assets/background.mp3";

function App() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [backgroundAudio] = useState(() => new Audio(backgroundSounds));

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          started ? "opacity-100 scale-100" : "opacity-0"
        }`}
      >
        {ready && (
          <Canvas
            camera={{
              position: [146, 10, 39],
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
        )}
      </div>

      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          started
            ? "opacity-0 translate-y-full pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <LoadingScreen
          onStart={() => {
            setStarted(true);
            backgroundAudio.loop = true;
            backgroundAudio.volume = 0.5;
            backgroundAudio.play();
          }}
          onReady={() => {
            setReady(true);
          }}
        />
      </div>
    </div>
  );
}

export default App;
