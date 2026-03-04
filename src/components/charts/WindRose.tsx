import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { echarts } from "@/themes/register";
import { useThemeStore } from "@/stores/theme";

interface WindRoseProps {
  directions: number[];
  speeds: number[];
}

export default function WindRose({ directions, speeds }: WindRoseProps) {
  const { resolvedTheme } = useThemeStore();
  const themeName =
    resolvedTheme === "dark" ? "stormscope-dark" : "stormscope-light";

  const option = useMemo(() => {
    const bins = new Array(16).fill(0).map(() => ({ count: 0, totalSpeed: 0 }));

    directions.forEach((dir, i) => {
      const normalizedDir = ((dir % 360) + 360) % 360;
      const binIndex = Math.round(normalizedDir / 22.5) % 16;
      bins[binIndex].count++;
      bins[binIndex].totalSpeed += speeds[i];
    });

    const categories = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];

    const data = bins.map((b) => {
      const avgSpeed = b.count > 0 ? b.totalSpeed / b.count : 0;
      let color = "#3b82f6";
      if (avgSpeed > 10) color = "#ef4444";
      else if (avgSpeed > 5) color = "#eab308";
      else if (avgSpeed > 2) color = "#22c55e";

      return {
        value: b.count,
        itemStyle: {
          color: color,
        },
      };
    });

    return {
      polar: {
        radius: [30, "80%"],
      },
      angleAxis: {
        type: "category",
        data: categories,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: "#999",
            type: "dashed",
          },
        },
        axisLine: {
          show: false,
        },
      },
      radiusAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          type: "bar",
          data: data,
          coordinateSystem: "polar",
          name: "Wind Frequency",
          stack: "a",
          emphasis: {
            focus: "series",
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} hours",
      },
    };
  }, [directions, speeds, resolvedTheme]);

  return (
    <ReactECharts
      echarts={echarts}
      option={option}
      theme={themeName}
      style={{ height: "300px", width: "100%" }}
    />
  );
}
