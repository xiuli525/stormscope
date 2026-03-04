import { useTranslation } from "react-i18next";
import { quickActions } from "@/utils/ai-prompt";

interface AiQuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function AiQuickActions({ onSelect, disabled }: AiQuickActionsProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "zh" ? "zh" : "en";
  const actions = quickActions[lang];

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs rounded-full
            bg-[var(--component-bg)] border border-[var(--component-border)]
            text-[var(--text-secondary)] hover:bg-[var(--component-bg-hover)]
            hover:text-[var(--text-primary)] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
