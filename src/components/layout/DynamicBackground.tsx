import { motion } from "framer-motion";
import { getSkyGradient } from "../../utils/gradients";

interface DynamicBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

export function DynamicBackground({
  weatherCode,
  isDay,
}: DynamicBackgroundProps) {
  const [gradientStart, gradientEnd] = getSkyGradient(weatherCode, isDay);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          background: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-3xl"
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
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/10 blur-3xl"
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
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-white/5 blur-3xl"
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
