uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uMode;

varying vec2 vUv;

// Noise functions for better fire effect
float noise(vec2 p) {
    return texture(uPerlinTexture, p).r;
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

void main() {
   // Smoke effect (day mode)
   vec2 smokeUv = vUv;
   smokeUv.x *= 0.5;
   smokeUv.y *= 0.3;
   smokeUv.y -= uTime * 0.03;

   float smoke = texture(uPerlinTexture, smokeUv).r;
   smoke = smoothstep(0.4, 1.0, smoke);
   smoke *= 1.5; // Make smoke more opaque

   // Fire effect (night mode) - Authentic fire simulation
   vec3 fireColor = vec3(0.0);
   float fireAlpha = 0.0;
   
   if (uMode > 0.0) {
      // Base fire shape using multiple noise layers
      vec2 fireUv = vUv;
      fireUv.y -= uTime * 0.1; // Upward movement
      
      // Main fire body
      float fireBody = fbm(fireUv * vec2(0.8, 1.2));
      fireBody = smoothstep(0.1, 0.6, fireBody); // Lowered threshold for more visibility
      
      // Fire turbulence
      vec2 turbUv = fireUv * vec2(1.5, 2.0);
      turbUv.y -= uTime * 0.15;
      float turbulence = fbm(turbUv);
      turbulence = smoothstep(0.2, 0.7, turbulence); // Lowered threshold
      
      // Fire flicker
      vec2 flickerUv = fireUv * vec2(2.0, 3.0);
      flickerUv.y -= uTime * 0.25;
      float flicker = fbm(flickerUv);
      flicker = smoothstep(0.3, 0.8, flicker); // Lowered threshold
      
      // Combine fire layers with higher intensity
      float fireIntensity = fireBody * turbulence * flicker;
      fireIntensity = pow(fireIntensity, 0.7); // Boost intensity
      fireIntensity *= 0.6; // Make fire more transparent
      
      // Fire colors based on temperature and height
      float height = vUv.y;
      
      // Core colors (from bottom to top)
      vec3 fireCore = vec3(0.0, 0.0, 0.8);      // Blue base
      vec3 fireLow = vec3(1.0, 0.2, 0.0);       // Dark orange
      vec3 fireMid = vec3(1.0, 0.5, 0.0);       // Bright orange
      vec3 fireHigh = vec3(1.0, 0.8, 0.0);      // Yellow-orange
      vec3 fireTip = vec3(1.0, 1.0, 0.8);       // White-yellow
      
      // Interpolate colors based on height
      vec3 color1 = mix(fireCore, fireLow, smoothstep(0.0, 0.2, height));
      vec3 color2 = mix(fireLow, fireMid, smoothstep(0.2, 0.5, height));
      vec3 color3 = mix(fireMid, fireHigh, smoothstep(0.5, 0.8, height));
      vec3 color4 = mix(fireHigh, fireTip, smoothstep(0.8, 1.0, height));
      
      // Final color interpolation
      vec3 tempColor1 = mix(color1, color2, smoothstep(0.0, 0.5, height));
      vec3 tempColor2 = mix(color3, color4, smoothstep(0.5, 1.0, height));
      fireColor = mix(tempColor1, tempColor2, smoothstep(0.0, 1.0, height));
      
      // Add intensity variation
      fireColor *= (0.9 + 0.6 * fireIntensity); // Increased intensity multiplier
      
      // Add some blue at the very base for realism
      vec3 blueBase = vec3(0.0, 0.3, 1.0);
      fireColor = mix(blueBase, fireColor, smoothstep(0.0, 0.15, height));
      
      fireAlpha = fireIntensity;
   }

   // Edges for smoke (made much bigger to match fire)
   float smokeEdges = smoothstep(0.0, 0.45, vUv.x) * 
                     smoothstep(1.0, 0.55, vUv.x) * 
                     smoothstep(0.0, 0.6, vUv.y) * 
                     smoothstep(1.0, 0.1, vUv.y);
   smoke *= smokeEdges;

   // Edges for fire (4 times smaller)
   float fireEdges = smoothstep(0.0, 0.4, vUv.x) * 
                    smoothstep(1.0, 0.6, vUv.x) * 
                    smoothstep(0.0, 0.45, vUv.y) * 
                    smoothstep(1.0, 0.45, vUv.y);
   fireAlpha *= fireEdges;

   // Interpolate between smoke and fire
   float alpha = mix(smoke, fireAlpha, uMode);
   vec3 smokeColor = vec3(0.6, 0.3, 0.2);
   vec3 finalColor = mix(smokeColor, fireColor, uMode);

   gl_FragColor = vec4(finalColor, alpha);

   #include <tonemapping_fragment>
   #include <colorspace_fragment>
}