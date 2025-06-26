import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store";
import * as THREE from "three";

// Fire position (same as smoke position)
const FIRE_POSITION = new THREE.Vector3(76, -16, 9);

export default function FireAudio() {
  const updateFireAudioVolume = useAppStore(
    (state) => state.updateFireAudioVolume
  );
  const camera = useAppStore((state) => state.camera);

  useFrame(() => {
    if (!camera) return;

    // Calculate distance from camera to fire
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    const distance = cameraPosition.distanceTo(FIRE_POSITION);

    // Update fire audio volume based on distance
    updateFireAudioVolume(distance);
  });

  // This component doesn't render anything visible
  return null;
}
