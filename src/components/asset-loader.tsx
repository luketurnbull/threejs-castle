import { TEXTURES } from "@/constants/assets";
import { useGLTF, useProgress, useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AssetLoader({ onReady }: { onReady: () => void }) {
  // Preload model
  useGLTF.preload("/scene.glb", true);

  // Preload hill and grass blade textures
  useTexture.preload(TEXTURES.BLADE_DIFFUSE);
  useTexture.preload(TEXTURES.BLADE_ALPHA);
  useTexture.preload(TEXTURES.HILL_BAKED);
  useTexture.preload(TEXTURES.HILL_BAKED_NIGHT);
  useTexture.preload(TEXTURES.HILL_PATCHES);

  // Preload rock textures
  useTexture.preload(TEXTURES.OBJECTS_DIFFUSE);
  useTexture.preload(TEXTURES.OBJECTS_DIFFUSE_NIGHT);

  // Preload flag textures
  useTexture.preload(TEXTURES.FLAG_ALPHA);

  // Preload Others
  useTexture.preload(TEXTURES.PERLIN_NOISE);

  const brickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { progress: assetsProgress } = useProgress();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.round(Math.max(assetsProgress - 10, 0)));
  }, [assetsProgress]);

  useEffect(() => {
    if (progress === 90) {
      setTimeout(() => {
        setProgress(100);
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
            delay: index * 0.01,
          });
        } else {
          gsap.set(brickRef, { opacity: 0, scale: 0 });
        }
      }
    });
  }, [progress, onReady]);

  return (
    <div className="h-1/3 w-4/5 max-w-[300px] flex flex-col gap-4">
      <div className="text-center mt-2.5 text-black text-2xl font-bold">
        {progress}%
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              brickRefs.current[index] = el;
            }}
            className="w-full h-12 opacity-0 transform scale-0"
          >
            <img src="/loading/brick-tile.webp" />
          </div>
        ))}
      </div>
    </div>
  );
}
