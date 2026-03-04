import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  CloudRain,
  Thermometer,
  Wind,
  TrendingUp,
} from "lucide-react";

import { Card, Select, Skeleton } from "@/components/ui";
import { HeatCalendar } from "@/components/charts";
import { useHistorical } from "@/hooks/useHistorical";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useThemeStore } from "@/stores/theme";
import { cn } from "@/utils/cn";
import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
} from "@/utils/units";

import { echarts } from "@/themes/register";

const DEFAULT_CITY = {
  id: "beijing",
  name: "北京",
  country: "中国",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

export default function Historical() {
  const { t } = useTranslation();
  const { currentCity } = useFavoritesStore();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useSettingsStore();
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const city = currentCity ?? DEFAULT_CITY;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    String(currentYear - 1),
  );

  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  const { data: historical, isLoading } = useHistorical(
    city.latitude,
    city.longitude,
    startDate,
    endDate,
  );

  const stats = useMemo(() => {
    if (!historical) return null;

    const avgMax =
      historical.temperatureMax.length > 0
        ? historical.temperatureMax.reduce((a: number, b: number) => a + b, 0) /
          historical.temperatureMax.length
        : 0;
    const avgMin =
      historical.temperatureMin.length > 0
        ? historical.temperatureMin.reduce((a: number, b: number) => a + b, 0) /
          historical.temperatureMin.length
        : 0;
    const totalPrecip = historical.precipitationSum.reduce(
      (a: number, b: number) => a + b,
      0,
    );
    const maxWind =
      historical.windSpeedMax.length > 0
        ? Math.max(...historical.windSpeedMax)
        : 0;

    return {
      avgMax,
      avgMin,
      totalPrecip,
      maxWind,
    };
  }, [historical]);

  const chartOption = useMemo(() => {
    if (!historical) return {};

    return {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: [t("historical.maxTemp"), t("historical.minTemp")],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: historical.time,
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
      },
      series: [
        {
          name: t("historical.maxTemp"),
          type: "line",
          smooth: true,
          showSymbol: false,
          itemStyle: { color: "#f87171" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(248, 113, 113, 0.3)" },
              { offset: 1, color: "rgba(248, 113, 113, 0)" },
            ]),
          },
          data: historical.temperatureMax,
        },
        {
          name: t("historical.minTemp"),
          type: "line",
          smooth: true,
          showSymbol: false,
          itemStyle: { color: "#60a5fa" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(96, 165, 250, 0.3)" },
              { offset: 1, color: "rgba(96, 165, 250, 0)" },
            ]),
          },
          data: historical.temperatureMin,
        },
      ],
    };
  }, [historical, t]);

  const yearOptions = [
    { value: String(currentYear), label: String(currentYear) },
    { value: String(currentYear - 1), label: String(currentYear - 1) },
    { value: String(currentYear - 2), label: String(currentYear - 2) },
    { value: String(currentYear - 3), label: String(currentYear - 3) },
  ];

  return (
    <div className="space-y-6 p-6 pb-20 md:pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-400" />
            {t("historical.title")}
          </h1>
          <p className="text-[var(--text-tertiary)] mt-1">
            {t("historical.weatherArchive")}{" "}
            <span className="text-blue-300 font-medium">{city.name}</span>,{" "}
            {city.country}
          </p>
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedYear}
            onChange={(val: string) => setSelectedYear(val)}
            options={yearOptions}
            label={t("historical.year")}
          />
        </div>
      </div>

      {isLoading || !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-xl bg-[var(--skeleton-bg)]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("historical.avgMaxTemp")}
            value={formatTemperature(stats.avgMax, temperatureUnit)}
            icon={<Thermometer className="w-5 h-5 text-red-400" />}
            color="bg-red-500/10 border-red-500/20"
          />
          <StatCard
            title={t("historical.avgMinTemp")}
            value={formatTemperature(stats.avgMin, temperatureUnit)}
            icon={<Thermometer className="w-5 h-5 text-blue-400" />}
            color="bg-blue-500/10 border-blue-500/20"
          />
          <StatCard
            title={t("historical.totalRainfall")}
            value={formatPrecipitation(stats.totalPrecip, precipitationUnit)}
            icon={<CloudRain className="w-5 h-5 text-cyan-400" />}
            color="bg-cyan-500/10 border-cyan-500/20"
          />
          <StatCard
            title={t("historical.maxWindSpeed")}
            value={formatWindSpeed(stats.maxWind, windSpeedUnit)}
            icon={<Wind className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-500/10 border-emerald-500/20"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 min-h-[400px] flex flex-col bg-[var(--glass-l2-bg)] backdrop-blur-xl border-[var(--glass-border-default)]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {t("historical.temperatureTrend")}
            </h2>
          </div>
          {isLoading ? (
            <Skeleton className="w-full h-full flex-1 rounded-lg bg-[var(--skeleton-bg)]" />
          ) : (
            <div className="flex-1 w-full min-h-[300px]">
              <ReactECharts
                option={chartOption}
                style={{ height: "100%", width: "100%" }}
                theme={themeName}
              />
            </div>
          )}
        </Card>

        <Card className="lg:col-span-1 p-6 bg-[var(--glass-l2-bg)] backdrop-blur-xl border-[var(--glass-border-default)]">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {t("historical.heatCalendar")}
            </h2>
          </div>
          {isLoading || !historical ? (
            <Skeleton className="w-full h-[300px] rounded-lg bg-[var(--skeleton-bg)]" />
          ) : (
            <HeatCalendar data={historical} year={selectedYear} />
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={cn(
          "p-5 flex flex-col justify-between h-full border backdrop-blur-md bg-[var(--glass-l2-bg)]",
          color,
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[var(--text-tertiary)] text-sm font-medium">
            {title}
          </span>
          <div className="p-2 rounded-full bg-[var(--component-bg)]">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          {value}
        </div>
      </Card>
    </motion.div>
  );
}
