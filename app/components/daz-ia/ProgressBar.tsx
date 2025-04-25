"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  name: string;
  path: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep?: string;
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const pathname = usePathname();

  // Si currentStep n'est pas spécifié, déterminer l'étape actuelle à partir du chemin
  const currentId =
    currentStep ||
    steps.find((step) => pathname.includes(step.path))?.id ||
    steps[0].id;

  // Trouver l'index de l'étape actuelle
  const currentStepIndex = steps.findIndex((step) => step.id === currentId);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Cercle de l'étape */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isActive && "border-primary bg-primary/10 text-primary",
                    isCompleted && "border-primary bg-primary text-white",
                    !isActive && !isCompleted && "border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs text-center",
                    isActive && "text-primary font-medium",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-gray-500"
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Ligne de connexion (sauf pour la dernière étape) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < currentStepIndex ? "bg-primary" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
