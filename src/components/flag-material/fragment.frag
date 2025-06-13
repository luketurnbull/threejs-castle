precision mediump float;

uniform sampler2D uAlphaMap;

varying vec2 vUv;
varying vec3 vSunDirection;
varying vec3 vNormal;

vec3 red = vec3(1.0, 0.0, 0.0);

// Function to create a soft light effect
float softLight(float dotProduct) {
    return pow(max(dotProduct, 0.0), 0.5); // Softer falloff
}

void main() {
   vec4 alphaMap = texture2D(uAlphaMap, vUv);
   float alpha = alphaMap.r;
   if (alpha > 0.15) discard;

   // Main directional light (sun)
   float mainLight = softLight(dot(vNormal, vSunDirection)) * 0.2;
   
   // Secondary light from slightly different angle (simulates area light)
   vec3 secondaryLightDir = normalize(vSunDirection + vec3(0.2, 0.1, 0.0));
   float secondaryLight = softLight(dot(vNormal, secondaryLightDir)) * 0.5;
   
   // Rim lighting (soft edge highlight)
   float rimLight = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0) * 0.3;
   
   // Combine all lighting components
   float lighting = secondaryLight + rimLight;
   
   // Add some color variation based on lighting
   vec3 finalColor = mix(red * 0.6, red * 0.7, lighting);

   gl_FragColor = vec4(finalColor, 1.0);
}