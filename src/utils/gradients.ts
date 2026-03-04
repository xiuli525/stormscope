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
  isLight = false,
): [string, string] {
  // Light mode: soft, muted sky gradients
  if (isLight) {
    if (!isDay) return ["#1e293b", "#334155"];

    if (weatherCode === 0 || weatherCode === 1) return ["#bfdbfe", "#dbeafe"]; // clear → soft blue
    if (weatherCode === 2) return ["#c7d2fe", "#e0e7ff"]; // partly cloudy → lavender blue
    if (weatherCode === 3) return ["#cbd5e1", "#e2e8f0"]; // overcast → slate
    if (weatherCode === 45 || weatherCode === 48) return ["#d1d5db", "#e5e7eb"]; // fog → gray
    if (weatherCode >= 51 && weatherCode <= 67) return ["#bfdbfe", "#cbd5e1"]; // rain → blue-gray
    if (weatherCode >= 71 && weatherCode <= 86) return ["#e2e8f0", "#f1f5f9"]; // snow → light slate
    if (weatherCode >= 95) return ["#94a3b8", "#cbd5e1"]; // storm → darker slate

    return ["#bfdbfe", "#dbeafe"];
  }

  // Dark mode: original deep gradients
  if (!isDay) return ["#080C18", "#0F1629"];

  if (weatherCode === 0 || weatherCode === 1) return ["#1e40af", "#3b82f6"];
  if (weatherCode === 2) return ["#1e3a8a", "#2563eb"];
  if (weatherCode === 3) return ["#1e293b", "#334155"];
  if (weatherCode === 45 || weatherCode === 48) return ["#1e293b", "#475569"];
  if (weatherCode >= 51 && weatherCode <= 67) return ["#0f172a", "#1e3a5f"];
  if (weatherCode >= 71 && weatherCode <= 86) return ["#1e293b", "#334155"];
  if (weatherCode >= 95) return ["#0f172a", "#1e293b"];

  return ["#1e40af", "#3b82f6"];
}
