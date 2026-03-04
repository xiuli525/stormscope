import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "@/services/weather";
import type { WeatherData } from "@/types/weather";

export function useWeather(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherData(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // auto-refresh every 10 min
  });
}
