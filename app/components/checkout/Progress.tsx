import React from "react";

export type Step = {
  id: number;
  name: string;
};

export interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
}

export function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step.id <= currentStep 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step.id}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            step.id <= currentStep ? 'text-indigo-600' : 'text-gray-500'
          }`}>
            {step.name}
          </span>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              step.id < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";