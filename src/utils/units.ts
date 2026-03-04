import type {
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from "@/types/weather";

export function convertTemperature(
  celsius: number,
  unit: TemperatureUnit,
): number {
  if (unit === "fahrenheit") return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit,
): string {
  const value = convertTemperature(celsius, unit);
  return `${value}°${unit === "fahrenheit" ? "F" : "C"}`;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  switch (unit) {
    case "ms":
      return Math.round((kmh / 3.6) * 10) / 10;
    case "mph":
      return Math.round((kmh / 1.609) * 10) / 10;
    case "knots":
      return Math.round((kmh / 1.852) * 10) / 10;
    default:
      return Math.round(kmh * 10) / 10;
  }
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const value = convertWindSpeed(kmh, unit);
  const labels: Record<WindSpeedUnit, string> = {
    kmh: "km/h",
    ms: "m/s",
    mph: "mph",
    knots: "kn",
  };
  return `${value} ${labels[unit]}`;
}

export function convertPrecipitation(
  mm: number,
  unit: PrecipitationUnit,
): number {
  if (unit === "inch") return Math.round((mm / 25.4) * 100) / 100;
  return Math.round(mm * 10) / 10;
}

export function formatPrecipitation(
  mm: number,
  unit: PrecipitationUnit,
): string {
  const value = convertPrecipitation(mm, unit);
  return `${value} ${unit}`;
}

export function getWindDirectionLabel(
  degrees: number,
  t?: (key: string) => string,
): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  const dir = directions[index];
  return t ? t(`wind.${dir}`) : dir;
}

export function getUvLabel(
  index: number,
  t?: (key: string) => string,
): { label: string; color: string } {
  if (index <= 2) return { label: t ? t("uv.low") : "Low", color: "#22c55e" };
  if (index <= 5)
    return { label: t ? t("uv.moderate") : "Moderate", color: "#eab308" };
  if (index <= 7) return { label: t ? t("uv.high") : "High", color: "#f97316" };
  if (index <= 10)
    return { label: t ? t("uv.veryHigh") : "Very High", color: "#ef4444" };
  return { label: t ? t("uv.extreme") : "Extreme", color: "#a855f7" };
}

export function getVisibilityLabel(
  km: number,
  t?: (key: string) => string,
): string {
  if (km < 1) return t ? t("visibility.veryPoor") : "Very Poor";
  if (km < 4) return t ? t("visibility.poor") : "Poor";
  if (km < 10) return t ? t("visibility.moderate") : "Moderate";
  if (km < 20) return t ? t("visibility.good") : "Good";
  return t ? t("visibility.excellent") : "Excellent";
}
