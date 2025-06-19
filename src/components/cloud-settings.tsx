import { useAppStore } from "@/store";
import { Cloud } from "@react-three/drei";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

export default function CloudSettings() {
  const mode = useAppStore((state) => state.mode);
  const [cloud1Pos, setCloud1Pos] = useState<[number, number, number]>([
    0, 120, -50,
  ]);
  const [cloud2Pos, setCloud2Pos] = useState<[number, number, number]>([
    200, 60, 200,
  ]);
  const [cloudOpacity, setCloudOpacity] = useState(0.8);

  useEffect(() => {
    const cloud1 = { y: cloud1Pos[1] };
    const cloud2 = { y: cloud2Pos[1] };
    const opacityObj = { value: cloudOpacity };
    if (mode === "night") {
      gsap.to(cloud1, {
        y: 220,
        duration: NIGHT_TIME_TRANSITION_DURATION * 0.8,
        onUpdate: function () {
          setCloud1Pos([cloud1Pos[0], cloud1.y, cloud1Pos[2]]);
        },
      });
      gsap.to(cloud2, {
        y: 160,
        duration: NIGHT_TIME_TRANSITION_DURATION * 0.8,
        onUpdate: function () {
          setCloud2Pos([cloud2Pos[0], cloud2.y, cloud2Pos[2]]);
        },
      });
      gsap.to(opacityObj, {
        value: 0.0,
        duration: NIGHT_TIME_TRANSITION_DURATION * 0.8,
        onUpdate: function () {
          setCloudOpacity(opacityObj.value);
        },
      });
    } else {
      gsap.to(cloud1, {
        y: 120,
        duration: NIGHT_TIME_TRANSITION_DURATION,
        onUpdate: function () {
          setCloud1Pos([cloud1Pos[0], cloud1.y, cloud1Pos[2]]);
        },
      });
      gsap.to(cloud2, {
        y: 60,
        duration: NIGHT_TIME_TRANSITION_DURATION,
        onUpdate: function () {
          setCloud2Pos([cloud2Pos[0], cloud2.y, cloud2Pos[2]]);
        },
      });
      gsap.to(opacityObj, {
        value: 0.8,
        duration: NIGHT_TIME_TRANSITION_DURATION,
        onUpdate: function () {
          setCloudOpacity(opacityObj.value);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <>
      <Cloud
        seed={1}
        position={cloud1Pos}
        scale={[20, 20, 20]}
        opacity={cloudOpacity}
        speed={0.2}
      />

      <Cloud
        seed={2}
        position={cloud2Pos}
        scale={[40, 40, 40]}
        opacity={cloudOpacity}
        speed={0.2}
      />
    </>
  );
}
