"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "secondary" | "outline" | "ghost" | "default";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const buttonVariants = ({
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
      "bg-gradient-to-r from-primary to-primary-600 text-white hover:shadow-lg hover:scale-105 disabled:hover:scale-100",
    secondary:
      "bg-card/30 backdrop-blur-sm border border-accent/20 text-white hover:bg-card/50 hover:shadow-lg hover:scale-105 disabled:hover:scale-100",
    outline:
      "border-2 border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/10",
    ghost: "text-foreground hover:bg-accent/10",
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
    icon: "h-10 w-10 p-2",
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
    {
      className,
      variant,
      size,
      loading,
      children,
      fullWidth,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
