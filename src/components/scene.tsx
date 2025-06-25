import type { JSX } from "react";
import Hill from "./hill";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const loadingState = useAppStore((state) => state.loadingState);
  const setComplete = useAppStore((state) => state.setComplete);
  const [sceneY, setSceneY] = useState(-200);

  // Animate scene appearing from below when night-time loading is complete
  useEffect(() => {
    if (loadingState === "daytime-complete") {
      gsap.to(
        { value: sceneY },
        {
          value: 0, // Move to normal position
          duration: 1,
          ease: "power2.out",
          onUpdate: function () {
            setSceneY(this.targets()[0].value);
          },
          onComplete: function () {
            setTimeout(() => {
              setComplete();
            }, 300);
          },
        }
      );

      return () => {
        gsap.killTweensOf({ value: sceneY });
      };
    }
  }, [loadingState, sceneY, setComplete]);

  return (
    <group {...props} dispose={null} position={[0, sceneY, 0]}>
      <Flag />
      <Smoke />
      <Windows />
      <Objects />
      <Hill />
    </group>
  );
}
