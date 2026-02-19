export type WorkspaceSetupMethod = "template" | "ai" | "skip";

export interface Template {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  is_default: boolean;
  is_active: boolean;
  usage_count: number;
}

export interface GenerateTemplatePayload {
  business_description: string;
  name?: string;
}

export interface SaveTemplatePayload {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  schema: any;
}

export interface GeneratedTemplatePreview {
  template_name: string;
  category: string;
  schema: {
    objects: any[];
    relations: any[];
    sample_data?: Record<string, Array<Record<string, unknown>>>;
  };
}

// Full template returned by GET /api/v1/user/object-templates/:slug
export interface TemplateWithSchema extends Template {
  schema: {
    objects: any[];
    relations?: any[];
    sample_data?: Record<string, Array<Record<string, unknown>>>;
  };
}

export interface WorkspaceCreationPayload {
  // Required
  workspace_name: string;
  pricing_plan_slug: string;

  // Paid plans only
  subdomain?: string;
  pricing_period?: string;

  // Template
  template_slug?: string;
}

export interface AITemplateConversation {
  conversation_id: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    template?: GeneratedTemplatePreview;
    created_at: string;
  }>;
  current_template?: GeneratedTemplatePreview;
}
