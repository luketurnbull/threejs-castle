import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LoadingOverlay() {
  const loadingState = useAppStore((state) => state.loadingState);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start fade out when daytime-complete is reached
    if (loadingState === "daytime-complete") {
      // Begin fade out after a small delay
      const fadeTimer = setTimeout(() => {
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 3,
            ease: "power2.out",
          });
        }
      }, 100);

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [loadingState]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        opacity: 1,
        background:
          "linear-gradient(to bottom, #B3BDB9 0%, #A99391 50%, #918A8C 100%)",
      }}
    />
  );
}
