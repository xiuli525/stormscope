const lightTheme = {
  color: [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
  ],
  backgroundColor: "transparent",
  textStyle: {
    color: "#1e293b",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  title: {
    textStyle: { color: "#0f172a", fontSize: 16, fontWeight: 600 },
    subtextStyle: { color: "#64748b", fontSize: 13 },
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
          [0.3, "#22c55e"],
          [0.6, "#f59e0b"],
          [1, "#ef4444"],
        ],
      },
    },
    axisTick: { lineStyle: { color: "#94a3b8" } },
    axisLabel: { color: "#64748b" },
    pointer: { itemStyle: { color: "#3b82f6" } },
    title: { color: "#1e293b" },
    detail: { color: "#0f172a", fontSize: 24, fontWeight: 700 },
  },
  tooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    textStyle: { color: "#1e293b", fontSize: 13 },
    extraCssText:
      "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);",
  },
  legend: {
    textStyle: { color: "#64748b" },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "#e2e8f0" } },
    axisTick: { lineStyle: { color: "#e2e8f0" } },
    axisLabel: { color: "#64748b" },
    splitLine: { lineStyle: { color: "#f1f5f9" } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: "#e2e8f0" } },
    axisTick: { lineStyle: { color: "#e2e8f0" } },
    axisLabel: { color: "#64748b" },
    splitLine: { lineStyle: { color: "#f1f5f9" } },
  },
};

export default lightTheme;
