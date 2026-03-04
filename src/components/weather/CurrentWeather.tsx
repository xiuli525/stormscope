import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Thermometer,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { WeatherIcon } from "./WeatherIcon";
import { useSettingsStore } from "@/stores/settings";
import { useFavoritesStore } from "@/stores/favorites";
import {
  formatTemperature,
  formatWindSpeed,
  getUvLabel,
  getVisibilityLabel,
  getWindDirectionLabel,
} from "@/utils/units";
import { getWmoDescription } from "@/utils/wmo-codes";
import { cn } from "@/utils/cn";
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
  const { t } = useTranslation();
  const { temperatureUnit, windSpeedUnit } = useSettingsStore();
  const { currentCity, addFavorite, removeFavorite, isFavorite } =
    useFavoritesStore();

  const cityId = currentCity?.id ?? "";
  const isCityFavorited = cityId ? isFavorite(cityId) : false;

  const handleToggleFavorite = () => {
    if (!currentCity) return;
    if (isCityFavorited) {
      removeFavorite(cityId);
    } else {
      addFavorite(currentCity);
    }
  };

  const details = [
    {
      icon: Droplets,
      label: t("currentWeather.humidity"),
      value: `${weather.humidity}%`,
      color: "text-blue-400",
    },
    {
      icon: Wind,
      label: t("currentWeather.wind"),
      value: `${formatWindSpeed(weather.windSpeed, windSpeedUnit)} ${getWindDirectionLabel(
        weather.windDirection,
        t,
      )}`,
      color: "text-slate-400",
    },
    {
      icon: Gauge,
      label: t("currentWeather.pressure"),
      value: `${weather.pressure} hPa`,
      color: "text-purple-400",
    },
    {
      icon: Eye,
      label: t("currentWeather.visibility"),
      value: getVisibilityLabel(weather.visibility, t),
      subValue: `${weather.visibility} km`,
      color: "text-teal-400",
    },
    {
      icon: Sun,
      label: t("currentWeather.uvIndex"),
      value: getUvLabel(weather.uvIndex, t).label,
      subValue: `${t("currentWeather.index")} ${weather.uvIndex}`,
      color: getUvLabel(weather.uvIndex, t).color,
    },
    {
      icon: Thermometer,
      label: t("currentWeather.dewPoint"),
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
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  {cityName}
                </h2>
                <button
                  onClick={handleToggleFavorite}
                  className="p-1.5 rounded-full hover:bg-[var(--component-bg)] transition-colors"
                  title={
                    isCityFavorited
                      ? t("favorites.removeFromFavorites")
                      : t("favorites.addToFavorites")
                  }
                >
                  <Star
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isCityFavorited
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-[var(--text-muted)] hover:text-amber-400/60",
                    )}
                  />
                </button>
              </div>
              <p className="text-[var(--text-tertiary)] text-lg">{localTime}</p>
            </div>

            <div className="flex items-center gap-4">
              <WeatherIcon
                code={weather.weatherCode}
                isDay={weather.isDay}
                size="xl"
                className="filter drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
                  {formatTemperature(weather.temperature, temperatureUnit)}
                </span>
                <span className="text-xl text-[var(--text-secondary)] font-medium">
                  {getWmoDescription(weather.weatherCode, t)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <span>
                {t("currentWeather.feelsLike")}{" "}
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
                className="bg-[var(--component-bg)] backdrop-blur-sm rounded-xl p-3 border border-[var(--glass-border-default)] flex flex-col gap-1 hover:bg-[var(--component-bg-hover)] transition-colors"
              >
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                </div>
                <div className="text-[var(--text-primary)] font-semibold text-lg truncate">
                  {item.value}
                </div>
                {item.subValue && (
                  <div className="text-[var(--text-muted)] text-xs truncate">
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
