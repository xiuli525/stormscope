import { BASE_URL, fetchApi, buildParams } from "./api";
import type {
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "@/types/weather";

interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    visibility: number;
    uv_index: number;
    dewpoint_2m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

function transformResponse(data: ForecastApiResponse): WeatherData {
  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    pressure: data.current.surface_pressure,
    cloudCover: data.current.cloud_cover,
    visibility: data.current.visibility,
    uvIndex: data.current.uv_index,
    dewpoint: data.current.dewpoint_2m,
    isDay: data.current.is_day === 1,
  };

  const hourly: HourlyForecast = {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    precipitationProbability: data.hourly.precipitation_probability,
    weatherCode: data.hourly.weather_code,
    windSpeed: data.hourly.wind_speed_10m,
    windDirection: data.hourly.wind_direction_10m,
  };

  const daily: DailyForecast = {
    time: data.daily.time,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    weatherCode: data.daily.weather_code,
    precipitationSum: data.daily.precipitation_sum,
    precipitationProbabilityMax: data.daily.precipitation_probability_max,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    windSpeedMax: data.daily.wind_speed_10m_max,
    windDirectionDominant: data.daily.wind_direction_10m_dominant,
  };

  return {
    current,
    hourly,
    daily,
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

export async function getWeatherData(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const params = buildParams({
    latitude: lat,
    longitude: lon,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,visibility,uv_index,dewpoint_2m,is_day",
    hourly:
      "temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant",
    timezone: "auto",
    forecast_days: 7,
  });

  const data = await fetchApi<ForecastApiResponse>(
    `${BASE_URL}/forecast?${params}`,
  );
  return transformResponse(data);
}
