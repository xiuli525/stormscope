import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-badge transition-colors";

  const variants = {
    default: "bg-[var(--component-bg)] text-[var(--text-secondary)]",
    success: "bg-success/15 text-success border border-success/10",
    warning: "bg-warning/15 text-warning border border-warning/10",
    danger: "bg-danger/15 text-danger border border-danger/10",
    info: "bg-info/15 text-info border border-info/10",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
