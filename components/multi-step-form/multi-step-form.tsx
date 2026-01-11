"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast } from "sonner";
import { steperService } from "@/lib/services/SteperService";
import { handleLogout } from "@/lib/services/AuthLocalService";
import { OK } from "@/lib/services/statusCodes";

interface FormData {
  // Required fields
  workspace_name: string;
  subdomain: string;
  pricing_plan_slug: string;
  pricing_plan_period: "sixMonths" | "nineMonths" | "twelveMonths";

  // Optional fields
  invitation_emails?: string[];
}

// Pricing periods
const periods = [
  { value: "sixMonths" as const, label: "6 Months" },
  { value: "nineMonths" as const, label: "9 Months" },
  { value: "twelveMonths" as const, label: "12 Months" },
];

// Mock pricing plans
const pricingPlans = [
  {
    slug: "starter",
    name: "Starter",
    price: "$29/month",
    features: ["Up to 5 users", "Basic features", "Email support"],
  },
  {
    slug: "professional",
    name: "Professional",
    price: "$99/month",
    features: ["Up to 20 users", "Advanced features", "Priority support"],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    price: "$299/month",
    features: ["Unlimited users", "All features", "24/7 dedicated support"],
  },
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    workspace_name: "",
    subdomain: "",
    pricing_plan_slug: "",
    pricing_plan_period: "sixMonths",
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
        return <Step2PricingSelection formData={formData} updateFormData={updateFormData} />;
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
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}) {
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

      {/* Period Selection */}
      <div>
        <Label className="text-base font-medium block mb-3">Billing Period</Label>
        <Select
          value={formData.pricing_plan_period}
          onValueChange={(value) => updateFormData({ pricing_plan_period: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pricing Cards - Compact Design */}
      <div>
        <Label className="text-base font-medium block mb-3">Select Plan *</Label>
        <div className="space-y-3">
          {pricingPlans.map((plan) => (
            <button
              key={plan.slug}
              type="button"
              onClick={() => updateFormData({ pricing_plan_slug: plan.slug })}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                formData.pricing_plan_slug === plan.slug
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                    formData.pricing_plan_slug === plan.slug
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {formData.pricing_plan_slug === plan.slug && (
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.features.join(" • ")}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-primary">{plan.price}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

