import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3, temperatureToColor } from "@/utils/globe-math";
import { useFavoritesStore } from "@/stores/favorites";
import { useWeather } from "@/hooks/useWeather";
import type { FavoriteCity } from "@/types/geocoding";

interface MarkerProps {
  city: FavoriteCity;
  onHover: (city: FavoriteCity | null, position: THREE.Vector3 | null) => void;
  onClick: (city: FavoriteCity) => void;
}

function CityMarker({ city, onHover, onClick }: MarkerProps) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { data: weather } = useWeather(city.latitude, city.longitude);
  const temp = weather?.current.temperature ?? 20;
  const color = temperatureToColor(temp);

  const pos = latLonToVector3(city.latitude, city.longitude, 2.02);

  useFrame((_, delta) => {
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(Date.now() * 0.003) * 0.3;
      ringRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.3);
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group position={pos} onClick={() => onClick(city)}>
      <mesh
        ref={ref}
        onPointerEnter={() => onHover(city, pos)}
        onPointerLeave={() => onHover(null, null)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.05, 0.07, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

interface CityMarkersProps {
  onHover: (city: FavoriteCity | null, position: THREE.Vector3 | null) => void;
  onClick: (city: FavoriteCity) => void;
}

export function CityMarkers({ onHover, onClick }: CityMarkersProps) {
  const favorites = useFavoritesStore((s) => s.favorites);

  return (
    <group>
      {favorites.map((city) => (
        <CityMarker
          key={city.id}
          city={city}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
    </group>
  );
}
