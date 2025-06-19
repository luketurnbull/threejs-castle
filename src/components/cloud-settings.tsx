import { Cloud } from "@react-three/drei";

export default function CloudSettings() {
  return (
    <>
      <Cloud
        position={[0, 120, -50]}
        scale={[20, 20, 20]}
        opacity={0.8}
        speed={0.2}
      />

      <Cloud
        position={[200, 60, 200]}
        scale={[40, 40, 40]}
        opacity={0.8}
        speed={0.2}
      />
    </>
  );
}
