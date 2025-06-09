import { type GLTF } from "three-stdlib";
import * as THREE from "three";

export type Model = GLTF & {
  nodes: {
    hill: THREE.Mesh;
    tower: THREE.Mesh;
    windowInside: THREE.Mesh;
    windowInside001: THREE.Mesh;
    windowInside002: THREE.Mesh;
    windowInside003: THREE.Mesh;
    windowInside005: THREE.Mesh;
    windowInside006: THREE.Mesh;
  };
};
