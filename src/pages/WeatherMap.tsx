import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  Navigation,
  Map as MapIcon,
  Thermometer,
  Wind,
  Droplets,
} from "lucide-react";

import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useWeather } from "@/hooks/useWeather";

import { Card, Skeleton } from "@/components/ui";
import { WeatherIcon } from "@/components/weather";

import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
} from "@/utils/units";
import { getWmoDescription } from "@/utils/wmo-codes";

// Fix default marker icon (Leaflet bundler issue workaround)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CITY = {
  id: "beijing",
  name: "Beijing",
  country: "China",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      duration: 2,
      easeLinearity: 0.25,
    });
  }, [center, map]);
  return null;
}

export default function WeatherMapPage() {
  const { currentCity } = useFavoritesStore();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useSettingsStore();

  const city = currentCity ?? DEFAULT_CITY;
  const { data: weather, isLoading } = useWeather(
    city.latitude,
    city.longitude,
  );

  const center: [number, number] = [city.latitude, city.longitude];

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-sm mx-auto max-w-[1600px] mt-6 lg:mt-10 mb-20">
      <div className="absolute top-6 left-6 z-[400]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10"
        >
          <div className="p-2 bg-primary-500/20 rounded-xl text-primary-400">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white leading-tight">
              Weather Map
            </h1>
            <p className="text-xs text-white/50 font-medium">Live Conditions</p>
          </div>
        </motion.div>
      </div>

      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles filter invert hue-rotate-180 brightness-95 contrast-125 saturate-50"
        />
        <Marker position={center} icon={defaultIcon}>
          <Popup className="glass-popup">
            <div className="font-semibold text-slate-900">
              {city.name}, {city.country}
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={center} />
      </MapContainer>

      <div className="absolute top-6 right-6 z-[400] w-full max-w-[320px]">
        {isLoading || !weather ? (
          <Skeleton
            variant="rectangular"
            className="h-[200px] w-full rounded-3xl bg-black/40 backdrop-blur-md"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              variant="glass"
              className="p-5 backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-black/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {city.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium mt-1">
                    <Navigation className="w-3 h-3" />
                    <span>
                      {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}
                      °E
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-full">
                  <WeatherIcon
                    code={weather.current.weather_code}
                    isDay={weather.current.is_day === 1}
                    size="md"
                  />
                </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-bold text-white tracking-tighter">
                  {formatTemperature(
                    weather.current.temperature_2m,
                    temperatureUnit,
                  ).replace(/[^\d-]/g, "")}
                  °
                </span>
                <span className="text-sm font-medium text-white/60 mb-2 pb-0.5">
                  {getWmoDescription(weather.current.weather_code)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Feels Like
                  </span>
                  <div className="flex items-center gap-1 text-white/80">
                    <Thermometer className="w-3 h-3 text-orange-400" />
                    <span className="text-sm font-medium">
                      {formatTemperature(
                        weather.current.apparent_temperature,
                        temperatureUnit,
                      ).replace(/[^\d-]/g, "")}
                      °
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 border-l border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Wind
                  </span>
                  <div className="flex items-center gap-1 text-white/80">
                    <Wind className="w-3 h-3 text-emerald-400" />
                    <span className="text-sm font-medium">
                      {
                        formatWindSpeed(
                          weather.current.wind_speed_10m,
                          windSpeedUnit,
                        ).split(" ")[0]
                      }
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 border-l border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Precip
                  </span>
                  <div className="flex items-center gap-1 text-white/80">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-sm font-medium">
                      {
                        formatPrecipitation(
                          weather.current.precipitation,
                          precipitationUnit,
                        ).split(" ")[0]
                      }
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
