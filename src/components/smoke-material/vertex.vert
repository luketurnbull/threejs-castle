uniform float uTime;
uniform sampler2D uPerlinTexture;
uniform float uMode;
varying vec2 vUv;

#include /src/shaders/rotate2d.glsl

// Noise function for fire movement
float noise(vec2 p) {
    return texture(uPerlinTexture, p).r;
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 3; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

void main()
{
   vec3 newPosition = position;

   // Smoke movement (gentle)
   float twistPerlin = texture(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.005)
   ).r;
   float smokeAngle = twistPerlin * 10.0;
   vec3 smokePosition = position;
   smokePosition.xz = rotate2D(smokePosition.xz, smokeAngle);

   // Wind for smoke
   vec2 windOffset = vec2(
      texture(uPerlinTexture, vec2(
         0.25,
         uTime * 0.01
      )).r - 0.5,
      texture(uPerlinTexture, vec2(
         0.75,
         uTime * 0.01
      )).r - 0.5
   );
   windOffset *= pow(uv.y, 2.5) * 10.0;
   smokePosition.xz += windOffset;
   
   // Fire movement (authentic fire physics)
   float height = uv.y;
   float intensity = mix(1.0, 0.2, height); // More movement at base
   
   // Base fire turbulence
   vec2 turbUv = vec2(uv.x * 0.5, uv.y + uTime * 0.02);
   float turbulence = fbm(turbUv);
   turbulence = (turbulence - 0.5) * 2.0;
   
   // Fire flicker movement
   vec2 flickerUv = vec2(uv.x * 0.3, uv.y * 0.5 + uTime * 0.03);
   float flicker = fbm(flickerUv);
   flicker = (flicker - 0.5) * 2.0;
   
   // Heat distortion
   vec2 heatUv = vec2(uv.x * 0.4, uv.y + uTime * 0.01);
   float heat = fbm(heatUv);
   heat = (heat - 0.5) * 2.0;
   
   // Apply fire physics (reduced intensity for smaller appearance)
   vec3 firePosition = position;
   // Horizontal movement (turbulence)
   firePosition.x += turbulence * 1.5 * intensity; // Reduced from 3.0
   
   // Vertical movement (heat rising with flicker)
   firePosition.y += (turbulence * 0.5 + flicker * 0.3) * 1.0 * intensity; // Reduced from 2.0
   
   // Heat distortion (affects Z)
   firePosition.z += heat * 0.8 * intensity; // Reduced from 1.5
   
   // Fire twist (more chaotic)
   float twist = fbm(vec2(uv.y * 0.3 - uTime * 0.015, 0.5));
   twist = (twist - 0.5) * 2.0;
   float fireAngle = twist * 4.0 * intensity; // Reduced from 8.0
   firePosition.xz = rotate2D(firePosition.xz, fireAngle);
   
   // Add some randomness for natural fire movement
   float random = fbm(vec2(uv.x * 0.2, uv.y * 0.2 + uTime * 0.005));
   random = (random - 0.5) * 2.0;
   firePosition.xz += random * 0.2 * intensity; // Reduced from 0.5

   // Smooth transition between smoke and fire positions
   newPosition = mix(smokePosition, firePosition, uMode);

   // Final position
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

   vUv = uv;
}