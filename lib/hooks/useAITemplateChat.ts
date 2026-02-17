"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { wsService } from "@/lib/services/WebSocketService";
import {
  ChatState,
  ChatMessage,
  MessageResponse,
  ResultResponse,
  TemplateSavedResponse,
  TemplateErrorResponse,
} from "@/lib/types/aiChat";

export function useAITemplateChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    sessionId: null,
    isConnected: false,
    isTyping: false,
    savedTemplateSlug: null,
    templateName: "",
    category: "",
  });

  const [previewBuildComplete, setPreviewBuildComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  // Connect to WebSocket on mount
  useEffect(() => {
    const socket = wsService.connect();

    // Connection event handlers
    const handleConnect = () => {
      setState((prev) => ({ ...prev, isConnected: true }));
      console.log("[Chat] WebSocket connected");
    };

    const handleDisconnect = () => {
      setState((prev) => ({ ...prev, isConnected: false }));
      toast.error("Connection lost. Reconnecting...");
      console.log("[Chat] WebSocket disconnected");
    };

    // Chat reply handler (AI asking for more info)
    const handleMessage = (data: MessageResponse) => {
      console.log("[Chat] Received message (full):", JSON.stringify(data, null, 2));

      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId,
        isTyping: false,
      }));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));
    };

    // Schema result handler (AI generated/refined schema)
    const handleResult = (data: ResultResponse) => {
      console.log("[Chat] Received result (full):", JSON.stringify(data, null, 2));

      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId,
        templateName: data.templateName,
        category: data.category,
        isTyping: false,
      }));

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `Generated template: ${data.templateName}`,
        templateName: data.templateName,
        category: data.category,
        template: {
          template_name: data.templateName,
          category: data.category,
          schema: {
            ...data.schema,
            relations: data.schema.relations || [],
          },
        },
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));
    };

    // Template saved handler
    const handleSaved = (data: TemplateSavedResponse) => {
      console.log("[Chat] Template saved:", data);

      setState((prev) => ({
        ...prev,
        savedTemplateSlug: data.slug,
      }));

      toast.success(data.message || "Template saved successfully!");
    };

    // Error handler — add error message to chat so user sees it inline
    const handleError = (data: TemplateErrorResponse) => {
      console.error("[Chat] Error:", data);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "error",
        content: data.message || "Something went wrong. Please try again.",
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        isTyping: false,
        messages: [...prev.messages, errorMessage],
      }));
    };

    // Subscribe to events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("template:message", handleMessage);
    socket.on("template:result", handleResult);
    socket.on("template:saved", handleSaved);
    socket.on("template:error", handleError);

    // Set initial connection state
    if (socket.connected) {
      setState((prev) => ({ ...prev, isConnected: true }));
    }

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("template:message", handleMessage);
      socket.off("template:result", handleResult);
      socket.off("template:saved", handleSaved);
      socket.off("template:error", handleError);
      wsService.disconnect();
    };
  }, []);

  // Send message (initial generation or refinement)
  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) {
        toast.error("Message cannot be empty");
        return;
      }

      if (!state.isConnected) {
        toast.error("Not connected. Please wait...");
        return;
      }

      // Add user message to chat immediately (optimistic UI)
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isTyping: true,
      }));

      // Reset preview build state for new cycle
      setPreviewBuildComplete(false);

      // Always emit template:send (backend determines mode)
      wsService.emit("template:send", {
        message: message,
        sessionId: state.sessionId || undefined,  // Include if available
      });
    },
    [state.isConnected, state.sessionId]
  );

  // Save template
  const saveTemplate = useCallback(
    (customName?: string) => {
      if (!state.sessionId) {
        toast.error("No active session");
        return;
      }

      const nameToSave = customName?.trim() || state.templateName;
      if (!nameToSave) {
        toast.error("Template name is required");
        return;
      }

      wsService.emit("template:save", {
        sessionId: state.sessionId,
        templateName: nameToSave,
        category: state.category,
      });
    },
    [state.sessionId, state.templateName, state.category]
  );

  // Get current template (latest message with template)
  const currentTemplate = state.messages
    .slice()
    .reverse()
    .find((msg) => msg.role === "assistant" && msg.template)?.template;

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    isTyping: state.isTyping,
    sessionId: state.sessionId,
    currentTemplate,
    savedTemplateSlug: state.savedTemplateSlug,
    templateName: state.templateName,
    category: state.category,
    previewBuildComplete,
    setPreviewBuildComplete,
    sendMessage,
    saveTemplate,
    messagesEndRef,
  };
}
