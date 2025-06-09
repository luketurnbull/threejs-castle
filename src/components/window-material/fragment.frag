precision mediump float;

uniform float uTime;

// Simple noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Flickering effect
float flicker(vec2 uv, float time) {
    float noise = random(uv + time * 0.1);
    float flicker = sin(time * 2.0) * 0.5 + 0.5;
    return mix(0.8, 1.0, noise * flicker);
}

void main() {
    // Base color for the window (dark amber/orange)
    vec3 baseColor = vec3(0.8, 0.4, 0.1);
    
    // Add flickering effect
    float light = flicker(gl_FragCoord.xy * 0.01, uTime);
    
    // Final color with glow
    vec3 finalColor = baseColor * light;
    
    // Add some glow
    float glow = 0.2 + 0.1 * sin(uTime * 3.0);
    finalColor += vec3(1.0, 0.6, 0.2) * glow;
    
    gl_FragColor = vec4(finalColor, 1.0);
}