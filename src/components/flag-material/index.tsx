import { extend, type ThreeElement } from "@react-three/fiber";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

type FlagMaterialProps = {
  uAlphaMap: THREE.Texture | null;
  uTime: number;
  uSunPosition: THREE.Vector3;
  uMousePosition: THREE.Vector3;
  uIsHovered: number;
};

const defaultFlagUniforms: FlagMaterialProps = {
  uAlphaMap: null,
  uTime: 0,
  uSunPosition: new THREE.Vector3(4, 0.25, -12),
  uMousePosition: new THREE.Vector3(),
  uIsHovered: 0.0,
};

const FlagMaterial = shaderMaterial(
  defaultFlagUniforms,
  vertex,
  fragment,
  (self) => {
    if (self) {
      self.side = THREE.DoubleSide;
      self.transparent = true;
      self.depthWrite = true;
    }
  }
);

extend({ FlagMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    flagMaterial: ThreeElement<typeof FlagMaterial>;
  }
}
