import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
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
import { cn } from "@/utils/cn";
import {
  formatTemperature,
  formatWindSpeed,
  formatPrecipitation,
} from "@/utils/units";

import { echarts } from "@/themes/register";

const DEFAULT_CITY = {
  id: "beijing",
  name: "Beijing",
  country: "China",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

export default function Historical() {
  const { currentCity } = useFavoritesStore();
  const { temperatureUnit, windSpeedUnit, precipitationUnit } =
    useSettingsStore();

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
        backgroundColor: "rgba(24, 24, 27, 0.9)",
        borderColor: "#3f3f46",
        textStyle: { color: "#fafafa" },
      },
      legend: {
        data: ["Max Temp", "Min Temp"],
        textStyle: { color: "#a1a1aa" },
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
        axisLine: { lineStyle: { color: "#3f3f46" } },
        axisLabel: { color: "#a1a1aa" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "#3f3f46" } },
        axisLabel: { color: "#a1a1aa" },
      },
      series: [
        {
          name: "Max Temp",
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
          name: "Min Temp",
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
  }, [historical]);

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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-400" />
            Historical Data
          </h1>
          <p className="text-zinc-400 mt-1">
            Weather archive for{" "}
            <span className="text-blue-300 font-medium">{city.name}</span>,{" "}
            {city.country}
          </p>
        </div>

        <div className="w-full md:w-48">
          <Select
            value={selectedYear}
            onChange={(val: string) => setSelectedYear(val)}
            options={yearOptions}
            label="Year"
          />
        </div>
      </div>

      {isLoading || !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-xl bg-zinc-800/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Avg Max Temp"
            value={formatTemperature(stats.avgMax, temperatureUnit)}
            icon={<Thermometer className="w-5 h-5 text-red-400" />}
            color="bg-red-500/10 border-red-500/20"
          />
          <StatCard
            title="Avg Min Temp"
            value={formatTemperature(stats.avgMin, temperatureUnit)}
            icon={<Thermometer className="w-5 h-5 text-blue-400" />}
            color="bg-blue-500/10 border-blue-500/20"
          />
          <StatCard
            title="Total Rainfall"
            value={formatPrecipitation(stats.totalPrecip, precipitationUnit)}
            icon={<CloudRain className="w-5 h-5 text-cyan-400" />}
            color="bg-cyan-500/10 border-cyan-500/20"
          />
          <StatCard
            title="Max Wind Speed"
            value={formatWindSpeed(stats.maxWind, windSpeedUnit)}
            icon={<Wind className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-500/10 border-emerald-500/20"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 min-h-[400px] flex flex-col bg-zinc-900/40 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">
              Temperature Trend
            </h2>
          </div>
          {isLoading ? (
            <Skeleton className="w-full h-full flex-1 rounded-lg bg-zinc-800/50" />
          ) : (
            <div className="flex-1 w-full min-h-[300px]">
              <ReactECharts
                option={chartOption}
                style={{ height: "100%", width: "100%" }}
                theme="dark"
              />
            </div>
          )}
        </Card>

        <Card className="lg:col-span-1 p-6 bg-zinc-900/40 backdrop-blur-xl border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Heat Calendar</h2>
          </div>
          {isLoading || !historical ? (
            <Skeleton className="w-full h-[300px] rounded-lg bg-zinc-800/50" />
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
          "p-5 flex flex-col justify-between h-full border backdrop-blur-md bg-zinc-900/40",
          color,
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-zinc-400 text-sm font-medium">{title}</span>
          <div className="p-2 rounded-full bg-white/5">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {value}
        </div>
      </Card>
    </motion.div>
  );
}
