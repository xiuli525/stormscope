import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AiMessage } from "@/services/ai";

interface AiStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  messages: AiMessage[];
  isStreaming: boolean;
  isOpen: boolean;
  addMessage: (message: AiMessage) => void;
  appendToLastMessage: (text: string) => void;
  setStreaming: (streaming: boolean) => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  clearMessages: () => void;
}

export const useAiStore = create<AiStore>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key) => set({ apiKey: key }),
      messages: [],
      isStreaming: false,
      isOpen: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      appendToLastMessage: (text) =>
        set((state) => {
          const msgs = [...state.messages];
          const last = msgs[msgs.length - 1];
          if (last && last.role === "assistant") {
            msgs[msgs.length - 1] = { ...last, content: last.content + text };
          }
          return { messages: msgs };
        }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      setOpen: (open) => set({ isOpen: open }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "stormscope-ai",
      partialize: (state) => ({ apiKey: state.apiKey }),
    },
  ),
);
