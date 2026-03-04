import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { echarts } from "@/themes/register";
import { useThemeStore } from "@/stores/theme";
import type { HourlyForecast, TemperatureUnit } from "@/types/weather";
import { formatHour } from "@/utils/date";
import { convertTemperature } from "@/utils/units";

interface TempChartProps {
  hourly: HourlyForecast;
  unit: TemperatureUnit;
}

export default function TempChart({ hourly, unit }: TempChartProps) {
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const option = useMemo(() => {
    const times = hourly.time.slice(0, 24).map(formatHour);
    const temps = hourly.temperature
      .slice(0, 24)
      .map((t) => convertTemperature(t, unit));

    return {
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c}°",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}°",
        },
      },
      series: [
        {
          name: "Temperature",
          type: "line",
          smooth: true,
          data: temps,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#93c5fd",
              },
              {
                offset: 1,
                color: "rgba(147, 197, 253, 0)",
              },
            ]),
          },
          itemStyle: {
            color: "#93c5fd",
          },
          lineStyle: {
            width: 3,
          },
        },
      ],
    };
  }, [hourly, unit, resolvedTheme]);

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      theme={themeName}
      style={{ height: "300px", width: "100%" }}
    />
  );
}
