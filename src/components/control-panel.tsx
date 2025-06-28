import { useAppStore } from "@/store";
import { ModeToggle } from "./ui/mode-toggle";
import { useEffect, useState } from "react";
import Button from "./ui/button";

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
        bottom: "5%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
      }}
    >
      <Button
        onClick={start}
        style={{
          transition: "all 700ms ease-out",
          opacity: showStartButton ? 1 : 0,
          transform: showStartButton
            ? "scale(1) translateY(0)"
            : "scale(0.95) translateY(16px)",
        }}
        childrenStyle={{
          top: "52%",
          left: "57%",
        }}
      >
        <svg
          width="46"
          height="52"
          viewBox="0 0 46 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.55096 52C1.59307 52 0 50.4074 0 48.4485V3.55146C0 1.59255 1.59307 3.8743e-07 3.55096 3.8743e-07C4.16865 3.8743e-07 4.78175 0.162789 5.32262 0.478248L44.2076 22.9268C45.3183 23.5628 45.9818 24.7127 45.9818 25.9949C45.9818 27.2822 45.3188 28.427 44.2076 29.0732L5.32311 51.5217C4.78174 51.8372 4.16916 52 3.55096 52Z"
            fill="#664A49"
          />
          <mask
            id="mask0_8_12"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="2"
            y="2"
            width="42"
            height="48"
          >
            <path
              d="M43.1819 24.7027L4.29743 2.25417C3.29915 1.67413 2.05103 2.39664 2.05103 3.55163V48.4487C2.05103 49.6037 3.29915 50.3211 4.29743 49.7462L43.1824 27.2925C44.1807 26.7176 44.1802 25.2777 43.1819 24.7027Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_8_12)">
            <path
              d="M43.1819 24.7027L4.29743 2.25417C3.29915 1.67413 2.05103 2.39664 2.05103 3.55163V48.4487C2.05103 49.6037 3.29915 50.3211 4.29743 49.7462L43.1824 27.2925C44.1807 26.7176 44.1802 25.2777 43.1819 24.7027Z"
              fill="url(#paint0_linear_8_12)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_8_12"
              x1="22.991"
              y1="2.05065"
              x2="22.991"
              y2="49.9502"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.409836" stopColor="#928384" />
              <stop offset="1" stopColor="#846E77" />
            </linearGradient>
          </defs>
        </svg>
      </Button>
    </div>
  );
}
