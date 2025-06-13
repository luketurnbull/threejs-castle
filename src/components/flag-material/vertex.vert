precision mediump float;

uniform float uTime;
uniform vec3 uSunPosition;

varying vec2 vUv;
varying vec3 vSunDirection;
varying vec3 vNormal;

void main()
{
    vec4 newPosition = vec4(position, 1.0);
    
    // Increased wave amplitudes and adjusted frequencies for more dramatic movement
    float waveX1 = sin(uv.x * 10.0 + uTime * 1.5) * 0.4 * uv.x;  // Increased amplitude from 0.3 to 0.4
    float waveX2 = sin(uv.x * 15.0 + uTime * 2.0) * 0.2 * uv.x;  // Increased amplitude from 0.15 to 0.2
    float waveX3 = sin(uv.x * 20.0 + uTime * 1.0) * 0.15 * uv.x; // Increased amplitude from 0.1 to 0.15
    
    // Increased Y-axis wave amplitude
    float waveY = sin(uv.y * 15.0 + uTime * 2.5) * 0.15 * uv.x;  // Increased amplitude from 0.1 to 0.15

    // Calculate wave derivatives for normal calculation
    float dx1 = cos(uv.x * 10.0 + uTime * 1.5) * 10.0 * 0.4 * uv.x;
    float dx2 = cos(uv.x * 15.0 + uTime * 2.0) * 15.0 * 0.2 * uv.x;
    float dx3 = cos(uv.x * 20.0 + uTime * 1.0) * 20.0 * 0.15 * uv.x;
    float dy = cos(uv.y * 15.0 + uTime * 2.5) * 15.0 * 0.15 * uv.x;

    // Combine waves
    float totalWave = waveX1 + waveX2 + waveX3;
    newPosition.z += totalWave;
    newPosition.y += waveY;

    // Calculate normal based on wave derivatives
    vec3 tangent = vec3(1.0, dy, dx1 + dx2 + dx3);
    vec3 bitangent = vec3(0.0, 1.0, dy);
    vNormal = normalize(cross(tangent, bitangent));

    // Calculate world position for lighting
    vec4 worldPosition = modelMatrix * newPosition;
    
    // Transform normal to world space
    vNormal = normalize(mat3(modelMatrix) * vNormal);
    
    // Calculate sun direction in world space
    vSunDirection = normalize(uSunPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    vUv = uv;
}
