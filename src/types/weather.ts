export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  dewpoint: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  windSpeed: number[];
  windDirection: number[];
}

export interface DailyForecast {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  sunrise: string[];
  sunset: string[];
  windSpeedMax: number[];
  windDirectionDominant: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
  latitude: number;
  longitude: number;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "ms" | "mph" | "knots";
export type PrecipitationUnit = "mm" | "inch";
