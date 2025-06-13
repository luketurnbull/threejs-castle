import { useFrame } from "@react-three/fiber";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";
import * as THREE from "three";
import { useRef } from "react";

export default function WavingFlag() {
  return (
    <group position={[0, 40, 0]}>
      <mesh scale={0.05}>
        <cylinderGeometry args={[5, 5, 250, 32]} />
        <meshBasicMaterial color={"black"} />
      </mesh>
      <Flag />
    </group>
  );
}

const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
  },
});

function Flag() {
  const planeBuffer = useRef<THREE.PlaneGeometry>(null!);
  const materialRef = useRef(material);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      rotation-y={Math.PI * 0.5}
      position={[0, 3, 3.8]}
      material={materialRef.current}
    >
      <planeGeometry args={[8, 5, 32, 32]} ref={planeBuffer} />
    </mesh>
  );
}
