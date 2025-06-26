precision mediump float;

uniform sampler2D uAlphaMap;
uniform float uTransitionFactor;
uniform vec3 uDayColor;
uniform vec3 uNightColor;

varying vec2 vUv;
varying vec3 vSunDirection;
varying vec3 vNormal;

// Function to create a soft light effect
float softLight(float dotProduct) {
    return pow(max(dotProduct, 0.0), 0.5); // Softer falloff
}

void main() {
   vec4 alphaMap = texture2D(uAlphaMap, vUv);
   float alpha = alphaMap.r;
   if (alpha > 0.15) discard;

   // Optimized lighting calculation - only compute what's needed
   vec3 finalColor;
   if (uTransitionFactor <= 0.0) {
      // Pure day mode - only compute day lighting
      vec3 secondaryLightDir = normalize(vSunDirection + vec3(0.2, 0.1, 0.0));
      float secondaryLight = softLight(dot(vNormal, secondaryLightDir)) * 0.5;
      float rimLight = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0) * 0.3;
      float dayLighting = secondaryLight + rimLight;
      finalColor = mix(uDayColor * 0.6, uDayColor * 0.7, dayLighting);
   } else if (uTransitionFactor >= 1.0) {
      // Pure night mode - only compute night lighting
      float nightLight = softLight(dot(vNormal, normalize(vec3(0.5, 0.5, 0.5)))) * 0.1; // Dim ambient
      float nightRim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0) * 0.2;
      float nightLighting = nightLight + nightRim;
      finalColor = mix(uNightColor * 0.3, uNightColor * 0.5, nightLighting);
   } else {
      // Transition mode - compute both day and night lighting, then mix
      // Day lighting
      vec3 secondaryLightDir = normalize(vSunDirection + vec3(0.2, 0.1, 0.0));
      float secondaryLight = softLight(dot(vNormal, secondaryLightDir)) * 0.5;
      float rimLight = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0) * 0.3;
      float dayLighting = secondaryLight + rimLight;
      vec3 dayFinalColor = mix(uDayColor * 0.6, uDayColor * 0.7, dayLighting);

      // Night lighting (much darker)
      float nightLight = softLight(dot(vNormal, normalize(vec3(0.5, 0.5, 0.5)))) * 0.1; // Dim ambient
      float nightRim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0) * 0.2;
      float nightLighting = nightLight + nightRim;
      vec3 nightFinalColor = mix(uNightColor * 0.3, uNightColor * 0.5, nightLighting);

      // Mix between day and night color based on transition factor
      finalColor = mix(dayFinalColor, nightFinalColor, smoothstep(0.0, 1.0, uTransitionFactor));
   }

   gl_FragColor = vec4(finalColor, 1.0);
}