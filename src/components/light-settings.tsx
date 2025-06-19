import { useAppStore } from "@/store";
import { useMemo } from "react";

export default function LightSettings() {
  const mode = useAppStore((state) => state.mode);

  const intensity = useMemo(() => {
    return mode === "day" ? 18 : 5;
  }, [mode]);

  return <ambientLight color="white" intensity={intensity} />;
}
