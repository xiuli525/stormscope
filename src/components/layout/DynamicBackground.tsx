import { motion } from "framer-motion";
import { getSkyGradient } from "../../utils/gradients";
import { WeatherParticles } from "./WeatherParticles";
import { useThemeStore } from "../../stores/theme";

interface DynamicBackgroundProps {
  weatherCode: number;
  isDay: boolean;
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
        className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl ${isLight ? "bg-blue-200/20" : "bg-white/5"}`}
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
        className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-3xl ${isLight ? "bg-sky-200/25" : "bg-white/10"}`}
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
        className={`absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-3xl ${isLight ? "bg-indigo-200/15" : "bg-white/5"}`}
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
