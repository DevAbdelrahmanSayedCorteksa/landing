"use client";

import { createContext, useContext } from "react";
import { useAITemplateChat } from "@/lib/hooks/useAITemplateChat";

type AITemplateChatContextType = ReturnType<typeof useAITemplateChat>;

const AITemplateChatContext = createContext<AITemplateChatContextType | null>(null);

export function AITemplateChatProvider({ children }: { children: React.ReactNode }) {
  const chatState = useAITemplateChat();
  return (
    <AITemplateChatContext.Provider value={chatState}>
      {children}
    </AITemplateChatContext.Provider>
  );
}

export function useAITemplateChatContext() {
  const context = useContext(AITemplateChatContext);
  if (!context) {
    throw new Error("useAITemplateChatContext must be used within AITemplateChatProvider");
  }
  return context;
}
