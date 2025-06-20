import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getParticleSystem } from "@/utils/getParticleSystem";
import type { ParticleSystemInstance } from "@/utils/getParticleSystem";

export type ParticleSystemProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  rate?: number;
  texture: string;
  emitterPosition?: THREE.Vector3;
};

export default function ParticleSystem({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rate = 80,
  texture,
  emitterPosition = new THREE.Vector3(0, 0, 0),
}: ParticleSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const particleSystemRef = useRef<ParticleSystemInstance | null>(null);

  useEffect(() => {
    try {
      if (!groupRef.current) return;
      particleSystemRef.current = getParticleSystem({
        camera,
        emitter: { position: emitterPosition },
        parent: groupRef.current,
        rate,
        texture,
      });
      return () => {
        if (groupRef.current && particleSystemRef.current) {
          groupRef.current.remove(particleSystemRef.current.points);
        }
        particleSystemRef.current = null;
      };
    } catch (e) {
      console.error("Error in ParticleSystem useEffect:", e);
    }
  }, [camera, emitterPosition, rate, texture]);

  useFrame((_, delta) => {
    if (particleSystemRef.current) {
      particleSystemRef.current.update(delta);
    }
  });

  return <group ref={groupRef} position={position} scale={scale} />;
}
