import { useAppStore } from "@/store";
import { Button } from "./ui/button";
import { Volume2, VolumeOff, Play } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { useEffect, useState } from "react";

export default function ControlPanel() {
  const audioEnabled = useAppStore((state) => state.audioEnabled);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const loadingState = useAppStore((state) => state.loadingState);
  const started = useAppStore((state) => state.started);
  const start = useAppStore((state) => state.start);
  const [showStartButton, setShowStartButton] = useState(false);

  // Animate start button appearance when truly complete
  useEffect(() => {
    if (loadingState === "complete" && !started) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowStartButton(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowStartButton(false);
    }
  }, [loadingState, started]);

  // Show start button when loading is complete but not started
  if (
    (loadingState === "daytime-complete" || loadingState === "complete") &&
    !started
  ) {
    return (
      <div className="fixed bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <Button
          size="lg"
          onClick={start}
          className={`flex items-center gap-2 px-8 py-4 text-lg transition-all duration-700 ease-out ${
            showStartButton
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <Play className="w-6 h-6" />
          Start Experience
        </Button>
      </div>
    );
  }

  // Show controls only after started
  if (!started) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-y-2">
      <Button size="icon" onClick={toggleAudio}>
        {audioEnabled ? <Volume2 /> : <VolumeOff />}
      </Button>
      <ModeToggle />
    </div>
  );
}
