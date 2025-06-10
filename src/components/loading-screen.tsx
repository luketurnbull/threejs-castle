import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen({ onStart }: { onStart: () => void }) {
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setIsReady(true);
    }
  }, [progress]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black/80 flex flex-col items-center justify-center text-white font-sans z-50">
      <div className="w-4/5 max-w-[400px] mb-5">
        <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2.5">
          Loading assets... {Math.round(progress)}%
        </div>
      </div>

      {isReady && (
        <button
          onClick={onStart}
          className="px-6 py-3 text-lg bg-green-500 text-white border-none rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start Experience
        </button>
      )}
    </div>
  );
}
