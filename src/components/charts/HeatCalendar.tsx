import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { echarts } from "@/themes/register";
import { useThemeStore } from "@/stores/theme";
import type { HistoricalDailyData } from "@/services/historical";

interface HeatCalendarProps {
  data: HistoricalDailyData;
  year: string;
}

export default function HeatCalendar({ data, year }: HeatCalendarProps) {
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const option = useMemo(() => {
    const calendarData: [string, number][] = data.time.map((date, i) => [
      date,
      data.temperatureMax[i],
    ]);

    const allTemps = data.temperatureMax.filter((t) => t != null);
    const minTemp = Math.min(...allTemps);
    const maxTemp = Math.max(...allTemps);

    return {
      tooltip: {
        position: "top",
        formatter: (params: { value: [string, number] }) => {
          const [date, temp] = params.value;
          return `${date}: ${Math.round(temp)}°C`;
        },
      },
      visualMap: {
        min: minTemp,
        max: maxTemp,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: 20,
        inRange: {
          color: [
            "#6366f1",
            "#93c5fd",
            "#86efac",
            "#fde047",
            "#fb923c",
            "#ef4444",
          ],
        },
      },
      calendar: {
        top: 60,
        left: 40,
        right: 40,
        cellSize: ["auto", 16],
        range: year,
        itemStyle: {
          borderWidth: 2,
          borderColor: resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9",
        },
        yearLabel: { show: true },
        dayLabel: { firstDay: 1, nameMap: "en" },
        monthLabel: { nameMap: "en" },
      },
      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: calendarData,
        },
      ],
    };
  }, [data, year, resolvedTheme]);

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      theme={themeName}
      style={{ height: "220px", width: "100%" }}
    />
  );
}
