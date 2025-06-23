precision mediump float;

uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying float vTimeOffset;

// Simple noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Enhanced flickering light effect with gentler variation
float flicker(float time) {
    // Add multiple layers of noise for more natural flickering
    float noise1 = random(vec2(time * 0.15, time * 0.2));
    float noise2 = random(vec2(time * 0.1, time * 0.25));
    float noise3 = random(vec2(time * 0.2, time * 0.15));
    
    // Combine different frequencies of flickering with gentler variation
    float flicker1 = sin(time * 8.0) * 0.3 + 0.7; // Reduced amplitude from 0.5 to 0.3
    float flicker2 = sin(time * 4.0) * 0.3 + 0.7; // Reduced amplitude from 0.5 to 0.3
    
    // Mix the noises and flickers for more subtle variation
    float combined = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3) * // Reduced noise influence
                    (flicker1 * 0.6 + flicker2 * 0.4);
    
    // Reduce the range of flickering
    return mix(0.7, 1.1, combined); // Increased minimum, reduced maximum
}

void main() {
    // Calculate depth effect
    float depth = 1.0 - abs(vPosition.z) * 2.0;
    depth = smoothstep(0.0, 1.0, depth);
    
    // Calculate window frame with slightly thinner frame
    float frame = smoothstep(0.0, 0.42, vUv.x) * 
                 smoothstep(0.0, 0.42, vUv.y) * 
                 smoothstep(0.0, 0.42, 1.0 - vUv.x) * 
                 smoothstep(0.0, 0.42, 1.0 - vUv.y);
    
    // Create window interior effect with reduced light intensity
    float interior = 1.0 - frame;
    float light = flicker(uTime + vTimeOffset) * interior * 0.6; // Reduced light intensity by 40%
    
    // Less intense flame-like colors
    vec3 flameColor = vec3(0.8, 0.4, 0.1); // Reduced intensity flame color
    vec3 brightFlame = vec3(0.8, 0.7, 0.3); // Reduced intensity bright flame
    vec3 warmLight = mix(flameColor, brightFlame, light) * light * 1.2; // Reduced brightness multiplier from 2.0 to 1.2
    vec3 coolShadow = vec3(0.3, 0.1, 0.05) * (1.0 - light); // Darker shadows
    
    // Combine everything with reduced contrast
    vec3 finalColor = mix(coolShadow, warmLight, depth * 1.2); // Reduced depth multiplier from 1.4 to 1.2
    
    // Softer ambient occlusion
    float ao = smoothstep(0.0, 0.8, depth);
    finalColor *= ao;
    
    // Darker frame for better contrast
    finalColor = mix(vec3(0.1, 0.1, 0.1), finalColor, frame);
    
    // Reduced glow effect
    float glow = smoothstep(0.0, 0.4, interior) * 0.2; // Reduced glow from 0.4 to 0.2
    finalColor += mix(flameColor, brightFlame, light) * glow * light * 0.8; // Reduced glow multiplier from 1.3 to 0.8
    
    // Add a subtle pulsing effect to the glow (slowed down)
    float pulse = sin((uTime + vTimeOffset) * 1.0) * 0.08 + 0.92; // Reduced pulse amplitude
    finalColor *= pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}