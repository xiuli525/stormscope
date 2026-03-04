import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getSunPosition } from "@/utils/globe-math";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = `
  uniform vec3 uSunDir;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  vec3 palette(float t) {
    vec3 cold = vec3(0.05, 0.1, 0.3);
    vec3 ocean = vec3(0.05, 0.15, 0.4);
    vec3 land = vec3(0.08, 0.35, 0.15);
    vec3 desert = vec3(0.55, 0.45, 0.25);
    vec3 ice = vec3(0.85, 0.9, 0.95);

    float lat = (vUv.y - 0.5) * 3.14159;
    float absLat = abs(lat);

    if (absLat > 1.2) return mix(ice, cold, (absLat - 1.2) / 0.37);

    float n = fract(sin(dot(vUv * 40.0, vec2(12.9898, 78.233))) * 43758.5453);
    float landMask = step(0.42, n);
    vec3 base = mix(ocean, mix(land, desert, smoothstep(0.3, 0.8, absLat * -1.0 + 0.6)), landMask);
    return base;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    float NdotL = dot(normal, normalize(uSunDir));
    float dayFactor = smoothstep(-0.15, 0.25, NdotL);

    vec3 dayColor = palette(vUv.y) * (0.6 + 0.4 * max(NdotL, 0.0));
    vec3 nightColor = vec3(0.01, 0.02, 0.06);

    float n2 = fract(sin(dot(vUv * 200.0, vec2(12.9898, 78.233))) * 43758.5453);
    float cityLight = step(0.92, n2) * (1.0 - dayFactor) * 0.6;
    nightColor += vec3(1.0, 0.85, 0.5) * cityLight;

    vec3 color = mix(nightColor, dayColor, dayFactor);

    float fresnel = pow(1.0 - max(dot(normal, normalize(cameraPosition - vWorldPosition)), 0.0), 3.0);
    color += vec3(0.15, 0.3, 0.8) * fresnel * 0.4;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uSunDir: { value: getSunPosition().normalize() },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uSunDir.value.copy(getSunPosition().normalize());
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
