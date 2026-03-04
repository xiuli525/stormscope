import i18n from "../i18n";
import { GEOCODING_URL, fetchApi, buildParams } from "./api";
import type {
  GeocodingResponse,
  GeocodingResult,
  FavoriteCity,
} from "@/types/geocoding";

export async function searchCities(
  query: string,
  count: number = 10,
  language: string = i18n.language,
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = buildParams({
    name: query.trim(),
    count,
    language,
    format: "json",
  });

  const data = await fetchApi<GeocodingResponse>(
    `${GEOCODING_URL}/search?${params}`,
  );
  return data.results ?? [];
}

/**
 * Reverse geocode coordinates to a city using Nominatim API.
 * Open-Meteo doesn't have a reverse geocoding endpoint,
 * so we use Nominatim as a fallback then look up the city via Open-Meteo.
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<FavoriteCity | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${i18n.language}`,
      {
        headers: { "User-Agent": "StormScope/1.0" },
      },
    );
    if (!response.ok) throw new Error("Nominatim request failed");

    const data = (await response.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
      };
      display_name?: string;
    };

    const addr = data.address;
    if (!addr) return null;

    const cityName =
      addr.city || addr.town || addr.village || addr.county || "未知位置";
    const country = addr.country || "";
    const countryCode = (addr.country_code || "").toUpperCase();
    const admin1 = addr.state || undefined;

    return {
      id: `geo_${lat.toFixed(4)}_${lon.toFixed(4)}`,
      name: cityName,
      country,
      countryCode,
      latitude: lat,
      longitude: lon,
      admin1,
    };
  } catch {
    return {
      id: `geo_${lat.toFixed(4)}_${lon.toFixed(4)}`,
      name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      country: "",
      countryCode: "",
      latitude: lat,
      longitude: lon,
    };
  }
}
