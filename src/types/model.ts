import { type GLTF } from "three-stdlib";
import * as THREE from "three";

export type Model = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    objects: THREE.Mesh;
    tower: THREE.Mesh;
    door: THREE.Mesh;
    windowInside: THREE.Mesh;
  };
};
