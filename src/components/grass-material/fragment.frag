precision mediump float;

uniform sampler2D map;
uniform sampler2D alphaMap;
uniform sampler2D aoMap;
uniform vec3 tipColor;
uniform vec3 bottomColor;
uniform float brightness;
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
   vec4 aoColor = texture2D(aoMap, vHillUv);
   float ao = dot(aoColor.rgb, vec3(0.299, 0.587, 0.114)); // Convert to grayscale using luminance weights
   
   gl_FragColor = col * brightness * ao;
}