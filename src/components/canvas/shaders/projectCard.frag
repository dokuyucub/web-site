varying vec2 vUv;
varying float vDistortion;
uniform sampler2D uTexture;
uniform float uHover;
uniform float uAlpha;
uniform float uTime;

// Grain/noise function
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // RGB split on hover (chromatic aberration)
  float aberration = uHover * 0.008;
  vec4 colorR = texture2D(uTexture, uv + vec2(aberration, 0.0));
  vec4 colorG = texture2D(uTexture, uv);
  vec4 colorB = texture2D(uTexture, uv - vec2(aberration, 0.0));

  vec4 color = vec4(colorR.r, colorG.g, colorB.b, colorG.a);

  // Vignette
  float vig = 1.0 - smoothstep(0.3, 0.8, distance(uv, vec2(0.5, 0.5)));
  color.rgb *= 0.7 + 0.3 * vig;

  // Film grain
  float grain = rand(uv + fract(uTime * 0.01)) * 0.04 - 0.02;
  color.rgb += grain;

  // Dark overlay at edges (card border fade)
  float edgeFade = smoothstep(0.0, 0.03, uv.x) * smoothstep(0.0, 0.03, uv.y)
                 * smoothstep(0.0, 0.03, 1.0 - uv.x) * smoothstep(0.0, 0.03, 1.0 - uv.y);
  color.a *= edgeFade * uAlpha;

  gl_FragColor = color;
}
