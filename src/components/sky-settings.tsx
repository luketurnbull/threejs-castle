import { useAppStore } from "@/store";
import { Sky, Stars } from "@react-three/drei";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

const SUN_POSITION_DAY = 0.25;
const SUN_POSITION_NIGHT = -0.75;

export default function SkySettings() {
  const mode = useAppStore((state) => state.mode);

  const [yPos, setYPos] = useState(
    mode === "day" ? SUN_POSITION_DAY : SUN_POSITION_NIGHT
  );

  useEffect(() => {
    gsap.to(
      { value: yPos },
      {
        value: mode === "day" ? SUN_POSITION_DAY : SUN_POSITION_NIGHT,
        duration: NIGHT_TIME_TRANSITION_DURATION,
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
