import { $api } from "./apiClient";
import {
  Template,
  TemplateWithSchema,
  GenerateTemplatePayload,
  SaveTemplatePayload,
  GeneratedTemplatePreview
} from "@/lib/types/workspace";
import {
  API_OBJECT_TEMPLATES_ENDPOINT,
  API_OBJECT_TEMPLATE_BY_SLUG_ENDPOINT,
  API_TEMPLATE_GENERATE_ENDPOINT,
  API_TEMPLATE_SAVE_ENDPOINT,
} from "./apis";

export const TEMPLATES_KEY = "templates";

interface TemplatesResponse {
  status: number;
  message: string;
  data: Template[];
}

interface GenerateTemplateResponse {
  status: number;
  message: string;
  data: GeneratedTemplatePreview;
}

interface SaveTemplateResponse {
  status: number;
  message: string;
  data: Template;
}

interface TemplateDetailResponse {
  status: number;
  message: string;
  data: TemplateWithSchema;
}

export const templateService = {
  // GET /api/v1/user/object-templates — list all active templates
  getTemplates: async (): Promise<TemplatesResponse> => {
    return await $api.get<TemplatesResponse>(API_OBJECT_TEMPLATES_ENDPOINT);
  },

  // GET /api/v1/user/object-templates/:slug — get single template by slug
  getTemplateBySlug: async (slug: string): Promise<TemplateDetailResponse> => {
    return await $api.get<TemplateDetailResponse>(API_OBJECT_TEMPLATE_BY_SLUG_ENDPOINT(slug));
  },

  // Generate template preview with AI
  generateTemplate: async (payload: GenerateTemplatePayload): Promise<GenerateTemplateResponse> => {
    return await $api.post<GenerateTemplateResponse>(API_TEMPLATE_GENERATE_ENDPOINT, payload);
  },

  // Save template and get slug
  saveTemplate: async (payload: SaveTemplatePayload): Promise<SaveTemplateResponse> => {
    return await $api.post<SaveTemplateResponse>(API_TEMPLATE_SAVE_ENDPOINT, payload);
  },
};
