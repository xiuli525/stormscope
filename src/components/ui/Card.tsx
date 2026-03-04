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
      "bg-[var(--surface-primary)] shadow-[var(--shadow-card)] rounded-card border border-[var(--glass-border-default)]",
    glass:
      "glass-secondary rounded-card shadow-[var(--shadow-glass)] border border-[var(--glass-border-default)]",
    "glass-hero":
      "glass-hero rounded-card shadow-[var(--shadow-glass)] border border-[var(--glass-border-strong)]",
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
