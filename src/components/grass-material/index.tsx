import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";

type GrassMaterialProps = {
  map: THREE.Texture | null;
  alphaMap: THREE.Texture | null;
  aoMap: THREE.Texture | null;
  bladeHeight: number;
  time: number;
  tipColor: THREE.Color;
  bottomColor: THREE.Color;
  brightness: number;
  playerPosition: THREE.Vector3;
};

const defaultUniforms: GrassMaterialProps = {
  bladeHeight: 10,
  map: null,
  alphaMap: null,
  time: 0,
  tipColor: new THREE.Color(0.0, 0.6, 0.0).convertSRGBToLinear(),
  bottomColor: new THREE.Color(0.0, 0.1, 0.0).convertSRGBToLinear(),
  brightness: 2.0,
  aoMap: null,
  playerPosition: new THREE.Vector3(0, -1, 0),
};

const GrassMaterial = shaderMaterial(
  defaultUniforms,
  vertex,
  fragment,
  (self) => {
    if (self) {
      self.side = THREE.DoubleSide;
      self.transparent = true;
    }
  }
);

extend({ GrassMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    grassMaterial: ThreeElement<typeof GrassMaterial>;
  }
}
