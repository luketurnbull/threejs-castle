import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LoadingOverlay() {
  const loadingState = useAppStore((state) => state.loadingState);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start fade out when daytime audio is loaded and start button appears
    if (loadingState === "initialised") {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        });
      }
    }
  }, [loadingState]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: "none",
        opacity: 1,
        background:
          "linear-gradient(to bottom, #B3BDB9 0%, #A99391 50%, #918A8C 100%)",
      }}
    />
  );
}
