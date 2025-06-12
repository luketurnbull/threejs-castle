import { useFrame } from "@react-three/fiber";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";
import * as THREE from "three";
import { useRef } from "react";

export default function WavingFlag() {
  const planeBuffer = useRef<THREE.PlaneGeometry>(null!);
  const flag = useRef<THREE.RawShaderMaterial>(null!);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (flag.current.uniforms.uTime) {
      flag.current.uniforms.uTime.value = elapsedTime;
    }
  });

  return (
    <group position={[0, 40, 0]}>
      <mesh scale={0.05}>
        <cylinderGeometry args={[5, 5, 250, 32]} />
        <meshBasicMaterial color={"black"} />
      </mesh>
      <mesh rotation-y={Math.PI * 0.5} position={[0, 3, 3.8]}>
        <planeGeometry args={[8, 5, 32, 32]} ref={planeBuffer} />
        <shaderMaterial
          ref={flag}
          vertexShader={vertex}
          fragmentShader={fragment}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: {
              value: 0,
            },
            uColour: {
              value: new THREE.Color("Red"),
            },
          }}
        />
      </mesh>
    </group>
  );
}
