interface WmoInfo {
  description: string;
  icon: string;
  iconNight?: string;
}

const WMO_CODES: Record<number, WmoInfo> = {
  0: { description: "Clear sky", icon: "clear-day", iconNight: "clear-night" },
  1: {
    description: "Mainly clear",
    icon: "clear-day",
    iconNight: "clear-night",
  },
  2: {
    description: "Partly cloudy",
    icon: "partly-cloudy-day",
    iconNight: "partly-cloudy-night",
  },
  3: {
    description: "Overcast",
    icon: "overcast-day",
    iconNight: "overcast-night",
  },
  45: { description: "Fog", icon: "fog-day", iconNight: "fog-night" },
  48: { description: "Rime fog", icon: "fog-day", iconNight: "fog-night" },
  51: { description: "Light drizzle", icon: "drizzle" },
  53: { description: "Moderate drizzle", icon: "drizzle" },
  55: { description: "Dense drizzle", icon: "drizzle" },
  56: { description: "Light freezing drizzle", icon: "sleet" },
  57: { description: "Dense freezing drizzle", icon: "sleet" },
  61: { description: "Slight rain", icon: "rain" },
  63: { description: "Moderate rain", icon: "rain" },
  65: { description: "Heavy rain", icon: "rain" },
  66: { description: "Light freezing rain", icon: "sleet" },
  67: { description: "Heavy freezing rain", icon: "sleet" },
  71: { description: "Slight snowfall", icon: "snow" },
  73: { description: "Moderate snowfall", icon: "snow" },
  75: { description: "Heavy snowfall", icon: "snow" },
  77: { description: "Snow grains", icon: "snow" },
  80: { description: "Slight rain showers", icon: "rain" },
  81: { description: "Moderate rain showers", icon: "rain" },
  82: { description: "Violent rain showers", icon: "thunderstorms-rain" },
  85: { description: "Slight snow showers", icon: "snow" },
  86: { description: "Heavy snow showers", icon: "snow" },
  95: { description: "Thunderstorm", icon: "thunderstorms" },
  96: {
    description: "Thunderstorm with slight hail",
    icon: "thunderstorms-rain",
  },
  99: {
    description: "Thunderstorm with heavy hail",
    icon: "thunderstorms-rain",
  },
};

export function getWmoDescription(
  code: number,
  t?: (key: string, options?: Record<string, unknown>) => string,
): string {
  if (t) {
    const translated = t(`wmo.${code}`, { defaultValue: "" });
    if (translated) return translated;
  }
  return WMO_CODES[code]?.description ?? "Unknown";
}

export function getWmoIcon(code: number, isDay: boolean = true): string {
  const info = WMO_CODES[code];
  if (!info) return "not-available";
  if (!isDay && info.iconNight) return info.iconNight;
  return info.icon;
}

export function getMeteoconUrl(code: number, isDay: boolean = true): string {
  const iconName = getWmoIcon(code, isDay);
  return `https://basmilius.github.io/weather-icons/production/fill/all/${iconName}.svg`;
}
