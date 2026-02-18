"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconTemplate, IconSparkles, IconPlayerSkipForward, IconX, IconPlus } from "@tabler/icons-react";
import { Loader2, Check, X, ExternalLink, Copy } from "lucide-react";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { checkSubdomainAvailability } from "@/lib/services/SubdomainService";
import { toast } from "sonner";
import { steperService } from "@/lib/services/SteperService";
import { handleLogout, saveWorkspaceSubdomain } from "@/lib/services/AuthLocalService";
import { OK } from "@/lib/services/statusCodes";
import { PricingPlan, TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PRICING_KEY, pricingService } from "@/lib/services/PricingService";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SetupMethodCard } from "./setup-method-card";
import { WorkspaceSetupMethod, WorkspaceCreationPayload } from "@/lib/types/workspace";
import { TEMPLATES_KEY, templateService } from "@/lib/services/TemplateService";
import { EmbeddedAIChat } from "./ai-chat/EmbeddedAIChat";

interface FormData {
  // Required fields
  workspace_name: string;
  pricing_plan_slug: string;

  // Only for paid plans
  subdomain: string;
  pricing_plan_period: TimePeriod;

  // Template selection
  setup_method?: WorkspaceSetupMethod;
  template_slug?: string;
  sessionId?: string;  // Changed from conversation_id
  templateName?: string;  // For display after saving
}

export interface WorkspaceData {
  workspace_name: string;
  pricing_plan_slug: string;
  subdomain: string;
  pricing_plan_period: TimePeriod;
  template_slug?: string;
  isFreePlan: boolean;
}

interface MultiStepFormProps {
  selectedPlan?: string;
  period?: TimePeriod;
  onAIChatActiveChange?: (isAIChatActive: boolean) => void;
  onAIHasMessagesChange?: (hasMessages: boolean) => void;
  onWorkspaceDataReady?: (data: WorkspaceData) => void;
}

export function MultiStepForm({ selectedPlan, period, onAIChatActiveChange, onAIHasMessagesChange, onWorkspaceDataReady }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSubdomain, setCreatedSubdomain] = useState("");
  const [hasAIMessages, setHasAIMessages] = useState(false);
  const router = useRouter();
  const t = useTranslations("multiStepForm");

  // Fetch pricing plans from API
  const { data: pricingData, isLoading: isPricingLoading } = useQuery({
    queryKey: [PRICING_KEY],
    queryFn: pricingService.getPricingPlans,
  });

  const plans = pricingData?.data || [];

  const [formData, setFormData] = useState<FormData>({
    workspace_name: "",
    pricing_plan_slug: selectedPlan || "",
    subdomain: "",
    pricing_plan_period: period || "sixMonths",
  });

  // Check if selected plan is free (price = 0)
  const selectedPlanData = useMemo(() => {
    return plans.find((p) => p.slug === formData.pricing_plan_slug);
  }, [plans, formData.pricing_plan_slug]);

  const isFreePlan = useMemo(() => {
    if (!selectedPlanData) return false;
    const price = selectedPlanData.timePeriodPricing[formData.pricing_plan_period];
    return price === 0;
  }, [selectedPlanData, formData.pricing_plan_period]);

  // Total steps: 3 for free plan (name, plan, preferences), 4 for paid plan (name, plan, subdomain, preferences)
  const totalSteps = isFreePlan ? 3 : 4;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Notify parent when AI chat is active (welcome or chat state)
  useEffect(() => {
    const isOnAIStep = (currentStep === totalSteps) && formData.setup_method === "ai";
    onAIChatActiveChange?.(isOnAIStep);
  }, [currentStep, totalSteps, formData.setup_method, onAIChatActiveChange]);

  // Notify parent when AI messages exist (triggers 2-panel layout)
  useEffect(() => {
    onAIHasMessagesChange?.(hasAIMessages);
  }, [hasAIMessages, onAIHasMessagesChange]);

  // Lift workspace data to parent when template is saved
  useEffect(() => {
    if (formData.template_slug && onWorkspaceDataReady) {
      onWorkspaceDataReady({
        workspace_name: formData.workspace_name,
        pricing_plan_slug: formData.pricing_plan_slug,
        subdomain: formData.subdomain,
        pricing_plan_period: formData.pricing_plan_period,
        template_slug: formData.template_slug,
        isFreePlan,
      });
    }
  }, [formData.template_slug]);

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Determine if this is the last step
    const isLastStep = currentStep === totalSteps;

    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Step 1: Workspace Name
        if (!formData.workspace_name) {
          toast.error(t("enterWorkspaceName"));
          return false;
        }
        return true;

      case 2:
        // Step 2: Pricing Selection
        if (!formData.pricing_plan_slug) {
          toast.error(t("selectPricingPlan"));
          return false;
        }
        return true;

      case 3:
        // Step 3: Subdomain (only for paid plans)
        if (!formData.subdomain) {
          toast.error(t("enterSubdomain"));
          return false;
        }
        if (formData.subdomain.length < 3) {
          toast.error(t("subdomainMin3"));
          return false;
        }
        if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
          toast.error(t("subdomainOnlyLowercase"));
          return false;
        }
        return true;

      default:
        // Step 4 (or 3 for free): Setup Preferences
        const setupStep = isFreePlan ? 3 : 4;
        if (currentStep === setupStep) {
          // Validate template selection
          if (formData.setup_method === "template" && !formData.template_slug) {
            toast.error(t("selectTemplate"));
            return false;
          }

          // Validate AI chat - template must be saved
          if (formData.setup_method === "ai" && !formData.template_slug) {
            toast.error(t("saveTemplateFirst"));
            return false;
          }

          return true;
        }

        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);

    try {
      // Build base payload
      const payload: WorkspaceCreationPayload = {
        workspace_name: formData.workspace_name,
        pricing_plan_slug: formData.pricing_plan_slug,
      };

      // Add paid plan fields
      if (!isFreePlan) {
        payload.subdomain = formData.subdomain;
        payload.pricing_period = formData.pricing_plan_period;
      }

      // Add template slug if selected
      if (formData.template_slug) {
        payload.template_slug = formData.template_slug;
      }

      const response = await steperService(payload) as any;

      if (response.status === OK || response.status === 201) {
        toast.success(t("workspaceCreated"));

        if (isFreePlan) {
          // Free plan: redirect to login directly
          handleLogout();
          router.push("/login");
        } else {
          // Paid plan: save subdomain and show success screen
          const subdomain = response.data?.subdomain || formData.subdomain;
          saveWorkspaceSubdomain(subdomain);
          setCreatedSubdomain(subdomain);
          setIsSuccess(true);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error(t("subdomainTaken"));
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || t("validationError"));
      } else {
        toast.error(t("createFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    // Show success screen after workspace creation
    if (isSuccess) {
      return <SuccessScreen subdomain={createdSubdomain} />;
    }

    // For free plan: steps are 1, 2, 3 (name, plan, preferences)
    // For paid plan: steps are 1, 2, 3, 4 (name, plan, subdomain, preferences)

    switch (currentStep) {
      case 1:
        return <Step1WorkspaceName formData={formData} updateFormData={updateFormData} />;
      case 2:
        return (
          <Step2PricingSelection
            formData={formData}
            updateFormData={updateFormData}
            plans={plans}
            isLoading={isPricingLoading}
          />
        );
      case 3:
        if (!isFreePlan) {
          // Paid plan: show subdomain step
          return <Step3Subdomain formData={formData} updateFormData={updateFormData} />;
        } else {
          // Free plan: show setup preferences step
          return (
            <StepSetupPreferences
              formData={formData}
              updateFormData={updateFormData}
              onMessagesChange={setHasAIMessages}
            />
          );
        }
      case 4:
        // Paid plan only: setup preferences step
        return (
          <StepSetupPreferences
            formData={formData}
            updateFormData={updateFormData}
            onMessagesChange={setHasAIMessages}
          />
        );
      default:
        return null;
    }
  };

  // Button text logic
  const getButtonText = () => {
    if (isLoading) return t("creatingWorkspace");
    if (currentStep === totalSteps) return t("completeSetup");
    return t("continue");
  };

  // Check if we're on AI step (for conditional width)
  const isAIStep = (currentStep === totalSteps) && formData.setup_method === "ai";

  return (
    <div className={isAIStep ? "h-full flex flex-col" : "space-y-8"}>
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSuccess ? "success" : currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={isAIStep ? "mx-auto w-full h-full" : "mx-auto w-full max-w-lg"}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - hide on success and AI step */}
      {!isSuccess && !isAIStep && (
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
              <IconArrowLeft className="size-4 me-2" />
              {t("back")}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleNext}
            className={currentStep === 1 ? "w-full" : "flex-1"}
            disabled={isLoading}
          >
            {getButtonText()}
          </Button>
        </div>
      )}
    </div>
  );
}

// Step 1: Workspace Name
function Step1WorkspaceName({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}) {
  const t = useTranslations("multiStepForm");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          {t("step1Title")}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("step1Subtitle")}
        </p>
      </div>

      {/* Workspace Name */}
      <div>
        <Label htmlFor="workspace-name" className="text-base font-medium block mb-3">{t("workspaceName")} *</Label>
        <Input
          id="workspace-name"
          placeholder={t("workspaceNamePlaceholder")}
          value={formData.workspace_name}
          onChange={(e) => updateFormData({ workspace_name: e.target.value })}
        />
      </div>
    </div>
  );
}

// Step 3: Subdomain (only for paid plans)
function Step3Subdomain({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}) {
  const t = useTranslations("multiStepForm");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Auto-generate subdomain from workspace name on mount
  useEffect(() => {
    if (formData.workspace_name && !formData.subdomain) {
      const subdomain = formData.workspace_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      updateFormData({ subdomain: subdomain || 'workspace' });
    }
  }, []);

  // Debounced availability check
  useEffect(() => {
    // Reset state if empty or too short
    if (!formData.subdomain || formData.subdomain.length < 3) {
      setIsAvailable(null);
      setStatusMessage("");
      return;
    }

    // Validate format first
    if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
      setIsAvailable(false);
      setStatusMessage(t("onlyLowercaseAllowed"));
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setStatusMessage("");
      try {
        const response = await checkSubdomainAvailability(formData.subdomain);
        setIsAvailable(response.data.available);
        setStatusMessage(response.data.available ? t("available") : t("alreadyTaken"));
      } catch {
        setStatusMessage(t("couldNotCheck"));
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.subdomain, t]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          {t("step3Title")}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("step3Subtitle")}
        </p>
      </div>

      {/* Subdomain Input - Always LTR for domain input */}
      <div>
        <Label htmlFor="subdomain" className="text-base font-medium block mb-3">{t("subdomain")} *</Label>
        <div className="relative flex items-center" dir="ltr">
          <Input
            id="subdomain"
            placeholder={t("subdomainPlaceholder")}
            value={formData.subdomain}
            onChange={(e) => updateFormData({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            className="pe-28"
            dir="ltr"
          />
          <span className="absolute end-3 text-muted-foreground text-sm pointer-events-none">.corteksa.net</span>
        </div>

        {/* Availability Status */}
        {formData.subdomain && formData.subdomain.length >= 3 && (
          <div className="flex items-center gap-2 mt-3">
            {isChecking ? (
              <>
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("checkingAvailability")}</span>
              </>
            ) : isAvailable === true ? (
              <>
                <Check className="size-4 text-green-500" />
                <span className="text-sm text-green-500">{statusMessage}</span>
              </>
            ) : isAvailable === false ? (
              <>
                <X className="size-4 text-destructive" />
                <span className="text-sm text-destructive">{statusMessage}</span>
              </>
            ) : null}
          </div>
        )}

        {/* Helper text */}
        {(!formData.subdomain || formData.subdomain.length < 3) && (
          <p className="text-xs text-muted-foreground mt-2">
            {t("subdomainMinChars")}
          </p>
        )}
      </div>
    </div>
  );
}

// Step 4 (or Step 3 for free): Setup Preferences
function StepSetupPreferences({
  formData,
  updateFormData,
  onMessagesChange,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onMessagesChange?: (hasMessages: boolean) => void;
}) {
  const t = useTranslations("multiStepForm");

  // Fetch templates when user selects template method
  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: [TEMPLATES_KEY],
    queryFn: templateService.getTemplates,
    enabled: formData.setup_method === "template",
  });

  const templates = templatesData?.data || [];

  // Show embedded AI chat if AI method selected
  if (formData.setup_method === "ai") {
    return (
      <div className="h-full flex flex-col">
        <EmbeddedAIChat
          formData={formData}
          updateFormData={updateFormData}
          onMessagesChange={onMessagesChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          {t("setupTitle")}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("setupSubtitle")}
        </p>
      </div>

      {/* Setup Method Selection */}
      <div>
        <Label className="text-base font-medium block mb-3">{t("setupMethod")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SetupMethodCard
            method="template"
            icon={IconTemplate}
            title={t("templateOption")}
            description={t("templateDesc")}
            isSelected={formData.setup_method === "template"}
            onSelect={() => updateFormData({
              setup_method: "template",
              template_slug: undefined
            })}
          />
          <SetupMethodCard
            method="ai"
            icon={IconSparkles}
            title={t("aiOption")}
            description={t("aiDesc")}
            isSelected={formData.setup_method as string === "ai"}
            onSelect={() => {
              updateFormData({
                setup_method: "ai",
                template_slug: undefined
              });
            }}
          />
          <SetupMethodCard
            method="skip"
            icon={IconPlayerSkipForward}
            title={t("skipOption")}
            description={t("skipDesc")}
            isSelected={formData.setup_method === "skip"}
            onSelect={() => updateFormData({
              setup_method: "skip",
              template_slug: undefined
            })}
          />
        </div>
      </div>

      {/* Template Selection - Only show if template method selected */}
      {formData.setup_method === "template" && (
        <div>
          <Label className="text-base font-medium block mb-3">{t("chooseTemplate")} *</Label>
          {isLoadingTemplates ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.slug}
                  type="button"
                  onClick={() => updateFormData({ template_slug: template.slug })}
                  className={cn(
                    "p-4 rounded-lg text-start transition-all",
                    "bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800",
                    "border-2 border-transparent",
                    formData.template_slug === template.slug && "border-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{template.icon || "📋"}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      )}
                      {template.category && (
                        <span className="text-[10px] text-primary font-medium uppercase mt-1 inline-block">
                          {template.category}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Template Indicator - Show when non-AI method but template exists */}
      {(formData.setup_method as string) !== "ai" && formData.template_slug && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3"
        >
          <Check className="size-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {t("templateSaved")}
            </p>
            <button
              onClick={() => updateFormData({ setup_method: "ai" })}
              className="text-xs text-primary hover:underline"
            >
              {t("viewOrEdit")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}


// Step 2: Pricing Selection
function Step2PricingSelection({
  formData,
  updateFormData,
  plans,
  isLoading,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  plans: PricingPlan[];
  isLoading: boolean;
}) {
  const t = useTranslations("multiStepForm");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(
    formData.pricing_plan_period
  );

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedTimePeriod(period);
    updateFormData({ pricing_plan_period: period });
  };

  const handlePlanSelect = (slug: string) => {
    updateFormData({
      pricing_plan_slug: slug,
      pricing_plan_period: selectedTimePeriod,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
            {t("step2Title")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("step2Subtitle")}
          </p>
        </div>
        <div className="flex justify-center py-12">
          <Loader2 className="size-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          {t("step2Title")}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("step2Subtitle")}
        </p>
      </div>

      {/* Period Tabs */}
      <PeriodTabs
        selectedTimePeriod={selectedTimePeriod}
        setSelectedTimePeriod={handlePeriodChange}
        className="mb-6"
      />

      {/* Pricing Cards - Professional Grid Layout */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <PricingCardCompact
              key={plan.slug}
              plan={plan}
              selectedTimePeriod={selectedTimePeriod}
              isSelected={formData.pricing_plan_slug === plan.slug}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Clean Pricing Card Design
interface PricingCardCompactProps {
  plan: PricingPlan;
  selectedTimePeriod: TimePeriod;
  isSelected: boolean;
  onSelect: (slug: string) => void;
}

function PricingCardCompact({
  plan,
  selectedTimePeriod,
  isSelected,
  onSelect,
}: PricingCardCompactProps) {
  const t = useTranslations("multiStepForm");
  const price = plan.timePeriodPricing[selectedTimePeriod];
  const periodLabel = TIME_PERIOD_LABELS[selectedTimePeriod];

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.slug)}
      className={cn(
        "w-full p-6 rounded-2xl text-center transition-all duration-200 relative",
        "bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800",
        isSelected && "ring-2 ring-primary/50 shadow-[0_4px_20px_rgba(124,58,237,0.15)]"
      )}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 text-[10px] px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold uppercase tracking-wide">
          {t("popular")}
        </span>
      )}

      {/* Plan Name */}
      <h3 className={cn(
        "font-bold text-lg mb-3",
        isSelected ? "text-primary" : "text-foreground"
      )}>
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mb-3">
        {price === null || price === undefined ? (
          <span className={cn(
            "text-3xl font-bold",
            isSelected ? "text-primary" : "text-foreground"
          )}>{t("custom")}</span>
        ) : (
          <div className="flex items-baseline justify-center gap-1" dir="ltr">
            <span className={cn(
              "text-3xl font-bold",
              isSelected ? "text-primary" : "text-foreground"
            )}>${price}</span>
            <span className="text-sm text-muted-foreground">/{periodLabel}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {plan.description}
      </p>
    </button>
  );
}

// Success Screen Component
function SuccessScreen({ subdomain }: { subdomain: string }) {
  const t = useTranslations("multiStepForm");
  const workspaceUrl = `https://${subdomain}.corteksa.net`;
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleCopy = () => {
    navigator.clipboard.writeText(workspaceUrl);
    setCopied(true);
    toast.success(t("copiedToClipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      window.open(workspaceUrl, "_blank");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, workspaceUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mx-auto mb-8 size-16 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <Check className="size-8 text-primary" strokeWidth={2.5} />
      </motion.div>

      {/* Heading */}
      <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl">
        {t("successTitle")}
      </Heading>

      <Subheading className="mt-4 mx-auto">
        {t("successSubtitle")}
      </Subheading>

      {/* URL Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-5 rounded-lg bg-neutral-50 dark:bg-neutral-800"
      >
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider font-medium">
          {t("yourWorkspaceUrl")}
        </p>
        <div className="flex items-center justify-center gap-3" dir="ltr">
          <code className="text-sm md:text-base font-mono text-primary">
            {workspaceUrl}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 size-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            {copied ? (
              <Check className="size-4 text-green-500" />
            ) : (
              <Copy className="size-4 text-neutral-500" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button
          onClick={() => window.open(workspaceUrl, "_blank")}
          className="shadow-brand"
        >
          {t("goToWorkspace")} ({countdown}s)
          <ExternalLink className="size-4 ms-2" />
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
        >
          {t("backToHome")}
        </Button>
      </motion.div>

      {/* Auto redirect notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-sm text-neutral-500 dark:text-neutral-400"
      >
        {t("redirectingIn", { seconds: countdown })}
      </motion.p>
    </motion.div>
  );
}
