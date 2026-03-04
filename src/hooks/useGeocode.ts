import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/services/geocoding";
import type { GeocodingResult } from "@/types/geocoding";

export function useGeocode(query: string) {
  return useQuery<GeocodingResult[]>({
    queryKey: ["geocode", query],
    queryFn: () => searchCities(query),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 60 * 1000, // 30 minutes — city names rarely change
    placeholderData: [],
  });
}
