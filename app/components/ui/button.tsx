"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const buttonVariants = ({
  variant = "gradient",
  size = "md",
  fullWidth = false,
  className = "",
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  fullWidth?: boolean;
  className?: string;
} = {}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    gradient:
      "btn-gradient text-white hover:shadow-lg hover:scale-105 disabled:hover:scale-100",
    secondary:
      "btn-secondary text-white hover:shadow-lg hover:scale-105 disabled:hover:scale-100",
    outline:
      "border-2 border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/10",
    ghost: "text-foreground hover:bg-accent/10",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return cn(
    baseClasses,
    variant && variantClasses[variant],
    size && sizeClasses[size],
    widthClass,
    className
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, fullWidth, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
