"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconArrowLeft, IconTemplate, IconSparkles, IconFlameFilled } from "@tabler/icons-react";
import { Loader2, Check, X, ExternalLink, Copy } from "lucide-react";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { checkSubdomainAvailability } from "@/lib/services/SubdomainService";
import { sileo } from "sileo";
import { steperService } from "@/lib/services/SteperService";
import { handleLogout, saveWorkspaceSubdomain, getToken, getRefreshToken, buildSSORedirectUrl } from "@/lib/services/AuthLocalService";
import { OK } from "@/lib/services/statusCodes";
import { TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { AnimatedPrice } from "@/components/ui/animated-price";
import * as PricingCardUI from "@/components/pricing-card";
import { STATIC_PLANS, type StaticPlan } from "@/components/pricing/pricing-data";
import { cn } from "@/lib/utils";
import { SetupMethodCard } from "./setup-method-card";
import { WorkspaceSetupMethod, WorkspaceCreationPayload } from "@/lib/types/workspace";
import { TEMPLATES_KEY, templateService } from "@/lib/services/TemplateService";
import { EmbeddedAIChat } from "./ai-chat/EmbeddedAIChat";
import { TemplateBrowserPanel } from "./TemplateBrowserPanel";

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
  onRequestTemplatePreview?: (slug: string | null) => void;
  onTemplateBrowserChange?: (active: boolean) => void;
  externalTemplateSlug?: string;
  templatePreviewSlug?: string;
}

export function MultiStepForm({ selectedPlan, period, onAIChatActiveChange, onAIHasMessagesChange, onWorkspaceDataReady, onRequestTemplatePreview, onTemplateBrowserChange, externalTemplateSlug, templatePreviewSlug }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSubdomain, setCreatedSubdomain] = useState("");
  const [hasAIMessages, setHasAIMessages] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const router = useRouter();
  const t = useTranslations("multiStepForm");

  const plans = STATIC_PLANS;

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
    const price = selectedPlanData.pricing[formData.pricing_plan_period];
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

  // Notify parent when template browser is active
  useEffect(() => {
    const active = (currentStep === totalSteps) && formData.setup_method === "template";
    onTemplateBrowserChange?.(active);
  }, [currentStep, totalSteps, formData.setup_method, onTemplateBrowserChange]);

  // Notify parent when AI messages exist (triggers 2-panel layout)
  useEffect(() => {
    onAIHasMessagesChange?.(hasAIMessages);
  }, [hasAIMessages, onAIHasMessagesChange]);

  // Sync external template slug confirmed by parent (e.g. "Use Template" clicked in preview panel)
  useEffect(() => {
    if (externalTemplateSlug !== undefined) {
      updateFormData({ template_slug: externalTemplateSlug });
    }
  }, [externalTemplateSlug]);

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

  const handleStartFresh = () => {
    if (!isLoading) handleSubmit(true);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Step 1: Workspace Name
        if (!formData.workspace_name) {
          sileo.error({ title: t("enterWorkspaceName"), description: t("enterWorkspaceNameDesc") });
          return false;
        }
        return true;

      case 2:
        // Step 2: Pricing Selection
        if (!formData.pricing_plan_slug) {
          sileo.error({ title: t("selectPricingPlan"), description: t("selectPricingPlanDesc") });
          return false;
        }
        return true;

      case 3:
        // Step 3: Subdomain (only for paid plans)
        if (!formData.subdomain) {
          sileo.error({ title: t("enterSubdomain"), description: t("enterSubdomainDesc") });
          return false;
        }
        if (formData.subdomain.length < 3) {
          sileo.error({ title: t("subdomainMin3"), description: t("subdomainMin3Desc") });
          return false;
        }
        if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
          sileo.error({ title: t("subdomainOnlyLowercase"), description: t("subdomainOnlyLowercaseDesc") });
          return false;
        }
        if (isCheckingSubdomain) {
          sileo.error({ title: t("checkingAvailability"), description: t("waitForSubdomainCheck") });
          return false;
        }
        if (isSubdomainAvailable === false) {
          sileo.error({ title: t("subdomainTaken"), description: t("subdomainTakenDesc") });
          return false;
        }
        return true;

      default:
        // Step 4 (or 3 for free): Setup Preferences
        const setupStep = isFreePlan ? 3 : 4;
        if (currentStep === setupStep) {
          // Validate template selection
          if (formData.setup_method === "template" && !formData.template_slug) {
            sileo.error({ title: t("selectTemplate"), description: t("selectTemplateDesc") });
            return false;
          }

          // Validate AI chat - template must be saved
          if (formData.setup_method === "ai" && !formData.template_slug) {
            sileo.error({ title: t("saveTemplateFirst"), description: t("saveTemplateFirstDesc") });
            return false;
          }

          return true;
        }

        return true;
    }
  };

  const handleSubmit = async (skipTemplate?: boolean) => {
    if (!skipTemplate && !validateCurrentStep()) {
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

      // Add template slug if selected (not when skipping)
      if (!skipTemplate && formData.template_slug) {
        payload.template_slug = formData.template_slug;
      }

      const response = await steperService(payload) as any;

      if (response.status === OK || response.status === 201) {
        sileo.success({ title: t("workspaceCreated"), description: t("workspaceCreatedDesc") });

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
        sileo.error({ title: t("subdomainTaken"), description: t("subdomainTakenDesc") });
      } else if (error.response?.status === 400) {
        sileo.error({ title: t("validationError"), description: t("validationErrorDesc") });
      } else {
        sileo.error({ title: t("createFailed"), description: t("createFailedDesc") });
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
          />
        );
      case 3:
        if (!isFreePlan) {
          // Paid plan: show subdomain step
          return <Step3Subdomain formData={formData} updateFormData={updateFormData} onAvailabilityChange={setIsSubdomainAvailable} onCheckingChange={setIsCheckingSubdomain} />;
        } else {
          // Free plan: show setup preferences step
          return (
            <StepSetupPreferences
              formData={formData}
              updateFormData={updateFormData}
              onMessagesChange={setHasAIMessages}
              onRequestTemplatePreview={onRequestTemplatePreview}
              templatePreviewSlug={templatePreviewSlug}
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
            onRequestTemplatePreview={onRequestTemplatePreview}
            templatePreviewSlug={templatePreviewSlug}
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
  const isTemplateBrowserStep = (currentStep === totalSteps) && formData.setup_method === "template";

  // Step title/subtitle mapping
  const getStepHeader = () => {
    if (isSuccess) return null;
    const setupStep = isFreePlan ? 3 : 4;
    switch (currentStep) {
      case 1: return { title: t("step1Title"), subtitle: t("step1Subtitle") };
      case 2: return { title: t("step2Title"), subtitle: t("step2Subtitle") };
      case 3:
        if (!isFreePlan) return { title: t("step3Title"), subtitle: t("step3Subtitle") };
        return { title: t("setupTitle"), subtitle: t("setupSubtitle") };
      case setupStep: return { title: t("setupTitle"), subtitle: t("setupSubtitle") };
      default: return null;
    }
  };

  const stepHeader = getStepHeader();

  return (
    <div className={isAIStep || isTemplateBrowserStep ? "h-full flex flex-col" : "space-y-8"}>
      {/* Centered Step Title */}
      {stepHeader && !isAIStep && !isTemplateBrowserStep && (
        <div className="text-center">
          <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
            {stepHeader.title}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {stepHeader.subtitle}
          </p>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSuccess ? "success" : currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "mx-auto w-full",
            isAIStep ? "h-full" : isTemplateBrowserStep ? "flex-1 min-h-0" : currentStep === 2 ? "max-w-xl" : "max-w-lg"
          )}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - hide on success and AI step */}
      {!isSuccess && !isAIStep && !isTemplateBrowserStep && (
        <div className={cn("flex flex-col gap-2 mx-auto w-full", currentStep === 2 ? "max-w-xl" : "max-w-lg")}>
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
              disabled={isLoading || (currentStep === 3 && !isFreePlan && (isCheckingSubdomain || isSubdomainAvailable === false))}
            >
              {getButtonText()}
            </Button>
          </div>
          {currentStep === totalSteps && (
            <button
              type="button"
              onClick={handleStartFresh}
              disabled={isLoading}
              className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
            >
              {t("skipOption")} — {t("skipDesc")}
            </button>
          )}
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
  onAvailabilityChange,
  onCheckingChange,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onAvailabilityChange: (available: boolean | null) => void;
  onCheckingChange: (checking: boolean) => void;
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
      onAvailabilityChange(null);
      setStatusMessage("");
      return;
    }

    // Validate format first
    if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
      setIsAvailable(false);
      onAvailabilityChange(false);
      setStatusMessage(t("onlyLowercaseAllowed"));
      return;
    }

    // Debounce the API call
    setIsChecking(true);
    onCheckingChange(true);
    const timeoutId = setTimeout(async () => {
      setStatusMessage("");
      try {
        const response = await checkSubdomainAvailability(formData.subdomain);
        setIsAvailable(response.data.available);
        onAvailabilityChange(response.data.available);
        setStatusMessage(response.data.available ? t("available") : t("alreadyTaken"));
      } catch {
        setStatusMessage(t("couldNotCheck"));
        setIsAvailable(null);
        onAvailabilityChange(null);
      } finally {
        setIsChecking(false);
        onCheckingChange(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsChecking(false);
      onCheckingChange(false);
    };
  }, [formData.subdomain, t]);

  return (
    <div className="space-y-8">
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
  onRequestTemplatePreview,
  templatePreviewSlug,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onMessagesChange?: (hasMessages: boolean) => void;
  onRequestTemplatePreview?: (slug: string | null) => void;
  templatePreviewSlug?: string;
}) {
  const t = useTranslations("multiStepForm");

  // Fetch templates when user selects template method
  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: [TEMPLATES_KEY],
    queryFn: templateService.getTemplates,
    enabled: formData.setup_method === "template",
  });

  const templates = templatesData?.data || [];

  const view = formData.setup_method === "ai"
    ? "ai"
    : formData.setup_method === "template"
      ? "template"
      : "selection";

  return (
    <AnimatePresence mode="popLayout">
      {view === "ai" ? (
        <motion.div
          key="ai"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full flex flex-col"
        >
          <EmbeddedAIChat
            formData={formData}
            updateFormData={updateFormData}
            onMessagesChange={onMessagesChange}
          />
        </motion.div>
      ) : view === "template" ? (
        <motion.div
          key="template"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full"
        >
          <TemplateBrowserPanel
            templates={templates}
            isLoading={isLoadingTemplates}
            selectedSlug={formData.template_slug}
            previewingSlug={templatePreviewSlug}
            onPreview={(slug) => onRequestTemplatePreview?.(slug)}
            onBack={() => {
              updateFormData({ setup_method: undefined, template_slug: undefined });
              onRequestTemplatePreview?.(null);
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="selection"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="space-y-8">
            {/* Setup Method Selection */}
            <div className="grid grid-cols-2 gap-3">
              <SetupMethodCard
                method="ai"
                icon={IconSparkles}
                title={t("aiOption")}
                description={t("aiDesc")}
                isSelected={formData.setup_method as string === "ai"}
                badge={t("recommended")}
                onSelect={() => {
                  updateFormData({
                    setup_method: "ai",
                    template_slug: undefined
                  });
                }}
              />
              <SetupMethodCard
                method="template"
                icon={IconTemplate}
                title={t("templateOption")}
                description={t("templateDesc")}
                isSelected={(formData.setup_method as string) === "template"}
                onSelect={() => updateFormData({
                  setup_method: "template",
                  template_slug: undefined
                })}
              />
            </div>

            {/* Confirmed Template Indicator */}
            {formData.template_slug && !templatePreviewSlug && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3"
              >
                <Check className="size-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-foreground">
                  {t("templateSaved")}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// Step 2: Pricing Selection
function Step2PricingSelection({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
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

  return (
    <div className="space-y-6">
      {/* Period Tabs */}
      <div className="flex justify-center">
        <PeriodTabs
          selectedTimePeriod={selectedTimePeriod}
          setSelectedTimePeriod={handlePeriodChange}
          className="mb-0"
        />
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STATIC_PLANS.map((plan) => (
          <SelectablePricingCard
            key={plan.slug}
            plan={plan}
            selectedTimePeriod={selectedTimePeriod}
            isSelected={formData.pricing_plan_slug === plan.slug}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>
    </div>
  );
}

// Selectable Pricing Card - reuses PricingCardUI from pricing page
function SelectablePricingCard({
  plan,
  selectedTimePeriod,
  isSelected,
  onSelect,
}: {
  plan: StaticPlan;
  selectedTimePeriod: TimePeriod;
  isSelected: boolean;
  onSelect: (slug: string) => void;
}) {
  const t = useTranslations("multiStepForm");
  const price = plan.pricing[selectedTimePeriod];
  const periodLabel = TIME_PERIOD_LABELS[selectedTimePeriod];

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.slug)}
      className={cn(
        "text-start w-full rounded-xl p-3 transition-all duration-200 cursor-pointer",
        "bg-neutral-50 dark:bg-white/[0.04]",
        "border border-neutral-100 dark:border-white/[0.06]",
        isSelected
          ? "border-primary/40 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-[0_0_20px_-5px] shadow-primary/20"
          : "hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {plan.isPopular && <IconFlameFilled className="size-3.5 text-primary" />}
          {plan.name}
        </div>
        {plan.isPopular && (
          <span className="rounded-full border px-2 py-0.5 text-xs border-primary/30 text-primary bg-primary/10">
            {t("popular")}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1 mb-2">
        {price === null ? (
          <span className="text-2xl font-bold font-display tracking-tight">{t("custom")}</span>
        ) : (
          <>
            <AnimatedPrice
              value={price}
              className="text-2xl font-bold font-display tracking-tight"
            />
            <span className="text-foreground/80 pb-0.5 text-sm">/{periodLabel}</span>
          </>
        )}
      </div>

      <p className="text-muted-foreground text-xs">{plan.description}</p>
    </button>
  );
}

// Success Screen Component
function SuccessScreen({ subdomain }: { subdomain: string }) {
  const t = useTranslations("multiStepForm");
  const displayUrl = `https://${subdomain}.corteksa.net`;
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const goToWorkspace = () => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    if (token && refreshToken) {
      window.location.href = buildSSORedirectUrl(subdomain, token, refreshToken, false);
    } else {
      window.location.href = displayUrl;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    sileo.success({ title: t("copiedToClipboard"), description: t("copiedToClipboardDesc") });
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      goToWorkspace();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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
            {displayUrl}
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
          onClick={goToWorkspace}
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
