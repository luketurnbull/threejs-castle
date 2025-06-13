uniform float uTime;

void main() {
    // Just use the time value directly to create a gradient
    // This will show us if the uniform is changing at all
    float value = fract(uTime * 0.1);  // This will create a smooth gradient from 0 to 1
    
    gl_FragColor = vec4(value, value, value, 1.0);
}
