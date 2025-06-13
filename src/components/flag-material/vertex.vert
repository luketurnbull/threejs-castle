precision mediump float;

uniform float uTime;
uniform vec3 uSunPosition;
uniform vec3 uMousePosition;
uniform float uIsHovered;

varying vec2 vUv;
varying vec3 vSunDirection;
varying vec3 vNormal;

// Function to calculate distance-based wave influence
float getMouseInfluence(vec3 worldPos) {
    float dist = distance(worldPos, uMousePosition);
    float maxDist = 5.0; // Maximum distance for mouse influence
    return smoothstep(maxDist, 0.0, dist) * uIsHovered;
}

void main()
{
    vec4 newPosition = vec4(position, 1.0);
    vec4 worldPosition = modelMatrix * newPosition;
    
    // Base wave amplitudes
    float waveX1 = sin(uv.x * 10.0 + uTime * 1.5) * 0.8 * uv.x;
    float waveX2 = sin(uv.x * 15.0 + uTime * 2.0) * 0.4 * uv.x;
    float waveX3 = sin(uv.x * 20.0 + uTime * 1.0) * 0.3 * uv.x;
    float waveY = sin(uv.y * 15.0 + uTime * 2.5) * 0.3 * uv.x;

    // Mouse interaction waves - significantly increased amplitudes
    float mouseInfluence = getMouseInfluence(worldPosition.xyz);
    
    // Primary hover waves
    float mouseWaveX1 = sin(uv.x * 25.0 + uTime * 3.0) * 2.0 * uv.x * mouseInfluence;  // Increased from 1.2 to 2.0
    float mouseWaveY1 = sin(uv.y * 20.0 + uTime * 2.0) * 1.2 * uv.x * mouseInfluence;  // Increased from 0.6 to 1.2
    
    // Secondary hover waves for more complex movement
    float mouseWaveX2 = sin(uv.x * 35.0 + uTime * 4.0) * 1.5 * uv.x * mouseInfluence;  // New high-frequency wave
    float mouseWaveY2 = cos(uv.y * 25.0 + uTime * 3.0) * 0.8 * uv.x * mouseInfluence;  // New vertical wave
    
    // Combine mouse waves
    float mouseWaveX = mouseWaveX1 + mouseWaveX2;
    float mouseWaveY = mouseWaveY1 + mouseWaveY2;

    // Calculate wave derivatives for normal calculation
    float dx1 = cos(uv.x * 10.0 + uTime * 1.5) * 10.0 * 0.8 * uv.x;
    float dx2 = cos(uv.x * 15.0 + uTime * 2.0) * 15.0 * 0.4 * uv.x;
    float dx3 = cos(uv.x * 20.0 + uTime * 1.0) * 20.0 * 0.3 * uv.x;
    float dy = cos(uv.y * 15.0 + uTime * 2.5) * 15.0 * 0.3 * uv.x;
    
    // Mouse interaction derivatives - updated for new waves
    float dxMouse1 = cos(uv.x * 25.0 + uTime * 3.0) * 25.0 * 2.0 * uv.x * mouseInfluence;
    float dyMouse1 = cos(uv.y * 20.0 + uTime * 2.0) * 20.0 * 1.2 * uv.x * mouseInfluence;
    float dxMouse2 = cos(uv.x * 35.0 + uTime * 4.0) * 35.0 * 1.5 * uv.x * mouseInfluence;
    float dyMouse2 = -sin(uv.y * 25.0 + uTime * 3.0) * 25.0 * 0.8 * uv.x * mouseInfluence;

    // Combine waves
    float totalWave = waveX1 + waveX2 + waveX3 + mouseWaveX;
    newPosition.z += totalWave;
    newPosition.y += waveY + mouseWaveY;

    // Calculate normal based on wave derivatives
    vec3 tangent = vec3(1.0, dy + dyMouse1 + dyMouse2, dx1 + dx2 + dx3 + dxMouse1 + dxMouse2);
    vec3 bitangent = vec3(0.0, 1.0, dy + dyMouse1 + dyMouse2);
    vNormal = normalize(cross(tangent, bitangent));

    // Update world position
    worldPosition = modelMatrix * newPosition;
    
    // Transform normal to world space
    vNormal = normalize(mat3(modelMatrix) * vNormal);
    
    // Calculate sun direction in world space
    vSunDirection = normalize(uSunPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    vUv = uv;
}
