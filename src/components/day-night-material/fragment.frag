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

void main() {
   vec4 finalColor;
   
   // First, determine the final night color, including the flicker effect.
   // This is the state we want to be in when uTransitionFactor is 1.0.
   vec2 flickerPos = vUv + vec2(uTime * 0.1, uTime * 0.05); // Moving noise position
   float flickerNoise = noise2D(flickerPos * 10.0); // High frequency noise
   float slowFlicker = noise2D(vec2(uTime * 0.5, 0.0)); // Slower overall flicker
   
   float flickerFactor = mix(flickerNoise, slowFlicker, 0.3);
   flickerFactor = smoothstep(0.0, 1.0, flickerFactor);
   
   vec4 nightBright = texture2D(uNightDiffuse, vUv);
   vec4 nightDim = texture2D(uNightDiffuseDim, vUv);
   vec4 finalNightColor = mix(nightBright, nightDim, flickerFactor);

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