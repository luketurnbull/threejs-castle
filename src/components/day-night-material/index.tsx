import { extend, type ThreeElement } from "@react-three/fiber";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

type DayNightMaterialProps = {
  uDayDiffuse: THREE.Texture | null;
  uNightDiffuse: THREE.Texture | null;
  uTransitionFactor: number;
};

const defaultDayNightUniforms: DayNightMaterialProps = {
  uDayDiffuse: null,
  uNightDiffuse: null,
  uTransitionFactor: 0,
};

export const DayNightMaterial = shaderMaterial(
  defaultDayNightUniforms,
  vertex,
  fragment
);

extend({ DayNightMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    dayNightMaterial: ThreeElement<typeof DayNightMaterial>;
  }
}
