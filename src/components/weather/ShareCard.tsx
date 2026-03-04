import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import html2canvas from "html2canvas";
import type { CurrentWeather, DailyForecast } from "@/types/weather";
import { getWmoDescription } from "@/utils/wmo-codes";
import { getTemperatureColor } from "@/utils/gradients";

type CardTemplate = "minimal" | "gradient" | "pixel";

interface ShareCardProps {
  current: CurrentWeather;
  daily: DailyForecast;
  cityName: string;
  onClose: () => void;
}

interface TemplateOption {
  id: CardTemplate;
  label: string;
  labelEn: string;
}

const TEMPLATES: TemplateOption[] = [
  { id: "minimal", label: "极简白", labelEn: "Minimal" },
  { id: "gradient", label: "渐变卡", labelEn: "Gradient" },
  { id: "pixel", label: "像素风", labelEn: "Pixel Art" },
];

function getGradientForWeather(code: number, isDay: boolean): string {
  if (code === 0 || code === 1) {
    return isDay
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #0c1445 0%, #1a1a2e 100%)";
  }
  if (code === 2 || code === 3)
    return "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)";
  if (code >= 51 && code <= 67)
    return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
  if (code >= 71 && code <= 86)
    return "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)";
  if (code >= 95) return "linear-gradient(135deg, #434343 0%, #000000 100%)";
  return "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)";
}

function getPixelBg(code: number): string {
  if (code === 0 || code === 1) return "#4FC3F7";
  if (code === 2 || code === 3) return "#90A4AE";
  if (code >= 51 && code <= 67) return "#5C6BC0";
  if (code >= 71 && code <= 86) return "#CFD8DC";
  if (code >= 95) return "#37474F";
  return "#81D4FA";
}

function MinimalTemplate({
  current,
  daily,
  cityName,
  t,
}: {
  current: CurrentWeather;
  daily: DailyForecast;
  cityName: string;
  t: TFunction;
}) {
  const dateStr = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div
      className="w-[360px] p-8 flex flex-col gap-6"
      style={{
        background: "#ffffff",
        color: "#1a1a1a",
        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{cityName}</h2>
          <p className="text-sm text-gray-400 mt-1">{dateStr}</p>
        </div>
        <div className="text-right">
          <span className="text-5xl font-extralight">
            {Math.round(current.temperature)}°
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {getWmoDescription(current.weatherCode, t)}
        </span>
        <span className="text-xs text-gray-400">|</span>
        <span className="text-sm text-gray-500">
          {t("currentWeather.feelsLike", "体感")}{" "}
          {Math.round(current.apparentTemperature)}°
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 py-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {t("currentWeather.humidity", "湿度")}
          </p>
          <p className="text-sm font-semibold mt-1">{current.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {t("currentWeather.wind", "风力")}
          </p>
          <p className="text-sm font-semibold mt-1">
            {Math.round(current.windSpeed)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {t("currentWeather.pressure", "气压")}
          </p>
          <p className="text-sm font-semibold mt-1">
            {Math.round(current.pressure)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {t("currentWeather.uvIndex", "UV")}
          </p>
          <p className="text-sm font-semibold mt-1">{current.uvIndex}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        {daily.time.slice(0, 5).map((date: string, i: number) => (
          <div key={date} className="text-center flex-1">
            <p className="text-[10px] text-gray-400">
              {new Date(date).toLocaleDateString("zh-CN", { weekday: "short" })}
            </p>
            <div
              className="w-1 h-8 mx-auto rounded-full my-1"
              style={{
                background: getTemperatureColor(daily.temperatureMax[i]),
              }}
            />
            <p className="text-[10px] font-medium">
              {Math.round(daily.temperatureMax[i])}°/
              {Math.round(daily.temperatureMin[i])}°
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-[10px] text-gray-300 tracking-widest uppercase">
          StormScope
        </span>
        <span className="text-[10px] text-gray-300">⚡</span>
      </div>
    </div>
  );
}

function GradientTemplate({
  current,
  daily,
  cityName,
  t,
}: {
  current: CurrentWeather;
  daily: DailyForecast;
  cityName: string;
  t: TFunction;
}) {
  const bg = getGradientForWeather(current.weatherCode, current.isDay);
  const isSnowOrLight = current.weatherCode >= 71 && current.weatherCode <= 86;
  const textColor = isSnowOrLight ? "#1a1a1a" : "#ffffff";

  return (
    <div
      className="w-[360px] p-8 flex flex-col gap-5 relative overflow-hidden"
      style={{ background: bg, color: textColor, minHeight: 420 }}
    >
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
        style={{
          background: "white",
          filter: "blur(60px)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div>
        <p className="text-sm opacity-70 font-medium tracking-wider uppercase">
          {new Date().toLocaleDateString("zh-CN", {
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
        <h2 className="text-2xl font-bold mt-1">{cityName}</h2>
      </div>

      <div className="flex items-end gap-3 my-2">
        <span className="text-7xl font-extralight leading-none">
          {Math.round(current.temperature)}°
        </span>
        <div className="pb-2">
          <p className="text-sm opacity-80">
            {getWmoDescription(current.weatherCode, t)}
          </p>
          <p className="text-xs opacity-60">
            {t("currentWeather.feelsLike", "体感")}{" "}
            {Math.round(current.apparentTemperature)}°
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: t("currentWeather.humidity", "湿度"),
            value: `${current.humidity}%`,
          },
          {
            label: t("currentWeather.wind", "风力"),
            value: `${Math.round(current.windSpeed)} km/h`,
          },
          {
            label: t("currentWeather.visibility", "能见度"),
            value: `${(current.visibility / 1000).toFixed(1)} km`,
          },
          {
            label: t("currentWeather.uvIndex", "紫外线"),
            value: `${current.uvIndex}`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-[10px] opacity-60 uppercase">{item.label}</p>
            <p className="text-sm font-semibold mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      <div
        className="flex justify-between mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
      >
        {daily.time.slice(0, 5).map((date: string, i: number) => (
          <div key={date} className="text-center">
            <p className="text-[10px] opacity-50">
              {new Date(date).toLocaleDateString("zh-CN", { weekday: "short" })}
            </p>
            <p className="text-xs font-medium mt-1">
              {Math.round(daily.temperatureMax[i])}°
            </p>
            <p className="text-[10px] opacity-50">
              {Math.round(daily.temperatureMin[i])}°
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-1">
        <span className="text-[10px] opacity-30 tracking-widest uppercase">
          StormScope
        </span>
        <span className="text-[10px] opacity-30">⚡</span>
      </div>
    </div>
  );
}

function PixelTemplate({
  current,
  daily,
  cityName,
  t,
}: {
  current: CurrentWeather;
  daily: DailyForecast;
  cityName: string;
  t: TFunction;
}) {
  const bg = getPixelBg(current.weatherCode);

  return (
    <div
      className="w-[360px] p-6 flex flex-col gap-4"
      style={{
        background: bg,
        color: "#ffffff",
        fontFamily: "'Courier New', 'Noto Sans SC', monospace",
        imageRendering: "pixelated",
      }}
    >
      <div className="border-2 border-white border-dashed p-4 rounded">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{`> ${cityName}`}</h2>
            <p className="text-xs opacity-60 mt-1">
              {new Date().toLocaleDateString("en", { dateStyle: "medium" })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold">
              {Math.round(current.temperature)}°C
            </span>
          </div>
        </div>

        <div
          className="mt-3 p-2 rounded"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <p className="text-xs">
            STATUS: {getWmoDescription(current.weatherCode, t)}
          </p>
          <p className="text-xs mt-1">
            FEELS: {Math.round(current.apparentTemperature)}°C | HUM:{" "}
            {current.humidity}%
          </p>
          <p className="text-xs mt-1">
            WIND: {Math.round(current.windSpeed)}km/h | UV: {current.uvIndex}
          </p>
        </div>
      </div>

      <div className="border-2 border-white border-dashed p-3 rounded">
        <p className="text-[10px] opacity-60 mb-2">{"// FORECAST"}</p>
        <div className="grid grid-cols-5 gap-1 text-center">
          {daily.time.slice(0, 5).map((date: string, i: number) => (
            <div
              key={date}
              className="p-1 rounded"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <p className="text-[9px] opacity-60">
                {new Date(date)
                  .toLocaleDateString("en", { weekday: "short" })
                  .toUpperCase()}
              </p>
              <p className="text-xs font-bold mt-1">
                {Math.round(daily.temperatureMax[i])}°
              </p>
              <p className="text-[9px] opacity-60">
                {Math.round(daily.temperatureMin[i])}°
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] opacity-30">{"[STORMSCOPE v1.0]"}</span>
        <span className="text-[10px] opacity-30">{"</>⚡"}</span>
      </div>
    </div>
  );
}

export function ShareCard({
  current,
  daily,
  cityName,
  onClose,
}: ShareCardProps) {
  const { t, i18n } = useTranslation();
  const [template, setTemplate] = useState<CardTemplate>("gradient");
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isZh = i18n.language === "zh";

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `stormscope-${cityName}-${template}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate share card:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [cityName, template]);

  const templateProps = { current, daily, cityName, t };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="flex flex-col items-center gap-5 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center gap-2 bg-[var(--surface-primary)] rounded-full p-1 border border-[var(--glass-border-default)]">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  template === tmpl.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isZh ? tmpl.label : tmpl.labelEn}
              </button>
            ))}
          </div>

          <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl">
            {template === "minimal" && <MinimalTemplate {...templateProps} />}
            {template === "gradient" && <GradientTemplate {...templateProps} />}
            {template === "pixel" && <PixelTemplate {...templateProps} />}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm transition-all shadow-lg disabled:opacity-50"
            >
              {isGenerating
                ? isZh
                  ? "生成中..."
                  : "Generating..."
                : isZh
                  ? "📥 下载图片"
                  : "📥 Download"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-full font-medium text-sm transition-all border border-[var(--glass-border-default)] hover:bg-[var(--surface-hover)]"
            >
              {isZh ? "关闭" : "Close"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
