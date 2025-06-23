import { Canvas } from "@react-three/fiber";
import Experience from "./experience";

export default function Castle() {
  return (
    <Canvas
      camera={{
        position: [139, -15, 55],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
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
