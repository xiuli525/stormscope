import { useEffect, useRef, useCallback } from "react";

type WeatherType =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm"
  | "hail";

function getWeatherType(code: number): WeatherType {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code === 96 || code === 99) return "hail";
  if (code >= 95) return "thunderstorm";
  return "clear";
}

/* ── Particle interfaces ── */

interface BaseParticle {
  x: number;
  y: number;
  opacity: number;
}

type ClearVariant = "orb" | "cross" | "ring" | "sparkle";
const CLEAR_VARIANTS: ClearVariant[] = [
  "orb",
  "orb",
  "cross",
  "ring",
  "sparkle",
];

interface ClearParticle extends BaseParticle {
  size: number;
  speedY: number;
  drift: number;
  phase: number;
  variant: ClearVariant;
  pulseSpeed: number;
  glowLayers: number;
  sinAmp: number;
  sinFreq: number;
}

interface RainDrop extends BaseParticle {
  length: number;
  speedY: number;
  speedX: number;
  width: number;
}

type SnowVariant = "circle" | "crystal" | "star" | "dot";

interface SnowFlake extends BaseParticle {
  size: number;
  speedY: number;
  drift: number;
  wobble: number;
  wobbleSpeed: number;
  rotation: number;
  rotationSpeed: number;
  variant: SnowVariant;
  sparkle: number;
}

interface FogPatch extends BaseParticle {
  width: number;
  height: number;
  speedX: number;
  depth: number;
  driftY: number;
}

interface CloudParticle extends BaseParticle {
  radius: number;
  speedX: number;
  depth: number;
  bobPhase: number;
  bobSpeed: number;
  blobs: Array<{ dx: number; dy: number; r: number }>;
}

interface HailStone extends BaseParticle {
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  irregularity: number; // 0-1 how non-circular
}

interface RainSplash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  dots: number;
}

interface Lightning {
  x: number;
  opacity: number;
  timer: number;
  duration: number;
  segments: Array<{ x1: number; y1: number; x2: number; y2: number }>;
}

interface ParticleConfig {
  count: number;
  color: string;
}

const MAX_SPLASHES = 40;

const CONFIGS: Record<WeatherType, ParticleConfig> = {
  clear: { count: 65, color: "rgba(255, 255, 255, " },
  cloudy: { count: 25, color: "rgba(255, 255, 255, " },
  fog: { count: 22, color: "rgba(255, 255, 255, " },
  drizzle: { count: 60, color: "rgba(174, 194, 224, " },
  rain: { count: 160, color: "rgba(174, 194, 224, " },
  snow: { count: 90, color: "rgba(255, 255, 255, " },
  thunderstorm: { count: 200, color: "rgba(174, 194, 224, " },
  hail: { count: 100, color: "rgba(200, 220, 240, " },
};

const SNOW_VARIANTS: SnowVariant[] = ["circle", "crystal", "star", "dot"];

interface WeatherParticlesProps {
  weatherCode: number;
  isDay: boolean;
}

export function WeatherParticles({
  weatherCode,
  isDay,
}: WeatherParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<BaseParticle[]>([]);
  const lightningRef = useRef<Lightning | null>(null);
  const splashesRef = useRef<RainSplash[]>([]);
  const weatherTypeRef = useRef<WeatherType>("clear");
  const timeRef = useRef(0);
  const isDayRef = useRef(isDay);
  isDayRef.current = isDay;

  /* ── Create functions ── */

  const createClearParticle = useCallback(
    (w: number, h: number): ClearParticle => {
      const variant =
        CLEAR_VARIANTS[Math.floor(Math.random() * CLEAR_VARIANTS.length)];
      const size =
        variant === "cross" || variant === "sparkle"
          ? Math.random() * 2.5 + 1.5
          : Math.random() * 3 + 1;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size,
        speedY: -(Math.random() * 0.25 + 0.05),
        drift: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        variant,
        pulseSpeed: Math.random() * 0.002 + 0.0008,
        glowLayers: variant === "orb" ? 3 : 2,
        sinAmp: Math.random() * 0.6 + 0.2,
        sinFreq: Math.random() * 0.003 + 0.001,
      };
    },
    [],
  );

  const createRainDrop = useCallback(
    (w: number, h: number): RainDrop => ({
      x: Math.random() * (w + 200) - 100,
      y: Math.random() * h - h,
      length: Math.random() * 25 + 12,
      speedY: Math.random() * 8 + 13,
      speedX: -2.5 - Math.random() * 2,
      width: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.45 + 0.2,
    }),
    [],
  );

  const createSnowFlake = useCallback(
    (w: number, h: number): SnowFlake => ({
      x: Math.random() * w,
      y: Math.random() * h - h,
      size: Math.random() * 4 + 1,
      speedY: Math.random() * 1 + 0.5,
      drift: Math.random() * 0.5 - 0.25,
      wobble: 0,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.6 + 0.2,
      variant: SNOW_VARIANTS[Math.floor(Math.random() * SNOW_VARIANTS.length)],
      sparkle: Math.random(),
    }),
    [],
  );

  const createFogPatch = useCallback(
    (w: number, h: number): FogPatch => ({
      x: Math.random() * w * 2 - w,
      y: Math.random() * h,
      width: Math.random() * 500 + 250,
      height: Math.random() * 120 + 60,
      speedX: Math.random() * 0.25 + 0.08,
      opacity: Math.random() * 0.08 + 0.02,
      depth: Math.random(),
      driftY: (Math.random() - 0.5) * 0.15,
    }),
    [],
  );

  const createCloudParticle = useCallback(
    (w: number, h: number): CloudParticle => {
      const radius = Math.random() * 80 + 40;
      const blobCount = Math.floor(Math.random() * 3) + 3;
      const blobs: CloudParticle["blobs"] = [];
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          dx: (Math.random() - 0.5) * radius * 1.4,
          dy: (Math.random() - 0.5) * radius * 0.5,
          r: radius * (Math.random() * 0.5 + 0.4),
        });
      }
      return {
        x: Math.random() * (w + 400) - 200,
        y: Math.random() * h * 0.5,
        opacity: Math.random() * 0.1 + 0.03,
        radius,
        speedX: Math.random() * 0.35 + 0.08,
        depth: Math.random(),
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: Math.random() * 0.004 + 0.001,
        blobs,
      };
    },
    [],
  );

  const createHailStone = useCallback(
    (w: number, h: number): HailStone => ({
      x: Math.random() * (w + 200) - 100,
      y: Math.random() * h - h,
      opacity: Math.random() * 0.5 + 0.3,
      size: Math.random() * 5 + 3,
      speedY: Math.random() * 10 + 14,
      speedX: -1 - Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      irregularity: Math.random() * 0.4,
    }),
    [],
  );

  const createDrizzleDrop = useCallback(
    (w: number, h: number): RainDrop => ({
      x: Math.random() * (w + 100) - 50,
      y: Math.random() * h - h,
      length: Math.random() * 6 + 3,
      speedY: Math.random() * 3 + 2.5,
      speedX: -0.3 - Math.random() * 0.6,
      width: 0.4,
      opacity: Math.random() * 0.2 + 0.06,
    }),
    [],
  );

  const addSplash = useCallback((x: number, y: number) => {
    if (splashesRef.current.length >= MAX_SPLASHES) return;
    splashesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 12 + 6,
      opacity: 0.5,
      dots: Math.floor(Math.random() * 3) + 2,
    });
  }, []);

  const createLightning = useCallback((w: number, h: number): Lightning => {
    const x = Math.random() * w * 0.6 + w * 0.2;
    const segments: Lightning["segments"] = [];
    let cx = x;
    let cy = 0;
    const steps = Math.floor(Math.random() * 6) + 5;
    const stepH = (h * 0.65) / steps;

    for (let i = 0; i < steps; i++) {
      const nx = cx + (Math.random() - 0.5) * 100;
      const ny = cy + stepH + Math.random() * 25;
      segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });

      if (Math.random() < 0.45) {
        const bx = cx + (Math.random() - 0.5) * 140;
        const by = cy + stepH * 0.7;
        segments.push({ x1: cx, y1: cy, x2: bx, y2: by });
        if (Math.random() < 0.3) {
          const bx2 = bx + (Math.random() - 0.5) * 60;
          const by2 = by + stepH * 0.4;
          segments.push({ x1: bx, y1: by, x2: bx2, y2: by2 });
        }
      }
      cx = nx;
      cy = ny;
    }

    return {
      x: 0,
      opacity: 1,
      timer: 0,
      duration: Math.random() * 180 + 80,
      segments,
    };
  }, []);

  /* ── Draw functions ── */

  const drawClear = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      particles: ClearParticle[],
      time: number,
      daylight: boolean,
    ) => {
      for (const p of particles) {
        const pulse = Math.sin(time * p.pulseSpeed + p.phase) * 0.5 + 0.5;
        const alpha = p.opacity * (0.5 + pulse * 0.5);
        const warm = daylight;
        const coreR = warm ? 255 : 200;
        const coreG = warm ? 220 : 220;
        const coreB = warm ? 150 : 255;

        switch (p.variant) {
          case "orb": {
            for (let layer = p.glowLayers; layer >= 0; layer--) {
              const r = p.size * (1 + layer * 1.8);
              const a = alpha * (layer === 0 ? 1 : 0.12 / layer);
              ctx.beginPath();
              ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${a})`;
              ctx.fill();
            }
            break;
          }
          case "cross": {
            const len = p.size * 3;
            const a = alpha * 0.9;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(time * 0.0003 + p.phase);
            ctx.strokeStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${a})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-len, 0);
            ctx.lineTo(len, 0);
            ctx.moveTo(0, -len);
            ctx.lineTo(0, len);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha * 0.1})`;
            ctx.fill();
            ctx.restore();
            break;
          }
          case "ring": {
            const r = p.size * 1.5 + pulse * p.size * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha * 0.7})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha * 0.06})`;
            ctx.fill();
            break;
          }
          case "sparkle": {
            const arms = 4;
            const outerLen = p.size * 2.8;
            const innerLen = p.size * 0.6;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(time * 0.0005 + p.phase);
            ctx.beginPath();
            for (let i = 0; i < arms * 2; i++) {
              const angle = (i * Math.PI) / arms;
              const len = i % 2 === 0 ? outerLen : innerLen;
              const px = Math.cos(angle) * len;
              const py = Math.sin(angle) * len;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha * 0.85})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${coreR}, ${coreG}, ${coreB}, ${alpha * 0.1})`;
            ctx.fill();
            ctx.restore();
            break;
          }
        }
      }
    },
    [],
  );

  const drawRain = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      particles: RainDrop[],
      _config: ParticleConfig,
    ) => {
      ctx.lineCap = "round";
      for (const p of particles) {
        const endX = p.x + p.speedX * 2;
        const endY = p.y + p.length;
        const grad = ctx.createLinearGradient(p.x, p.y, endX, endY);
        grad.addColorStop(0, `rgba(174, 194, 224, ${p.opacity * 0.15})`);
        grad.addColorStop(0.3, `rgba(174, 194, 224, ${p.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(200, 215, 240, ${p.opacity})`);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.width;
        ctx.stroke();
      }
    },
    [],
  );

  const drawSnow = useCallback(
    (ctx: CanvasRenderingContext2D, particles: SnowFlake[], time: number) => {
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const sparkleAlpha =
          p.opacity * (0.7 + Math.sin(time * 0.003 + p.sparkle * 10) * 0.3);

        switch (p.variant) {
          case "circle":
            // Simple soft snowflake
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
            ctx.fill();
            break;

          case "crystal":
            // Six-armed crystal with branches
            ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
            ctx.lineWidth = 0.6;
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const armLen = p.size * 2.5;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(cos * armLen, sin * armLen);
              ctx.stroke();
              // Side branches
              const branchAt = armLen * 0.55;
              const branchLen = armLen * 0.35;
              for (const side of [-1, 1]) {
                const bAngle = angle + side * 0.5;
                ctx.beginPath();
                ctx.moveTo(cos * branchAt, sin * branchAt);
                ctx.lineTo(
                  cos * branchAt + Math.cos(bAngle) * branchLen,
                  sin * branchAt + Math.sin(bAngle) * branchLen,
                );
                ctx.stroke();
              }
            }
            // Center dot
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 240, 255, ${sparkleAlpha * 0.8})`;
            ctx.fill();
            break;

          case "star":
            // Eight-pointed star
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4;
              const outerR = p.size * 2;
              const innerR = p.size * 0.8;
              const r = i % 2 === 0 ? outerR : innerR;
              const px = Math.cos(angle) * r;
              const py = Math.sin(angle) * r;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(240, 248, 255, ${sparkleAlpha * 0.7})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
            break;

          case "dot":
            // Tiny soft dot
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.9})`;
            ctx.fill();
            break;
        }

        // Soft glow for all variants
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${sparkleAlpha * 0.08})`;
        ctx.fill();

        ctx.restore();
      }
    },
    [],
  );

  const drawCloudy = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      particles: CloudParticle[],
      time: number,
    ) => {
      for (const p of particles) {
        const bob = Math.sin(time * p.bobSpeed + p.bobPhase) * 8;
        const scale = 0.6 + p.depth * 0.4;
        const alpha = p.opacity * (0.5 + p.depth * 0.5);
        for (const blob of p.blobs) {
          const bx = p.x + blob.dx * scale;
          const by = p.y + bob + blob.dy * scale;
          const br = blob.r * scale;
          const gradient = ctx.createRadialGradient(
            bx,
            by,
            br * 0.05,
            bx,
            by,
            br,
          );
          gradient.addColorStop(0, `rgba(225, 232, 245, ${alpha * 0.9})`);
          gradient.addColorStop(0.4, `rgba(210, 220, 240, ${alpha * 0.5})`);
          gradient.addColorStop(1, "rgba(200, 215, 235, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(bx, by, br, br * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    [],
  );

  const drawHail = useCallback(
    (ctx: CanvasRenderingContext2D, stones: HailStone[]) => {
      for (const p of stones) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Irregular ice shape
        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const r = p.size * (1 - p.irregularity * Math.sin(angle * 3));
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Icy gradient
        const grad = ctx.createRadialGradient(
          -p.size * 0.2,
          -p.size * 0.2,
          0,
          0,
          0,
          p.size,
        );
        grad.addColorStop(0, `rgba(230, 240, 255, ${p.opacity})`);
        grad.addColorStop(0.6, `rgba(180, 210, 240, ${p.opacity * 0.8})`);
        grad.addColorStop(1, `rgba(150, 190, 230, ${p.opacity * 0.5})`);
        ctx.fillStyle = grad;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(-p.size * 0.25, -p.size * 0.25, p.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.6})`;
        ctx.fill();

        ctx.restore();
      }
    },
    [],
  );

  const drawSplashes = useCallback((ctx: CanvasRenderingContext2D) => {
    const splashes = splashesRef.current;
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.radius += 0.8;
      s.opacity *= 0.93;

      if (s.opacity < 0.02 || s.radius > s.maxRadius) {
        splashes.splice(i, 1);
        continue;
      }

      // Expanding ring
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 200, 230, ${s.opacity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Center water dots
      for (let d = 0; d < s.dots; d++) {
        const angle = (d / s.dots) * Math.PI * 2;
        const dist = s.radius * 0.4;
        ctx.beginPath();
        ctx.arc(
          s.x + Math.cos(angle) * dist,
          s.y + Math.sin(angle) * dist - 1,
          1,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(200, 220, 245, ${s.opacity * 0.7})`;
        ctx.fill();
      }
    }
  }, []);

  const drawFog = useCallback(
    (ctx: CanvasRenderingContext2D, patches: FogPatch[], time: number) => {
      for (const p of patches) {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const breathe =
          Math.sin(time * 0.0005 + p.depth * Math.PI * 2) * 0.15 + 1;
        const w2 = (p.width / 2) * breathe;
        const h2 = (p.height / 2) * breathe;
        const depthAlpha = p.opacity * (0.5 + p.depth * 0.5);
        const gradient = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(w2, h2),
        );
        gradient.addColorStop(0, `rgba(200, 210, 230, ${depthAlpha})`);
        gradient.addColorStop(0.5, `rgba(200, 210, 230, ${depthAlpha * 0.5})`);
        gradient.addColorStop(1, "rgba(200, 210, 230, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w2, h2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [],
  );

  const drawLightning = useCallback(
    (ctx: CanvasRenderingContext2D, lightning: Lightning) => {
      if (lightning.opacity <= 0) return;

      ctx.fillStyle = `rgba(220, 220, 255, ${lightning.opacity * 0.08})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.save();
      ctx.shadowColor = `rgba(170, 180, 255, ${lightning.opacity})`;
      ctx.shadowBlur = 35;
      ctx.strokeStyle = `rgba(180, 180, 255, ${lightning.opacity * 0.6})`;
      ctx.lineWidth = 4;
      for (const seg of lightning.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      ctx.shadowBlur = 20;
      ctx.strokeStyle = `rgba(200, 200, 255, ${lightning.opacity})`;
      ctx.lineWidth = 2;
      for (const seg of lightning.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      ctx.shadowBlur = 8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.opacity * 0.9})`;
      ctx.lineWidth = 1;
      for (const seg of lightning.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }
      ctx.restore();
    },
    [],
  );

  /* ── Update functions ── */

  const updateClear = useCallback(
    (particles: ClearParticle[], w: number, h: number) => {
      const t = timeRef.current;
      for (const p of particles) {
        const wave1 = Math.sin(t * p.sinFreq + p.phase) * p.sinAmp;
        const wave2 =
          Math.cos(t * p.sinFreq * 0.7 + p.phase * 1.3) * p.sinAmp * 0.4;
        p.x += p.drift + wave1 + wave2;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
      }
    },
    [],
  );

  const updateRain = useCallback(
    (
      particles: RainDrop[],
      w: number,
      h: number,
      createFn: (w: number, h: number) => RainDrop,
      withSplash: boolean,
    ) => {
      const windGust = Math.sin(timeRef.current * 0.0008) * 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as RainDrop;
        p.x += p.speedX + windGust;
        p.y += p.speedY;
        if (p.y > h + 20) {
          if (withSplash && Math.random() < 0.35) {
            addSplash(p.x, h);
          }
          particles[i] = createFn(w, h);
          (particles[i] as RainDrop).y = -20;
        }
      }
    },
    [addSplash],
  );

  const updateSnow = useCallback(
    (particles: SnowFlake[], w: number, h: number) => {
      const t = timeRef.current;
      const wind = Math.sin(t * 0.0005) * 0.4 + Math.sin(t * 0.0013) * 0.2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as SnowFlake;
        p.wobble += p.wobbleSpeed;
        const sizeResistance = 1 / (1 + p.size * 0.15);
        p.x += p.drift + Math.sin(p.wobble) * 0.8 + wind * sizeResistance;
        p.y += p.speedY * sizeResistance;
        p.rotation += p.rotationSpeed;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
      }
    },
    [],
  );

  const updateFog = useCallback((patches: FogPatch[], w: number, h: number) => {
    for (const p of patches) {
      p.x += p.speedX * (0.6 + p.depth * 0.4);
      p.y += p.driftY;
      if (p.x > w + p.width) {
        p.x = -p.width * 2;
      }
      if (p.y < -p.height) p.y = h;
      if (p.y > h + p.height) p.y = -p.height;
    }
  }, []);

  const updateCloudy = useCallback((particles: CloudParticle[], w: number) => {
    for (const p of particles) {
      p.x += p.speedX * (0.5 + p.depth * 0.5);
      if (p.x > w + p.radius * 2) {
        p.x = -p.radius * 2;
      }
    }
  }, []);

  const updateHail = useCallback(
    (stones: HailStone[], w: number, h: number) => {
      for (let i = 0; i < stones.length; i++) {
        const p = stones[i] as HailStone;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > h + 20) {
          if (Math.random() < 0.4) {
            addSplash(p.x, h);
          }
          stones[i] = createHailStone(w, h);
          (stones[i] as HailStone).y = -20;
        }
      }
    },
    [addSplash, createHailStone],
  );

  const updateLightningState = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!lightningRef.current && Math.random() < 0.012) {
        lightningRef.current = createLightning(w, h);
      }
      if (lightningRef.current) {
        lightningRef.current.timer += 16;
        const progress =
          lightningRef.current.timer / lightningRef.current.duration;
        if (progress < 0.05) {
          lightningRef.current.opacity = progress / 0.05;
        } else if (progress < 0.2) {
          lightningRef.current.opacity = 1;
        } else if (progress < 0.35) {
          lightningRef.current.opacity = 0.4 + Math.random() * 0.6;
        } else {
          lightningRef.current.opacity = Math.max(
            0,
            1 - (progress - 0.35) / 0.65,
          );
        }
        drawLightning(ctx, lightningRef.current);
        if (progress >= 1) {
          lightningRef.current = null;
        }
      }
    },
    [createLightning, drawLightning],
  );

  /* ── Main animation loop ── */

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    timeRef.current += 16;

    ctx.clearRect(0, 0, w, h);

    const type = weatherTypeRef.current;
    const particles = particlesRef.current;
    const config = CONFIGS[type];

    switch (type) {
      case "clear":
        updateClear(particles as ClearParticle[], w, h);
        drawClear(
          ctx,
          particles as ClearParticle[],
          timeRef.current,
          isDayRef.current,
        );
        break;

      case "cloudy":
        updateCloudy(particles as CloudParticle[], w);
        drawCloudy(ctx, particles as CloudParticle[], timeRef.current);
        break;

      case "drizzle":
        updateRain(particles as RainDrop[], w, h, createDrizzleDrop, false);
        drawRain(ctx, particles as RainDrop[], config);
        break;

      case "rain":
        updateRain(particles as RainDrop[], w, h, createRainDrop, true);
        drawRain(ctx, particles as RainDrop[], config);
        drawSplashes(ctx);
        break;

      case "snow":
        updateSnow(particles as SnowFlake[], w, h);
        drawSnow(ctx, particles as SnowFlake[], timeRef.current);
        break;

      case "fog":
        updateFog(particles as FogPatch[], w, h);
        drawFog(ctx, particles as FogPatch[], timeRef.current);
        break;

      case "thunderstorm":
        updateRain(particles as RainDrop[], w, h, createRainDrop, true);
        drawRain(ctx, particles as RainDrop[], config);
        drawSplashes(ctx);
        updateLightningState(ctx, w, h);
        break;

      case "hail":
        updateHail(particles as HailStone[], w, h);
        drawHail(ctx, particles as HailStone[]);
        drawSplashes(ctx);
        updateLightningState(ctx, w, h);
        break;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [
    createDrizzleDrop,
    createRainDrop,
    drawClear,
    drawCloudy,
    drawFog,
    drawHail,
    drawRain,
    drawSnow,
    drawSplashes,
    updateClear,
    updateCloudy,
    updateFog,
    updateHail,
    updateLightningState,
    updateRain,
    updateSnow,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const type = getWeatherType(weatherCode);
    weatherTypeRef.current = type;
    const config = CONFIGS[type];
    const w = canvas.width;
    const h = canvas.height;

    let newParticles: BaseParticle[];

    switch (type) {
      case "clear":
        newParticles = Array.from({ length: config.count }, () =>
          createClearParticle(w, h),
        );
        break;
      case "cloudy":
        newParticles = Array.from({ length: config.count }, () =>
          createCloudParticle(w, h),
        );
        break;
      case "drizzle":
        newParticles = Array.from({ length: config.count }, () =>
          createDrizzleDrop(w, h),
        );
        break;
      case "rain":
        newParticles = Array.from({ length: config.count }, () =>
          createRainDrop(w, h),
        );
        break;
      case "snow":
        newParticles = Array.from({ length: config.count }, () =>
          createSnowFlake(w, h),
        );
        break;
      case "fog":
        newParticles = Array.from({ length: config.count }, () =>
          createFogPatch(w, h),
        );
        break;
      case "thunderstorm":
        newParticles = Array.from({ length: config.count }, () =>
          createRainDrop(w, h),
        );
        break;
      case "hail":
        newParticles = Array.from({ length: config.count }, () =>
          createHailStone(w, h),
        );
        break;
      default:
        newParticles = [];
    }

    particlesRef.current = newParticles;
    lightningRef.current = null;
    splashesRef.current = [];
  }, [
    weatherCode,
    createClearParticle,
    createCloudParticle,
    createDrizzleDrop,
    createHailStone,
    createRainDrop,
    createSnowFlake,
    createFogPatch,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
