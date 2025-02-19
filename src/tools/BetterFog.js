import * as THREE from 'three';

// TODO: Add implement fog shader
const _NOISE_GLSL = `
float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  float n = p.x + p.y * 57.0 + p.z * 800.0;
  return mix(
      mix(
          mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x),
          f.y),
      mix(
          mix(hash(n + 800.0), hash(n + 801.0), f.x),
          mix(hash(n + 857.0), hash(n + 858.0), f.x),
          f.y),
      f.z);
}

float FBM(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  vec3 shift = vec3(100.0);

  for (int i = 0; i < 6; ++i) {
    value += amplitude * noise(p);
    p = p * 2.0 + shift;
    amplitude *= 0.5;
  }
  return value;
}`;

// Override Three.js shader chunks
THREE.ShaderChunk.fog_fragment = `
#ifdef USE_FOG
  vec3 fogOrigin = cameraPosition;
  vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
  float fogDepth = distance(vWorldPosition, fogOrigin);

  // f(p) = fbm( p + fbm( p ) )
  vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(0.0, 0.0, fogTime * 0.025);
  float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
  fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - 5000.0) / 5000.0));
  fogDepth *= fogDepth;

  float heightFactor = 0.05;
  float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
      1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
  fogFactor = saturate(fogFactor);

  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
#endif`;

THREE.ShaderChunk.fog_pars_fragment = _NOISE_GLSL + `
#ifdef USE_FOG
  uniform float fogTime;
  uniform vec3 fogColor;
  varying vec3 vWorldPosition;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif`;

THREE.ShaderChunk.fog_vertex = `
#ifdef USE_FOG
  vWorldPosition = worldPosition.xyz;
#endif`;

THREE.ShaderChunk.fog_pars_vertex = `
#ifdef USE_FOG
  varying vec3 vWorldPosition;
#endif`;