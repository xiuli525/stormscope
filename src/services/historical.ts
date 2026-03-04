import { ARCHIVE_URL, fetchApi, buildParams } from "./api";

export interface HistoricalDailyData {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  windSpeedMax: number[];
}

interface HistoricalApiResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

export async function getHistoricalData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
): Promise<HistoricalDailyData> {
  const params = buildParams({
    latitude: lat,
    longitude: lon,
    start_date: startDate,
    end_date: endDate,
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    timezone: "auto",
  });

  const data = await fetchApi<HistoricalApiResponse>(
    `${ARCHIVE_URL}/archive?${params}`,
  );

  return {
    time: data.daily.time,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    precipitationSum: data.daily.precipitation_sum,
    windSpeedMax: data.daily.wind_speed_10m_max,
  };
}
