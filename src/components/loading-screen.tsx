import { useState, useEffect, useRef } from "react";
import { useGLTF, useProgress, useTexture } from "@react-three/drei";
import { gsap } from "gsap";
import { TEXTURES } from "@/constants/assets";

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
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
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
              setIsReady(true);
              onReady();
            }}
          />
        )}

        <div className="flex w-full justify-center h-14">
          {isReady && (
            <button
              onClick={onStart}
              ref={startButtonRef}
              className="px-6 py-3 text-md text-black bg-[#859531] font-semi-bold border-2 rounded-md cursor-pointer transition-colors duration-300 hover:bg-[#9ea733] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AssetLoader({ onReady }: { onReady: () => void }) {
  const brickRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { progress } = useProgress();
  useGLTF.preload("/scene.glb", true);

  useTexture.preload(TEXTURES.TOWER_DIFFUSE);
  useTexture.preload(TEXTURES.TOWER_NORMAL);
  useTexture.preload(TEXTURES.TOWER_ROUGHNESS);

  useTexture.preload(TEXTURES.BLADE_DIFFUSE);
  useTexture.preload(TEXTURES.BLADE_ALPHA);
  useTexture.preload(TEXTURES.HILL_BAKED);

  useTexture.preload(TEXTURES.ROCK_DIFFUSE);
  useTexture.preload(TEXTURES.ROCK_NORMAL);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        onReady();
      }, 500);
    }

    const bricksToShow = Math.min(Math.floor(progress / 10), 10);

    brickRefs.current.forEach((brickRef, index) => {
      if (brickRef) {
        if (index < bricksToShow) {
          gsap.to(brickRef, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: index * 0.05,
          });
        } else {
          gsap.set(brickRef, { opacity: 0, scale: 0 });
        }
      }
    });
  }, [progress, onReady]);

  return (
    <div className="h-1/3 w-4/5 max-w-[300px]">
      <div className="text-center mt-2.5 text-black text-2xl font-bold">
        {Math.round(progress)}%
      </div>
      <div className="grid grid-cols-10 gap-1 mb-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              brickRefs.current[index] = el;
            }}
            className="w-full h-12 rounded-md opacity-0 transform scale-0 bg-[url('/brick-tile.webp')] bg-contain bg-center bg-no-repeat"
          ></div>
        ))}
      </div>
    </div>
  );
}
