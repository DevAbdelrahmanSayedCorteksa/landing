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
  ThinkingResponse,
  TokenResponse,
  TemplatePlanEvent,
  TemplatePhaseEvent,
  TemplateTaskUpdateEvent,
} from "@/lib/types/aiChat";

export function useAITemplateChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    sessionId: null,
    isConnected: false,
    builderState: "idle",
    phaseMessage: "",
    tasks: [],
    planResult: null,
    streamingContent: "",
    savedTemplateSlug: null,
    templateName: "",
    category: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Throttled streaming buffer ──
  // Tokens arrive rapidly. Accumulate in ref, flush to state on animation frame.
  const streamBufferRef = useRef("");
  const rafIdRef = useRef<number | null>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushStreamBuffer = useCallback(() => {
    rafIdRef.current = null;
    const buffered = streamBufferRef.current;
    if (buffered) {
      setState((prev) => ({
        ...prev,
        streamingContent: buffered,
      }));
    }
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.builderState, state.tasks, scrollToBottom]);

  // Connect to WebSocket on mount
  useEffect(() => {
    const socket = wsService.connect();

    const handleConnect = () => {
      setState((prev) => ({ ...prev, isConnected: true }));
    };

    const handleDisconnect = () => {
      setState((prev) => ({ ...prev, isConnected: false }));
      toast.error("Connection lost. Reconnecting...");
    };

    // ── template:thinking — AI starts processing ──
    const handleThinking = (data: ThinkingResponse) => {
      streamBufferRef.current = "";
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (analyzeTimerRef.current) {
        clearTimeout(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }
      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId || prev.sessionId,
        builderState: "thinking",
        phaseMessage: "",
        tasks: [],
        planResult: null,
        streamingContent: "",
      }));
    };

    // ── template:plan — plan ready: add message, brief analyzing, then plan review ──
    const handlePlan = (data: TemplatePlanEvent) => {
      if (analyzeTimerRef.current) {
        clearTimeout(analyzeTimerRef.current);
        analyzeTimerRef.current = null;
      }

      // Add the plan message as a chat message
      const planMessage: ChatMessage = {
        id: `ai-plan-${Date.now()}`,
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };

      // Step 1: Add message + show "Analyzing" animation
      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId || prev.sessionId,
        builderState: "analyzing",
        phaseMessage: data.message,
        planResult: data.plan,
        messages: [...prev.messages, planMessage],
      }));

      // Step 2: Brief animation, then transition to plan review
      analyzeTimerRef.current = setTimeout(() => {
        analyzeTimerRef.current = null;
        setState((prev) => {
          if (prev.builderState !== "analyzing") return prev;
          return { ...prev, builderState: "plan_review" };
        });
      }, 2500);
    };

    // ── template:phase — phase update (analyzing or building) ──
    const handlePhase = (data: TemplatePhaseEvent) => {
      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId || prev.sessionId,
        builderState: data.phase === "building" ? "building" : "analyzing",
        phaseMessage: data.message,
        tasks: data.tasks || prev.tasks,
      }));
    };

    // ── template:task_update — update individual task status ──
    const handleTaskUpdate = (data: TemplateTaskUpdateEvent) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === data.taskId ? { ...t, status: data.status } : t
        ),
      }));
    };

    // ── template:token — accumulate in ref, flush on animation frame ──
    const handleToken = (data: TokenResponse) => {
      streamBufferRef.current += data.delta;
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(flushStreamBuffer);
      }
    };

    // ── template:message — AI replied with text ──
    const handleMessage = (data: MessageResponse) => {
      streamBufferRef.current = "";
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        sessionId: data.sessionId,
        builderState: "idle",
        phaseMessage: "",
        tasks: [],
        planResult: null,
        streamingContent: "",
        messages: [...prev.messages, aiMessage],
      }));
    };

    // ── template:result — schema generated ──
    const handleResult = (data: ResultResponse) => {
      streamBufferRef.current = "";
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

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
        sessionId: data.sessionId,
        templateName: data.templateName,
        category: data.category,
        builderState: "completed",
        phaseMessage: "",
        streamingContent: "",
        // Mark all tasks as completed for a clean finish
        tasks: prev.tasks.map((t) => ({ ...t, status: "completed" as const })),
        messages: [...prev.messages, aiMessage],
      }));
    };

    // ── template:saved ──
    const handleSaved = (data: TemplateSavedResponse) => {
      setState((prev) => ({
        ...prev,
        savedTemplateSlug: data.slug,
      }));
      toast.success(data.message || "Template saved successfully!");
    };

    // ── template:error ──
    const handleError = (data: TemplateErrorResponse) => {
      streamBufferRef.current = "";
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "error",
        content: data.message || "Something went wrong. Please try again.",
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        builderState: "error",
        phaseMessage: "",
        tasks: [],
        planResult: null,
        streamingContent: "",
        messages: [...prev.messages, errorMessage],
      }));
    };

    // Subscribe to events
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("template:thinking", handleThinking);
    socket.on("template:plan", handlePlan);
    socket.on("template:phase", handlePhase);
    socket.on("template:task_update", handleTaskUpdate);
    socket.on("template:token", handleToken);
    socket.on("template:message", handleMessage);
    socket.on("template:result", handleResult);
    socket.on("template:saved", handleSaved);
    socket.on("template:error", handleError);

    if (socket.connected) {
      setState((prev) => ({ ...prev, isConnected: true }));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("template:thinking", handleThinking);
      socket.off("template:plan", handlePlan);
      socket.off("template:phase", handlePhase);
      socket.off("template:task_update", handleTaskUpdate);
      socket.off("template:token", handleToken);
      socket.off("template:message", handleMessage);
      socket.off("template:result", handleResult);
      socket.off("template:saved", handleSaved);
      socket.off("template:error", handleError);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
      wsService.disconnect();
    };
  }, [flushStreamBuffer]);

  // Send message
  const sendMessage = useCallback(
    (message: string, options?: { plan?: boolean }) => {
      if (!message.trim()) {
        toast.error("Message cannot be empty");
        return;
      }

      if (!state.isConnected) {
        toast.error("Not connected. Please wait...");
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        created_at: new Date().toISOString(),
      };

      streamBufferRef.current = "";
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        builderState: "thinking",
        phaseMessage: "",
        tasks: [],
        planResult: null,
        streamingContent: "",
      }));

      wsService.emit("template:send", {
        message: message,
        sessionId: state.sessionId || undefined,
        plan: options?.plan || false,
      });
    },
    [state.isConnected, state.sessionId]
  );

  // Confirm plan — sends the plan back to server, triggers building phase
  const confirmPlan = useCallback(() => {
    if (!state.sessionId) {
      toast.error("No active session");
      return;
    }

    if (!state.planResult) {
      toast.error("No plan to confirm");
      return;
    }

    wsService.emit("template:confirm", {
      sessionId: state.sessionId,
      plan: state.planResult,
    });

    // Optimistically move to thinking while server processes
    setState((prev) => ({
      ...prev,
      builderState: "thinking",
      phaseMessage: "",
    }));
  }, [state.sessionId, state.planResult]);

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
    builderState: state.builderState,
    phaseMessage: state.phaseMessage,
    tasks: state.tasks,
    planResult: state.planResult,
    streamingContent: state.streamingContent,
    isProcessing: !["idle", "completed", "error", "plan_review"].includes(state.builderState),
    sessionId: state.sessionId,
    currentTemplate,
    savedTemplateSlug: state.savedTemplateSlug,
    templateName: state.templateName,
    category: state.category,
    sendMessage,
    confirmPlan,
    saveTemplate,
    messagesEndRef,
  };
}
