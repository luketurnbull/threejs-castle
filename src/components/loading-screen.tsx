import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import AssetLoader from "./asset-loader";

export default function LoadingScreen({
  onStart,
  onReady,
}: {
  onStart: () => void;
  onReady: () => void;
}) {
  const [isReady, setIsReady] = useState(false);
  const [loadingScreenReady, setIsLoadingScreenReady] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isReady && startButtonRef.current) {
      gsap.fromTo(
        startButtonRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isReady]);

  return (
    <div className="w-screen h-screen absolute bg-[#ffe79e] flex items-center justify-center">
      <div className="flex flex-col gap-2 justify-center items-center max-w-[500px] p-6">
        <img
          src="/flash-page-image.webp"
          className="max-h-1/3"
          onLoad={() => {
            setIsLoadingScreenReady(true);
          }}
        />
        {loadingScreenReady && (
          <AssetLoader
            onReady={() => {
              onReady();

              setTimeout(() => {
                setIsReady(true);
              }, 550);
            }}
          />
        )}

        <div className="flex w-full justify-center h-12">
          {isReady && (
            <button
              onClick={onStart}
              ref={startButtonRef}
              className="px-6 py-2 text-md text-black bg-[#9ea733] hover:bg-[#859531] font-semi-bold border-2 rounded-md cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
