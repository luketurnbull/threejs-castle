uniform sampler2D uDayDiffuse;
uniform sampler2D uNightDiffuse;
uniform sampler2D uNightDiffuseDim;
uniform sampler2D uShadowMap;
uniform bool uHasShadowMap;
uniform float uTransitionFactor;
uniform float uTime;
uniform vec3 color;

varying vec2 vUv;

// Simple hash function for random values
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// 2D noise function
float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(dot(i, vec2(1.0, 157.0)));
    float b = hash(dot(i + vec2(1.0, 0.0), vec2(1.0, 157.0)));
    float c = hash(dot(i + vec2(0.0, 1.0), vec2(1.0, 157.0)));
    float d = hash(dot(i + vec2(1.0, 1.0), vec2(1.0, 157.0)));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fire-like flickering function
float fireFlicker(vec2 uv, float time) {
    // Multiple layers of noise at different frequencies and speeds
    float noise1 = noise2D(uv * 3.0 + vec2(time * 0.8, time * 0.3));
    float noise2 = noise2D(uv * 7.0 + vec2(time * 1.2, time * 0.7));
    float noise3 = noise2D(uv * 15.0 + vec2(time * 2.1, time * 1.4));
    
    // Combine noise layers with different weights
    float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Add some temporal variation that's not tied to UV position
    float temporalNoise = hash(time * 0.5) * 0.3 + hash(time * 1.1) * 0.2;
    
    // Combine spatial and temporal noise
    float flickerValue = combinedNoise * 0.7 + temporalNoise * 0.3;
    
    // Apply smoothstep to create more natural fade in/out
    flickerValue = smoothstep(0.2, 0.8, flickerValue);
    
    // Add some randomness to the intensity
    float intensityVariation = hash(time * 0.3) * 0.4 + 0.6;
    
    return flickerValue * intensityVariation;
}

void main() {
   vec4 finalColor;
   
   // Create fire-like flickering effect
   float flickerFactor = fireFlicker(vUv, uTime);
   
   vec4 nightBright = texture2D(uNightDiffuse, vUv);
   vec4 nightDim = texture2D(uNightDiffuseDim, vUv);
   vec4 finalNightColor = mix(nightDim, nightBright, flickerFactor);

   // Now, handle the transition logic.
   if (uTransitionFactor <= 0.0) {
      // Pure day mode
      finalColor = texture2D(uDayDiffuse, vUv);
   } else if (uTransitionFactor >= 1.0) {
      // Pure night mode
      finalColor = finalNightColor;
   } else {
      // Transition mode: mix from day color to the final flickering night color.
      vec4 dayColor = texture2D(uDayDiffuse, vUv);
      finalColor = mix(dayColor, finalNightColor, smoothstep(0.0, 1.0, uTransitionFactor));
   }

   if (uHasShadowMap) {
      float shadow = texture2D(uShadowMap, vUv).r;
      float shadowEffect = mix(0.4, 1.0, shadow);
      finalColor.rgb *= shadowEffect;
   }
  
  gl_FragColor = finalColor * vec4(color, 1.0);
  
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
}