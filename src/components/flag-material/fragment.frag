precision mediump float;

uniform sampler2D uAlphaMap;

varying vec2 vUv;

vec3 red = vec3(1.0, 0.0, 0.0);

void main() {
   vec4 alphaMap = texture2D(uAlphaMap, vUv);
   float alpha = alphaMap.r;
   if (alpha > 0.15) discard;

   gl_FragColor = vec4(red, 1.0);
}