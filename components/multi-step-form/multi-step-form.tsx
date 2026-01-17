"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconArrowLeft } from "@tabler/icons-react";
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

interface FormData {
  // Required fields
  workspace_name: string;
  pricing_plan_slug: string;

  // Only for paid plans
  subdomain: string;
  pricing_plan_period: TimePeriod;
}

interface MultiStepFormProps {
  selectedPlan?: string;
  period?: TimePeriod;
}

export function MultiStepForm({ selectedPlan, period }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdSubdomain, setCreatedSubdomain] = useState("");
  const router = useRouter();

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

  // Total steps: 2 for free plan, 3 for paid plan
  const totalSteps = isFreePlan ? 2 : 3;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

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
          toast.error("Please enter a workspace name");
          return false;
        }
        return true;

      case 2:
        // Step 2: Pricing Selection
        if (!formData.pricing_plan_slug) {
          toast.error("Please select a pricing plan");
          return false;
        }
        return true;

      case 3:
        // Step 3: Subdomain (only for paid plans)
        if (!formData.subdomain) {
          toast.error("Please enter a subdomain");
          return false;
        }
        if (formData.subdomain.length < 3) {
          toast.error("Subdomain must be at least 3 characters");
          return false;
        }
        if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
          toast.error("Subdomain can only contain lowercase letters and numbers");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);

    try {
      // Build payload based on plan type
      let payload: Record<string, any>;

      if (isFreePlan) {
        // FREE Plan: Only workspace_name and pricing_plan_slug
        payload = {
          pricing_plan_slug: formData.pricing_plan_slug,
          workspace_name: formData.workspace_name,
        };
      } else {
        // PAID Plan: Include subdomain and pricing_period
        payload = {
          pricing_plan_slug: formData.pricing_plan_slug,
          workspace_name: formData.workspace_name,
          subdomain: formData.subdomain,
          pricing_period: formData.pricing_plan_period,
        };
      }

      const response = await steperService(payload) as any;

      if (response.status === OK || response.status === 201) {
        toast.success("Workspace created successfully!");

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
        toast.error("Subdomain already taken. Please choose another.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Validation error. Please check your inputs.");
      } else {
        toast.error("Failed to create workspace. Please try again.");
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
        return <Step3Subdomain formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Button text logic
  const getButtonText = () => {
    if (isLoading) return "Creating workspace...";
    if (currentStep === totalSteps) return "Complete Setup";
    return "Continue";
  };

  return (
    <div className="space-y-8">
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSuccess ? "success" : currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - hide on success */}
      {!isSuccess && (
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
              <IconArrowLeft className="size-4 mr-2" />
              Back
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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          Your workspace awaits
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Set up your team and start collaborating
        </p>
      </div>

      {/* Workspace Name */}
      <div>
        <Label htmlFor="workspace-name" className="text-base font-medium block mb-3">Workspace Name *</Label>
        <Input
          id="workspace-name"
          placeholder="My Awesome Company"
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
      setStatusMessage("Only lowercase letters and numbers allowed");
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setStatusMessage("");
      try {
        const response = await checkSubdomainAvailability(formData.subdomain);
        setIsAvailable(response.data.available);
        setStatusMessage(response.data.available ? "Available" : "Already taken");
      } catch {
        setStatusMessage("Could not check availability");
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.subdomain]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2 tracking-tight font-display font-bold">
          Choose your subdomain
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This will be your workspace URL
        </p>
      </div>

      {/* Subdomain Input */}
      <div>
        <Label htmlFor="subdomain" className="text-base font-medium block mb-3">Subdomain *</Label>
        <div className="relative flex items-center">
          <Input
            id="subdomain"
            placeholder="mycompany"
            value={formData.subdomain}
            onChange={(e) => updateFormData({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            className="pr-28"
          />
          <span className="absolute right-3 text-muted-foreground text-sm pointer-events-none">.corteksa.net</span>
        </div>

        {/* Availability Status */}
        {formData.subdomain && formData.subdomain.length >= 3 && (
          <div className="flex items-center gap-2 mt-3">
            {isChecking ? (
              <>
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Checking availability...</span>
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
            Only lowercase letters and numbers allowed (min 3 characters)
          </p>
        )}
      </div>
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
            Choose your plan
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Flexible pricing for teams of all sizes
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
          Choose your plan
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Flexible pricing for teams of all sizes
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
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold uppercase tracking-wide">
          Popular
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
          )}>Custom</span>
        ) : (
          <div className="flex items-baseline justify-center gap-1">
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
  const workspaceUrl = `https://${subdomain}.corteksa.net`;
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleCopy = () => {
    navigator.clipboard.writeText(workspaceUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
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
        You&apos;re all set!
      </Heading>

      <Subheading className="mt-4 mx-auto">
        Your workspace is ready. Start building something amazing.
      </Subheading>

      {/* URL Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-5 rounded-lg bg-neutral-50 dark:bg-neutral-800"
      >
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider font-medium">
          Your workspace URL
        </p>
        <div className="flex items-center justify-center gap-3">
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
          Go to Workspace ({countdown}s)
          <ExternalLink className="size-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
        >
          Back to Home
        </Button>
      </motion.div>

      {/* Auto redirect notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-sm text-neutral-500 dark:text-neutral-400"
      >
        Redirecting automatically in {countdown} seconds...
      </motion.p>
    </motion.div>
  );
}
