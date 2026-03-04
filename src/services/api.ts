const BASE_URL = "https://api.open-meteo.com/v1";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

function buildParams(
  params: Record<string, string | number | boolean>,
): string {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
}

export {
  BASE_URL,
  AIR_QUALITY_URL,
  ARCHIVE_URL,
  GEOCODING_URL,
  fetchApi,
  buildParams,
};
