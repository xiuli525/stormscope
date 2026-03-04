import { cn } from "../../utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 p-0.5",
          checked ? "bg-primary-500" : "bg-[var(--component-bg)]",
        )}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <span
          className={cn(
            "block w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
      {label && (
        <span
          className="text-sm font-medium text-[var(--text-secondary)] cursor-pointer select-none"
          onClick={() => onChange(!checked)}
        >
          {label}
        </span>
      )}
    </div>
  );
}
