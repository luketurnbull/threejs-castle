import * as THREE from "three";

export function getTexturePixelData(
  texture: THREE.Texture
): Uint8ClampedArray | null {
  if (!texture.image) {
    console.warn("Texture image not loaded.");
    return null;
  }

  const { width, height } = texture.image;
  if (!width || !height) {
    console.warn("Texture image has no dimensions.");
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    console.warn("Could not get 2D context for canvas.");
    return null;
  }

  context.drawImage(texture.image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  return imageData.data;
}
