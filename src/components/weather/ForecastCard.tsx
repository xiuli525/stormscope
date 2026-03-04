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
  onClick?: () => void;
}

export function ForecastCard({
  date,
  tempMax,
  tempMin,
  weatherCode,
  precipProb,
  onClick,
}: ForecastCardProps) {
  const { temperatureUnit } = useSettingsStore();

  const MIN_TEMP = -10;
  const MAX_TEMP = 40;
  const RANGE = MAX_TEMP - MIN_TEMP;

  const left = Math.max(0, Math.min(100, ((tempMin - MIN_TEMP) / RANGE) * 100));
  const width = Math.max(5, Math.min(100, ((tempMax - tempMin) / RANGE) * 100));

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-[60px_40px_1fr_50px] items-center gap-4 py-3 px-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer border-b border-white/5 last:border-0"
    >
      <span className="text-white font-medium">{formatDayShort(date)}</span>

      <WeatherIcon code={weatherCode} size="sm" className="w-8 h-8" />

      <div className="flex items-center gap-3 w-full">
        <span className="text-white/60 text-sm w-8 text-right">
          {convertTemperature(tempMin, temperatureUnit)}°
        </span>

        <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 opacity-80"
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        </div>

        <span className="text-white font-bold text-sm w-8">
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
