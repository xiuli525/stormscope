import { Droplets } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { formatDayShort } from "@/utils/date";
import { convertTemperature } from "@/utils/units";
import { useSettingsStore } from "@/stores/settings";

interface ForecastCardProps {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipProb: number;
  /** Optional global min/max for the entire forecast period (improves bar accuracy) */
  globalMin?: number;
  globalMax?: number;
  onClick?: () => void;
}

export function ForecastCard({
  date,
  tempMax,
  tempMin,
  weatherCode,
  precipProb,
  globalMin,
  globalMax,
  onClick,
}: ForecastCardProps) {
  const { temperatureUnit } = useSettingsStore();

  const MIN_TEMP = globalMin != null ? Math.floor(globalMin) - 5 : -40;
  const MAX_TEMP = globalMax != null ? Math.ceil(globalMax) + 5 : 50;
  const RANGE = MAX_TEMP - MIN_TEMP || 1;

  const left = Math.max(0, Math.min(100, ((tempMin - MIN_TEMP) / RANGE) * 100));
  const width = Math.max(
    5,
    Math.min(100 - left, ((tempMax - tempMin) / RANGE) * 100),
  );

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-[60px_40px_1fr_50px] items-center gap-4 py-3 px-4 hover:bg-[var(--component-bg)] rounded-lg transition-colors cursor-pointer border-b border-[var(--glass-border-subtle)] last:border-0"
    >
      <span className="text-[var(--text-primary)] font-medium">
        {formatDayShort(date)}
      </span>

      <WeatherIcon code={weatherCode} size="sm" className="w-8 h-8" />

      <div className="flex items-center gap-3 w-full">
        <span className="text-[var(--text-tertiary)] text-sm w-8 text-right">
          {convertTemperature(tempMin, temperatureUnit)}°
        </span>

        <div className="flex-1 h-1.5 bg-[var(--component-bg)] rounded-full relative overflow-hidden">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 opacity-80"
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        </div>

        <span className="text-[var(--text-primary)] font-bold text-sm w-8">
          {convertTemperature(tempMax, temperatureUnit)}°
        </span>
      </div>

      <div className="flex items-center justify-end text-xs font-medium text-blue-400 min-w-[50px]">
        {precipProb > 0 && (
          <>
            <Droplets className="w-3 h-3 mr-1" />
            {precipProb}%
          </>
        )}
      </div>
    </div>
  );
}
