uniform sampler2D uDayDiffuse;
uniform sampler2D uNightDiffuse;
uniform sampler2D uShadowMap;
uniform bool uHasShadowMap;
uniform float uTransitionFactor;
uniform vec3 color;

varying vec2 vUv;

void main() {
   vec4 dayColor = texture2D(uDayDiffuse, vUv);
   vec4 nightColor = texture2D(uNightDiffuse, vUv);

   vec4 finalColor = mix(dayColor, nightColor, smoothstep(0.0, 1.0, uTransitionFactor));

   if (uHasShadowMap) {
      float shadow = texture2D(uShadowMap, vUv).r;
      float shadowEffect = mix(0.2, 1.0, shadow);
      finalColor.rgb *= shadowEffect;
   }
  
  gl_FragColor = finalColor * vec4(color, 1.0);
  
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
}