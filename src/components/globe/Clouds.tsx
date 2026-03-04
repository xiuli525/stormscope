import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const CLOUD_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png";

export function Clouds() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudMap = useLoader(THREE.TextureLoader, CLOUD_URL);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.025, 96, 96]} />
      <meshPhongMaterial
        map={cloudMap}
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
