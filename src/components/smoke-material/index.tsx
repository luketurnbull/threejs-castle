import { extend, type ThreeElement } from "@react-three/fiber";
import fragment from "./fragment.frag";
import vertex from "./vertex.vert";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

type SmokeMaterialProps = {
  uPerlinTexture: THREE.Texture | null;
  uTime: number;
  uMode: number; // 0 for day (smoke), 1 for night (fire)
};

const defaultSmokeUniforms: SmokeMaterialProps = {
  uPerlinTexture: null,
  uTime: 0,
  uMode: 0,
};

const SmokeMaterial = shaderMaterial(
  defaultSmokeUniforms,
  vertex,
  fragment,
  (self) => {
    if (self) {
      self.side = THREE.DoubleSide;
      self.transparent = true;
      self.depthWrite = false;
    }
  }
);

extend({ SmokeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    smokeMaterial: ThreeElement<typeof SmokeMaterial>;
  }
}
