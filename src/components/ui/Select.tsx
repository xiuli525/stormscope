import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "value"
  > {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--text-tertiary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none bg-[var(--surface-secondary)] border border-[var(--component-border)] rounded-button px-3 py-2 pr-10",
            "text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow",
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  );
}
