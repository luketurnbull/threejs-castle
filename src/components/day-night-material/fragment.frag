uniform sampler2D uDayDiffuse;
uniform sampler2D uNightDiffuse;
uniform float uTransitionFactor;

varying vec2 vUv;

void main() {
   vec4 dayColor = texture2D(uDayDiffuse, vUv);
   vec4 nightColor = texture2D(uNightDiffuse, vUv);

   vec4 finalColor = mix(dayColor, nightColor, smoothstep(0.0, 1.0, uTransitionFactor));
  
  gl_FragColor = finalColor;
  
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
}