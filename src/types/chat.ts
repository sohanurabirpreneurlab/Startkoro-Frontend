export type MessageRole = "user" | "ai";

export type FileAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string; // only for images (object URL)
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  attachments?: FileAttachment[];
};

export type ChatThread = {
  id: string;
  name: string;
  messages: ChatMessage[];
};
