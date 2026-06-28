import { Paperclip, SendHorizonal, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../context/ChatContext";
import type { FileAttachment } from "../../types/chat";
import { createId } from "../../utils/id";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/*",
].join(",");

export function Composer() {
  const { sendMessage, isLoadingChats, isSendingMessage } = useChat();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => {
    return !isLoadingChats && !isSendingMessage && text.trim().length > 0;
  }, [isLoadingChats, isSendingMessage, text]);

  function onPickFiles() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(selected: FileList | null) {
    if (!selected || selected.length === 0) return;

    const next: FileAttachment[] = Array.from(selected).map((f) => {
      const isImage = f.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(f) : undefined;
      return { id: createId("file"), name: f.name, type: f.type, size: f.size, previewUrl };
    });

    setFiles((prev) => [...prev, ...next]);
  }

  function removeAttachment(id: string) {
    setFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function onSend() {
    if (!canSend) return;
    const messageText = text.trim();

    await sendMessage(messageText, files);
    setText("");

    files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void onSend();
    }
  }

  return (
    <div className="border-t bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {files.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs"
              >
                <span className="max-w-[220px] truncate">{f.name}</span>
                <button
                  type="button"
                  className="rounded-full hover:bg-accent p-1"
                  onClick={() => removeAttachment(f.id)}
                  aria-label={t("chat.removeAttachment", { name: f.name })}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={ACCEPT}
            onChange={(e) => onFilesSelected(e.target.files)}
          />

          {/* <Button
            variant="outline"
            size="icon"
            onClick={onPickFiles}
            title={t("chat.uploadFiles")}
            disabled={isLoadingChats || isSendingMessage}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">{t("chat.attachFiles")}</span>
          </Button> */}

          <div className="flex-1">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("chat.placeholder")}
              rows={1}
              className={cn("max-h-40")}
            />
          </div>

          <Button onClick={() => void onSend()} disabled={!canSend}>
            <SendHorizonal className="h-4 w-4 mr-2" />
            {isSendingMessage ? t("chat.sending") : t("chat.send")}
          </Button>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          {t("chat.tip")} <span className="font-mono">{t("chat.shift")}</span>+
          <span className="font-mono">{t("chat.enter")}</span> {t("chat.newLine")}
        </div>
      </div>
    </div>
  );
}
