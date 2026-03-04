export function getTemperatureColor(temp: number): string {
  if (temp <= -20) return "#6366f1";
  if (temp <= -10) return "#818cf8";
  if (temp <= 0) return "#93c5fd";
  if (temp <= 10) return "#67e8f9";
  if (temp <= 20) return "#86efac";
  if (temp <= 30) return "#fde047";
  if (temp <= 35) return "#fb923c";
  if (temp <= 40) return "#ef4444";
  return "#991b1b";
}

export function getTemperatureGradient(temps: number[]): string[] {
  return temps.map(getTemperatureColor);
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  if (aqi <= 300) return "#a855f7";
  return "#991b1b";
}

export function getPrecipitationColor(probability: number): string {
  if (probability <= 20) return "#93c5fd";
  if (probability <= 40) return "#60a5fa";
  if (probability <= 60) return "#3b82f6";
  if (probability <= 80) return "#2563eb";
  return "#1d4ed8";
}

export function getUvColor(index: number): string {
  if (index <= 2) return "#22c55e";
  if (index <= 5) return "#eab308";
  if (index <= 7) return "#f97316";
  if (index <= 10) return "#ef4444";
  return "#a855f7";
}

export function getSkyGradient(
  weatherCode: number,
  isDay: boolean,
): [string, string] {
  if (!isDay) return ["#0f172a", "#1e293b"];

  if (weatherCode === 0 || weatherCode === 1) return ["#38bdf8", "#0ea5e9"];
  if (weatherCode === 2) return ["#7dd3fc", "#38bdf8"];
  if (weatherCode === 3) return ["#94a3b8", "#64748b"];
  if (weatherCode === 45 || weatherCode === 48) return ["#cbd5e1", "#94a3b8"];
  if (weatherCode >= 51 && weatherCode <= 67) return ["#64748b", "#475569"];
  if (weatherCode >= 71 && weatherCode <= 86) return ["#e2e8f0", "#cbd5e1"];
  if (weatherCode >= 95) return ["#374151", "#1f2937"];

  return ["#38bdf8", "#0ea5e9"];
}
