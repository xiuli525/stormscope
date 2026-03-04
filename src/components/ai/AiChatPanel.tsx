import { useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Trash2,
  Sparkles,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAiStore } from "@/stores/ai";
import { streamChat } from "@/services/ai";
import type { AiMessage as AiMessageType } from "@/services/ai";
import { buildSystemPrompt } from "@/utils/ai-prompt";
import { useWeather } from "@/hooks/useWeather";
import { useAirQuality } from "@/hooks/useAirQuality";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/useSpeech";
import { AiMessage } from "./AiMessage";
import { AiQuickActions } from "./AiQuickActions";

export function AiChatPanel() {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const {
    apiKey,
    messages,
    isStreaming,
    isOpen,
    setOpen,
    addMessage,
    appendToLastMessage,
    setStreaming,
    clearMessages,
  } = useAiStore();

  const currentCity = useFavoritesStore((s) => s.currentCity);
  const language = useSettingsStore((s) => s.language);
  const lat = currentCity?.latitude ?? 39.9;
  const lon = currentCity?.longitude ?? 116.4;
  const cityName = currentCity?.name ?? "Beijing";
  const { data: weather } = useWeather(lat, lon);
  const { data: airQuality } = useAirQuality(lat, lon);

  const speechLang = language === "zh" ? "zh-CN" : "en-US";
  const {
    isListening,
    transcript,
    isSupported: micSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition(speechLang);
  const {
    isSpeaking,
    isSupported: ttsSupported,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript && !isListening) {
      if (inputRef.current) {
        inputRef.current.value = transcript;
      }
      sendMessage(transcript);
    }
  }, [transcript, isListening]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: AiMessageType = { role: "user", content: text.trim() };
      addMessage(userMsg);

      const systemPrompt = buildSystemPrompt(
        cityName,
        weather ?? null,
        airQuality ?? null,
        language,
      );

      const allMessages: AiMessageType[] = [
        { role: "system", content: systemPrompt },
        ...messages,
        userMsg,
      ];

      addMessage({ role: "assistant", content: "" });
      setStreaming(true);
      scrollToBottom();

      abortRef.current = new AbortController();

      await streamChat(
        allMessages,
        apiKey,
        (chunk) => {
          appendToLastMessage(chunk);
          scrollToBottom();
        },
        () => {
          setStreaming(false);
          scrollToBottom();
        },
        (error) => {
          appendToLastMessage(`\n\n❌ ${error}`);
          setStreaming(false);
          scrollToBottom();
        },
        abortRef.current.signal,
      );
    },
    [
      isStreaming,
      apiKey,
      cityName,
      weather,
      airQuality,
      language,
      messages,
      addMessage,
      appendToLastMessage,
      setStreaming,
      scrollToBottom,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = inputRef.current?.value ?? "";
      if (value.trim()) {
        sendMessage(value);
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  };

  const handleSend = () => {
    const value = inputRef.current?.value ?? "";
    if (value.trim()) {
      sendMessage(value);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  if (!isOpen) return null;

  const hasApiKey = apiKey.length > 0;
  const hasMessages = messages.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-24 right-6 z-50 w-[420px] h-[600px] max-h-[80vh]
          flex flex-col rounded-2xl overflow-hidden
          bg-[var(--overlay-bg)] border border-[var(--overlay-border)]
          shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--component-border)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-sm text-[var(--text-primary)]">
              {t("ai.title", "AI 天气助手")}
            </span>
            {currentCity && (
              <span className="text-xs text-[var(--text-tertiary)] ml-1">
                · {cityName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {hasMessages && (
              <button
                onClick={clearMessages}
                className="p-1.5 rounded-lg hover:bg-[var(--component-bg-hover)] text-[var(--text-tertiary)] transition-colors"
                title={t("ai.clear", "清空对话")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {ttsSupported && hasMessages && (
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const lastAssistant = [...messages]
                      .reverse()
                      .find((m) => m.role === "assistant");
                    if (lastAssistant?.content)
                      speak(lastAssistant.content, speechLang);
                  }
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeaking
                    ? "bg-primary-500/20 text-primary-400 hover:bg-primary-500/30"
                    : "hover:bg-[var(--component-bg-hover)] text-[var(--text-tertiary)]"
                }`}
                title={
                  isSpeaking ? t("ai.stopSpeaking") : t("ai.speakResponse")
                }
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[var(--component-bg-hover)] text-[var(--text-tertiary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!hasApiKey ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <Settings className="w-10 h-10 text-[var(--text-tertiary)]" />
              <p className="text-sm text-[var(--text-secondary)]">
                {t("ai.noKey", "请先在设置页面配置豆包 API Key")}
              </p>
              <a
                href="/settings"
                className="text-xs text-primary-400 hover:text-primary-300 underline"
              >
                {t("ai.goSettings", "前往设置")}
              </a>
            </div>
          ) : !hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
              <Sparkles className="w-12 h-12 text-primary-400 opacity-50" />
              <p className="text-sm text-[var(--text-secondary)] text-center">
                {t(
                  "ai.welcome",
                  "你好！我是 AI 天气助手，可以为你解读天气数据、提供穿衣和出行建议。试试下面的快捷问题吧 👇",
                )}
              </p>
              <AiQuickActions
                onSelect={handleQuickAction}
                disabled={isStreaming}
              />
            </div>
          ) : (
            <div className="py-2">
              {messages.map((msg, i) => (
                <AiMessage
                  key={i}
                  role={msg.role as "user" | "assistant"}
                  content={msg.content}
                  isStreaming={
                    isStreaming &&
                    i === messages.length - 1 &&
                    msg.role === "assistant"
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {hasApiKey && hasMessages && !isStreaming && (
          <AiQuickActions onSelect={handleQuickAction} disabled={isStreaming} />
        )}

        {hasApiKey && (
          <div className="px-4 py-3 border-t border-[var(--component-border)]">
            {isListening && (
              <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {t("ai.listening")}
              </div>
            )}
            <div className="flex items-end gap-2">
              {micSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isStreaming}
                  className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                    isListening
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-[var(--component-bg)] text-[var(--text-tertiary)] hover:bg-[var(--component-bg-hover)]"
                  }`}
                  title={
                    isListening ? t("ai.stopListening") : t("ai.startListening")
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
              <textarea
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder={t("ai.placeholder", "输入你的天气问题...")}
                disabled={isStreaming}
                rows={1}
                className="flex-1 resize-none bg-[var(--component-bg)] border border-[var(--component-border)]
                  rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500
                  disabled:opacity-50 max-h-24 overflow-y-auto"
              />
              {isStreaming ? (
                <button
                  onClick={handleStop}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
