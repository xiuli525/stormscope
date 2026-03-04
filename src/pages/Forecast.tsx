import { motion } from "framer-motion";
import {
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  CloudRain,
  Thermometer,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useForecast } from "@/hooks/useForecast";

import { Card, Skeleton } from "@/components/ui";
import { WeatherIcon } from "@/components/weather";
import { TempChart, PrecipBar } from "@/components/charts";

import { cn } from "@/utils/cn";
import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
} from "@/utils/units";
import { formatDayShort, formatSunTime } from "@/utils/date";
import { getWmoDescription } from "@/utils/wmo-codes";

import type { DailyForecast } from "@/types/weather";

interface DayData {
  time: string;
  weather_code: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  precipitation_sum: number;
  wind_speed_10m_max: number;
  sunrise: string;
  sunset: string;
}

function dailyToArray(daily: DailyForecast | undefined): DayData[] {
  if (!daily?.time) return [];
  return daily.time.map((t, i) => ({
    time: t,
    weather_code: daily.weatherCode[i],
    temperature_2m_max: daily.temperatureMax[i],
    temperature_2m_min: daily.temperatureMin[i],
    precipitation_sum: daily.precipitationSum[i],
    wind_speed_10m_max: daily.windSpeedMax[i],
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
  }));
}

const DEFAULT_CITY = {
  id: "beijing",
  name: "北京",
  country: "中国",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function ForecastPage() {
  const { t } = useTranslation();
  const { currentCity } = useFavoritesStore();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useSettingsStore();

  const city = currentCity ?? DEFAULT_CITY;
  const {
    data: weather,
    isLoading,
    hourly,
    daily: rawDaily,
  } = useForecast(city.latitude, city.longitude);

  const days = dailyToArray(rawDaily);

  if (isLoading || !weather) {
    return <ForecastSkeleton />;
  }

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-[1600px] mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-4xl font-light tracking-tight text-[var(--text-primary)]">
          {t("forecast.title")}
        </h1>
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-lg font-medium">
          <span className="text-primary-400">{city.name}</span>
          <span>•</span>
          <span>{city.country}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card
            variant="glass"
            className="p-6 h-full min-h-[400px] flex flex-col"
          >
            <div className="mb-6 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                {t("forecast.temperatureTrend")}
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest bg-[var(--component-bg)] px-2 py-1 rounded">
                {t("forecast.hours24")}
              </span>
            </div>
            <div className="h-[300px] w-full flex-1 min-h-0">
              {hourly && <TempChart hourly={hourly} unit={temperatureUnit} />}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="xl:col-span-1"
        >
          <Card
            variant="glass"
            className="p-6 h-full min-h-[400px] flex flex-col"
          >
            <div className="mb-6 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-400" />
                {t("forecast.precipitation")}
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest bg-[var(--component-bg)] px-2 py-1 rounded">
                {t("forecast.probability")}
              </span>
            </div>
            <div className="h-[300px] w-full flex-1 min-h-0 flex items-end justify-center pb-4">
              {hourly && <PrecipBar hourly={hourly} />}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
      >
        {days.map((day, index: number) => (
          <motion.div
            key={day.time.toString()}
            variants={itemVariants}
            custom={index}
            className="h-full"
          >
            <Card
              variant={index === 0 ? "glass-hero" : "glass"}
              className={cn(
                "h-full p-5 flex flex-col justify-between gap-6 transition-all duration-300 group hover:translate-y-[-4px]",
                index === 0
                  ? "border-primary-500/30 bg-primary-500/10 shadow-lg shadow-primary-500/5"
                  : "hover:bg-[var(--component-bg-hover)] hover:shadow-xl hover:shadow-black/20",
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-lg font-semibold tracking-wide",
                      index === 0
                        ? "text-primary-300"
                        : "text-[var(--text-primary)]",
                    )}
                  >
                    {index === 0
                      ? t("forecast.today")
                      : formatDayShort(day.time)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-medium font-mono">
                    {new Date(day.time).getDate().toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="p-2 rounded-full bg-[var(--component-bg)] group-hover:bg-[var(--component-bg-hover)] transition-colors">
                  <WeatherIcon code={day.weather_code} isDay={true} size="md" />
                </div>
              </div>

              <div className="flex flex-col items-center py-4 bg-[var(--component-bg)] rounded-xl border border-[var(--glass-border-subtle)]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)] tracking-tighter">
                    {formatTemperature(
                      day.temperature_2m_max,
                      temperatureUnit,
                    ).replace(/[^\d-]/g, "")}
                    °
                  </span>
                  <span className="text-sm text-[var(--text-muted)] font-medium">
                    /
                  </span>
                  <span className="text-lg font-medium text-[var(--text-muted)]">
                    {formatTemperature(
                      day.temperature_2m_min,
                      temperatureUnit,
                    ).replace(/[^\d-]/g, "")}
                    °
                  </span>
                </div>
                <span className="text-xs font-medium text-[var(--text-tertiary)] text-center mt-2 px-2 line-clamp-1 max-w-full truncate">
                  {getWmoDescription(day.weather_code, t)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-blue-300/80">
                    <Droplets className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("forecast.rain")}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[var(--text-secondary)]">
                    {formatPrecipitation(
                      day.precipitation_sum,
                      precipitationUnit,
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-300/80">
                    <Wind className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("forecast.wind")}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[var(--text-secondary)]">
                    {formatWindSpeed(day.wind_speed_10m_max, windSpeedUnit)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-orange-300/80">
                    <Sunrise className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("forecast.rise")}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[var(--text-tertiary)]">
                    {formatSunTime(day.sunrise)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-purple-300/80">
                    <Sunset className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("forecast.set")}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[var(--text-tertiary)]">
                    {formatSunTime(day.sunset)}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ForecastSkeleton() {
  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-[1600px] mx-auto animate-pulse">
      <div className="flex flex-col gap-2">
        <Skeleton
          variant="text"
          className="h-10 w-64 bg-[var(--skeleton-bg)] rounded"
        />
        <Skeleton
          variant="text"
          className="h-6 w-32 bg-[var(--skeleton-bg)] rounded"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-[400px] rounded-3xl bg-[var(--component-bg)] border border-[var(--glass-border-subtle)]" />
        <div className="xl:col-span-1 h-[400px] rounded-3xl bg-[var(--component-bg)] border border-[var(--glass-border-subtle)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-[380px] rounded-3xl bg-[var(--component-bg)] border border-[var(--glass-border-subtle)]"
          />
        ))}
      </div>
    </div>
  );
}
