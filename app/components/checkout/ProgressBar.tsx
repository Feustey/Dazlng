"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep = 1 }) => {
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-width duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
