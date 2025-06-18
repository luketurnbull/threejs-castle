import { Canvas } from "@react-three/fiber";
import Experience from "./experience";
import { Button } from "./ui/button";
import { VolumeOff, Volume2, Sun, Moon } from "lucide-react";
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
  const audioEnabled = useAppStore((state) => state.audioEnabled);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const mode = useAppStore((state) => state.mode);
  const toggleMode = useAppStore((state) => state.toggleMode);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-y-2">
      <Button size="icon" onClick={toggleAudio}>
        {audioEnabled ? <Volume2 /> : <VolumeOff />}
      </Button>
      <Button size="icon" onClick={toggleMode}>
        {mode === "day" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
}
