import { TimePeriod } from "@/lib/types/pricing";

export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// Type Definitions
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  pricePerUser: number;
  iconName: string;
  category: string;
}

export interface FeatureRow {
  name: string;
  free: boolean | string;
  unlimited: boolean | string;
  business: boolean | string;
  enterprise: boolean | string;
}

export interface FeatureCategory {
  name: string;
  features: FeatureRow[];
}

export interface StaticPlan {
  slug: string;
  name: string;
  description: string;
  isPopular: boolean;
  buttonVariant: "outline" | "contained";
  pricing: Record<TimePeriod, number | null>;
  features: string[];
}

// Feature Comparison Data
export const featureComparison: FeatureCategory[] = [
  {
    name: "Team & Permissions",
    features: [
      { name: "Recommended team size", free: "Individuals & small teams", unlimited: "Up to 5 members", business: "Up to 12 members", enterprise: "Large teams" },
      { name: "User roles", free: "1 admin + 3 members", unlimited: "Up to 3 custom roles", business: "Unlimited custom roles", enterprise: "Unlimited custom roles" },
      { name: "Member permissions", free: "Edit assigned only", unlimited: "Role-based", business: "Fully customizable", enterprise: "Fully customizable" },
      { name: "View-only users", free: "Unlimited", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    name: "Core Features",
    features: [
      { name: "Corteksa Units", free: "Up to 3", unlimited: "Up to 10", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Tasks", free: "Limited (TBD)", unlimited: "Limited (TBD)", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Custom fields", free: "15", unlimited: "35", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Comments & mentions", free: true, unlimited: true, business: true, enterprise: true },
    ],
  },
  {
    name: "AI & Documents",
    features: [
      { name: "WhatsApp / Corteksa Assistant", free: "100 tasks", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Document generation", free: "30 documents", unlimited: "Unlimited", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Document templates", free: "2 templates", unlimited: "5 templates", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Watermark on documents", free: "Yes", unlimited: "No", business: "No", enterprise: "No" },
    ],
  },
  {
    name: "Storage & Data",
    features: [
      { name: "Data storage", free: "100 MB", unlimited: "1 GB", business: "10 GB", enterprise: "Custom" },
      { name: "Data import & export", free: false, unlimited: true, business: true, enterprise: true },
      { name: "Marketplace access", free: false, unlimited: true, business: true, enterprise: true },
      { name: "API integrations", free: false, unlimited: false, business: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    name: "Advanced Features",
    features: [
      { name: "Audit logs", free: false, unlimited: false, business: true, enterprise: true },
      { name: "Daily backups", free: false, unlimited: false, business: false, enterprise: true },
      { name: "Smart dashboard", free: "—", unlimited: "—", business: "Coming soon", enterprise: "Coming soon" },
      { name: "White-labeling", free: false, unlimited: false, business: false, enterprise: true },
      { name: "System customization", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
  {
    name: "Security & Compliance",
    features: [
      { name: "Local data residency", free: false, unlimited: false, business: false, enterprise: true },
      { name: "SSO (SAML-based)", free: false, unlimited: false, business: false, enterprise: true },
      { name: "2FA enforcement", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
  {
    name: "Support & Training",
    features: [
      { name: "Support", free: "Email (48 hrs)", unlimited: "Email + AI chat (24 hrs)", business: "Chat (90 min SLA)", enterprise: "Chat (45 min SLA)" },
      { name: "Live onboarding & training", free: false, unlimited: false, business: false, enterprise: true },
    ],
  },
];

// Marketplace Items Data
export const marketplaceItems: MarketplaceItem[] = [
  {
    id: "analytics-pro",
    name: "Analytics Pro",
    description: "Advanced analytics and reporting dashboard with custom metrics",
    pricePerUser: 5,
    iconName: "chart-bar",
    category: "Analytics",
  },
  {
    id: "automation-engine",
    name: "Automation Engine",
    description: "Powerful workflow automation with AI-powered triggers",
    pricePerUser: 8,
    iconName: "robot",
    category: "Automation",
  },
  {
    id: "advanced-security",
    name: "Advanced Security",
    description: "Enterprise-grade security features and compliance tools",
    pricePerUser: 10,
    iconName: "shield",
    category: "Security",
  },
  {
    id: "crm-integration",
    name: "CRM Integration",
    description: "Seamless integration with leading CRM platforms",
    pricePerUser: 6,
    iconName: "users",
    category: "Integration",
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Intelligent AI assistant for task management and insights",
    pricePerUser: 12,
    iconName: "sparkles",
    category: "AI",
  },
  {
    id: "time-tracking",
    name: "Time Tracking",
    description: "Comprehensive time tracking with detailed reports",
    pricePerUser: 4,
    iconName: "clock",
    category: "Productivity",
  },
];

// Static Pricing Plans
export const STATIC_PLANS: StaticPlan[] = [
  {
    slug: "free",
    name: "Free Forever",
    description: "For individuals & small teams",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: 0, nineMonths: 0, twelveMonths: 0 },
    features: [
      "1 admin + 3 members",
      "Unlimited viewers",
      "Up to 3 Corteksa Units",
      "100 AI assistant tasks",
      "30 documents, 2 templates",
      "15 custom fields",
      "100 MB storage",
      "Email support (48h)",
    ],
  },
  {
    slug: "basic",
    name: "Basic",
    description: "For growing teams up to 5 members",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: 12, nineMonths: 10, twelveMonths: 8 },
    features: [
      "5 members, 3 custom roles",
      "Up to 10 Corteksa Units",
      "Unlimited AI & documents",
      "5 templates, no watermark",
      "35 custom fields",
      "1 GB storage",
      "Import & export",
      "Marketplace access",
    ],
  },
  {
    slug: "advanced",
    name: "Advanced",
    description: "For teams up to 12 members",
    isPopular: true,
    buttonVariant: "contained",
    pricing: { sixMonths: 29, nineMonths: 24, twelveMonths: 19 },
    features: [
      "Unlimited roles, units & tasks",
      "Unlimited docs & templates",
      "Full custom permissions",
      "API integrations & audit logs",
      "10 GB storage",
      "Marketplace access",
      "Audit logs included",
      "Chat support (90 min SLA)",
    ],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    isPopular: false,
    buttonVariant: "outline",
    pricing: { sixMonths: null, nineMonths: null, twelveMonths: null },
    features: [
      "Everything in Advanced",
      "White-label & customization",
      "SSO, 2FA & data residency",
      "Daily backups",
      "Onboarding & training",
      "Unlimited API access",
      "Smart dashboard (soon)",
      "Chat support (45 min SLA)",
    ],
  },
];

// Cost Calculator Data
export const COMPETITOR_APPS = [
  { id: "google-drive", name: "Google Drive", price: 13, icon: "/icons/Google Drive.svg" },
  { id: "slack", name: "Slack", price: 9, icon: "/icons/Slack.svg" },
  { id: "salesforce", name: "Salesforce", price: 25, icon: "/icons/Salesforce.svg" },
  { id: "teams", name: "Teams", price: 8, icon: "/icons/Teams.svg" },
  { id: "hubspot", name: "HubSpot", price: 20, icon: "/icons/HubSpot.svg" },
  { id: "chatgpt", name: "ChatGPT", price: 20, icon: "/icons/ChatGPT.svg" },
  { id: "asana", name: "Asana", price: 15, icon: "/icons/Asana.svg" },
  { id: "trello", name: "Trello", price: 11, icon: "/icons/Trello.svg" },
  { id: "monday", name: "Monday", price: 12, icon: "/icons/Monday.svg" },
  { id: "notion", name: "Notion", price: 12, icon: "/icons/Notion.svg" },
  { id: "loom", name: "Loom", price: 12, icon: "/icons/Loom.svg" },
  { id: "jira", name: "Jira", price: 12, icon: "/icons/Jira.svg" },
  { id: "smartsheet", name: "Smartsheet", price: 16, icon: "/icons/Smartsheet.svg" },
  { id: "airtable", name: "Airtable", price: 15, icon: "/icons/Airtable.svg" },
  { id: "linear", name: "Linear", price: 11, icon: "/icons/Linear.svg" },
  { id: "productboard", name: "ProductBoard", price: 20, icon: "/icons/ProductBoard.svg" },
  { id: "lattice", name: "Lattice", price: 15, icon: "/icons/Lattice.svg" },
  { id: "mural", name: "Mural", price: 13, icon: "/icons/Mural.svg" },
  { id: "clockify", name: "Clockify", price: 9, icon: "/icons/Clockify.svg" },
  { id: "hourstack", name: "HourStack", price: 13, icon: "/icons/HourStack.svg" },
  { id: "confluence", name: "Confluence", price: 9, icon: "/icons/Confluence.svg" },
  { id: "sharepoint", name: "SharePoint", price: 14, icon: "/icons/SharePoint.svg" },
  { id: "coda", name: "Coda", price: 15, icon: "/icons/Coda.svg" },
  { id: "miro", name: "Miro", price: 12, icon: "/icons/Miro.svg" },
];

export const DEFAULT_SELECTED = new Set(["slack", "asana", "notion", "jira", "google-drive", "confluence"]);
export const CORTEKSA_PRICE_PER_USER_MONTH = 12;

// FAQ keys
export const FAQ_KEYS = Array.from({ length: 11 }, (_, i) => i + 1);
