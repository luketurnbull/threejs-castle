import { useAppStore } from "@/store";
import { Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import { useFrame } from "@react-three/fiber";

const SUN_POSITION_DAY = 0.25;
const SUN_POSITION_NIGHT = -0.75;
const STAR_COUNT_NIGHT = 10000;
const STAR_ANIMATION_DURATION = NIGHT_TIME_TRANSITION_DURATION * 0.8;

export default function SkySettings() {
  const mode = useAppStore((state) => state.mode);
  const [yPos, setYPos] = useState(SUN_POSITION_DAY);
  // const [starOpacity, setStarOpacity] = useState(0);
  // const starsRef = useRef<THREE.Points>(null);

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
    // gsap.to(
    //   { value: mode === "day" ? 1 : 0 },
    //   {
    //     value: mode === "day" ? 0 : 1,
    //     duration: STAR_ANIMATION_DURATION,
    //     ease: "power2.inOut",
    //     onUpdate: function () {
    //       setStarOpacity(this.targets()[0].value);
    //     },
    //   }
    // );
  }, [mode]);

  // useFrame(() => {
  //   if (starsRef.current && starsRef.current.material) {
  //     const mat = starsRef.current.material as THREE.PointsMaterial;
  //     mat.opacity = starOpacity;
  //     mat.transparent = true;
  //   }
  // });

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

      {/* <Stars
        ref={starsRef}
        count={STAR_COUNT_NIGHT}
        radius={100}
        depth={50}
        factor={4}
        saturation={0}
        fade
        speed={1}
      /> */}
    </>
  );
}
