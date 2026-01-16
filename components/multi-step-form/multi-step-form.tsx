"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconArrowLeft } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { steperService } from "@/lib/services/SteperService";
import { handleLogout } from "@/lib/services/AuthLocalService";
import { OK } from "@/lib/services/statusCodes";
import { PricingPlan, TimePeriod, TIME_PERIOD_LABELS } from "@/lib/types/pricing";
import { PRICING_KEY, pricingService } from "@/lib/services/PricingService";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { AnimatedPrice } from "@/components/ui/animated-price";
import { cn } from "@/lib/utils";

interface FormData {
  // Required fields
  workspace_name: string;
  subdomain: string;
  pricing_plan_slug: string;
  pricing_plan_period: TimePeriod;

  // Optional fields
  invitation_emails?: string[];
}

interface MultiStepFormProps {
  selectedPlan?: string;
  period?: TimePeriod;
}

export function MultiStepForm({ selectedPlan, period }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch pricing plans from API
  const { data: pricingData, isLoading: isPricingLoading } = useQuery({
    queryKey: [PRICING_KEY],
    queryFn: pricingService.getPricingPlans,
  });

  const plans = pricingData?.data || [];

  const [formData, setFormData] = useState<FormData>({
    workspace_name: "",
    subdomain: "",
    pricing_plan_slug: selectedPlan || "",
    pricing_plan_period: period || "sixMonths",
    invitation_emails: [],
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // On step 2 (last step), submit the form
      handleSubmit();
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
        // Step 1: Workspace Setup
        if (!formData.workspace_name) {
          toast.error("Please enter a workspace name");
          return false;
        }
        if (!formData.subdomain) {
          toast.error("Please enter a subdomain");
          return false;
        }
        if (!/^[a-zA-Z0-9-]+$/.test(formData.subdomain)) {
          toast.error("Subdomain can only contain letters, numbers, and hyphens");
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
      const payload = {
        pricing_plan_slug: formData.pricing_plan_slug,
        pricing_plan_period: formData.pricing_plan_period,
        workspace_name: formData.workspace_name,
        subdomain: formData.subdomain,
        invitation_emails: formData.invitation_emails,
      };

      const response = await steperService(payload) as any;

      if (response.status === OK) {
        toast.success("Workspace created successfully!");
        handleLogout();
        window.open(`https://${formData.subdomain}.corteksa.net`, "_blank");
        router.push("/login");
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
    switch (currentStep) {
      case 1:
        return <Step1WorkspaceSetup formData={formData} updateFormData={updateFormData} />;
      case 2:
        return (
          <Step2PricingSelection
            formData={formData}
            updateFormData={updateFormData}
            plans={plans}
            isLoading={isPricingLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Content - NO PROGRESS BAR */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Clean & Simple */}
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
          {currentStep === 2 ? (isLoading ? "Creating workspace..." : "Complete Setup") : "Continue"}
        </Button>
      </div>
    </div>
  );
}

// Step 1: Workspace Setup
function Step1WorkspaceSetup({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}) {
  // Auto-generate subdomain from workspace name
  useEffect(() => {
    if (formData.workspace_name) {
      const subdomain = formData.workspace_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim()
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

      // If subdomain is empty after sanitization, use a default
      updateFormData({ subdomain: subdomain || 'workspace' });
    }
  }, [formData.workspace_name]);

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

        {/* Subdomain Preview */}
        {formData.workspace_name && (
          <p className="text-xs text-muted-foreground mt-4">
            Your workspace URL: <span className="text-primary font-medium">{formData.subdomain || "your-subdomain"}</span>.corteksa.com
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

      {/* Pricing Cards - Compact Selection Design */}
      <div>
        <Label className="text-base font-medium block mb-3">Select Plan *</Label>
        <div className="space-y-3">
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

// Compact Pricing Card for Form Selection
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
        "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{plan.name}</h3>
            {plan.isPopular && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Popular
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
        </div>
      </div>
      <div className="text-right">
        {price === null || price === undefined ? (
          <p className="text-lg font-bold text-primary">Custom</p>
        ) : price === 0 ? (
          <p className="text-lg font-bold text-primary">$0</p>
        ) : (
          <div className="flex items-baseline gap-1">
            <AnimatedPrice
              value={price}
              className="text-lg font-bold text-primary"
            />
            <span className="text-xs text-muted-foreground">/{periodLabel}</span>
          </div>
        )}
      </div>
    </button>
  );
}
