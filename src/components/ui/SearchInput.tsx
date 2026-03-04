import { Search, X, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
  loading = false,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "group flex items-center w-full glass-subtle rounded-full px-4 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-300",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 text-[var(--text-muted)] animate-spin shrink-0" />
      ) : (
        <Search className="w-4 h-4 mr-2 text-[var(--text-muted)] shrink-0" />
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none placeholder-[var(--text-muted)] text-[var(--text-primary)] min-w-0"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="ml-2 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors shrink-0" />
        </button>
      )}
    </div>
  );
}
