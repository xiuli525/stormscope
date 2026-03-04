import { Card } from "@/components/ui";
import { WeatherIcon } from "./WeatherIcon";
import { formatHour } from "@/utils/date";
import { formatTemperature } from "@/utils/units";
import { useSettingsStore } from "@/stores/settings";
import { cn } from "@/utils/cn";

interface WeatherCardProps {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function WeatherCard({
  time,
  temperature,
  weatherCode,
  isDay,
  isActive = false,
  onClick,
}: WeatherCardProps) {
  const { temperatureUnit } = useSettingsStore();

  return (
    <Card
      variant={isActive ? "glass-hero" : "glass"}
      className={cn(
        "flex flex-col items-center justify-between py-4 min-w-[80px] h-32 cursor-pointer transition-all duration-300",
        isActive
          ? "border-primary-500/50 shadow-lg scale-105"
          : "hover:bg-white/10 hover:border-white/20",
      )}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-white/80">
        {formatHour(time)}
      </span>

      <WeatherIcon
        code={weatherCode}
        isDay={isDay}
        size="md"
        className="drop-shadow-md"
      />

      <span className="text-lg font-bold text-white">
        {formatTemperature(temperature, temperatureUnit)}
      </span>
    </Card>
  );
}
