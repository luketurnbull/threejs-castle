import { Canvas } from "@react-three/fiber";
import Experience from "./experience";
import { Button } from "./ui/button";
import { VolumeOff, Volume2 } from "lucide-react";
import { useAppStore } from "../store";

export default function Castle() {
  return (
    <>
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
      <ControlPanel />
    </>
  );
}

function ControlPanel() {
  const { audioEnabled, toggleAudio } = useAppStore();

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button size="icon" onClick={toggleAudio}>
        {audioEnabled ? <Volume2 /> : <VolumeOff />}
      </Button>
    </div>
  );
}
