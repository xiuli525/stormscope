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

interface ClearParticle extends BaseParticle {
  size: number;
  speedY: number;
  drift: number;
  phase: number;
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
}

interface CloudParticle extends BaseParticle {
  radius: number;
  speedX: number;
  depth: number; // 0 = far, 1 = near
  bobPhase: number;
  bobSpeed: number;
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
  clear: { count: 40, color: "rgba(255, 255, 255, " },
  cloudy: { count: 30, color: "rgba(255, 255, 255, " },
  fog: { count: 12, color: "rgba(255, 255, 255, " },
  drizzle: { count: 80, color: "rgba(174, 194, 224, " },
  rain: { count: 150, color: "rgba(174, 194, 224, " },
  snow: { count: 80, color: "rgba(255, 255, 255, " },
  thunderstorm: { count: 180, color: "rgba(174, 194, 224, " },
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
    (w: number, h: number): ClearParticle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.3 + 0.1),
      drift: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }),
    [],
  );

  const createRainDrop = useCallback(
    (w: number, h: number): RainDrop => ({
      x: Math.random() * (w + 200) - 100,
      y: Math.random() * h - h,
      length: Math.random() * 20 + 10,
      speedY: Math.random() * 8 + 12,
      speedX: -2 - Math.random() * 2,
      width: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.2,
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
      width: Math.random() * 400 + 200,
      height: Math.random() * 100 + 50,
      speedX: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.06 + 0.02,
    }),
    [],
  );

  const createCloudParticle = useCallback(
    (w: number, h: number): CloudParticle => ({
      x: Math.random() * (w + 400) - 200,
      y: Math.random() * h * 0.5,
      opacity: Math.random() * 0.12 + 0.04,
      radius: Math.random() * 80 + 40,
      speedX: Math.random() * 0.4 + 0.1,
      depth: Math.random(),
      bobPhase: Math.random() * Math.PI * 2,
      bobSpeed: Math.random() * 0.005 + 0.002,
    }),
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
      length: Math.random() * 8 + 4,
      speedY: Math.random() * 4 + 4,
      speedX: -0.5 - Math.random(),
      width: 0.5,
      opacity: Math.random() * 0.3 + 0.1,
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
    const steps = Math.floor(Math.random() * 5) + 4;
    const stepH = (h * 0.6) / steps;

    for (let i = 0; i < steps; i++) {
      const nx = cx + (Math.random() - 0.5) * 80;
      const ny = cy + stepH + Math.random() * 20;
      segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });

      if (Math.random() < 0.3) {
        const bx = cx + (Math.random() - 0.5) * 120;
        const by = cy + stepH * 0.7;
        segments.push({ x1: cx, y1: cy, x2: bx, y2: by });
      }
      cx = nx;
      cy = ny;
    }

    return {
      x: 0,
      opacity: 1,
      timer: 0,
      duration: Math.random() * 200 + 100,
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
        const pulse = Math.sin(time * 0.001 + p.phase) * 0.5 + 0.5;
        const alpha = p.opacity * (0.5 + pulse * 0.5);
        const glowColor = daylight
          ? `rgba(255, 220, 150, ${alpha})`
          : `rgba(200, 220, 255, ${alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = daylight
            ? `rgba(255, 220, 150, ${alpha * 0.15})`
            : `rgba(200, 220, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      }
    },
    [],
  );

  const drawRain = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      particles: RainDrop[],
      config: ParticleConfig,
    ) => {
      ctx.lineCap = "round";
      for (const p of particles) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
        ctx.strokeStyle = config.color + p.opacity + ")";
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
        const r = p.radius * scale;
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y + bob,
          r * 0.1,
          p.x,
          p.y + bob,
          r,
        );
        const alpha = p.opacity * (0.5 + p.depth * 0.5);
        gradient.addColorStop(0, `rgba(220, 230, 245, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(200, 215, 235, ${alpha * 0.6})`);
        gradient.addColorStop(1, "rgba(200, 215, 235, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + bob, r, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
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
    (ctx: CanvasRenderingContext2D, patches: FogPatch[]) => {
      for (const p of patches) {
        const gradient = ctx.createRadialGradient(
          p.x + p.width / 2,
          p.y + p.height / 2,
          0,
          p.x + p.width / 2,
          p.y + p.height / 2,
          p.width / 2,
        );
        gradient.addColorStop(0, `rgba(200, 210, 230, ${p.opacity})`);
        gradient.addColorStop(1, "rgba(200, 210, 230, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
    },
    [],
  );

  const drawLightning = useCallback(
    (ctx: CanvasRenderingContext2D, lightning: Lightning) => {
      if (lightning.opacity <= 0) return;

      ctx.fillStyle = `rgba(200, 200, 255, ${lightning.opacity * 0.05})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.strokeStyle = `rgba(200, 200, 255, ${lightning.opacity})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(150, 170, 255, ${lightning.opacity})`;
      ctx.shadowBlur = 20;

      for (const seg of lightning.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      for (const seg of lightning.segments) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    },
    [],
  );

  /* ── Update functions ── */

  const updateClear = useCallback(
    (particles: ClearParticle[], w: number, h: number) => {
      for (const p of particles) {
        p.x += p.drift + Math.sin(timeRef.current * 0.001 + p.phase) * 0.3;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
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
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as RainDrop;
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y > h + 20) {
          if (withSplash && Math.random() < 0.3) {
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
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i] as SnowFlake;
        p.wobble += p.wobbleSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.8;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
      }
    },
    [],
  );

  const updateFog = useCallback((patches: FogPatch[], w: number) => {
    for (const p of patches) {
      p.x += p.speedX;
      if (p.x > w + p.width) {
        p.x = -p.width * 2;
      }
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
      if (!lightningRef.current && Math.random() < 0.005) {
        lightningRef.current = createLightning(w, h);
      }
      if (lightningRef.current) {
        lightningRef.current.timer += 16;
        const progress =
          lightningRef.current.timer / lightningRef.current.duration;
        if (progress < 0.1) {
          lightningRef.current.opacity = progress / 0.1;
        } else if (progress < 0.3) {
          lightningRef.current.opacity = 1;
        } else {
          lightningRef.current.opacity = Math.max(
            0,
            1 - (progress - 0.3) / 0.7,
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
        updateFog(particles as FogPatch[], w);
        drawFog(ctx, particles as FogPatch[]);
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
