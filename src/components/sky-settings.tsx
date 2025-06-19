import { useAppStore } from "@/store";
import { Sky, Stars } from "@react-three/drei";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function SkySettings() {
  const mode = useAppStore((state) => state.mode);

  const [yPos, setYPos] = useState(mode === "day" ? 0.25 : -0.75);

  useEffect(() => {
    gsap.to(
      { value: yPos },
      {
        value: mode === "day" ? 0.25 : -0.75,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
          setYPos(this.targets()[0].value);
        },
      }
    );
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
