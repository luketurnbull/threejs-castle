import { useAppStore } from "@/store";
import * as THREE from "three";

/**
 * Utility functions that use hoisted Three.js references from the store
 */

// Example: Add a custom object to the scene
export function addCustomObjectToScene() {
  const { scene } = useAppStore.getState();

  if (scene) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 5, 0);
    scene.add(cube);

    console.log("Added custom cube to scene");
    return cube;
  }

  console.warn("Scene not available in store");
  return null;
}

// Example: Manipulate camera directly
export function moveCameraToPosition(x: number, y: number, z: number) {
  const { camera } = useAppStore.getState();

  if (camera) {
    camera.position.set(x, y, z);
    console.log(`Moved camera to ${x}, ${y}, ${z}`);
  } else {
    console.warn("Camera not available in store");
  }
}

// Example: Get renderer info
export function getRendererInfo() {
  const { renderer } = useAppStore.getState();

  if (renderer) {
    return {
      isWebGL2: renderer.capabilities.isWebGL2,
      maxTextureSize: renderer.capabilities.maxTextureSize,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
      precision: renderer.capabilities.precision,
    };
  }

  return null;
}

// Example: Load GLTF using stored loader
export function loadGLTFWithStoredLoader(url: string) {
  const { gltfLoader } = useAppStore.getState();

  if (gltfLoader) {
    return new Promise((resolve, reject) => {
      gltfLoader.load(url, resolve, undefined, reject);
    });
  }

  return Promise.reject(new Error("GLTF loader not available in store"));
}

// Example: Take a screenshot
export function takeScreenshot() {
  const { renderer, scene, camera } = useAppStore.getState();

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL();
    console.log("Screenshot taken");
    return dataURL;
  }

  console.warn("Renderer, scene, or camera not available in store");
  return null;
}

// Example: Check if Three.js is ready
export function isThreeJSReady() {
  const { renderer, scene, camera } = useAppStore.getState();
  return !!(renderer && scene && camera);
}

// Example: Hook to use Three.js references
export function useThreeJS() {
  const renderer = useAppStore((state) => state.renderer);
  const scene = useAppStore((state) => state.scene);
  const camera = useAppStore((state) => state.camera);
  const gltfLoader = useAppStore((state) => state.gltfLoader);

  return {
    renderer,
    scene,
    camera,
    gltfLoader,
    isReady: !!(renderer && scene && camera),
  };
}
