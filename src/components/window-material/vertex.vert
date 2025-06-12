precision mediump float;

attribute float timeOffset;
varying vec2 vUv;
varying vec3 vPosition;
varying float vTimeOffset;

void main() {
    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    vPosition = position;
    vTimeOffset = timeOffset;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    vUv = uv;
}