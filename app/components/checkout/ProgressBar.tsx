"use client";

import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { useTranslations } from "next-intl";

export default function ProgressBar() {
  const pathname = usePathname();
  const t = useTranslations("Checkout");

  const steps = [
    { id: "account", label: t("Account.title"), path: "/checkout/account" },
    { id: "delivery", label: t("Delivery.title"), path: "/checkout/delivery" },
    { id: "payment", label: t("Payment.title"), path: "/checkout/payment" },
    {
      id: "confirmation",
      label: t("Confirmation.title"),
      path: "/checkout/confirmation",
    },
  ];

  const currentStepIndex = steps.findIndex((step) =>
    pathname ? pathname.includes(step.id) : false
  );

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <nav aria-label="Progress" className="py-8">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                "relative flex-1",
                index !== steps.length - 1 && "pr-8 sm:pr-20"
              )}
            >
              <div className="flex flex-col items-center group">
                <div className="flex items-center w-full">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200",
                      index <= currentStepIndex
                        ? "bg-gradient-to-r from-primary to-primary-accent shadow-lg shadow-primary/20 scale-110"
                        : "bg-muted border-2 border-muted-foreground/20",
                      index === currentStepIndex && "animate-pulse"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold",
                        index <= currentStepIndex
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 transition-all duration-200",
                        index < currentStepIndex
                          ? "bg-gradient-to-r from-primary to-primary-accent"
                          : "bg-muted"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-4 text-sm font-medium transition-all duration-200",
                    index <= currentStepIndex
                      ? "text-foreground"
                      : "text-muted-foreground",
                    index === currentStepIndex && "scale-110"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
