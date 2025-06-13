precision mediump float;

uniform float uTime;

varying vec2 vUv;

void main()
{
    vec4 newPosition = vec4(position, 1.0);
    
    // Main horizontal wave
    float waveX1 = sin(uv.x * 15.0 + uTime * 1.5) * 0.1 * uv.x;
    float waveX2 = sin(uv.x * 25.0 + uTime * 2.0) * 0.05 * uv.x;
    
    // Smaller wave along Y-axis
    float waveY = sin(uv.y * 20.0 + uTime * 3.0) * 0.03 * uv.x;

    newPosition.z += waveX1 + waveX2;
    newPosition.y += waveY;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * newPosition;

    vUv = uv;
}
