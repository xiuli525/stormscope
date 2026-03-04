const darkTheme = {
  color: [
    "#60a5fa",
    "#4ade80",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#22d3ee",
    "#f472b6",
    "#2dd4bf",
  ],
  backgroundColor: "transparent",
  textStyle: {
    color: "#e2e8f0",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  title: {
    textStyle: { color: "#f1f5f9", fontSize: 16, fontWeight: 600 },
    subtextStyle: { color: "#94a3b8", fontSize: 13 },
  },
  line: {
    itemStyle: { borderWidth: 2 },
    lineStyle: { width: 2 },
    symbolSize: 6,
    smooth: true,
  },
  bar: {
    itemStyle: { borderRadius: [4, 4, 0, 0] },
  },
  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.3, "#4ade80"],
          [0.6, "#fbbf24"],
          [1, "#f87171"],
        ],
      },
    },
    axisTick: { lineStyle: { color: "#475569" } },
    axisLabel: { color: "#94a3b8" },
    pointer: { itemStyle: { color: "#60a5fa" } },
    title: { color: "#e2e8f0" },
    detail: { color: "#f1f5f9", fontSize: 24, fontWeight: 700 },
  },
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderColor: "#334155",
    borderWidth: 1,
    textStyle: { color: "#e2e8f0", fontSize: 13 },
    extraCssText:
      "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);",
  },
  legend: {
    textStyle: { color: "#94a3b8" },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "#334155" } },
    axisTick: { lineStyle: { color: "#334155" } },
    axisLabel: { color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#1e293b" } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: "#334155" } },
    axisTick: { lineStyle: { color: "#334155" } },
    axisLabel: { color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#1e293b" } },
  },
};

export default darkTheme;
