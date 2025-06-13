uniform float uTime;

void main() {
    // Create a simple wave effect
    float wave = sin(position.x * 2.0 + uTime) * 0.5;
    
    // Apply the wave to the z position
    vec3 newPosition = position;
    newPosition.z += wave;
    
    // Transform the position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
}
