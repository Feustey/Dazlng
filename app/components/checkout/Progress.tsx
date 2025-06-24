import React from "react";

export type Step = {
  id: number;
  name: string;
  );

export interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
}

export function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps): React.FC {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step: any, idx: any) => (
        <div key={step.id} className="flex items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold
            ${currentStep === step.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {step.id}
          </div>
          {idx < steps.length - 1 && <div className="w-8 h-1 bg-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );
}
