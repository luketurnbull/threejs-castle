import type { JSX } from "react";
import Hill from "./hill";
import Windows from "./windows";
import Flag from "./flag";
import Objects from "./objects";
import Smoke from "./smoke";
import FireAudio from "./fire-audio";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Scene(props: JSX.IntrinsicElements["group"]) {
  const loadingState = useAppStore((state) => state.loadingState);
  const [sceneY, setSceneY] = useState(-200);

  // Animate scene appearing from below when daytime content is loaded
  useEffect(() => {
    if (loadingState === "daytime-loaded") {
      gsap.to(
        { value: sceneY },
        {
          value: 0,
          duration: 1,
          ease: "power2.out",
          onUpdate: function () {
            setSceneY(this.targets()[0].value);
          },
        }
      );

      return () => {
        gsap.killTweensOf({ value: sceneY });
      };
    }
  }, [loadingState, sceneY]);

  return (
    <group {...props} dispose={null} position={[0, sceneY, 0]}>
      <Flag />
      <Smoke />
      <Windows groupPosition={[0, sceneY, 0]} />
      <Objects />
      <Hill />
      <FireAudio />
    </group>
  );
}
