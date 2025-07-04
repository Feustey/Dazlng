"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', error = false, ...props }, ref) => {
    const baseClasses = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    const errorClasses = error ? "border-red-500" : "";
    const finalClasses = cn(baseClasses, errorClasses, className);
    
    return (
      <div className="relative">
        <input
          type={type}
          className={finalClasses}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs">Erreur</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };