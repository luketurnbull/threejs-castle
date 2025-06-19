import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

export default function LightSettings() {
  const mode = useAppStore((state) => state.mode);

  const [intensity, setIntensity] = useState(mode === "day" ? 5 : 1);

  useEffect(() => {
    gsap.to(
      { value: intensity },
      {
        value: mode === "day" ? 5 : 1,
        duration: NIGHT_TIME_TRANSITION_DURATION,
        ease: "power2.inOut",
        onUpdate: function () {
          setIntensity(this.targets()[0].value);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return <ambientLight color="white" intensity={intensity} />;
}
