import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../context/ChatContext";
import { Button } from "@/components/ui/button";

export function ChatHeader({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { chats, activeChatId, startNewChat, isLoadingChats } = useChat();
  const { t } = useTranslation();
  const chat = chats.find((item) => item.id === activeChatId) || null;

  return (
    <div className="h-12 border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={onOpenSidebar}
          title={t("chat.openChats")}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">{t("chat.openChats")}</span>
        </Button>
        <div className="truncate text-sm font-semibold tracking-tight">{chat?.name ?? t("chat.noChat")}</div>
      </div>
      <Button
        variant="outline"
        className="lg:hidden"
        onClick={startNewChat}
        title={t("chat.startNewChat")}
        disabled={isLoadingChats}
      >
        {t("chat.newChat")}
      </Button>
    </div>
  );
}
