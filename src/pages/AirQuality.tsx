import { useMemo } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import { Card, Skeleton, Badge } from "@/components/ui";
import { AqiGauge } from "@/components/charts";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useThemeStore } from "@/stores/theme";
import { useAirQuality } from "@/hooks/useAirQuality";
import { US_AQI_LEVELS, EU_AQI_LEVELS } from "@/types/air-quality";
// @ts-ignore - Importing echarts register for side effects/setup if needed, or usage in options
import { echarts } from "@/themes/register";

const DEFAULT_CITY = {
  id: "beijing",
  name: "北京",
  country: "中国",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface PollutantInfo {
  key: string;
  nameKey: string;
  unit: string;
  descriptionKey: string;
}

const POLLUTANTS: PollutantInfo[] = [
  {
    key: "pm2_5",
    nameKey: "airQuality.pm25",
    unit: "µg/m³",
    descriptionKey: "airQuality.fineParticles",
  },
  {
    key: "pm10",
    nameKey: "airQuality.pm10",
    unit: "µg/m³",
    descriptionKey: "airQuality.coarseParticles",
  },
  {
    key: "ozone",
    nameKey: "airQuality.ozone",
    unit: "µg/m³",
    descriptionKey: "O₃",
  },
  {
    key: "nitrogenDioxide",
    nameKey: "airQuality.nitrogenDioxide",
    unit: "µg/m³",
    descriptionKey: "NO₂",
  },
  {
    key: "sulphurDioxide",
    nameKey: "airQuality.sulphurDioxide",
    unit: "µg/m³",
    descriptionKey: "SO₂",
  },
  {
    key: "carbonMonoxide",
    nameKey: "airQuality.carbonMonoxide",
    unit: "µg/m³",
    descriptionKey: "CO",
  },
];

export default function AirQuality() {
  const { t } = useTranslation();
  const { currentCity } = useFavoritesStore();
  const { aqiStandard } = useSettingsStore();
  const { resolvedTheme } = useThemeStore();

  const city = currentCity ?? DEFAULT_CITY;

  const { data: airQuality, isLoading } = useAirQuality(
    city.latitude,
    city.longitude,
  );

  const currentAqi = useMemo(() => {
    if (!airQuality?.hourly) return 0;
    const key = aqiStandard === "us" ? "usAqi" : "europeanAqi";
    return airQuality.hourly[key]?.[0] ?? 0;
  }, [airQuality, aqiStandard]);

  const aqiLevels = useMemo(() => {
    return aqiStandard === "us" ? US_AQI_LEVELS : EU_AQI_LEVELS;
  }, [aqiStandard]);

  const trendOption = useMemo(() => {
    if (!airQuality?.hourly?.time) return {};

    const timeData = airQuality.hourly.time.slice(0, 24).map((t: string) =>
      new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    const aqiKey = aqiStandard === "us" ? "usAqi" : "europeanAqi";
    const aqiData = airQuality.hourly[aqiKey]?.slice(0, 24) ?? [];

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(24, 24, 27, 0.9)",
        borderColor: "#3f3f46",
        textStyle: { color: "#fff" },
      },
      grid: {
        left: "2%",
        right: "2%",
        bottom: "5%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: timeData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#a1a1aa" },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: { color: "#3f3f46", type: "dashed", opacity: 0.3 },
        },
        axisLabel: { color: "#a1a1aa" },
      },
      series: [
        {
          name: "AQI",
          type: "line",
          smooth: true,
          data: aqiData,
          symbol: "none",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16, 185, 129, 0.5)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.0)" },
            ]),
          },
          lineStyle: {
            color: "#10b981",
            width: 3,
          },
        },
      ],
    };
  }, [airQuality, aqiStandard]);

  const getPollutantValue = (key: string) => {
    if (!airQuality?.hourly) return 0;
    // @ts-ignore - dynamic key access
    return airQuality.hourly[key]?.[0] ?? 0;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
        <Skeleton
          variant="rectangular"
          className="h-[300px] w-full rounded-3xl"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              className="h-40 rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto text-[var(--text-primary)] pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row gap-8"
      >
        <Card
          variant="glass"
          className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden"
        >
          <div className="absolute top-6 left-6">
            <h1 className="text-2xl font-bold">{t("airQuality.title")}</h1>
            <p className="text-[var(--text-tertiary)] mt-1">
              {city.name}, {city.countryCode}
            </p>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 relative z-10">
            <AqiGauge aqi={currentAqi} standard={aqiStandard} />
          </div>
        </Card>

        <Card
          variant="glass"
          className="w-full lg:w-1/3 p-6 flex flex-col justify-center"
        >
          <h3 className="text-lg font-semibold mb-6">
            {t("airQuality.aqiScale")} ({aqiStandard.toUpperCase()})
          </h3>
          <div className="space-y-3">
            {aqiLevels.map((level: any) => (
              <div key={level.label} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: level.color }}
                />
                <div className="flex-1 flex justify-between items-center text-sm">
                  <span className="font-medium">{level.label}</span>
                  <span className="text-[var(--text-muted)]">
                    {level.min} - {level.max === Infinity ? "+" : level.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] pl-1">
          {t("airQuality.currentPollutants")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POLLUTANTS.map((pollutant) => {
            const value = getPollutantValue(pollutant.key);
            return (
              <Card key={pollutant.key} variant="glass" className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {t(pollutant.nameKey)}
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {pollutant.descriptionKey}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-[var(--component-bg)] hover:bg-[var(--component-bg-hover)] text-[var(--text-secondary)] border-0"
                  >
                    {pollutant.unit}
                  </Badge>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{value}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] pl-1">
          {t("airQuality.hourForecast")}
        </h2>
        <Card variant="glass" className="p-6 h-[400px]">
          {airQuality?.hourly && (
            <ReactECharts
              option={trendOption}
              style={{ height: "100%", width: "100%" }}
              theme={
                resolvedTheme === "dark"
                  ? "stormscope-dark"
                  : "stormscope-light"
              }
            />
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
