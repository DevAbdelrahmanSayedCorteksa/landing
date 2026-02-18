import { GeneratedTemplatePreview } from "./workspace";

// ── Builder State Machine ──

export type BuilderState =
  | "idle"
  | "thinking"
  | "analyzing"
  | "plan_review"
  | "building"
  | "completed"
  | "error";

export interface TemplatePlanObject {
  name: string;
  description: string;
}

export interface TemplatePlanResult {
  template_name: string;
  category: string;
  description?: string;
  objects: TemplatePlanObject[];
}

export interface TemplateTask {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed";
}

// ── Chat Types ──

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
  sessionId: string | null;
  isConnected: boolean;
  builderState: BuilderState;
  phaseMessage: string;
  tasks: TemplateTask[];
  planResult: TemplatePlanResult | null;
  streamingContent: string;
  savedTemplateSlug: string | null;
  templateName: string;
  category: string;
}

// ── WebSocket Events (client → server) ──

export type WebSocketEvent =
  | { type: "template:send"; payload: { message: string; sessionId?: string } }
  | { type: "template:confirm"; payload: { sessionId: string; plan: TemplatePlanResult } }
  | { type: "template:save"; payload: { sessionId: string; templateName?: string; category?: string } }
  | { type: "template:history"; payload: { sessionId: string } };

// ── Server → Client Event Payloads ──

export interface ThinkingResponse {
  sessionId?: string;
}

export interface TemplatePlanEvent {
  sessionId: string;
  plan: TemplatePlanResult;
  message: string;
}

export interface TemplatePhaseEvent {
  sessionId?: string;
  phase: "analyzing" | "building";
  message: string;
  tasks?: TemplateTask[];
}

export interface TemplateTaskUpdateEvent {
  sessionId?: string;
  taskId: string;
  status: TemplateTask["status"];
}

export interface TokenResponse {
  sessionId?: string;
  delta: string;
}

export interface MessageResponse {
  sessionId: string;
  message: string;
}

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
  code: string;
  sessionId?: string;
  retryAfter?: number;
}

export interface TemplateHistoryResponse {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    template?: GeneratedTemplatePreview;
    created_at: string;
  }>;
  pendingPlan?: TemplatePlanResult;
}
