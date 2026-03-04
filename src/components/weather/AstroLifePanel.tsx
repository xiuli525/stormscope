import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import type { WeatherData } from "@/types/weather";
import type { AirQualityData } from "@/types/air-quality";

interface AstroLifePanelProps {
  weather: WeatherData;
  airQuality?: AirQualityData | null;
}

function getMoonPhase(date: Date): {
  phase: number;
  name: string;
  nameEn: string;
  emoji: string;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }

  jd =
    Math.floor(365.25 * (c + 4716)) +
    Math.floor(30.6001 * (e + 1)) +
    day -
    1524.5;
  b = Math.floor((jd - 2451550.1) / 29.530588853);
  const phase = ((jd - 2451550.1) / 29.530588853 - b) * 29.530588853;
  const normalizedPhase = phase / 29.530588853;

  const phases: Array<{
    min: number;
    max: number;
    name: string;
    nameEn: string;
    emoji: string;
  }> = [
    { min: 0, max: 0.0625, name: "新月", nameEn: "New Moon", emoji: "🌑" },
    {
      min: 0.0625,
      max: 0.1875,
      name: "蛾眉月",
      nameEn: "Waxing Crescent",
      emoji: "🌒",
    },
    {
      min: 0.1875,
      max: 0.3125,
      name: "上弦月",
      nameEn: "First Quarter",
      emoji: "🌓",
    },
    {
      min: 0.3125,
      max: 0.4375,
      name: "盈凸月",
      nameEn: "Waxing Gibbous",
      emoji: "🌔",
    },
    {
      min: 0.4375,
      max: 0.5625,
      name: "满月",
      nameEn: "Full Moon",
      emoji: "🌕",
    },
    {
      min: 0.5625,
      max: 0.6875,
      name: "亏凸月",
      nameEn: "Waning Gibbous",
      emoji: "🌖",
    },
    {
      min: 0.6875,
      max: 0.8125,
      name: "下弦月",
      nameEn: "Last Quarter",
      emoji: "🌗",
    },
    {
      min: 0.8125,
      max: 0.9375,
      name: "残月",
      nameEn: "Waning Crescent",
      emoji: "🌘",
    },
    { min: 0.9375, max: 1.01, name: "新月", nameEn: "New Moon", emoji: "🌑" },
  ];

  const current =
    phases.find((p) => normalizedPhase >= p.min && normalizedPhase < p.max) ??
    phases[0];

  return {
    phase: normalizedPhase,
    name: current.name,
    nameEn: current.nameEn,
    emoji: current.emoji,
  };
}

function SunArc({
  sunrise,
  sunset,
}: {
  sunrise: string;
  sunset: string;
  timezone: string;
}) {
  const now = new Date();
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);

  const dayLength = sunsetDate.getTime() - sunriseDate.getTime();
  const elapsed = now.getTime() - sunriseDate.getTime();
  const progress = Math.max(0, Math.min(1, elapsed / dayLength));
  const isDaytime = progress > 0 && progress < 1;

  const width = 280;
  const height = 100;
  const padding = 20;
  const arcWidth = width - padding * 2;
  const arcHeight = height - 30;

  const sunX = padding + progress * arcWidth;
  const sunY = height - 10 - Math.sin(progress * Math.PI) * arcHeight;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const pathD = `M ${padding} ${height - 10} Q ${width / 2} ${height - 10 - arcHeight * 1.3} ${width - padding} ${height - 10}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[280px]">
      <path
        d={pathD}
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.3"
      />
      {isDaytime && (
        <path
          d={pathD}
          fill="none"
          stroke="url(#sunGradient)"
          strokeWidth="2"
          strokeDasharray={`${progress * 300} 300`}
        />
      )}
      <defs>
        <linearGradient id="sunGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      {isDaytime && (
        <>
          <circle cx={sunX} cy={sunY} r="14" fill="url(#sunGlow)" />
          <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
          <circle cx={sunX} cy={sunY} r="4" fill="#f59e0b" />
        </>
      )}
      <line
        x1={padding}
        y1={height - 10}
        x2={width - padding}
        y2={height - 10}
        stroke="var(--text-muted)"
        strokeWidth="1"
        opacity="0.15"
      />
      <text
        x={padding}
        y={height - 0}
        fontSize="10"
        fill="var(--text-tertiary)"
        textAnchor="start"
      >
        ☀ {formatTime(sunrise)}
      </text>
      <text
        x={width - padding}
        y={height - 0}
        fontSize="10"
        fill="var(--text-tertiary)"
        textAnchor="end"
      >
        🌙 {formatTime(sunset)}
      </text>
    </svg>
  );
}

interface LifeSuggestion {
  category: string;
  categoryEn: string;
  icon: string;
  level: string;
  levelEn: string;
  tip: string;
  tipEn: string;
  color: string;
}

function getLifeSuggestions(
  weather: WeatherData,
  airQuality?: AirQualityData | null,
): LifeSuggestion[] {
  const { temperature, windSpeed, humidity, uvIndex, precipitation } =
    weather.current;
  const precipProb = weather.daily.precipitationProbabilityMax[0] ?? 0;
  const currentAqi = airQuality?.hourly?.usAqi?.[0] ?? 0;

  const suggestions: LifeSuggestion[] = [];

  let dressLevel: string;
  let dressLevelEn: string;
  let dressTip: string;
  let dressTipEn: string;
  let dressColor: string;

  if (temperature < 0) {
    dressLevel = "厚冬装";
    dressLevelEn = "Heavy Winter";
    dressTip = "羽绒服、围巾、手套必备";
    dressTipEn = "Down jacket, scarf, gloves required";
    dressColor = "#6366f1";
  } else if (temperature < 10) {
    dressLevel = "冬装";
    dressLevelEn = "Winter";
    dressTip = "厚外套或棉衣";
    dressTipEn = "Heavy coat or padded jacket";
    dressColor = "#3b82f6";
  } else if (temperature < 20) {
    dressLevel = "薄外套";
    dressLevelEn = "Light Jacket";
    dressTip = "薄外套或卫衣";
    dressTipEn = "Light jacket or hoodie";
    dressColor = "#22c55e";
  } else if (temperature < 28) {
    dressLevel = "舒适";
    dressLevelEn = "Comfortable";
    dressTip = "T恤、薄长裤";
    dressTipEn = "T-shirt, light pants";
    dressColor = "#eab308";
  } else {
    dressLevel = "清凉";
    dressLevelEn = "Light";
    dressTip = "短袖短裤，注意防晒";
    dressTipEn = "Shorts & tee, wear sunscreen";
    dressColor = "#ef4444";
  }

  suggestions.push({
    category: "穿衣",
    categoryEn: "Clothing",
    icon: "👔",
    level: dressLevel,
    levelEn: dressLevelEn,
    tip: dressTip,
    tipEn: dressTipEn,
    color: dressColor,
  });

  let exerciseLevel: string;
  let exerciseLevelEn: string;
  let exerciseTip: string;
  let exerciseTipEn: string;
  let exerciseColor: string;

  const badAir = currentAqi > 150;
  const badTemp = temperature > 35 || temperature < -10;
  const badWind = windSpeed > 50;
  const badRain = precipProb > 60 || precipitation > 2;

  if (badAir || badTemp) {
    exerciseLevel = "不宜";
    exerciseLevelEn = "Not Advised";
    exerciseTip = badAir
      ? "空气质量差，建议室内运动"
      : "温度极端，避免户外运动";
    exerciseTipEn = badAir
      ? "Poor air quality, exercise indoors"
      : "Extreme temperature, stay indoors";
    exerciseColor = "#ef4444";
  } else if (badWind || badRain) {
    exerciseLevel = "一般";
    exerciseLevelEn = "Fair";
    exerciseTip = badRain
      ? "降雨概率高，建议室内运动"
      : "风力较大，选择室内运动";
    exerciseTipEn = badRain
      ? "High rain chance, exercise indoors"
      : "Strong wind, exercise indoors";
    exerciseColor = "#f97316";
  } else {
    exerciseLevel = "适宜";
    exerciseLevelEn = "Great";
    exerciseTip = "适合户外运动";
    exerciseTipEn = "Perfect for outdoor exercise";
    exerciseColor = "#22c55e";
  }

  suggestions.push({
    category: "运动",
    categoryEn: "Exercise",
    icon: "🏃",
    level: exerciseLevel,
    levelEn: exerciseLevelEn,
    tip: exerciseTip,
    tipEn: exerciseTipEn,
    color: exerciseColor,
  });

  let carWashLevel: string;
  let carWashLevelEn: string;
  let carWashTip: string;
  let carWashTipEn: string;
  let carWashColor: string;

  if (precipProb > 50 || precipitation > 1) {
    carWashLevel = "不宜";
    carWashLevelEn = "Not Advised";
    carWashTip = "降雨可能性大，不建议洗车";
    carWashTipEn = "Rain likely, skip the car wash";
    carWashColor = "#ef4444";
  } else if (precipProb > 25 || windSpeed > 30 || humidity > 85) {
    carWashLevel = "一般";
    carWashLevelEn = "Fair";
    carWashTip = "天气不太稳定，酌情考虑";
    carWashTipEn = "Unstable weather, consider carefully";
    carWashColor = "#f97316";
  } else {
    carWashLevel = "适宜";
    carWashLevelEn = "Great";
    carWashTip = "天气晴好，适合洗车";
    carWashTipEn = "Clear weather, perfect for a car wash";
    carWashColor = "#22c55e";
  }

  suggestions.push({
    category: "洗车",
    categoryEn: "Car Wash",
    icon: "🚗",
    level: carWashLevel,
    levelEn: carWashLevelEn,
    tip: carWashTip,
    tipEn: carWashTipEn,
    color: carWashColor,
  });

  let uvLevel: string;
  let uvLevelEn: string;
  let uvTip: string;
  let uvTipEn: string;
  let uvColor: string;

  if (uvIndex > 10) {
    uvLevel = "极强";
    uvLevelEn = "Extreme";
    uvTip = "避免户外暴晒，必须涂防晒霜";
    uvTipEn = "Avoid sun exposure, sunscreen required";
    uvColor = "#a855f7";
  } else if (uvIndex > 7) {
    uvLevel = "很强";
    uvLevelEn = "Very High";
    uvTip = "减少户外时间，涂抹防晒霜";
    uvTipEn = "Limit outdoor time, apply sunscreen";
    uvColor = "#ef4444";
  } else if (uvIndex > 5) {
    uvLevel = "较强";
    uvLevelEn = "High";
    uvTip = "戴帽子和太阳镜";
    uvTipEn = "Wear hat and sunglasses";
    uvColor = "#f97316";
  } else if (uvIndex > 2) {
    uvLevel = "中等";
    uvLevelEn = "Moderate";
    uvTip = "适当防晒即可";
    uvTipEn = "Light sun protection advised";
    uvColor = "#eab308";
  } else {
    uvLevel = "弱";
    uvLevelEn = "Low";
    uvTip = "无需特别防晒";
    uvTipEn = "No protection needed";
    uvColor = "#22c55e";
  }

  suggestions.push({
    category: "紫外线",
    categoryEn: "UV Index",
    icon: "🕶️",
    level: uvLevel,
    levelEn: uvLevelEn,
    tip: uvTip,
    tipEn: uvTipEn,
    color: uvColor,
  });

  return suggestions;
}

function SuggestionCard({
  suggestion,
  isZh,
}: {
  suggestion: LifeSuggestion;
  isZh: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-primary)] border border-[var(--glass-border-default)]">
      <span className="text-2xl flex-shrink-0">{suggestion.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)] font-medium">
            {isZh ? suggestion.category : suggestion.categoryEn}
          </span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{
              color: suggestion.color,
              backgroundColor: `${suggestion.color}15`,
            }}
          >
            {isZh ? suggestion.level : suggestion.levelEn}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
          {isZh ? suggestion.tip : suggestion.tipEn}
        </p>
      </div>
    </div>
  );
}

export function AstroLifePanel({ weather, airQuality }: AstroLifePanelProps) {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  const moonPhase = useMemo(() => getMoonPhase(new Date()), []);
  const suggestions = useMemo(
    () => getLifeSuggestions(weather, airQuality),
    [weather, airQuality],
  );

  const todaySunrise = weather.daily.sunrise[0];
  const todaySunset = weather.daily.sunset[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-[var(--text-primary)] pl-1">
        {t("astro.title", "天文与生活")}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="glass" className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {t("astro.sunMoon", "日月轨迹")}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moonPhase.emoji}</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                {isZh ? moonPhase.name : moonPhase.nameEn}
              </span>
            </div>
          </div>

          {todaySunrise && todaySunset && (
            <div className="flex justify-center">
              <SunArc
                sunrise={todaySunrise}
                sunset={todaySunset}
                timezone={weather.timezone}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {t("astro.dayLength", "白昼时长")}
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                {(() => {
                  if (!todaySunrise || !todaySunset) return "--";
                  const ms =
                    new Date(todaySunset).getTime() -
                    new Date(todaySunrise).getTime();
                  const hours = Math.floor(ms / 3600000);
                  const minutes = Math.floor((ms % 3600000) / 60000);
                  return `${hours}h ${minutes}m`;
                })()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {t("astro.moonPhase", "月相")}
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                {isZh ? moonPhase.name : moonPhase.nameEn}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)]">
                {t("astro.moonCycle", "月龄")}
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
                {(moonPhase.phase * 29.53).toFixed(1)}d
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {t("astro.lifeSuggestions", "生活建议")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s) => (
              <SuggestionCard key={s.category} suggestion={s} isZh={isZh} />
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
