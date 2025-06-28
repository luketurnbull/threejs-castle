import { useAppStore } from "@/store";
import { ModeToggle } from "./ui/mode-toggle";
import { useEffect, useState } from "react";

export default function ControlPanel() {
  const audioEnabled = useAppStore((state) => state.audioEnabled);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const loadingState = useAppStore((state) => state.loadingState);
  const audioLoaded = useAppStore((state) => state.audioLoaded);
  const started = useAppStore((state) => state.started);
  const start = useAppStore((state) => state.start);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    if (loadingState === "daytime-audio-loaded" && audioLoaded) {
      setShowStartButton(true);
    }
  }, [loadingState, audioLoaded]);

  useEffect(() => {
    if (started) {
      setShowStartButton(false);
    }
  }, [started]);

  if (started) {
    return (
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button onClick={toggleAudio}>{audioEnabled ? "On" : "Off"}</button>
        <ModeToggle />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16.666667%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
      }}
    >
      <button
        onClick={start}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 32px",
          fontSize: "18px",
          transition: "all 700ms ease-out",
          opacity: showStartButton ? 1 : 0,
          transform: showStartButton
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(16px)",
        }}
      >
        Start Experience
      </button>
    </div>
  );
}
