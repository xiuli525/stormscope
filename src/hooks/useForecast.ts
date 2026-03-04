import { useWeather } from "./useWeather";
import type { DailyForecast, HourlyForecast } from "@/types/weather";

export function useForecast(lat: number | null, lon: number | null) {
  const query = useWeather(lat, lon);

  const hourly: HourlyForecast | undefined = query.data?.hourly;
  const daily: DailyForecast | undefined = query.data?.daily;

  return {
    ...query,
    hourly,
    daily,
  };
}
