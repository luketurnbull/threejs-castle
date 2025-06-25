import { useAppStore } from "@/store";
import { Stars } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT_NIGHT = 10000;
const STAR_ANIMATION_DURATION = NIGHT_TIME_TRANSITION_DURATION * 0.8;

export default function StarsComponent() {
  const mode = useAppStore((state) => state.mode);
  const [starOpacity, setStarOpacity] = useState(0);
  const starsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    gsap.to(
      { value: mode === "day" ? 1 : 0 },
      {
        value: mode === "day" ? 0 : 1,
        duration: STAR_ANIMATION_DURATION,
        ease: "power2.inOut",
        onUpdate: function () {
          setStarOpacity(this.targets()[0].value);
        },
      }
    );
  }, [mode]);

  useFrame(() => {
    if (starsRef.current && starsRef.current.material) {
      const mat = starsRef.current.material as THREE.PointsMaterial;
      mat.opacity = starOpacity;
      mat.transparent = true;
    }
  });

  return (
    <Stars
      ref={starsRef}
      count={STAR_COUNT_NIGHT}
      radius={100}
      depth={50}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}
