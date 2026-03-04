import React from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "glass-hero";
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = "default",
  hoverable = false,
  onClick,
}: CardProps) {
  const baseStyles = "p-6 transition-all duration-300";

  const variants = {
    default:
      "bg-[var(--surface-primary)] shadow-card rounded-card border border-neutral-200 dark:border-neutral-800",
    glass: "glass-secondary rounded-card shadow-glass border border-white/10",
    "glass-hero": "glass-hero rounded-card shadow-glass border border-white/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        hoverable &&
          "hover:shadow-card-hover hover:scale-[1.01] cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
