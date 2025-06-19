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

   // Use the luminance of the baked texture for shadows
   vec4 aoDay = texture2D(aoMap, vHillUv);
   vec4 aoNight = texture2D(aoMapNight, vHillUv);
   float aoDayL = dot(aoDay.rgb, vec3(0.299, 0.587, 0.114));
   float aoNightL = dot(aoNight.rgb, vec3(0.299, 0.587, 0.114));
   float ao = mix(aoDayL, aoNightL, smoothstep(0.0, 1.0, uTransitionFactor));
   
   gl_FragColor.rgb = (col * brightness * ao).rgb;
   gl_FragColor.a = alpha;
}