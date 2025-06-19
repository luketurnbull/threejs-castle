import { useAppStore } from "@/store";
import { Sky } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function SkySettings() {
  const mode = useAppStore((state) => state.mode);
  const [yPos, setYPos] = useState(0.25);

  useEffect(() => {
    if (mode === "night") {
      setYPos(-50);
    } else {
      setYPos(0.25);
    }
  }, [mode]);

  return (
    <Sky
      distance={600000}
      sunPosition={[4, yPos, -12]}
      rayleigh={4}
      turbidity={10}
      mieCoefficient={0.004}
      mieDirectionalG={0.8}
    />
  );
}
