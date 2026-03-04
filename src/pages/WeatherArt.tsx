import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Download, RefreshCw, Palette, Maximize } from "lucide-react";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useWeather } from "@/hooks/useWeather";
import { useFavoritesStore } from "@/stores/favorites";
import { getWmoDescription } from "@/utils/wmo-codes";

const DEFAULT_CITY = {
  id: "beijing",
  name: "北京",
  latitude: 39.9042,
  longitude: 116.4074,
};

function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  function dot2(g: number[], x: number, y: number) {
    return g[0] * x + g[1] * y;
  }

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  return function noise2D(xin: number, yin: number): number {
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1: number, j1: number;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = perm[ii + perm[jj]] % 12;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;

    let n0 = 0,
      n1 = 0,
      n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * dot2(grad3[gi0], x0, y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * dot2(grad3[gi1], x1, y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * dot2(grad3[gi2], x2, y2);
    }

    return 70 * (n0 + n1 + n2);
  };
}

interface WeatherArtParams {
  temperature: number;
  windSpeed: number;
  cloudCover: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
}

type ArtStyle = "flowField" | "constellation" | "aurora";

function getColorPalette(params: WeatherArtParams, style: ArtStyle): string[] {
  const { temperature, weatherCode, isDay, precipitation } = params;

  if (style === "aurora") {
    if (precipitation > 0)
      return ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"];
    if (temperature < 0)
      return ["#0a0a23", "#1b1b4b", "#3d3dff", "#00ffaa", "#ffffff"];
    return ["#0d0d2b", "#1a1a4e", "#4a00e0", "#00d4ff", "#7cffcb"];
  }

  if (style === "constellation") {
    if (!isDay) return ["#0a0a1a", "#111133", "#1a1a4e", "#ffffff", "#ffd700"];
    return ["#1a1a2e", "#16213e", "#0f3460", "#e0e0ff", "#ffeaa7"];
  }

  if (weatherCode >= 95)
    return ["#1a0a2e", "#2d1b69", "#6930c3", "#f72585", "#ff9e00"];
  if (weatherCode >= 61)
    return ["#0d1b2a", "#1b263b", "#415a77", "#778da9", "#e0e1dd"];
  if (weatherCode >= 71)
    return ["#caf0f8", "#ade8f4", "#90e0ef", "#48cae4", "#023e8a"];
  if (weatherCode >= 45)
    return ["#2b2d42", "#3d405b", "#6b717e", "#8d99ae", "#edf2f4"];
  if (temperature > 35)
    return ["#ff4e00", "#fc5c65", "#fd9644", "#ffd32a", "#fff200"];
  if (temperature > 25)
    return ["#ff6b6b", "#ffa502", "#ffd93d", "#6bcb77", "#4d96ff"];
  if (temperature > 15)
    return ["#43b581", "#5dade2", "#f9ca24", "#e67e22", "#e74c3c"];
  if (temperature > 5)
    return ["#2e86de", "#54a0ff", "#c8d6e5", "#8395a7", "#576574"];
  if (temperature > -5)
    return ["#dfe6e9", "#b2bec3", "#636e72", "#2d3436", "#00b894"];
  return ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"];
}

function drawFlowField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  params: WeatherArtParams,
  colors: string[],
) {
  const noise = createNoise();
  const scale = 0.003 + (params.windSpeed / 200) * 0.005;
  const particleCount = 3000;
  const steps = 80;

  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < particleCount; i++) {
    let x = Math.random() * w;
    let y = Math.random() * h;
    const color = colors[1 + Math.floor(Math.random() * (colors.length - 1))];
    const alpha = 0.1 + Math.random() * 0.15;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let s = 0; s < steps; s++) {
      const n = noise(x * scale, y * scale);
      const angle = n * Math.PI * 4 + (params.humidity / 100) * Math.PI;
      const speed = 1 + params.windSpeed / 50;
      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;

      if (x < 0 || x > w || y < 0 || y > h) break;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
    if (!color.startsWith("rgba") && !color.startsWith("rgb")) {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const gradient = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    w * 0.6,
  );
  gradient.addColorStop(0, `${colors[colors.length - 1]}15`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawConstellation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  params: WeatherArtParams,
  colors: string[],
) {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const starCount = 200 + Math.floor(params.temperature + 20) * 5;
  const stars: { x: number; y: number; r: number }[] = [];

  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.5 + Math.random() * 2.5;
    stars.push({ x, y, r });

    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    grd.addColorStop(0, colors[3]);
    grd.addColorStop(0.5, `${colors[3]}66`);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors[3];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const connectionDist = 80 + params.windSpeed;
  ctx.strokeStyle = `${colors[3]}22`;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectionDist) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }

  const noise = createNoise();
  const nebulaeCount = 3 + Math.floor(params.cloudCover / 30);
  for (let n = 0; n < nebulaeCount; n++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const radius = 100 + Math.random() * 200;

    for (let i = 0; i < 600; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      const nv = noise(px * 0.005, py * 0.005);

      if (nv > -0.2) {
        const alpha = (1 - r / radius) * 0.08 * (nv + 1);
        const color = colors[1 + (n % (colors.length - 2))];
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(px, py, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function drawAurora(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  params: WeatherArtParams,
  colors: string[],
) {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w, h);

  const noise = createNoise();
  const bands = 5 + Math.floor(params.humidity / 20);
  const baseY = h * 0.3;

  for (let b = 0; b < bands; b++) {
    const yOffset = baseY + (b / bands) * h * 0.4;
    const color = colors[1 + (b % (colors.length - 1))];

    for (let x = 0; x < w; x += 2) {
      const n1 = noise(x * 0.003 + b * 0.5, b * 0.3);
      const n2 = noise(x * 0.008 + b * 0.2, b * 0.7);
      const y = yOffset + n1 * 80 + n2 * 40;
      const height = 30 + Math.abs(n1) * 120 + params.windSpeed;

      const grd = ctx.createLinearGradient(
        x,
        y - height / 2,
        x,
        y + height / 2,
      );
      grd.addColorStop(0, "transparent");
      grd.addColorStop(0.3, `${color}33`);
      grd.addColorStop(0.5, `${color}55`);
      grd.addColorStop(0.7, `${color}33`);
      grd.addColorStop(1, "transparent");

      ctx.fillStyle = grd;
      ctx.fillRect(x, y - height / 2, 2, height);
    }
  }

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.5 + Math.random() * 1.5;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const STYLES: { value: ArtStyle; labelKey: string; icon: string }[] = [
  { value: "flowField", labelKey: "weatherArt.styleFlow", icon: "🌊" },
  {
    value: "constellation",
    labelKey: "weatherArt.styleConstellation",
    icon: "✨",
  },
  { value: "aurora", labelKey: "weatherArt.styleAurora", icon: "🌌" },
];

export default function WeatherArt() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState<ArtStyle>("flowField");
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState(Date.now());

  const { currentCity } = useFavoritesStore();
  const city = currentCity ?? DEFAULT_CITY;
  const { data: weather } = useWeather(city.latitude, city.longitude);

  const params: WeatherArtParams = {
    temperature: weather?.current?.temperature ?? 20,
    windSpeed: weather?.current?.windSpeed ?? 10,
    cloudCover: weather?.current?.cloudCover ?? 50,
    humidity: weather?.current?.humidity ?? 50,
    precipitation: weather?.current?.precipitation ?? 0,
    weatherCode: weather?.current?.weatherCode ?? 0,
    isDay: weather?.current?.isDay ?? true,
  };

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayW = 960;
    const displayH = 540;
    canvas.width = displayW;
    canvas.height = displayH;

    const colors = getColorPalette(params, style);

    requestAnimationFrame(() => {
      if (style === "flowField") {
        drawFlowField(ctx, displayW, displayH, params, colors);
      } else if (style === "constellation") {
        drawConstellation(ctx, displayW, displayH, params, colors);
      } else {
        drawAurora(ctx, displayW, displayH, params, colors);
      }

      const date = new Date().toLocaleDateString();
      const desc = getWmoDescription(params.weatherCode, t);
      const watermark = `${city.name} · ${desc} · ${Math.round(params.temperature)}°C · ${date}`;
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.textAlign = "right";
      ctx.fillText(watermark, displayW - 20, displayH - 16);
      ctx.fillText("StormScope Weather Art", displayW - 20, displayH - 36);

      setIsGenerating(false);
    });
  }, [params, style, city.name, t]);

  useEffect(() => {
    generate();
  }, [seed, style, weather]);

  const download4K = useCallback(() => {
    const offscreen = document.createElement("canvas");
    offscreen.width = 3840;
    offscreen.height = 2160;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    const colors = getColorPalette(params, style);
    if (style === "flowField") {
      drawFlowField(ctx, 3840, 2160, params, colors);
    } else if (style === "constellation") {
      drawConstellation(ctx, 3840, 2160, params, colors);
    } else {
      drawAurora(ctx, 3840, 2160, params, colors);
    }

    const date = new Date().toLocaleDateString();
    const desc = getWmoDescription(params.weatherCode, t);
    const watermark = `${city.name} · ${desc} · ${Math.round(params.temperature)}°C · ${date}`;
    ctx.font = "28px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "right";
    ctx.fillText(watermark, 3800, 2130);
    ctx.fillText("StormScope Weather Art", 3800, 2094);

    offscreen.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stormscope-art-${city.name}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [params, style, city.name, t]);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-6xl mx-auto text-[var(--text-primary)] pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-7 h-7 text-primary-400" />
            {t("weatherArt.title")}
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            {t("weatherArt.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStyle(s.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              style === s.value
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                : "bg-[var(--component-bg)] text-[var(--text-secondary)] hover:bg-[var(--component-bg-hover)] border border-[var(--component-border)]"
            }`}
          >
            {s.icon} {t(s.labelKey)}
          </button>
        ))}
      </div>

      <Card variant="glass" className="p-4 overflow-hidden">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/20">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      </Card>

      <Card variant="glass" className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
          {[
            {
              label: t("weatherArt.paramTemp"),
              value: `${Math.round(params.temperature)}°C`,
              color: "text-orange-400",
            },
            {
              label: t("weatherArt.paramWind"),
              value: `${Math.round(params.windSpeed)} km/h`,
              color: "text-blue-400",
            },
            {
              label: t("weatherArt.paramCloud"),
              value: `${params.cloudCover}%`,
              color: "text-gray-400",
            },
            {
              label: t("weatherArt.paramHumidity"),
              value: `${params.humidity}%`,
              color: "text-cyan-400",
            },
            {
              label: t("weatherArt.paramPrecip"),
              value: `${params.precipitation} mm`,
              color: "text-indigo-400",
            },
            {
              label: t("weatherArt.paramCondition"),
              value: getWmoDescription(params.weatherCode, t),
              color: "text-emerald-400",
            },
            {
              label: t("weatherArt.paramDayNight"),
              value: params.isDay ? "☀️" : "🌙",
              color: "text-yellow-400",
            },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-xs text-[var(--text-muted)]">
                {item.label}
              </div>
              <div className={`text-sm font-semibold ${item.color}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setSeed(Date.now())}
          variant="secondary"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t("weatherArt.regenerate")}
        </Button>
        <Button onClick={download4K} variant="primary" className="gap-2">
          <Download className="w-4 h-4" />
          {t("weatherArt.download4K")}
        </Button>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] ml-auto">
          <Maximize className="w-3.5 h-3.5" />
          3840 × 2160
        </div>
      </div>
    </motion.div>
  );
}
