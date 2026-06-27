import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../context/ChatContext";
import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  const { activeChatId, activeMessages, isLoadingMessages } = useChat();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => activeMessages, [activeMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="relative flex-1 min-h-0 overflow-auto bg-background scroll-smooth">
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4 relative">
        {!activeChatId && !isLoadingMessages ? (
          <div className="rounded-xl border bg-card/70 backdrop-blur p-5 text-sm text-muted-foreground">
            {t("chat.noSelected")}
          </div>
        ) : null}

        {isLoadingMessages ? (
          <div className="flex items-center gap-2 rounded-xl border bg-card/70 backdrop-blur p-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("chat.loadingHistory")}
          </div>
        ) : null}

        {activeChatId && !isLoadingMessages && messages.length === 0 ? (
          <div className="rounded-xl border bg-card/70 backdrop-blur p-5 text-sm text-muted-foreground">
            {t("chat.emptyMessages")}
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              layout="position"
            >
              <MessageBubble message={m} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
