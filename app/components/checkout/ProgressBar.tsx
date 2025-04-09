"use client";

import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";

const steps = [
  { id: "delivery", label: "Livraison", path: "/checkout/delivery" },
  { id: "payment", label: "Paiement", path: "/checkout/payment" },
  { id: "confirmation", label: "Confirmation", path: "/checkout/confirmation" },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path)
  );

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "relative",
              index !== steps.length - 1 && "pr-8 sm:pr-20",
              index !== 0 && "pl-8 sm:pl-20"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  index <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 w-full h-0.5",
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  )}
                  style={{ right: "1rem" }}
                />
              )}
            </div>
            <span
              className={cn(
                "mt-2 block text-sm font-medium",
                index <= currentStepIndex
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
