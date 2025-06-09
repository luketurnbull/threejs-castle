import * as THREE from "three";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
  },
});

// Create a wrapper component to update the time uniform
export function WindowMaterial() {
  const materialRef = useRef(material);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return null;
}

export const windowMaterial = material;
