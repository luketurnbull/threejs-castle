import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import AssetLoader from "./asset-loader";
import { Button } from "./ui/button";
import { useAppStore } from "../store";

export default function LoadingScreen() {
  const { setStatus, startBackgroundAudio } = useAppStore();
  const [showStartButton, setShowStartButton] = useState(false);
  const [loadingScreenReady, setIsLoadingScreenReady] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    if (showStartButton) {
      gsap.fromTo(
        startButtonRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [showStartButton]);

  const handleStart = () => {
    setStatus("started");
    startBackgroundAudio();
  };

  const handleReady = () => {
    setStatus("ready");

    setTimeout(() => {
      setShowStartButton(true);
    }, 550);
  };

  return (
    <div className="w-screen h-screen absolute bg-[#ffe79e] flex items-center justify-center">
      <div className="flex flex-col gap-2 justify-center items-center max-w-[500px] p-6">
        <img
          src="/loading/flash-page-image.webp"
          className="max-h-1/3"
          onLoad={() => {
            setIsLoadingScreenReady(true);
          }}
        />
        {loadingScreenReady && <AssetLoader onReady={handleReady} />}

        <div className="flex w-full justify-center h-12">
          {showStartButton && (
            <Button onClick={handleStart} ref={startButtonRef}>
              Start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
