import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/stores/theme";
import type { WeatherData } from "@/types/weather";
import {
  detectAlerts,
  ALERT_COLORS,
  ALERT_COLORS_LIGHT,
  type WeatherAlert,
  type AlertLevel,
} from "@/utils/weather-alerts";

interface WeatherAlertsProps {
  weather: WeatherData;
}

function AlertBadge({ level }: { level: AlertLevel }) {
  const { resolvedTheme } = useThemeStore();
  const isLight = resolvedTheme === "light";
  const colors = isLight ? ALERT_COLORS_LIGHT[level] : ALERT_COLORS[level];

  const labels: Record<AlertLevel, { zh: string; en: string }> = {
    red: { zh: "红色", en: "Red" },
    orange: { zh: "橙色", en: "Orange" },
    yellow: { zh: "黄色", en: "Yellow" },
  };

  const { i18n } = useTranslation();
  const label = i18n.language === "zh" ? labels[level].zh : labels[level].en;

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {label}
    </span>
  );
}

function AlertCard({
  alert,
  isExpanded,
  onToggle,
}: {
  alert: WeatherAlert;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { resolvedTheme } = useThemeStore();
  const { i18n } = useTranslation();
  const isLight = resolvedTheme === "light";
  const colors = isLight
    ? ALERT_COLORS_LIGHT[alert.level]
    : ALERT_COLORS[alert.level];
  const isZh = i18n.language === "zh";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-2xl cursor-pointer overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-2xl flex-shrink-0">{alert.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-sm"
              style={{ color: colors.text }}
            >
              {isZh ? alert.title : alert.titleEn}
            </span>
            <AlertBadge level={alert.level} />
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: colors.text }}
          >
            {typeof alert.value === "number" && alert.value % 1 !== 0
              ? alert.value.toFixed(1)
              : alert.value}
          </span>
          <span className="text-xs opacity-70" style={{ color: colors.text }}>
            {alert.unit}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-4 h-4 flex-shrink-0"
          style={{ color: colors.text }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-3 text-sm leading-relaxed"
              style={{
                color: isLight
                  ? "var(--text-secondary)"
                  : "rgba(255,255,255,0.7)",
              }}
            >
              {isZh ? alert.description : alert.descriptionEn}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WeatherAlerts({ weather }: WeatherAlertsProps) {
  const alerts = useMemo(() => detectAlerts(weather), [weather]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 pl-1">
        <span className="text-base">⚠️</span>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {t("alerts.title", "天气预警")}
        </h3>
        <span className="text-xs text-[var(--text-tertiary)] bg-[var(--surface-primary)] px-2 py-0.5 rounded-full">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.type}
              alert={alert}
              isExpanded={expandedIndex === index}
              onToggle={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
