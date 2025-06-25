import { Center, Text } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function FloatingText() {
  const textRef = useRef<THREE.Group>(null!);
  const [textOpacity, setTextOpacity] = useState(0);
  const [textScale, setTextScale] = useState(0);

  useEffect(() => {
    const timeline = gsap.timeline();

    // Animate text in
    timeline
      .to({}, { duration: 0.5 }) // Small delay
      .to(
        { value: textScale },
        {
          value: 1,
          duration: 1,
          ease: "back.out(1.7)",
          onUpdate: function () {
            setTextScale(this.targets()[0].value);
          },
        }
      )
      .to(
        { value: textOpacity },
        {
          value: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: function () {
            setTextOpacity(this.targets()[0].value);
          },
        },
        "-=0.5" // Start fading in as it scales
      );

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <group
      ref={textRef}
      position={[-36, -7, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={textScale * 4}
    >
      <Text
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={textOpacity}
      >
        CASTLE ON A HILL
      </Text>
    </group>
  );
}
