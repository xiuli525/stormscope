import { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Earth } from "./Earth";
import { CityMarkers } from "./CityMarkers";
import { Starfield } from "./Starfield";
import { GlobeInfoPanel } from "./GlobeInfoPanel";
import { useFavoritesStore } from "@/stores/favorites";
import { useWeather } from "@/hooks/useWeather";
import type { FavoriteCity } from "@/types/geocoding";

interface HoverState {
  city: FavoriteCity | null;
  worldPos: THREE.Vector3 | null;
  screenX: number;
  screenY: number;
  temperature: number | null;
  weatherCode: number | null;
}

function SceneContent({
  onHover,
  onCityClick,
}: {
  onHover: (city: FavoriteCity | null, pos: THREE.Vector3 | null) => void;
  onCityClick: (city: FavoriteCity) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 5]} intensity={0.3} />
      <Starfield count={2000} />
      <Earth />
      <CityMarkers onHover={onHover} onClick={onCityClick} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom
        minDistance={3}
        maxDistance={8}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function HoveredCityWeather({
  city,
  onData,
}: {
  city: FavoriteCity | null;
  onData: (temp: number | null, code: number | null) => void;
}) {
  const { data } = useWeather(city?.latitude ?? 0, city?.longitude ?? 0);

  const prevRef = useRef<string | null>(null);
  const cityId = city?.id ?? null;

  if (cityId !== prevRef.current) {
    prevRef.current = cityId;
    if (data && city) {
      onData(data.current.temperature, data.current.weatherCode);
    } else {
      onData(null, null);
    }
  } else if (data && city) {
    onData(data.current.temperature, data.current.weatherCode);
  }

  return null;
}

export default function GlobePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setCurrentCity = useFavoritesStore((s) => s.setCurrentCity);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hover, setHover] = useState<HoverState>({
    city: null,
    worldPos: null,
    screenX: 0,
    screenY: 0,
    temperature: null,
    weatherCode: null,
  });

  const handleHover = useCallback(
    (city: FavoriteCity | null, pos: THREE.Vector3 | null) => {
      if (!city || !pos) {
        setHover((prev) => ({ ...prev, city: null, worldPos: null }));
        return;
      }
      setHover((prev) => ({
        ...prev,
        city,
        worldPos: pos,
      }));
    },
    [],
  );

  const handleCityClick = useCallback(
    (city: FavoriteCity) => {
      setCurrentCity(city);
      navigate("/");
    },
    [setCurrentCity, navigate],
  );

  const handleWeatherData = useCallback(
    (temp: number | null, code: number | null) => {
      setHover((prev) => ({
        ...prev,
        temperature: temp,
        weatherCode: code,
      }));
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (hover.city) {
        setHover((prev) => ({
          ...prev,
          screenX: e.clientX,
          screenY: e.clientY,
        }));
      }
    },
    [hover.city],
  );

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[#050a15] rounded-2xl" />

      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-2xl font-bold text-white/90 flex items-center gap-2">
          🌍 {t("globe.title")}
        </h1>
        <p className="text-sm text-white/50 mt-1">{t("globe.subtitle")}</p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 flex gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/70">
          {t("globe.dragRotate")}
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/70">
          {t("globe.scrollZoom")}
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/70">
          {t("globe.clickCity")}
        </div>
      </div>

      <div className="absolute inset-0" onPointerMove={handlePointerMove}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "transparent" }}
        >
          <SceneContent onHover={handleHover} onCityClick={handleCityClick} />
        </Canvas>
      </div>

      <HoveredCityWeather city={hover.city} onData={handleWeatherData} />

      <GlobeInfoPanel
        city={hover.city}
        temperature={hover.temperature}
        weatherCode={hover.weatherCode}
        screenX={hover.screenX}
        screenY={hover.screenY}
      />
    </div>
  );
}
