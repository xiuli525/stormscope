import type { FavoriteCity } from "@/types/geocoding";
import { useTranslation } from "react-i18next";

interface GlobeInfoPanelProps {
  city: FavoriteCity | null;
  temperature: number | null;
  weatherCode: number | null;
  screenX: number;
  screenY: number;
}

const wmoToEmoji: Record<number, string> = {
  0: "☀️",
  1: "🌤",
  2: "⛅",
  3: "☁️",
  45: "🌫",
  48: "🌫",
  51: "🌦",
  53: "🌦",
  55: "🌧",
  61: "🌧",
  63: "🌧",
  65: "🌧",
  71: "🌨",
  73: "🌨",
  75: "❄️",
  77: "❄️",
  80: "🌦",
  81: "🌧",
  82: "⛈",
  85: "🌨",
  86: "❄️",
  95: "⛈",
  96: "⛈",
  99: "⛈",
};

export function GlobeInfoPanel({
  city,
  temperature,
  weatherCode,
  screenX,
  screenY,
}: GlobeInfoPanelProps) {
  const { t } = useTranslation();

  if (!city) return null;

  const emoji = weatherCode !== null ? (wmoToEmoji[weatherCode] ?? "🌡") : "🌡";

  return (
    <div
      className="pointer-events-none absolute z-20 px-4 py-3 rounded-xl backdrop-blur-md border"
      style={{
        left: screenX + 16,
        top: screenY - 20,
        background: "var(--overlay-bg)",
        borderColor: "var(--glass-border-default)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{emoji}</span>
        <span className="font-semibold text-[var(--text-primary)] text-sm">
          {city.name}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          {city.countryCode}
        </span>
      </div>
      {temperature !== null && (
        <div className="text-xl font-bold text-[var(--text-primary)]">
          {Math.round(temperature)}°C
        </div>
      )}
      <div className="text-xs text-[var(--text-secondary)] mt-1">
        {t("globe.clickToView")}
      </div>
    </div>
  );
}
