varying vec2 vUv;
varying float vDistortion;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Subtle wave distortion on hover
  float dist = distance(uv, vec2(0.5, 0.5));
  float wave = sin(dist * 10.0 - uTime * 2.0) * uHover * 0.02;
  pos.z += wave;

  vDistortion = wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
