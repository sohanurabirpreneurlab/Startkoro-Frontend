import { Loader2, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type PromptMode =
  | { kind: "createChat" }
  | { kind: "renameChat"; chatId: string; currentName: string }
  | null;

type DeleteDialogState = {
  chatId: string;
  chatName: string;
} | null;

export function Sidebar({
  className,
  onChatSelected,
}: {
  className?: string;
  onChatSelected?: () => void;
}) {
  const { chats, activeChatId, setActiveChat, startNewChat, renameChat, deleteChat, isLoadingChats } = useChat();
  const [prompt, setPrompt] = useState<PromptMode>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openPrompt(next: PromptMode) {
    setPrompt(next);
    if (!next) return;
    if (next.kind === "renameChat") setName(next.currentName);
    else setName("");
  }

  function openDeleteDialog(chatId: string, chatName: string) {
    setDeleteDialog({ chatId, chatName });
  }

  async function submitPrompt() {
    if (!prompt) return;
    setIsSubmitting(true);

    try {
      if (prompt.kind === "createChat") {
        startNewChat();
      }

      if (prompt.kind === "renameChat") {
        await renameChat(prompt.chatId, name);
      }

      openPrompt(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitDelete() {
    if (!deleteDialog) return;
    setIsSubmitting(true);

    try {
      await deleteChat(deleteDialog.chatId);
      setDeleteDialog(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <aside
      className={cn(
        "w-[320px] border-r bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 hidden md:flex md:flex-col",
        className,
      )}
    >
      <div className="h-12 border-b px-3 flex items-center justify-between">
        <div className="text-sm font-semibold tracking-tight">Chats</div>
        <Button
          variant="secondary"
          onClick={() => {
            startNewChat();
            onChatSelected?.();
          }}
          disabled={isLoadingChats}
        >
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-2 space-y-1">
        {isLoadingChats ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading chats...
          </div>
        ) : null}

        {!isLoadingChats && chats.length === 0 ? (
          <div className="rounded-lg border bg-background/30 px-3 py-4 text-sm text-muted-foreground">
            No chats yet. Send your first message to create one.
          </div>
        ) : null}

        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;

          return (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg border px-2 py-2 transition-colors",
                isActive ? "bg-accent ring-1 ring-primary/20" : "bg-background/30 hover:bg-background/40",
              )}
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => {
                  void setActiveChat(chat.id);
                  onChatSelected?.();
                }}
                title={chat.name}
                disabled={isLoadingChats}
              >
                <div className="truncate text-sm tracking-tight">{chat.name}</div>
              </button>

              <ChatMenu
                onRename={() => openPrompt({ kind: "renameChat", chatId: chat.id, currentName: chat.name })}
                onDelete={() => openDeleteDialog(chat.id, chat.name)}
                disabled={isLoadingChats || isSubmitting}
              />
            </div>
          );
        })}
      </div>

      <Dialog open={Boolean(prompt)} onOpenChange={(open) => !open && openPrompt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{promptTitle(prompt)}</DialogTitle>
            <DialogDescription>
              Keep chat names short and clear. You can change them later.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void submitPrompt();
              }
            }}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => openPrompt(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={() => void submitPrompt()} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteDialog)} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat</DialogTitle>
            <DialogDescription>
              {deleteDialog
                ? `Delete "${deleteDialog.chatName}" permanently? This will remove the chat and all of its messages.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void submitDelete()} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}

function promptTitle(prompt: PromptMode) {
  if (!prompt) return "";
  if (prompt.kind === "createChat") return "Create chat";
  if (prompt.kind === "renameChat") return "Rename chat";
  return "";
}

function ChatMenu({
  onRename,
  onDelete,
  disabled,
}: {
  onRename: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Chat actions" disabled={disabled}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Chat menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onRename()}>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => onDelete()}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
