import i18n from "../i18n";
import { GEOCODING_URL, fetchApi, buildParams } from "./api";
import type { GeocodingResult, FavoriteCity } from "@/types/geocoding";

function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

const CHINESE_CITY_PINYIN: Record<string, string> = {
  "\u5317\u4eac": "Beijing",
  "\u4e0a\u6d77": "Shanghai",
  "\u5e7f\u5dde": "Guangzhou",
  "\u6df1\u5733": "Shenzhen",
  "\u5929\u6d25": "Tianjin",
  "\u91cd\u5e86": "Chongqing",
  "\u6210\u90fd": "Chengdu",
  "\u6b66\u6c49": "Wuhan",
  "\u897f\u5b89": "Xian",
  "\u5357\u4eac": "Nanjing",
  "\u676d\u5dde": "Hangzhou",
  "\u82cf\u5dde": "Suzhou",
  "\u957f\u6c99": "Changsha",
  "\u6d4e\u5357": "Jinan",
  "\u90d1\u5dde": "Zhengzhou",
  "\u6c88\u9633": "Shenyang",
  "\u5927\u8fde": "Dalian",
  "\u54c8\u5c14\u6ee8": "Harbin",
  "\u957f\u6625": "Changchun",
  "\u592a\u539f": "Taiyuan",
  "\u5408\u80a5": "Hefei",
  "\u798f\u5dde": "Fuzhou",
  "\u53a6\u95e8": "Xiamen",
  "\u6606\u660e": "Kunming",
  "\u8d35\u9633": "Guiyang",
  "\u5357\u5b81": "Nanning",
  "\u6d77\u53e3": "Haikou",
  "\u4e4c\u9c81\u6728\u9f50": "Urumqi",
  "\u5170\u5dde": "Lanzhou",
  "\u94f6\u5ddd": "Yinchuan",
  "\u897f\u5b81": "Xining",
  "\u62c9\u8428": "Lhasa",
  "\u547c\u548c\u6d69\u7279": "Hohhot",
  "\u77f3\u5bb6\u5e84": "Shijiazhuang",
  "\u5357\u660c": "Nanchang",
  "\u65e0\u9521": "Wuxi",
  "\u4e1c\u83de": "Dongguan",
  "\u4f5b\u5c71": "Foshan",
  "\u73e0\u6d77": "Zhuhai",
  "\u5b81\u6ce2": "Ningbo",
  "\u6e29\u5dde": "Wenzhou",
  "\u9752\u5c9b": "Qingdao",
  "\u70df\u53f0": "Yantai",
  "\u5f90\u5dde": "Xuzhou",
  "\u5e38\u5dde": "Changzhou",
  "\u4e1c\u4eac": "Tokyo",
  "\u9996\u5c14": "Seoul",
  "\u53f0\u5317": "Taipei",
  "\u9999\u6e2f": "Hong Kong",
  "\u6fb3\u95e8": "Macau",
};

function mapRawResult(r: Record<string, unknown>): GeocodingResult {
  return {
    id: r.id as number,
    name: r.name as string,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    country: (r.country as string) ?? "",
    countryCode: ((r.country_code ?? r.countryCode) as string) ?? "",
    admin1: r.admin1 as string | undefined,
    admin2: r.admin2 as string | undefined,
    timezone: (r.timezone as string) ?? "",
    population: r.population as number | undefined,
    elevation: r.elevation as number | undefined,
  };
}

async function fetchCities(
  query: string,
  count: number,
  language: string,
): Promise<GeocodingResult[]> {
  const params = buildParams({
    name: query.trim(),
    count,
    language,
    format: "json",
  });
  const data = await fetchApi<{ results?: Record<string, unknown>[] }>(
    `${GEOCODING_URL}/search?${params}`,
  );
  return (data.results ?? []).map(mapRawResult);
}

export async function searchCities(
  query: string,
  count: number = 10,
  language: string = i18n.language,
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const results = await fetchCities(query, count, language);

  // Open-Meteo's Chinese name search is unreliable for major cities.
  // If the query is Chinese and results lack high-population cities, retry with pinyin/English.
  if (containsChinese(query)) {
    const hasHighPop = results.some((r) => (r.population ?? 0) > 100000);
    if (!hasHighPop) {
      const pinyinName = CHINESE_CITY_PINYIN[query.trim()];
      const fallbackQuery = pinyinName ?? query;
      const fallbackLang = pinyinName ? language : "en";
      const enResults = await fetchCities(fallbackQuery, count, fallbackLang);
      const existingIds = new Set(results.map((r) => r.id));
      const merged = [...results];
      for (const r of enResults) {
        if (!existingIds.has(r.id)) {
          merged.push(r);
          existingIds.add(r.id);
        }
      }
      merged.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
      return merged.slice(0, count);
    }
  }

  return results;
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
    const nominatimBase = import.meta.env.DEV
      ? "/api/nominatim"
      : "https://nominatim.openstreetmap.org";
    const response = await fetch(
      `${nominatimBase}/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${i18n.language}`,
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
