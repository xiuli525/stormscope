import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { echarts } from "@/themes/register";
import { useThemeStore } from "@/stores/theme";
import type { HourlyForecast } from "@/types/weather";
import { formatHour } from "@/utils/date";
import { getPrecipitationColor } from "@/utils/gradients";

interface PrecipBarProps {
  hourly: HourlyForecast;
}

export default function PrecipBar({ hourly }: PrecipBarProps) {
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const option = useMemo(() => {
    const times = hourly.time.slice(0, 24).map(formatHour);
    const probs = hourly.precipitationProbability.slice(0, 24);

    const data = probs.map((prob) => ({
      value: prob,
      itemStyle: {
        color: getPrecipitationColor(prob),
      },
    }));

    return {
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c}%",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: times,
      },
      yAxis: {
        type: "value",
        max: 100,
        axisLabel: {
          formatter: "{value}%",
        },
      },
      series: [
        {
          name: "Precipitation",
          type: "bar",
          data: data,
          barWidth: "60%",
        },
      ],
    };
  }, [hourly, resolvedTheme]);

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      theme={themeName}
      style={{ height: "250px", width: "100%" }}
    />
  );
}
