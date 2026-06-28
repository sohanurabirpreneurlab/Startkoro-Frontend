import { FileText, Image as ImageIcon } from "lucide-react";
import type { ChatMessage } from "../../types/chat";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isPendingAssistant = message.role === "ai" && message.pending;
  const bubbleBase =
    "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-[0_1px_0_rgba(0,0,0,0.04)]";
  const bubbleClasses = cn(
    bubbleBase,
    isUser
      ? "ml-auto bg-primary text-primary-foreground border-transparent"
      : isPendingAssistant
        ? "bg-card/80 border-emerald-200/80"
        : "bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55",
  );

  return (
    <div>
      <div className={bubbleClasses}>
        {isPendingAssistant ? (
          <div className="flex items-center gap-2 text-slate-700">
            <span>{message.content}</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
            </span>
          </div>
        ) : (
          message.content
        )}

        {message.attachments && message.attachments.length ? (
          <div className={cn("mt-3 grid gap-2", isUser ? "text-primary-foreground/90" : "")}>
            {message.attachments.map((a) => {
              const isImage = a.type.startsWith("image/");
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-lg border px-3 py-2 flex items-center gap-2",
                    isUser ? "border-white/20 bg-white/10" : "bg-background/50",
                  )}
                >
                  {isImage ? (
                    <ImageIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium">{a.name}</div>
                    <div className={cn("text-[11px] opacity-80")}>{formatBytes(a.size)}</div>
                  </div>
                  {isImage && a.previewUrl ? (
                    <img
                      src={a.previewUrl}
                      alt={a.name}
                      className="ml-auto h-10 w-10 rounded-md object-cover border"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className={cn("mt-1 text-[11px] text-muted-foreground", isUser ? "text-right" : "")}>
        {message.pending
          ? "..."
          : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
