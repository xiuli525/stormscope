import { motion } from "framer-motion";
import { Droplets, Wind, Gauge, Eye, Sun, Thermometer } from "lucide-react";
import { Card } from "@/components/ui";
import { WeatherIcon } from "./WeatherIcon";
import { useSettingsStore } from "@/stores/settings";
import {
  formatTemperature,
  formatWindSpeed,
  getUvLabel,
  getVisibilityLabel,
  getWindDirectionLabel,
} from "@/utils/units";
import { getWmoDescription } from "@/utils/wmo-codes";
import type { CurrentWeather as CurrentWeatherType } from "@/types/weather";

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  cityName: string;
  timezone: string;
}

export function CurrentWeather({
  weather,
  cityName,
  timezone,
}: CurrentWeatherProps) {
  const { temperatureUnit, windSpeedUnit } = useSettingsStore();

  const details = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${weather.humidity}%`,
      color: "text-blue-400",
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${formatWindSpeed(weather.windSpeed, windSpeedUnit)} ${getWindDirectionLabel(
        weather.windDirection,
      )}`,
      color: "text-slate-400",
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${weather.pressure} hPa`,
      color: "text-purple-400",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: getVisibilityLabel(weather.visibility),
      subValue: `${weather.visibility} km`,
      color: "text-teal-400",
    },
    {
      icon: Sun,
      label: "UV Index",
      value: getUvLabel(weather.uvIndex).label,
      subValue: `Index ${weather.uvIndex}`,
      color: getUvLabel(weather.uvIndex).color,
    },
    {
      icon: Thermometer,
      label: "Dew Point",
      value: formatTemperature(weather.dewpoint, temperatureUnit),
      color: "text-red-400",
    },
  ];

  const localTime = new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glass-hero" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="flex flex-col items-center lg:items-start">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {cityName}
              </h2>
              <p className="text-white/60 text-lg">{localTime}</p>
            </div>

            <div className="flex items-center gap-4">
              <WeatherIcon
                code={weather.weatherCode}
                isDay={weather.isDay}
                size="xl"
                className="filter drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                  {formatTemperature(weather.temperature, temperatureUnit)}
                </span>
                <span className="text-xl text-white/80 font-medium">
                  {getWmoDescription(weather.weatherCode)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <span>
                Feels like{" "}
                {formatTemperature(
                  weather.apparentTemperature,
                  temperatureUnit,
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {details.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                </div>
                <div className="text-white font-semibold text-lg truncate">
                  {item.value}
                </div>
                {item.subValue && (
                  <div className="text-white/40 text-xs truncate">
                    {item.subValue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
