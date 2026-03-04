import type { WeatherData } from "@/types/weather";
import type { AirQualityData } from "@/types/air-quality";
import { getWmoDescription } from "@/utils/wmo-codes";

export function buildSystemPrompt(
  cityName: string,
  weather: WeatherData | null,
  airQuality: AirQualityData | null,
  language: string,
): string {
  const lang = language === "zh" ? "中文" : "English";
  const weatherContext = weather ? formatWeatherContext(cityName, weather) : "";
  const aqiContext = airQuality ? formatAqiContext(airQuality) : "";

  return `你是 StormScope 天气助手，一个专业、友好的天气顾问。

## 角色设定
- 你是天气领域的专家，擅长解读气象数据并给出实用建议
- 你的回答应当简洁、准确、有温度
- 请使用 ${lang} 回答用户问题
- 支持 Markdown 格式（加粗、列表、表情等）

## 当前天气数据
${weatherContext || "暂无天气数据"}

${aqiContext ? `## 空气质量数据\n${aqiContext}` : ""}

## 回答规则
1. 基于上方的真实天气数据回答，不要编造数据
2. 给出具体、可操作的建议（如穿衣、出行、运动）
3. 如果用户问的问题超出天气范围，礼貌告知你只负责天气相关咨询
4. 适当使用天气相关的 emoji 让回答更生动
5. 如果数据中没有用户问的信息，坦诚告知而非猜测`;
}

function formatWeatherContext(cityName: string, weather: WeatherData): string {
  const { current, daily } = weather;
  const wmoDesc = getWmoDescription(current.weatherCode);

  const lines = [
    `城市: ${cityName}`,
    `天气状况: ${wmoDesc} (WMO代码: ${current.weatherCode})`,
    `当前温度: ${current.temperature}°C`,
    `体感温度: ${current.apparentTemperature}°C`,
    `湿度: ${current.humidity}%`,
    `风速: ${current.windSpeed} km/h, 风向: ${current.windDirection}°`,
    `气压: ${current.pressure} hPa`,
    `能见度: ${current.visibility / 1000} km`,
    `云量: ${current.cloudCover}%`,
    `紫外线指数: ${current.uvIndex}`,
    `露点: ${current.dewpoint}°C`,
    `降水量: ${current.precipitation} mm`,
    `${current.isDay ? "白天" : "夜间"}`,
  ];

  if (daily.time.length > 0) {
    lines.push("");
    lines.push("未来几天预报:");
    const count = Math.min(daily.time.length, 7);
    for (let i = 0; i < count; i++) {
      const desc = getWmoDescription(daily.weatherCode[i]);
      lines.push(
        `  ${daily.time[i]}: ${desc}, ${daily.temperatureMin[i]}°C ~ ${daily.temperatureMax[i]}°C, 降水概率 ${daily.precipitationProbabilityMax[i]}%`,
      );
    }
  }

  return lines.join("\n");
}

function formatAqiContext(airQuality: AirQualityData): string {
  const { current } = airQuality;
  return [
    `AQI (US EPA): ${current.usAqi}`,
    `AQI (欧洲): ${current.europeanAqi}`,
    `PM2.5: ${current.pm25} µg/m³`,
    `PM10: ${current.pm10} µg/m³`,
    `O₃: ${current.ozone} µg/m³`,
    `NO₂: ${current.nitrogenDioxide} µg/m³`,
    `SO₂: ${current.sulphurDioxide} µg/m³`,
    `CO: ${current.carbonMonoxide} µg/m³`,
  ].join("\n");
}

export const quickActions = {
  zh: [
    {
      label: "🏃 适合户外运动吗？",
      prompt: "今天的天气适合户外运动吗？请根据温度、风速、空气质量给出建议。",
    },
    {
      label: "👔 今天穿什么？",
      prompt: "根据今天的天气情况，请给我穿衣建议。",
    },
    {
      label: "📅 本周最佳出行日",
      prompt: "根据未来几天的天气预报，哪天最适合出行？为什么？",
    },
    {
      label: "☂️ 需要带伞吗？",
      prompt: "今天和明天需要带伞吗？请分析降水概率。",
    },
    {
      label: "🌅 天气总结",
      prompt: "请用简短的语言总结一下当前的天气状况，以及需要注意的事项。",
    },
  ],
  en: [
    {
      label: "🏃 Good for outdoor?",
      prompt:
        "Is today's weather suitable for outdoor activities? Please analyze temperature, wind, and air quality.",
    },
    {
      label: "👔 What to wear?",
      prompt: "Based on today's weather, what should I wear?",
    },
    {
      label: "📅 Best day this week",
      prompt:
        "Looking at the forecast for the next few days, which day is best for going out? Why?",
    },
    {
      label: "☂️ Need an umbrella?",
      prompt:
        "Do I need an umbrella today or tomorrow? Please analyze precipitation probability.",
    },
    {
      label: "🌅 Weather summary",
      prompt:
        "Please give me a brief summary of the current weather and any precautions.",
    },
  ],
} as const;
