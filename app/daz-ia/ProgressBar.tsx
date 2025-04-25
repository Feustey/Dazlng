"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@lib/utils";

interface ProgressBarProps {
  currentStep?: number;
}

export default function DazIAProgressBar({
  currentStep: propCurrentStep,
}: ProgressBarProps) {
  const pathname = usePathname();
  const t = useTranslations("daz-ia-checkout");

  const steps = [
    { id: "plan", path: "/daz-ia/checkout/plan", label: t("steps.plan") },
    {
      id: "delivery",
      path: "/daz-ia/checkout/delivery",
      label: t("steps.delivery"),
    },
    {
      id: "payment",
      path: "/daz-ia/checkout/payment",
      label: t("steps.payment"),
    },
    {
      id: "confirmation",
      path: "/daz-ia/checkout/confirmation",
      label: t("steps.confirmation"),
    },
  ];

  const getCurrentStepFromPath = () => {
    const currentStep = steps.findIndex(
      (step) => pathname?.includes(step.path) ?? false
    );
    return currentStep >= 0 ? currentStep : 0;
  };

  // Si une étape est fournie via les props, l'utiliser, sinon calculer à partir du chemin
  const currentStep =
    propCurrentStep !== undefined
      ? propCurrentStep - 1
      : getCurrentStepFromPath();

  return (
    <div className="w-full">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-10"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                currentStep >= index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-sm">{step.label}</div>
          </div>
        ))}

        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary -z-0">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${currentStep * (100 / (steps.length - 1))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
