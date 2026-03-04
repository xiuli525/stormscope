import { cn } from "@/utils/cn";

interface AiMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function AiMessage({ role, content, isStreaming }: AiMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 px-4 py-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          isUser
            ? "bg-primary-500 text-white"
            : "bg-[var(--component-bg)] text-[var(--text-secondary)] border border-[var(--component-border)]",
        )}
      >
        {isUser ? "You" : "AI"}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary-500 text-white rounded-br-md"
            : "bg-[var(--component-bg)] text-[var(--text-primary)] border border-[var(--component-border)] rounded-bl-md",
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}
