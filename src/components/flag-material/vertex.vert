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

    // Mouse interaction waves
    float mouseInfluence = getMouseInfluence(worldPosition.xyz);
    float mouseWaveX = sin(uv.x * 25.0 + uTime * 3.0) * 1.2 * uv.x * mouseInfluence;
    float mouseWaveY = sin(uv.y * 20.0 + uTime * 2.0) * 0.6 * uv.x * mouseInfluence;

    // Calculate wave derivatives for normal calculation
    float dx1 = cos(uv.x * 10.0 + uTime * 1.5) * 10.0 * 0.8 * uv.x;
    float dx2 = cos(uv.x * 15.0 + uTime * 2.0) * 15.0 * 0.4 * uv.x;
    float dx3 = cos(uv.x * 20.0 + uTime * 1.0) * 20.0 * 0.3 * uv.x;
    float dy = cos(uv.y * 15.0 + uTime * 2.5) * 15.0 * 0.3 * uv.x;
    
    // Mouse interaction derivatives
    float dxMouse = cos(uv.x * 25.0 + uTime * 3.0) * 25.0 * 1.2 * uv.x * mouseInfluence;
    float dyMouse = cos(uv.y * 20.0 + uTime * 2.0) * 20.0 * 0.6 * uv.x * mouseInfluence;

    // Combine waves
    float totalWave = waveX1 + waveX2 + waveX3 + mouseWaveX;
    newPosition.z += totalWave;
    newPosition.y += waveY + mouseWaveY;

    // Calculate normal based on wave derivatives
    vec3 tangent = vec3(1.0, dy + dyMouse, dx1 + dx2 + dx3 + dxMouse);
    vec3 bitangent = vec3(0.0, 1.0, dy + dyMouse);
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
