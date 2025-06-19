import { useAppStore } from "@/store";
import { Sky, Stars } from "@react-three/drei";
import { useMemo } from "react";

export default function SkySettings() {
  const mode = useAppStore((state) => state.mode);

  const yPos = useMemo(() => {
    return mode === "day" ? 0.25 : -50;
  }, [mode]);

  return (
    <>
      <Sky
        distance={600000}
        sunPosition={[4, yPos, -12]}
        rayleigh={4}
        turbidity={10}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      {mode === "night" && <Stars />}
    </>
  );
}
