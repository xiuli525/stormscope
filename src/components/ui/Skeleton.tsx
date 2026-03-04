import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-[var(--skeleton-bg)]";

  const variants = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-card",
  };

  return <div className={cn(baseStyles, variants[variant], className)} />;
}
