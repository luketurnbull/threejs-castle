import { type GLTF } from "three-stdlib";
import * as THREE from "three";

export type Model = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    rocks: THREE.Mesh;
    tower: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};
