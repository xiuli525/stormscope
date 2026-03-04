import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getSunPosition } from "@/utils/globe-math";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = `
  uniform vec3 uSunDir;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float rim = 1.0 - max(dot(viewDir, normal), 0.0);

    float NdotL = dot(normal, normalize(uSunDir));
    float dayFactor = smoothstep(-0.3, 0.5, NdotL);

    vec3 dayGlow = vec3(0.3, 0.6, 1.0);
    vec3 nightGlow = vec3(0.15, 0.1, 0.3);
    vec3 glowColor = mix(nightGlow, dayGlow, dayFactor);

    float intensity = pow(rim, 2.5) * 1.2;
    float alpha = pow(rim, 3.0) * 0.85;

    gl_FragColor = vec4(glowColor * intensity, alpha);
  }
`;

export function Atmosphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uSunDir.value.copy(getSunPosition()).normalize();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[2.15, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uSunDir: { value: new THREE.Vector3(5, 3, 5).normalize() },
        }}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
