import { useQuery } from "@tanstack/react-query";
import { getAirQuality } from "@/services/air-quality";
import type { AirQualityData } from "@/types/air-quality";

export function useAirQuality(lat: number | null, lon: number | null) {
  return useQuery<AirQualityData>({
    queryKey: ["airQuality", lat, lon],
    queryFn: () => getAirQuality(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 30 * 60 * 1000, // auto-refresh every 30 min
  });
}
