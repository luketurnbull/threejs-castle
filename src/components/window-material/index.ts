import * as THREE from "three";
import vertex from "./vertex.vert";
import fragment from "./fragment.frag";

export const windowMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
});
