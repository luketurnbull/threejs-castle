import { useAppStore } from "@/store";
import { Button } from "./ui/button";
import { Volume2, VolumeOff } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";

export default function ControlPanel() {
  const audioEnabled = useAppStore((state) => state.audioEnabled);
  const toggleAudio = useAppStore((state) => state.toggleAudio);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-y-2">
      <Button size="icon" onClick={toggleAudio}>
        {audioEnabled ? <Volume2 /> : <VolumeOff />}
      </Button>
      <ModeToggle />
    </div>
  );
}
