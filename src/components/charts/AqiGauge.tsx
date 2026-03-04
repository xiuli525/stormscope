import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { echarts } from "@/themes/register";
import { useThemeStore } from "@/stores/theme";

interface AqiGaugeProps {
  aqi: number;
  standard: "us" | "eu";
}

export default function AqiGauge({ aqi, standard }: AqiGaugeProps) {
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const option = useMemo(() => {
    const max = standard === "us" ? 500 : 100;

    let label = "Good";
    if (aqi > 300) label = "Hazardous";
    else if (aqi > 200) label = "Very Unhealthy";
    else if (aqi > 150) label = "Unhealthy";
    else if (aqi > 100) label = "Unhealthy for Sensitive Groups";
    else if (aqi > 50) label = "Moderate";

    const ranges: [number, string][] = [
      [50 / max, "#22c55e"],
      [100 / max, "#eab308"],
      [150 / max, "#f97316"],
      [200 / max, "#ef4444"],
      [300 / max, "#a855f7"],
      [1, "#991b1b"],
    ];

    return {
      series: [
        {
          type: "gauge",
          min: 0,
          max: max,
          axisLine: {
            lineStyle: {
              width: 30,
              color: ranges,
            },
          },
          pointer: {
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: "#fff",
              width: 2,
            },
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: "#fff",
              width: 4,
            },
          },
          axisLabel: {
            color: "auto",
            distance: 40,
            fontSize: 10,
          },
          detail: {
            valueAnimation: true,
            formatter: `{value}\n${label}`,
            color: "auto",
            fontSize: 14,
            offsetCenter: [0, "70%"],
          },
          data: [
            {
              value: aqi,
            },
          ],
        },
      ],
    };
  }, [aqi, standard, resolvedTheme]);

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      theme={themeName}
      style={{ height: "250px", width: "100%" }}
    />
  );
}
