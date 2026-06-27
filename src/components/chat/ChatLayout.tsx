import { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ChatLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-full flex min-h-0">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
        <ChatHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <MessageList />
        <Composer />
      </div>

      <Dialog open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <DialogContent className="left-0 top-0 h-screen w-[88vw] max-w-[340px] translate-x-0 translate-y-0 rounded-none border-r border-l-0 border-t-0 border-b-0 py-10 px-1 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
          <Sidebar
            className="flex h-full w-full flex-col border-r-0 bg-card/95 md:hidden"
            onChatSelected={() => setMobileSidebarOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
