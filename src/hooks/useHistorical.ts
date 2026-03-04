import { useQuery } from "@tanstack/react-query";
import {
  getHistoricalData,
  type HistoricalDailyData,
} from "@/services/historical";

export function useHistorical(
  lat: number | null,
  lon: number | null,
  startDate: string,
  endDate: string,
) {
  return useQuery<HistoricalDailyData>({
    queryKey: ["historical", lat, lon, startDate, endDate],
    queryFn: () => getHistoricalData(lat!, lon!, startDate, endDate),
    enabled:
      lat !== null &&
      lon !== null &&
      startDate.length > 0 &&
      endDate.length > 0,
    staleTime: 60 * 60 * 1000, // 1 hour — historical data doesn't change
  });
}
