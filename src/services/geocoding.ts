import { GEOCODING_URL, fetchApi, buildParams } from "./api";
import type { GeocodingResponse, GeocodingResult } from "@/types/geocoding";

export async function searchCities(
  query: string,
  count: number = 10,
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = buildParams({
    name: query.trim(),
    count,
    language: "en",
    format: "json",
  });

  const data = await fetchApi<GeocodingResponse>(
    `${GEOCODING_URL}/search?${params}`,
  );
  return data.results ?? [];
}
