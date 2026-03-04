import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAiStore } from "@/stores/ai";

export function AiChatButton() {
  const { isOpen, toggleOpen } = useAiStore();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full
            bg-gradient-to-br from-primary-500 to-primary-600
            text-white shadow-lg shadow-primary-500/25
            hover:shadow-primary-500/40 hover:scale-105
            active:scale-95 transition-all duration-200 group md:bottom-6 md:right-6"
          aria-label="AI Weather Assistant"
        >
          <Sparkles className="w-6 h-6 relative z-10" />
          <span className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping" />
          <span
            className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-primary-400/30 to-primary-600/30
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
