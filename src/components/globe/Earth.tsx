import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { getSunPosition } from "@/utils/globe-math";

const TEXTURE_BASE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uSpecMap;
  uniform vec3 uSunDir;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normalTex = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    vec3 normal = normalize(vNormal + normalTex * 0.15);

    float NdotL = dot(normal, normalize(uSunDir));
    float dayFactor = smoothstep(-0.15, 0.35, NdotL);

    vec3 dayColor = texture2D(uDayMap, vUv).rgb;
    float diffuse = max(NdotL, 0.0);
    dayColor *= 0.35 + 0.65 * diffuse;

    vec3 viewDir = normalize(-vPosition);
    vec3 halfDir = normalize(normalize(uSunDir) + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
    float specMask = texture2D(uSpecMap, vUv).r;
    dayColor += vec3(0.8, 0.85, 1.0) * spec * specMask * 0.6;

    vec3 nightTex = texture2D(uNightMap, vUv).rgb;
    vec3 nightColor = vec3(0.005, 0.008, 0.02);
    nightColor += nightTex * vec3(1.0, 0.85, 0.5) * 1.5;

    float terminatorGlow = exp(-pow((NdotL + 0.05) * 8.0, 2.0));
    vec3 terminatorColor = vec3(0.9, 0.4, 0.1) * terminatorGlow * 0.3;

    vec3 color = mix(nightColor, dayColor, dayFactor) + terminatorColor;

    float scatter = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.5);
    color += vec3(0.3, 0.6, 1.0) * scatter * dayFactor * 0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const [dayMap, nightMap, normalMap, specMap] = useLoader(
    THREE.TextureLoader,
    [
      `${TEXTURE_BASE}/earth_atmos_2048.jpg`,
      `${TEXTURE_BASE}/earth_lights_2048.png`,
      `${TEXTURE_BASE}/earth_normal_2048.jpg`,
      `${TEXTURE_BASE}/earth_specular_2048.jpg`,
    ],
  );

  const uniforms = useMemo(
    () => ({
      uDayMap: { value: dayMap },
      uNightMap: { value: nightMap },
      uNormalMap: { value: normalMap },
      uSpecMap: { value: specMap },
      uSunDir: { value: getSunPosition().normalize() },
      uTime: { value: 0 },
    }),
    [dayMap, nightMap, normalMap, specMap],
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uSunDir.value.copy(getSunPosition()).normalize();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
