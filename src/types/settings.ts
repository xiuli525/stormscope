import type {
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from "./weather";
import type { AqiStandard } from "./air-quality";

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
  aqiStandard: AqiStandard;
  language: string;
  theme: "light" | "dark" | "system";
}

export const DEFAULT_SETTINGS: UserSettings = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  precipitationUnit: "mm",
  aqiStandard: "us",
  language: "en",
  theme: "system",
};
