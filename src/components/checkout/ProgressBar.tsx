"use client";

import { usePathname } from "next/navigation";

const steps = [
  { name: "Authentification", path: "/auth" },
  { name: "Livraison", path: "/checkout/delivery" },
  { name: "Paiement", path: "/checkout/payment" },
  { name: "Confirmation", path: "/checkout/confirmation" },
];

export default function ProgressBar() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.path} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div
                    className={`h-0.5 w-full ${isCompleted ? "bg-indigo-600" : "bg-gray-200"}`}
                  />
                </div>
                <div
                  className={`relative flex justify-center items-center w-8 h-8 rounded-full ${
                    isCompleted
                      ? "bg-indigo-600"
                      : isCurrent
                        ? "bg-indigo-600"
                        : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isCurrent ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
