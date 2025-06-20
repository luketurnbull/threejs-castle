import { TEXTURES } from "@/constants/assets";
import Smoke from "./smoke";
import { useAppStore } from "@/store";
import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NIGHT_TIME_TRANSITION_DURATION } from "@/lib/animation";

type Particle = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  alpha: number;
};

type Props = {
  count?: number;
  position?: [number, number, number];
  scale?: [number, number, number];
  texture: string;
  opacity?: number;
};

function CrossFadeFire() {
  const mode = useAppStore((state) => state.mode);
  const [fade, setFade] = useState(mode === "night" ? 1 : 0);
  const [prevMode, setPrevMode] = useState(mode);

  // Animate fade value
  useFrame((_, delta) => {
    if (mode !== prevMode) {
      setPrevMode(mode);
    }
    setFade((f) => {
      const target = mode === "night" ? 1 : 0;
      const speed = NIGHT_TIME_TRANSITION_DURATION;
      if (Math.abs(f - target) < 0.01) return target;
      return f + (Math.sign(target - f) * delta) / (1 / speed);
    });
  });

  return (
    <>
      <R3FParticleSystem
        position={[75, -5, 8]}
        scale={[8, 25, 8]}
        texture={TEXTURES.FIRE}
        opacity={fade}
      />
      <Smoke opacity={1 - fade} />
    </>
  );
}

export default CrossFadeFire;

export function R3FParticleSystem({
  count = 100,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  texture,
  opacity = 1,
}: Props & { opacity?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particles using useRef instead of useMemo
  const particles = useRef<Particle[]>(
    (() => {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ),
          velocity: new THREE.Vector3(0, Math.random() * 0.1 + 0.05, 0),
          life: Math.random(),
          maxLife: 1 + Math.random(),
          size: Math.random() * 2 + 1,
          color: new THREE.Color(1, 0.5 + Math.random() * 0.5, 0),
          alpha: 1,
        });
      }
      return arr;
    })()
  );

  // Geometry attributes
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const sizes = useMemo(() => new Float32Array(count), [count]);
  const alphas = useMemo(() => new Float32Array(count), [count]);

  // Animate particles
  useFrame((_, delta) => {
    for (let i = 0; i < count; i++) {
      const p = particles.current[i];
      p.position.addScaledVector(p.velocity, delta);
      p.life += delta;

      if (p.life > p.maxLife) {
        // Reset particle
        p.position.set(0, 0, 0);
        p.life = 0;
      }

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      sizes[i] = p.size;
      alphas[i] = 1 - p.life / p.maxLife;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      // Add more attributes as needed
    }
  });

  return (
    <group position={position} scale={scale}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          {/* Add more attributes for size, alpha, color if you want */}
        </bufferGeometry>
        <pointsMaterial
          map={new THREE.TextureLoader().load(texture)}
          size={5}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={opacity}
        />
      </points>
    </group>
  );
}
