import { useState } from "react";
import { motion } from "framer-motion";
import { getMeteoconUrl, getWmoDescription } from "@/utils/wmo-codes";
import { cn } from "@/utils/cn";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WeatherIcon({
  code,
  isDay = true,
  size = "md",
  className,
}: WeatherIconProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const pxSize = sizeMap[size];
  const url = getMeteoconUrl(code, isDay);
  const description = getWmoDescription(code);

  return (
    <motion.img
      src={url}
      alt={description}
      width={pxSize}
      height={pxSize}
      loading="lazy"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      onLoad={() => setIsLoaded(true)}
      className={cn("object-contain select-none", className)}
      style={{ width: pxSize, height: pxSize }}
    />
  );
}
