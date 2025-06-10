precision mediump float;

varying vec2 vUv;

void main() {
   vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
   gl_Position = projectionMatrix * viewMatrix * worldPosition;

   vUv = uv;
}