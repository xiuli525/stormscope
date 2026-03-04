import type { WeatherData } from "@/types/weather";

export type AlertLevel = "yellow" | "orange" | "red";
export type AlertType = "heavyRain" | "highTemp" | "coldWave" | "strongWind";

export interface WeatherAlert {
  type: AlertType;
  level: AlertLevel;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  value: number;
  unit: string;
}

/**
 * 暴雨预警
 * 红色: 日降水 > 50mm
 * 橙色: 日降水 > 25mm
 * 黄色: 日降水 > 10mm
 */
function checkHeavyRain(daily: WeatherData["daily"]): WeatherAlert | null {
  const todayPrecip = daily.precipitationSum[0] ?? 0;
  if (todayPrecip > 50) {
    return {
      type: "heavyRain",
      level: "red",
      title: "暴雨红色预警",
      titleEn: "Heavy Rain Red Alert",
      description: `今日累计降水量 ${todayPrecip.toFixed(1)}mm，请注意防洪避险`,
      descriptionEn: `Total precipitation today: ${todayPrecip.toFixed(1)}mm. Flood risk, take precautions.`,
      icon: "🌊",
      value: todayPrecip,
      unit: "mm",
    };
  }
  if (todayPrecip > 25) {
    return {
      type: "heavyRain",
      level: "orange",
      title: "暴雨橙色预警",
      titleEn: "Heavy Rain Orange Alert",
      description: `今日累计降水量 ${todayPrecip.toFixed(1)}mm，出行请携带雨具`,
      descriptionEn: `Total precipitation today: ${todayPrecip.toFixed(1)}mm. Carry rain gear.`,
      icon: "🌧️",
      value: todayPrecip,
      unit: "mm",
    };
  }
  if (todayPrecip > 10) {
    return {
      type: "heavyRain",
      level: "yellow",
      title: "暴雨黄色预警",
      titleEn: "Rain Yellow Alert",
      description: `今日累计降水量 ${todayPrecip.toFixed(1)}mm，注意防雨`,
      descriptionEn: `Total precipitation today: ${todayPrecip.toFixed(1)}mm. Rain expected.`,
      icon: "🌦️",
      value: todayPrecip,
      unit: "mm",
    };
  }
  return null;
}

/**
 * 高温预警
 * 红色: 最高温 > 40°C
 * 橙色: 最高温 > 35°C
 * 黄色: 最高温 > 33°C
 */
function checkHighTemp(daily: WeatherData["daily"]): WeatherAlert | null {
  const todayMax = daily.temperatureMax[0] ?? 0;
  if (todayMax > 40) {
    return {
      type: "highTemp",
      level: "red",
      title: "高温红色预警",
      titleEn: "Extreme Heat Red Alert",
      description: `今日最高温 ${todayMax.toFixed(1)}°C，请避免户外活动`,
      descriptionEn: `Max temperature today: ${todayMax.toFixed(1)}°C. Avoid outdoor activities.`,
      icon: "🔥",
      value: todayMax,
      unit: "°C",
    };
  }
  if (todayMax > 35) {
    return {
      type: "highTemp",
      level: "orange",
      title: "高温橙色预警",
      titleEn: "Heat Orange Alert",
      description: `今日最高温 ${todayMax.toFixed(1)}°C，注意防暑降温`,
      descriptionEn: `Max temperature today: ${todayMax.toFixed(1)}°C. Stay hydrated.`,
      icon: "☀️",
      value: todayMax,
      unit: "°C",
    };
  }
  if (todayMax > 33) {
    return {
      type: "highTemp",
      level: "yellow",
      title: "高温黄色预警",
      titleEn: "Heat Yellow Alert",
      description: `今日最高温 ${todayMax.toFixed(1)}°C，适当补充水分`,
      descriptionEn: `Max temperature today: ${todayMax.toFixed(1)}°C. Drink plenty of water.`,
      icon: "🌡️",
      value: todayMax,
      unit: "°C",
    };
  }
  return null;
}

/**
 * 寒潮预警
 * 检测相邻两天降温幅度
 * 橙色: 降温 > 12°C
 * 黄色: 降温 > 8°C
 */
function checkColdWave(daily: WeatherData["daily"]): WeatherAlert | null {
  if (daily.temperatureMax.length < 2) return null;
  const todayMax = daily.temperatureMax[0];
  const tomorrowMax = daily.temperatureMax[1];
  const drop = todayMax - tomorrowMax;

  if (drop > 12) {
    return {
      type: "coldWave",
      level: "orange",
      title: "寒潮橙色预警",
      titleEn: "Cold Wave Orange Alert",
      description: `明日将降温 ${drop.toFixed(1)}°C，请及时添衣保暖`,
      descriptionEn: `Temperature will drop ${drop.toFixed(1)}°C tomorrow. Dress warmly.`,
      icon: "🥶",
      value: drop,
      unit: "°C",
    };
  }
  if (drop > 8) {
    return {
      type: "coldWave",
      level: "yellow",
      title: "寒潮黄色预警",
      titleEn: "Cold Wave Yellow Alert",
      description: `明日将降温 ${drop.toFixed(1)}°C，注意保暖`,
      descriptionEn: `Temperature will drop ${drop.toFixed(1)}°C tomorrow. Keep warm.`,
      icon: "❄️",
      value: drop,
      unit: "°C",
    };
  }
  return null;
}

/**
 * 大风预警
 * 红色: 风速 > 90 km/h
 * 橙色: 风速 > 60 km/h
 * 黄色: 风速 > 40 km/h
 */
function checkStrongWind(daily: WeatherData["daily"]): WeatherAlert | null {
  const todayWind = daily.windSpeedMax[0] ?? 0;
  if (todayWind > 90) {
    return {
      type: "strongWind",
      level: "red",
      title: "大风红色预警",
      titleEn: "Strong Wind Red Alert",
      description: `今日最大风速 ${todayWind.toFixed(0)} km/h，请关好门窗`,
      descriptionEn: `Max wind speed: ${todayWind.toFixed(0)} km/h. Secure doors and windows.`,
      icon: "🌪️",
      value: todayWind,
      unit: "km/h",
    };
  }
  if (todayWind > 60) {
    return {
      type: "strongWind",
      level: "orange",
      title: "大风橙色预警",
      titleEn: "Strong Wind Orange Alert",
      description: `今日最大风速 ${todayWind.toFixed(0)} km/h，外出注意安全`,
      descriptionEn: `Max wind speed: ${todayWind.toFixed(0)} km/h. Be cautious outdoors.`,
      icon: "💨",
      value: todayWind,
      unit: "km/h",
    };
  }
  if (todayWind > 40) {
    return {
      type: "strongWind",
      level: "yellow",
      title: "大风黄色预警",
      titleEn: "Wind Yellow Alert",
      description: `今日最大风速 ${todayWind.toFixed(0)} km/h，注意防风`,
      descriptionEn: `Max wind speed: ${todayWind.toFixed(0)} km/h. Wind advisory.`,
      icon: "🍃",
      value: todayWind,
      unit: "km/h",
    };
  }
  return null;
}

/**
 * 检测所有极端天气，返回预警列表（按严重程度排序）
 */
export function detectAlerts(weather: WeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  const rain = checkHeavyRain(weather.daily);
  if (rain) alerts.push(rain);

  const heat = checkHighTemp(weather.daily);
  if (heat) alerts.push(heat);

  const cold = checkColdWave(weather.daily);
  if (cold) alerts.push(cold);

  const wind = checkStrongWind(weather.daily);
  if (wind) alerts.push(wind);

  // Sort by severity: red > orange > yellow
  const levelOrder: Record<AlertLevel, number> = {
    red: 0,
    orange: 1,
    yellow: 2,
  };
  alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return alerts;
}

export const ALERT_COLORS: Record<
  AlertLevel,
  { bg: string; border: string; text: string; bgLight: string }
> = {
  red: {
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.5)",
    text: "#fca5a5",
    bgLight: "rgba(239, 68, 68, 0.08)",
  },
  orange: {
    bg: "rgba(249, 115, 22, 0.15)",
    border: "rgba(249, 115, 22, 0.5)",
    text: "#fdba74",
    bgLight: "rgba(249, 115, 22, 0.08)",
  },
  yellow: {
    bg: "rgba(234, 179, 8, 0.15)",
    border: "rgba(234, 179, 8, 0.5)",
    text: "#fde047",
    bgLight: "rgba(234, 179, 8, 0.08)",
  },
};

export const ALERT_COLORS_LIGHT: Record<
  AlertLevel,
  { bg: string; border: string; text: string }
> = {
  red: {
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#dc2626",
  },
  orange: {
    bg: "rgba(249, 115, 22, 0.08)",
    border: "rgba(249, 115, 22, 0.3)",
    text: "#ea580c",
  },
  yellow: {
    bg: "rgba(234, 179, 8, 0.08)",
    border: "rgba(234, 179, 8, 0.3)",
    text: "#ca8a04",
  },
};
