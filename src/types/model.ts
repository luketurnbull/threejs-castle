import { type GLTF } from "three-stdlib";
import * as THREE from "three";

export type Model = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    towerMainShaft: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};
