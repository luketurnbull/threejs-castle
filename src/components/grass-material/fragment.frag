precision mediump float;

uniform sampler2D map;
uniform sampler2D alphaMap;
uniform sampler2D aoMap;
uniform sampler2D aoMapNight;
uniform vec3 tipColor;
uniform vec3 bottomColor;
uniform float brightness;
uniform float uTransitionFactor;
varying vec2 vUv;
varying float frc;
varying vec2 vHillUv;

void main() {
   float alpha = texture2D(alphaMap, vUv).r;
   if(alpha < 0.15) discard;
   
   vec4 col = vec4(texture2D(map, vUv));
   col = mix(vec4(tipColor, 1.0), col, frc);
   col = mix(vec4(bottomColor, 1.0), col, frc);

   // Optimized AO calculation - only sample what's needed
   float ao;
   if (uTransitionFactor <= 0.0) {
      // Pure day mode - only sample day AO
      vec4 aoDay = texture2D(aoMap, vHillUv);
      ao = dot(aoDay.rgb, vec3(0.299, 0.587, 0.114));
   } else if (uTransitionFactor >= 1.0) {
      // Pure night mode - only sample night AO
      vec4 aoNight = texture2D(aoMapNight, vHillUv);
      ao = dot(aoNight.rgb, vec3(0.299, 0.587, 0.114));
   } else {
      // Transition mode - sample both and mix
      vec4 aoDay = texture2D(aoMap, vHillUv);
      vec4 aoNight = texture2D(aoMapNight, vHillUv);
      float aoDayL = dot(aoDay.rgb, vec3(0.299, 0.587, 0.114));
      float aoNightL = dot(aoNight.rgb, vec3(0.299, 0.587, 0.114));
      ao = mix(aoDayL, aoNightL, smoothstep(0.0, 1.0, uTransitionFactor));
   }
   
   gl_FragColor.rgb = (col * brightness * ao).rgb;
   gl_FragColor.a = alpha;
}