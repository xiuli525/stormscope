import {
  RotateCcw,
  Settings as SettingsIcon,
  Palette,
  Gauge,
  Wind,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, Select, Button } from "@/components/ui";
import { useSettingsStore } from "@/stores/settings";
import { useThemeStore } from "@/stores/theme";
import type {
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from "@/types/weather";
import type { AqiStandard } from "@/types/air-quality";

export default function Settings() {
  const { t } = useTranslation();
  const {
    temperatureUnit,
    windSpeedUnit,
    precipitationUnit,
    aqiStandard,
    updateSetting,
    resetSettings,
  } = useSettingsStore();
  const { theme, setTheme } = useThemeStore();

  const handleReset = () => {
    resetSettings();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 pb-20 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {t("settings.title")}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 border-[var(--glass-border-default)] bg-[var(--glass-l2-bg)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            {t("settings.units")}
          </h2>
          <div className="space-y-6">
            <Select
              label={t("settings.temperatureUnit")}
              value={temperatureUnit}
              onChange={(val: string) =>
                updateSetting("temperatureUnit", val as TemperatureUnit)
              }
              options={[
                { value: "celsius", label: t("settings.celsius") },
                { value: "fahrenheit", label: t("settings.fahrenheit") },
              ]}
            />
            <Select
              label={t("settings.windSpeedUnit")}
              value={windSpeedUnit}
              onChange={(val: string) =>
                updateSetting("windSpeedUnit", val as WindSpeedUnit)
              }
              options={[
                { value: "kmh", label: t("settings.kmh") },
                { value: "ms", label: t("settings.ms") },
                { value: "mph", label: t("settings.mph") },
                { value: "knots", label: t("settings.knots") },
              ]}
            />
            <Select
              label={t("settings.precipitationUnit")}
              value={precipitationUnit}
              onChange={(val: string) =>
                updateSetting("precipitationUnit", val as PrecipitationUnit)
              }
              options={[
                { value: "mm", label: t("settings.millimeters") },
                { value: "inch", label: t("settings.inches") },
              ]}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-[var(--glass-border-default)] bg-[var(--glass-l2-bg)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              {t("settings.appearance")}
            </h2>
            <Select
              label={t("settings.theme")}
              value={theme}
              onChange={(val: string) =>
                setTheme(val as "light" | "dark" | "system")
              }
              options={[
                { value: "system", label: t("settings.systemDefault") },
                { value: "light", label: t("settings.light") },
                { value: "dark", label: t("settings.dark") },
              ]}
            />
          </Card>

          <Card className="p-6 border-[var(--glass-border-default)] bg-[var(--glass-l2-bg)] backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              {t("settings.airQuality")}
            </h2>
            <Select
              label={t("settings.aqiStandard")}
              value={aqiStandard}
              onChange={(val: string) =>
                updateSetting("aqiStandard", val as AqiStandard)
              }
              options={[
                { value: "us", label: t("settings.usEpa") },
                { value: "european", label: t("settings.europeanAqi") },
              ]}
            />
          </Card>
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--glass-border-default)] flex justify-end">
        <Button
          variant="danger"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t("settings.resetAll")}
        </Button>
      </div>
    </div>
  );
}
