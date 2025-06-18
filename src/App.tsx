import LoadingScreen from "./components/loading-screen";
import { useEffect } from "react";
import Castle from "./components/castle";
import { useAppStore } from "./store";

function App() {
  const { status, initializeAudio } = useAppStore();

  // Initialize audio when component mounts
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          status === "started" ? "opacity-100 scale-100" : "opacity-0"
        }`}
      >
        {(status === "ready" || status === "started") && <Castle />}
      </div>

      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          status === "started"
            ? "opacity-0 translate-y-full pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <LoadingScreen />
      </div>
    </div>
  );
}

export default App;
