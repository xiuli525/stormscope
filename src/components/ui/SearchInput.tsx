import { Search, X, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className,
  loading = false,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "group flex items-center w-full rounded-full px-4 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-300",
        "bg-[var(--search-input-bg)] backdrop-blur-xl border border-[var(--search-input-border)]",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 text-[var(--search-input-placeholder)] animate-spin shrink-0" />
      ) : (
        <Search className="w-4 h-4 mr-2 text-[var(--search-input-placeholder)] shrink-0" />
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none placeholder-[var(--search-input-placeholder)] text-[var(--text-primary)] min-w-0"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="ml-2 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-[var(--search-input-placeholder)] hover:text-[var(--text-primary)] transition-colors shrink-0" />
        </button>
      )}
    </div>
  );
}
