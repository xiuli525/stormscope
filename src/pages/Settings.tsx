import {
  RotateCcw,
  Settings as SettingsIcon,
  Palette,
  Gauge,
  Wind,
} from "lucide-react";
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
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Settings
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            Units
          </h2>
          <div className="space-y-6">
            <Select
              label="Temperature Unit"
              value={temperatureUnit}
              onChange={(val: string) =>
                updateSetting("temperatureUnit", val as TemperatureUnit)
              }
              options={[
                { value: "celsius", label: "Celsius (°C)" },
                { value: "fahrenheit", label: "Fahrenheit (°F)" },
              ]}
            />
            <Select
              label="Wind Speed Unit"
              value={windSpeedUnit}
              onChange={(val: string) =>
                updateSetting("windSpeedUnit", val as WindSpeedUnit)
              }
              options={[
                { value: "kmh", label: "Kilometers per hour (km/h)" },
                { value: "ms", label: "Meters per second (m/s)" },
                { value: "mph", label: "Miles per hour (mph)" },
                { value: "knots", label: "Knots (kn)" },
              ]}
            />
            <Select
              label="Precipitation Unit"
              value={precipitationUnit}
              onChange={(val: string) =>
                updateSetting("precipitationUnit", val as PrecipitationUnit)
              }
              options={[
                { value: "mm", label: "Millimeters (mm)" },
                { value: "inch", label: "Inches (in)" },
              ]}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Appearance
            </h2>
            <Select
              label="Theme"
              value={theme}
              onChange={(val: string) =>
                setTheme(val as "light" | "dark" | "system")
              }
              options={[
                { value: "system", label: "System Default" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </Card>

          <Card className="p-6 border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              Air Quality
            </h2>
            <Select
              label="AQI Standard"
              value={aqiStandard}
              onChange={(val: string) =>
                updateSetting("aqiStandard", val as AqiStandard)
              }
              options={[
                { value: "us", label: "US EPA" },
                { value: "european", label: "European AQI" },
              ]}
            />
          </Card>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex justify-end">
        <Button
          variant="danger"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Settings
        </Button>
      </div>
    </div>
  );
}
