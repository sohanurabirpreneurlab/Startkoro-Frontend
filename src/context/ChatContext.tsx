import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { ChatMessage, ChatThread, FileAttachment } from "../types/chat";
import { readFromStorage, writeToStorage } from "../utils/storage";
import { io, type Socket } from "socket.io-client";

type ChatState = {
  chats: ChatThread[];
  activeChatId: string | null;
  activeMessages: ChatMessage[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  hasLoadedChats: boolean;
};

type ChatActions = {
  loadChats: () => Promise<void>;
  setActiveChat: (chatId: string | null) => Promise<void>;
  startNewChat: () => void;
  renameChat: (chatId: string, name: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  sendMessage: (text: string, attachments: FileAttachment[]) => Promise<void>;
  resetChatState: () => void;
};

type ChatContextValue = ChatState & ChatActions;

type BackendChat = {
  id: string;
  title: string | null;
};

type BackendMessage = {
  id: string;
  chat_id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
};

type ChatsApiResponse = {
  success: boolean;
  data: BackendChat[];
};

type MessagesApiResponse = {
  success: boolean;
  data: BackendMessage[];
};

type SendMessageApiResponse = {
  success: boolean;
  data: {
    chatId: string;
    userMessage: BackendMessage;
    assistantMessage: BackendMessage;
    retrievedChunks: unknown[];
  };
};

type ChatMessageSocketPayload = {
  chatId: string;
  chatTitle: string | null;
  userMessage: BackendMessage;
  assistantMessage: BackendMessage;
};

const ChatContext = createContext<ChatContextValue | null>(null);
const ACTIVE_CHAT_STORAGE_KEY = "startkoro.activeChatId.v1";
const TOKEN_STORAGE_KEY = "startkoro.authToken.v1";

function getSocketBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

function mapBackendChatToThread(chat: BackendChat): ChatThread {
  return {
    id: chat.id,
    name: chat.title?.trim() || "New chat",
    messages: [],
  };
}

function mapBackendMessageToChatMessage(message: BackendMessage): ChatMessage {
  return {
    id: message.id,
    role: message.sender === "assistant" ? "ai" : "user",
    content: message.content,
    timestamp: message.created_at ? new Date(message.created_at).getTime() : Date.now(),
  };
}

function buildChatTitleFromMessage(message: string): string {
  const normalized = message.replace(/\s+/g, " ").trim();
  const title = normalized.split(" ").slice(0, 6).join(" ");
  return title || "New chat";
}

function mergeUniqueMessages(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();

  return messages.filter((message) => {
    if (seen.has(message.id)) {
      return false;
    }

    seen.add(message.id);
    return true;
  });
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    chats: [],
    activeChatId: readFromStorage<string>(ACTIVE_CHAT_STORAGE_KEY),
    activeMessages: [],
    isLoadingChats: false,
    isLoadingMessages: false,
    isSendingMessage: false,
    hasLoadedChats: false,
  });
  const socketRef = useRef<Socket | null>(null);
  const hasLoadedChatsRef = useRef(false);
  const isLoadingChatsRef = useRef(false);

  useEffect(() => {
    hasLoadedChatsRef.current = state.hasLoadedChats;
    isLoadingChatsRef.current = state.isLoadingChats;
  }, [state.hasLoadedChats, state.isLoadingChats]);

  const fetchMessagesForChat = useCallback(async (chatId: string): Promise<ChatMessage[]> => {
    const response = await api.get<MessagesApiResponse>(`/chats/${chatId}/messages`);
    return response.data.data.map(mapBackendMessageToChatMessage);
  }, []);

  const setActiveChat = useCallback(async (chatId: string | null): Promise<void> => {
    if (!chatId) {
      writeToStorage(ACTIVE_CHAT_STORAGE_KEY, null);
      setState((prev) => ({
        ...prev,
        activeChatId: null,
        activeMessages: [],
        isLoadingMessages: false,
      }));
      return;
    }

    writeToStorage(ACTIVE_CHAT_STORAGE_KEY, chatId);
    setState((prev) => ({
      ...prev,
      activeChatId: chatId,
      activeMessages: [],
      isLoadingMessages: true,
    }));

    try {
      const messages = await fetchMessagesForChat(chatId);
      setState((prev) => ({
        ...prev,
        activeChatId: chatId,
        activeMessages: messages,
        isLoadingMessages: false,
      }));
    } catch (error) {
      writeToStorage(ACTIVE_CHAT_STORAGE_KEY, null);
      setState((prev) => ({
        ...prev,
        activeChatId: null,
        activeMessages: [],
        isLoadingMessages: false,
      }));
      throw error;
    }
  }, [fetchMessagesForChat]);

  const loadChats = useCallback(async (): Promise<void> => {
    if (hasLoadedChatsRef.current || isLoadingChatsRef.current) {
      return;
    }

    isLoadingChatsRef.current = true;

    setState((prev) => ({
      ...prev,
      isLoadingChats: true,
    }));

    try {
      const response = await api.get<ChatsApiResponse>("/chats");
      const chats = response.data.data.map(mapBackendChatToThread);
      const savedActiveChatId = readFromStorage<string>(ACTIVE_CHAT_STORAGE_KEY);
      const nextActiveChatId = chats.some((chat) => chat.id === savedActiveChatId) ? savedActiveChatId ?? null : null;

      setState((prev) => ({
        ...prev,
        chats,
        activeChatId: nextActiveChatId,
        activeMessages: nextActiveChatId && prev.activeChatId === nextActiveChatId ? prev.activeMessages : [],
        isLoadingChats: false,
        hasLoadedChats: true,
      }));
      hasLoadedChatsRef.current = true;
      isLoadingChatsRef.current = false;

      // We load messages only for the selected chat so the page stays fast even with many old chats.
      if (nextActiveChatId) {
        await setActiveChat(nextActiveChatId);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        chats: [],
        activeChatId: null,
        activeMessages: [],
        isLoadingChats: false,
        hasLoadedChats: true,
      }));
      hasLoadedChatsRef.current = true;
      isLoadingChatsRef.current = false;
      throw error;
    }
  }, [setActiveChat]);

  const startNewChat = useCallback((): void => {
    // A blank composer state lets the first real message create the chat on the backend.
    void setActiveChat(null);
  }, [setActiveChat]);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const token = readFromStorage<string>(TOKEN_STORAGE_KEY);

    if (!token) {
      return;
    }

    const socket = io(getSocketBaseUrl(), {
      auth: {
        token
      }
    });

    socket.on("chat:message-created", (payload: ChatMessageSocketPayload) => {
      const mappedUserMessage = mapBackendMessageToChatMessage(payload.userMessage);
      const mappedAssistantMessage = mapBackendMessageToChatMessage(payload.assistantMessage);

      setState((prev) => {
        const chatName = payload.chatTitle?.trim() || buildChatTitleFromMessage(payload.userMessage.content);
        const existingChat = prev.chats.find((chat) => chat.id === payload.chatId);
        const nextChats = existingChat
          ? [
              { ...existingChat, name: chatName },
              ...prev.chats.filter((chat) => chat.id !== payload.chatId),
            ]
          : [{ id: payload.chatId, name: chatName, messages: [] }, ...prev.chats];

        const nextMessages =
          prev.activeChatId === payload.chatId
            ? mergeUniqueMessages([...prev.activeMessages, mappedUserMessage, mappedAssistantMessage])
            : prev.activeMessages;

        return {
          ...prev,
          chats: nextChats,
          activeMessages: nextMessages,
        };
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const renameChat = useCallback(async (chatId: string, name: string): Promise<void> => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await api.patch(`/chats/${chatId}`, {
      title: trimmedName,
    });

    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) => (chat.id === chatId ? { ...chat, name: trimmedName } : chat)),
    }));
  }, []);

  const deleteChat = useCallback(async (chatId: string): Promise<void> => {
    await api.delete(`/chats/${chatId}`);

    setState((prev) => {
      const chats = prev.chats.filter((chat) => chat.id !== chatId);
      const activeChatId = prev.activeChatId === chatId ? null : prev.activeChatId;

      if (!activeChatId) {
        writeToStorage(ACTIVE_CHAT_STORAGE_KEY, null);
      }

      return {
        ...prev,
        chats,
        activeChatId,
        activeMessages: prev.activeChatId === chatId ? [] : prev.activeMessages,
      };
    });
  }, []);

  const sendMessage = useCallback(async (text: string, _attachments: FileAttachment[]): Promise<void> => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isSendingMessage: true,
    }));

    try {
      const response = await api.post<SendMessageApiResponse>("/chats/send-message", {
        chatId: state.activeChatId ?? undefined,
        message: trimmedText,
      });

      const { chatId, userMessage, assistantMessage } = response.data.data;
      const mappedUserMessage = mapBackendMessageToChatMessage(userMessage);
      const mappedAssistantMessage = mapBackendMessageToChatMessage(assistantMessage);
      const nextChatName = buildChatTitleFromMessage(trimmedText);

      setState((prev) => ({
        ...prev,
        activeChatId: chatId,
        chats: [
          {
            id: chatId,
            name: prev.chats.find((chat) => chat.id === chatId)?.name || nextChatName,
            messages: [],
          },
          ...prev.chats.filter((chat) => chat.id !== chatId),
        ],
        activeMessages: mergeUniqueMessages([
          ...prev.activeMessages,
          mappedUserMessage,
          mappedAssistantMessage,
        ]),
        isSendingMessage: false,
      }));

      writeToStorage(ACTIVE_CHAT_STORAGE_KEY, chatId);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSendingMessage: false,
      }));
      throw error;
    }
  }, [loadChats, state.activeChatId]);

  const resetChatState = useCallback((): void => {
    writeToStorage(ACTIVE_CHAT_STORAGE_KEY, null);
    hasLoadedChatsRef.current = false;
    isLoadingChatsRef.current = false;
    setState({
      chats: [],
      activeChatId: null,
      activeMessages: [],
      isLoadingChats: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      hasLoadedChats: false,
    });
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      ...state,
      loadChats,
      setActiveChat,
      startNewChat,
      renameChat,
      deleteChat,
      sendMessage,
      resetChatState,
    }),
    [deleteChat, loadChats, renameChat, resetChatState, sendMessage, setActiveChat, startNewChat, state],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
