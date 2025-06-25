import { Canvas } from "@react-three/fiber";
import Experience from "./experience";
import { useAppStore } from "@/store";

export default function Castle() {
  const camera = useAppStore((state) => state.camera);

  return (
    <Canvas
      camera={camera}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
    >
      <Experience />
    </Canvas>
  );
}
