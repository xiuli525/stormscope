import { motion } from "framer-motion";
import { getSkyGradient } from "../../utils/gradients";
import { WeatherParticles } from "./WeatherParticles";
import { useThemeStore } from "../../stores/theme";

interface DynamicBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

function getOrbColors(
  weatherCode: number,
  isLight: boolean,
): [string, string, string] {
  if (!isLight) return ["bg-white/5", "bg-white/10", "bg-white/5"];

  if (weatherCode === 0 || weatherCode === 1)
    return ["bg-sky-300/25", "bg-blue-200/30", "bg-cyan-200/20"];
  if (weatherCode === 2)
    return ["bg-indigo-200/20", "bg-sky-200/25", "bg-blue-200/15"];
  if (weatherCode === 3)
    return ["bg-slate-300/20", "bg-gray-300/25", "bg-slate-200/15"];
  if (weatherCode === 45 || weatherCode === 48)
    return ["bg-gray-300/25", "bg-slate-300/20", "bg-gray-200/15"];
  if (weatherCode >= 51 && weatherCode <= 67)
    return ["bg-blue-300/20", "bg-slate-300/25", "bg-sky-300/15"];
  if (weatherCode >= 71 && weatherCode <= 86)
    return ["bg-white/25", "bg-slate-100/30", "bg-blue-100/15"];
  if (weatherCode >= 95)
    return ["bg-slate-400/20", "bg-gray-400/25", "bg-indigo-300/15"];

  return ["bg-sky-300/25", "bg-blue-200/30", "bg-cyan-200/20"];
}

export function DynamicBackground({
  weatherCode,
  isDay,
}: DynamicBackgroundProps) {
  const { resolvedTheme } = useThemeStore();
  const isLight = resolvedTheme === "light";
  const [gradientStart, gradientEnd] = getSkyGradient(
    weatherCode,
    isDay,
    isLight,
  );
  const [orb1, orb2, orb3] = getOrbColors(weatherCode, isLight);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          background: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <WeatherParticles weatherCode={weatherCode} isDay={isDay} />

      <motion.div
        className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl ${orb1}`}
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-3xl ${orb2}`}
        animate={{
          y: [0, -60, 0],
          x: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className={`absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-3xl ${orb3}`}
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  );
}
