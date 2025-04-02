import React, { ChangeEvent } from "react";
import { Input, InputProps } from "./input";
import { Label } from "./label";
import { cn } from "../../lib/utils";

export interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
        <Input
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
