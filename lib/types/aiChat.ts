import { GeneratedTemplatePreview } from "./workspace";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  // For result messages
  templateName?: string;
  category?: string;
  template?: GeneratedTemplatePreview;
  created_at: string;
}

export interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;  // Changed from conversationId
  isConnected: boolean;
  isTyping: boolean;
  savedTemplateSlug: string | null;
  templateName: string;  // Track current template name
  category: string;  // Track current category
}

export type WebSocketEvent =
  | { type: "template:send"; payload: { message: string; sessionId?: string } }
  | { type: "template:save"; payload: { sessionId: string; templateName?: string; category?: string } }
  | { type: "template:history"; payload: { sessionId: string } };

// AI chat reply (asking for more info)
export interface MessageResponse {
  sessionId: string;
  message: string;
}

// AI generated/refined schema
export interface ResultResponse {
  sessionId: string;
  templateName: string;
  category: string;
  schema: {
    objects: any[];
    relations?: any[];
    sample_data?: Record<string, Array<Record<string, unknown>>>;
  };
}

export interface TemplateSavedResponse {
  slug: string;
  templateName: string;
  message?: string;
}

export interface TemplateErrorResponse {
  message: string;
  code?: string;
}

export interface TemplateHistoryResponse {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    template?: GeneratedTemplatePreview;
    created_at: string;
  }>;
}
