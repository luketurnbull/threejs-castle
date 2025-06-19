import { useAppStore } from "@/store";
import { useEffect, useState } from "react";

export default function LightSettings() {
  const mode = useAppStore((state) => state.mode);
  const [intensity, setIntensity] = useState(18);

  useEffect(() => {
    if (mode === "day") {
      setIntensity(18);
    } else {
      setIntensity(5);
    }
  }, [mode]);

  return <ambientLight color="white" intensity={intensity} />;
}
